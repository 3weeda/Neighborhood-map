import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import Destinations from './Destinations'

class App extends Component {
  state = {
    // A state representing the array of venues found
    venues: [],
    // A state representing the array of markers made
    markers: [],
    // A state representing the array of filtered venues
    searchedVenues:[],
  }
  // Asynchronous request from foursquare API
  componentDidMount() {
    this.getVenues()
  }
  // Rendering map and calling initiation function
  drawMap = () => {
    LoadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAUU6SqxJ4lb2KoF-MWI2AiUQL4ZLAPaOY&callback=initMap")
    window.initMap = this.initMap;
  }
  // Initiation by google maps
  initMap = () => {
    // Custom styles for map
    var styles = [
      {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "saturation": 36
              },
              {
                  "color": "#000000"
              },
              {
                  "lightness": 40
              }
          ]
      },
      {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "color": "#000000"
              },
              {
                  "lightness": 16
              }
          ]
      },
      {
          "featureType": "all",
          "elementType": "labels.icon",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 20
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 17
              },
              {
                  "weight": 1.2
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 20
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 21
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 17
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 29
              },
              {
                  "weight": 0.2
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 18
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 16
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 19
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 17
              }
          ]
      }
  ]

        // Create a map object, and include the MapTypeId to add
        // to the map type control.
        var map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: -8.409518, lng: 115.188916},
          zoom: 10,
          styles: styles
        }
    )
    // Building markers with infowindows
    var infowindow = new window.google.maps.InfoWindow();
    this.state.searchedVenues.map(thisVenue => {
      var content = `${thisVenue.venue.name}`;
      var marker = new window.google.maps.Marker({
        position: {lat: thisVenue.venue.location.lat, lng: thisVenue.venue.location.lng},
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        animation: window.google.maps.Animation.DROP,
        title:thisVenue.venue.name,
        clickable: true
      })
      this.setState({ map: map })
      this.state.markers.push(marker)
      marker.addListener('click', function() {
        infowindow.setContent("This is " + content);
        infowindow.open(map, marker);
      });
    })
    // Detects authentication failure
    window.gm_authFailure = function () {
      alert('Error loading map')
    }
  }

  // Fetching data from foursquare API
    getVenues = () => {
      const endPoint = "https://api.foursquare.com/v2/venues/explore?"
      const parameters = {
        client_id:"X1JVQUBJVAXSEPQIJF3PGWUIX23KYV4SEREUPU1S5M2RWLM2",
        client_secret:"KQGGHGFP5RJFZT2TTMLEIVVZOLYUDDIKKRCZQ30TVCAEF1TE",
        query:"waterfall",
        near:"bali",
        v:"20182507"
      }

      // Adding parameters to URL
      axios.get(endPoint + new URLSearchParams(parameters))
      .then(response =>{
        this.setState({
          venues:response.data.response.groups[0].items,
          searchedVenues:response.data.response.groups[0].items
        },this.drawMap())//To delay the drawing to be after the venues are ready
      })
      .catch(error =>{
        alert("Error!: " + error);
      })
    }

    // Updating venues on search input
     updateVenues = (query) => {
       let currentMarkers = [];
       currentMarkers = this.state.markers.filter(marker => query.includes(marker.title))
       this.state.markers.forEach(marker => {
         if(query.includes(marker.title) === true){
           marker.setVisible(true);
         }else{
           marker.setVisible(false);
         }
       });
     }

  render() {
    return (
      <main>
        {this.state.venues.length !== 0 &&
          <Destinations
            venues = {this.state.venues}
            markers = {this.state.markers}
            updateVenues = {this.updateVenues}
          />
        }
        <div id='map' role="application" aria-label="map"></div>
      </main>
    );
  }
}

// Handles loading google maps API asynchronously
function LoadScript(url){
  var allScripts = window.document.getElementsByTagName("script")[0]
     var script = window.document.createElement('script')
     script.src = url
     script.async = true
     script.defer = true
     // runs API as the first script
     allScripts.parentNode.insertBefore(script,allScripts)
}

export default App;
