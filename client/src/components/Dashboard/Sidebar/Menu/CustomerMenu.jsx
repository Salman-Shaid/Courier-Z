
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

import MenuItem from './MenuItem'
import { useState } from 'react'
import BecomeSellerModal from '../../../Modal/BecomeSellerModal'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import useAuth from '../../../../hooks/useAuth'
import toast from 'react-hot-toast'
import { BsFillBoxSeamFill } from "react-icons/bs";
import { RiListOrdered } from "react-icons/ri";
const CustomerMenu = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }

  const requestHandle = async () => {
    try{
      // send a request to server
      const { data } = await axiosSecure.patch(`/users/${user?.email}`)
      console.log(data);
      toast.success('Successfully applied become a deliveryman')
    } catch (err) {
      console.log(err.response.data)
      toast.error(err.response.data )
    }
    finally{
      closeModal()
    }
  }

  return (
    <>
      <MenuItem icon={BsFillBoxSeamFill} label='Book a Parcel' address='bookParcel' />
      <MenuItem icon={RiListOrdered} label='My Bookings' address='MyParcels' />

      <button
        onClick={() => setIsOpen(true)}
        className='flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer'
      >
        <VscGitPullRequestGoToChanges className='w-5 h-5' />

        <span className='mx-4 font-medium'>Request DeliveryMan</span>
      </button>

      <BecomeSellerModal requestHandle={requestHandle} closeModal={closeModal} isOpen={isOpen} />
    </>
  )
}

export default CustomerMenu
