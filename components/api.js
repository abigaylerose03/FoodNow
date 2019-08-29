import {stringify as queryString} from 'query-string';

const CLIENT_ID = 'D014OC4OOKBTSZGK4CXGLBLEOKTHZ031VE2YZK3KBXPT4BAE';
const CLIENT_SECRET = 'NBBAQUY5H3MLYBE2EPLJI5XWTDOY2QICJ4EJGACVNV5WJQUM';
const FOURSQUARE_EXPLORE_ENDPOINT = 'https://api.foursquare.com/v2/venues/explore';
const FOURSQUARE_PHOTOS_ENDPOINT = 'https://api.foursquare.com/v2/venues/VENUE_ID/photos?';


const API_DEBOUNCE_TIME = 2000;

export const createPhotoUrl = (photo) => {
	return `${photo.prefix}300x500${photo.suffix}`;
}

 export const venuesQuery = ({latitude, longitude}, gpsAccuracy, lookingFor) => {
    return queryString({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      v: 20190119,
      ll: `${latitude}, ${longitude}`,
      llAcc: gpsAccuracy,
      section: lookingFor || 'food',
      limit: 10,
      openNow: 1,
      venuePhotos: 1

    });
  }


 export const fetchPhotos = async(venue) => {
 	const query = queryString({
 		 client_id: CLIENT_ID,
      	 client_secret: CLIENT_SECRET,
      	 v: 20190119
 	});

 	const url = FOURSQUARE_PHOTOS_ENDPOINT.replace('VENUE_ID', venue.id) + query;
 	console.log(url);

 	return fetch(url).then(res => res.json()).then(json => {
        if(json.response.photos) {
           return json.response.photos.items;
        }
      }) // gives back raw text and converts to JSON object



 }


export const fetchVenues = async (region, gpsAccuracy, lookingFor) => {
    const query = venuesQuery(region, gpsAccuracy, lookingFor);

    console.log(query);
    return fetch(`${FOURSQUARE_EXPLORE_ENDPOINT}?${query}`)
      .then(fetch.throwErrors)
      .then(res => res.json())
      .then(json => {
        if(json.response.groups) {
            return ({
               recommendations: json.response.groups.reduce(
                  (all, g) => all.concat(g ? g.items : []), []
                  ),
                headerLocation: json.response.headerLocation,
                last4sqCall: new Date()
            });
        }
      })
      .catch(err => console.log(err));

  }