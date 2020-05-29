import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import MapWithStreetView from './MapWithStreetView.js'
import MapWithStreetView from './Map2.js'


import Container from 'react-bootstrap/Container';
// import Jumbotron from 'react-bootstrap/Jumbotron'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import { findDOMNode } from 'react-dom';
import $ from 'jquery';

const dataAll = [{
  "id": 1,
  "target": "Twin Peaks",
  "accuracy": 0.025,
  "clues": [
    "aplaceholder1",
    "aplaceholder2",
    "aplaceholder3",
    "aplaceholder4",
    "aplaceholder5",
    "aplaceholder6",
    "aplaceholder7",
    "aplaceholder8",
    "aplaceholder9",
    "aplaceholder10",
    "aplaceholder11",
    "aplaceholder12",
    "aplaceholder13",
    "aplaceholder14",
    "aplaceholder15",
    "aplaceholder16",
    "aplaceholder17",
    "aplaceholder18",
    "aplaceholder19",
    "aplaceholder20",
    "aplaceholder21",
    "aplaceholder22",
    "aplaceholder23",
    "aplaceholder24",
    "aplaceholder25"
  ],
  "latlng": {
    "lat": 37.7542,
    "lng": -122.4471
  },
  "factoid": "Twin Peaks are NOT the tallest hills in San Francisco. At approximately 922 ft tall, they are actually a few feet shorter than Mt. Davidson at 928 ft. The northern peak is called Eureka, and the southern peak is called Noe. ",
  "photo": "https://upload.wikimedia.org/wikipedia/commons/1/11/Twin_Peaks-San_Francisco.jpg"
},
{
  "id": 2,
  "target": "Chinatown Dragon Gate",
  "accuracy": 0.01,
  "clues": [
    "bplaceholder1",
    "bplaceholder2",
    "bplaceholder3",
    "bplaceholder4",
    "bplaceholder5",
    "bplaceholder6",
    "bplaceholder7",
    "bplaceholder8",
    "bplaceholder9",
    "bplaceholder10",
    "bplaceholder11",
    "bplaceholder12",
    "bplaceholder13",
    "bplaceholder14",
    "bplaceholder15",
    "bplaceholder16",
    "bplaceholder17",
    "bplaceholder18",
    "bplaceholder19",
    "bplaceholder20",
    "bplaceholder21",
    "bplaceholder22",
    "bplaceholder23",
    "bplaceholder24",
    "bplaceholder25"
  ],
  "latlng": {
    "lat": 37.7907,
    "lng": -122.4056
  },
  "factoid": "While the plan for a gate started in 1953, it wasn't until 1970 that the gate was finished and dedicated. Two Chinese guardian lions (one male, one female) statues sat at either side. ",
  "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/1_chinatown_san_francisco_arch_gateway.JPG/1920px-1_chinatown_san_francisco_arch_gateway.JPG"
},
]

const googleMapsApiKey = 'AIzaSyAUFRV2Qv6kYtvjmASK8HOve2VBWRAc9N8';
const startScore = 1000;
const penalty = 100;
const persecond = 3;
const hintfrequency = 6 // per minute

const ExpeditionEndModal = (props) => {
  return (
    <>
      <Modal show={props.show} onHide={props.onHide} >
        <Modal.Header closeButton>
          <Modal.Title>Expedition End</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your GeoHunt expedition has ended.</p>

          <p>Your total score is <span id="mytotalscore">0</span></p>

          <p>over <span id="myexpeditionlength">0</span> hunts</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const IntroModal = (props) => {
  // console.log("@IntroModal")
  return (
    // <>
    <Modal show={props.show} onHide={props.onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>GeoHunt Introduction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Welcome to GeoHunt, an online scavenger game.</p>

        <p>Pegman needs to go to the destination, except his 'friends' only gave him hints. Help move "pegman" to the
            target given the hints/clues available. Once you think he's there, click <span>Arrived (I think)</span>
            button. Do it fast, as you are losing points EVERY second. The faster you get Pegman there, the more points
            you keep. However, if you got it wrong (or not close enough) you get points taken away! </p>

        <p>You can drag Pegman around the map, and both streetview and the map will follow. </p>

        <p>NOTE: You MUST drag pegman himself. You must drop pegman onto one of the blue paths. If you don't, pegman
        will go back into hiding in the lower-right corner of the map, and you have to drag and drop him onto the
        map again.
          </p>

        <p>Ready to play?
            {/* Please select length of your expedition (i.e. how many hunts, max = 5). */}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.onHide}>
          Let's Go!
          </Button>
      </Modal.Footer>
    </Modal>
    // </>
  )
}


export class App extends Component {
  constructor(props) {
    super(props)
    this.handleCloseIntroModal = this.handleCloseIntroModal.bind(this)
    this.handleShowIntroModal = this.handleShowIntroModal.bind(this)
    this.handleCloseEndExpedition = this.handleCloseEndExpedition.bind(this);
    this.handleShowEndExpedition = this.handleShowEndExpedition.bind(this);

    this.startExpedition = this.startExpedition.bind(this);

    this.haversine_distance = this.haversine_distance.bind(this);

    this.isCloseEnough = this.isCloseEnough.bind(this)

    this.calcDistance = this.calcDistance.bind(this)

    this.calcBearing = this.calcBearing.bind(this)

    this.state = {
      showIntroModal: false,
      curCenter: { lat: 37.7749, lng: -122.4194 },
      totalScore: 0,
      curScore: 0,
      scoreInterval: null,
      hintInterval: null,
      data: {},
      curhunt: 0,
      curhint: 0,
      expedition: [1, 2],
      huntaccuracy: 0.01,
      huntTarget: { lat: 0, lng: 0 }
    }
  }

  // handleCloseIntroModal = () => setShowIntroModal(false);
  handleCloseIntroModal() {
    this.setState({ showIntroModal: false });
    this.initGame();
  }
  // handleShowIntroModal = () => setShowIntroModal(true);
  handleShowIntroModal() {
    this.setState({ showIntroModal: true });
  }

  handleCloseEndExpedition() {
    this.setState({ showEndExpedition: false });
  }
  // handleShowIntroModal = () => setShowIntroModal(true);
  handleShowEndExpedition() {
    this.setState({ showEndExpedition: true });
  }

  perHint() {
    // console.log("perHint")
    // just display a hint, watch out so we don't run out of hints, as 0-24 is all we got
    var existinghint = $("#hintshere").html()
    if (this.state.curhint < 24) {
      $("#hintshere").html(existinghint + "<p>" + this.state.data.clues[this.state.curhint] + "</p>");
      this.setState({ curhint: this.state.curhint + 1 });
    }
  }

  startExpedition() {
    // curhunt=0
    this.setState({ totalScore: 0 });
    $("#totalScore").val(0)
    // while (curhunt < expedition.length) {
    this.initGame();
    // }
  }

  endExpedition() {
    // alert("That's it! Your total score is " + totalScore + " over " + expedition.length + " hunts")
    $('#mytotalscore').html(this.state.totalScore.toString())
    $('myexpeditionlength').html(this.state.expedition.length.toString())
    $('#myModalEndExpedition').modal('show');
  }

  initGame() {
    console.log("curhunt = ", this.state.curhunt)
    this.setState({ curScore: startScore });
    $("#curScore").val(startScore)
    // test data, it's supposed to be read from the server
    this.setState({ data: dataAll[this.state.curhunt] });
    console.log(dataAll[this.state.curhunt])
    this.setState({ huntTarget: dataAll[this.state.curhunt].latlng });
    this.setState({ huntaccuracy: dataAll[this.state.curhunt].accuracy });
    this.setState({ curhint: 0 });
    // console.log(this.state.data)
    //reset hint area
    $("#hintshere").html("")
    let t = this.state.curhunt + 1
    $('#mycurrenthunt').html(t.toString())
    // test
    // $('#myModalinitGame').modal('show')
    // alert("Get ready for... Hunt number " + (curhunt + 1) + "!!!!!!")

    this.initTick();
  }

  endHunt() {
    //transfer current score to total score
    this.setState({ totalScore: this.state.totalscore + this.state.curScore })
    //update display
    $("#totalScore").val(this.state.totalScore)
    // increment clue
    this.setState({ curhunt: this.state.curhunt + 1 });
    if (this.state.curhunt >= this.state.expedition.length) {
      // end of the line!
      this.endExpedition();
    } else this.initGame(); // next round/hunt!
  }

  initTick() {
    console.log('Starting ticks')
    this.scoreInterval = setInterval(
      () => this.perTick(), 1000)
    this.hintInterval = setInterval(
      () => this.perHint(), 60 * 1000 / hintfrequency)


    // this.setState({
    //   scoreInterval: setInterval(() => this.perTick, 1000)
    // })
    // this.setState({
    //   hintInterval: setInterval(() => this.perHint, 60 / hintfrequency * 1000)
    // })
  }

  clearTick() {
    console.log('Stopped ticks')
    clearInterval(this.scoreInterval)
    clearInterval(this.hintInterval)
  }

  ranOutofTime() {
    this.clearTick();
    // alert("Sorry, you ran out of time. Your hunt score is ZERO. ")
    $('#yourtarget').html(this.state.data.target)
    $('#myfactoid').html(this.state.data.factoid)
    $('#targetphoto').html("<img src='" + this.state.data.photo + "' width='400px'>")
    //test
    //$('#myModalranOut').modal('show')
    this.endHunt();
  }

  isCloseEnough() {
    console.log("Close enough?")
    if (this.haversine_distance(this.state.curCenter, this.state.huntTarget) < this.state.huntaccuracy) {
      //you found it!!!!!  stop the clock
      console.log("Close enough!")
      this.clearTick();
      // alert("YOU FOUND IT! Your hunt score is " + curScore)
      // totalScore += curScore
      $('#yourtarget2').html(this.state.data.target)
      $('#targetphoto2').html("<img src='" + this.state.data.photo + "' width='400px'>")
      $('#mycurscore').html(this.state.curScore.toString())
      $('#myfactoid2').html(this.state.data.factoid)
      //test
      // $('#myModalfoundit').modal('show')
      // alert(data.factoid)
      // console.log("Yes!")
      this.endHunt();
    } else {
      // wah wah wah...
      // alert("Sorry, you're not close enough!")
      //test
      // $('#myModalntClose').modal('show')
      console.log("Nope!")
      this.setState({ curScore: this.state.curScore - penalty })
      if (this.state.curScore < 0) {
        this.ranOutofTime();
      }
    }
  }

  calcBearing() {

    let start_latitude = this.state.curCenter.lat
    let start_longitude = this.state.curCenter.lng
    let stop_latitude = this.state.huntTarget.lat
    let stop_longitude = this.state.huntTarget.lng

    var y = Math.sin(stop_longitude - start_longitude) * Math.cos(stop_latitude);
    var x = Math.cos(start_latitude) * Math.sin(stop_latitude) -
      Math.sin(start_latitude) * Math.cos(stop_latitude) * Math.cos(stop_longitude - start_longitude);
    var brng = Math.atan2(y, x) * 180 / Math.PI;
    // return brng
    if (brng < 0) {
      brng += 360
    }

    console.log(brng)
    alert("Brng = " + brng)

  }

  haversine_distance(mk1, mk2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return d;
  }

  calcDistance() {
    // const p1 = LatLon.parse(curCenter.lat + "," + curCenter.lng)
    // const p2 = LatLon.parse(twinPeaks.lat + "," + twinPeaks.lng)
    // console.log(curCenter)
    var dist = this.haversine_distance(this.state.curCenter, this.state.huntTarget)
    console.log(dist)
    alert("Dist = " + dist)
  }

  perTick() {
    // console.log("perTick")
    this.setState({ curScore: this.state.curScore - persecond });
    $("#curScore").val(this.state.curScore);
    if (this.state.curScore <= 0) {
      this.ranOutofTime();
    }
  }

  componentDidMount() {
    this.setState({
      // handleShowIntroModal();
      showIntroModal: true
    })
  }
  // if (!props.loaded) return <div>Loading...</div>;
  render() {
    // main app return/render
    return (
      <Container className="MyApp mx-0 px-0" fluid >
        <IntroModal
          show={this.state.showIntroModal}
          onHide={this.handleCloseIntroModal}
          onClick={this.startExpedition} />
        <ExpeditionEndModal
          show={this.state.showExpeditionEndModal}
          onHide={this.handleCloseEndExpedition} />
        <Container className="MyHeader mx-0 px-0" fluid>
          <Row>
            <Col className="col-auto">
              <h2>GeoHunt Prototype</h2>
            </Col>
            <Col className="align-self-center">
              A virtual geographical hunt for targets around the city.
            </Col>
          </Row>
        </Container>
        <Container className="MyBodyFull mx-0 px-0" fluid>
          <Row>
            <Col>
              <Container className="MyBodyleft mx-0 px-0" fluid>
                <Row>
                  <Col>
                    {/* {console.log("props.google=", this.props.google)} */}
                    <MapWithStreetView
                      // center={this.state.curCenter}
                      // centerAroundCurrentLocation
                      // ref={this.curLocRef}
                      // className="map"
                      google={this.props.google}
                    // apiKey={googleMapsApiKey}
                    // style={{ height: '100%', position: 'relative', width: '100%' }}
                    // zoom={14}
                    // panControl
                    // zoomControl
                    // scrollWheel
                    // draggable
                    // streetViewControl
                    // StreetViewPanorama
                    />
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col>
              <Container className="MyBody2  mx-0 px-0">
                <Row style={{ height: "100px" }}>
                  <Col>
                    <div className="form-group">
                      <label htmlFor="curScore">Current Hunt Score: </label>
                      <input type="text" id="curScore" readOnly size='3' />
                      <label htmlFor="totalScore">Expedition Score: </label>
                      <input type="text" id="totalScore" readOnly size='3' />
                    </div>

                    <Button type="button" variant="danger" onClick={this.isCloseEnough}>Arrived (I think)</Button>

                    <Button type="button" variant="info" onClick={this.calcDistance}>Distance</Button>

                    <Button type="button" variant="info" onClick={this.calcBearing}>Bearing</Button>

                    <h3>Hints go here</h3>

                    <div id="hintshere">

                    </div>
                    {/* 
                    <p><Button onClick={() => jumpto(coitTower)}>Jump to Coit Tower</Button></p>

                    <p><Button onClick={() => jumpto(twinPeaks)}>Jump to Twin Peaks</Button></p>
                    <p>Some text goes here</p> */}
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container >
      </Container >
    );
  }
}
// jumptoTwinPeaks = () => {
//   this.curLocRef.current.setState(twinPeaks)
// }

// export default App


export default GoogleApiWrapper({
  apiKey: googleMapsApiKey
})(App);