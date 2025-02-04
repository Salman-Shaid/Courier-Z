import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { motion } from 'framer-motion'; // Import framer-motion
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';

const TopDeliveryMans = () => {
    const [deliveryMen, setDeliveryMen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchTopDeliveryMen = async () => {
            try {
                const response = await axiosSecure.get('/deliveryMen/top');
                setDeliveryMen(response.data); // Assuming the backend returns top delivery men sorted by rating
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Failed to fetch delivery men');
            } finally {
                setLoading(false);
            }
        };

        fetchTopDeliveryMen();
    }, []);

    if (loading) {
        return  <LoadingSpinner></LoadingSpinner>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-36 ">
            <h2 className="text-5xl font-bold text-center mb-8">Our Top Delivery Men</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {deliveryMen.map((deliveryMan) => (
                    <motion.div
                        key={deliveryMan._id}
                        className="card bg-white py-20 shadow-2xl rounded-lg p-6 border"
                        initial={{ opacity: 0, y: 50 }} 
                        animate={{ opacity: 1, y: 0 }}   
                        transition={{ duration: 2 }}    
                    >
                        <div className="avatar flex justify-center mb-4">
                            <div className="w-2/4 rounded-full">
                                <img src={deliveryMan.image || '/default-avatar.png'} alt={deliveryMan.name} />
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl mb-2 font-semibold">{deliveryMan.name}</h3>
                            <p className="text-gray-600">Email: {deliveryMan.email}</p>
                            
                            <p className="text-yellow-500 mb-2 text-2xl font-bold mt-2">
                                Average Rating: {deliveryMan.averageRating.toFixed(1)} ⭐
                            </p>
                            <p className="text-gray-600">Parcels Delivered: {deliveryMan.totalReviews}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TopDeliveryMans;
