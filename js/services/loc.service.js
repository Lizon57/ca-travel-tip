import { controller } from '../app.controller.js'
import { storageService } from './storage.service.js'
export const locService = {
    getLocs,
    addLoc,
    removeLocById,
    updateLocs,
    onGoLoc
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

function onGoLoc(lat, lng) {
    console.log(lat, lng)

}