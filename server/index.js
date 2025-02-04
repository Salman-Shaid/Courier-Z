require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')

const port = process.env.PORT || 9000
const app = express()
// middleware
const corsOptions = {
  origin: ['https://assignment12-fe277.web.app', 'https://assignment12-fe277.firebaseapp.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.csovo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {

  try {
    const db = client.db('courierDB')
    const usersCollection = db.collection('users')
    const parcelCollection = db.collection('parcels')
    const reviewCollection = db.collection('reviews')
    const assignedParcelsCollection = db.collection('assign-parcel')
    // verify admin middleware
    const verifyAdmin = async (req, res, next) => {
      console.log('data from verifyToken middleware--->', req.user?.email)
      const email = req.user?.email
      const query = { email }
      const result = await usersCollection.findOne(query)
      if (!result || result?.role !== 'admin')
        return res
          .status(403)
          .send({ message: 'Forbidden Access! Admin Only Actions!' })

      next()
    }
    // verify delivery man
    const verifyDeliveryMan = async (req, res, next) => {
      console.log('data from verifyToken middleware--->', req.user?.email)
      const email = req.user?.email
      const query = { email }
      const result = await usersCollection.findOne(query)
      if (!result || result?.role !== 'deliveryMan')
        return res
          .status(403)
          .send({ message: 'Forbidden Access! Admin Only Actions!' })

      next()
    }


    
    app.post('/users/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = req.body;

      try {
        // Check if the user already exists in the database
        const isExist = await usersCollection.findOne(query);
        if (isExist) {
          return res.send(isExist);
        }

        // Generate a unique deliveryManID if the user's role is 'deliveryMan'
        let deliveryManID = null;
        if (user.role === 'deliveryMan') {
          deliveryManID = new ObjectId().toString(); // Generate a unique ID
        }

        // Insert user data into the database
        const result = await usersCollection.insertOne({
          ...user,
          deliveryManID, // Include the generated deliveryManID
          timestamp: new Date().toLocaleString(), // Human-readable date
        });

        res.send(result);
      } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send({ message: 'Internal server error', error: error.message });
      }
    });

    // get all user
    app.get('/all-users/:email', verifyToken, verifyAdmin, async (req, res) => {
      const email = req.params.email
      const query = { email: { $ne: email } }
      const result = await usersCollection.find(query).toArray()
      res.send(result)
    });

    // get top deliveryMans 
    app.get('/deliveryMen/top', async (req, res) => {
      try {
        const topDeliveryMen = await usersCollection
          .find({ role: 'deliveryMan' })
          .sort({ averageRating: -1 })
          .limit(3)
          .toArray();
        res.send(topDeliveryMen);
      } catch (error) {
        res.status(500).send({ message: 'Failed to fetch top delivery men' });
      }
    });


    // manage users role
    app.patch('/users/:email', verifyToken, async (req, res) => {
      const email = req.params.email
      const query = { email }
      const user = await usersCollection.findOne(query)
      if (!user || user?.status === 'requested')
        return res
          .status(400)
          .send('you have already requested, wait for some time.')


      const updateDoc = {
        $set: {
          status: 'requested',
        },
      }
      const result = await usersCollection.updateOne(query, updateDoc)
      console.log(result)
      res.send(result)

    })

    
    app.get('/users/role/:email', async (req, res) => {
      const email = req.params.email
      const result = await usersCollection.findOne({ email })
      res.send({ role: result?.role })
    });

    // update user role & status
    app.patch('/user/role/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const { role } = req.body;

      // Check for valid role
      if (!role || !['customer', 'deliveryMan', 'admin'].includes(role)) {
        return res.status(400).send({ message: 'Invalid role' });
      }

      try {
        const filter = { email };
        let updateDoc = {
          $set: { role, status: 'verified' },
        };

        // If the role is deliveryMan, generate a unique deliveryManId and update the document
        if (role === 'deliveryMan') {
          const deliveryManID = `${Date.now()}`; // Or any custom logic to generate unique deliveryManId
          updateDoc = {
            $set: { role, status: 'verified', deliveryManID },
          };
        }

        // Update the user's role and potentially deliveryManId
        const result = await usersCollection.updateOne(filter, updateDoc);

        if (result.modifiedCount === 0) {
          return res.status(404).send({ message: 'User not found or role is the same' });
        }

        // Send success response
        res.send({ message: 'User role updated successfully', result });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to update user role', error: err.message });
      }
    });


    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })


    // Assign a parcel to deliveryman
    app.post('/assign-parcel', async (req, res) => {
      const {
        parcelID,
        deliveryManID,
        deliveryManEmail,
        approximateDeliveryDate,
        parcelType,
        senderName,
        senderEmail,
        senderPhone,
        receiverName,
        receiverEmail,
        receiverPhone,
        deliveryAddress,
        Weight,
        cost,
        requestedDeliveryDate,
        senderLat,
        deliveryLat,
        deliveryLong,
      } = req.body;

      try {
        if (!parcelID || !deliveryManID || !approximateDeliveryDate) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const newAssignment = {
          parcelID,
          deliveryManID,
          deliveryManEmail,
          parcelType,
          senderName,
          senderEmail,
          senderPhone,
          receiverName,
          receiverEmail,
          receiverPhone,
          deliveryAddress,
          Weight,
          cost,
          requestedDeliveryDate,
          approximateDeliveryDate,
          senderLat,
          deliveryLat,
          deliveryLong,
          assignedAt: new Date(),
        };

        console.log('New assignment:', newAssignment);

        const result = await assignedParcelsCollection.insertOne(newAssignment);



        console.log('Insert result:', result);


        if (result.acknowledged && result.insertedId) {

          const updateParcelResult = await parcelCollection.updateOne(
            { _id: new ObjectId(parcelID) },
            {
              $set: { status: 'on the way' },
            }
          );

          if (updateParcelResult.modifiedCount === 1) {
            return res.status(200).json({
              message: 'Parcel assigned successfully and status updated to "on the way"',
              assignment: newAssignment,
            });
          } else {
            return res.status(500).json({ error: 'Failed to update parcel status' });
          }
        } else {
          return res.status(500).json({ error: 'Failed to assign parcel' });
        }
      } catch (error) {
        console.error('Error assigning parcel:', error);
        res.status(500).json({ error: 'Failed to assign parcel', details: error.message });
      }
    });


    app.patch('/parcels/:id', async (req, res) => {
      const parcelID = req.params.id; // Retrieve the parcel ID from the URL
      const { deliveryManID, approximateDeliveryDate, deliveryManEmail } = req.body; // Extract the data from the request body

      try {
        if (!deliveryManID || !approximateDeliveryDate) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Log incoming request for debugging
        console.log('Request received:', req.body);

        // Update the parcel in the database
        const result = await db.collection('parcels').updateOne(
          { _id: new ObjectId(parcelID) }, // Find the parcel by its ID
          {
            $set: {
              deliveryManID,
              deliveryManEmail,
              approximateDeliveryDate,
              updatedAt: new Date(), // Optionally, track the time of update
            },
          }
        );

        // Check if the parcel was updated
        if (result.modifiedCount === 1) {
          return res.status(200).json({ message: 'Parcel updated successfully' });
        } else {
          return res.status(404).json({ error: 'Parcel not found or no change made' });
        }
      } catch (error) {
        // Log the error to the console and send it as a response
        console.error('Error updating parcel:', error);
        res.status(500).json({ error: 'Failed to update parcel', details: error.message });
      }
    });



    // Generate jwt token
    app.post('/jwt', async (req, res) => {
      const email = req.body
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })
    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
      } catch (err) {
        res.status(500).send(err)
      }
    })

    // save a parcel data in db
    app.post('/parcels', verifyToken, async (req, res) => {
      const parcel = req.body;

      const timestamp = Date.now();
      const parcelBookTime = new Date(timestamp).toLocaleString();

      // Insert parcel data with timestamp
      const result = await parcelCollection.insertOne({
        ...parcel,
        timestamp: timestamp,
        bookedTime: parcelBookTime,
      });

      res.send(result);
    });

    // Search parcels by name or sender email
    app.get('/parcels-search', verifyToken, async (req, res) => {
      const { requestedDeliveryDate } = req.query;
      try {
        let query = {};
        if (requestedDeliveryDate) {
          const { $gte, $lte } = JSON.parse(requestedDeliveryDate);
          query.requestedDeliveryDate = { $gte, $lte };
        }

        const parcels = await Parcel.find(query);
        res.json(parcels);
      } catch (err) {
        res.status(500).json({ message: 'Error fetching parcels' });
      }
    });


    // all booking data 
    app.get('/parcels', verifyToken, async (req, res) => {
      const result = await parcelCollection.find().toArray()
      res.send(result)
    })


    // book data by user email
    app.get('/parcels/:email', verifyToken, async (req, res) => {
      const email = req.params.email; // Extract email from route parameters
      try {
        // Use 'senderEmail' to filter parcels based on the logged-in user's email
        const parcels = await parcelCollection.find({ senderEmail: email }).toArray();
        res.send(parcels); // Send the fetched parcels to the client
      } catch (error) {
        // Send an error response in case of a failure
        res.status(500).send({ message: 'Error fetching parcels', error: error.message });
      }
    });


    
    

    // cancel the booking

    app.patch('/parcel-can/:id', verifyToken, async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      // Check if the requested status update is valid
      if (status !== 'on the way' && status !== 'canceled') {
        return res.status(400).send({ message: 'Invalid status update.' });
      }

      try {
        const filter = { _id: new ObjectId(id) };
        const parcel = await parcelCollection.findOne(filter);

        if (!parcel) {
          return res.status(404).send({ message: 'Parcel not found' });
        }

        // Ensure only 'pending' parcels can be canceled
        if (status === 'canceled' && parcel.status !== 'pending') {
          return res.status(400).send({ message: 'Only parcels with "pending" status can be canceled.' });
        }

        // Allow 'on the way' status update from 'pending'
        if (status === 'on the way' && parcel.status !== 'pending') {
          return res.status(400).send({ message: 'Only parcels with "pending" status can be updated to "on the way".' });
        }

        const updateDoc = { $set: { status } };
        const result = await parcelCollection.updateOne(filter, updateDoc);

        if (result.modifiedCount === 0) {
          return res.status(500).send({ message: 'Failed to update the parcel.' });
        }

        res.send({ success: true, message: `Parcel status updated to "${status}" successfully.` });
      } catch (error) {
        console.error('Error updating parcel:', error.message);
        res.status(500).send({ message: 'Internal server error', error: error.message });
      }
    });


    app.patch('/parcel/:id', verifyToken, async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      // Ensure a valid status is provided
      if (!status || !['delivered', 'pending'].includes(status)) {
        return res.status(400).send({ message: 'Invalid status. Must be "delivered" or "canceled".' });
      }

      try {
        const filter = { _id: new ObjectId(id) };
        const parcel = await parcelCollection.findOne(filter);

        if (!parcel) {
          return res.status(404).send({ message: 'Parcel not found' });
        }

        // Handle status updates based on current parcel status
        if (status === 'delivered') {
          // Ensure the parcel status is "on the way" before allowing "delivered" update
          if (parcel.status !== 'on the way') {
            return res.status(400).send({ message: 'Parcel status must be "on the way" to be delivered.' });
          }
        } else if (status === 'on the way') {
          // Ensure the parcel is "pending" before canceling
          if (parcel.status !== 'pending') {
            return res.status(400).send({ message: 'Parcel status must be "pending" to be canceled.' });
          }
        }

        // Update the parcel status
        const updateDoc = { $set: { status } };
        const result = await parcelCollection.updateOne(filter, updateDoc);

        if (result.modifiedCount === 0) {
          return res.status(500).send({ message: 'Failed to update parcel status.' });
        }

        // Successful update
        res.send({ success: true, message: `Parcel status updated to ${status} successfully`, result });
      } catch (error) {
        console.error('Error updating parcel status:', error.message);
        res.status(500).send({ message: 'Internal server error', error: error.message });
      }
    });


    // get parcel by id
    app.get('/parcels/:id', verifyToken, async (req, res) => {
      const parcel = await parcelCollection.findById(req.params.id);
      if (!parcel) {
        return res.status(404).send({ message: "Parcel not found" });
      }
      res.send(parcel);
    });

    // for pay the parcel
    app.get('/update-parcels/:id', verifyToken, async (req, res) => {
      try {
        const parcel = await parcelCollection.findOne({ _id: new ObjectId(req.params.id) });

        if (!parcel) {
          return res.status(404).send({ message: "Parcel not found" });
        }

        res.send(parcel);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
      }
    });


    // update parcel get by id
    app.get('/parcel-pay/:id', verifyToken, async (req, res) => {
      try {
        const parcel = await parcelCollection.findOne({ _id: new ObjectId(req.params.id) });

        if (!parcel) {
          return res.status(404).send({ message: "Parcel not found" });
        }

        res.send(parcel);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // update parcel by id

    app.put('/parcels/:id', verifyToken, async (req, res) => {
      const { id } = req.params;
      const updatedParcelData = req.body;

      try {
        // Find the parcel by ID and update it with the new data
        const result = await parcelCollection.updateOne(
          { _id: new ObjectId(id) },  // Ensure the ID is valid (if you're using MongoDB)
          { $set: updatedParcelData }  // Set the updated data
        );

        if (result.modifiedCount > 0) {
          res.status(200).send({
            message: 'Parcel updated successfully!',
            modifiedCount: result.modifiedCount,
          });
        } else {
          res.status(400).send({
            message: 'No changes made to the parcel. Please check the data.',
          });
        }
      } catch (error) {
        console.error('Error updating the parcel:', error);
        res.status(500).send({
          message: 'Failed to update the parcel. Please try again.',
          error: error.message,
        });
      }
    });


    // deliveryman reviews
    app.get('/reviews', verifyToken, verifyDeliveryMan, async  (req, res) => {
      const { email } = req.query; // Extract email from query parameters

      if (!email) {
        return res.status(400).send({ error: 'Email is required' });
      }

      try {
        const result = await reviewCollection.find({ deliveryManEmail: email }).toArray(); // Filter reviews by deliveryManEmail
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch reviews' });
      }
    });

    // review post 
    app.post('/reviews', verifyToken, async (req, res) => {
      const {
        parcelId,
        deliveryManID,
        rating,
        reviewText,
        deliveryManEmail,
        userName,
        userEmail,
        userPhoto,
      } = req.body;

      // Validation to check if all required fields are present
      if (!parcelId || !deliveryManID || !rating || !reviewText || !deliveryManEmail) {
        return res.status(422).json({ message: 'All fields are required' });
      }

      // Ensure rating is between 1 and 5
      if (rating < 1 || rating > 5) {
        return res.status(422).json({ message: 'Rating must be between 1 and 5' });
      }

      try {
        // Fetch the delivery man by ID
        const deliveryMan = await usersCollection.findOne({ _id: new ObjectId(deliveryManID) });
        if (!deliveryMan) {
          return res.status(404).json({ message: 'Delivery man not found' });
        }

        // Check if a review already exists for the parcel and user
        const existingReview = await reviewCollection.findOne({ parcelId, userEmail });
        if (existingReview) {
          return res.status(400).json({ message: 'You have already submitted a review for this parcel' });
        }

        // Calculate the new average rating
        const totalReviews = deliveryMan.totalReviews || 0; // Default to 0 if not present
        const currentRating = deliveryMan.averageRating || 0; // Default to 0 if not present
        const newAverageRating =
          (currentRating * totalReviews + rating) / (totalReviews + 1);

        // Update the delivery man's rating and review count
        await usersCollection.updateOne(
          { _id: new ObjectId(deliveryManID) },
          {
            $set: { averageRating: newAverageRating },
            $inc: { totalReviews: 1 },
          }
        );

        // Create the review object
        const newReview = {
          parcelId,
          deliveryManID,
          rating,
          reviewText,
          deliveryManEmail,
          userName,
          userEmail,
          userPhoto,
          createdAt: new Date(),
        };

        // Insert the new review into the collection
        const result = await reviewCollection.insertOne(newReview);

        if (result.insertedId) {
          res.status(201).json({
            message: 'Review added successfully and rating updated',
            review: { ...newReview, reviewId: result.insertedId.toString() },
          });
        } else {
          res.status(500).json({ message: 'Failed to add review' });
        }
      } catch (error) {
        console.error('Error inserting review:', error);
        res.status(500).json({ message: `Server error: ${error.message}` });
      }
    });


    // admin stats
    app.get('/admin-stat', async (req, res) => {
      try {
        // total users
        const totalUsers = await usersCollection.estimatedDocumentCount();
        // total bookings
        const totalBookings = await parcelCollection.estimatedDocumentCount();
        // total reviews
        const totalReviews = await reviewCollection.estimatedDocumentCount();
        const totalDelivery = await assignedParcelsCollection.estimatedDocumentCount();

        res.status(200).send({
          totalBookings,
          totalUsers,
          totalReviews,
          totalDelivery,
        });
      } catch (error) {
        console.error("Error fetching admin statistics:", error);
        res.status(500).send({
          message: 'Error fetching admin statistics',
          error: error.message
        });
      }
    });


  
    
  } finally {
    
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello courier Server..')
})

app.listen(port, () => {
  console.log(`Courier is running on port ${port}`)
})
