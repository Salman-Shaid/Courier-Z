
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const MyDeliveryList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const deliveryManEmail = user.email;

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['parcels'],
        queryFn: async () => {
            const { data } = await axiosSecure(`${import.meta.env.VITE_API_URL}/parcels`);
            return data;
        },
    });

    if (isLoading) return <LoadingSpinner />;

    const filteredParcels = parcels.filter(
        (parcel) =>
            parcel.deliveryManEmail === deliveryManEmail &&
            (parcel.status === 'on the way' || parcel.status === 'delivered')
    );

    const handleViewLocation = (parcel) => {
        navigate(`/dashboard/parcel-location/${parcel._id}`);
    };

    const handleCancelParcel = async (parcel) => {
        if (parcel.status !== 'on the way') {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'This parcel can only be canceled if it is pending.',
            });
            return;
        }

        const confirmed = await Swal.fire({
            title: `Are you sure you want to cancel Parcel ${parcel._id}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it',
            icon: 'warning',
            reverseButtons: true,
        });

        if (confirmed.isConfirmed) {
            try {
                await axiosSecure.patch(`${import.meta.env.VITE_API_URL}/parcel/${parcel._id}`, {
                    status: 'pending',
                });

                queryClient.invalidateQueries('parcels');

                toast.success(`Parcel ${parcel._id} has been canceled.`);
            } catch (error) {
                console.error('Error while canceling the parcel:', error);
                toast.error('Error while canceling the parcel.');
            }
        }
    };

    const handleDeliverParcel = async (parcel) => {
        const confirmed = await Swal.fire({
            title: `Are you sure to deliver this : ${parcel._id} ?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, deliver it!',
            cancelButtonText: 'No, keep it',
            icon: 'info',
            reverseButtons: true,
        });

        if (confirmed.isConfirmed) {
            try {
                await axiosSecure.patch(`${import.meta.env.VITE_API_URL}/parcel/${parcel._id}`, {
                    status: 'delivered',
                });

                queryClient.invalidateQueries('parcels');
                toast.success(`Parcel ${parcel._id} has been marked as Delivered.`);
            } catch (error) {
                console.error('Error while updating parcel status to Delivered:', error);
                toast.error(`Error while updating parcel status: ${error.message}`);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">My Delivery List</h2>
            <h4 className="mb-4 text-sm text-gray-600">Delivery Man Email: {user.email}</h4>

            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-2 md:px-4 py-2 border text-xs md:text-sm">Booked User’s Name</th>
                            <th className="px-2 md:px-4 py-2 border text-xs md:text-sm">Receiver’s Name</th>
                            <th className="px-2 md:px-4 py-2 border text-xs md:text-sm">Booked User’s Phone</th>
                            <th className="px-2 md:px-4 py-2 border text-xs md:text-sm">Requested Delivery Date</th>
                            <th className="px-2 md:px-4 py-2 border text-xs md:text-sm">Approximate Delivery Date</th>
                            <th className="px-2 md:px-4 py-2 border text-xs md:text-sm">Receiver’s Phone</th>
                            <th className="px-2 md:px-4 py-2 border text-xs md:text-sm">Receiver’s Address</th>
                            <th className="px-2 md:px-4 py-2 border text-xs md:text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParcels.length > 0 ? (
                            filteredParcels.map((parcel) => (
                                <tr key={parcel._id} className="hover:bg-gray-100 text-xs md:text-sm">
                                    <td className="px-2 md:px-4 py-2 border">{parcel.senderName}</td>
                                    <td className="px-2 md:px-4 py-2 border">{parcel.receiverName}</td>
                                    <td className="px-2 md:px-4 py-2 border">{parcel.phone}</td>
                                    <td className="px-2 md:px-4 py-2 border">{parcel.requestedDeliveryDate}</td>
                                    <td className="px-2 md:px-4 py-2 border">{parcel.approximateDeliveryDate}</td>
                                    <td className="px-2 md:px-4 py-2 border">{parcel.receiverPhone}</td>
                                    <td className="px-2 md:px-4 py-2 border">{parcel.deliveryAddress}</td>
                                    <td className="px-2 md:px-4 py-2 border">
                                        <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
                                            <button
                                                onClick={() => handleViewLocation(parcel)}
                                                className="text-white bg-yellow-600 btn btn-sm hover:bg-yellow-500"
                                            >
                                                Location
                                            </button>

                                            {parcel.status !== 'Delivered' && parcel.status !== 'Cancelled' && (
                                                <button
                                                    onClick={() => handleCancelParcel(parcel)}
                                                    className="text-white bg-red-500 btn btn-sm hover:bg-red-600"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            {parcel.status === 'on the way' && (
                                                <button
                                                    onClick={() => handleDeliverParcel(parcel)}
                                                    className="text-white bg-green-500 btn btn-sm hover:bg-green-600"
                                                >
                                                    Deliver
                                                </button>
                                            )}

                                            {parcel.status === 'delivered' && (
                                                <button
                                                    disabled
                                                    className="bg-green-300 text-white btn btn-sm cursor-not-allowed"
                                                >
                                                    Delivered
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-600">
                                    No parcels assigned to you
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyDeliveryList;
