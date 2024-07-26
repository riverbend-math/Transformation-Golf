"use strict";

// import {roundto, randint, randfloat} from "math_supplement.js";

class Vector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${roundto(this.x,1)}, ${roundto(this.y,1)})`
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
    }

    shift(x,y) {
        this.x += x;
        this.y += y;
    }

    distance(other) {
        // other is a vector
        return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2)
    }

    mult(num) {
        this.x = (this.x == 0) ? 0 : num * this.x;
        this.y = (this.y == 0) ? 0 : num * this.y;
    }

    rotate_origin(degree) {
        let theta = degree * Math.PI / 180;
        let x = this.x;
        let y = this.y;
        this.x = x * Math.cos(theta) - y * Math.sin(theta);
        this.y = x * Math.sin(theta) + y * Math.cos(theta); 
    }

    rotate(rx, ry, degree) {
        let s = new Vector(-1 * rx,-1 * ry);
        this.add(s);
        this.rotate_origin(degree);
        s.mult(-1);
        this.add(s);
    }

    flip_x_axis() {
        this.y = (-1) * this.y;
    }

    flip_y_axis() {
        this.x = (-1) * this.x;
    }

    flip_x_line(x0) {
        let s = new Vector(-1 * x0, 0);
        this.add(s);
        this.flip_y_axis();
        s.mult(-1);
        this.add(s);
    }

    flip_y_line(m, b) {
        let s = new Vector(0, -1 * b);
        // angle between x-axis and the line
        let alpha = Math.asin(m / Math.pow(1 + m ** 2, 0.5)) * 180 / Math.PI;
        this.add(s);
        this.rotate_origin(-1 * alpha);
        this.flip_x_axis();
        this.rotate_origin(alpha);
        s.mult(-1);
        this.add(s);
    }
}

class Coordinates {
    constructor(canvas_width, canvas_height, gx_min, gy_min, gx_max, gy_max) {
        let buffer = 20;
        this.gx_min = gx_min;
        this.gx_max = gx_max;
        this.gy_min = gy_min;
        this.gy_max = gy_max;
        this.cx_min = buffer;
        this.cx_max = canvas_width - buffer;
        this.cy_min = buffer;
        this.cy_max = canvas_height - buffer;
    }

    get_gx(cx) {
        let slope = (this.gx_max - this.gx_min) / (this.cx_max - this.cx_min);
        return (this.gx_min + slope * (cx - this.cx_min));
    }

    get_gy(cy) {
        let slope = (this.gy_min - this.gy_max) / (this.cy_max - this.cy_min);
        return (this.gy_max + slope * (cy - this.cy_min));
    }

    get_cx(gx) {
        let slope = (this.cx_max - this.cx_min) / (this.gx_max - this.gx_min);
        return (this.cx_min + slope * (gx - this.gx_min));
    }

    get_cy(gy) {
        let slope = (this.cy_max - this.cy_min) / (this.gy_min - this.gy_max);
        return (this.cy_min + slope * (gy - this.gy_max));
    }

    get_gvector(cx, cy) {
        let v = new Vector(this.get_gx(cx), this.get_gy(cy));
        return v;
    }

    get_cvector(gx, gy) {
        let v = new Vector(this.get_cx(gx), this.get_cy(gy));
        return v;
    }
}

// export{ Vector, Coordinates }