import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';  // Import your axiosSecure instance


const PayParcel = () => {
  const { id } = useParams();  // Capture the parcel's _id from the URL
  const [parcelDetails, setParcelDetails] = useState(null);  // State to store parcel data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const axiosSecure = useAxiosSecure();

//   add publishable key from stripe
  

  // Fetch parcel details when the component mounts
  useEffect(() => {
    const fetchParcelDetails = async () => {
      try {
        const response = await axiosSecure.get(`/parcel-pay/${id}`);
        setParcelDetails(response.data);  // Store the fetched parcel data in state
      } catch (error) {
        setError(error.response ? error.response.data.message : 'Failed to fetch parcel details');
      } finally {
        setLoading(false);  // Set loading to false when the fetch completes
      }
    };

    fetchParcelDetails();
  }, [id]);  // Re-run the effect when 'id' changes

  if (loading) {
    return <div>Loading parcel details...</div>;  // Show loading state while fetching
  }

  if (error) {
    return <div>Error: {error}</div>;  // Show error message if fetch fails
  }

  // Ensure parcelDetails is available before rendering
  if (!parcelDetails) {
    return <div>No parcel details found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Parcel Payment</h2>
      
      {/* Card using DaisyUI */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-xl font-bold">Parcel Details</h3>
          <div className="space-y-4">
            <div>
              <span className="font-medium">Parcel ID:</span> {id}
            </div>
            <div>
              <span className="font-medium">Parcel Type:</span> {parcelDetails.parcelType}
            </div>
            <div>
              <span className="font-medium">Weight:</span> {parcelDetails.parcelWeight} kg
            </div>
            <div>
              <span className="font-medium">Receiver:</span> {parcelDetails.receiverName}
            </div>
            <div>
              <span className="font-medium">Delivery Address:</span> {parcelDetails.deliveryAddress}
            </div>
            <div>
              <span className="font-medium">Price:</span> ${parcelDetails.price}
            </div>

            <div>

            </div>
          </div>
          
          
          
        </div>
      </div>
    </div>
  );
};

export default PayParcel;
