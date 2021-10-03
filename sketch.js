// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;

let engine;
let groundLeft;
let groundRight;

let wallLeft;
let wallRight;

let heptagons = [];


function setup() {
  const canvas = createCanvas(700, 700);

  engine = Engine.create();

  // setup ground
  groundLeft = Bodies.rectangle(200, -100, 2000, 200, {
    isStatic: true, angle: Math.PI * 0
  });
  groundRight = Bodies.rectangle(-200, 800, 3000, 200, {
    isStatic: true, angle: Math.PI * 0
  });
  wallLeft = Bodies.rectangle(-50, 450, 100, 1000, {
    isStatic: true, angle: Math.PI * 0
  });
  wallRight = Bodies.rectangle(750, 450, 100, 1000, {
    isStatic: true, angle: Math.PI * -0
  });



  World.add(engine.world, [groundLeft, groundRight, wallLeft, wallRight]);

  // setup mouse
  let mouse = Mouse.create(canvas.elt);
  let mouseParams = {
    mouse: mouse,
    // constraint: { stiffness: 0.05, angularStiffness: 0 }
    constraint: { stiffness: 1, angularStiffness: 0 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();

  World.add(engine.world, mouseConstraint);

  // run simulation
  Engine.run(engine);
}

function draw() {
  background(0);

  fill(255);
  // textAlign(CENTER, CENTER);
  // text('Click: New Body\nDouble Click: Remove Body', width/2, 50);

  noStroke();
  fill(255);
  for (const ball of heptagons) {
    drawBody(ball);
  }

  fill(128);
  drawBody(groundLeft);
  drawBody(groundRight);
  drawBody(wallLeft);
  drawBody(wallRight);
}

function addBody() {
  const newHeptagon = Bodies.polygon(mouseX, mouseY, 7, 77);
  newHeptagon.restitution = 1;
  heptagons.push(newHeptagon);
  World.add(engine.world, newHeptagon);
}

function removeBody() {
  if (mouseConstraint.body) {
    const lastClickedBody = mouseConstraint.body;
    World.remove(engine.world, lastClickedBody);
    heptagons = heptagons.filter(ball => ball !== lastClickedBody);
  }
}

function mouseReleased(event) {
  // single click
  if (event.detail === 1) {
    addBody();
  }
  // double click
  if (event.detail === 2) {
    removeBody();
  }
}
