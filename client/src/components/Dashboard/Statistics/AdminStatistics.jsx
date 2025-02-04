import { VscCodeReview } from "react-icons/vsc";
import { FaDollarSign } from 'react-icons/fa';
import { TbBrandBooking } from "react-icons/tb";
import ApexCharts from 'react-apexcharts';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import { RiUserSearchLine } from "react-icons/ri";

const AdminStatistics = () => {
  const axiosSecure = useAxiosSecure();
  // Sample data for the charts
  const { data:statData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const {data } = await axiosSecure('/admin-stat')
      return data
    },

  })
  const {totalBookings ,totalUsers, totalReviews} = statData || {};
  console.log(statData)
  

  if (isLoading) return <LoadingSpinner></LoadingSpinner>
  const salesData = {
    series: [
      {
        name: 'bookings',
        data: [30, 40, 35, 50, 49, 60, 70], // Example sales data
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Months
      },
      title: {
        text: 'Sales Data',
        align: 'center',
      },
    },
  };

  const usageData = {
    series: [
      {
        name: 'App Usage',
        data: [10, 15, 25, 30, 40, 55, 60], // Example usage data
      },
    ],
    options: {
      chart: {
        type: 'line',
        height: 350,
      },
      stroke: {
        width: 3,
        curve: 'smooth',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Months
      },
      title: {
        text: 'App Usage',
        align: 'center',
      },
    },
  };

  return (
    <div>
      <div className='mt-12 '>
        {/* Small Cards */}
        <div className='mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex-grow'>
          {/* Sales Card */}
          <div className='bg-blue-400 relative flex flex-col bg-clip-border rounded-xl  text-white shadow-md'>
            <div
              className={``}
            >
              <FaDollarSign className='w-10 h-10 text-white mx-auto mt-4' />
            </div>
            <div className='p-4 text-center'>
              <p className='block antialiased font-sans text-2xl leading-normal font-normal text-blue-gray-600'>
                Total Revenue
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
                $120
              </h4>
            </div>
          </div>
          {/* Total Orders */}
          <div className='bg-blue-400 text-white relative flex flex-col bg-clip-border rounded-xl  shadow-md'>
            <div
              
            >
              <TbBrandBooking className='mt-2 mx-auto w-12 h-12 text-white' />
            </div>
            <div className='p-4 text-center'>
              <p className='block antialiased font-sans text-2xl leading-normal font-normal text-blue-gray-600'>
                Total Bookings
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
                {totalBookings}
              </h4>
            </div>
          </div>
          {/* Total Plants */}
          <div className='bg-blue-400 text-white relative flex flex-col bg-clip-border rounded-xl   shadow-md'>
            <div
              className={``}
            >
              <VscCodeReview className='w-12 h-12 text-white mx-auto mt-4' />
            </div>
            <div className='p-4 text-center'>
              <p className='block antialiased font-sans  leading-normal font-normal text-blue-gray-600 text-2xl'>
                Total Reviews
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
                {totalReviews}
              </h4>
            </div>
          </div>
          {/* Users Card */}
          <div className='bg-blue-400 text-white relative flex flex-col bg-clip-border rounded-xl  shadow-md'>
            <div
              className={``}
            >
              <RiUserSearchLine className='w-12 h-12 text-white mx-auto mt-4' />
            </div>
            <div className='p-4 text-center'>
              <p className='block antialiased font-sans  leading-normal font-normal text-blue-gray-600 text-2xl'>
                Total User
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
              {totalUsers}
              </h4>
            </div>
          </div>
        </div>

        <div className='mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          {/* Sales Bar Chart */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2'>
            <ApexCharts
              options={salesData.options}
              series={salesData.series}
              type="bar"
              height={350}
            />
          </div>
         
          
        </div>

        {/* Usage Line Chart */}
        <div className='mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden'>
            <ApexCharts
              options={usageData.options}
              series={usageData.series}
              type="line"
              height={350}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
