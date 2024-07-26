"use strict"; 

function RealListIncludes(list, x) {
    // list of Real objects, x is Real or number
    let includes = false;
    for (let i = 0; i < list.length; i++) {
        if (list[i].equal_to(x)) {
            includes = true;
            break;
        }
    }
    return includes;
    
}

function isReal(s) {
    let digits = "0123456789";
    let allowed_chars = digits + ".+-"
    s = s.toString().trim();
    if (s === '') {
        return false;
    }
    for (let i = 0; i < s.length; i++) {
        if (!allowed_chars.includes(s[i])) {
            return false;
        }
    }
    s = s.split('.');
    if (s.length > 2) {
        return false;
    }
    let intstr = s[0];
    if ("+-".includes(intstr[0])) {
        intstr = intstr.slice(1);
    }
    for (let i = 0; i < intstr.length; i++) {
        if (!digits.includes(intstr[i])) {
            return false;
        }
    }
    if (intstr.length > 1 && intstr[0] === '0') {
        return false;
    }
    if (s.length == 2) {
        let floatstr = s[1];
        for (let i = 0; i < floatstr.length; i++) {
            if (!digits.includes(floatstr[i])) {
                return false;
            }
        }
    }
    return true;
}

class Real {
    constructor(num = 0) {
        if (num === 0) {
            this.sig = "0";
            this.exp = 0;
            this.sn = 1;
            return;
        }
        let numstr = num.toString().trim();
        if (!isReal(numstr)) {
            return;
        } else { 
            let numlist = numstr.split('.');
            let intstr = numlist[0]; 
            if (intstr.length > 0 && intstr[0] === "-") {
                intstr = intstr.slice(1).replace(/^0+/, "");
                this.sn = -1;
            } else {
                this.sn = 1;
            }
            if (numlist.length == 1) {   
                if (intstr === '') {
                    this.sig = "0";
                    this.sn = 1;
                } else {
                    this.sig = intstr;
                }
                this.exp = 0;
            } else {
                let floatstr = numlist[1].replace(/0+$/, "");
                this.exp = (-1) * floatstr.length;
                if (intstr === '0' || intstr === '') {
                    this.sig = floatstr.replace(/^0+/,"");
                } else {
                    this.sig = intstr + floatstr;
                }
                if (this.sig === '' || this.sig === '0') {
                    this.sig = '0';
                    this.sn = 1;
                }
            }
            this._align();
        }
    }

    _align() {
        // convert 0's on the right into exp
        let i = this.sig.length;
        while (i > 1) {
            i -= 1;
            if (this.sig[i] == '0') {
                this.exp += 1;
            } else {
                break;
            }
        }
        this.sig = this.sig.slice(0,i+1);
        if (this.sig === "" || this.sig === "0") {
            this.sn = 1;
            this.exp = 0;
            this.sig = "0";
        }
    }

    toString() {
        this._align();
        let result = (this.sn === -1) ? "-" : "";
        if (this.exp < 0) {
            if (this.sig.length < (-1) * this.exp) {
                result += "0." + "0".repeat(Math.abs(this.sig.length + this.exp)) + this.sig;
            } else {
                let s = this.sig.slice(0,this.exp);
                s = (s === "") ? "0" : s;
                result += s + '.' + this.sig.slice(this.exp);
            }
        } else if (this.exp == 0) {
            result += this.sig;
        } else {
            result += this.sig + "0".repeat(this.exp);
        }
        return result;
    }

    mult(other) {
        if (typeof other === 'number') {
            other = new Real(other);
        }
        let result = new Real();
        result.sn = this.sn * other.sn;
        result.exp = this.exp + other.exp;
        result.sig = (BigInt(this.sig) * BigInt(other.sig)).toString();
        result._align();
        return result;
    }

    less_than(other) {
        if (typeof other === 'number') {
            other = new Real(other);
        }
        this._align();
        other._align();
        let factor = Math.abs(this.exp - other.exp);
        let thisnum = BigInt(this.sig) * BigInt(this.sn);
        let othernum = BigInt(other.sig) * BigInt(other.sn);
        if (this.exp < other.exp) {
            othernum *= BigInt(10 ** factor);
        } else if (this.exp > other.exp) {
            thisnum *= BigInt(10 ** factor);
        }
        return thisnum < othernum;
    }

    greater_than(other) {
        if (typeof other === 'number') {
            other = new Real(other);
        }
        this._align();
        other._align();
        let factor = Math.abs(this.exp - other.exp);
        let thisnum = BigInt(this.sig) * BigInt(this.sn);
        let othernum = BigInt(other.sig) * BigInt(other.sn);
        if (this.exp < other.exp) {
            othernum *= BigInt(10 ** factor);
        } else if (this.exp > other.exp) {
            thisnum *= BigInt(10 ** factor);
        }
        return thisnum > othernum;
    }

    equal_to(other) {
        if (typeof other === 'number') {
            other = new Real(other);
        }
        this._align();
        other._align();
        return this.toString() === other.toString();
    }
}

// export {Real}

