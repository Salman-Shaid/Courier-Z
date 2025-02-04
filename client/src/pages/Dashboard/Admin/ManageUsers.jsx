import { Helmet } from 'react-helmet-async';
import UserDataRow from '../../../components/Dashboard/TableRows/UserDataRow';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useState } from 'react';
import { PiArrowSquareLeftFill, PiArrowSquareRightFill } from "react-icons/pi";

const ManageUsers = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure(`/all-users/${user?.email}`);
      return data;
    },
  });

 
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  
  const filteredUsers = users.filter((user) => user.role === 'customer');

  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <Helmet>
          <title>All Customers</title>
        </Helmet>
        <h1 className="text-3xl font-bold py-8 text-center text-indigo-600 bg-red-200">
          Total Customers ( {filteredUsers.length} )
        </h1>
        <div className="pb-8">
          <div className="overflow-x-auto">
            <div className="min-w-full shadow-lg rounded-lg border border-gray-200">
              <table className="min-w-full bg-white text-gray-700">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-5 py-3 text-left text-sm font-semibold uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Phone Number</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold uppercase">Role</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold uppercase">Status</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((userData) => (
                    <UserDataRow refetch={refetch} key={userData?._id} userData={userData} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
         
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
             
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`pr-2 rounded-lg flex items-center border text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-indigo-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <PiArrowSquareLeftFill size={40} /> Previous
              </button>

            
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-5 py-2 mx-2 rounded-full border text-sm font-medium ${
                    currentPage === index + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-600 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

             
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`pl-2 rounded-lg  flex items-center border text-sm font-medium ${
                  currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-indigo-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span className="px-2">Next</span> <PiArrowSquareRightFill size={40} />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
