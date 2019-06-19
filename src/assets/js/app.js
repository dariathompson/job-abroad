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



// Initialize and add the map
function initMap() {
    // The location of San Sebastian
    let philadelphia = {
        lat: 39.9525839,
        lng: -75.1652215
    };
    // The map, centered at Uluru
    let map = new google.maps.Map(
        document.getElementById('ba-map'), {
            zoom: 13,
            center: philadelphia
        });
    
    
    
}





$(document).ready(function (e) {
    initMap();
});

//list of cities
const endpoint =
    "data/data.json";

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


const searchForm = document.getElementById('search-form');
const hostResults = document.getElementById('hostResults');
const cardTmpl = document.getElementById("cardTmpl").innerHTML;

searchForm.addEventListener('submit', displayMatches);

const searchInput = document.getElementById('search');

function displayMatches(event) {
    event.preventDefault();
    const matchArray = findMatches(searchInput.value, cities);
    const markersCoords = [];

    const html = matchArray.map(place => {

        // The marker, positioned at seb
        markersCoords.push(
            {
                lat: place.latitude,
                lng: place.longitude
            }
        );

        let marker = new google.maps.Marker({
            icon: 'assets/img/marker.png',
            position: markersCoords,
            mapTypeId: 'roadmap'
           
        });
        const regex = new RegExp(searchInput.value, 'gi');
        let cardHtml  = cardTmpl
                        .replace(/🦄name🦄/ig, place.personInfo.name)
                        .replace(/🦄city🦄/ig, place.city)
                        .replace(/🦄friends🦄/ig, place.personInfo.friends)
                        .replace(/🦄languages🦄/ig, place.personInfo.languages)
                        .replace(/🦄references🦄/ig, place.personInfo.references)
                        ;

        return cardHtml;


    }).join('');
    hostResults.innerHTML = html;
// The marker, positioned at seb
   
    console.log(markersCoords);  
      
}

const suggestions = document.getElementById("ba-destination");

// searchInput.addEventListener('change', displayMatches);
// searchInput.addEventListener('keyup', displayMatches);

// <li>
    // 	<span class = "name">${place.city}, ${place.state}</span>
    // 	<span class = "population">${place.population}</span>
// </li>

let today = new Date();
console.log(today);


$('[data-toggle="datepicker"]').datepicker({
   format: 'dd.mm.YYYY',
   weekStart: 1,
   startView: 0,
   yearFirst: false,
   yearSuffix: '',
   startDate: today
});
