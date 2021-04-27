export const locService = {
    getLocs,
    addLoc,
    removeLocById,
    updateLocs
}

var gLocId = 12345

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
}

function removeLocById(locId) {
    locs.filter((loc, idx) => {
    if (loc.id === locId) console.log(idx)
    })
}

function updateLocs(locsFromStroage) {
    locs = locsFromStroage
}