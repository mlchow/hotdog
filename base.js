/* Base JS for mapping POI and route shortest distance route. 
 * 
 * Hack the Planet project by Team Hotdog.
 */

var map;

var start =  {lat: 42, lng: -88};
var totalDistance = 0;

// temp helper variables
var tempDistance = 0;
var tempDuration = 0;

function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById('map'), {
    center:  {lat: 41.85, lng: -87.65},
    zoom: 10
  });
  directionsDisplay.setMap(map);
  putMarkers();

  path = findPath(start, 70);
  console.log("path: " + JSON.stringify(path));
  totalDistance += dist(start, path[path.length-1]);
  path.push(wayover(start));
  console.log("final distance: " + totalDistance);
  console.log("path size: " + path.length);
  

  calculateAndDisplayRoute(directionsService, directionsDisplay);

  /*var flightPath = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  flightPath.setMap(map);*/
}

function wayover(point) {
  point.stopover = true;
  point.visited = true;
  return point;
}

// convert path into loc-only path for purpose of waypoints
// returns a path that only has values of {"lat": x, "lng":y}
function pathToLocPath(path) {
  var locPath = [];
  for (var i=0; i<path.length; i++) {
    var pathPoint = {};
    var coord = new google.maps.LatLng(path[i].lat,
      path[i].lng);
    //var coords = {};
    //coords.lat = path[i].lat;
    //coords.lng = path[i].lng;
    pathPoint.location = coord;
    pathPoint.stopover = true;
    locPath.push(pathPoint);
    console.log("coord added: " + JSON.stringify(coord));
  }
  console.log("locPath: " + locPath);
  return locPath;
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var locPath = pathToLocPath(path);
  directionsService.route({
    origin: start,
    destination: start,
    waypoints: locPath,
    //unitSystem: UnitSystem.IMPERIAL,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
      var routeTotalDistance = 0;
      for (var i = 0; i < route.legs.length; i++) {
        routeTotalDistance += route.legs[i].distance.value;
      }
      console.log("Route distance: " + routeTotalDistance + " miles");
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function dist(p1, p2) {
  getDist(p1, p2);
  console.log("distance: " + tempDistance);
  return tempDistance;
}

function getDist(p1, p2) {
  /*tempDistance = Math.sqrt((p1.lat - p2.lat) * (p1.lat - p2.lat) +
    (p1.lng - p2.lng) * (p1.lng - p2.lng));*/
  //return singleRouteDistance(p1, p2, directionsService, directionsDisplay);
  var origin = new google.maps.LatLng(p1.lat, p1.lng);
  var destination = new google.maps.LatLng(p2.lat, p2.lng);

  /*console.log("origin: " + p1.lat + "," + p1.lng);
  console.log("dest: " + p2.lat + "," + p2.lng);*/

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      durationInTraffic: true,
      avoidHighways: true,
      avoidTolls: true,
    }, distCallback);
}

/*function sendDistanceToVar(dist) {
  tempDistance = dist;
  return tempDistance;
}*/

// callback function for getDist
function distCallback(response, status) {
  if (status == google.maps.DistanceMatrixStatus.OK) {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        tempDistance = element.distance.text;
        //console.log("setting tempDistance to " + tempDistance);
        //tempDuration = element.duration.text;
        var from = origins[i];
        var to = destinations[j];
      }
    }
    /*
    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        var distance = element.distance.text;
        tempDistance = distance;
        //console.log("distance is: " + distance);
        var duration = element.duration.text; // use this later
        tempDuration = duration;
        console.log("duration is: " + duration);
        var from = origins[i];
        var to = destinations[j];
      }
    }*/
  }
}

function putMarkers() {
  for (var pt in points) {
    var marker = new google.maps.Marker({
      position: points[pt],
      map: map,
      title: 'Hello World!'
    });

    marker.setMap(map);
  }
  var startPt = new google.maps.Marker({
    position: start,
    map: map,
    title: "Starting Point"
  });
  marker.setMap(map);
}


function findPath(head, maxDist, path) {
  //alert('findPath' + JSON.stringify(start) + maxDist + JSON.stringify(path));
  var pathHome = dist(head, start);
  console.log("pathHome: " + pathHome);
  if (maxDist - pathHome <= 0) {
    return path;
  }
  if (!path)
    path = [head];
  var min = 9999;
  //head.visited = true;
  for (var pt in points) {
    if (points[pt].visited)
      continue;
    var dis = dist(points[pt], head);
    console.log("DISTANCE: " + dis);
    if (dis === 0)
      continue;
    if (dis < min) {
      min = dis;
      minPt = points[pt];
    }
  }
  console.log("SHOULD NOT BE 9999: " + min);
  totalDistance += min;
  console.log("distance so far: " + totalDistance);

  if (min === 9999) {
    return path; // we've run out of points?
  }
  path.push(wayover(minPt));
  return findPath(minPt , maxDist - min, path);
}

var points = [
  {lat: 42, lng: -88.05},
  {lat: 42, lng: -88.15},
  {lat: 42, lng: -87.95},
  {lat: 42.05, lng: -88},
  {lat: 42.05, lng: -88.05},
  {lat: 42.05, lng: -87.95},
]