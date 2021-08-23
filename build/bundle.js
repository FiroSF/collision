/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CONSTANTS = exports.SELECTED_TYPES = void 0;
var SELECTED_TYPES;
(function (SELECTED_TYPES) {
    SELECTED_TYPES[SELECTED_TYPES["SOLID_PLANET"] = 1] = "SOLID_PLANET";
    SELECTED_TYPES[SELECTED_TYPES["MOVING_PLANET"] = 2] = "MOVING_PLANET";
    SELECTED_TYPES[SELECTED_TYPES["MOVE"] = 0] = "MOVE";
})(SELECTED_TYPES = exports.SELECTED_TYPES || (exports.SELECTED_TYPES = {}));
var CONSTANTS;
(function (CONSTANTS) {
    CONSTANTS[CONSTANTS["PLANET_DEFAULT_SIZE"] = 10] = "PLANET_DEFAULT_SIZE";
    CONSTANTS[CONSTANTS["FOOTPRINT_LIFE_TIME"] = 3000] = "FOOTPRINT_LIFE_TIME";
})(CONSTANTS = exports.CONSTANTS || (exports.CONSTANTS = {}));


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MovingObj = exports.Obj = exports.Footprint = void 0;
class Footprint extends Path2D {
    constructor() {
        super();
        this.createdDate = Date.now();
    }
}
exports.Footprint = Footprint;
class Obj {
    constructor(x, y, r, cor = 1, density = 1) {
        this.isModified = true;
        this.collidedObjs = [];
        this.x = x;
        this.y = y;
        this.r = r;
        this.cor = cor;
        this.density = density;
        Obj.count++;
        this.ID = Obj.count;
    }
    renderCalc(dt, ctx) { }
}
exports.Obj = Obj;
Obj.count = 0;
class MovingObj extends Obj {
    constructor(x, y, r = 10, cor = 1, density = 1, vx, vy) {
        super(x, y, r, cor, density);
        this.footprints = [];
        this.vx = vx;
        this.vy = vy;
    }
    posCalc(dt, ratio, objs) {
        // acceleration
        dt *= ratio / 1000;
        // move
        // this.x += this.vx * dt;
        // this.y += this.vy * dt;
        // collision
        let collided = [];
        let dx = 0;
        let dy = 0;
        objs.forEach((o) => {
            dx = o.x - this.x;
            dy = o.y - this.y;
            if (o != this && (dx ** 2 + dy ** 2) ** 0.5 < this.r + o.r) {
                collided.push(o);
            }
        });
        if (collided.length > 0) {
            if (this.collidedObjs.length != 0 || this.vx ** 2 + this.vy ** 2 == 0) {
                return;
            }
            if (collided.length > 1) {
                console.log('holy length is', collided.length);
            }
            let o = collided[0];
            // get normal vector
            dx = o.x - this.x;
            dy = o.y - this.y;
            let rsize = (dx ** 2 + dy ** 2) ** 0.5;
            let vsize = (this.vx ** 2 + this.vy ** 2) ** 0.5;
            let cosv = Math.abs((dx * this.vx + dy * this.vy) / (rsize + vsize));
            let newvSize = Math.abs((dx * this.vx + dy * this.vy) / rsize);
            let leftvSize = (1 - cosv ** 2) ** 0.5 * rsize;
            console.log(this.vx, this.vy, vsize, cosv, leftvSize);
            let anothervSize;
            let anotherNewvSize;
            let anotherLeftvSize;
            let anothercosv;
            if (o instanceof MovingObj) {
                anothervSize = (o.vx ** 2 + o.vy ** 2) ** 0.5;
                anothercosv = Math.abs((dx * this.vx + dy * this.vy) / (rsize + anothervSize));
                anotherNewvSize = Math.abs((dx * o.vx + dy * o.vy) / rsize);
                anotherLeftvSize = (1 - anothercosv ** 2) ** 0.5 * rsize;
            }
            else {
                anotherNewvSize = 0;
            }
            // get vf
            let e = (o.cor + this.cor) / 2;
            let mass = this.density * this.r ** 2;
            let anotherMass;
            if (o instanceof MovingObj) {
                anotherMass = o.density * o.r ** 2;
            }
            else {
                anotherMass = 100000000;
            }
            let vf = ((e + 1) * anotherMass * anotherNewvSize + newvSize * (mass - e * anotherMass)) / (anotherMass + mass);
            let anothervf = ((e + 1) * mass * newvSize + anotherNewvSize * (anotherMass - e * mass)) / (anotherMass + mass);
            // vector bunhae
            let dxy = Math.abs(dx) + Math.abs(dy);
            let vfx = Math.abs((vf ** 2 / dxy) * dx) ** 0.5 * (Math.abs(dx) / dx);
            let vfy = Math.abs((vf ** 2 / dxy) * dy) ** 0.5 * (Math.abs(dx) / dx);
            let anothervfx = Math.abs(anothervf ** 2 / (dxy * -dx)) ** 0.5 * (Math.abs(dx) / -dx);
            let anothervfy = Math.abs(anothervf ** 2 / (dxy * -dx)) ** 0.5 * (Math.abs(dx) / -dx);
            this.newvx = vfx;
            this.newvy = vfy;
            if (o instanceof MovingObj) {
                o.newvx = anothervfx;
                o.newvy = anothervfy;
            }
            let leftvx = Math.abs((leftvSize ** 2 / dxy) * -dx) ** 0.5 * (Math.abs(dx) / -dx);
            let leftvy = Math.abs((leftvSize ** 2 / dxy) * -dy) ** 0.5 * (Math.abs(dx) / -dx);
            this.newvx = vfx + leftvx;
            this.newvy = vfy + leftvy;
            let anotherLeftvx;
            let anotherLeftvy;
            if (o instanceof MovingObj) {
                anotherLeftvx = (anotherLeftvSize ** 2 / (dxy * dx)) ** 0.5 * (Math.abs(dx) / dx);
                anotherLeftvy = (anotherLeftvSize ** 2 / (dxy * dy)) ** 0.5 * (Math.abs(dx) / dx);
                o.newvx = anothervfx + anotherLeftvx;
                o.newvy = anothervfy + anotherLeftvy;
            }
            // console.log('dude', vfx, leftvx);
            this.isModified = true;
            o.isModified = true;
            this.collidedObjs.push(o);
            o.collidedObjs.push(this);
            console.log(newvSize, anotherNewvSize, vf, anothervf, e, this.ID, this.collidedObjs.length);
            // collided.forEach((o) => {
            //     if (!this.collidedObjs.includes(o)) {
            //         this.collidedObjs.push(o);
            //     }
            // });
        }
        else {
            this.collidedObjs = [];
            this.newvx = undefined;
            this.newvy = undefined;
        }
    }
    posCalc2(dt, ratio) {
        dt *= ratio / 1000;
        if (this.newvx != undefined) {
            console.log(this.newvx);
            console.log(this.newvy);
            this.vx = this.newvx;
        }
        if (this.newvy != undefined) {
            this.vy = this.newvy;
        }
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }
}
exports.MovingObj = MovingObj;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MovingPlanet = exports.SolidPlanet = void 0;
const objBase_1 = __webpack_require__(2);
class SolidPlanet extends objBase_1.Obj {
    constructor(x, y, r = 10, cor = 1, density = 1) {
        super(x, y, r, cor, density);
    }
    posCalc() { }
    renderCalc(dt, ctx) {
        var radgrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 10);
        radgrad.addColorStop(0, '#000000');
        radgrad.addColorStop(0.1, '#000000');
        radgrad.addColorStop(0.1, '#E7AC0C');
        radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, 100000, 100000);
        // console.log(this.x, this.y);
        this.isModified = false;
    }
}
exports.SolidPlanet = SolidPlanet;
class MovingPlanet extends objBase_1.MovingObj {
    constructor(x, y, r = 10, cor = 1, density = 1, vx = 0, vy = 0) {
        super(x, y, r, cor, density, vx, vy);
    }
    renderCalc(dt, ctx) {
        // console.log(this.x, this.y, 0, this.x, this.y, this.r * 10);
        var radgrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 10);
        radgrad.addColorStop(0, '#000000');
        radgrad.addColorStop(0.1, '#000000');
        radgrad.addColorStop(0.1, '#E7AC0C');
        radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
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
console.log('test');
const constants_1 = __webpack_require__(1);
const objBase_1 = __webpack_require__(2);
const objs_1 = __webpack_require__(3);
class Board {
    constructor(dt, renderdt, ratio) {
        this.objs = [];
        this.ships = [];
        this.currentSelected = constants_1.SELECTED_TYPES.MOVING_PLANET;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.planetSize = constants_1.CONSTANTS.PLANET_DEFAULT_SIZE;
        this.isAdding = false;
        // https://github.com/kernhanda/kernhanda.github.io/blob/master/demos/canvas/main.ts
        this.clearEventHandler = () => {
            this.clearCanvas();
        };
        this.scrollEventHandler = (e) => {
            if (this.currentSelected == constants_1.SELECTED_TYPES.MOVING_PLANET) {
                if (e.deltaY < 0 || this.planetSize > 10) {
                    this.planetSize -= e.deltaY / 10;
                    document.getElementById('size').innerText = 'current moving planet size = ' + this.planetSize.toString();
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
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        this.canvas = canvas;
        this.ctx = ctx;
        this.createUserEvents();
        this.canvas.width = window.innerWidth - 40;
        this.canvas.height = window.innerHeight - 200;
        this.dt = dt;
        this.renderdt = renderdt;
        this.ratio = ratio;
    }
    createUserEvents() {
        let canvas = this.canvas;
        canvas.addEventListener('mousedown', this.pressEventHandler);
        canvas.addEventListener('mousemove', this.dragEventHandler);
        canvas.addEventListener('mouseup', this.releaseEventHandler);
        canvas.addEventListener('mouseout', this.cancelEventHandler);
        canvas.addEventListener('touchstart', this.pressEventHandler);
        canvas.addEventListener('touchmove', this.dragEventHandler);
        canvas.addEventListener('touchend', this.releaseEventHandler);
        canvas.addEventListener('touchcancel', this.cancelEventHandler);
        canvas.addEventListener('wheel', this.scrollEventHandler);
        document.getElementById('solidPlanet').addEventListener('click', () => {
            this.setSelected(constants_1.SELECTED_TYPES.SOLID_PLANET);
        });
        document.getElementById('movingPlanet').addEventListener('click', () => {
            this.setSelected(constants_1.SELECTED_TYPES.MOVING_PLANET);
        });
        document.getElementById('move').addEventListener('click', () => {
            this.setSelected(constants_1.SELECTED_TYPES.MOVE);
        });
        document.getElementById('clear').addEventListener('click', this.clearEventHandler);
        window.addEventListener('resize', this.resizeEventHandler);
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
                this.addObj(new objs_1.MovingPlanet(this.startX, this.startY, this.planetSize, 0.3, 1, this.startX - this.endX, this.startY - this.endY));
                break;
            case constants_1.SELECTED_TYPES.SOLID_PLANET:
                this.addObj(new objs_1.SolidPlanet(this.startX, this.startY, ((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2) ** 0.5 * 10000));
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
            this.ships.forEach((s) => {
                s.posCalc(this.dt, this.ratio, this.objs);
            });
            this.ships.forEach((s) => {
                s.posCalc2(this.dt, this.ratio);
            });
        }, this.dt);
        setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width * 2, this.canvas.height * 2);
            this.ctx.beginPath();
            this.objs.forEach((s) => {
                s.renderCalc(this.renderdt, this.ctx);
            });
        }, this.renderdt);
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
            console.log('there is no planet has id', id);
            return false;
        }
        else {
            this.objs.splice(index, 1);
            console.log('deleted', id);
            return true;
        }
    }
}
function draw() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    const board = new Board(0.01, 10, 1000);
    board.addObj(new objs_1.MovingPlanet(900, 500, 30, 0.3));
    // board.addObj(new SolidPlanet(1700, 700, 200000));
    // board.addObj(new MovingPlanet(1700, 400, 200000, 35, 30));
    // board.addObj(new MovingPlanet(1400, 700, 200000, 10, 50));
    for (let i = 0; i < 1; i++) {
        board.addObj(new objs_1.MovingPlanet(700 - 500 * i, 500, 10, 0.3, 1, 20));
    }
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