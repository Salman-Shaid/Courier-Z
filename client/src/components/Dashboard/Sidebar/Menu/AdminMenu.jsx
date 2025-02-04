import { CiBoxList } from "react-icons/ci";
import { FaUsersGear } from "react-icons/fa6";
import { MdDirectionsBike } from "react-icons/md";
import MenuItem from './MenuItem'
import { BsGraphUp } from 'react-icons/bs'

const AdminMenu = () => {
  return (
    <>
      <MenuItem
        icon={BsGraphUp}
        label='Statistics'
        address='/dashboard'
      />
      <MenuItem icon={CiBoxList} label='All Parcels' address='allParcels' />
      
      <MenuItem icon={FaUsersGear} label='Manage Users' address='manage-users' />
      
      <MenuItem icon={MdDirectionsBike} label='All Delivery Man' address='all-deliveryMan' />
    </>
  )
}

export default AdminMenu
