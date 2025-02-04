
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";  // Make sure this is loaded after the leaflet library

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"; // Import routing machine styles
import { AuthContext } from "../../providers/AuthProvider"; // Assuming AuthProvider exists
import { useState, useContext, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const BookParcelForm = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    senderName: user?.displayName || "Unknown Sender",
    senderEmail: user?.email || "Unknown Email",
    price: "",
    phone: "",
    parcelType: "",
    parcelWeight: "",
    receiverName: "",
    receiverEmail: "",
    receiverPhone: "",
    deliveryAddress: "",
    requestedDeliveryDate: "",
    senderLat: 23.8103, // Default sender latitude (Dhaka, Bangladesh)
    senderLong: 90.4125, // Default sender longitude
    deliveryLat: 23.8103, // Default delivery latitude (Dhaka, Bangladesh)
    deliveryLong: 90.4125, // Default delivery longitude
  });

  const [price, setPrice] = useState(0);
  const [markerType, setMarkerType] = useState("delivery"); // Determines which marker to set

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "parcelWeight") {
      const weight = parseFloat(value);
      if (weight === 1) setPrice(50);
      else if (weight === 2) setPrice(100);
      else if (weight > 2) setPrice(150);
      else setPrice(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add price to formData explicitly
      const parcelData = {
        ...formData,
        price: price, // Make sure price is included
        status: "pending", // Default status for the parcel
      };

      // Make the POST request to save the form data to the database
      const response = await axiosSecure.post("/parcels", parcelData);

      if (response.data.insertedId) {
        toast.success("Parcel booked successfully!");
        // Optionally, reset form fields after successful submission
        setFormData({
          senderName: user?.displayName || "Unknown Sender",
          senderEmail: user?.email || "Unknown Email",
          phone: "",
          price: "",
          parcelType: "",
          parcelWeight: "",
          receiverName: "",
          receiverEmail: "",
          receiverPhone: "",
          deliveryAddress: "",
          requestedDeliveryDate: "",
          senderLat: 23.8103, // Default sender latitude (Dhaka, Bangladesh)
          senderLong: 90.4125, // Default sender longitude
          deliveryLat: 23.8103, // Default delivery latitude (Dhaka, Bangladesh)
          deliveryLong: 90.4125, // Default delivery longitude
        });
      }
    } catch (error) {
      console.error("Error booking the parcel:", error);
      toast.error("Failed to book the parcel. Please try again.");  // Replace with SweetAlert or toast
    }
  };



  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        setFormData((prev) => {
          if (markerType === "sender") {
            return { ...prev, senderLat: lat, senderLong: lng };
          } else {
            return { ...prev, deliveryLat: lat, deliveryLong: lng };
          }
        });
      },
    });

    // Initialize Leaflet Routing Machine for directions
    useEffect(() => {
      // Create the route control and add it to the map
      const routeControl = L.Routing.control({
        waypoints: [
          L.latLng(formData.senderLat, formData.senderLong),
          L.latLng(formData.deliveryLat, formData.deliveryLong),
        ],
        routeWhileDragging: true,
      });

      routeControl.addTo(map);

      // Function to update the route when the coordinates change
      const updateRoute = () => {
        routeControl.setWaypoints([
          L.latLng(formData.senderLat, formData.senderLong),
          L.latLng(formData.deliveryLat, formData.deliveryLong),
        ]);
      };

      // Call the updateRoute initially and on dependencies change
      updateRoute();

      // Cleanup the route control on unmount
      return () => {
        routeControl.remove();
      };
    }, [formData, map]); // Only include formData and map as dependencies
    // save data on db 


    return (
      <>
        <Marker position={[formData.senderLat, formData.senderLong]} />
        <Marker position={[formData.deliveryLat, formData.deliveryLong]} />
      </>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Book Your Parcel</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Sender Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sender Details</h3>
              <div className="form-control">
                <label htmlFor="name" className="label">
                  <span className="label-text">Name</span>
                </label>
                <input

                  name="senderName"
                  value={user?.displayName || ""}
                  readOnly
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input

                  name="senderEmail"
                  value={user?.email || ""}
                  readOnly
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="phone" className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="parcelType" className="label">
                  <span className="label-text">Parcel Type</span>
                </label>
                <input
                  id="parcelType"
                  name="parcelType"
                  value={formData.parcelType}
                  onChange={handleChange}
                  placeholder="Enter parcel type (e.g., documents, electronics)"
                  required
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="parcelWeight" className="label">
                  <span className="label-text">Parcel Weight (kg)</span>
                </label>
                <input

                  name="parcelWeight"
                  value={formData.parcelWeight}
                  onChange={handleChange}
                  placeholder="Enter parcel weight"
                  required
                  className="input input-bordered"
                  type="number"
                  min="0"
                />
              </div>

            </div>

            {/* Receiver Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Receiver Details</h3>
              <div className="form-control">
                <label htmlFor="receiverName" className="label">
                  <span className="label-text">Receiver Name</span>
                </label>
                <input
                  id="receiverName"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  placeholder="Enter receiver's name"
                  required
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="receiverEmail" className="label">
                  <span className="label-text">Receiver Name</span>
                </label>
                <input
                  id="receiverEmail"
                  name="receiverEmail"
                  value={formData.receiverEmail}
                  onChange={handleChange}
                  placeholder="Enter receiver's email"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label htmlFor="receiverPhone" className="label">
                  <span className="label-text">Receiver Phone Number</span>
                </label>
                <input
                  id="receiverPhone"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  placeholder="Enter receiver's phone number"
                  required
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="deliveryAddress" className="label">
                  <span className="label-text">Delivery Address</span>
                </label>
                <input
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Enter delivery address"
                  required
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="requestedDeliveryDate" className="label">
                  <span className="label-text">Requested Delivery Date</span>
                </label>
                <input
                  id="requestedDeliveryDate"
                  name="requestedDeliveryDate"
                  type="date"
                  value={formData.requestedDeliveryDate}
                  onChange={handleChange}
                  required
                  className="input input-bordered"
                />
              </div>

            </div>

            {/* Location Inputs */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sender Location </span>
                </label>
                <input
                  readOnly
                  value={`${formData.senderLat}, `}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Delivery Location </span>
                </label>
                <input
                  readOnly
                  value={` ${formData.deliveryLong}`}
                  className="input input-bordered"
                />
              </div>
             
              
              <div className="md:col-span-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Delivery charge Price (Tk)</span>
                  </label>
                  <input
                    readOnly
                    name="price"
                    value={price}  // This value is calculated dynamically
                    className="input input-bordered"
                  />
                </div>
              </div>


            </div>

            {/* Map Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">
                Select Locations on Map
              </h3>
              <div className="mb-4">
                <button
                  type="button"
                  className={`btn ${markerType === "sender" ? "btn-primary" : "btn-outline"
                    }`}
                  onClick={() => setMarkerType("sender")}
                >
                  Set Sender Location
                </button>
                <button
                  type="button"
                  className={`btn ml-4 ${markerType === "delivery" ? "btn-primary" : "btn-outline"
                    }`}
                  onClick={() => setMarkerType("delivery")}
                >
                  Set Delivery Location
                </button>
              </div>
              <MapContainer
                center={[formData.deliveryLat, formData.deliveryLong]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
              </MapContainer>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <div className="form-control mt-4">
                <button type="submit" className="btn btn-primary w-full">
                  Book Parcel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookParcelForm;
