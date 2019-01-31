/// <reference path="./p5.global-mode.d.ts" />

var ready = false;
var goldenRatio = 1.61803398875;
var data = [];
var planets = ['sun', 'mercury', 'venus', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
let focusPlanet = 'venus';
let focusPlanet2 = 'earth';
let baseUrl = 'http://127.0.0.1:5000/planet/';
let GEO = 'geo';
let HELIO = 'helio';
let mode = HELIO;

let startDate = new Date(2000,0,1);
let endDate = new Date(2020,0,1);

let radScale = 200;

//let prevPos = null;
//let pos = null;
let positions = [];
let positions2 = [];

let pos1 = null;
let pos2 = null;

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

  push();
  translate(width/2,height/2);
  noFill();
  stroke(0,100);
  for (let i = 0; i < positions.length; i++) {
    const p1 = positions[i];
    const p2 = positions2[i];
    line(p1.x,p1.y,p2.x,p2.y);
  }
  pop();

}

function update(){
  console.log('hi');
  let val = slider.value();
  let date = new Date(val);
  let day = date.getDate();
  let month = date.getMonth() +1;
  let year = date.getFullYear();
  let url1 = baseUrl + mode + '/' + focusPlanet +'/' + [day,month,year].join('/');
  let url2 = baseUrl + mode + '/' + focusPlanet2 +'/' + [day,month,year].join('/');
  console.log(url1);
  console.log(url2);
  pos1 = null;
  pos2 = null;
  loadJSON(url1,updatePos1);
  loadJSON(url2,updatePos2);
}

// function updatePos(planet){

//   if(!pos1){
//     updatePos1(planet);
//   }
//   else if(pos1 && !pos2){
//     updatePos2(planet);
//   }
 
// }

function updatePos1(planet){
  console.log('updatePos1');
  let angle = planet.pos;
  let r = radScale*planet.distance;
  let v = p5.Vector.fromAngle(radians(angle),r);
  pos1 = v;
  positions.push(v);
  tryRedraw();
}

function updatePos2(planet){
  console.log('updatePos2');
  let angle = planet.pos;
  let r = radScale*planet.distance;
  let v = p5.Vector.fromAngle(radians(angle),r);
  pos2 = v;
  positions2.push(v);
  tryRedraw();
}

function tryRedraw(){
  if(pos1 && pos2){
    pos1 = null;
    pos2 = null;
    redraw();
  }
}
