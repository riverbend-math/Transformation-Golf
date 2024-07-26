"use strict"; 

//import {Vector, Coordinates, roundto, randint, randfloat } from "coords.js";

function do_test_c2g() {
    let cx = Number(document.getElementById("cx").value);
    let cy = Number(document.getElementById("cy").value);
    document.getElementById("out-c2g").innerText = `Game coords: ${COORD.get_gx(cx)}, ${COORD.get_gy(cy)}`;
}

function do_test_g2c() {
    let gx = Number(document.getElementById("gx").value);
    let gy = Number(document.getElementById("gy").value);
    document.getElementById("out-g2c").innerText = `Canvas coords: ${COORD.get_cx(gx)}, ${COORD.get_cy(gy)}`;
}


function onReady() {
    let s = `canvas: ${COORD.cx_max} by ${COORD.cy_max} \n
                game x: ${COORD.gx_min} to ${COORD.gx_max} \n
                game y: ${COORD.gy_min} to ${COORD.gy_max}`;
    document.getElementById("coord-limits").innerText = s;
    document.getElementById("test-c2g").addEventListener("click", do_test_c2g);
    document.getElementById("test-g2c").addEventListener("click", do_test_g2c);
}

let COORD = new Coordinates(400, 300, 0, 0, 10, 8);
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
} else {
    onReady();
}
