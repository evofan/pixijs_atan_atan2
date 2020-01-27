const WIDTH = 480;
const HEIGHT = 320;

// init
let app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});
let displayList = document.getElementById("forPixi");
displayList.appendChild(app.view);
app.renderer.backgroundColor = 0x000000;

// v5 ticker
let ticker = PIXI.Ticker.shared;
// Set this to prevent starting this ticker when listeners are added.
// By default this is true only for the PIXI.Ticker.shared instance.
ticker.autoStart = false;
// FYI, call this to ensure the ticker is stopped. It should be stopped
// if you have not attempted to render anything yet.
// ticker.stop();
// Call this when you are ready for a running shared ticker.
// ticker.start();

ticker.add(function(time) {
  // app.renderer;
  // console.log("render...", time);
  update(time);
});
/*
// You may use the shared ticker to render...
let renderer = PIXI.autoDetectRenderer();
let stage = new PIXI.Container();
document.body.appendChild(renderer.view);
ticker.add(function (time) {
    renderer.render(stage);
});
*/

let elapsedTime = 0;
let bg;
let obj1, obj2;
let target;

let container = new PIXI.Container();
container.width = 480;
container.height = 320;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
container.interactive = false;
container.interactiveChildren = true;
app.stage.addChild(container);

// asset property
const ASSET_BG = "images/pic_bg.jpg";
const ASSET_OBJ = "images/pic_eye.png";
const ASSET_NOSE = "images/pic_nose.png";
const ASSET_TARGET = "images/pic_target.png";

// v5 loader
const loader = PIXI.Loader.shared;
loader.add("bg_data", ASSET_BG);
loader.add("obj_data", ASSET_OBJ);
loader.add("obj_nose", ASSET_NOSE);
loader.add("obj_target", ASSET_TARGET);
loader.load((loader, resources) => onAssetsLoaded(loader, resources));

/**
 * Asset load Complete
 * @param { object } loader object
 * @param { object } res asset data
 */
function onAssetsLoaded(loader, res) {
  // BG
  bg = new PIXI.Sprite(res.bg_data.texture);
  container.addChild(bg);
  bg.x = 0;
  bg.y = 0;

  // obj1
  obj1 = new PIXI.Sprite(res.obj_data.texture);
  container.addChild(obj1);
  obj1.anchor.set(0.5);
  obj1.x = WIDTH / 2 - 100;
  obj1.y = HEIGHT / 2;
  obj1.scale.set(1.0);

  // obj2
  obj2 = new PIXI.Sprite(res.obj_data.texture);
  container.addChild(obj2);
  obj2.anchor.set(0.5);
  obj2.x = WIDTH / 2 + 100;
  obj2.y = HEIGHT / 2;
  obj2.scale.set(1.0);

  // obj3
  obj3 = new PIXI.Sprite(res.obj_nose.texture);
  container.addChild(obj3);
  obj3.anchor.set(0.5);
  obj3.x = WIDTH / 2;
  obj3.y = HEIGHT / 2 + 100;
  obj3.scale.set(1.0);

  // target( + )
  target = new PIXI.Sprite(res.obj_target.texture);
  container.addChild(target);
  target.anchor.set(0.5);
  target.x = WIDTH / 2;
  target.y = HEIGHT / 2;
  target.scale.set(1.0);

  // Text
  let text = new PIXI.Text(
    "atan2(), atan() Test\nWhy can't you use atan ()?\n(PixiJS 5.2.0)",
    {
      fontFamily: "Arial",
      fontSize: 30,
      fill: 0xf0fff0,
      align: "center",
      fontWeight: "bold",
      stroke: "#000000",
      strokeThickness: 4,
      dropShadow: false,
      dropShadowColor: "#666666",
      lineJoin: "round"
    }
  );
  container.addChild(text);
  text.x = WIDTH / 2 - text.width / 2;
  text.y = 20;

  // Ticker
  ticker.start(); // render start
}

/**
 * app rendering
 * @param { number } time
 */
const update = time => {
  // console.log("time: ", time);

  // mouse position
  let point = app.renderer.plugins.interaction.mouse.global; // don't use eventlistener
  target.x = point.x;
  target.y = point.y;

  // eye left rotation
  let dx1 = point.x - obj1.x;
  let dy1 = point.y - obj1.y;
  let radian1 = Math.atan2(dy1, dx1);
  obj1.rotation = radian1 + 1.5707963267948966; // 'rotation' use radian, 1.57 .. is for default right direction (x: 0, direction from the eye)

  // eye right rotation
  let dx2 = point.x - obj2.x;
  let dy2 = point.y - obj2.y;
  let radian2 = Math.atan2(dy2, dx2);
  // obj2.rotation = radian2 + 1.5707963267948966; // radian
  // PIXI ver.5 ok
  let degree = (radian2 * 180) / Math.PI;
  obj2.angle = degree + 90; // 'angle' use degree, 90 is for default right direction (x: 0, direction from the eye)

  // nose rotation(atan test, not atan2), This result explains, why use atan2 instead of atan?
  let dx3 = point.x - obj3.x;
  let radian3 = Math.atan(dx3);
  obj3.rotation = radian3 + 1.5707963267948966;
};
