import React, { Component } from 'react';

import MapView from 'react-native-maps';
import {fetchPhotos, createPhotoUrl} from './api';

import { Card, Image, View, Subtitle, Text, Caption } from '@shoutem/ui';

class Recommendation extends Component {

	state = {
		photos: []
	}

	componentDidMount() {
		this.getPhoto();
	}

	async getPhoto() {
		console.log("Recommendation props", this.props.venue);
        // const photo = this.props.venue.photos.groups[0].items[0];
        const photos = await fetchPhotos(this.props.venue);
        console.log(photos);
        const photoUrl = createPhotoUrl(photos[0]);
        this.setState({
        	photos: photos,
        	photoUrl: photoUrl
        });
    }
   

	render() {

		const { venue, tips } = this.props;

		console.log(venue);

		return (
			<MapView.Marker coordinate={{latitude: venue.location.lat,
										 longitude: venue.location.lng}}>
				<MapView.Callout>
					<Card>
						<Image styleName="medium-wide"
							source={{uri: this.state.photoUrl}} //this.props.photo}} 
							/>

						<View styleName="content">
							<Subtitle>{venue.name}</Subtitle>
							<Caption>{tips ? tips[0].text : ''}</Caption>
						</View>
					</Card>
				</MapView.Callout>
			</MapView.Marker>
		)
	}
}

export default Recommendation;