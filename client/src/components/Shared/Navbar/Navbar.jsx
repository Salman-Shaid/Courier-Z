import Container from '../Container'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import avatarImg from '../../../assets/images/placeholder.jpg'
import logo from '../../../assets/images/logo.png'
import Lottie from 'lottie-react'
import notificationAnimation from '../../../assets/lottie/notifation bell.json'
import menuAnimation from '../../../assets/lottie/menu.json'
const Navbar = () => {
  const { user, logOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed w-full bg-red-950 z-10 shadow-sm">
      <div className=" border-b-[1px] border-gray-500">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            {/* Logo */}
            <Link to="/">
              <img src={logo} alt="logo" width="100" />
            </Link>

            {/* Center Navigation */}
            <div className="hidden md:flex gap-6">
              <Link
                to="/"
                className="text-white hover:text-black transition font-semibold"
              >
                Home
              </Link>
              

              <Link
                to="/"
                className="text-white bg-white rounded-full p-1 hover:text-black transition font-semibold"
              >
                <Lottie animationData={notificationAnimation} loop={true}></Lottie>
              </Link>
            </div>

            {/* Dropdown Menu */}
            <div className="relative">
              <div className="flex flex-row items-center gap-3">
                {/* Dropdown btn */}
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded--2xl cursor-pointer hover:shadow-md transition"
                >
                  <div className='w-10 h-10'>
                    <Lottie animationData={menuAnimation} loop={true}></Lottie>
                  </div>
                  <div className="hidden md:block">
                    {/* Avatar */}
                    <img
                      className="rounded-full"
                      referrerPolicy="no-referrer"
                      src={user && user.photoURL ? user.photoURL : avatarImg}
                      alt="profile"
                      height="30"
                      width="30"
                    />
                  </div>
                </div>
              </div>
              {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-red-950 overflow-hidden right-0 top-12 text-sm">
                  <div className="flex flex-col cursor-pointer">




                    {user ? (
                      <>

                        <div className='bg-red-950'>
                          <h2 className='pl-4 pt-5'>Hello ! <span className='text-green-500 '>{user.displayName}</span></h2>
                          <div className="divider"></div>
                        </div>
                        <Link
                          to="/"
                          className="block md:hidden px-4 py-2 hover:bg-neutral-200 transition font-semibold"
                        >
                          Home
                        </Link>
                        <Link
                          to="/dashboard"
                          className="px-4 py-2 hover:bg-neutral-200 transition font-semibold"
                        >
                          Dashboard
                        </Link>
                        <div
                          onClick={logOut}
                          className="px-4 py-3 hover:bg-neutral-200 transition font-semibold cursor-pointer"
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                      <div className='bg-red-950'>
                        <h2 className='px-4 pt-4 '>Please login or sing up</h2>
                      </div>
                        <Link
                          to="/login"
                          className="px-4 py-3 hover:bg-neutral-200 transition font-semibold"
                        >
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          className="px-4 py-3 hover:bg-neutral-200 transition font-semibold"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navbar
