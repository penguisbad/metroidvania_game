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
        
    }

    render() {

    }
}

class Gate extends Platform {
    
    id;

    constructor(x, y, width, height, id) {
        super(x, y, width, height);
        this.id = id;
        this.setOriginalProperties();
    }

    deactivate() {
        this.width = 0;
        this.height = 0;
    }

    update() {

    }
    render() {
        ctx.fillStyle = "rgb(60, 60, 60)"
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

const makeLevel = () => {
    Object.keys(levelData).forEach(sceneName => {
        console.log(levelData[sceneName]);
        let entitiesToAdd = [];
        levelData[sceneName]["platforms"].forEach(platform => {
            entitiesToAdd.push(new Platform(platform[0], platform[1], platform[2], platform[3]));
        });
        levelData[sceneName]["enemies"].forEach(enemy => {
            switch (enemy[0]) {
                case "basic":
                    entitiesToAdd.push(new BasicEnemy(enemy[1], enemy[2], enemy[3], enemy[4], enemy[5]));
                    break;
                case "charging":
                    entitiesToAdd.push(new ChargingEnemy(enemy[1], enemy[2], enemy[3], enemy[4], enemy[5], enemy[6], enemy[7]));
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