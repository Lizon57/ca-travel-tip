import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'

export const controller = {
    renderLocs,
    renderLocName
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
        <div class="locations-table-item-container">
            <span class="loc-name">${loc.name}</span>

            <div class="loc-actions">
                <button onClick="onGoLocation(${loc.lat}, ${loc.lng})">GO!</button>
                <button onClick="onDelete(${loc.id})">X</button>
            </div>
        </div>`

        elLocationsTable.innerHTML = strsHTML
    })
}

function addEventListenrs() {
    document.querySelector('.btn-search').addEventListener('click', () => {
        const searchVal = document.querySelector('.search-input').value
        locService.getLocIdByStr(searchVal)
    })

    // document.querySelector('.btn-pan').addEventListener('click', () => {
    //     mapService.panTo(35.6895, 139.6917);
    // })

    // document.querySelector('.btn-add-marker').addEventListener('click', () => {
    //     mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
    // })

    // document.querySelector('.btn-get-locs').addEventListener('click', () => {
    //     locService.getLocs()
    //         .then(locs => {
    //             document.querySelector('.locs').innerText = JSON.stringify(locs)
    //         })
    // })

    document.querySelector('.btn-user-pos').addEventListener('click', () => {
        getPosition()
            .then(pos => {
                mapService.panTo(pos.coords.latitude, pos.coords.longitude)
                console.log('User position is:', pos.coords);
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    })

    document.querySelector('.copy-location-to-keyboard').addEventListener('click', () => {
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
    const address = `https://lizon57.github.io/ca-travel-tip/index.html?lat=${lat}lng=&${lng}`;
    navigator.clipboard.writeText(address)
        .then(function () {
            alert(`link copied to clipboard`)
        }, function (err) {
            console.error('Async: Could not copy text: ', err)
        })
}

function renderLocName(locName) {
    const elLocName = document.querySelector('.loc-name')
    elLocName.innerText = locName
}