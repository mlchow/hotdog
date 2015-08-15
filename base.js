/* Base JS for mapping POI and route shortest distance route. 
 * 
 * Hack the Planet project by Team Hotdog.
 */

var map;

var start =  {lat: 41.71, lng: -87.8};

var totalDistance = 0;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center:  {lat: 41.85, lng: -87.65},
    zoom: 10
  });

  putMarkers();

  path = findPath(start, 0.3);
  totalDistance += dist(start, path[path.length-1]);
  path.push(start);
  console.log("final distance: " + totalDistance);

  console.log(JSON.stringify(path));

  var flightPath = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  flightPath.setMap(map);
}

function dist(p1, p2) {
  return Math.sqrt((p1.lat - p2.lat) * (p1.lat - p2.lat) +
    (p1.lng - p2.lng) * (p1.lng - p2.lng));
}

function putMarkers() {
  for (var pt in points) {
    points[pt].lat -= 0.5;
    points[pt].lng -= 0.5;
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
  if (maxDist - dist(head, start) <= 0) {
    return path;
  }
  if (!path)
    path = [head];
  var min = 9999;
  head.visited = true;
  for (var pt in points) {
    if (points[pt].visited)
      continue;
    var dis = dist(points[pt], head);
    if (dis === 0)
      continue;
    if (dis < min) {
      min = dis;
      minPt = points[pt];
    }
  }
  totalDistance += min;
  console.log("distance: " + totalDistance);

  if (min === 9999) {
    return path; // we've run out of points?
  }
  path.push(minPt);
  return findPath(minPt , maxDist - min, path);
}

var points = [
  {lat: 41.85, lng: -87.65},
  {lat: 41.95, lng: -87.55},
  {lat: 42.05, lng: -87.35},
  {lat: 41.99, lng: -87.45},
  {lat: 42.00, lng: -87.55},
  {lat: 41.90, lng: -87.50}
];