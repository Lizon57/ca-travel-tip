import { locService } from './loc.service.js'
import { storageService } from './storage.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo
}

var gMap;


function initMap(lat = 31.925358176608505, lng = 34.69877243041992) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 10
            })
            gMap.addListener("click", (mapsMouseEvent) => {
                // get clicked position and pass it to addMarker() 
                const clickedPos = mapsMouseEvent.latLng.toJSON();
                addMarker(clickedPos);
            })
        })

}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });

    // Add location to gLocs
    locService.addLoc(loc);

    // Save gLocs to local storage
    locService.getLocs()
        .then(locs => storageService.saveToStorage(locs))

    return marker;
}



function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBfMQfVb9oKKZKCrkg0toAIbJ26HovmvBA';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}