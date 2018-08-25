import React, { Component } from 'react';
import './App.css';
import escapeRegExp from 'escape-string-regexp'

class Destinations extends Component {

  state = {
    // A state representing the constantly changing value of the user input
    query: '',
    // A state representing the array of venues -because it's dynamic-
    venues: this.props.venues
  }
  // A function handling showing markers of the search filtered venues
  showMarker = (venue) => {
    this.props.markers.map((marker) => {
      if(marker.title === venue) {
        window.google.maps.event.trigger(marker, 'click');
      }
    })
  }
  // A function handling updating the value of the search query to match user input
  updateQuery = (query) => {
      this.setState({ query })
      let filteredVenues
      const match = new RegExp(escapeRegExp(query), 'i');
      filteredVenues = this.props.venues.filter((place) => match.test(place.venue.name))
      this.setState({ venues: filteredVenues })
      let back = filteredVenues.map(place => place.venue.name)
      this.props.updateVenues(back)
      // Keep all markers if empty query
      if (query.length < 1) {
          let places = this.props.venues.map(place => place.venue.name);
          this.props.updateVenues(places)
      }
  }


  render() {
    return (
      <aside>
        <div className="searchBox">
          <label htmlFor="search" id="searchLabel">Bali Waterfalls</label>
          <input type="text" id="search"
            aria-label="Search for waterfalls in bali"
            placeholder="Type your destination"
            onChange={(e) => this.updateQuery(e.target.value)}
            value={this.state.query}
          />
        </div>

        <ul className="searchedVenues">
          {this.state.venues.map((venue, index) => (
            <li key={index}
                tabIndex={index}
                // Show infowindow of the clicked venue on map
                onClick={() => this.showMarker(venue.venue.name)}
            >
            {venue.venue.name}
            </li>
          ))}
        </ul>

      </aside>
    )
  }
}

export default Destinations;


/*
Version 1 of the project: Using hard coded array of locations instead of 3rd party API
destinations:
Atuh Beach: -8.773412,115.621819
Peguyangan Waterfall:  -8.781255,115.519502
Kelingking ‘T-Rex’: -8.750824,115.473991
Crystal Bay Beach: -8.71798,115.464208
Broken Beach: -8.732463,115.4512
Korawa Beach: -8.775698,115.619286
Angel’s Billabong: -8.733426,115.449269
Banah cliff: -8.767073,115.486904
*/
