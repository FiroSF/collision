/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Board = void 0;
const constants_1 = __webpack_require__(2);
const settings_1 = __webpack_require__(3);
const objBase_1 = __webpack_require__(4);
const objs_1 = __webpack_require__(5);
class Board {
    constructor(rate, renderRate) {
        this.objs = [];
        this.ships = [];
        this.currentSelected = constants_1.SELECTED_TYPES.MOVING_PLANET;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.planetSize = settings_1.SETTINGS.PLANET_SIZE;
        this.isAdding = false;
        this.inputEventHandler = (e) => {
            let target = e.target;
            switch (target.id) {
                case "e":
                    this.eModify(target);
                    break;
                default:
                    break;
            }
            document.getElementById(target.id + "Viewer").innerText = target.value;
        };
        // https://github.com/kernhanda/kernhanda.github.io/blob/master/demos/canvas/main.ts
        this.clearEventHandler = () => {
            this.clearCanvas();
        };
        this.scrollEventHandler = (e) => {
            if (this.currentSelected == constants_1.SELECTED_TYPES.MOVING_PLANET) {
                if (e.deltaY < 0 || this.planetSize > 10) {
                    this.planetSize -= e.deltaY / 10;
                    document.getElementById("size").innerText = "current moving planet size = " + this.planetSize.toString();
                }
            }
        };
        this.releaseEventHandler = () => {
            this.isAdding = false;
            this.addByPlayer();
        };
        this.cancelEventHandler = () => {
            this.isAdding = false;
        };
        this.pressEventHandler = (e) => {
            let mouseX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
            let mouseY = e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
            mouseX -= this.canvas.offsetLeft;
            mouseY -= this.canvas.offsetTop;
            this.isAdding = true;
            this.addClick(mouseX, mouseY, true);
        };
        this.dragEventHandler = (e) => {
            let mouseX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
            let mouseY = e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
            mouseX -= this.canvas.offsetLeft;
            mouseY -= this.canvas.offsetTop;
            this.dragProcess(e, mouseX, mouseY);
            e.preventDefault();
        };
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        this.canvas = canvas;
        this.ctx = ctx;
        this.createUserEvents();
        this.canvas.width = window.innerWidth - 40;
        this.canvas.height = window.innerHeight - 200;
        settings_1.SETTINGS.PHYSICS_REFRESH_RATE = rate;
        settings_1.SETTINGS.RENDER_REFRESH_RATE = renderRate;
    }
    createUserEvents() {
        let canvas = this.canvas;
        canvas.addEventListener("mousedown", this.pressEventHandler);
        canvas.addEventListener("mousemove", this.dragEventHandler);
        canvas.addEventListener("mouseup", this.releaseEventHandler);
        canvas.addEventListener("mouseout", this.cancelEventHandler);
        canvas.addEventListener("touchstart", this.pressEventHandler);
        canvas.addEventListener("touchmove", this.dragEventHandler);
        canvas.addEventListener("touchend", this.releaseEventHandler);
        canvas.addEventListener("touchcancel", this.cancelEventHandler);
        canvas.addEventListener("wheel", this.scrollEventHandler);
        document.getElementById("solidPlanet").addEventListener("click", () => {
            this.setSelected(constants_1.SELECTED_TYPES.SOLID_PLANET);
        });
        document.getElementById("movingPlanet").addEventListener("click", () => {
            this.setSelected(constants_1.SELECTED_TYPES.MOVING_PLANET);
        });
        document.getElementById("move").addEventListener("click", () => {
            this.setSelected(constants_1.SELECTED_TYPES.MOVE);
        });
        document.getElementById("clear").addEventListener("click", this.clearEventHandler);
        let t = document.getElementsByClassName("range");
        for (let i = 0; i < t.length; i++) {
            t.item(i).addEventListener("input", this.inputEventHandler);
        }
        window.addEventListener("resize", this.resizeEventHandler);
    }
    eModify(target) {
        settings_1.SETTINGS.COEFFICIENT_OF_RESTITUTION = Number(target.value);
    }
    addClick(mouseX, mouseY, isFirstClick) {
        if (isFirstClick) {
            this.startX = mouseX;
            this.startY = mouseY;
        }
        this.endX = mouseX;
        this.endY = mouseY;
    }
    resizeEventHandler() {
        this.canvas.width = window.innerWidth - 40;
        this.canvas.height = window.innerHeight - 150;
    }
    clearCanvas() {
        this.objs = [];
        this.ships = [];
    }
    setSelected(t) {
        this.currentSelected = t;
    }
    addByPlayer() {
        switch (this.currentSelected) {
            case constants_1.SELECTED_TYPES.MOVING_PLANET:
                this.addObj(new objs_1.MovingPlanet(new objBase_1.Vector(this.startX, this.startY), new objBase_1.Vector((this.startX - this.endX) * 4, (this.startY - this.endY) * 4), this.planetSize, settings_1.SETTINGS.COEFFICIENT_OF_RESTITUTION, 1));
                break;
            case constants_1.SELECTED_TYPES.SOLID_PLANET:
                this.addObj(new objs_1.SolidPlanet(new objBase_1.Vector(this.startX, this.startY), ((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2) ** 0.5));
                break;
            default:
                break;
        }
    }
    dragProcess(e, mouseX, mouseY) {
        if (this.isAdding) {
            this.addClick(mouseX, mouseY, false);
        }
    }
    run() {
        setInterval(() => {
            this.ships.forEach(s => {
                s.velocityProcess(this.objs);
            });
            this.ships.forEach(s => {
                s.posProcess();
            });
        }, 1000 / settings_1.SETTINGS.PHYSICS_REFRESH_RATE);
        setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width * 2, this.canvas.height * 2);
            this.ctx.beginPath();
            this.objs.forEach(s => {
                s.renderCalc(this.ctx);
            });
        }, 1000 / settings_1.SETTINGS.RENDER_REFRESH_RATE);
    }
    findId(l, id) {
        let start = 0;
        let end = l.length;
        let curr;
        while (1) {
            curr = Math.floor((start + end) / 2);
            if (l[curr].ID == id) {
                return curr;
            }
            else if (l[curr].ID > id) {
                end = curr;
            }
            else {
                start = curr;
            }
            if (start == end) {
                break;
            }
        }
        return -1;
    }
    addObj(p) {
        this.objs.push(p);
        if (p instanceof objBase_1.MovingObj) {
            this.ships.push(p);
        }
    }
    deleteObj(id) {
        let index = this.findId(this.objs, id);
        if (index == -1) {
            console.log("there is no planet has id", id);
            return false;
        }
        else {
            this.objs.splice(index, 1);
            console.log("deleted", id);
            return true;
        }
    }
}
exports.Board = Board;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SELECTED_TYPES = void 0;
var SELECTED_TYPES;
(function (SELECTED_TYPES) {
    SELECTED_TYPES[SELECTED_TYPES["SOLID_PLANET"] = 1] = "SOLID_PLANET";
    SELECTED_TYPES[SELECTED_TYPES["MOVING_PLANET"] = 2] = "MOVING_PLANET";
    SELECTED_TYPES[SELECTED_TYPES["MOVE"] = 0] = "MOVE";
})(SELECTED_TYPES = exports.SELECTED_TYPES || (exports.SELECTED_TYPES = {}));


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SETTINGS = void 0;
class SETTINGS {
}
exports.SETTINGS = SETTINGS;
SETTINGS.PLANET_SIZE = 10;
SETTINGS.FOOTPRINT_LIFE_TIME = 3000;
SETTINGS.PHYSICS_REFRESH_RATE = 1000;
SETTINGS.RENDER_REFRESH_RATE = 200;
SETTINGS.COEFFICIENT_OF_RESTITUTION = 1;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MovingObj = exports.Obj = exports.Vector = exports.Footprint = void 0;
const settings_1 = __webpack_require__(3);
class Footprint extends Path2D {
    constructor() {
        super();
        this.createdDate = Date.now();
    }
}
exports.Footprint = Footprint;
class Vector {
    constructor(x, y) {
        //! HAVE TO CHANGE THIS
        if (x == 0)
            x = 0.00001;
        if (y == 0)
            y = 0.00001;
        this.x = x;
        this.y = y;
        this.size = (x ** 2 + y ** 2) ** 0.5;
    }
    sum(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    innerProduct(v) {
        return this.x * v.x + this.y * v.y;
    }
    cosValue(v) {
        return this.innerProduct(v) / (this.size * v.size);
    }
    unitVector() {
        return new Vector(this.x / this.size, this.y / this.size);
    }
    resize(size) {
        var unitVector = this.unitVector();
        return new Vector(unitVector.x * size, unitVector.y * size);
    }
    /**
     * Decomposition into direction vectors (direction doesn't have to be an unit vector)
     * @param direction
     * @returns [parallel vector, vertical vector]
     */
    decompos(direction) {
        var directionUnitVector = direction.unitVector();
        console.log(directionUnitVector);
        var sizeByCos = this.cosValue(direction) * this.size;
        var paraVector = new Vector(directionUnitVector.x * sizeByCos, directionUnitVector.y * sizeByCos);
        var vertVector = new Vector(this.x - paraVector.x, this.y - paraVector.y);
        return [paraVector, vertVector];
    }
}
exports.Vector = Vector;
class Obj {
    constructor(pos, r, cor = 1, density = 1) {
        this.isModified = true;
        this.velocity = new Vector(0, 0);
        this.calculatedObj = [];
        this.pos = pos;
        this.coRest = cor;
        this.r = r;
        this.density = density;
        this.mass = r ** 2 * Math.PI;
        Obj.count++;
        this.ID = Obj.count;
    }
    renderCalc(ctx) { }
}
exports.Obj = Obj;
Obj.count = 0;
class MovingObj extends Obj {
    constructor(pos, r = 10, cor = 1, density = 1, velocity) {
        super(pos, r, cor, density);
        this.footprints = [];
        this.velocity = velocity;
    }
    getWillBeCalcObjs(objs) {
        var collided = [];
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
            }
            else if (index != -1) {
                //if calculated and not colliding anymore
                delete this.calculatedObj[index];
            }
        });
        return collided;
    }
    static collisionProcess(a, b, va, vb, direction) {
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
    static calcCollision(a, b, va, vb, e) {
        return ((e + 1) * b.mass * vb + va * (a.mass - e * b.mass)) / (a.mass + b.mass);
    }
    velocityProcess(objs) {
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
        this.pos = new Vector(this.pos.x + this.velocity.x * (1 / settings_1.SETTINGS.PHYSICS_REFRESH_RATE), this.pos.y + this.velocity.y * (1 / settings_1.SETTINGS.PHYSICS_REFRESH_RATE));
    }
}
exports.MovingObj = MovingObj;
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


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MovingPlanet = exports.SolidPlanet = void 0;
const objBase_1 = __webpack_require__(4);
const settings_1 = __webpack_require__(3);
class SolidPlanet extends objBase_1.Obj {
    constructor(pos, r = 10, cor = settings_1.SETTINGS.COEFFICIENT_OF_RESTITUTION, density = 1) {
        super(pos, r, cor, density);
    }
    posCalc() { }
    renderCalc(ctx) {
        var radgrad = ctx.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.r * 2);
        radgrad.addColorStop(0, "#000000");
        radgrad.addColorStop(0.5, "#000000");
        radgrad.addColorStop(0.5, "#07ACE7");
        radgrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, 100000, 100000);
        // console.log(this.x, this.y);
        this.isModified = false;
    }
}
exports.SolidPlanet = SolidPlanet;
class MovingPlanet extends objBase_1.MovingObj {
    constructor(pos, velocity, r = 10, cor = settings_1.SETTINGS.COEFFICIENT_OF_RESTITUTION, density = 1) {
        super(pos, r, cor, density, velocity);
    }
    renderCalc(ctx) {
        // console.log(this.x, this.y, 0, this.x, this.y, this.r * 10);
        var radgrad = ctx.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.r * 2);
        radgrad.addColorStop(0, "#000000");
        radgrad.addColorStop(0.5, "#000000");
        radgrad.addColorStop(0.5, "#E7AC0C");
        radgrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, 100000, 100000);
    }
}
exports.MovingPlanet = MovingPlanet;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
console.log("test");
const board_1 = __webpack_require__(1);
const objBase_1 = __webpack_require__(4);
const objs_1 = __webpack_require__(5);
const settings_1 = __webpack_require__(3);
function draw() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    const board = new board_1.Board(1000, 200);
    board.addObj(new objs_1.MovingPlanet(new objBase_1.Vector(900, 500), new objBase_1.Vector(100, 100), 30, settings_1.SETTINGS.COEFFICIENT_OF_RESTITUTION, 1));
    // board.addObj(new SolidPlanet(1700, 700, 200000));
    // board.addObj(new MovingPlanet(1700, 400, 200000, 35, 30));
    // board.addObj(new MovingPlanet(1400, 700, 200000, 10, 50));
    // for (let i = 0; i < 1; i++) {
    //     board.addObj(new MovingPlanet(new Vector(700 - 500 * i, 500), 10, 0.3, 1, new Vector(20, 0)));
    // }
    // board.addObj(new MovingPlanet(1000, 500, 30000, 5, 10));
    board.run();
    //ctx.scale(0.5, 0.5);
}
window.onload = () => {
    draw();
};

})();

/******/ })()
;