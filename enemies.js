class PlayerCollisionDamageEntity extends Entity {
    damage;

    constructor(x, y, width, height, damage) {
        super(x, y, width, height);
        this.damage = damage;
    }

    checkPlayerCollision() {
        if (this.collidedWith(player)) {
            player.takeDamage(this.damage);
        }
    }
}

class Enemy extends PlayerCollisionDamageEntity {

    maxHealth;
    health;
    damage;

    constructor(x, y, width, height, maxHealth, damage) {
        super(x, y, width, height);

        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.damage = damage;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }
    gravity() {
        this.move(0, 8);
    }
    
    update() {
    }
    render() {

    }
}

class BasicEnemy extends Enemy {

    paceDistance;
    startX;
    direction;
    paceSpeed;

    constructor(x, y, maxHealth, paceDistance, paceSpeed, damage) {
        super(x, y, 30, 30, maxHealth, damage);
        this.paceDistance = paceDistance;
        this.paceSpeed = paceSpeed;

        this.startX = x;
        this.direction = "right";
        this.setOriginalProperties();
    }

    idle() {
        if (this.x > this.startX + this.paceDistance) {
            this.direction = "left";
        }
        if (this.x < this.startX) {
            this.direction = "right";
        }

        if (this.direction == "right") {
            this.move(this.paceSpeed, 0);
        } else {
            this.move(-this.paceSpeed, 0);
        }
    }

    update() {
        this.checkPlayerCollision();
        this.gravity();
        this.idle();
    }

    render() {

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "white";
        if (this.direction == "right") {
            ctx.fillRect(this.x + this.width - 5, this.y + 10, 3, 3);
            ctx.fillRect(this.x + this.width - 12, this.y + 10, 3, 3);
        } else {
            ctx.fillRect(this.x + 2, this.y + 10, 3, 3);
            ctx.fillRect(this.x + 9, this.y + 10, 3, 3);
        }
    }
}
class BasicEnemy1 extends BasicEnemy {
    constructor(x, y, paceDistance) {
        super(x, y, 10, paceDistance, 3, 30);
    }
}
class ChargingEnemy extends BasicEnemy {

    activationDistance;
    chargeSpeed;
    isCharging;

    constructor(x, y, maxHealth, paceDistance, paceSpeed, activationDistance, chargeSpeed) {
        super(x, y, maxHealth, paceDistance, paceSpeed);
        this.activationDistance = activationDistance;
        this.chargeSpeed = chargeSpeed;
        this.isCharging = false;
        this.setOriginalProperties();
    }

    update() {
        this.checkPlayerCollision();
        this.gravity();

        if (this.distanceTo(player) < this.activationDistance && player.y >= this.y) {
            this.isCharging = true;
        }

        if (this.isCharging) {
            if (player.x > this.x) {
                this.move(this.chargeSpeed, 0);
            } 
            if (this.x > player.x) {
                this.move(-this.chargeSpeed, 0);
            }
        } else {
            this.idle();
        }
    }

}