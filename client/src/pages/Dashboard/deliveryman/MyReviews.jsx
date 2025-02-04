
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';


const MyReviews = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: reviews = [], isLoading, error } = useQuery({
        queryKey: ['reviews', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const { data } = await axiosSecure(`${import.meta.env.VITE_API_URL}/reviews?email=${user.email}`);
            return data;
        },
        staleTime: 0,
    });

    if (!user?.email) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold text-gray-700">Please log in to see your reviews.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold text-gray-700">Loading reviews...</p>
            </div>
        );
    }

    if (error) {
        console.error('Error fetching reviews:', error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold text-red-500">Error fetching reviews. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">My Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.length > 0 ? (
                    reviews.map((review) => {
                        const rating = parseInt(review.rating) || 0;
                        return (
                            <div
                                key={review._id}
                                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                            >
                                <div className="flex items-center space-x-4 mb-4">
                                    <img
                                        src={review.userPhoto || '/default-avatar.png'}
                                        alt={review.userName}
                                        className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{review.userName || 'Anonymous'}</h3>
                                        <p className="text-sm text-gray-500">{review.userEmail}</p>
                                        <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <span className="text-yellow-500 text-lg">
                                        {'★'.repeat(rating)}
                                        {'☆'.repeat(5 - rating)}
                                    </span>
                                </div>
                                <p className="text-gray-700">{review.reviewText}</p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-600 col-span-full text-center">No reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default MyReviews;
