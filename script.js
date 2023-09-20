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
  #spots = [];
  #typeIcon = "";
  #ratingStars = "";

  constructor() {
    this._getPosition();
    this._getLocalStorage();
    btnForm.addEventListener("click", this._newSpot.bind(this));
    btnDel.forEach((btn) => {
      btn.addEventListener("click", this._deleteSpot.bind(this));
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
    console.log(this.#spots);

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
        this.#typeIcon = "🍷 Bar & Pub";
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
  _deleteSpot(e) {
    const list = e.target.parentElement;

    this.#spots = this.#spots.filter((spot) => spot.id !== parseInt(list.id));
    list.remove();
    this._setLocalStorage();
  }
  _renderSpot(spot) {
    this._replaceStars(spot);
    this._replaceTypes(spot);

    let html = `<li class="container spot">
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
    <button class="btn btn--list">Delete</button>
  </li>`;
    form.insertAdjacentHTML("afterend", html);
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

    L.marker(spot.curCoords, { icon: myIcon })
      .addTo(this.map)
      .bindPopup(
        L.popup({
          maxWidth: 400,
          closeOnClick: false,
          closeButton: true,
          autoClose: false,
          className: "popup-map",
        })
      )
      .setPopupContent(`${this.#typeIcon} | ${this.#ratingStars}`)
      .openPopup();
  }

  _setLocalStorage() {
    localStorage.setItem("spots", JSON.stringify(this.#spots));
  }

  _getLocalStorage(spot) {
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
