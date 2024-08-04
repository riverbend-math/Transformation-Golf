"use strict";

//import {roundto, randint, randfloat } from "./modules/math_supplements.js";
//import {Vector, Coordinates, roundto, randint, randfloat } from "./modules/coords.js";
//import {get_level_settings } from "./modules/TG_level_settings.js";

class RightTriangle {

    constructor(width, height, color, context, coord) {
        this.w = width;
        this.h = height;
        this.pos = [new Vector(0, 0), new Vector(this.w, 0), new Vector(0, this.h)];
        this.color = color;
        this.ctx = context;
        this.crd = coord;
    }

    toString() {
        let s = "";
        for (let n = 0; n < this.pos.length; n++) {
            s += this.pos[n].toString() + "; ";
        }
        return s.slice(0, -2)
    }

    covers(other) {
        let tolerance = 0.1 * Math.max(this.h, other.h) + Math.abs(this.h - other.h);
        let coverage = true;
        for (let n = 0; n < this.pos.length; n++) {
            if (this.pos[n].distance(other.pos[n]) > tolerance) {
                coverage = false;
                break;
            }
        }
        return coverage;
    }

    shift(x, y) {
        let s = new Vector(x, y);
        for (let n = 0; n < this.pos.length; n++) {
            this.pos[n].add(s);
        }
    }

    rotate(rx, ry, angle) {
        for (let n = 0; n < this.pos.length; n++) {
            this.pos[n].rotate(rx, ry, angle);
        }
    }

    flip_x(x0) {
        for (let n = 0; n < this.pos.length; n++) {
            this.pos[n].flip_x_line(x0);
        }
    }

    flip_y(m, b) {
        for (let n = 0; n < this.pos.length; n++) {
            this.pos[n].flip_y_line(m, b);
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        this.ctx.beginPath();
        this.ctx.moveTo(this.crd.get_cx(this.pos[0].x), this.crd.get_cy(this.pos[0].y));
        this.ctx.lineTo(this.crd.get_cx(this.pos[1].x), this.crd.get_cy(this.pos[1].y));
        this.ctx.lineTo(this.crd.get_cx(this.pos[2].x), this.crd.get_cy(this.pos[2].y));
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
}

class TGolf {
    #num_strokes;
    #level_scores;

    transform() {
        this.last_move = "Last move:\n";
        let input_names = Object.getOwnPropertyNames(this.inputs);

        // clear any bad_input from previous time
        for (let name of input_names) {
            this.inputs[name].classList.remove("bad_input");
        }

        // get inputs
        let inputs = {};
        let values = {};
        let nonblanks = 0;
        for (let name of input_names) {
            inputs[name] = parseFloat(this.inputs[name].value);
            values[name] = this.inputs[name].value;
            if (values[name] !== '') {
                nonblanks += 1;
            }
        }
        if (nonblanks == 0) {
            return;
        }

        // carry out the transformations
        let bad_input = false;

        // shift x
        if (isReal(values.x)) {
            this.ball.shift(inputs.x, 0);
            this.last_move += `Shift x by ${inputs.x}\n`;
        } else if (values.x.trim() !== "") {
            this.inputs.x.classList.add("bad_input");
            bad_input = true;
        }

        // shift y
        if (isReal(values.y)) {
            this.ball.shift(0, inputs.y);
            this.last_move += `Shift y by ${inputs.y}\n`;
        } else if (values.y.trim() !== "") {
            this.inputs.y.classList.add("bad_input");
            bad_input = true;
        }

        // flip x
        if (isReal(values.x0)) {
            this.ball.flip_x(inputs.x0);
            this.last_move += `Flip over line x = ${inputs.x0}\n`;
        } else if (values.x0.trim() !== "") {
            this.inputs.x0.classList.add("bad_input");
            bad_input = true;
        }

        // rotate
        let bad_inps = [];
        let valid_count = 0;
        for (let name of ["rx", "ry", "angle"]) {
            if (values[name].trim() !== "") {
                if (isReal(values[name])) {
                    valid_count += 1;
                } else {
                    bad_inps.push(name);
                }
            }
        }
        if (valid_count == 3) {
            this.ball.rotate(inputs.rx, inputs.ry, inputs.angle);
            this.last_move += `Rotate around (${inputs.rx},${inputs.ry}) by ${inputs.angle} degrees\n`;
        } else if (bad_inps.length > 0 || valid_count > 0) {
            for (let name of ["rx", "ry", "angle"]) {
                if (values[name].trim() == "") {
                    bad_inps.push(name);
                }
            }
            for (let name of bad_inps) {
                this.inputs[name].classList.add("bad_input");
            }
            bad_input = true;
        }

        // flip y
        bad_inps = [];
        valid_count = 0;
        for (let name of ["m", "b"]) {
            if (values[name].trim() !== "") {
                if (isReal(values[name])) {
                    valid_count += 1;
                } else {
                    bad_inps.push(name);
                }
            }
        }
        if (valid_count == 2) {
            this.ball.flip_y(inputs.m, inputs.b);
            this.last_move += `Flip over line y = `;
            if (inputs.m !== 0) { 
                if (Math.abs(inputs.m) !== 1) {
                    this.last_move += `${inputs.m}x`;
                } else {
                    this.last_move += `${(inputs.m < 0) ? '-' : ''}x`;
                }
            }
            if (inputs.b !== 0) {
                if (inputs.m !== 0) {
                    this.last_move += ` ${(inputs.b < 0) ? '-' : '+'} ${Math.abs(inputs.b)}\n`;
                } else {
                    this.last_move += `${inputs.b}\n`;
                }  
            } else {
                if (inputs.m === 0) {
                    this.last_move += `${inputs.b}`;
                }
                this.last_move += `\n`;
            }
        } else if (bad_inps.length > 0 || valid_count > 0) {
            for (let name of ["m", "b"]) {
                if (values[name].trim() == "") {
                    bad_inps.push(name);
                }
            }
            for (let name of bad_inps) {
                this.inputs[name].classList.add("bad_input");
            }
            bad_input = true;
        }

        if (bad_input) {
            return;
        }

        // clear inputs
        for (let name of input_names) {
            this.inputs[name].value = "";
        }

        // refresh the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(this.course_image, 0, 0);
        this.ball.draw();

        // update stats
        this.#num_strokes += 1;
        this.num_strokes_since_reset += 1;
        this.update_game_info()

        if (this.ball.covers(this.cup)) {
            this.end_course()
        }

        if (this.ball_reset_allowed()) {
            this.bring_back_block.classList.remove("hide");
        } else {
            this.bring_back_block.classList.add("hide");
        }
    }

    end_course() {
        if (this.#level_scores[this.level] === null) {
            this.#level_scores[this.level] = this.#num_strokes;
        } else if (this.#level_scores[this.level] > this.#num_strokes) {
            this.#level_scores[this.level] = this.#num_strokes;
        }
        let s = "";
        let score;
        let completed = 0;
        for (let i = 1; i < this.#level_scores.length; i++) {
            if (this.#level_scores[i] === null) {
                score = '__';
            } else {
                score = this.#level_scores[i];
                completed += 1;
            }
            s += `${i}: ${score}\n`;
        }
        this.level_scores_message.innerText = s;
        this.next_game_block.classList.remove("invisible");
        if (completed !== this.max_levels) {
            s = `Completed ${completed} out of ${this.max_levels} levels. `;
        } else {
            s = "All levels completed! "
        }
        this.course_completed_message.innerText = s + "Improve any score by repeating that level.";
        if (this.level == this.max_levels) {
            this.next_level_button.classList.add("hide");
        }
        this.controls_block.classList.add("invisible");
    }

    update_game_info() {
        this.strokes_message.innerText = this.#num_strokes;
        this.ball_message.innerText = this.ball.toString();
        this.cup_message.innerText = this.cup.toString();
        this.last_move_message.innerText = this.last_move;
    }

    ball_reset_allowed() {
        if (this.num_strokes_since_reset >= 5) {
            return true;
        }
        let pos = this.ball.pos;
        let crd = this.settings.coords;
        if (pos[0].x < crd.x_min && pos[1].x < crd.x_min && pos[2].x < crd.x_min ) {
            return true;
        }
        if (pos[0].y < crd.y_min && pos[1].y < crd.y_min && pos[2].y < crd.y_min ) {
            return true;
        }
        if (pos[0].x > crd.x_max && pos[1].x > crd.x_max && pos[2].x > crd.x_max ) {
            return true;
        }
        if (pos[0].y > crd.y_max && pos[1].y > crd.y_max && pos[2].y > crd.y_max ) {
            return true;
        }
        return false;
    }

    bring_ball_back() {
        this.num_strokes_since_reset = 0;
        this.create_ball(this.settings.leg_length, this.settings.ball_transformation);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(this.course_image, 0, 0);
        this.ball.draw();
        this.#num_strokes += 1;
        this.update_game_info();
        this.bring_back_block.classList.add("hide");
    }

    skip_to_level() {
        this.skip_input.classList.remove("bad_input");
        let level = Number(this.skip_input.value);
        if (isNaN(level) || level < 1 || level > this.max_levels || !Number.isInteger(level)) {
            this.skip_input.classList.add("bad_input");
        } else {
            this.skip_input.value = "";
            this.level = level;
            this.create_course(0);
        }
    }

    do_steps(triangle, steps) {
        for (let step of steps) {
            step = step.split(' ');
            switch (step[0]) {
                case 'shift':
                    triangle.shift(Number(step[1]), Number(step[2]));
                    break;
                case 'rotate':
                    triangle.rotate(Number(step[1]), Number(step[2]), Number(step[3]));
                    break;
                case 'flip_x':
                    triangle.flip_x(Number(step[1]));
                    break;
                case 'flip_y':
                    triangle.flip_y(Number(step[1]), Number(step[2]));
                    break;
            }
        }
    }

    create_cup(scale, steps) {
        this.cup = new RightTriangle(scale, 2 * scale, "rgba(0,0,255,0.5)", this.ctx, this.coords);
        this.do_steps(this.cup, steps);
        this.cup.draw()
    }

    create_ball(scale, steps) {
        this.ball = new RightTriangle(scale, 2 * scale, "rgba(255,0,0,0.5)", this.ctx, this.coords);
        this.do_steps(this.ball, steps);
        this.ball.draw()
    }

    place_coords() {
        this.ctx.fillStyle = 'blue';
        this.ctx.strokeStyle = 'blue';
        this.ctx.textAlign = 'center';
        this.ctx.lineWidth = 1;
        let crd = this.coords;
        let label_shift = 10;
        this.ctx.font = `10px Verdana`;

        // find appropriate step for labels
        let x_width = crd.gx_max - crd.gx_min;
        let pwr = 1;
        while (x_width / (10 ** pwr) > 10) {
            pwr += 1;
        }
        let step = 10 ** (pwr - 1);
        if (pwr > 1) {
            step *= 2;
        }

        // draw x-axis
        this.ctx.beginPath();
        this.ctx.moveTo(crd.get_cx(crd.gx_min), crd.get_cy(0));
        this.ctx.lineTo(crd.get_cx(crd.gx_max), crd.get_cy(0));
        this.ctx.stroke();

        // draw y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(crd.get_cx(0), crd.get_cy(crd.gy_min));
        this.ctx.lineTo(crd.get_cx(0), crd.get_cy(crd.gy_max));
        this.ctx.stroke();

        // place axis labels
        for (let n = crd.gx_min; n <= crd.gx_max; n += step) {
            if (n === 0) {
                continue;
            }
            this.ctx.fillText(`${n}`, crd.get_cx(n), crd.get_cy(0) + label_shift);
        }
        for (let n = crd.gy_min; n <= crd.gy_max; n += step) {
            if (n === 0) {
                continue;
            }
            this.ctx.fillText(`${n}`, crd.get_cx(0) - label_shift - pwr * 2, crd.get_cy(n));
        }
        this.ctx.fillText(`x`, crd.get_cx(crd.gx_max) + label_shift, crd.get_cy(0) - label_shift / 2);
        this.ctx.fillText(`y`, crd.get_cx(0) + label_shift / 2, crd.get_cy(crd.gy_max) - label_shift);

        // draw grid
        this.ctx.strokeStyle = "rgba(0,255,0,0.2)";
        if (pwr > 1) {
            step /= 2;
        }
        for (let n = crd.gx_min; n <= crd.gx_max; n += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(crd.get_cx(n), crd.get_cy(crd.gy_min));
            this.ctx.lineTo(crd.get_cx(n), crd.get_cy(crd.gy_max));
            this.ctx.stroke();
        }
        for (let n = crd.gy_min; n <= crd.gy_max; n += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(crd.get_cx(crd.gx_min), crd.get_cy(n));
            this.ctx.lineTo(crd.get_cx(crd.gx_max), crd.get_cy(n));
            this.ctx.stroke();
        }

    }

    create_course(level_increment) {
        if (this.level < this.max_levels) {
            this.level += level_increment;
        }
        this.level_heading_message.innerText = `Level ${this.level}`;
        this.next_game_block.classList.add("invisible");
        this.controls_block.classList.remove("invisible");
        this.game_info_block.classList.remove("invisible");
        this.settings = get_level_settings(this.level);
        let control_names = Object.getOwnPropertyNames(this.controls);
        for (let name of control_names) {
            if (this.settings.controls[name]) {
                this.controls[name].classList.remove("hide");
            } else {
                this.controls[name].classList.add("hide");
            }
        }
        this.coords = new Coordinates(this.canvas.width, this.canvas.height,
            this.settings.coords.x_min, this.settings.coords.y_min, 
            this.settings.coords.x_max, this.settings.coords.y_max);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.place_coords();
        this.create_cup(this.settings.leg_length, this.settings.cup_transformation);
        this.course_image = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.create_ball(this.settings.leg_length, this.settings.ball_transformation);
        this.#num_strokes = 0;
        this.num_strokes_since_reset = 0;
        this.last_move = "";
        this.update_game_info();
    }

    initiate_app() {
        this.level_heading_message = document.getElementById("level-heading");

        this.controls_block = document.getElementById("controls-block");
        this.next_game_block = document.getElementById("next-game-block");
        this.game_info_block = document.getElementById("game-info-block");
        // within next-game-block
        this.repeat_level_button = document.getElementById("repeat-level");
        this.repeat_level_button.addEventListener("click", () => this.create_course(0))
        this.next_level_button = document.getElementById("next-level");
        this.next_level_button.addEventListener("click", () => this.create_course(1))
        this.course_completed_message = document.getElementById("course-completed");
        // within controls-block
        this.controls = {
            shift_x: document.getElementById("shift_x"),
            shift_y: document.getElementById("shift_y"),
            flip_x: document.getElementById("flip_x"),
            flip_y: document.getElementById("flip_y"),
            rotate: document.getElementById("rotate"),
        }

        this.inputs = {
            x : document.getElementById("x"),
            y : document.getElementById("y"),
            rx : document.getElementById("rx"),
            ry : document.getElementById("ry"),
            angle : document.getElementById("angle"),
            m : document.getElementById("m"),
            b : document.getElementById("b"),
            x0 : document.getElementById("x_0"),
        }

        this.transform_button = document.getElementById("transform");
        this.transform_button.addEventListener("click", () => this.transform());
        this.bring_back_block = document.getElementById("bring-back?");
        this.bring_back_button = document.getElementById("bring-back");
        this.bring_back_button.addEventListener("click", () => this.bring_ball_back());
        // within game-info-block
        this.strokes_message = document.getElementById("num-strokes");
        this.ball_message = document.getElementById("ball-vertices");
        this.cup_message = document.getElementById("cup-vertices");
        this.last_move_message = document.getElementById("last-move");
        // canvas
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext('2d');
        // skip to level
        this.skip_input = document.getElementById("skip-level");
        this.skip_button = document.getElementById("skip");
        this.skip_button.addEventListener("click", () => this.skip_to_level());
        // level scores
        this.level_scores_message = document.getElementById("level-scores");
        this.#level_scores = [null];
        this.max_levels = 18;
        for (let n = 1; n <= this.max_levels; n++) {
            this.#level_scores.push(null);
        }
        let s = "";
        for (let i = 1; i < this.#level_scores.length; i++) {
            let score = (this.#level_scores[i] === null) ? '__' : this.#level_scores[i];
            s += `${i} : ${score}\n`;
        }
        this.level_scores_message.innerText = s;
        // create a course
        this.level = 1;
        this.create_course(0);
    }
}

let APP = new TGolf();
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => APP.initiate_app());
} else {
    APP.initiate_app();
}


