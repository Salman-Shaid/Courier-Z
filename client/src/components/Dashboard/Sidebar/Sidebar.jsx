import { useState } from 'react'
import logo from '../../../assets/images/logo.png'
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { AiOutlineBars, AiOutlineLogout } from 'react-icons/ai'
import MenuItem from './Menu/MenuItem'
import useAuth from '../../../hooks/useAuth'
import AdminMenu from './Menu/AdminMenu'
import { Link } from 'react-router-dom'
import SellerMenu from './Menu/SellerMenu'
import CustomerMenu from './Menu/CustomerMenu'
import useRole from '../../../hooks/useRole'
import LoadingSpinner from '../../Shared/LoadingSpinner'

const Sidebar = () => {
  const { logOut } = useAuth()
  const [isActive, setActive] = useState(false)
  const [role, isLoading] = useRole()
  const { user } = useAuth();


  // Sidebar Responsive Handler
  const handleToggle = () => {
    setActive(!isActive)
  }
  if (isLoading) return <LoadingSpinner></LoadingSpinner>

  return (
    <>
      {/* Small Screen Navbar (Hamburger Menu) */}
      <div className="bg-red-950 text-white flex justify-between md:hidden">
        <div className="block cursor-pointer p-4 font-bold">
          <Link to="/">
            <img
              src="https://i.ibb.co.com/R2gMWyx/logo.png"
              alt="logo"
              width="40"
              height="40"
            />
          </Link>
        </div>

        <button
          onClick={handleToggle}
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-red-950  w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${isActive ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div>
          <div className="w-full hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center  mx-auto">
            <div className='card flex items-center'>
              <img className='w-20 h-20 rounded-full' src={user.photoURL} alt="" />
              <h2 className='text-lg text-gray-200 font-bold'>{user.displayName}</h2>
              <p className=' '>{user.email}</p>

            </div>



          </div>

          {/* Nav Items */}
          <div className="flex flex-col justify-between flex-1 mt-6">
            <nav>
              {/* Menu Items based on user role */}
              {role === 'customer' && <CustomerMenu />}
              {role === 'deliveryMan' && <SellerMenu />}
              {role === 'admin' && <AdminMenu />}
            </nav>
          </div>
        </div>

        <div>
          <hr />

          <MenuItem
            icon={IoHomeOutline}
            label="Home"
            address="/"
          />
          <MenuItem
            icon={CgProfile}
            label="Profile"
            address="/dashboard/profile"
          />

          <button
            onClick={logOut}
            className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-300 hover:text-gray-700 transition-colors duration-300 transform"
          >
            <AiOutlineLogout className="w-5 h-5" />
            <span className="mx-4 font-medium">Logout</span>
          </button>

          <div className='flex mt-10'>
            <div >
              <img className='w-20 h-20' src={logo} alt="" />
            </div>
            <div className='ml-2 mt-2'>
              <h3 className='text-2xl font-bold '>Courier-Z</h3>
              <p> fast & secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for small screens */}
      {isActive && (
        <div
          onClick={handleToggle}
          className="fixed inset-0 bg-black opacity-50 md:hidden"
        ></div>
      )}
    </>
  )
}

export default Sidebar
