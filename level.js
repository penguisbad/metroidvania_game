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
            entity.reset();
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

    // no movement abilities

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

    let s3_3_boss = new Scene();
    s3_3_boss.addEntities([
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
        new Platform(1180, 50, 20, 400),
        new Platform(400, 100, 20, 450),
        new Platform(50, 450, 50, 20),
        new Platform(250, 350, 50, 20),
        new Platform(100, 200, 50, 20),
        new Platform(200, 100, 200, 20),
        new Platform(500, 50, 20, 400),
        new Platform(550, 400, 50, 20),
        new Platform(700, 300, 50, 20),
        new Platform(900, 200, 50, 20),
        new Platform(1000, 100, 20, 450)
    ]);

    let s5_3 = new Scene();
    s5_3.addEntities([
        new Platform(0, 0, 100, 50),
        new Platform(200, 0, 1000, 50),
        new Platform(0, 50, 20, 400),
        new Platform(1180, 200, 20, 450),
        new Platform(0, 550, 300, 50),
        new Platform(400, 400, 100, 20),
        new Platform(600, 300, 100, 20),
        new Platform(800, 200, 400, 20),
        new Platform(0, 300, 100, 20),
        new Platform(100, 150, 100, 20),
        new BasicEnemy1(800, 100, 300),
        new Gate(1180, 50, 20, 150, "button gate 2"),
        new ShootingEnemy1(50, 100)
    ]);

    let s5_4 = new Scene();
    s5_4.addEntities([
        new Platform(0, 50, 20, 350),
        new Platform(1180, 0, 20, 450),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 0, 300, 50),
        new Platform(100, 100, 1000, 20),
        new Platform(590, 100, 20, 450),
        new Platform(0, 250, 500, 20),
        new Platform(700, 250, 500, 20),
        new Platform(200, 400, 800, 20),
        new ShootingEnemy1(500, 450),
        new ShootingEnemy1(680, 450),
        new BasicEnemy1(100, 150, 300),
        new BasicEnemy1(700, 150, 400)
    ]);

    let s4_4 = new Scene();
    s4_4.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(1180, 50, 20, 350),
        new Platform(1000, 400, 50, 20),
        new Platform(900, 300, 50, 20),
        new Platform(800, 200, 50, 20),
        new Platform(700, 150, 20, 400),
        new Platform(100, 50, 20, 400),
        new Platform(200, 150, 500, 20),
        new Platform(100, 300, 500, 20),
        new Platform(200, 450, 500, 20),
        new BasicEnemy1(250, 100, 400),
        new BasicEnemy1(150, 200, 400),
        new BasicEnemy1(250, 400, 400)
    ]);

    let s3_4 = new Scene();
    s3_4.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 50, 20, 500),
        new Platform(1000, 400, 100, 20),
        new Platform(500, 300, 400, 100),
        new Platform(0, 200, 400, 100),
        new Button(20, 100, 20, 50, "button gate 1"),
        new ShootingEnemy1(700, 200),
        new ShootingEnemy1(200, 100)
    ]);

    let s6_4 = new Scene();
    s6_4.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 50, 20, 400),
        new Platform(1180, 150, 20, 400),
        new Platform(0, 450, 1000, 20),
        new Gate(100, 470, 20, 80, "button gate 1"),
        new Platform(800, 300, 100, 20),
        new Platform(0, 200, 300, 50),
        new Platform(400, 200, 300, 50),
        new Button(20, 100, 20, 50, "button gate 2")
    ]);

    let s6_3 = new Scene();
    s6_3.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 200, 20, 450),
        new Platform(50, 400, 50, 20),
        new Platform(150, 300, 300, 100),
        new Platform(600, 300, 300, 100),
        new Platform(1000, 300, 200, 100)
    ]);

    let s7_3 = new Scene();
    s7_3.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 300, 100, 100),
        new Platform(200, 300, 300, 100),
        new Platform(600, 300, 300, 100),
        new Platform(1000, 300, 300, 100)
    ]);

    let s8_3 = new Scene();
    s8_3.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 500, 50),
        new Platform(0, 300, 350, 100),
        new Platform(450, 200, 50, 350),
        new Platform(600, 550, 600, 50),
        new Platform(600, 200, 50, 350),
        new Platform(1100, 200, 100, 20),
        new Platform(750, 200, 100, 20),
        new Platform(650, 350, 50, 20),
        new Platform(1180, 200, 20, 350)
    ]);

    let s8_4_boss = new Scene();
    s8_4_boss.addEntities([
        new Platform(0, 0, 500, 50),
        new Platform(600, 0, 600, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 50, 20, 400),
        new Platform(1180, 50, 20, 500),
        new Gate(0, 450, 20, 100, "dashBoss gate"),
        new DashBoss(500, 500, {x: 20, y: 50, width: 1160, height: 500})
    ]);

    let s7_4 = new Scene();
    s7_4.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 150, 20, 400),
        new Platform(1180, 50, 20, 400),
        new Platform(0, 250, 100, 20),
        new Platform(100, 450, 100, 20),
        new Platform(600, 200, 20, 350),
        new Platform(600, 200, 500, 20),
        new Platform(700, 350, 500, 20)
    ]);

    // dash ability

    let s9_3 = new Scene();
    s9_3.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1100, 50),
        new Platform(0, 200, 20, 350),
        new Platform(1180, 200, 20, 400),
        new Platform(200, 50, 20, 400),
        new Platform(150, 350, 150, 20),
        new Platform(500, 300, 100, 100),
        new Platform(800, 200, 100, 100),
        new Platform(1000, 200, 20, 350),
        new Platform(1100, 400, 100, 20)
    ]);

    let s9_4_boss = new Scene();
    s9_4_boss.addEntities([
        new Platform(0, 0, 1100, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 50, 20, 500),
        new Platform(1180, 0, 20, 450),
        new Gate(1180, 450, 20, 100, "+10 hp boss gate 1"),
        new Plus10HPBoss1(500, 500, {x: 20, y: 50, width: 1160, height: 500})
    ]);

    let s10_4 = new Scene();
    s10_4.addEntities([
        new Platform(0, 0, 20, 450),
        new Platform(1180, 0, 20, 550),
        new Platform(0, 550, 1200, 50),
        new Platform(200, 450, 100, 20),
        new Platform(500, 300, 100, 20),
        new Platform(900, 250, 100, 20),
        new Platform(1000, 100, 100, 20)
    ]);

    let s10_3 = new Scene();
    s10_3.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 200, 20, 350),
        new Platform(1180, 50, 20, 550),
        new Platform(1100, 500, 100, 20),
        new Platform(800, 350, 100, 20),
        new Platform(400, 300, 100, 20),
        new Platform(100, 200, 100, 20)
    ]);

    let s5_2 = new Scene();
    s5_2.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 100, 50),
        new Platform(200, 550, 1000, 50),
        new Platform(0, 50, 20, 500),
        new Platform(300, 400, 100, 50),
        new Platform(500, 300, 300, 50),
        new Platform(900, 200, 300, 100),
        new ChargingEnemy1(500, 100, 250)
    ]);
    
    let s6_2 = new Scene();
    s6_2.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 200, 400, 100),
        new Platform(700, 250, 50, 20),
        new Platform(1000, 200, 200, 100)
    ]);

    let s7_2 = new Scene();
    s7_2.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 200, 100, 100),
        new Platform(400, 300, 50, 50),
        new Platform(600, 150, 50, 50),
        new Platform(900, 300, 50, 50),
        new Platform(1100, 150, 100, 50)
    ]);

    let s8_2 = new Scene();
    s8_2.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 150, 200, 50),
        new Platform(400, 200, 100, 50),
        new Platform(800, 300, 100, 50),
        new Platform(1100, 250, 100, 50)
    ]);

    let s9_2 = new Scene();
    s9_2.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 250, 300, 50),
        new Platform(500, 300, 700, 100),
        new BasicEnemy2(500, 200, 550)
    ]);

    let s10_2 = new Scene();
    s10_2.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 300, 100, 100),
        new Platform(100, 200, 50, 50),
        new Platform(200, 100, 50, 50),
        new Platform(400, 50, 20, 150),
        new Platform(500, 300, 300, 50),
        new Platform(1000, 300, 200, 50)
    ]);

    let s11_2 = new Scene();
    s11_2.addEntities([
        new Platform(0, 0, 1200, 50),
        new Platform(0, 550, 1100, 50),
        new Platform(1180, 50, 20, 550),
        new Platform(0, 300, 200, 50),
        new Platform(300, 300, 300, 50),
        new Platform(700, 300, 300, 50),
        new Platform(1050, 300, 50, 150),
        new Gate(1050, 450, 20, 100, "+10 hp boss gate 2")
    ]);

    let s11_3_boss = new Scene();
    s11_3_boss.addEntities([
        new Platform(0, 0, 1100, 50),
        new Platform(0, 550, 1200, 50),
        new Platform(0, 50, 20, 500),
        new Platform(1180, 0, 20, 450),
        new Gate(1180, 450, 20, 100, "+10 hp boss gate 2")
    ]);

    s1_1.setAdjacentScenes(null, null, s2_1, null);
    s2_1.setAdjacentScenes(s1_1, null, s3_1, null);
    s3_1.setAdjacentScenes(s2_1, null, s4_1, null);
    s4_1.setAdjacentScenes(s3_1, null, null, s4_2);
    s4_2.setAdjacentScenes(s3_2, s4_1, null, null);
    s3_2.setAdjacentScenes(null, null, s4_2, s3_3_boss);
    s3_3_boss.setAdjacentScenes(null, s3_2, s4_3, null);
    s4_3.setAdjacentScenes(s3_3_boss, null, s5_3, null);
    s5_3.setAdjacentScenes(s4_3, s5_2, s6_3, s5_4);
    s5_4.setAdjacentScenes(s4_4, s5_3, s6_4, null);
    s4_4.setAdjacentScenes(s3_4, null, s5_4, null);
    s3_4.setAdjacentScenes(null, null, s4_4, null);
    s6_4.setAdjacentScenes(s5_4, null, s7_4, null);
    s6_3.setAdjacentScenes(s5_3, null, s7_3, null);
    s7_3.setAdjacentScenes(s6_3, null, s8_3, null);
    s8_3.setAdjacentScenes(s7_3, null, s9_3, s8_4_boss);
    s8_4_boss.setAdjacentScenes(s7_4, s8_3, null, null);
    s7_4.setAdjacentScenes(s6_4, null, s8_4_boss, null);

    s9_3.setAdjacentScenes(s8_3, null, null, s9_4_boss);
    s9_4_boss.setAdjacentScenes(null, s9_3, s10_4, null);
    s10_4.setAdjacentScenes(s9_4_boss, s10_3, null, null);
    s10_3.setAdjacentScenes(s9_3, null, null, s10_4);

    s5_2.setAdjacentScenes(null, null, s6_2, s5_3);
    s6_2.setAdjacentScenes(s5_2, null, s7_2, null);
    s7_2.setAdjacentScenes(s6_2, null, s8_2, null);
    s8_2.setAdjacentScenes(s7_2, null, s9_2, null);
    s9_2.setAdjacentScenes(s8_2, null, s10_2, null);
    s10_2.setAdjacentScenes(s9_2, null, s11_2, null);
    s11_2.setAdjacentScenes(s10_2, null, null, s11_3_boss);
    s11_3_boss.setAdjacentScenes(null, s11_2, null, null);

    startScene = s9_3;
    currentScene = s9_3;
    currentScene.makeScene();
}