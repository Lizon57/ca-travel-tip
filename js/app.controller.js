import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'

export const controller = {
    renderLocs
}

let currLat
let currLng


window.onload = onInit;
window.onDelete = onDelete;
window.onGoLocation = onGoLocation;

function onInit() {
    addEventListenrs();

    // Pan to addressed location
    const urlParams = new URLSearchParams(window.location.search)
    const latParam = +urlParams.get('lat')
    const lngParam = +urlParams.get('lng')

    if (latParam >= -85 && latParam <= +85 && lngParam >= -180 && lngParam <= 180) {
        mapService.initMap(latParam, lngParam)
            .then(() => {
                console.log('Map is ready');
            })
            .catch(() => console.log('Error: cannot init map'));
    } else {
        console.log(`hi`)
        mapService.initMap()
            .then(() => {
                console.log('Map is ready');
            })
            .catch(() => console.log('Error: cannot init map'));
    }

    // Render saved locs
    const locsToRender = storageService.getFromStorage()
    if (locsToRender) {
        locService.updateLocs(locsToRender)
        renderLocs(locsToRender)
    }

}

function renderLocs(locs) {
    const elLocationsTable = document.querySelector('.locations-table')

    if (locs.length === 0) elLocationsTable.innerHTML = 'EIN PO KLUM!!'

    let strsHTML = '';

    locs.map(loc => {
        strsHTML += `
        <div class="loc-container">
            <div class="loc-info">
                <span class="loc-name">${loc.name}</span>
                <span class="loc-weather">${loc.weather}</span>
            </div>

            <div class="loc-actions">
                <button class="loc-goto" onClick="onGoLocation(${loc.lat}, ${loc.lng})">GO!</button>
                <button class="loc-delete" onClick="onDelete(${loc.id})">X</button>
            </div>
        </div>`

        elLocationsTable.innerHTML = strsHTML
    })
}

function addEventListenrs() {
    document.querySelector('.btn-pan').addEventListener('click', (ev) => {
        mapService.panTo(35.6895, 139.6917);
    })

    document.querySelector('.btn-add-marker').addEventListener('click', (ev) => {
        mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
    })

    document.querySelector('.btn-get-locs').addEventListener('click', (ev) => {
        locService.getLocs()
            .then(locs => {
                document.querySelector('.locs').innerText = JSON.stringify(locs)
            })
    })

    document.querySelector('.btn-user-pos').addEventListener('click', (ev) => {
        getPosition()
            .then(pos => {
                mapService.panTo(pos.coords.latitude, pos.coords.longitude)
                console.log('User position is:', pos.coords);
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    })

    document.querySelector('.copy-location-to-keyboard').addEventListener('click', (ev) => {
        if (currLat && currLng) onCopyLink(currLat, currLng)
    })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onDelete(locId) {
    locService.removeLocById(locId)
}

function onGoLocation(lat, lng) {
    mapService.panTo(lat, lng)
    currLat = lat
    currLng = lng
}

function onCopyLink(lat, lng) {
    const address = `http://gitHub.Zibi?lat${lat}&${lng}`;
    navigator.clipboard.writeText(address)
    .then(function () {
        alert (`link copied to clipboard`)
    }, function (err) {
        console.error('Async: Could not copy text: ', err)
    })
}