
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineRateReview } from "react-icons/md";
import MenuItem from './MenuItem'
const SellerMenu = () => {
  return (
    <>
      
      <MenuItem icon={TbTruckDelivery} label='My Delivery List' address='myDelivery' />
      <MenuItem
        icon={MdOutlineRateReview}
        label='My Reviews'
        address='myReviews'
      />
    </>
  )
}

export default SellerMenu
