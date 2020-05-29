
import React from 'react';
import ReactDOM from 'react-dom'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export class MapWithStreetView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.panoRef = React.createRef();
    this.state = {
      curCenter: { lat: 37.7750, lng: -122.4194 },
      currentLocation: {
        lat: 37.7750,
        lng: -122.4194
      },
      zoom: 14,
      position: {
        lat: 37.7750,
        lng: -122.4194
      },
      pov: {
        heading: 0,
        pitch: 0
      }
    }
  }

  componentDidMount() {
    // console.log("this.props.google=", this.props.google)
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState) {
    // this.setState({ curCenter: this.state.currentLocation })
    // console.log(this.state.currentLocation)

    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    // if (this.props.zoom !== prevProps.zoom) {
    //   this.map.setZoom(this.props.zoom);
    // }
    // if (this.props.center !== prevProps.center) {
    //   this.setState({
    //     currentLocation: this.props.center
    //   });
    // }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }


  loadMap() {
    if (this.props && this.props.google) {
      // checks if google is available
      const { google } = this.props;
      const maps = google.maps;
      // maps.key = googleMapsApiKey;
      // reference to the actual DOM element
      const node = ReactDOM.findDOMNode(this.mapRef.current);

      // let zoomlvl = this.state.zoom;
      const { lat, lng } = this.state.currentLocation;
      // console.log(this.state.currentLocation);
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: 16,
        // zoom: this.props.zoom,
        // maxZoom: this.props.maxZoom,
        // minZoom: this.props.minZoom,
        // disableDefaultUI: this.props.disableDefaultUI,
        // zoomControl: this.props.zoomControl,
        // scaleControl: this.props.scaleControl,
        // streetViewControl: this.props.streetViewControl,
        // panControl: this.props.panControl,
        // rotateControl: this.props.rotateControl,
        // fullscreenControl: this.props.fullscreenControl,
        // scrollwheel: this.props.scrollwheel,
        // draggable: this.props.draggable,
        // draggableCursor: this.props.draggableCursor,
        // keyboardShortcuts: this.props.keyboardShortcuts,
        // disableDoubleClickZoom: this.props.disableDoubleClickZoom,
        // noClear: this.props.noClear,
        // styles: this.props.styles,
        // gestureHandling: this.props.gestureHandling,
        zoomControl: true,
        scaleControl: false,
        streetViewControl: true,
        overviewMapControl: false,
        rotateControl: false,
        fullscreenControl: false
      });

      // Object.keys(mapConfig).forEach(key => {
      //   // Allow to configure mapConfig with 'false'
      //   if (mapConfig[key] === null) {
      //     delete mapConfig[key];
      //   }
      // });

      // maps.Map() is constructor that instantiates the map
      this.map = new maps.Map(node, mapConfig);
      // this.map.addListener('position_changed', function () {
      //   this.pano.setPosition(this.map.getCenter())
      //   // this.setState({ curCenter: this.map.getCenter().toJSON() })
      //   console.log("map moved: " + this.map.mapCenter)
      //   this.recenterMap()
      // })

      // const panoRef = this.panoRef;
      const node2 = ReactDOM.findDOMNode(this.panoRef.current)
      const panoConfig = Object.assign(
        {},
        {
          position: center,
          pov: {
            heading: 0,
            pitch: 0
          }
        });
      this.pano = new maps.StreetViewPanorama(node2, panoConfig)
      this.map.setStreetView(this.pano)
      // this.pano.addListener('position_changed', function () {
      //   this.map.setCenter(this.pano.getPosition());
      //   // this.setState({ curCenter: this.map.getCenter().toJSON() })
      //   console.log("pano moved: " + this.map.getCenter().toJSON())
      //   // this.recenterMap()
      // })
    }
  }

  //  handleEvent(evtName) {
  //     let timeout;
  //     const handlerName = `on${camelize(evtName)}`;

  //     return e => {
  //       if (timeout) {
  //         clearTimeout(timeout);
  //         timeout = null;
  //       }
  //       timeout = setTimeout(() => {
  //         if (this.props[handlerName]) {
  //           this.props[handlerName](this.props, this.map, e);
  //         }
  //       }, 0);
  //     };
  //   }

  recenterMap() {
    const map = this.map;
    const { google } = this.props;

    if (!google) return;
    const maps = google.maps;

    if (map) {
      let center = this.state.currentLocation;
      if (!(center instanceof google.maps.LatLng)) {
        center = new google.maps.LatLng(center.lat, center.lng);
      }
      map.panTo(center)
      // map.setCenter(center);
      maps.event.trigger(map, 'recenter');
    }
  }

  // renderChildren() {
  //   const { children } = this.props;

  //   if (!children) return;

  //   return React.Children.map(children, c => {
  //     if (!c) return;
  //     return React.cloneElement(c, {
  //       map: this.map,
  //       google: this.props.google,
  //       mapCenter: this.state.currentLocation
  //     });
  //   });
  // }

  render() {
    // const style = Object.assign({}, mapStyles.map);
    // const style2 = Object.assign({}, mapStyles.pano);
    // console.log("Meow meow")
    return (
      <Container fluid>
        <Row>
          <Col>
            <Row className="mapdiv"
              style={{
                margin: "0px",
                padding: "0px",
                // position: "absolute",
                // top: "80px",
                // right: "0",
                width: "100%",
                // float: "left",
                // width: "49%",
                height: "400px",
                // padding: 15,
                // padding: 10,
              }}
              ref={this.mapRef}>
              Loading map...
            </Row>
            <Row className="panodiv"
              style={{
                margin: "0px",
                padding: "0px",
                // top: "80px",
                width: '100%',
                height: '400px',
                // padding: 15,
                // padding: 10,
              }}
              ref={this.panoRef}>
              Loading StreetView...
            </Row>
          </Col>
        </Row>
        {/* {this.renderChildren()} */}
      </Container>
    );
  }
}

// MapWithStreetView.propTypes = {
//   google: React.PropTypes.object,
//   zoom: React.PropTypes.number,
//   initialCenter: React.PropTypes.object
// }
// MapWithStreetView.defaultProps = {
//   zoom: 14,
//   // San Francisco, by default
//   initialCenter: {
//     lat: 37.774929,
//     lng: -122.419416
//   }
// }

export default MapWithStreetView;

