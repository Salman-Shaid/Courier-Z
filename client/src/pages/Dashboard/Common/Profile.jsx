import useAuth from '../../../hooks/useAuth'
import { Helmet } from 'react-helmet-async'
import coverImg from '../../../assets/images/coverProfile.jpg'
import useRole from '../../../hooks/useRole'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'

const Profile = () => {
  const { user, loading } = useAuth()
  const [role, isLoading] = useRole()
  
  if (loading || isLoading) return <LoadingSpinner />

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className='bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-2xl'>
        <div className='relative'>
          <img
            alt='cover photo'
            src={coverImg}
            className='w-full h-40 object-cover'
          />
          <div className='absolute inset-0 bg-black bg-opacity-30'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <img
              alt='profile'
              src={user.photoURL}
              className='mx-auto object-cover rounded-full h-24 w-24 border-4 border-white'
            />
          </div>
        </div>
        <div className='text-center mt-6 p-6'>
          <p className='text-sm btn bg-green-500 rounded-full text-white mb-1'>{role}</p>
          <h2 className='text-xl font-semibold text-gray-800'>{user.displayName}</h2>
          <p className='text-gray-600'>{user.email}</p>
          <p className='text-gray-400 text-sm mt-2'>User ID: {user.uid}</p>
          <div className='flex justify-center mt-6'>
            <button className='bg-lime-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-lime-600'>
              Update Profile
            </button>
          </div>
        </div>
        <div className='border-t border-gray-200 p-4'>
          <h3 className='text-gray-700 font-medium mb-2'>Additional Details</h3>
          <div className='flex justify-between items-center text-sm'>
            <div>
              <p className='text-gray-500'>Role :</p>
              <p className='text-gray-800 font-medium'>{role}</p>
            </div>
            <div>
              <p className='text-gray-500'>Phone :</p>
              <p className='text-gray-800 font-medium'>Not provided</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
