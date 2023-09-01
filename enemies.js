class PlayerCollisionDamageEntity extends Entity {
    damage;

    constructor(x, y, width, height, damage) {
        super(x, y, width, height);
        this.damage = damage;
        this.setOriginalProperties();
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
            player.heal(this.maxHealth);
            this.destroy();
        }
    }
    gravity() {
        this.move(0, 8);
    }

    drawEyes(direction) {
        ctx.fillStyle = "white";
        if (direction == "right") {
            ctx.fillRect(this.x + this.width - 5, this.y + 10, 3, 3);
            ctx.fillRect(this.x + this.width - 12, this.y + 10, 3, 3);
        } else {
            ctx.fillRect(this.x + 2, this.y + 10, 3, 3);
            ctx.fillRect(this.x + 9, this.y + 10, 3, 3);
        }
    }
    
    update() {
    }
    render() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
        super.render();
        this.drawEyes(this.direction);
    }
}
class BasicEnemy1 extends BasicEnemy {
    constructor(x, y, paceDistance) {
        super(x, y, 10, paceDistance, 2, 10);
    }
}
class BasicEnemy2 extends BasicEnemy {
    constructor(x, y, paceDistance) {
        super(x, y, 16, paceDistance, 5, 10);
    }
}
class ChargingEnemy extends BasicEnemy {

    activationDistance;
    chargeSpeed;
    isCharging;

    constructor(x, y, maxHealth, paceDistance, paceSpeed, activationDistance, chargeSpeed, damage) {
        super(x, y, maxHealth, paceDistance, paceSpeed, damage);
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
                this.direction = "right";
            } 
            if (this.x > player.x) {
                this.move(-this.chargeSpeed, 0);
                this.direction = "left";
            }
        } else {
            this.idle();
        }
    }


}
class ChargingEnemy1 extends ChargingEnemy {
    constructor(x, y, paceDistance) {
        super(x, y, 10, paceDistance, 2, 150, 4, 10);
    }
}
class EnemyProjectile extends PlayerCollisionDamageEntity {

    direction;
    speed;
    frameCreated;

    constructor(x, y, size, damage, direction, speed) {
        super(x, y, size, size, damage);
        this.direction = direction;
        this.speed = speed;
        this.frameCreated = frameCount;
    }

    update() {
        
        this.move(this.direction == "right" ? this.speed : -this.speed);
        this.checkPlayerCollision();
        let collisionInformation = this.collidedWithAnything(true);
        if ((collisionInformation[0] && !(collisionInformation[1] instanceof Projectile)) || frameCount > this.frameCreated + (1200 / this.speed)) {
            this.destroy();
        }
    }

    render() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class HomingProjectile extends PlayerCollisionDamageEntity {
    speed;
    
    constructor(x, y, size, damage, speed) {
        super(x, y, size, size, damage);
        this.speed = speed;
    }

    update() {
        if (player.x > this.x) {
            this.move(this.speed, 0);
        }
        if (player.x < this.x) {
            this.move(-this.speed, 0);
        }
        if (player.y > this.y) {
            this.move(0, this.speed);
        }
        if (player.y < this.y) {
            this.move(0, -this.speed);
        }
        this.checkPlayerCollision();
        let collisionInformation = this.collidedWithAnything(true);
        if ((collisionInformation[0] && !(collisionInformation[1] instanceof Projectile))) {
            this.destroy();
        }
    }
}

class ShootingEnemy extends Enemy {

    direction;
    delay;
    projectileDamage;
    projectileSize;
    projectileSpeed;

    constructor(x, y, maxHealth, damage, delay, projectileDamage, projectileSpeed, projectileSize) {
        super(x, y, 30, 30, maxHealth, damage);
        this.direction = "right";
        this.delay = delay;
        this.projectileDamage = projectileDamage;
        this.projectileSize = projectileSize;
        this.projectileSpeed = projectileSpeed;
        this.setOriginalProperties();
    }

    update() {
        this.checkPlayerCollision();
        this.gravity();
        this.direction = player.x > this.x ? "right" : "left";
        
        if (frameCount % this.delay == 0) {
            
            let projX;
            if (this.direction == "right") {
                projX = this.x + this.width + 1;
            } else {
                projX = this.x - this.projectileSize - 1;
            }
            let projY = this.y + ((this.height - this.projectileSize) / 2);
            entities.push(new EnemyProjectile(projX, projY, this.projectileSize, this.projectileDamage, this.direction, this.projectileSpeed));

        }
    }

    render() {
        super.render();
        this.drawEyes(this.direction);
    }
}

class ShootingEnemy1 extends ShootingEnemy {
    constructor(x, y) {
        super(x, y, 6, 10, 150, 10, 10, 15);
    }
}