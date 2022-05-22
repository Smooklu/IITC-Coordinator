let authkey = localStorage['auth_key']
let url = localStorage['server_url']
let players = {}
var markers = []

Object.entries(players).forEach(function (ele) {addPlayerMarker(ele)})

function getData(auth_key, url) {
    let response = fetch(url, {
        headers: {
            'Authorization': auth_key
        }
    })
    if (response.ok) {
        players = response.json()
        
    }
}

function addPlayerMarker(player) {
    if (markers.some(function (ment) { 
        if (ment._id == player) {
            ment.setLatLng([player[1]['lat'], player[1]['lng']])
            return true;
        }
    }));
    else {
        var marker = new L.Marker([player[1]['lat'], player[1]['lng']]);
        marker.bindTooltip(player[0], {permanent: true})
        marker.addTo(map);
        marker._id = player[0]
        markers.push(marker)
    }
}
