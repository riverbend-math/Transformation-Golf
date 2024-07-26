"use strict";

// import {roundto, randint, randfloat} from "math_supplement.js";

function get_level_settings(level) {
    let settings = {
        coords : {
            x_min : -10,
            x_max : 10,
            y_min : -10,
            y_max : 10,
        },
        controls : {
            shift_x : false,
            shift_y : false,
            rotate : false,
            flip_x : false,
            flip_y : false,
        },
        leg_length : 1,
        ball_transformation: [],
        cup_transformation: [],
    };

    let adjust = {
        1 : (s) => {
            s.coords.x_min = 0;
            s.coords.y_min = 0;
            s.controls.shift_x = true;
            s.controls.shift_y = true;
            s.cup_transformation.push(`shift ${randint(5,9)} ${randint(5,8)}`)
        },
        2 : (s) => {
            s.coords.x_min = 0;
            s.coords.y_min = 0;
            s.controls.shift_x = true;
            s.controls.shift_y = true;
            s.ball_transformation.push(`shift ${randint(6,9)} ${randint(6,8)}`);
            s.cup_transformation.push(`shift ${randint(0,4)} ${randint(0,4)}`)
        },
        3 : (s) => {
            s.leg_length = 2;
            s.controls.shift_x = true;
            s.controls.shift_y = true;
            s.ball_transformation.push(`shift ${randint(-10, -4)} ${randint(1,6)}`);
            s.cup_transformation.push(`shift ${randint(4, 8)} ${randint(-10,-6)}`)
        },
        4 : (s) => {
            s.leg_length = 2;
            s.controls.shift_x = true;
            s.controls.shift_y = true;
            s.ball_transformation.push(`shift ${randint(3,7) + roundto(Math.random(),1)} ${randint(1,5) + roundto(Math.random(),1)}`);
            s.cup_transformation.push(`shift ${randint(-10, -6) + roundto(Math.random(),1)} ${randint(-10,-6) + roundto(Math.random(),1)}`)
        },
        5 : (s) => {
            s.leg_length = 4;
            s.controls.rotate = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`shift ${randint(1,2)} ${0}`);
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`rotate ${0} ${0} ${randint(1,3) * 90}`)
        },
        6 : (s) => {
            s.leg_length = 2;
            s.controls.rotate = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.ball_transformation.push(`shift ${randint(5,6)} ${0}`);
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`rotate ${0} ${0} ${randint(45,315)}`)
        },
        7 : (s) => {
            s.leg_length = 3;
            s.controls.rotate = true;
            let vertices = [new Vector(0,0), new Vector(3,0), new Vector(0,6)];
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
                for (let v of vertices) {
                    v.flip_y_line(1,0);
                }
            }
            s.ball_transformation.push(`shift ${-1} ${-1}`);
            for (let v of vertices) {
                v.shift(-1, -1);
            }
            let angle = randint(0,360);
            s.ball_transformation.push(`rotate ${0} ${0} ${angle}`);
            for (let v of vertices) {
                v.rotate(0, 0, angle);
            }
            s.cup_transformation = s.ball_transformation.slice();
            let v = vertices[randint(0,2)];
            s.cup_transformation.push(`rotate ${v.x} ${v.y} ${randint(90,270)}`)
        },
        8 : (s) => {
            s.controls.flip_x = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.ball_transformation.push(`shift ${0} ${randint(-7,7)}`);
            let x0 = randint(-6,6);
            s.ball_transformation.push(`shift ${x0} ${0}`);
            let sft = Math.min(Math.abs(8 - x0), Math.abs(-8 - x0));
            s.ball_transformation.push(`shift ${sft * (-1)**randint(1,2)} ${0}`);
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`flip_x ${x0}`);
        },
        9 : (s) => {
            s.controls.flip_x = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.ball_transformation.push(`shift ${0} ${randint(-7,7)}`);
            let x0 = randint(-6,6);
            s.ball_transformation.push(`shift ${x0} ${0}`);
            s.cup_transformation = s.ball_transformation.slice();
            let sft = Math.min(Math.abs(8 - x0), Math.abs(-8 - x0)) * (-1)**randint(1,2);
            s.ball_transformation.push(`shift ${sft} ${0}`);
            s.cup_transformation.push(`shift ${sft * (-1)} ${0}`);
        },
        10 : (s) => {
            s.controls.flip_y = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.ball_transformation.push(`shift ${randint(-7,7)} ${0}`);
            let y0 = randint(-6,6);
            s.ball_transformation.push(`shift ${0} ${y0}`);
            let sft = Math.min(Math.abs(8 - y0), Math.abs(-8 - y0));
            s.ball_transformation.push(`shift ${0} ${sft * (-1)**randint(1,2)}`);
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`flip_y ${0} ${y0}`);  
        },
        11 : (s) => {
            s.controls.flip_y = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            let sgn = (-1)**randint(1,2);
            let b = randint(-4,4);
            s.ball_transformation.push(`shift ${randint(sgn*(Math.abs(b)+1),sgn*8)} ${randint((-1)*sgn*(Math.abs(b)+1),(-1)*sgn*8)}`);
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`flip_y ${1} ${0}`);  
        },
        12 : (s) => {
            s.controls.flip_y = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            let sgn = (-1)**randint(1,2);
            let b = roundto(randfloat(-4,4),1);
            s.ball_transformation.push(`shift ${randint(sgn*(Math.abs(b)+1),sgn*8)} ${randint(sgn*(Math.abs(b)+1),sgn*8)}`);
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`flip_y ${-1} ${0}`);  
        },
        13 : (s) => {
            s.controls.flip_y = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,4)*90}`);
            let m = randint(1,3) * (-1)**randint(1,2);
            let n = randint(1,4) * (-1)**randint(1,2);
            if (Math.abs(m/n) == 1) {
                n += 1;
            }
            let b = randint(-3,3);
            let x0 = n * (-1)**randint(1,2);
            let y0 = (m/n) * x0 + b;
            s.ball_transformation.push(`shift ${x0 + m} ${y0 - n}`)
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`flip_y ${m/n} ${b}`);  
        },
        14 : (s) => {
            s.controls.shift_x = true;
            s.controls.shift_y = true;
            s.controls.rotate = true;
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            let sgnx = (-1)**randint(1,2);
            let sgny = (-1)**randint(1,2);
            s.ball_transformation.push(`shift ${sgnx * roundto(randfloat(1,8),1)} ${sgny * roundto(randfloat(1,8),1)}`);
            s.cup_transformation.push(`shift ${(-1)*sgnx * roundto(randfloat(1,8),1)} ${(-1)*sgny * roundto(randfloat(1,8),1)}`);
        },
        15 : (s) => {
            s.coords.x_min = -100;
            s.coords.y_min = -100;
            s.coords.x_max = 100;
            s.coords.y_max = 100;
            s.leg_length = 10;
            s.controls.shift_x = true;
            s.controls.shift_y = true;
            s.controls.rotate = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            let sgnx = (-1)**randint(1,2);
            let sgny = (-1)**randint(1,2);
            s.ball_transformation.push(`shift ${sgnx * randint(10,80)} ${sgny * randint(10,80)}`);
            s.cup_transformation.push(`shift ${(-1)*sgnx * randint(10,80)} ${(-1)*sgny * randint(10,80)}`);
        },
        16 : (s) => {
            s.coords.x_min = -1000;
            s.coords.y_min = -1000;
            s.coords.x_max = 1000;
            s.coords.y_max = 1000;
            s.leg_length = 100;
            s.controls.shift_x = true;
            s.controls.shift_y = true;
            s.controls.rotate = true;
            s.controls.flip_x = true;
            s.controls.flip_y = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.cup_transformation.push(`flip_x ${0}`);
            let sgnx = (-1)**randint(1,2);
            let sgny = (-1)**randint(1,2);
            s.ball_transformation.push(`shift ${sgnx * randint(200,800)} ${sgny * randint(200,800)}`);
            s.cup_transformation.push(`shift ${(-1)*sgnx * randint(200,800)} ${(-1)*sgny * randint(200,800)}`);
        },
        17 : (s) => {
            s.coords.x_min = -1000;
            s.coords.y_min = -1000;
            s.coords.x_max = 1000;
            s.coords.y_max = 1000;
            s.leg_length = 100;
            s.controls.rotate = true;
            s.controls.flip_x = true;
            s.controls.flip_y = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_y 1 0`);
            }
            s.ball_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.cup_transformation = s.ball_transformation.slice();
            s.cup_transformation.push(`rotate ${0} ${0} ${randint(0,360)}`);
            s.cup_transformation.push(`flip_x ${0}`);
            let sgnx = (-1)**randint(1,2);
            let sgny = (-1)**randint(1,2);
            s.ball_transformation.push(`shift ${sgnx * randint(200,800)} ${sgny * randint(200,800)}`);
            s.cup_transformation.push(`shift ${(-1)*sgnx * randint(200,800)} ${(-1)*sgny * randint(200,800)}`);
        },
        18 : (s) => {
            s.coords.x_min = -1000;
            s.coords.y_min = -1000;
            s.coords.x_max = 1000;
            s.coords.y_max = 1000;
            s.leg_length = 100;
            s.controls.rotate = true;
            if (Math.random() < 0.5) {
                s.ball_transformation.push(`flip_x 0`);
            }
            let angle = randint(0,360);
            s.ball_transformation.push(`rotate ${0} ${0} ${angle}`);
            let sft = new Vector(randint(-100,100), randint(-100,100));
            s.ball_transformation.push(`shift ${sft.x} ${sft.y}`);

            s.cup_transformation = s.ball_transformation.slice();
            angle = randfloat(0,2*Math.PI);
            let dist = randfloat(300,400);
            let pt = new Vector(Math.round(dist * Math.cos(angle)), Math.round(dist * Math.sin(angle)));
            console.log(pt);
            s.cup_transformation.push(`rotate ${pt.x} ${pt.y} ${randint(90,270)}`)
        },
    };
    level = Math.max(1,Math.min(18,level));
    adjust[level](settings);
    return settings;
}

// export{ get_level_settings }