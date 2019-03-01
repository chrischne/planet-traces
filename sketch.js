/// <reference path="./p5.global-mode.d.ts" />

var ready = false;
var goldenRatio = 1.61803398875;
var data = [];
var planets = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
let baseUrl = 'http://127.0.0.1:5000/planet/';
let GEO = 'geo';
let HELIO = 'helio';

let radScale = 100;

//Data of a planet
let pdata = [];

let sfMedium;
let sfBold;
let sfLight;
let planetyears = {};
function preload() {
  sfLight = loadFont('assets/SF-Pro-Text-Light.otf');
  sfMedium = loadFont('assets/SF-Pro-Text-Medium.otf');
  sfBold = loadFont('assets/SF-Pro-Display-Bold.otf');
  planetyears = loadJSON('planetyears.json');
}

function setup() {
  createCanvas(800, 600);
  noLoop();

  //set start and end date
  let startDate = new Date(2000, 0, 1);
  let endDate = new Date(startDate);
  let days = 80;
  let incDays = 1;
  endDate.setDate(startDate.getDate() + days);
  loadData('mercury', HELIO, startDate,endDate,incDays);
}

function draw() {
  
  if(!ready){
    background('red');
    return;
  }
  
  background('rgb(250,250,250)');

  let scl = 100;
  push();
  translate(width/2,height/2);
  drawPlanet(pdata,scl);
  pop();

}

function drawPlanet(pdata,scl){

  push();



  //draw the sun
  fill(0);
  ellipse(0,0,3,3);

  noFill();
  stroke(0);
  beginShape();
  _.each(pdata,d=>{
      let angle = d.pos;
    
      let r = scl*d.distance;//map(pdata.distance, 0, maxDistance, 0, maxRadius);

      let v = p5.Vector.fromAngle(radians(angle), r);

      console.log(r,angle,v.x,v.y);
      vertex(v.x, v.y);
  });
  endShape();
  pop();
}

function loadData(planetName,mode,startDate,endDate,incDays){

  ready = false;
  currentDate = new Date(startDate);
  var promises = [];
  let count = 0;
  while (currentDate < endDate) {
  
    currentDate.setDate(currentDate.getDate() + incDays);
  
    let date = currentDate;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let url = baseUrl + mode + '/' + planetName + '/' + [day, month, year].join('/');
   
    promises.push(d3.json(url))

    count++;
  }

  Promise.all(promises).then(function (values) {
    console.log('Promise.all');

    pdata = values;
    console.log('pdata',pdata);
    ready = true;
    redraw();

  });
}

function planetsHeliocentric() {
  //draw all the planets, their traces over a period of time 
  //drawing those traces, in a grid style

  let inc = 10;

  let mode = GEO;

  let planetMap = new Map();


  var promises = [];
  for (let i = 0; i < planets.length; i++) {

    const focusPlanet = planets[i];

    let startDate = new Date(2000, 0, 1);
    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + planetyears[focusPlanet]);
    console.log('===', focusPlanet, '===');
    console.log('startdate', startDate);
    console.log('enddata', endDate);
    let currentDate = startDate;

    currentDate = new Date(startDate);

    let count = 0;


    while (currentDate < endDate) {

      currentDate.setDate(currentDate.getDate() + inc);
      // console.log('count',count,currentDate);
      let date = currentDate;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let url = baseUrl + mode + '/' + focusPlanet + '/' + [day, month, year].join('/');
      promises.push(d3.json(url))

      count++;
    }
  }

  Promise.all(promises).then(function (values) {
    console.log('Promise.all');

    planets.forEach(p => {
      let arr = values.filter(v => {
        return v.name == p;
      });
      planetMap.set(p, arr);
    });
    console.log('planetMap');
    console.log(planetMap);
    drawPlanets(planetMap);

  });
}

function drawPlanets(planetMap) {
  console.log('draw planets');
  //draw the planets
  let entries = planetMap.entries();
  let x = 0;
  let y = 0;
  let maxRadius = 100;
  let plutoData = planetMap.get('pluto');
  console.log('plutoData');
  console.log(plutoData);
  let maxDistance = d3.max(plutoData, d => {
    return d.distance;
  });
  console.log('maxDistance', maxDistance);
  push();
  translate(200, 200);
  for (let [key, value] of entries) {
    //console.log(key,value);
    let planetName = key;
    let planetData = value;

    push();
    translate(x, y);
    //draw the sun
    fill(0);
    noStroke();
    ellipse(0, 0, 2, 2);
    noFill();
    stroke(0);
    beginShape();
    //console.log('hihi',planetData.length);
    for (let i = 0; i < planetData.length; i++) {
      const pdata = planetData[i];
      let angle = pdata.pos;
      let r = map(pdata.distance, 0, maxDistance, 0, maxRadius);

      let v = p5.Vector.fromAngle(radians(angle), r);

      vertex(v.x, v.y);
    }
    endShape();
    pop();

    x += maxRadius * 2;
    if (x > width - 200) {
      x = 0;
      y += maxRadius * 2;
    }
  }
  pop();
}
