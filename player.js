class Projectile extends Entity {

    direction;
    damage;

    constructor(x, y, direction, damage) {
        super(x, y, 7, 7);
        this.direction = direction;
        this.damage = damage;
    }
    update() {
        if (this.direction == "right") {
            this.move(15, 0);
        }
        if (this.direction == "left") {
            this.move(-15, 0);
        }

        let collisionInformation = this.collidedWithAnything(true);
        if (collisionInformation[0] || frameCount > this.frameCreated + 100) {
            if (collisionInformation[1] instanceof Enemy) {
                collisionInformation[1].takeDamage(this.damage);
            }
            this.destroy();
        }
        
        
    }
    render() {

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class ChargedProjectile extends Projectile {
    constructor(x, y, direction, damage) {
        super(x, y, direction, damage);
        this.width = 12;
        this.height = 12;
        entities.push(new Particles(this.width / 2, this.height / 2, this.direction == "right" ? "left": "right", 10, 2, 10, 10, 6, this));
    }
}

class Player extends Entity {

    health;
    maxHealth;

    jumpVelocity = 0;
    directionFacing = "left";

    keysPressedPreviousFrame = {
        "z": false,
        "c": false,
        "x": false,
        "s": false
    };

    isDashing = false;
    dashFrameCount = 0;
    allowedToDash = true;

    doubleJump = false;
    allowedToDoubleJump = false;

    chargedShot = false;
    chargingShot = false;
    startChargingShotFrame;

    abilities = {
        "dash": true,
        "doubleJump": true,
        "chargedShot": true,
    }

    takenDamageFrame = 0;

    constructor(x, y, maxHealth) {
        super(x, y, 30, 30);
        this.health = maxHealth;
        this.maxHealth = maxHealth;
        this.setOriginalProperties();
    }

    gravity() {
        if (this.isDashing) {
            return;
        }
        this.move(0, 10);
    }

    jump() {
        if (this.jumpVelocity <= 0) {
            return;
        }

        this.move(0, -this.jumpVelocity);
        this.jumpVelocity--;
    }
    
    startJumping() {
        this.jumpVelocity = 20;
        if (!this.abilities["doubleJump"]) {
            return;
        }
        if (!this.doubleJump && this.allowedToDoubleJump) {
            this.doubleJump = true;
        } else if (this.doubleJump) {
            this.doubleJump = false;
            this.allowedToDoubleJump = false;
        }
        
    }
    stopJumping() {
        this.jumpVelocity = 0;
    }

    touchingGrond() {;
        return (new Entity(this.x + 1, this.y + this.height + 1, this.width - 2, 1)).collidedWithAnything();
    }

    checkJump() {
        if (this.touchingGrond()) {
            this.allowedToDoubleJump = true;
        }
        if (keyMap["z"] && !this.keysPressedPreviousFrame["z"] && (this.touchingGrond() || this.doubleJump)) {
            this.startJumping();
        }
        if (!keyMap["z"] && this.keysPressedPreviousFrame["z"]) {
            this.stopJumping();
        }

        if (keyMap["z"] && this.jumpVelocity != 0) {
            this.jump();
        } else {
            this.gravity();
        }
    }

    dash() {
        if (this.directionFacing == "left") {
            this.move(-10, 0);
        } else {
            this.move(10, 0);
        }
    }

    checkDash() {
        if (!this.abilities["dash"]) {
            return;
        }
        if (this.collidedWithAnything() && !this.isDashing) {
            this.allowedToDash = true;
        }

        
        if (keyMap["c"] && !this.keysPressedPreviousFrame["c"] && !this.isDashing && this.allowedToDash) {
            this.isDashing = true;
            this.allowedToDash = false;
            this.dashFrameCount = frameCount;
        }
        if (this.isDashing) {
            this.dash();
            if (frameCount > this.dashFrameCount + 10) {
                this.isDashing = false;
            }
        }
    }

    shoot() {
        if (this.directionFacing == "right") {
            entities.push(new Projectile(this.x + this.width + 10, this.y + (this.height / 2), "right", 1));
        }
        if (this.directionFacing == "left") {
            entities.push(new Projectile(this.x - 10, this.y + (this.height / 2), "left", 1));
        }
        
    }

    checkShoot() {
        if (keyMap["x"] && !this.keysPressedPreviousFrame["x"]) {
            this.shoot();
        }
    }

    checkChargedShot() {
        if (!this.abilities["chargedShot"]) {
            return;
        }
        if (keyMap["s"] && !this.keysPressedPreviousFrame["s"]) {
            if (this.chargedShot) {
                if (this.directionFacing == "right") {
                    entities.push(new ChargedProjectile(this.x + this.width + 15, this.y + (this.height / 2) - 2, "right", 5));
                }
                if (this.directionFacing == "left") {
                    entities.push(new ChargedProjectile(this.x - 15, this.y + (this.height / 2) - 2, "left", 5));
                }
                this.chargedShot = false;
            } else {
                this.startChargingShotFrame = frameCount;
                this.chargingShot = true;
            }
            
        }
        let chargedShotReady = this.startChargingShotFrame + 50 < frameCount;
        let sKeyReleased = !keyMap["s"] && this.keysPressedPreviousFrame["s"];
        if (!this.chargedShot && sKeyReleased && chargedShotReady) {
            this.chargedShot = true;
            this.startChargingShotFrame = Number.MAX_SAFE_INTEGER;
        }
        if (sKeyReleased || chargedShotReady) {
            this.chargingShot = false;
        }
    }

    movement() {
        if (keyMap["ArrowRight"]) {
            this.directionFacing = "right";
            this.move(5, 0);
        }
        if (keyMap["ArrowLeft"]) {
            this.directionFacing = "left";
            this.move(-5, 0);
        }
    }

    checkSceneTransition() {
        if (this.x < 0) {
            currentScene.transitionTo("left");
            this.x = canvas.width - this.width;
        }
        if (this.x + this.width > canvas.width) {
            currentScene.transitionTo("right");
            this.x = 0;
        }
        if (this.y < 0) {
            currentScene.transitionTo("top");
            this.y = canvas.height - this.height;
        }
        if (this.y + this.height > canvas.height) {
            currentScene.transitionTo("bottom");
            this.y = 0;
        }
    }
    
    takeDamage(damage) {
        if (this.takenDamageFrame + 20 > frameCount) {
            return;
        }
        this.health -= damage;
        if (this.health <= 0) {
            this.reset();
        }
        this.takenDamageFrame = frameCount;
    }

    heal() {
        if (!(frameCount % 100 == 0)) {
            return;
        }
        this.health += 5;
        if (this.health >= this.maxHealth) {
            this.health = this.maxHealth;
        }
    }

    updateKeysPressedPreviousFrame() {
        Object.keys(this.keysPressedPreviousFrame).forEach(key => {
            this.keysPressedPreviousFrame[key] = keyMap[key];
        });
    }

    update() {
        this.movement();
        this.checkJump();
        this.checkDash();
        this.checkShoot();
        this.checkChargedShot();
        this.updateKeysPressedPreviousFrame();
        this.heal();
        this.checkSceneTransition();
    }

    renderHUD() {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("HP", 10, 30);
        ctx.fillRect(50, 20, this.health * 3, 6);
        ctx.fillRect(50, 22, 300, 2);
        ctx.fillRect(48, 15, 2, 15);
        ctx.fillRect(350, 15, 2, 15);
    }

    renderPlayer(x, y, thisEntity) {
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, thisEntity.width, thisEntity.height);

        ctx.fillStyle = "white";
        if (thisEntity.directionFacing == "right") {
            ctx.fillRect(x + thisEntity.width - 5, y + 10, 3, 6);
            ctx.fillRect(x + thisEntity.width - 12, y + 10, 3, 6);
        } else {
            ctx.fillRect(x + 2, y + 10, 3, 6);
            ctx.fillRect(x + 9, y + 10, 3, 6);
        }
    }

    render() {
        this.renderHUD();
        if (this.chargingShot) {
            this.shakeEffect(2, this.renderPlayer);
        } else {
            this.renderPlayer(this.x, this.y, this);
        }
    }
}

