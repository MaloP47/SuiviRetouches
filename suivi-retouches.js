import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';

const appSettings = {
    databaseURL: "https://suiviretouches-default-rtdb.europe-west1.firebasedatabase.app/"
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const retouchesInDb = ref(database, "Retouches");

flatpickr(".date-input", {
    dateFormat: "d-m-y",
    minDate: "today",
    locale: "fr"
});

// Récupération des éléments HTML
const shopNameElem = document.querySelector(".shop-name-input");
const inputFieldElem = document.querySelector(".input-field-input");
const dateField = document.querySelector(".date-input");
const addNewElem = document.querySelector(".add-button");
const inProgressElem = document.querySelector(".in-progress-list");

// Ajout d'un événement au clic sur le bouton "Ajouter"
addNewElem.addEventListener("click", function() {
    let shopName = shopNameElem.value;
    let inputValue = inputFieldElem.value;
    let dateValue = dateField.value;

    if (shopName && inputValue) {
        let combinedValue = `Boutique : ${shopName}<br>Retouche : ${inputValue}<br>Date : ${dateValue || "Non Spécifiée"}`;
        push(retouchesInDb, combinedValue);
        clearFields();
    } else {
        alert("Veuillez entrer le nom de la boutique, le type de retouche et sélectionner une date.");
    }
});

onValue(retouchesInDb, function(snapshot) {
    clearInProgress();

    if (snapshot.exists()) {
        let itemsInDb = Object.entries(snapshot.val());

        itemsInDb.forEach(function(item) {
            updateInProgress(item);
        });
    } else {
        inProgressElem.innerHTML = "Aucune retouche en cours...";
    }
});

function clearFields() {
    shopNameElem.value = "";
    inputFieldElem.value = "";
    dateField.value = "";
}

function updateInProgress(item) {
    let itemId = item[0];
    let itemValue = item[1];

    let newEl = document.createElement("li");

    // Utiliser innerHTML pour permettre les sauts de ligne avec <br>
    newEl.innerHTML = itemValue;

    // Suppression d'un élément sur double-clic
    newEl.addEventListener("dblclick", function() {
        let dbLocation = ref(database, `Retouches/${itemId}`);
        remove(dbLocation);
    });

    inProgressElem.append(newEl);
}

function clearInProgress() {
    inProgressElem.innerHTML = "";
}
