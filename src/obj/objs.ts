import {Obj, MovingObj, Footprint, Vector} from "./objBase";
import {SETTINGS} from "../static/settings";

export interface Planet extends Obj {}

export class SolidPlanet extends Obj implements Planet {
    constructor(pos: Vector, r: number = 10, cor: number = SETTINGS.COEFFICIENT_OF_RESTITUTION, density: number = 1) {
        super(pos, r, cor, density);
    }

    posCalc() {}

    renderCalc(ctx: CanvasRenderingContext2D) {
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

export class MovingPlanet extends MovingObj implements Planet {
    constructor(pos: Vector, velocity: Vector, r: number = 10, cor: number = SETTINGS.COEFFICIENT_OF_RESTITUTION, density: number = 1) {
        super(pos, r, cor, density, velocity);
    }

    renderCalc(ctx: CanvasRenderingContext2D) {
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
