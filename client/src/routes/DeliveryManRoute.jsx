import PropTypes from 'prop-types'
import useRole from '../hooks/useRole'
import LoadingSpinner from '../components/Shared/LoadingSpinner'
import { Navigate } from 'react-router-dom'

const DeliveryManRoute = ({ children }) => {
  const [role, isLoading] = useRole()

  if (isLoading) return <LoadingSpinner />
  if (role === 'deliveryMan') return children
  return <Navigate to='/dashboard' replace='true' />
}

DeliveryManRoute.propTypes = {
  children: PropTypes.element,
}

export default DeliveryManRoute