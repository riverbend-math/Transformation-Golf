"use strict";

function roundto(x, d) { // rounds Number x to d decimal digits
    return Math.round((10 ** d) * x) / (10 ** d);
}

function randint(a, b) { // returns a random integer a <= N <= b
    let range = Math.ceil(b - a);
    return roundto(Math.random() * range, 0) + Math.ceil(a);
}

function randfloat(a, b) { // returns a random number a <= x < b
    return Math.random() * (b - a) + a;
}

// export{roundto, randint, randfloat }