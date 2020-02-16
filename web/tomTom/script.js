var map = tt.map({
    key: 'mDzZ0dKWL3uE5EhuXaAd42G8MrUy2ERP',
    container: 'map',
    style: 'tomtom://vector/1/basic-main',
    dragPan: !window.isMobileOrTablet(),
    center: [-99.98580752275456, 33.43211082128627],
    zoom: 3
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());
function createMarker(icon, position, color, popupText) {
    var markerElement = document.createElement('div');
    markerElement.className = 'marker';
    var markerContentElement = document.createElement('div');
    markerContentElement.className = 'marker-content';
    markerContentElement.style.backgroundColor = color;
    markerElement.appendChild(markerContentElement);
    var iconElement = document.createElement('div');
    iconElement.className = 'marker-icon';
    iconElement.style.backgroundImage =
        'url(https://clipartart.com/images/mario-coin-clipart-7.jpg)';
    markerContentElement.appendChild(iconElement);
    var popup = new tt.Popup({offset: 30}).setText(popupText);
    // add marker to map
    new tt.Marker({element: markerElement, anchor: 'bottom'})
        .setLngLat(position)
        .setPopup(popup)
        .addTo(map);
}
createMarker('accident.colors-white.svg', [-100.72217631449085, 42.73919549715691], '#5327c3', 'SVG icon');
createMarker('accident.colors-white.png', [-99.98580752275456, 33.43211082128627], '#c30b82', 'PNG icon');
createMarker('accident.colors-white.jpg', [-78.17043537427266, 36.31817544230164], '#c31a26', 'JPG icon');

new Foldable('#foldable', 'top-right');
var bounds = new tt.LngLatBounds();
function RoutingAB() {
    this.state = {
        start: undefined,
        finish: undefined,
        marker: {
            start: undefined,
            finish: undefined
        }
    };
    this.startSearchbox = this.createSearchBox('start');
    this.createSearchBox('finish');
    this.closeButton = document.querySelector('.tt-search-box-close-icon');
    this.startSearchboxInput = this.startSearchbox.getSearchBoxHTML().querySelector('.tt-search-box-input');
    this.startSearchboxInput.addEventListener('input', this.handleSearchboxInputChange.bind(this));
    this.createMyLocationButton();
    this.switchToMyLocationButton();
    this.errorHint = new InfoHint('error', 'bottom-center', 5000)
        .addTo(document.getElementById('map'));
}

RoutingAB.prototype.createMyLocationButton = function() {
    this.upperSearchboxIcon = document.createElement('div');
    this.upperSearchboxIcon.setAttribute('class', 'my-location-button');
    this.upperSearchboxIcon.addEventListener('click', function() {
        navigator.geolocation.getCurrentPosition(
            this.reverseGeocodeCurrentPosition.bind(this),
            this.handleError.bind(this)
        );
    }.bind(this));
};
RoutingAB.prototype.handleSearchboxInputChange = function(event) {
    var inputContent = event.target.value;
    if (inputContent.length > 0) {
        this.setCloseButton();
    } else {
        if (this.startSearchbox.getSearchBoxHTML().querySelector('.tt-search-box-result-list')) {
            return;
        }
        this.onResultCleared('start');
    }
};
RoutingAB.prototype.reverseGeocodeCurrentPosition = function(position) {
    this.state.start = [position.coords.longitude, position.coords.latitude];
    tt.services.reverseGeocode({
        key: 'mDzZ0dKWL3uE5EhuXaAd42G8MrUy2ERP',
        position: this.state.start
    })
        .go()
        .then(this.handleRevGeoResponse.bind(this))
        .catch(this.handleError.bind(this));
};
RoutingAB.prototype.handleRevGeoResponse = function(response) {
    var place = response.addresses[0];
    this.state.start = [place.position.lng, place.position.lat];
    this.startSearchboxInput.value = place.address.freeformAddress;
    this.onResultSelected('start');
};
RoutingAB.prototype.calculateRoute = function() {
    if (map.getLayer('route')) {
        map.removeLayer('route');
        map.removeSource('route');
    }
    if (!this.state.start || !this.state.finish) {
        return;
    }
    var startPos = this.state.start.join(',');
    var finalPos = this.state.finish.join(',');
    tt.services.calculateRoute({
        key: 'mDzZ0dKWL3uE5EhuXaAd42G8MrUy2ERP',
        traffic: false,
        locations: startPos + ':' + finalPos
    })
        .go()
        .then(function(response) {
            var geojson = response.toGeoJson();
            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': {
                    'type': 'geojson',
                    'data': geojson
                },
                'paint': {
                    'line-color': '#2faaff',
                    'line-width': 8
                }
            }, this.findFirstBuildingLayerId());
        }.bind(this))
        .catch(this.handleError.bind(this));
};
RoutingAB.prototype.handleError = function(error) {
    this.errorHint.setMessage(error.message ? error.message : error.data.error.description);
};
RoutingAB.prototype.drawMarker = function(type) {
    if (this.state.marker[type]) {
        this.state.marker[type].remove();
    }
    var marker = document.createElement('div');
    var innerElement = document.createElement('div');
    marker.className = 'route-marker';
    innerElement.className = 'icon tt-icon -white -' + type;
    marker.appendChild(innerElement);
    this.state.marker[type] = new tt.Marker({ element: marker })
        .setLngLat(this.state[type])
        .addTo(map);
    this.updateBounds();
};
RoutingAB.prototype.updateBounds = function() {
    bounds = new tt.LngLatBounds();
    if (this.state.start) {
        bounds.extend(tt.LngLat.convert(this.state.start));
    }
    if (this.state.finish) {
        bounds.extend(tt.LngLat.convert(this.state.finish));
    }
    if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { duration: 0, padding: 100 });
    }
};
RoutingAB.prototype.createSearchBox = function(type) {
    var searchBox = new tt.plugins.SearchBox(tt.services.fuzzySearch, {
        showSearchIcon: false,
        searchOptions: {
            key: 'mDzZ0dKWL3uE5EhuXaAd42G8MrUy2ERP'
        },
        placeholder: 'Search for a place...'
    });
    document.getElementById(type + 'SearchBox').appendChild(searchBox.getSearchBoxHTML());
    searchBox.on('tomtom.searchbox.resultselected', this.onResultSelected.bind(this, type));
    searchBox.on('tomtom.searchbox.resultscleared', this.onResultCleared.bind(this, type));
    return searchBox;
};
RoutingAB.prototype.onResultSelected = function(type, event) {
    if (event) {
        var pos = event.data.result.position;
        this.state[type] = [pos.lng, pos.lat];
    }
    if (type === 'start') {
        this.setCloseButton();
    }
    this.drawMarker(type);
    this.calculateRoute();
};
RoutingAB.prototype.onResultCleared = function(type) {
    this.state[type] = undefined;
    if (this.state.marker[type]) {
        this.state.marker[type].remove();
        this.updateBounds();
    }
    if (type === 'start') {
        this.switchToMyLocationButton();
    }
    this.calculateRoute();
};
RoutingAB.prototype.setCloseButton = function() {
    var inputContainer = document.querySelector('.tt-search-box-input-container');
    this.closeButton.classList.remove('hidden');
    if (document.querySelector('.my-location-button')) {
        inputContainer.replaceChild(this.closeButton, this.upperSearchboxIcon);
    }
};
RoutingAB.prototype.switchToMyLocationButton = function() {
    var inputContainer = document.querySelector('.tt-search-box-input-container');
    inputContainer.replaceChild(this.upperSearchboxIcon, this.closeButton);
};
RoutingAB.prototype.findFirstBuildingLayerId = function() {
    var layers = map.getStyle().layers;
    for (var index in layers) {
        if (layers[index].type === 'fill-extrusion') {
            return layers[index].id;
        }
    }
    throw new Error('Map style does not contain any layer with fill-extrusion type.');
};
new RoutingAB();