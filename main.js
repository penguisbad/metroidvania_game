const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let entities = [];
let currentScene;
let startScene;
let frameCount = 0;
let player;

let keyMap = {
    "ArrowLeft": false,
    "ArrowRight": false,
    "ArrowDown": false,
    "ArrowUp": false,
    "z": false,
    "x": false,
    "c": false,
    "s": false,
};

document.onkeydown = (event) => {
    keyMap[event.key] = true;
}
document.onkeyup = (event) => {
    keyMap[event.key] = false;
}

//player = new Player(50, 50, 100);
player = new Player(30, 50, 100);
entities.push(player);

try {
    makeLevel();
    setInterval(() => {
        frameCount++;

        ctx.fillStyle = "rgb(50, 50, 50)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        entities.forEach(entity => entity.update());
        entities.forEach(entity => entity.render());
        player.renderHUD();
    }, 10);
} catch (error) {
    alert(error);
}