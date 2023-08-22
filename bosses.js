class Boss extends Enemy {

    arenaArea;
    isDefeated;
    bossStartFrameCount;

    constructor(x, y, maxHealth, damage, size, arenaArea) {
        super(x, y, size, size, maxHealth, damage);
        this.arenaArea = arenaArea;
        this.isDefeated = false;
        this.bossStartFrameCount = frameCount;

        this.setOriginalProperties();
        this.setResetImmune();
    }
}

class FallingPlatform extends PlayerCollisionDamageEntity {
    constructor(x, y, width) {
        super(x, y, width, 20, 30);
    }

    update() {
        this.checkPlayerCollision();
        if (this.frameCreated + 100 > frameCount) {
            return;
        }
        this.move(0, 30, true);
        if (this.y > 800) {
            this.destroy();
        }
    }
    render() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class FirstBoss extends Boss {


    constructor(x, y, arenaArea) {
        super(x, y, 1000, 30, 30, arenaArea);
    }

    fallingPlatformsAttack() {
        
        let pattern = random(2, 6);
        for (let i = 0; i < pattern; i++) {
            let width = i == pattern - 1 ? (this.arenaArea.width / pattern) : (this.arenaArea.width / (pattern + 2));
            let newPlatform = new FallingPlatform(this.arenaArea.x + ((this.arenaArea.width * i) / pattern), this.arenaArea.y + 200, width);
            entities.push(newPlatform);
        }
        
    }

    update() {
        if (frameCount % 150 == 0) {
            this.fallingPlatformsAttack();
        }
    }
    render() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}