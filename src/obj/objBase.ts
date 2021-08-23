import {SETTINGS} from "../static/settings";

export class Footprint extends Path2D {
    createdDate: number;
    constructor() {
        super();
        this.createdDate = Date.now();
    }
}

export class Vector {
    readonly x: number;
    readonly y: number;
    readonly size: number;
    constructor(x: number, y: number) {
        //! HAVE TO CHANGE THIS
        if (x == 0) x = 0.00001;
        if (y == 0) y = 0.00001;
        this.x = x;
        this.y = y;
        this.size = (x ** 2 + y ** 2) ** 0.5;
    }

    sum(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    innerProduct(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    cosValue(v: Vector): number {
        return this.innerProduct(v) / (this.size * v.size);
    }

    unitVector(): Vector {
        return new Vector(this.x / this.size, this.y / this.size);
    }

    resize(size: number): Vector {
        var unitVector = this.unitVector();
        return new Vector(unitVector.x * size, unitVector.y * size);
    }

    /**
     * Decomposition into direction vectors (direction doesn't have to be an unit vector)
     * @param direction
     * @returns [parallel vector, vertical vector]
     */
    decompos(direction: Vector): [Vector, Vector] {
        var directionUnitVector = direction.unitVector();
        console.log(directionUnitVector);
        var sizeByCos = this.cosValue(direction) * this.size;

        var paraVector = new Vector(directionUnitVector.x * sizeByCos, directionUnitVector.y * sizeByCos);
        var vertVector = new Vector(this.x - paraVector.x, this.y - paraVector.y);
        return [paraVector, vertVector];
    }
}

export abstract class Obj {
    static count: number = 0;

    ID: number;
    isModified: boolean = true;
    pos: Vector;
    velocity: Vector = new Vector(0, 0);
    r: number;
    density: number;
    mass: number;
    /**
     * coefficient of restitution
     */
    coRest: number;
    calculatedObj: Obj[] = [];

    constructor(pos: Vector, r: number, cor: number = 1, density: number = 1) {
        this.pos = pos;
        this.coRest = cor;

        this.r = r;
        this.density = density;
        this.mass = r ** 2 * Math.PI;

        Obj.count++;
        this.ID = Obj.count;
    }
    renderCalc(ctx: CanvasRenderingContext2D): void {}
}

export class MovingObj extends Obj {
    footprints: Footprint[] = [];

    constructor(pos: Vector, r: number = 10, cor: number = 1, density: number = 1, velocity: Vector) {
        super(pos, r, cor, density);
        this.velocity = velocity;
    }

    getWillBeCalcObjs(objs: Obj[]): Obj[] {
        var collided: Obj[] = [];

        objs.forEach(o => {
            if (o.ID == this.ID) {
                return;
            }
            var subVector = this.pos.sub(o.pos);
            var index = this.calculatedObj.indexOf(o);

            // delete this.calculatedObj[index];

            if (subVector.size < this.r + o.r) {
                if (index == -1) {
                    collided.push(o);
                }
            } else if (index != -1) {
                //if calculated and not colliding anymore
                delete this.calculatedObj[index];
            }
        });

        return collided;
    }

    static collisionProcess(a: Obj, b: Obj, va: Vector, vb: Vector, direction: Vector): [Vector, Vector] {
        // coefficient of restitution
        var e = (a.coRest + b.coRest) / 2;

        // negative if direction is opposite
        var sa = direction.x * va.x > 0 ? va.size : -va.size;
        var sb = direction.x * vb.x > 0 ? vb.size : -vb.size;

        var v1 = MovingObj.calcCollision(a, b, sa, sb, e);
        var v2 = MovingObj.calcCollision(b, a, sb, sa, e);

        // console.log(va, vb, direction, v1, v2);

        return [direction.resize(v1), direction.resize(v2)];
    }

    private static calcCollision(a: Obj, b: Obj, va: number, vb: number, e: number): number {
        return ((e + 1) * b.mass * vb + va * (a.mass - e * b.mass)) / (a.mass + b.mass);
    }

    velocityProcess(objs: Obj[]) {
        // collision
        var targetObjs = this.getWillBeCalcObjs(objs);

        targetObjs.forEach(target => {
            var relativePos = target.pos.sub(this.pos); //b - a

            // Decomposed Velocity [collision velocity, spectator velocity]
            var thisDVelocity = this.velocity.decompos(relativePos);
            var targetDVelocity = target.velocity.decompos(relativePos);

            var calcedVelocity = MovingObj.collisionProcess(this, target, thisDVelocity[0], targetDVelocity[0], relativePos);

            this.velocity = calcedVelocity[0].sum(thisDVelocity[1]);
            target.velocity = calcedVelocity[1].sum(targetDVelocity[1]);

            console.log(this.velocity, target.velocity, thisDVelocity, targetDVelocity);

            this.calculatedObj.push(target);
            target.calculatedObj.push(this);
        });
    }

    posProcess() {
        this.pos = new Vector(this.pos.x + this.velocity.x * (1 / SETTINGS.PHYSICS_REFRESH_RATE), this.pos.y + this.velocity.y * (1 / SETTINGS.PHYSICS_REFRESH_RATE));
    }
}
// export class Obj {
//     static count: number = 0;
//     ID: number;
//     isModified: boolean = true;
//     x: number;
//     y: number;
//     r: number;
//     cor: number;
//     density: number;
//     collidedObjs: Obj[] = [];
//     constructor(x: number, y: number, r: number, cor: number = 1, density: number = 1) {
//         this.x = x;
//         this.y = y;
//         this.r = r;
//         this.cor = cor;
//         this.density = density;
//         Obj.count++;
//         this.ID = Obj.count;
//     }
//     renderCalc(dt: number, ctx: CanvasRenderingContext2D): void {}
// }

// export class MovingObj extends Obj {
//     vx: number;
//     vy: number;
//     footprints: Footprint[] = [];
//     newvx: number | undefined;
//     newvy: number | undefined;

//     constructor(x: number, y: number, r: number = 10, cor: number = 1, density: number = 1, vx: number, vy: number) {
//         super(x, y, r, cor, density);

//         this.vx = vx;
//         this.vy = vy;
//     }
//     posCalc(dt: number, ratio: number, objs: Obj[]) {
//         // acceleration
//         dt *= ratio / 1000;

//         // move
//         // this.x += this.vx * dt;
//         // this.y += this.vy * dt;

//         // collision
//         let collided: Obj[] = [];
//         let dx = 0;
//         let dy = 0;
//         objs.forEach(o => {
//             dx = o.x - this.x;
//             dy = o.y - this.y;
//             if (o != this && (dx ** 2 + dy ** 2) ** 0.5 < this.r + o.r) {
//                 collided.push(o);
//             }
//         });

//         if (collided.length > 0) {
//             // is alerady calculated?
//             if (this.collidedObjs.length != 0 || this.vx ** 2 + this.vy ** 2 == 0) {
//                 return;
//             }

//             if (collided.length > 1) {
//                 console.log("holy length is", collided.length);
//             }
//             let o = collided[0];

//             // get normal vector
//             dx = o.x - this.x;
//             dy = o.y - this.y;

//             let rsize = (dx ** 2 + dy ** 2) ** 0.5;

//             //1 - current obj, 2 - another obj.
//             let v1 = (this.vx ** 2 + this.vy ** 2) ** 0.5;
//             let cosV1 = (dx * this.vx + dy * this.vy) / (rsize * v1);
//             let cosV1p = (dx * this.vy + dy * this.vx) / (rsize * v1); // cos(90deg - theta)
//             //newV - v that have to be calculated, leftV - v that doesn't effect on collision
//             let newV1 = v1 * cosV1;
//             let leftV1 = v1 * (1 - cosV1 ** 2) ** 0.5;
//             console.log(this.vx, this.vy, vsize, cosv, leftV1);

//             let vsize2;
//             let cosv2;
//             let newVSize2;
//             let leftVSize2;

//             if (o instanceof MovingObj) {
//                 anothervSize = (o.vx ** 2 + o.vy ** 2) ** 0.5;
//                 anothercosv = Math.abs((dx * this.vx + dy * this.vy) / (rsize + anothervSize));
//                 anotherNewvSize = Math.abs((dx * o.vx + dy * o.vy) / rsize);
//                 anotherLeftvSize = (1 - anothercosv ** 2) ** 0.5 * rsize;
//             } else {
//                 anotherNewvSize = 0;
//             }

//             // get vf

//             let e = (o.cor + this.cor) / 2;

//             let mass = this.density * this.r ** 2;

//             let anotherMass;
//             if (o instanceof MovingObj) {
//                 anotherMass = o.density * o.r ** 2;
//             } else {
//                 anotherMass = 100000000;
//             }

//             let vf =
//                 ((e + 1) * anotherMass * anotherNewvSize + newvSize * (mass - e * anotherMass)) / (anotherMass + mass);
//             let anothervf =
//                 ((e + 1) * mass * newvSize + anotherNewvSize * (anotherMass - e * mass)) / (anotherMass + mass);

//             // vector bunhae
//             let dxy = Math.abs(dx) + Math.abs(dy);
//             let vfx = Math.abs((vf ** 2 / dxy) * dx) ** 0.5 * (Math.abs(dx) / dx);
//             let vfy = Math.abs((vf ** 2 / dxy) * dy) ** 0.5 * (Math.abs(dx) / dx);
//             let anothervfx = Math.abs(anothervf ** 2 / (dxy * -dx)) ** 0.5 * (Math.abs(dx) / -dx);
//             let anothervfy = Math.abs(anothervf ** 2 / (dxy * -dx)) ** 0.5 * (Math.abs(dx) / -dx);

//             this.newvx = vfx;
//             this.newvy = vfy;

//             if (o instanceof MovingObj) {
//                 o.newvx = anothervfx;
//                 o.newvy = anothervfy;
//             }

//             let leftvx = Math.abs((leftvSize ** 2 / dxy) * -dx) ** 0.5 * (Math.abs(dx) / -dx);
//             let leftvy = Math.abs((leftvSize ** 2 / dxy) * -dy) ** 0.5 * (Math.abs(dx) / -dx);
//             this.newvx = vfx + leftvx;
//             this.newvy = vfy + leftvy;

//             let anotherLeftvx;
//             let anotherLeftvy;
//             if (o instanceof MovingObj) {
//                 anotherLeftvx = ((anotherLeftvSize as number) ** 2 / (dxy * dx)) ** 0.5 * (Math.abs(dx) / dx);
//                 anotherLeftvy = ((anotherLeftvSize as number) ** 2 / (dxy * dy)) ** 0.5 * (Math.abs(dx) / dx);
//                 o.newvx = anothervfx + anotherLeftvx;
//                 o.newvy = anothervfy + anotherLeftvy;
//             }

//             // console.log('dude', vfx, leftvx);

//             this.isModified = true;
//             o.isModified = true;

//             this.collidedObjs.push(o);
//             o.collidedObjs.push(this);
//             console.log(newvSize, anotherNewvSize, vf, anothervf, e, this.ID, this.collidedObjs.length);

//             // collided.forEach((o) => {
//             //     if (!this.collidedObjs.includes(o)) {
//             //         this.collidedObjs.push(o);
//             //     }
//             // });
//         } else {
//             this.collidedObjs = [];
//             this.newvx = undefined;
//             this.newvy = undefined;
//         }
//     }

//     posCalc2(dt: number, ratio: number) {
//         dt *= ratio / 1000;

//         if (this.newvx != undefined) {
//             console.log(this.newvx);
//             console.log(this.newvy);
//             this.vx = this.newvx;
//         }
//         if (this.newvy != undefined) {
//             this.vy = this.newvy;
//         }

//         this.x += this.vx * dt;
//         this.y += this.vy * dt;
//     }
// }
