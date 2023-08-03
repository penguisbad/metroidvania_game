class Projectile extends Entity {

    direction;
    frameCreated;

    constructor(x, y, direction) {
        super(x, y, 7, 7);
        this.direction = direction;
        this.frameCreated = frameCount;
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
                collisionInformation[1].takeDamage();
            }
            this.destroy();
        }
        
    }
    render() {

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Player extends Entity {

    health;
    maxHealth;

    jumpVelocity = 0;
    zKeyPressedPreviousFrame = false;
    cKeyPressedPreviousFrame = false;
    xKeyPressedPreviousFrame = false;
    directionFacing = "left";

    isDashing = false;
    dashFrameCount = 0;
    allowedToDash = true;

    doubleJump = false;
    allowedToDoubleJump = false;

    abilities = {
        "dash": false,
        "doubleJump": false,
        "chargedShot": false,
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
        if (keyMap["z"] && !this.zKeyPressedPreviousFrame && (this.touchingGrond() || this.doubleJump)) {
            this.startJumping();
        }
        if (!keyMap["z"] && this.zKeyPressedPreviousFrame) {
            this.stopJumping();
        }

        if (keyMap["z"] && this.jumpVelocity != 0) {
            this.jump();
        } else {
            this.gravity();
        }

        this.zKeyPressedPreviousFrame = keyMap["z"];
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

        
        if (keyMap["c"] && !this.cKeyPressedPreviousFrame && !this.isDashing && this.allowedToDash) {
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
        this.cKeyPressedPreviousFrame = keyMap["c"];
    }

    shoot() {
        if (this.directionFacing == "right") {
            entities.push(new Projectile(this.x + this.width + 10, this.y + (this.height / 2), "right"));
        }
        if (this.directionFacing == "left") {
            entities.push(new Projectile(this.x - 10, this.y + (this.height / 2), "left"));
        }
        
    }

    checkShoot() {
        if (keyMap["x"] && !this.xKeyPressedPreviousFrame) {
            this.shoot();
        }

        this.xKeyPressedPreviousFrame = keyMap["x"];
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

    update() {
        this.movement();
        this.checkJump();
        this.checkDash();
        this.checkShoot();
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

    render() {
        this.renderHUD();

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "white";
        if (this.directionFacing == "right") {
            ctx.fillRect(this.x + this.width - 5, this.y + 10, 3, 6);
            ctx.fillRect(this.x + this.width - 12, this.y + 10, 3, 6);
        } else {
            ctx.fillRect(this.x + 2, this.y + 10, 3, 6);
            ctx.fillRect(this.x + 9, this.y + 10, 3, 6);
        }
    }
}

