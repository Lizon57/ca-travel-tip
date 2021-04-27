import { storageService } from './storage.service.js'
import { mapService } from './map.service.js'
import { controller } from '../app.controller.js'

export const locService = {
    getLocs,
    addLoc,
    removeLocById,
    updateLocs,
    getLocIdByStr
}


var gLocId = 0

var locs = []

function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(locs);
    });
}

function addLoc(loc) {
    locs.push({
        id: gLocId++,
        name: 'Loc1',
        lat: loc.lat,
        lng: loc.lng,
        weather: 'sunny',
        createdAt: Date.now(),
        updatedAt: ''
    })

    controller.renderLocs(locs)
}

function removeLocById(locId) {
    locs.filter((loc, idx) => {
        if (loc.id === locId) {
            locs.splice(idx, 1);
            controller.renderLocs(locs)
            storageService.saveToStorage(locs)
        }
    })
}

function updateLocs(locsFromStroage) {
    locs = locsFromStroage
}

function getLocIdByStr(str) {
    const API_KEY = 'AIzaSyBfMQfVb9oKKZKCrkg0toAIbJ26HovmvBA';
    const searchLocationApi = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${str}&inputtype=textquery&key=${API_KEY}`
    const searchPrm = axios.get(searchLocationApi)
    .then(res => {
        const searchRes = res.data.candidates
        if (searchRes.length) {
            getLocCoordsById(searchRes[0].place_id)
        }
    })
}

function getLocCoordsById(locId) {
    const API_KEY = 'AIzaSyBfMQfVb9oKKZKCrkg0toAIbJ26HovmvBA';
    const searchLocationApi = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${locId}&key=${API_KEY}`
    axios.get(searchLocationApi)
    .then(res => {
        const searchRes = res.data
        const locName = searchRes.result.formatted_address
        const locLat = searchRes.result.geometry.location.lat
        const locLng = searchRes.result.geometry.location.lng
        controller.renderLocName(locName)
        mapService.panTo(locLat, locLng)
        mapService.addMarker({lat: locLat, lng: locLng})
    })
}