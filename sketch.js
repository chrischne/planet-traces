/// <reference path="./p5.global-mode.d.ts" />

var ready = false;
var goldenRatio = 1.61803398875;
var data = [];
var planets = ['sun', 'mercury', 'venus', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
let file = 'statistics21022018-1707_planets_set.csv';

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
  
}

function draw() {
  background('rgb(250,250,250)');
  


}
