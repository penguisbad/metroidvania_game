const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

class Entity {
    x;
    y;
    width;
    height;

    previousLocations;
    originalProperties;
    resetImmune;

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.entityCollidedWith = null;
        this.resetImmune = false;

        this.previousLocations = [];
        this.originalProperties = {};
    }

    shakeEffect(intensity, renderFunction) {
        renderFunction(this.x + random(-intensity, intensity), this.y + random(-intensity, intensity), this);
    }

    fadeEffect(red, blue, green, delay, length) {
        
        if (frameCount % delay == 0) {
            this.previousLocations.unshift([this.x, this.y]);
            if (this.previousLocations.length > length) {
                this.previousLocations.pop();
            }
        }
        
        let redIncrement = (50 - red) / length;
        let blueIncrement = (50 - blue) / length;
        let greenIncrement = (50 - green) / length;

        for (let i = 0; i < this.previousLocations.length; i++) {
            ctx.fillStyle = "rgb(" + (red + (redIncrement * i)) + "," + (blue + (blueIncrement * i)) + "," + (green + (greenIncrement * i)) + ")";
            ctx.fillRect(this.previousLocations[i][0], this.previousLocations[i][1], this.width, this.height);
        }
    }

    distanceTo(otherEntity) {
        return (Math.sqrt(Math.pow(otherEntity.x - this.x, 2) + Math.pow(otherEntity.y - this.y, 2)));
    }

    setOriginalProperties() {
        let keys = Object.keys(this);
        keys.forEach(key => {
            if (key != "originalProperties") {
                this.originalProperties[key] = this[key];
            }
        });
    }

    reset() {
        if (this.resetImmune) {
            return;
        }
        let keys = Object.keys(this);
        keys.forEach(key => {
            if (key != "originalProperties") {
                this[key] = this.originalProperties[key];
            }
        });
    }

    setResetImmune() {
        this.resetImmune = true;
    }

    update() {

    }
    render() {
    }

    collidedWith(otherEntity, useInclusiveOperators = true) {
        let left;
        let right;
        let top;
        let bottom;

        if (useInclusiveOperators) {
            right = this.x + this.width >= otherEntity.x && this.x + this.width <= otherEntity.x + otherEntity.width &&
            this.y + this.height >= otherEntity.y && this.y <= otherEntity.y + otherEntity.height;
            
            left = this.x <= otherEntity.x + otherEntity.width && this.x >= otherEntity.x &&
            this.y + this.height >= otherEntity.y && this.y <= otherEntity.y + otherEntity.height;
            
            bottom = this.y + this.height >= otherEntity.y && this.y + this.height <= otherEntity.y + otherEntity.height &&
            this.x + this.width >= otherEntity.x && this.x <= otherEntity.x + otherEntity.width;
            
            top = this.y <= otherEntity.y + otherEntity.height && this.y >= otherEntity.y &&
            this.x + this.width >= otherEntity.x && this.x <= otherEntity.x + otherEntity.width;
        } else {
            right = this.x + this.width > otherEntity.x && this.x + this.width < otherEntity.x + otherEntity.width &&
            this.y + this.height > otherEntity.y && this.y < otherEntity.y + otherEntity.height;
            
            left = this.x < otherEntity.x + otherEntity.width && this.x > otherEntity.x &&
            this.y + this.height > otherEntity.y && this.y < otherEntity.y + otherEntity.height;
            
            bottom = this.y + this.height > otherEntity.y && this.y + this.height < otherEntity.y + otherEntity.height &&
            this.x + this.width > otherEntity.x && this.x < otherEntity.x + otherEntity.width;
            
            top = this.y < otherEntity.y + otherEntity.height && this.y > otherEntity.y &&
            this.x + this.width > otherEntity.x && this.x < otherEntity.x + otherEntity.width;
        }
        
        return left || right || top || bottom;
    }

    collidedWithAnything(returnEntityCollidedWith = false, useInclusiveOperators = true) {
        for (let i = 0; i < entities.length; i++) {
            if (JSON.stringify(entities[i]) != JSON.stringify(this) && this.collidedWith(entities[i], useInclusiveOperators)) {
                if (returnEntityCollidedWith) {
                    return [true, entities[i]];
                }
                return true;
            }
        }
        if (returnEntityCollidedWith) {
            return [false, null];
        }
        return false;
    }

    move(dx, dy, ignoreCollisions = false) {
        if (ignoreCollisions) {
            this.x += dx;
            this.y += dy;
            return;
        }

        let previousX;
        let previousY;

        for (let i = 0; i < Math.abs(dx); i++) {
            previousX = this.x;
            if (dx > 0) {
                this.x++;
            } else {
                this.x--;
            }
            if (this.collidedWithAnything(false, false)) {
                this.x = previousX;
                break;
            }
        }
        for (let i = 0; i < Math.abs(dy); i++) {
            previousY = this.y;
            if (dy > 0) {
                this.y++;
            } else {
                this.y--;
            }
            if (this.collidedWithAnything(false, false)) {
                this.y = previousY;
                break;
            }
        }
    }

    destroy() {
        entities = entities.filter(entity => !(JSON.stringify(entity) == JSON.stringify(this)));
    }
}

class Particles extends Entity {

    direction;
    amount;
    particleSpeed;
    particleLife;
    spread;

    particles;

    parentEntity;
    relativeX;
    relativeY;

    constructor(x, y, direction, amount, delay, particleSpeed, particleLife, spread, parentEntity = null) {
        
        if (parentEntity == null) {
            super(x, y, 0, 0);
        } else {
            super(parentEntity.x + x, parentEntity.y + y);
            this.relativeX = x;
            this.relativeY = y;
            
        }
        this.parentEntity = parentEntity;
        this.direction = direction;
        this.amount = amount;
        this.delay = delay;
        this.particleSpeed = particleSpeed;
        this.particleLife = particleLife;
        this.spread = spread;
        this.particles = [];

        this.setOriginalProperties();
    }

    createParticle() {
        this.particles.push({
            x: random(-this.spread, this.spread),
            y: random(-this.spread, this.spread),
            frameCreated: frameCount
        });
    }

    move(dx, dy) {
        if (this.parentEntity == null) {
            super.move(dx, dy, true);
            return;
        }
        this.relativeX += dx;
        this.relativeY += dy;
    }

    update() {
        if (this.parentEntity != null) {
            this.x = this.parentEntity.x + this.relativeX;
            this.y = this.parentEntity.y + this.relativeY;
            if (!entities.includes(this.parentEntity)) {
                this.destroy();
            }
        }

        if (frameCount % this.delay == 0) {
            for (let i = 0; i < this.amount; i++) {
                this.createParticle();
            }
        }
        
        this.particles.forEach(particle => {
            switch (this.direction) {
                case "right":
                    particle.x += this.particleSpeed;
                    break;
                case "left":
                    particle.x -= this.particleSpeed;
                    break;
                case "down":
                    particle.y += this.particleSpeed;
                    break;
                case "up":
                    particle.y -= this.particleSpeed;
                    break;
                default:
                    break;
            }
        });
        
        this.particles = this.particles.filter(particle => particle.frameCreated + this.particleLife > frameCount);
        
        
    }
    render() {
        ctx.fillStyle = "black";
        
        this.particles.forEach(particle => {
            ctx.fillRect(this.x + particle.x, this.y + particle.y, 2, 2);
        });
    }
}