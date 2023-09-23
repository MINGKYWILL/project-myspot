"use strict";

const form = document.querySelector(".form");
const containerSpot = document.querySelector(".new-spots");
const inputType = document.querySelector(".form-input--type");
const inputRating = document.querySelector(".form-input--rating");
const inputPlace = document.querySelector(".form-input--place");
const inputComments = document.querySelector(".form-input--comments");
const btnForm = document.querySelector(".btn--form");
const logo = document.querySelector(".logo");
const worldMap = document.querySelector(".world-map");
const curLocation = document.querySelector(".my-location");

class Spot {
  date = new Date();
  id = Date.now() + "".slice(-10);

  constructor(type, rating, spotCoords, place, comments) {
    this.type = type;
    this.rating = rating;
    this.spotCoords = spotCoords;
    this.place = place;
    this.comments = comments;
    this._getFormatDate();
  }

  _getFormatDate() {
    const year = this.date.getFullYear();
    const month = String(this.date.getMonth() + 1).padStart(2, "0");
    const day = String(this.date.getDate()).padStart(2, "0");

    this.format = `${year}-${month}-${day}`;
  }
}

class App {
  #map;
  #spots = [];
  #typeIcon = "";
  #ratingStars = "";
  #markers = [];

  constructor() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.#map.setView([latitude, longitude], 13);
      },
      () => {
        alert("Could not get your loaction");
      }
    );
    this._getPosition();
    btnForm.addEventListener("click", this._newSpot.bind(this));
    containerSpot.addEventListener("click", this._moveToSpot.bind(this));
    curLocation.addEventListener("click", this._currentLocation.bind(this));
    logo.addEventListener("click", this._currentLocation.bind(this));
    worldMap.addEventListener("click", this._worldMap.bind(this));
  }
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert("Could not get your loaction");
      });
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const spotCoords = [latitude, longitude];

    this.#map = L.map("map").setView(spotCoords, 13);
    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(this.#map);

    this._getLocalStorage();

    this.#map.on("click", this._showForm.bind(this));
    this.#spots.forEach((spot) => this._renderSpotMarker(spot));
  }

  _currentLocation() {
    if (this.#map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.#map.setView([latitude, longitude], 13);
        },
        () => {
          alert("Could not get your loaction");
        }
      );
    } else {
      this._getPosition();
    }
  }
  _worldMap() {
    if (this.#map) {
      this.#map.setView([0, 0], 2);
    } else {
      this.#map = L.map("map").fitWorld().zoomIn();

      L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(this.#map);
    }
  }

  _showForm(mapE) {
    this.mapEvent = mapE;
    if (form.classList.contains("hidden")) {
      form.classList.remove("hidden");
      form.style.display = "grid";
    } else {
      form.classList.add("hidden");
      form.style.display = "none";
    }
  }

  _newSpot(e) {
    e.preventDefault();
    const type = inputType.value;
    const rating = inputRating.value;
    const place = inputPlace.value;
    const comments = inputComments.value;
    const { lat, lng } = this.mapEvent.latlng;
    let spot;

    spot = new Spot(type, rating, [lat, lng], place, comments);
    console.log(spot);

    this.#spots.push(spot);

    this._renderSpotMarker(spot);

    this._renderSpot(spot);

    this._hideForm();

    this._setLocalStorage();
  }

  _hideForm() {
    inputType.value =
      inputRating.value =
      inputPlace.value =
      inputComments.value =
        "";
    form.style.display = "none";
    form.classList.add("hidden");
  }
  _replaceStars(spot) {
    switch (spot.rating) {
      case "star-1":
        this.#ratingStars = "⭐️";
        break;
      case "star-2":
        this.#ratingStars = "⭐️⭐️";
        break;
      case "star-3":
        this.#ratingStars = "⭐️⭐️⭐️";
        break;
      case "star-4":
        this.#ratingStars = "⭐️⭐️⭐️⭐️";
        break;
      case "star-5":
        this.#ratingStars = "⭐️⭐️⭐️⭐️⭐️";
        break;
      default:
        console.log("error");
    }
  }

  _replaceTypes(spot) {
    switch (spot.type) {
      case "cafe":
        this.#typeIcon = "☕️ Cafe";
        break;
      case "bakery and dessert":
        this.#typeIcon = "🥐 Bakery & Dessert";
        break;
      case "bar and pub":
        this.#typeIcon = "🍺 Bar & Pub";
        break;
      case "restaurant":
        this.#typeIcon = "🍽️ Restaurant";
        break;
      case "stays":
        this.#typeIcon = "🏨 Stays";
        break;
      case "attractions":
        this.#typeIcon = "👣 Attractions";
        break;
      case "drive":
        this.#typeIcon = "🚘 Drive";
        break;
      default:
        console.log("error");
    }
  }

  _deleteSpot(spotId) {
    const list = document.querySelector(`[data-id="${spotId}"]`);
    const spot = this.#spots.find((spot) => spot.id === spotId);

    if (list && spot) {
      list.remove();

      const marker = this.#markers.find(
        (marker) => marker._leaflet_id === spot.markerId
      );

      if (marker) {
        marker.remove();
        this.#markers = this.#markers.filter((m) => m !== marker);
      }

      this.#spots = this.#spots.filter((s) => s.id !== spotId);

      this._setLocalStorage();
    }
  }

  _renderSpot(spot) {
    this._replaceStars(spot);
    this._replaceTypes(spot);

    let html = `<li class="spot" data-id="${spot.id}">
    <div class="spot-details grid">
      <span class="spot-date">${spot.format}
      </span>
      <span class="spot-rating">${this.#ratingStars}</span>
      <span class="spot-type">${this.#typeIcon}</span>
      <span class="spot-place">${spot.place}</span>
      <span class="spot-comment">
      ${spot.comments}</span
      >
    </div>
    <button class="btn btn--list"><ion-icon name="trash-bin-outline" class="delete"></ion-icon></button>
  </li>`;
    form.insertAdjacentHTML("afterend", html);

    const deleteButton = form.nextElementSibling.querySelector(".btn--list");

    deleteButton.addEventListener(
      "click",
      this._deleteSpot.bind(this, spot.id)
    );
  }

  _renderSpotMarker(spot) {
    this._replaceStars(spot);
    this._replaceTypes(spot);

    const myIcon = L.icon({
      iconUrl: `img/icons/${spot.type}-icon.png`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const marker = L.marker(spot.spotCoords, { icon: myIcon })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 650,
          closeOnClick: false,
          closeButton: true,
          autoClose: false,
          className: `${spot.id}`,
        })
      )
      .setPopupContent(`${this.#typeIcon} | ${this.#ratingStars}`)
      .openPopup();

    this.#markers.push(marker);
    console.log(this.#markers);
    spot.markerId = marker._leaflet_id;
  }

  _setLocalStorage() {
    localStorage.setItem("spots", JSON.stringify(this.#spots));
  }

  _getLocalStorage(spot) {
    const data = JSON.parse(localStorage.getItem("spots"));

    if (!data) return;
    this.#spots = data;

    this.#spots.forEach((spot) => this._renderSpot(spot));
    console.log("Data loaded from local storage:", this.#spots);
  }

  _moveToSpot(e) {
    const spotEl = e.target.closest(".spot");

    if (!spotEl) return;

    const spotId = spotEl.dataset.id;
    const spot = this.#spots.find((spot) => spot.id === spotEl.dataset.id);

    console.log(spot);
    this.#map.setView(spot.spotCoords, 13);
  }

  _removeItem() {
    localStorage.removeItem("spots");
    location.reload();
  }
}

const app = new App();
