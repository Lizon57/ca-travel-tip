import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'

export const controller = {
    renderLocs
}


window.onload = onInit;
window.onDelete = onDelete;

function onInit() {
    addEventListenrs();
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));

    // Render saved locs
    const locsToRender = storageService.getFromStorage()
    if (locsToRender) {
        locService.updateLocs(locsToRender)
        renderLocs(locsToRender)
    }
}

function renderLocs(locs) {
    const elLocationsTable = document.querySelector('.locations-table')

    if (locs.length === 0) elLocationsTable.innerHTML='EIN PO KLUM!!'

    let strsHTML = '';

    locs.map(loc => {
        strsHTML += `
        <div class="loc-container">
            <div class="loc-info">
                <span class="loc-name">${loc.name}</span>
                <span class="loc-weather">${loc.weather}</span>
            </div>

            <div class="loc-actions">
                <button class="loc-goto">GO!</button>
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
                console.log('User position is:', pos.coords);
                document.querySelector('.user-pos').innerText =
                    `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            })
            .catch(err => {
                console.log('err!!!', err);
            })
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