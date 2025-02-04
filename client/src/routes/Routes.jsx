import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'

import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'

import ManageUsers from '../pages/Dashboard/Admin/ManageUsers'
import Profile from '../pages/Dashboard/Common/Profile'
import Statistics from '../pages/Dashboard/Common/Statistics'
import MainLayout from '../layouts/MainLayout'



import BookParcelForm from '../components/Form/BookParcelForm'
import MyParcels from '../pages/Dashboard/Customer/MyParcels'

import AllParcels from '../pages/Dashboard/deliveryman/AllParcels'
import AdminRoute from './AdminRoute'


import AllDeliveryMan from '../pages/Dashboard/Admin/AllDeliveriMan'
import MyDeliveryList from '../pages/Dashboard/deliveryman/MyDeliveryList'
import MyReviews from '../pages/Dashboard/deliveryman/MyReviews'
import ParcelLocationPage from '../pages/Dashboard/deliveryman/ParcelLocationPage'
import UpdateParcelForm from '../components/Form/UpdateParcelForm'
import PayParcel from '../pages/Dashboard/Customer/PayParcel'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      


    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        ),
      },
      
      {
        path: 'bookParcel',
        element: (<PrivateRoute>
          <BookParcelForm></BookParcelForm>
        </PrivateRoute>)
      },


      {
        path: 'MyParcels',
        element: (
          <PrivateRoute>
            <MyParcels></MyParcels>
          </PrivateRoute>
        ),
        
      },
      {
        path : "payParcel/:id",
        element: <PrivateRoute> <PayParcel></PayParcel> </PrivateRoute>
      },
      {
        path: 'updateParcel/:id',
        element: <PrivateRoute>
          <UpdateParcelForm></UpdateParcelForm>
        </PrivateRoute>,
      },

      {
        path: 'manage-users',
        element: (

          <PrivateRoute>
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          </PrivateRoute>


        ),
      },
      {
        path: 'all-deliveryMan',
        element: (

          <PrivateRoute>
            <AdminRoute>
              <AllDeliveryMan></AllDeliveryMan>
            </AdminRoute>
          </PrivateRoute>


        ),
      },
      
      {
        path: 'allParcels',
        element: <PrivateRoute>
          <AdminRoute>
          <AllParcels></AllParcels>
          </AdminRoute>
        </PrivateRoute>
      },
      
      {
        path: 'myDelivery',
        element: <PrivateRoute>
          <MyDeliveryList></MyDeliveryList>
        </PrivateRoute>
      },
      {
        path: 'parcel-location/:id',
        element: <ParcelLocationPage></ParcelLocationPage>
      },
      {
        path: 'myReviews',
        element: <PrivateRoute><MyReviews></MyReviews></PrivateRoute>
      },
      {
        path: 'profile',
        element: <PrivateRoute><Profile></Profile></PrivateRoute>
      }

    ],
  },
])
