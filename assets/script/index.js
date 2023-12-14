"use strict";

import { select,onEvent } from "./utils/general.js";
import { MAPBOX_ACCESS_TOKEN } from "./config-token.js";

const DEFAULT_ZOOM = 18;
const DEFAULT_PITCH = 20;

const trackButton = select(".track-button");

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v10",
    center: [-97.1384, 49.8951],
    zoom: DEFAULT_ZOOM,
    pitch: DEFAULT_PITCH,
    bearing: 45,
    attributionControl: false,
    preserveDrawingBuffer: true,
});

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function addElementToMap(map, position, popupHTML) {
    const marker = new mapboxgl.Marker()
        .setLngLat([position.coords.longitude, position.coords.latitude])
        .addTo(map);

    if (popupHTML) {
        new mapboxgl.Popup({ offset: [0, -40] })
            .setLngLat([position.coords.longitude, position.coords.latitude])
            .setHTML(popupHTML)
            .addTo(map);
    }

    return marker;
}

function handleTrackButtonClick() {
    if (navigator.geolocation) {
        getCurrentPosition()
            .then((position) => {
                map.flyTo({
                    center: [position.coords.longitude, position.coords.latitude],
                    essential: true,
                });
                addElementToMap(map, position, "<h1 class='popup-title'>Current Location!</h1>");
            })
            .catch((error) => {
                alert("Error getting location: " + error.message);
            });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

onEvent("click", trackButton, handleTrackButtonClick);

map.on('load', function () {
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));
    map.addControl(new mapboxgl.NavigationControl({showCompass: true}));
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.ScaleControl());

    let layers = map.getStyle().layers;
     
    let labelLayerId;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }
     
    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',
             
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .6
        }
    }, labelLayerId);
});