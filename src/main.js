const WIDTH = 480;
const HEIGHT = 320;
const APP_FPS = 30;

// init
let app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});
let canvas = document.getElementById("canvas");
canvas.appendChild(app.view);
app.renderer.backgroundColor = 0x000000;
app.stage.interactive = true;
app.ticker.remove(app.render, app);
const fpsDelta = 60 / APP_FPS;

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

PIXI.loader.add("bg_data", ASSET_BG);
PIXI.loader.add("obj_data", ASSET_OBJ);
PIXI.loader.add("obj_nose", ASSET_NOSE);
PIXI.loader.add("obj_target", ASSET_TARGET);
PIXI.loader.load(onAssetsLoaded);

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
    "atan2(), atan() Test\nWhy can't you use atan ()?\n(PixiJS 4.8.9)",
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
  let ticker = PIXI.ticker.shared;
  ticker.autoStart = false;
  ticker.stop();
  PIXI.settings.TARGET_FPMS = 0.06;
  app.ticker.add(tick);
}

/**
 * adjust fps
 * @param { number } delta time
 */
const tick = delta => {
  // console.log(delta);
  elapsedTime += delta;

  if (elapsedTime >= fpsDelta) {
    //enough time passed, update app
    update(elapsedTime);
    //reset
    elapsedTime = 0;
  }
};

/**
 * app rendering
 * @param { number } delta time
 */
const update = delta => {
  // console.log("delta: ", delta);

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
  obj2.rotation = radian2 + 1.5707963267948966; // radian
  // PIXI ver.5 ok
  // let degree = (radian2 * 180) / Math.PI;
  // obj2.angle = degree + 90; // 'angle' use degree, 90 is for default right direction (x: 0, direction from the eye)

  // nose rotation(atan test, not atan2), This result explains, why use atan2 instead of atan?
  let dx3 = point.x - obj3.x;
  let radian3 = Math.atan(dx3);
  obj3.rotation = radian3 + 1.5707963267948966;

  // render
  app.render();
};
