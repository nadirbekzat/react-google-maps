import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const center = { lat: 33.424564, lng: -111.928001 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const originRef = useRef(null);
  const destinationRef = useRef(null);

  useEffect(() => {
    if (isLoaded) {
      // Initialize Autocomplete on the origin input
      new window.google.maps.places.Autocomplete(originRef.current);
      // Initialize Autocomplete on the destination input
      new window.google.maps.places.Autocomplete(destinationRef.current);
    }
  }, [isLoaded]);

  async function calculateRoute() {
    if (!originRef.current.value || !destinationRef.current.value) {
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinationRef.current.value = '';
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column align-items-center vh-100 vw-100 position-relative">
      <div className="position-absolute top-0 start-0 h-100 w-100">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div className="p-4 bg-white shadow rounded m-4" style={{ minWidth: '500px', zIndex: 1 }}>
        <div className="d-flex justify-content-between mb-4">
          <div className="flex-grow-1 me-2">
            <input type="text" className="form-control" placeholder="Origin" ref={originRef} />
          </div>
          <div className="flex-grow-1 ms-2">
            <input type="text" className="form-control" placeholder="Destination" ref={destinationRef} />
          </div>
          <div>
            <button className="btn btn-primary me-2" type="submit" onClick={calculateRoute}>
              Calculate Route
            </button>
            <button className="btn btn-secondary" onClick={clearRoute}>
              Clear
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <span>Distance: {distance}</span>
          <span>Duration: {duration}</span>
          <button className="btn btn-info" onClick={() => {
            map.panTo(center);
            map.setZoom(15);
          }}>
            Reset View
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
