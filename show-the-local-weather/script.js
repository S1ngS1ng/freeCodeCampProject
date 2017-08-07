var locationObj = {};
var cachedData = {};

// 显示时间和日期。每秒更新一次
getDateTime();
setInterval(getDateTime, 1000);

// 通过 ip 地址获取国家和城市
// 使用 ipinfo.io 服务
httpGetAsync('https://ipinfo.io/json', function(response) {
    var res = JSON.parse(response);

    // 缓存地点信息
    locationObj.city = res.city;
    locationObj.country = res.country;

    // 初始化，使用公制单位
    getWeather(res.city, res.county, 'metric')
});

/* 函数定义 */
// 封装异步 GET 请求
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

// 从 OpenWeatherMap API 获取天气数据
function getWeather(city, country, unit) {
    // 使用 cors-anywhere 处理跨域请求
    // https://github.com/Rob--W/cors-anywhere
    var url = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?APPID=6911d9263aa326b056132d96ecb8c23e';
    // 为请求添加参数：单位、城市、国家和语言
    url += '&units=' + unit +
        '&q=' + city || locationObj.city + ',' +
        country || locationObj.country;
    url += '&lang=zh_cn';

    // 判断请求结果是否缓存
    if (cachedData[unit]) {
        renderPage(cachedData[unit]);
    } else {
        httpGetAsync(url, function(result) {
            cachedData[unit] = JSON.parse(result);
            renderPage(cachedData[unit]);
        });
    }
}

// 获取年月日和时间
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

// 切换单位按钮，点击事件的回调函数
function toggleUnit(ele) {
    var unitArr = ['metric', 'imperial'];
    var currentIndex = unitArr.indexOf(ele.dataset.currentUnit);
    var targetUnit = unitArr[(currentIndex + 1) % 2];

    ele.dataset.currentUnit = targetUnit;
    getWeather(locationObj.city, locationObj.country, targetUnit);
    updateUnit(targetUnit);
}

// 页面加载的函数，在天气数据准备好时调用
function renderPage(res) {
    // 更新第一列（最左）
    updateById('city-name', res.name);
    updateById('current-icon',
        '<i class="wi ' +
        getWeatherIcon(res.weather[0].id) +
        '"></i>');
    updateById('current-description', res.weather[0].description);

    // 更新第二列（中间）
    for (var attr in res.main) {
        updateByQuery(('tr#result-' + attr + '> td.data'), res.main[attr]);
    }

    // 更新第三列（最右）
    updateByQuery('#result-wind-deg > td.icon',
        '<i class="wi wi-wind towards-' + res.wind.deg + '-deg"></i>');
    updateByQuery('#result-wind-speed > td.icon',
        '<i class="wi wi-wind-beaufort-' + parseInt(res.wind.speed) + '"></i>');
}

// 更新天气信息单位
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

// 给 icon 节点添加 class，用于显示天气图标
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

// 封装通过 id 更新节点数据的方法
function updateById(id, data) {
    document.getElementById(id).innerHTML = data;
}

// 封装通过 querySelector 更新节点数据的方法
function updateByQuery(selector, data) {
    document.querySelector(selector).innerHTML = data;
}
