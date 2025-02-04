import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import LoadingSpinner from "../Shared/LoadingSpinner";

const UpdateParcelForm = () => {
  const { id } = useParams(); // Retrieve the parcel's _id from the URL
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);
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

  });
  const [price, setPrice] = useState(0);

  // Fetch parcel data by _id when the component mounts
  useEffect(() => {
    const fetchParcelData = async () => {
      try {
        const response = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/update-parcels/${id}`);
        console.log("Parcel data:", response.data); // Log the response
        if (response.data) {
          const data = response.data;
          setFormData({
            senderName: data.senderName || user?.displayName,
            senderEmail: data.senderEmail || user?.email,
            phone: data.phone,
            price: data.price,
            parcelType: data.parcelType,
            parcelWeight: data.parcelWeight,
            receiverName: data.receiverName,
            receiverEmail: data.receiverEmail,
            receiverPhone: data.receiverPhone,
            deliveryAddress: data.deliveryAddress,
            requestedDeliveryDate: data.requestedDeliveryDate,
          });
          setPrice(data.price); // Set price from the response if needed
        }
      } catch (error) {
        console.error("Error fetching parcel data:", error);
        toast.error("Failed to load parcel data");
      } finally {
        setLoading(false);
      }
    };

    fetchParcelData();
  }, [id, axiosSecure, user]);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>; // Render a loading message or spinner while data is being fetched
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData for other fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate price based on weight input
    if (name === "parcelWeight") {
      const weight = parseFloat(value);
      let calculatedPrice = 0;

      if (weight === 1) calculatedPrice = 50;
      else if (weight === 2) calculatedPrice = 100;
      else if (weight > 2) calculatedPrice = 150;

      // Update price in both state and formData
      setPrice(calculatedPrice);
      setFormData((prev) => ({
        ...prev,
        price: calculatedPrice, // Update the price in formData as well
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation (example: ensure receiver name is filled)
    if (!formData.receiverName || !formData.deliveryAddress) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      const updatedParcelData = {
        ...formData,
        price: price,
        status: "pending", // Default status if updating
      };

      const response = await axiosSecure.put(`/parcels/${id}`, updatedParcelData);

      if (response.data.modifiedCount > 0) {
        toast.success("Parcel updated successfully!");
      }
    } catch (error) {
      console.error("Error updating the parcel:", error);
      toast.error("Failed to update parcel. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center mx-auto">Update Parcel</h2>
          <div className="divider"></div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sender Details</h3>
              <div className="form-control">
                <label htmlFor="senderName" className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="senderEmail" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="phone" className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="parcelType" className="label">
                  <span className="label-text">Parcel Type</span>
                </label>
                <input
                  name="parcelType"
                  value={formData.parcelType}
                  onChange={handleChange}
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
                  className="input input-bordered"
                  type="number"
                  min="0"
                />
              </div>
              <div className="form-control">
                <label htmlFor="parcelWeight" className="label">
                  <span className="label-text">Parcel Delivery Cost (tk)</span>
                </label>
                <input
                  name="price"
                  value={formData.price} // Use formData.price here to bind the updated price
                  onChange={handleChange}
                  className="input input-bordered"
                  type="number"
                  min="0"
                  readOnly
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
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="receiverEmail" className="label">
                  <span className="label-text">Receiver Email</span>
                </label>
                <input
                  name="receiverEmail"
                  value={formData.receiverEmail}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="receiverPhone" className="label">
                  <span className="label-text">Receiver Phone Number</span>
                </label>
                <input
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="deliveryAddress" className="label">
                  <span className="label-text">Delivery Address</span>
                </label>
                <input
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label htmlFor="requestedDeliveryDate" className="label">
                  <span className="label-text">Requested Delivery Date</span>
                </label>
                <input
                  name="requestedDeliveryDate"
                  type="date"
                  value={formData.requestedDeliveryDate}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control col-span-full">
              <button className="btn btn-primary">Update Parcel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateParcelForm;
