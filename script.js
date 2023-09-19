"use strict";

const form = document.querySelector(".form");
const sectionSpot = document.querySelector(".section");
const inputType = document.querySelector(".form-input--type");
const inputRating = document.querySelector(".form-input--rating");
const inputPlace = document.querySelector(".form-input--place");
const inputComments = document.querySelector(".form-input--comments");
const btnForm = document.querySelector(".btn--form");
const btnDel = document.querySelectorAll(".btn--list");

class Spot {
  date = new Date();
  id = Date.now() + "".slice(-10);

  constructor(type, rating, curCoords, place, comments) {
    this.type = type;
    this.rating = rating;
    this.curCoords = curCoords;
    this.place = place;
    this.comments = comments;
  }
}

class App {
  #spots = [];
  #typeIcon = "";
  #ratingStars = "";

  constructor() {
    this._getPosition();
    this._getLocalStorage();
    btnForm.addEventListener("click", this._newWorkout.bind(this));
    btnDel.forEach((btn) => {
      btn.addEventListener("click", this._removeItem.bind(this));
      console.log("clicked");
    });
  }
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("could not get your location");
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const curCoords = [latitude, longitude];
    this.map = L.map("map").setView(curCoords, 13);

    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(this.map);

    this.map.on("click", this._showForm.bind(this));

    this.#spots.forEach((spot) => this._renderSpotMarker(spot));
  }

  _showForm(mapE) {
    this.mapEvent = mapE;
    form.classList.remove("hidden");
    console.log(this.mapEvent);
  }

  _newWorkout(e) {
    e.preventDefault();
    const type = inputType.value;
    const rating = inputRating.value;
    const place = inputPlace.value;
    const comments = inputComments.value;
    const { lat, lng } = this.mapEvent.latlng;
    let spot;
    // type, rating, curCoords, place, comments
    spot = new Spot(type, rating, [lat, lng], place, comments);
    console.log(spot);

    this.#spots.push(spot);
    console.log(this.#spots);

    let ratingStars = "";

    if (spot.rating === "star-5") {
      ratingStars = "⭐️⭐️⭐️⭐️⭐️";
    } else if (spot.rating === "star-4") {
      ratingStars = "⭐️⭐️⭐️⭐️";
    } else if (spot.rating === "star-3") {
      ratingStars = "⭐️⭐️⭐️";
    } else if (spot.rating === "star-2") {
      ratingStars = "⭐️⭐️";
    } else if (spot.rating === "star-1") {
      ratingStars = "⭐️";
    }

    let typeIcon = "";
    if (spot.type === "Cafe") {
      typeIcon = "☕️ Cafe";
    } else if (spot.type === "Bakery and Dessert") {
      typeIcon = "🥐 Bakery & Dessert";
    } else if (spot.type === "Bar and Pub") {
      typeIcon = "🍷 Bar & Pub";
    } else if (spot.type === "Restaurant") {
      typeIcon = "🍽️ Restaurant";
    } else if (spot.type === "Stays") {
      typeIcon = "🏨 Stays";
    } else if (spot.type === "Attractions") {
      typeIcon = "🌎 Attractions";
    } else if (spot.type === "Drive") {
      typeIcon = "🚘 Drive";
    }

    this.#ratingStars = ratingStars;
    this.#typeIcon = typeIcon;

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
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _renderSpot(spot) {
    let html = `<li class="container spot">
    <div class="spot-details grid">
      <span class="spot-date">2023 09 18</span>
      <span class="spot-rating">${this.#ratingStars}</span>
      <span class="spot-type">${this.#typeIcon}</span>
      <span class="spot-place">${spot.place}</span>
      <span class="spot-comment">
      ${spot.comments}</span
      >
    </div>
    <button class="btn btn--list">Delete</button>
  </li>`;
    form.insertAdjacentHTML("afterend", html);
  }

  _renderSpotMarker(spot) {
    L.marker(spot.curCoords)
      .addTo(this.map)
      .bindPopup(`${spot.type} | ${spot.place}`)
      .openPopup();
  }

  _setLocalStorage() {
    localStorage.setItem("spots", JSON.stringify(this.#spots));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("spots"));

    if (!data) return;

    this.#spots = data;

    this.#spots.forEach((spot) => this._renderSpot(spot));
  }
  _removeItem() {
    localStorage.removeItem("spots");
    location.reload();
  }
}

const app = new App();
