export const storageService = { saveToStorage, getFromStorage }

function saveToStorage(locs) {
    localStorage.setItem('saved-locs', locs)
}

function getFromStorage() {
    localStorage.getItem('saved-locs')

}