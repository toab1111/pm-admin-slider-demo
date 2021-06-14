const progressBarElem = document.querySelector('.progress-bar');
const playBtnElem = document.querySelector('.play');
const pauseBtnElem = document.querySelector('.pause');
const textSpan = document.querySelector('#text');
const start_time = document.querySelector('.start-time');
const end_time = document.querySelector('.end-time');
const bt_daily = document.querySelector('.daily');
const bt_realtime = document.querySelector('.realtime');
const slider_time_ele = document.querySelector('.slider-element');
var myTimer;
// var api = "https://www.cusense.net:8082/api/v1/sensorData/realtime/all";
// function check_api(status = 'realtime') {
//     if (status == 'realtime') {
//         var api = "https://www.cusense.net:8082/api/v1/sensorData/realtime/all";
//     } else {
//         var api = "https://cusense.net:8082/api/v1/sensorData/allStation/daily/";
//     }
//     return api
// }

function daily() {
    status = 'daily'
    slider_time_ele.style.display = "block";
    bt_daily.style.display = "none";
}

function realtime() {
    status = 'realtime'
    clearInterval(myTimer);
    PM25.clearLayers();
    getPM()
    slider_time_ele.style.display = "none";
    bt_daily.style.display = "block";
}

bt_daily.addEventListener('click', daily);
bt_realtime.addEventListener('click', realtime);

var min = new Date(Date.now() - (86400000 * 300));
var max = new Date(Date.now() - 86400000);
var picker = new Lightpick({
    field: document.getElementById('demo-6'),
    singleDate: false,
    minDate: min,
    maxDate: max,
    onSelect: pick_date
});



function pick_date(start, end) {
    var str = '';
    str += start ? start.format('Do MMMM YYYY') + ' to ' : '';
    str += end ? end.format('Do MMMM YYYY') : '...';
    startDate = new Date(start.format('MM/DD/YYYY'))
    endDate = new Date(end.format('MM/DD/YYYY'));

    var diffdate = endDate - startDate; //millisecond
    // console.log(diffdate / (1000 * 60 * 60 * 24));
    var diffday = diffdate / (1000 * 60 * 60 * 24) //day

    var dataTime = []
    for (let index = 0; index < diffday + 1; index++) {
        dataTime.push(endDate - ((1000 * 60 * 60 * 24) * index));
    }

    console.log(dataTime);
    var b = progressBarElem;
    var mintime = Math.min.apply(Math, dataTime);
    var maxtime = Math.max.apply(Math, dataTime);;
    b.min = mintime;
    b.max = maxtime;
    b.step = 1000 * 60 * 60 * 24;


    //min
    const formattedMin = getDateMount(mintime);
    start_time.innerHTML = formattedMin;
    //max
    const formattedMax = getDateMount(maxtime);
    end_time.innerHTML = formattedMax;

}



function CreateGeoJson(station) {
    var geojson = {};
    geojson['type'] = 'FeatureCollection';
    geojson['features'] = [];

    for (var key in station) {
        if (station.hasOwnProperty(key)) {
            const lat = station[key].info.lat;
            const lon = station[key].info.lon;
            const station_name = station[key].info.name;
            const time = station[key].data[0].time;
            const pm25 = station[key].data[0].pm25;
            const pm10 = station[key].data[0].pm10;
            const humid = station[key].data[0].humid;
            const temp = station[key].data[0].temp;
            const sensorColor = getSensorColor(station[key].data[0].pm25);
            // console.log("ชื่อ: " + station_name + " พิกัด (" + lat + "," + lon + ")" + " เวลา: " + time + " pm2.5 :" + pm25 + " pm10 :" + pm10);
            var newFeature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [parseFloat(lon),
                        parseFloat(lat)
                    ]
                },
                "properties": {
                    "ชื่อสถานี": station_name,
                    "เวลา": time,
                    "pm2.5": pm25,
                    "pm10": pm10,
                    "ความชื้น": humid,
                    "อุณหภูมิ": temp,
                    "sensorColor": sensorColor
                }
            }
            geojson['features'].push(newFeature);
        }
    }
    return geojson;
}


function createCircleMarker(feature, latlng) {
    const markerHtmlStyles = `
    background-color: ${getColor(feature.properties.sensorColor)};
    color: #fff;
    text-align: center;
    border-radius: 30px;
    border-width: 3px;
    opacity: .95;
    `
    var myIcon = L.divIcon({
        iconSize: L.point(25, 25),
        className: 'pmpoint',
        html: `<div style="${markerHtmlStyles}">${(feature.properties["pm2.5"]).toString()}</div>`
    });

    let options = {
        icon: myIcon
    }
    return new L.marker(latlng, options).addTo(PM25)
}


function onEachFeature(feature, layer) {

    if (feature.properties && (feature.properties["pm2.5"]).toString()) {
        layer.bindPopup('<pre>' + JSON.stringify(feature.properties, null, ' ').replace(/[\{\}"]/g, '') + '</pre>');
    }
}

function getPM(api = "https://www.cusense.net:8082/api/v1/sensorData/realtime/all") {
    const pm = axios({
        method: 'get',
        url: api,
        headers: { 'Access-Control-Allow-Origin': '*', 'X-Gravitee-Api-Key': '785cd5f8-b7b8-4fc6-b500-bd69255fb47d' }
    }).then(function(respone) {
        let station = respone.data;
        geojson = CreateGeoJson(station)
        console.log(geojson);
        L.geoJSON(geojson, {
            pointToLayer: createCircleMarker,
            onEachFeature: onEachFeature
        })
    })
}
getPM()



var startDate = moment(min),
    endDate = moment(max);
pick_date(startDate, endDate)

function getDateMount(time) {
    var textDate = new Date(time);
    const formattedTime = moment(textDate).format('DD/MM');
    return formattedTime
}


function getDateMountYear(time) {
    var textDate = new Date(time);
    const formattedTime = moment(textDate).format('DD/MM/YYYY');
    return formattedTime
}


function getYearMountDate(time) {
    var textDate = new Date(time);
    const formattedTime = moment(textDate).add(1, 'days')
        .format('YYYY-MM-DD');
    return formattedTime
}


function update(t) {
    var textDate = new Date(t);
    date_api = getYearMountDate(textDate);
    textSpan.innerHTML = getDateMountYear(textDate); // 9/17/2016
    start_time.innerHTML = getDateMount(textDate);
    PM25.clearLayers();
    var api = "https://cusense.net:8082/api/v1/sensorData/allStation/daily/" + date_api;
    console.log(api);
    getPM(api)
}


function onTimeUpdate() {
    var t_input = parseInt(this.value);
    update(t_input);

}


function onPlay() {
    clearInterval(myTimer);
    myTimer = setInterval(function() {
        var b = progressBarElem;
        var step = parseInt(progressBarElem.step);
        var value = parseInt(b.value);
        var max = parseInt(b.max);
        var min = parseInt(b.min);
        var t = (+value + step) % (+max + step);
        if (t == 0) { t = +min; }
        progressBarElem.value = +t;
        update(t);
    }, 2100);
}

function onPause() {
    clearInterval(myTimer);
}


progressBarElem.addEventListener('input', onTimeUpdate);
playBtnElem.addEventListener('click', onPlay);
pauseBtnElem.addEventListener('click', onPause);