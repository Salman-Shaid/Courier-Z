import { FaShieldAlt, FaRocket, FaUsers } from "react-icons/fa";
import CountUp from "react-countup"; // Import react-countup for animation
import bg1 from "../../../assets/images/Red, t.jpg";
import bg2 from "../../../assets/images/green .jpg";
import bg3 from "../../../assets/images/white.jpg";
import fullBg from "../../../assets/images/Pink .jpg";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const OurFeatures = () => {
    const axiosSecure = useAxiosSecure();
  // Sample data for the charts
  const { data:statData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const {data } = await axiosSecure('/admin-stat')
      return data
    },

  })
  const {totalBookings ,totalUsers, totalDelivery} = statData || {};
  

  if (isLoading) return <LoadingSpinner></LoadingSpinner>

    return (
        <div
            className="py-24 px-6 bg-gray-50 bg-cover bg-center "
            style={{ backgroundImage: `url(${fullBg})` }} 
        >
            
            <div className=" bg-black bg-opacity-70 "></div>

            <div className="max-w-screen-2xl mx-auto text-center z-10">
                <h2 className="text-5xl font-bold text-gray-600 mt-2 ">
                    Our Features
                </h2>
                
                <p className="mb-10 border-dotted border-b-8 border-transparent border-green-800 transition-all duration-500 pb-3">
                    We offer a variety of powerful features designed to make your parcel delivery experience smooth, secure, and efficient
                </p>
                <div className="divider"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    
                    <div
                        className="bg-cover bg-center p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-500 h-96"
                        style={{ backgroundImage: `url(${bg1})` }} 
                    >
                        
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>

                        <div className="z-10 flex justify-center text-blue-600 text-4xl mb-4">
                            <FaShieldAlt size={70}/>
                        </div>
                        <h3 className="relative text-3xl font-semibold mb-2 text-white z-10">Parcel Safety</h3>
                        <p className="text-white z-10">
                            We ensure the safety of your parcels with real-time tracking and secure packaging.
                        </p>
                    </div>

                    <div
                        className="bg-cover bg-center p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-500 h-96"
                        style={{ backgroundImage: `url(${bg3})` }} 
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>

                        <div className="z-10 flex justify-center text-center text-blue-600 text-4xl mb-4">
                            <FaRocket size={70}/>
                        </div>
                        <h3 className="relative text-3xl font-semibold mb-2 text-white z-10 ">Super Fast Delivery</h3>
                        <p className="text-white z-10">
                            Get your parcels delivered in record time, thanks to our efficient delivery network.
                        </p>
                    </div>

                    <div
                        className="bg-cover bg-center p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-500 h-96 "
                        style={{ backgroundImage: `url(${bg2})` }} 
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>

                        <div className="z-10  flex justify-center text-blue-600 text-4xl mb-4">
                            <FaUsers size={80}/>
                        </div>
                        <h3 className="relative text-3xl font-semibold mb-2 text-white z-10">Easy-to-Use App</h3>
                        <p className="text-white z-10">
                            Our app is user-friendly, making it easy for you to book and track your deliveries.
                        </p>
                    </div>
                </div>

                
                <div className=" mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-all">
                        <h4 className="text-xl font-semibold mb-2">Total Parcels Booked</h4>
                        <p className="text-3xl font-bold text-blue-600">
                            <CountUp start={0} end={totalBookings} duration={3} />
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-all">
                        <h4 className="text-xl font-semibold mb-2">Total Parcels Delivered</h4>
                        <p className="text-3xl font-bold text-blue-600">
                            <CountUp start={0} end={totalDelivery} duration={3} />
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-all">
                        <h4 className="text-xl font-semibold mb-2">Total Users</h4>
                        <p className="text-3xl font-bold text-blue-600">
                            <CountUp start={0} end={totalUsers} duration={3} />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurFeatures;
