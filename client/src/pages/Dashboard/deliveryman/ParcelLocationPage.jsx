import  { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import L from 'leaflet';  
import 'leaflet-routing-machine';  

const ParcelLocationPage = () => {
  const { id } = useParams();  
  const [parcel, setParcel] = useState(null);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [deliveryLocation, setDeliveryLocation] = useState({ lat: 0, lng: 0 });


  useEffect(() => {
    
    const fetchParcelDetails = async () => {
      try {
        
        const fetchedParcel = {
          id,
          receiverName: 'John Doe',
          deliveryAddress: '123 Main St, Springfield',
          deliveryLat: 23.8103, 
          deliveryLng: 90.4125,    
          userLat: 51.505,      
          userLng: -0.09,      
        };
        setParcel(fetchedParcel);
        setLocation({ lat: fetchedParcel.userLat, lng: fetchedParcel.userLng });
        setDeliveryLocation({ lat: fetchedParcel.deliveryLat, lng: fetchedParcel.deliveryLng });
      } catch (error) {
        console.error('Error fetching parcel details:', error);
      }
    };

    fetchParcelDetails();
  }, [id]);


  useEffect(() => {
    if (parcel && location.lat !== 0 && deliveryLocation.lat !== 0) {
      const map = L.map('map').setView([location.lat, location.lng], 13);

    
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      
      const userMarker = L.marker([location.lat, location.lng]).addTo(map);
      const deliveryMarker = L.marker([deliveryLocation.lat, deliveryLocation.lng]).addTo(map);

     
      userMarker.bindPopup('<strong>Your Location</strong>');
      deliveryMarker.bindPopup('<strong>Delivery Location</strong>');

      
      L.Routing.control({
        waypoints: [
          L.latLng(location.lat, location.lng),
          L.latLng(deliveryLocation.lat, deliveryLocation.lng)
        ],
        createMarker: function() { return null; },
      }).addTo(map);

      
      map.fitBounds([userMarker.getLatLng(), deliveryMarker.getLatLng()]);
    }
  }, [parcel, location, deliveryLocation]);

  return (
    <div >
      <h1>Parcel Location: {id}</h1>
      {parcel ? (
        <div>
          <h2>Receiver: {parcel.receiverName}</h2>
          <p>Address: {parcel.deliveryAddress}</p>
          <Link to='/dashboard/myDelivery'>
          <button className='btn text-white btn-success btn-sm px-8 my-4'>Back</button>
          </Link>

          <div id="map" style={{ height: '400px' }}></div>
        </div>
      ) : (
        <p>Loading parcel details...</p>
      )}
    </div>
  );
};

export default ParcelLocationPage;
