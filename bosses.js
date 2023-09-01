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

        this.setResetImmuneProperties(["isDefeated", "width", "height"]);
        this.setOriginalProperties();
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

    follow(speed) {
        if (player.x > this.x) {
            this.move(speed, 0);
        }
        if (player.x < this.x) {
            this.move(-speed, 0);
        }
    }

    shoot(projectileSize, projectileDamage, projectileSpeed, startDistanceFromBoss = 1) {
        let projX;
        let direction = player.x > this.x ? "right" : "left";
        if (direction == "right") {
            projX = this.x + this.width + startDistanceFromBoss;
        } else {
            projX = this.x - projectileSize - startDistanceFromBoss;
        }
        let projY = this.y + ((this.height - projectileSize) / 2);
        entities.push(new EnemyProjectile(projX, projY, projectileSize, projectileDamage, direction, projectileSpeed));
    }

    getCurrentAttack() {
        return this.attacks[this.phase][this.attackIndex].name;
    }

    render() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class FallingPlatform extends PlayerCollisionDamageEntity {
    constructor(x, y, width) {
        super(x, y, width, 20, 10);
        this.setOriginalProperties();
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
        super(x, y, 150, 20, 50, arenaArea);
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
        this.setOriginalProperties();
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
        switch (this.getCurrentAttack()) {
            case "falling platforms":
                this.fallingPlatformsAttack();
                break;
            case "follow":
                this.follow(1);
                break;
            case "falling platforms + follow":
                this.fallingPlatformsAttack();
                this.follow(1);
                break;
            default:
                break;
        }
    }

    destroy() {
        gates["firstBoss gate"] = false;
        super.destroy();
    }
}

class Bomb extends PlayerCollisionDamageEntity {

    endSize;
    sizeIncrement;
    delay;
    frameCreated;
    expanding;

    constructor(x, y, startSize, endSize, sizeIncrement, damage) {
        super(x, y, startSize, startSize, damage);
        this.endSize = endSize;
        this.sizeIncrement = sizeIncrement;
        this.frameCreated = frameCount;
        this.expanding = false;
        this.setOriginalProperties();
    }

    update() {
        this.gravity();
        this.checkPlayerCollision();

        if (this.collidedWithAnything()) {
            this.expanding = true;
        }
        if (this.expanding) {
            this.x -= this.sizeIncrement / 2;
            this.y -= this.sizeIncrement / 2;
            this.width += this.sizeIncrement;
            this.height += this.sizeIncrement;
        }
        
        if (this.width > this.endSize) {
            this.destroy();
        }
    }

    render() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class DashBoss extends Boss {

    chargeDirection;
    startingCharge;
    diagonalCharging;
    allowedToPlaceBombs;

    constructor(x, y, arenaArea) {
        super(x, y, 210, 20, 50, arenaArea);
        this.setAttacks({
            "phase 1": [{
                name: "follow + shoot",
                length: 500
            },
            {
                name: "start charging",
                length: 100
            },
            {
                name: "charge",
                length: 50
            },
            {
                name: "stop charging",
                length: 1
            }],
            "phase 2": [{
                name: "follow + shoot",
                length: 300,
            },
            {
                name: "start charging",
                length: 100
            },
            {
                name: "charge",
                length: 50
            },
            {
                name: "shoot after charge",
                length: 1
            }],
            "phase 3": [{
                name: "follow + shoot",
                length: 300,
            },
            {
                name: "start charging",
                length: 100
            },
            {
                name: "charge",
                length: 50
            },
            {
                name: "shoot after charge",
                length: 1
            },
            {
                name: "follow + shoot",
                length: 300
            },
            {
                name: "start charging",
                length: 100
            },
            {
                name: "diagonal charge",
                length: 30
            },
            {
                name: "place bombs",
                length: 1
            }]
        });
        this.diagonalCharging = false;
        this.startingCharge = false;
        this.allowedToPlaceBombs = false;
        this.setOriginalProperties();
    }

    gravity() {
        if (this.diagonalCharging) {
            return;
        }
        super.gravity();
    }

    startCharging() {
        this.chargeDirection = player.x > this.x ? "right" : "left";
        this.startingCharge = true;
    }

    charge() {
        this.startingCharge = false;
        if (this.chargeDirection == "right") {
            this.move(15, 0);
        } else {
            this.move(-15, 0);
        }
    }

    diagonalCharge() {
        this.startingCharge = false;
        this.diagonalCharging = true;
        this.allowedToPlaceBombs = true;
        if (this.chargeDirection == "right") {
            this.move(15, -15);
        } else {
            this.move(-15, -15);
        }
    }

    placeBombs() {
        if (!this.allowedToPlaceBombs) {
            return;
        }
        for (let i = 0; i < 3; i++) {
            let x1 = this.x + (this.width * 2) + (this.width * 3 * i);
            let x2 = this.x - this.width - (this.width * 3 * i);
            if (x1 > this.arenaArea.x && x1 < this.arenaArea.x + this.arenaArea.width) {
                entities.push(new Bomb(x1, this.y + (this.height), 10, 30, 10, 10));
            }
            if (x2 > this.arenaArea.x && x2 < this.arenaArea.x + this.arenaArea.width) {
                entities.push(new Bomb(x2, this.y + (this.height), 10, 30, 10, 10));
            }
            
        }
        
        this.allowedToPlaceBombs = false;
    }

    stopDiagonalCharging() {
        this.diagonalCharging = false;
    }

    update() {
        if (this.isDefeated) {
            return;
        }
        super.update();
        
        if (this.phase == "phase 1" && this.health < 140) {
            this.changePhase("phase 2");
        }
        if (this.phase == "phase 2" && this.health < 70) {
            this.changePhase("phase 3");
        }
        switch (this.getCurrentAttack()) {
            case "follow + shoot":
                this.follow(1);
                if (frameCount % 250 == 0) {
                    this.shoot(20, 10, 5);
                }
                break;
            case "start charging":
                this.startCharging();
                break;
            case "charge":
                this.charge();
                break;
            case "stop charging":
                this.stopDiagonalCharging();
                break;
            case "shoot after charge":
                this.shoot(20, 10, 5);
                this.shoot(10, 5, 7, 30);
                break;
            case "diagonal charge":
                this.diagonalCharge();
                break;
            case "place bombs":
                this.stopDiagonalCharging();
                this.placeBombs();
                break;
            default:
                break;
        }
    }

    draw(x, y, thisEntity) {
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, thisEntity.width, thisEntity.height);
    }

    render() {
        if (this.startingCharge) {
            this.shakeEffect(2, this.draw);
        } else {
            this.draw(this.x, this.y, this);
        }
    }

    destroy() {
        gates["dashBoss gate"] = false;
        player.abilities["dash"] = true;
        super.destroy();
    }
}
class Plus10HPBoss1 extends Boss {

    allowedToSummonBombs;
    deactivateGravity;

    constructor(x, y, arenaArea) {
        super(x, y, 200, 20, 50, arenaArea);
        this.setAttacks({
            "phase 1": [{
                name: "follow",
                length: 200
            },
            {
                name: "summon bombs",
                length: 1
            },
            {
                name: "follow",
                length: 200
            },
            {
                name: "summon bombs",
                length: 1
            },
            {
                name: "follow",
                length: 200
            },
            {
                name: "fly up",
                length: 100,
            },
            {
                name: "faster follow",
                length: 100
            },
            {
                name: "stomp",
                length: 30
            },
            {
                name: "fly up",
                length: 100
            },
            {
                name: "faster follow",
                length: 100
            },
            {
                name: "stomp",
                length: 30
            }]
        });
        this.allowedToSummonBombs = true;
        this.deactivateGravity = false;
        this.setOriginalProperties();
    }

    gravity() {
        if (this.deactivateGravity) {
            return;
        }
        super.gravity();
    }

    summonBombs(amount) {
        if (!this.allowedToSummonBombs) {
            return;
        }
        for (let i = 0; i < amount; i++) {
            let xPosition = random(this.arenaArea.x, this.arenaArea.x + this.arenaArea.width);
            entities.push(new Bomb(xPosition, this.arenaArea.y + 10, 10, 25, 1, 10));
        }
        this.allowedToSummonBombs = false;
    }

    flyUp() {
        if (this.y < this.arenaArea.y + 100) {
            return;
        }
        this.deactivateGravity = true;
        this.move(0, -10);
    }

    stomp() {
        this.move(0, 20);
    }

    update() {
        if (this.isDefeated) {
            return;
        }
        super.update();
        switch (this.getCurrentAttack()) {
            case "follow":
                this.allowedToSummonBombs = true;
                this.deactivateGravity = false;
                this.follow(1);
                break;
            case "summon bombs":
                this.follow(1);
                this.summonBombs(5);
                break;
            case "fly up":
                this.flyUp();
                break;
            case "faster follow":
                this.follow(10);
                break;
            case "stomp":
                this.stomp();
                this.follow(5);
                break;
            default:
                break;
        }
    }

    destroy() {
        gates["+10 hp boss gate 1"] = false;
        player.maxHealth += 10;
        this.isDefeated = true;
    }
}