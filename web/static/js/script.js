// Define your product name and version.
tt.setProductInfo('Codepen Examples', '${analytics.productVersion}');
var map = tt.map({
	key: 'mDzZ0dKWL3uE5EhuXaAd42G8MrUy2ERP',
	container: 'map',
	style: 'tomtom://vector/1/basic-main',
	dragPan: !isMobileOrTablet(),
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