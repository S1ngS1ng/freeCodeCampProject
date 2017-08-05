var locationObj = {};
var cachedData = {};

// Show date and time, update every second
getDateTime();
setInterval(getDateTime, 1000);

// Get city and country by ip address
httpGetAsync('https://ipinfo.io/json', function(response) {
    var res = JSON.parse(response);

    // Cache location data
    locationObj.city = res.city;
    locationObj.country = res.country;

    // Use 'metric' unit for the first call, as defined in label
    getWeather(res.city, res.county, 'metric')
});

/* Function set */

// Async GET call with Vanilla js
function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send();
}

// Get weather data with OpenWeatherMap API
function getWeather(city, country, unit) {
    // Use cors-anywhere to handle cross-origin
    var url = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?APPID=6911d9263aa326b056132d96ecb8c23e';
    // Append unit, city, country and language to the call
    url += '&units=' + unit +
        '&q=' + city || locationObj.city + ',' +
        country || locationObj.country;
    url += '&lang=zh_cn';

    // Cache response
    if (cachedData[unit]) {
        renderPage(cachedData[unit]);
    } else {
        httpGetAsync(url, function(result) {
            cachedData[unit] = JSON.parse(result);
            renderPage(cachedData[unit]);
        });
    }
}

function getDateTime() {
    var d = new Date();
    var dateString = d.getFullYear() + ' 年 ' +
        (d.getMonth() + 1) + ' 月 ' +
        d.getDate() + ' 日 ';
    var timeString = [d.getHours(), d.getMinutes(), d.getSeconds()].map(function(e) {
        return ('0' + e).slice(-2)
    }).join(':');

    updateById('current-date', dateString);
    updateById('current-time', timeString);
}

// Call back function for toggle switch click event
function toggleUnit(ele) {
    var unitArr = ['metric', 'imperial'];
    var currentIndex = unitArr.indexOf(ele.dataset.currentUnit);
    var targetUnit = unitArr[(currentIndex + 1) % 2];

    ele.dataset.currentUnit = targetUnit;
    getWeather(locationObj.city, locationObj.country, targetUnit);
    updateUnit(targetUnit);
}

// Page render function. Call when data is ready
function renderPage(res) {
    // Update first column
    updateById('city-name', res.name);
    updateById('current-icon',
        '<i class="wi ' +
        getWeatherIcon(res.weather[0].id) +
        '"></i>');
    updateById('current-description', res.weather[0].description);

    // Update second column
    for (var attr in res.main) {
        updateByQuery(('tr#result-' + attr + '> td.data'), res.main[attr]);
    }

    // Right column
    updateByQuery('#result-wind-deg > td.icon',
        '<i class="wi wi-wind towards-' + res.wind.deg + '-deg"></i>');
    updateByQuery('#result-wind-speed > td.icon',
        '<i class="wi wi-wind-beaufort-' + parseInt(res.wind.speed) + '"></i>');
}

function updateUnit(unit) {
    var unitMap = {
        metric: '°C',
        imperial: '°F'
    };
    var unitDOM = document.querySelectorAll('#interface td.unit-temp');
    for (var i = 0; i < unitDOM.length; i++) {
        unitDOM[i].innerHTML = unitMap[unit];
    }
}

// Add class to weather icon
function getWeatherIcon(id) {
    var d = new Date();
    var prefix = 'wi-' + ((d.getHours() >= 7 && d.getHours() <= 19 ? 'day-' : 'night-'));
    var iconMap = {
        701: 'wi-fog',
        711: 'wi-smoke',
        721: 'wi-day-haze',
        731: 'wi-sandstorm',
        741: 'wi-fog',
        751: 'wi-sand',
        761: 'wi-dust',
        762: 'wi-volcano',
        771: 'wi-hurricane',
        781: 'wi-tornado',
        800: 'wi-night-clear',
        900: 'wi-hurricane-warning',
        901: 'wi-storm-warning',
        902: 'wi-hurricane-warning',
        903: 'wi-snowflake-cold',
        904: 'wi-hot',
        905: 'wi-strong-wind',
        906: 'wi-hail',
        951: 'wi-night-clear',
        960: 'wi-storm-warning',
        961: 'wi-storm-warning',
        962: 'wi-hurricane-warning'
    };

    if (iconMap.hasOwnProperty(id)) {
        return iconMap[id];
    } else if (id >= 200 && id <= 232) {
        return prefix + 'thunderstorm';
    } else if (id >= 300 && id <= 321) {
        return prefix + 'sprinkle';
    } else if (id >= 500 && id <= 531) {
        return prefix + 'rain';
    } else if (id === 611) {
        return prefix + 'sleet';
    } else if (id >= 600 && id <= 622) {
        return prefix + 'snow';
    } else if (id >= 801 && id <= 804) {
        return prefix + 'cloudy';
    } else if (id >= 952 && id <= 956) {
        return 'wi-windy';
    } else if (id >= 957 && id <= 959) {
        return 'wi-gale-warning';
    }
    return false;
}

// Update function for element found by id
function updateById(id, data) {
    document.getElementById(id).innerHTML = data;
}

function updateByQuery(selector, data) {
    document.querySelector(selector).innerHTML = data;
}
