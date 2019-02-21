/// <reference path="./p5.global-mode.d.ts" />

var ready = false;
var goldenRatio = 1.61803398875;
var data = [];
//var planets = ['sun', 'mercury', 'venus', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
var planets = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
let focusPlanet = 'mars';
let focusPlanet2 = 'venus';
let baseUrl = 'http://127.0.0.1:5000/planet/';
let GEO = 'geo';
let HELIO = 'helio';
//let mode = GEO;

// let startDate = new Date(2000, 0, 1);
// let endDate = new Date(2001, 0, 1);
//let currentDate = startDate;

let radScale = 100;

//let prevPos = null;
//let pos = null;
// let positions = [];
// let positions2 = [];

// let pos1 = null;
// let pos2 = null;

// let slider;

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
  createCanvas(1200, 5000);
console.log(planetyears);
  noLoop();
  // slider = createSlider(startDate.getTime(), endDate.getTime(), startDate.getTime(), 1);
  // slider.position(100, 30);
  // slider.style('width', '400px');
  // slider.input(update);


  //setInterval(update, 100);


  // let url = baseUrl + GEO + '/mercury/' + [1,1,1999].join('/');
  // console.log(url);
  // console.log(startDate);
  // console.log(endDate);
  //loadJSON()

}

function draw() {
  background('rgb(250,250,250)');

  // let val = slider.value();
  // let date = new Date(val);

  //let date = currentDate;
  // noStroke();
  // fill(0);
  // text(date.toDateString(), 100, 70);

 // push();
  //translate(200, 500);
  planetsHeliocentric();
  // planetsGeocentric();
  // planetPairsHeliocentric();
  // planetPairsGeocatric();
 // pop();


  //console.log(date);
  // push();
  // translate(width/2,height/2);
  // noFill();
  // stroke(0);
  // beginShape();
  // for (let i = 0; i < positions.length; i++) {
  //   const pos = positions[i];
  //   vertex(pos.x,pos.y);
  // }
  // endShape();
  // pop();

  // push();
  // translate(width/2,height/2);
  // noFill();
  // stroke(0);
  // let p1 = _.last(positions);
  // let p2 = _.last(positions2);
  // if(!p1 || !p2){
  //   return;
  // }
  // ellipse(p1.x,p1.y,3,3);
  // ellipse(p2.x,p2.y,3,3);
  // line(p1.x,p1.y,p2.x,p2.y);
  // pop();

  // push();
  // translate(width / 2, height / 2);

  //draw the sun
  // fill(0);
  // ellipse(0,0,10,10);
  // noFill();
  // stroke(0, 10);
  // for (let i = 0; i < positions.length; i++) {
  //   const p1 = positions[i];
  //   const p2 = positions2[i];
  //   line(p1.x, p1.y, p2.x, p2.y);
  // }
  // pop();

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
    endDate.setDate(startDate.getDate()+planetyears[focusPlanet]);
    console.log('===',focusPlanet,'===');
    console.log('startdate',startDate);
    console.log('enddata',endDate);
    let currentDate = startDate;

    currentDate = new Date(startDate);

    let count = 0;


    while (currentDate < endDate ) {

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
    //console.log(values);
    // planetMap.set(focusPlanet, values);
    // console.log('===', focusPlanet, '===');
    // console.log(planetMap.get(focusPlanet));

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

function drawPlanets(planetMap){
  console.log('draw planets');
  //draw the planets
  let entries = planetMap.entries();
  let x = 0;
  let y = 0;
  let maxRadius = 100;
  let plutoData = planetMap.get('pluto');
  console.log(plutoData);
  let maxDistance = d3.max(plutoData,d=>{
    return d.distance;
  });
  console.log('maxDistance',maxDistance);
  push();
  translate(200,200);
  for (let [key, value] of entries) {
    //console.log(key,value);
    let planetName = key;
    let planetData = value;


    push();
    translate(x,y);
    //draw the sun
    fill(0);
    noStroke();
    ellipse(0,0,2,2);
    noFill();
    stroke(0);
    beginShape();
    //console.log('hihi',planetData.length);
    for (let i = 0; i < planetData.length; i++) {
      const pdata = planetData[i];
      let angle = pdata.pos;
      let r = map(pdata.distance,0,maxDistance,0,maxRadius);
      
      let v = p5.Vector.fromAngle(radians(angle), r);

      vertex(v.x, v.y);
    }
    endShape();
    pop();
   
    x+=maxRadius*2;
    if(x>width-200){
      x=0;
      y+=maxRadius*2;
    }
  }
  pop();
}

function update() {
  console.log('hi');
  //let val = slider.value();
  // let date = new Date(val);
  currentDate.setDate(currentDate.getDate() + 5);
  let date = currentDate;
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let url1 = baseUrl + mode + '/' + focusPlanet + '/' + [day, month, year].join('/');
  let url2 = baseUrl + mode + '/' + focusPlanet2 + '/' + [day, month, year].join('/');
  console.log(url1);
  console.log(url2);
  pos1 = null;
  pos2 = null;
  loadJSON(url1, updatePos1);
  loadJSON(url2, updatePos2);
}

// function updatePos(planet){

//   if(!pos1){
//     updatePos1(planet);
//   }
//   else if(pos1 && !pos2){
//     updatePos2(planet);
//   }

// }

function updatePos1(planet) {
  console.log('updatePos1');
  let angle = planet.pos;
  let r = radScale * planet.distance;
  let v = p5.Vector.fromAngle(radians(angle), r);
  pos1 = v;
  positions.push(v);
  tryRedraw();
}

function updatePos2(planet) {
  console.log('updatePos2');
  let angle = planet.pos;
  let r = radScale * planet.distance;
  let v = p5.Vector.fromAngle(radians(angle), r);
  pos2 = v;
  positions2.push(v);
  tryRedraw();
}

function tryRedraw() {
  if (pos1 && pos2) {
    pos1 = null;
    pos2 = null;
    redraw();
  }
}
