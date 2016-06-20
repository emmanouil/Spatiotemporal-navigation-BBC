var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
/**
 Zoom levels (approx.)
 
    1: World
    5: Landmass/continent
    10: City
    15: Streets
    20: Buildings

 */
    });
}