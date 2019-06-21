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

import datepicker from '@chenfengyuan/datepicker';

import './lib/slick.min.js';

$(document).foundation();


let map;

// Initialize and add the map
function initMap() {
    // The location of philadelphia
    let philadelphia = {
        lat: 39.9525839,
        lng: -75.1652215
    };
    // The map, centered at philadelphia
    map = new google.maps.Map(
        document.getElementById('ba-map'), {
            zoom: 8,
            center: philadelphia
        });

}

$(document).ready(function (e) {
    initMap();
});
//getting parameter
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function findMatches(wordToMatch, cities) {
    return cities.filter(place => {
        const regex = new RegExp(wordToMatch, 'gi');
        return place.city.match(regex) || place.state.match(regex);
    });
}


//list of cities
const endpoint = "data/data.json";
const cities = [];

const searchForm = document.getElementById('search-form');
const hostResults = document.getElementById('hostResults');
const cardTmpl = document.getElementById("cardTmpl").innerHTML;

searchForm.addEventListener('submit', displayMatches);

const searchInput = document.getElementById('search');

const destination = document.getElementById("ba-destination"); // new
const baHost = document.getElementById("baHost"); // new

//If we come from index page make search


fetch(endpoint)
    .then(blob => blob.json())
    .then(data => {
        cities.push(...data);

        //get parameter query when we go from index to search page
        let query = getUrlParameter('query');
        if (query) {
            searchInput.value = query;
            displayMatches();
        }

    });

function displayMatches(event) {
    if (event) {
        event.preventDefault();
    }

    const matchArray = findMatches(searchInput.value, cities);

    clearMarkers();

    //check if there is city we search for
    if (matchArray.length == 0) {
        baHost.innerHTML = `No hosts`;
        hostResults.innerHTML = '';
    } else {

        const markersCoords = [];

        const html = matchArray.map(place => {

            // The marker, positioned at result
            markersCoords.push({
                lat: place.latitude,
                lng: place.longitude
            });

            // const regex = new RegExp(searchInput.value, 'gi');
            let cardHtml = cardTmpl
                .replace(/🦄name🦄/ig, place.personInfo.name)
                .replace(/🦄city🦄/ig, place.city)
                .replace(/🦄state🦄/ig, place.state)
                .replace(/🦄friends🦄/ig, place.personInfo.friends)
                .replace(/🦄languages🦄/ig, place.personInfo.languages)
                .replace(/🦄references🦄/ig, place.personInfo.references)
                .replace(/🦄img🦄/ig, place.personInfo.img)
                .replace(/🦄room🦄/ig, place.personInfo.accomodaion);

            return cardHtml;
        }).join('');
        hostResults.innerHTML = html;

        // show destination under the map
        destination.innerHTML = `${matchArray[0].city}, ${matchArray[0].state}`;

        // show number of hosts in location
        baHost.innerHTML = `${matchArray.length} hosts in ${matchArray[0].city}, ${matchArray[0].state}`;

        map.markers = [];
        // console.log(markersCoords);
        markersCoords.forEach(coord => {
            let marker = new google.maps.Marker({
                icon: 'assets/img/marker.png',
                position: coord,
                mapTypeId: 'roadmap',
                map: map
            });
            map.markers.push(marker);
        });

        map.setCenter(markersCoords[0]);

    }


}
//clear markers after search
function clearMarkers() {
    if (map.markers) {
        for (var i = 0; i < map.markers.length; i++) {
            map.markers[i].setMap(null);
        }
        map.markers = [];
    }
}

// searchInput.addEventListener('change', displayMatches);
// searchInput.addEventListener('keyup', displayMatches);

// <li>
// 	<span class = "name">${place.city}, ${place.state}</span>
// 	<span class = "population">${place.population}</span>
// </li>

let today = new Date();
// console.log(today);


$('[data-toggle="datepicker"]').datepicker({
    format: 'dd.mm.YYYY',
    weekStart: 1,
    startView: 0,
    yearFirst: false,
    yearSuffix: '',
    startDate: today
});