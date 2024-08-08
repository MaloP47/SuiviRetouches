import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js'
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js'


const appSettings = {
	databaseURL: "https://suiviretouches-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const retouchesInDb = ref(database, "Retouches")

const inputFieldElem = document.getElementById("inputField")
const addNewElem = document.getElementById("addNew")
const inProgressElem = document.getElementById("inProgress")

addNewElem.addEventListener("click", function() {
	let inputValue = inputFieldElem.value
	if (inputValue) {
		push(retouchesInDb, inputValue)
	}
	
	clearField()

})

onValue(retouchesInDb, function(snapshot) {
	clearInProgress()

	if (snapshot.exists()) {
		let itemsInDb = Object.entries(snapshot.val())

		for (let i = 0; i < itemsInDb.length; i++) {
			let currentItem = itemsInDb[i]

			updateInProgress(currentItem)
		}
	} else {
		inProgressElem.innerHTML = "Aucune retouche en cours..."
	}
})


function clearField() {
	inputFieldElem.value = ""
}

function updateInProgress(item) {

	let itemId = item[0]
	let itemValue = item[1]

	let newEl = document.createElement("li")

	newEl.textContent = itemValue

	newEl.addEventListener("dblclick", function() {
		let dbLocation = ref(database, `Retouches/${itemId}`)

		remove(dbLocation)
	})

	inProgressElem.append(newEl)
}

function clearInProgress() {
	inProgressElem.innerHTML = ""
}
 