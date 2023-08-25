let gates = {};

class Platform extends Entity {

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setOriginalProperties();
    }

    update() {
        
    }

    render() {
        ctx.fillStyle = "rgb(80, 80, 80)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Button extends Platform {
    gateIdToDeactivate;

    constructor(x, y, width, height, gateIdToDeactivate) {
        super(x, y, width, height);
        this.gateIdToDeactivate = gateIdToDeactivate;
        this.setOriginalProperties();
    }

    update() {
        if (this.collidedWith(player)) {
            gates[this.gateIdToDeactivate] = false;
        }
    }

    render() {
        ctx.fillStyle = "black"
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Gate extends Platform {
    
    gateId;

    constructor(x, y, width, height, gateId) {
        super(x, y, width, height);
        this.gateId = gateId;
        gates[this.gateId] = true;
        this.setOriginalProperties();
    }

    deactivate() {
        this.width = 0;
        this.height = 0;
    }

    update() {
        if (!gates[this.gateId]) {
            this.deactivate();
        }
    }
    render() {
        ctx.fillStyle = "rgb(30, 30, 30)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Scene {
    entities;
    adjacentScenes;

    constructor() {
        this.entities = [];
    }

    setAdjacentScenes(left, top, right, bottom) {
        this.adjacentScenes = {
            "left": left,
            "top": top,
            "right": right,
            "bottom": bottom
        };
    }

    addEntity(entity) {
        if (!(entity instanceof Platform || entity instanceof Enemy)) {
            throw new Error("Entity added to scene must be a Platform or Enemy");
        }
        this.entities.push(entity);
    }

    addEntities(entitiesToAdd) {
        for (let i = 0; i < entitiesToAdd.length; i++) {
            this.addEntity(entitiesToAdd[i]);
        }
    }

    makeScene() {
        
        this.entities.forEach(entity => {
            if (!(entity instanceof Boss)) {
                entity.reset();
            }
            entities.push(entity);
        });
    }
    deleteScene() {
        entities = entities.filter(entity => !(entity instanceof Platform || entity instanceof Enemy));
    }

    transitionTo(direction) {
        if (this.adjacentScenes[direction] == null) {
            return;
        }
        this.deleteScene();
        this.adjacentScenes[direction].makeScene();
        currentScene = this.adjacentScenes[direction];
    }
}
/*
const makeLevel = () => {
    Object.keys(levelData).forEach(sceneName => {
        console.log(levelData[sceneName]);
        let entitiesToAdd = [];
        levelData[sceneName]["platforms"].forEach(platform => {
            if (typeof(platform[0]) == "string") {
                switch (platform[0]) {
                    case "button":
                        entitiesToAdd.push(new Button(platform[1], platform[2], platform[3], platform[4], platform[5]))
                        break;
                    case "gate":
                        entitiesToAdd.push(new Gate(platform[1], platform[2], platform[3], platform[4], platform[5]));
                        break;
                    default:
                        break;
                }
            } else {
                entitiesToAdd.push(new Platform(platform[0], platform[1], platform[2], platform[3]));
            }
            
        });
        levelData[sceneName]["enemies"].forEach(enemy => {
            switch (enemy[0]) {
                case "basic-1":
                    entitiesToAdd.push(new BasicEnemy1(enemy[1], enemy[2], enemy[3]));
                    break;
                case "charging":
                    entitiesToAdd.push(new ChargingEnemy(enemy[1], enemy[2], enemy[3], enemy[4], enemy[5], enemy[6], enemy[7]));
                    break;
                case "firstBoss":
                    entitiesToAdd.push(new FirstBoss(enemy[1], enemy[2], enemy[3]));
                    break;
                default:
                    break;
            }
        });
        let newScene = new Scene();
        newScene.addEntities(entitiesToAdd);
        level[sceneName] = newScene;
    });
    Object.keys(level).forEach(sceneName => {
        let adjacentScenes = levelData[sceneName]["adjacentScenes"];
        level[sceneName].setAdjacentScenes(level[adjacentScenes[0]], level[adjacentScenes[1]], level[adjacentScenes[2]], level[adjacentScenes[3]]);
    });
    return level;
}
*/

const makeLevel = () => {

    let s1_1 = new Scene();
    s1_1.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 50, 20, 500),
        new Platform(1180, 50, 20, 400),
        new Platform(100, 50, 50, 400),
        new Platform(900, 150, 50, 400),
        new Platform(250, 400, 100, 20),
        new Platform(500, 300, 100, 20),
        new Platform(750, 200, 100, 20)
    ]);

    let s2_1 = new Scene();
    s2_1.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 50, 20, 400),
        new Platform(1180, 250, 20, 300),
        new Platform(20, 400, 1000, 50),
        new Platform(200, 200, 1000, 50),
        new Platform(20, 300, 50, 20),
        new BasicEnemy1(200, 500, 900),
        new BasicEnemy1(100, 300, 800),
        new BasicEnemy1(300, 100, 700)
    ]);

    let s3_1 = new Scene();
    s3_1.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 200, 20, 350),
        new Platform(1180, 150, 20, 400),
        new Platform(200, 50, 20, 400),
        new Platform(800, 150, 50, 400),
        new Platform(500, 400, 100, 20),
        new Platform(300, 300, 100, 20),
        new Platform(400, 150, 400, 20),
        new Platform(900, 50, 20, 400),
        new Platform(950, 400, 100, 20),
        new Platform(1100, 300, 50, 20)
    ]);

    let s4_1 = new Scene();
    s4_1.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1100, 50),
        new Platform(0, 150, 20, 400),
        new Platform(1180, 50, 50, 550),
        new Platform(0, 150, 1100, 20),
        new Platform(100, 450, 1100, 20),
        new Platform(100, 250, 50, 200),
        new Platform(250, 350, 200, 20),
        new BasicEnemy1(100, 100, 800),
        new BasicEnemy1(200, 400, 600)
    ]);

    let s4_2 = new Scene();
    s4_2.addEntities([
        new Platform(0, 0, 1100, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(1180, 0, 20, 550),
        new Platform(1000, 450, 100, 20),
        new Platform(800, 350, 100, 20),
        new Platform(600, 250, 100, 20),
        new Platform(350, 200, 100, 20),
        new Platform(0, 200, 200, 20)
    ]);

    let s3_2 = new Scene();
    s3_2.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(100, 550, 1100, 50),
        new Platform(0, 50, 20, 550),
        new Platform(100, 150, 50, 400),
        new Platform(1100, 200, 100, 20),
        new Platform(800, 300, 100, 20),
        new Platform(500, 300, 100, 20),
        new Platform(250, 200, 100, 20)
    ]);

    let s3_3 = new Scene();
    s3_3.addEntities([
        new Platform(100, 0, 1100, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 0, 20, 550),
        new Platform(1180, 50, 20, 400),
        new Gate(1180, 450, 20, 100, "firstBoss gate"),
        new FirstBoss(500, 500, {x: 20, y: 50, width: 1160, height: 500})
    ]);

    let s4_3 = new Scene();
    s4_3.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 50, 20, 400),
        new Platform(1180, 50, 20, 400)
    ]);

    s1_1.setAdjacentScenes(null, null, s2_1, null);
    s2_1.setAdjacentScenes(s1_1, null, s3_1, null);
    s3_1.setAdjacentScenes(s2_1, null, s4_1, null);
    s4_1.setAdjacentScenes(s3_1, null, null, s4_2);
    s4_2.setAdjacentScenes(s3_2, s4_1, null, null);
    s3_2.setAdjacentScenes(null, null, s4_2, s3_3);
    s3_3.setAdjacentScenes(null, s3_2, s4_3, null);
    s4_3.setAdjacentScenes(s3_3, null, null, null);

    currentScene = s3_3;
    currentScene.makeScene();
}