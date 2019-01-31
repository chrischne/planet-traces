/// <reference path="./p5.global-mode.d.ts" />

var ready = false;
var goldenRatio = 1.61803398875;
var data = [];
var planets = ['sun', 'mercury', 'venus', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
let focusPlanet = 'mars';
let baseUrl = 'http://127.0.0.1:5000/planet/';
let GEO = 'geo';
let HELIO = 'helio';

let startDate = new Date(2000,0,1);
let endDate = new Date(2001,0,1);

let radScale = 50000;

//let prevPos = null;
//let pos = null;
let positions = [];

let slider;

let sfMedium;
let sfBold;
let sfLight;
function preload() {
  sfLight = loadFont('assets/SF-Pro-Text-Light.otf');
  sfMedium = loadFont('assets/SF-Pro-Text-Medium.otf');
  sfBold = loadFont('assets/SF-Pro-Display-Bold.otf');
}

function setup() {
  createCanvas(800, 600);
noLoop();
  slider = createSlider(startDate.getTime(),endDate.getTime(),startDate.getTime(),1);
  slider.position(100,100);
  slider.style('width','400px');
  slider.input(update);
 


  // let url = baseUrl + GEO + '/mercury/' + [1,1,1999].join('/');
  // console.log(url);
  // console.log(startDate);
  // console.log(endDate);
  //loadJSON()
  
}

function draw() {
  background('rgb(250,250,250)');
  
  let val = slider.value();
  let date = new Date(val);
  noStroke();
  fill(0);
  text(date.toDateString(),100,100);

  //console.log(date);
  push();
  translate(width/2,height/2);
  noFill();
  stroke(0);
  beginShape();
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    vertex(pos.x,pos.y);
  }
  endShape();
  pop();

}

function update(){
  console.log('hi');
  let val = slider.value();
  let date = new Date(val);
  let day = date.getDate();
  let month = date.getMonth() +1;
  let year = date.getFullYear();
  let url = baseUrl + GEO + '/' + focusPlanet +'/' + [day,month,year].join('/');
  console.log(url);
  loadJSON(url,updatePos);
}

function updatePos(planet){
  console.log('updatePos');
  angle = planet.pos;
  let r = radScale*planet.distance;
  let v = p5.Vector.fromAngle(radians(angle),r);
  positions.push(v);
  redraw();
}
