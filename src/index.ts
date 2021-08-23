console.log("test");

import {Board} from "./board";
import {Vector} from "./obj/objBase";
import {SolidPlanet, MovingPlanet} from "./obj/objs";
import {SETTINGS} from "./static/settings";

function draw() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const board = new Board(0.01, 10, 1000);

    board.addObj(new MovingPlanet(new Vector(900, 500), 30, 0.3, 1, new Vector(0, 0)));
    // board.addObj(new SolidPlanet(1700, 700, 200000));
    // board.addObj(new MovingPlanet(1700, 400, 200000, 35, 30));
    // board.addObj(new MovingPlanet(1400, 700, 200000, 10, 50));

    for (let i = 0; i < 1; i++) {
        board.addObj(new MovingPlanet(new Vector(700 - 500 * i, 500), 10, 0.3, 1, new Vector(20, 0)));
    }
    // board.addObj(new MovingPlanet(1000, 500, 30000, 5, 10));

    board.run();

    //ctx.scale(0.5, 0.5);
}

window.onload = () => {
    draw();
};
