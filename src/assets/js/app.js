import $ from 'jquery';
import 'what-input';

// Foundation JS relies on a global varaible. In ES6, all imports are hoisted
// to the top of the file so if we used`import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
// require('foundation-sites');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
import './lib/foundation-explicit-pieces';

import './lib/slick.min.js';

$(document).foundation();



// Initialize and add the map
function initMap() {
    // The location of San Sebastian
    let sebastian = {
        lat: 43.318333,
        lng: -1.981231
    };
    // The map, centered at Uluru
    let map = new google.maps.Map(
        document.getElementById('ba-map'), {
            zoom: 13,
            center: sebastian
        });
    // The marker, positioned at Uluru
    let marker = new google.maps.Marker({

        position: sebastian,
        map: map
    });
}





$(document).ready(function (e) {
    initMap();
});

//list of cities
const endpoint =
    'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

const cities = [];

fetch(endpoint)
    .then(blob => blob.json())
    .then(data => cities.push(...data));

function findMatches(wordToMatch, cities) {
    return cities.filter(place => {
        const regex = new RegExp(wordToMatch, 'gi');
        return place.city.match(regex) || place.state.match(regex)
    });
}

function displayMatches() {
    const matchArray = findMatches(this.value, cities);
    const html = matchArray.map(place => {
       
        const regex = new RegExp(this.value, 'gi');
        return `
        <li>
             <span class = "ba-destination-name">${place.city}, ${place.state}</span>
        </li>
        
        `;
    }).join('');
    suggestions.innerHTML = html;
}

const searchInput = document.getElementById('search');
const suggestions = document.getElementById("ba-destination");

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
// <li>
    // 	<span class = "name">${place.city}, ${place.state}</span>
    // 	<span class = "population">${place.population}</span>
// </li>