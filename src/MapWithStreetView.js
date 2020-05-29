import React from 'react';
// import ReactDOM from 'react-dom'
// import { Map, GoogleApiWrapper } from 'google-maps-react';
import { compose, withProps, withState, withHandlers } from "recompose";
import { GoogleMap, StreetViewPanorama, withGoogleMap, withScriptjs } from 'react-google-maps'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const googleMapsApiKey = 'AIzaSyAUFRV2Qv6kYtvjmASK8HOve2VBWRAc9N8';

const chinatown = { lat: 37.7749, lng: -122.4194 }

const MapWithStreetView = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + googleMapsApiKey,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  // withState('centeredOn', 'onCenterChange', chinatown),
  // withHandlers(() => {
  //   const refs = {
  //     map: undefined,
  //   }

  //   return {
  //     onMapMounted: () => ref => {
  //       refs.map = ref
  //     },
  //     onCenterChanged: ({ onCenterChange }) => () => {
  //       onCenterChange(refs.map.panTo(this.props.centeredOn))
  //     }
  //   }
  // }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={16}
    defaultCenter={chinatown}
    centeredOn={props.centeredOn}
  >
    {/* {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />} */}
  </GoogleMap>
)

export default MapWithStreetView
