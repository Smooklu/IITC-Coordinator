let authkey = localStorage['auth_key']
let url = localStorage['server_url']
let players = {}
let playerMarkerGroup = L.layerGroup([]);

async function getData(auth_key, url) {
    let response = await fetch(url + '/get_players', {
        headers: {
            'Authorization': auth_key
        }
    });
    if (response.ok) {
        players = await response.json();
    }
}
async function postData(auth_key, url) {
    let {latitude, longitude} = (await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej))).coords;
    await fetch(url + '/heartbeat', {
        method: 'POST',
        headers: {
            'Authorization': auth_key,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({status: 'n/a', lat:  latitude, lng: longitude})
    });
}
function deleteAndCreate(marker_array) {
    marker_array.clearLayers();
    Object.entries(players).forEach(addPlayerMarker)
    playerMarkerGroup.addTo(map)
}
function addPlayerMarker([name, data]) {
    var marker = new L.Marker([data['lat'], data['lng']]);
    marker.bindTooltip(name, { permanent: true })
    playerMarkerGroup.addLayer(marker)
}
setInterval(async () => {
    await postData(authkey, url);
    await getData(authkey, url);
    deleteAndCreate(playerMarkerGroup);
}, 1000)
