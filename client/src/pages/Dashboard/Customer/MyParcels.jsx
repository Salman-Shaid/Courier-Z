import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false); 
    const [reviewData, setReviewData] = useState({
        parcelId: '',
        deliveryManID: '',
        deliveryManEmail: '',
        reviewText: '',
        rating: 0,
        userName: '',
        userEmail: '',
        userPhoto: '',
    });

 
    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ['parcels', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure(`/parcels/${user?.email}`);
            return data;
        },
    });

   
    const handlePay = (_id) => {
        
        console.log("_id:", _id);
        navigate(`/dashboard/payParcel/${_id}`);
    };

    // Handle parcel update
    const handleUpdate = (_id) => {
        navigate(`/dashboard/updateParcel/${_id}`);
    };


    // Handle status update (e.g., cancel or mark 'on the way')
    const handleUpdateStatus = async (_id, status) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you really want to ${status === 'pending' ? 'cancel' : 'update'} this booking?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: status === 'pending' ? "Yes, cancel it!" : "Yes, update it!",
            cancelButtonText: "No, keep it",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            const newStatus = status === 'pending' ? 'canceled' : 'on the way';

            const response = await axiosSecure.patch(`${import.meta.env.VITE_API_URL}/parcel-can/${_id}`, { status: newStatus });

            if (response.status === 200) {
                Swal.fire("Success!", response.data.message, "success");
                refetch();
            } else {
                Swal.fire("Error", `Error: ${response.data.message}`, "error");
            }
        } catch (err) {
            console.log(err);
            Swal.fire("Failed", "Failed to update the booking. Please try again.", "error");
        }
    };


    
    const handleReview = (parcel) => {
        setShowModal(true);
        setReviewData({
            ...reviewData,
            parcelId: parcel._id,
            deliveryManID: parcel.deliveryManID,
            deliveryManEmail: parcel.deliveryManEmail,
            userName: user?.displayName || 'Anonymous',
            userEmail: user?.email || '',
            userPhoto: user?.photoURL || '',
        });
    };

    
    const handleModalClose = () => {
        setShowModal(false);
        setReviewData({
            parcelId: '',
            deliveryManID: '',
            deliveryManEmail: '',
            reviewText: '',
            rating: 0,
            userName: '',
            userEmail: '',
            userPhoto: '',
        });
    };

    
    const handleReviewSubmit = () => {
        if (!reviewData.reviewText.trim()) {
            toast.error('Please provide a review text');
            return;
        }

        if (reviewData.rating < 1 || reviewData.rating > 5) {
            toast.error("Please provide a rating between 1 and 5.");
            return;
        }

        if (!reviewData.deliveryManID) {
            toast.error("Delivery Man ID is missing. Cannot submit review.");
            return;
        }

        axiosSecure.post('/reviews', {
            parcelId: reviewData.parcelId,
            deliveryManID: reviewData.deliveryManID,
            deliveryManEmail: reviewData.deliveryManEmail,
            reviewText: reviewData.reviewText,
            rating: reviewData.rating,
            userName: reviewData.userName,
            userEmail: reviewData.userEmail,
            userPhoto: reviewData.userPhoto,
        })
            .then(() => {
                toast.success('Review submitted successfully!');
                setShowModal(false);
                setReviewData({
                    parcelId: '',
                    deliveryManID: '',
                    deliveryManEmail: '',
                    reviewText: '',
                    rating: 0,
                    userName: '',
                    userEmail: '',
                    userPhoto: '',
                });
                refetch();
            })
            .catch((error) => {
                console.log(error);
                toast.error(' You already give a review. Thank you.');
            });
    };

    if (isLoading) {
        return <div>Loading parcels...</div>;
    }

    return (
        <>
            <Helmet>
                <title>My Parcels</title>
            </Helmet>
            <div className="container mx-auto px-4 sm:px-8">
                
                {user && (
                    <div className="py-4 flex items-center space-x-4">
                        <img
                            src={user.photoURL || 'default-avatar.png'}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{user.displayName || 'User'}</h2>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                    </div>
                )}

                <div className="py-8">
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                                            Parcel Type
                                        </th>
                                        <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                                            Requested Delivery Date
                                        </th>
                                        <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                                            Approximate Delivery Date
                                        </th>
                                        <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                                            Booking Date
                                        </th>
                                        <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                                            Delivery Men ID
                                        </th>
                                        <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                                            Booking Status
                                        </th>
                                        <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parcels.length > 0 ? (
                                        parcels.map((parcel) => (
                                            <tr key={parcel._id}>
                                                <td className="px-5 py-3 border-b border-gray-200">{parcel.parcelType}</td>
                                                <td className="px-5 py-3 border-b border-gray-200">{parcel.requestedDeliveryDate}</td>
                                                <td className="px-5 py-3 border-b border-gray-200">{parcel.approximateDeliveryDate}</td>
                                                <td className="px-5 py-3 border-b border-gray-200">{new Date().toLocaleDateString()}</td>
                                                <td className="px-5 py-3 border-b border-gray-200">{parcel.deliveryManID || 'N/A'}</td>
                                                <td className={`px-5 py-3 border-b border-gray-200 ${parcel.status === 'pending' ? 'text-yellow-300' : ''} ${parcel.status === 'delivered' ? 'text-green-500' : ''} ${parcel.status === 'canceled' ? 'text-red-500' : ''} ${parcel.status === 'on the way' ? 'text-blue-500' : ''}`}>
                                                    {parcel.status}
                                                </td>
                                                <td className="px-5 py-3 border-b border-gray-200">
                                                    
                                                    <div className=''>
                                                        <div className='flex'>
                                                            <button
                                                                onClick={() => handleUpdate(parcel._id, parcel.status)}
                                                                disabled={parcel.status !== 'pending'}
                                                                className={`${parcel.status !== 'pending' ? 'bg-gray-300' : 'bg-blue-500'} text-white px-4 py-2 mr-4 rounded btn-sm`}
                                                            >
                                                                Update
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(parcel._id, parcel.status)}
                                                                disabled={parcel.status !== 'pending'}
                                                                className={`${parcel.status !== 'pending' ? 'bg-gray-300' : 'bg-red-500'} text-white px-4 py-2 mr-4 rounded btn-sm`}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>

                                                        <div className='flex mt-2'>
                                                            {parcel.status === 'delivered' && (
                                                                <button
                                                                    onClick={() => handleReview(parcel)}
                                                                    className="bg-green-500 btn hover:bg-lime-400  text-white px-4 py-2 rounded btn-sm mr-4"
                                                                >
                                                                    Review
                                                                </button>
                                                            )}
                                                            {parcel.status === 'delivered' && (
                                                                <button
                                                                    onClick={() => handlePay(parcel._id)}
                                                                    className="bg-yellow-500 px-6 btn btn-sm rounded text-white mr-4 hover:bg-amber-300"
                                                                >
                                                                    pay
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>


                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4 text-xl text-gray-500 bg-gray-100 border-t border-gray-300 rounded">
                                                <h4>No parcels found. Please book a parcel.</h4>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">Submit Your Review</h2>
                        <textarea
                            value={reviewData.reviewText}
                            onChange={(e) => setReviewData({ ...reviewData, reviewText: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md mb-4"
                            placeholder="Write your review here..."
                            rows="4"
                        />
                        <div className="mb-4">
                            <label className="text-sm text-gray-700">Rating</label>
                            <input
                                type="number"
                                value={reviewData.rating}
                                onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value, 10) })}
                                min="1"
                                max="5"
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleModalClose}
                                className="bg-gray-300 text-white px-4 py-2 rounded-md mr-2"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleReviewSubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyParcels;
