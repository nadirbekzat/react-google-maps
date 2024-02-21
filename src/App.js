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
      new window.google.maps.places.Autocomplete(originRef.current);
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
      <div className="p-4 bg-white bg-opacity-50 shadow rounded m-4 border border-secondary" style={{ minWidth: '300px', maxWidth: '90%', zIndex: 1 }}>
        <div className="row g-2 mb-2 justify-content-center">
          <div className="col-6">
            <input type="text" className="form-control" placeholder="Origin" ref={originRef} />
          </div>
          <div className="col-6">
            <input type="text" className="form-control" placeholder="Destination" ref={destinationRef} />
          </div>
        </div>
        <div className="row g-2 mb-2 justify-content-center">
          <div className="col-4">
            <button className="btn btn-primary w-100" onClick={calculateRoute}>
              Find Route
            </button>
          </div>
          <div className="col-4">
            <button className="btn btn-secondary w-100" onClick={clearRoute}>
              Clear
            </button>
          </div>
          <div className="col-4">
            <button className="btn btn-info w-100" onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}>
              Reset
            </button>
          </div>
        </div>
        <div className="text-center mb-2">Distance: {distance}</div>
        <div className="text-center">Duration: {duration}</div>
      </div>
    </div>
  );
}

export default App;
