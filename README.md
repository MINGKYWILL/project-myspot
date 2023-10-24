## User Stories → Features

1. As a user, I want to log new spots information with location, type, rating, place, short reviews and date, so I can keep a list of all my spots.
    
    **→ Geolocation to display map at current location**
    
    **→ Map where user clicks to add new spot**
    
    **→ Form to input type, rating, place, texts and date(today)**
    
2. As a user, I want to see all my spot list at a glance, so I can easily find my spots whenever I want.
    
    **→ Display all spots in a list** 
    
3. As a user, I want to also see my spots on a map, so I can easily see where I have been to.
    
    **→ Display all spots on the map**
    
4. As a user, I want to see all my spots even when I leave the page and come back later, so that I can keep using it over time.
    
    **→ Store input data in the browser using local storage API**
    
    **→ When page loads, read the saved data from local storage and display**
    

## Features → Methods

Geolocation to display map at current location **→ _getPosition(), _loadMap()**

Map where user clicks to add new spot **→_newWorkout()**

Form to input type, rating, place, texts and date(today)

**→ _showForm(), _hideForm()**

Display all spots in a list **→ _renderSpot()**

Display all spots on the map **→ _renderSpotMarker()**

Store input data in the browser using local storage API **→ _setLocalStorage()**

When page loads, read the saved data from local storage and display **→ _getLocalStorage()**
