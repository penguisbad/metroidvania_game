class Boss extends Enemy {

    arenaArea;
    isDefeated;
    bossStartFrameCount;

    phase;
    attacks;
    attackIndex;
    attackStartFrame;

    constructor(x, y, maxHealth, damage, size, arenaArea) {
        super(x, y, size, size, maxHealth, damage);
        this.arenaArea = arenaArea;
        this.isDefeated = false;
        this.bossStartFrameCount = frameCount;
        

        this.setOriginalProperties();
        this.setResetImmune();
    }

    update() {
        if (this.isDefeated) {
            return;
        }
        this.gravity();
        this.checkPlayerCollision();

        if (this.attackStartFrame + this.attacks[this.phase][this.attackIndex].length < frameCount) {
            this.attackIndex++;
            this.attackStartFrame = frameCount;
            if (this.attackIndex == this.attacks[this.phase].length) {
                this.attackIndex = 0;
            }
        } 
    }

    setAttacks(attacks) {
        this.attacks = attacks;
        this.attackStartFrame = frameCount;
        this.attackIndex = 0;
        this.phase = Object.keys(this.attacks)[0];
    }

    changePhase(phase) {
        this.phase = phase;
        this.attackIndex = 0;
    }

    destroy() {
        this.isDefeated = true;
        this.width = 0;
        this.height = 0;
    }
}

class FallingPlatform extends PlayerCollisionDamageEntity {
    constructor(x, y, width) {
        super(x, y, width, 20, 30);
    }

    update() {
        this.checkPlayerCollision();
        if (this.frameCreated + 200 > frameCount) {
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
        super(x, y, 150, 50, 50, arenaArea);
        this.setAttacks({"phase 1": [{
            name: "falling platforms",
            length: 500
        },
        {
            name: "follow",
            length: 500
        }],
        "phase 2": [{
            name: "falling platforms + follow",
            length: 1
        }]});
    }

    fallingPlatformsAttack() {
        if (!(frameCount % 300 == 0)) {
            return;
        }
        let pattern = random(3, 5);
        for (let i = 0; i < pattern; i++) {
            let width = i == pattern - 1 ? (this.arenaArea.width / pattern) : (this.arenaArea.width / (pattern + 3));
            let newPlatform = new FallingPlatform(this.arenaArea.x + ((this.arenaArea.width * i) / pattern), this.arenaArea.y + 200, width);
            entities.push(newPlatform);
        }
    }

    update() {
        if (this.isDefeated) {
            return;
        }
        super.update();
        if (this.health < 70) {
            this.changePhase("phase 2");
        }
        switch (this.attacks[this.phase][this.attackIndex].name) {
            case "falling platforms":
                this.fallingPlatformsAttack();
                break;
            case "follow":
                this.follow();
                break;
            case "falling platforms + follow":
                this.fallingPlatformsAttack();
                this.follow();
                break;
            default:
                break;
        }
    }

    follow() {
        if (player.x > this.x) {
            this.move(1, 0);
        }
        if (player.x < this.x) {
            this.move(-1, 0);
        }
    }
    render() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    destroy() {
        gates["firstBoss gate"] = false;
        super.destroy();
    }
}