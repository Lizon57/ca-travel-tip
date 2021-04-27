export const storageService = { saveToStorage, getFromStorage }

function saveToStorage(locs) {
    localStorage.setItem('saved-locs', JSON.stringify(locs))
}

function getFromStorage() {
    JSON.parse(localStorage.getItem('saved-locs'))

}