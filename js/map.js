var openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org/copyright ">OpenStreetMap</a> contributors',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    crs: L.CRS.EPSG4326

})

var mapLink = '<a href="http://www.esri.com/ ">Esri</a>',
    wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    mapLinkUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    mapLinkAttr = '&copy; ' + mapLink + ', ' + wholink;

var Satellite = L.tileLayer(mapLinkUrl, {
    attribution: mapLinkAttr,
    crs: L.CRS.EPSG4326
});

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    crs: L.CRS.EPSG4326
});

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    crs: L.CRS.EPSG4326
});

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    crs: L.CRS.EPSG4326
});

var PM25 = L.layerGroup();

var mymap = L.map('mapid', {
    zoomControl: false,
    layers: [googleStreets, PM25],
    timeDimension: true,
    timeDimensionControl: true,
}).setView([13.8, 100.5], 5);



baseMaps = {
    'GoogleStreets': googleStreets,
    'Openstreetmap': openstreetmap,
    'Satellite Geoeye': Satellite,
    'GoogleSat': googleSat,
    'GoogleHybrid': googleHybrid,
}

var positron = new L.Control.MapCenterCoord().addTo(mymap);
var measureControl = new L.Control.Measure({
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'meters',
    primaryAreaUnit: 'sqmeters',
    activeColor: '#b41919',
    completedColor: '#b41919'
});
measureControl.addTo(mymap);
// scale bar
L.control.scale({
    imperial: false
}).addTo(mymap);


L.control.layers(baseMaps).addTo(mymap);

function togglePM25(bool) {
    if (bool) {
        mymap.addLayer(PM25);
        bt_daily.style.display = "inline-block";
        bt_csvdownloader.style.display = "inline-block";
    } else {
        mymap.removeLayer(PM25);
        bt_daily.style.display = "none";
        bt_csvdownloader.style.display = "none";
    }

}

var command = L.control({
    position: 'topright'
});
command.onAdd = function(map) {
    var div = L.DomUtil.create('div');
    div.innerHTML = `
        <div class="leaflet-control-layers leaflet-control-layers-expanded leaflet-control-layers-overlays">
        <form>
        <div class="pretty p-round p-default p-pulse">
            <input id="PM25" onclick=togglePM25(this.checked) type="checkbox" checked></input>
            <div class="state p-success">
                <label>PM2.5</label>
            </div>
        </div>
        <br>
        </form>
        </div>
        `;
    return div;
};
command.addTo(mymap);
