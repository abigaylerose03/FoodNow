import React, {Component} from 'react';

import {Screen, Spinner, Examples} from '@shoutem/ui';

import styles from './styles';
import RecommendationsMap from './RecommendationsMap';
import {OverlayTopics, BottomTopics} from './Topics';

import {fetchVenues} from './api';

import {Platform, StyleSheet, Text, View} from 'react-native';

const API_DEBOUNCE_TIME = 2000;

class App extends Component {

  state = {

    mapRegion: null,
    gpsAccuracy: null,
    recommendations: [],
    lookingFor: null,
    headerLocation: null,
    last4sqCall: null
    
  }

  watchID = null

  componentWillMount() {
    this.watchID = navigator.geolocation.watchPosition((position) => {


      let region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00922 * 1.5,
        longitudeDelta: 0.00421 * 1.5
      }

      console.log("current pos", position);
     

      this.onRegionChange(region, position.coords.accuracy);
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }


  onRegionChange(region, gpsAccuracy) {
    if(this.shouldFetchVenues(this.state.lookingFor)) {
          fetchVenues(region, gpsAccuracy);
    }

    this.setState({ 
      mapRegion: region,
      gpsAccuracy: gpsAccuracy || this.state.gpsAccuracy
    });
  }

  shouldFetchVenues(lookingFor) {
    return lookingFor != this.state.lookingFor
    || this.state.last4sqCall === null
    || new Date() - this.state.last4sqCall > API_DEBOUNCE_TIME;
  }

  async onTopicSelect(lookingFor) {
    if(this.shouldFetchVenues(lookingFor)) {
         const venues = await fetchVenues(this.state.mapRegion, this.state.gpsAccuracy, lookingFor);
         this.setState({
          lookingFor: lookingFor,
          ...venues

        });
        console.log("venues", venues);
    }
    
  }


  render() {
    const { mapRegion, lookingFor } = this.state;
    console.log("state", this.state);
    if(mapRegion) {
      return (
          <Screen>
            <RecommendationsMap recommendations={this.state.recommendations} {...this.state} onRegionChange={this.onRegionChange.bind(this)} />

            {!lookingFor ? <OverlayTopics onTopicSelect={this.onTopicSelect.bind(this)} />
              : <BottomTopics onTopicSelect={this.onTopicSelect.bind(this)} />}
          </Screen>
        );
    } else {

        return (
          <Screen style={styles.centered}>
            <Spinner styleName="large" />
          </Screen>

        );
      }
    }
}

export default App;
