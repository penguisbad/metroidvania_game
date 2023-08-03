const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let entities = [];
let level = [];
let currentScene;
let frameCount = 0;
let player;

let keyMap = {
    "ArrowLeft": false,
    "ArrowRight": false,
    "ArrowDown": false,
    "ArrowUp": false,
    "z": false,
    "x": false,
    "c": false
};

document.onkeydown = (event) => {
    keyMap[event.key] = true;
}
document.onkeyup = (event) => {
    keyMap[event.key] = false;
}

//player = new Player(30, 700, 100);
player = new Player(30, 50, 100);
entities.push(player);

makeLevel();

currentScene = level["1-1"];
currentScene.makeScene();

setInterval(() => {
    frameCount++;

    ctx.fillStyle = "rgb(50, 50, 50)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // make sure player is rendered on the top
    entities.sort((a, b) => (a instanceof Player) ? 1 : -1);
    
    entities.forEach(entity => entity.update());
    entities.forEach(entity => entity.render());
}, 10);