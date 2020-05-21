import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'


import CurrentLocation from './Map';

const coitTower = {
  currentLocation: {
    lat: 37.8024,
    lng: -122.4058
  }
}

const twinPeaks = {
  currentLocation: {
    lat: 37.7542,
    lng: -122.4471
  }
}


export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.curLocRef = React.createRef();
  }

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  };

  jumptoCoitTower = () => {
    this.curLocRef.current.setState(coitTower)
  }

  jumptoTwinPeaks = () => {
    this.curLocRef.current.setState(twinPeaks)
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };



  render() {
    return (
      <Container>
        <Row>
          <Col>
            <CurrentLocation
              ref={this.curLocRef}
              centerAroundCurrentLocation
              google={this.props.google}
            >
              <Marker onClick={this.onMarkerClick} name={'current location'} />
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
              >
                <div>
                  <h4>{this.state.selectedPlace.name}</h4>
                </div>
              </InfoWindow>
            </CurrentLocation>
          </Col>
          <Col>

            <p><Button onClick={this.jumptoCoitTower}>Jump to Coit Tower</Button></p>

            <p><Button onClick={this.jumptoTwinPeaks}>Jump to Twin Peaks</Button></p>
          </Col>
        </Row>
      </Container >
    );
  }
}


export default GoogleApiWrapper({
  apiKey: 'AIzaSyAUFRV2Qv6kYtvjmASK8HOve2VBWRAc9N8'
})(MapContainer);