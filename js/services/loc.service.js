export const locService = {
    getLocs,
    addLoc
}

var gLocId = 12345

var locs = [{
    id: 12245,
    name: 'Loc1',
    lat: 32.047104,
    lng: 34.832384,
    weather: 'sunny',
    createdAt: 161952728985,
    updatedAt: 161952728987
}]



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
}