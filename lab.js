//VAR 8
//m = 281
//p(x) = x^281 + x^9 + x^4 + x + 1
function reverse(s){
    return s.split("").reverse().join("");
}

class GaloisField {
    m = 281;

    constructor() {
        this.generator = "";
        for(let i = 0; i < this.m; i++){
            if(i === 0 || i === 271 || i === 276 || i === 280){
                this.generator += "1";
            }else{
                this.generator += "0";
            }
        }
    }

    getGaloisFieldElement() {
        let randomValue;
        let element = "";
        for (let i = 0; i < this.m; i++) {
            randomValue = Math.random();
            if (randomValue < 0.5) {
                element += '1';
            } else {
                element += '0';
            }
        }

        return element;
    }

    deleteZero(element, param){
        if(param === "0"){
            return true;
        }
        let pos = 0;
        for (let i = 0; i < element.length; i++) {
            if (element[i] !== "0") {
                pos = i;
                break;
            }
        }
        return element.slice(pos,);
    }

    comp(element){
        if(element === true)
            return "0".repeat(this.m - 1) + 1;
    }

    addZero(num1, num2){
        num1 = "0".repeat(num2.length - num1.length) + num1;
        return num1;
    }

    leftShift(num, i) {
        return num + "0".repeat(i);
    }

    compareBin(num1, num2){
        let maxlength = Math.max(num1.length, num2.length);

        if(num1.length < num2.length)
            num1 = this.addZero(num1, num2);
        else
            num2 = this.addZero(num2, num1);

        for(let i = 0; i < maxlength; i++){
            if(num1[i] > num2[i])
                return 1;
            else if(num2[i] > num1[i])
                return -1;
        }

        return 0;
    }

    addGalois(element1, element2){
        let result = "";
        for(let i = 0; i < this.m; i++){
            if(element1[i] === element2[i]){
                result += "0";
            }else{
                result += "1";
            }
        }

        return result;
    }


    add(element1, element2) {
        let carry = 0;
        let temp;
        let result = "";
        let maxlength = Math.max(element1.length, element2.length);

        if(element1.length < element2.length)
            element1 = this.addZero(element1, element2);
        else
            element2 = this.addZero(element2, element1);

        element1 = reverse(element1);
        element2 = reverse(element2);

        for(let i = 0; i < maxlength; i++){
            temp = (+element1[i]) + (+element2[i]) + carry;
            result += (temp & 1);
            carry = temp >> 1;
        }

        return this.deleteZero(reverse(result + carry));
    }

    sub(element1, element2){
        let borrow = 0;
        let temp;
        let result = "";
        let maxlength = Math.max(element1.length, element2.length);

        if(element1.length < element2.length)
            element1 = this.addZero(element1, element2);
        else
            element2 = this.addZero(element2, element1);

        element1 = reverse(element1);
        element2 = reverse(element2);

        for(let i = 0; i < maxlength; i++){
            temp = (+element1[i]) - (+element2[i]) - borrow;
            if(temp >= 0){
                result += temp;
                borrow = 0;
            }else{
                result += 2 + temp;
                borrow = 1;
            }
        }
        return reverse(result + borrow);
    }

    div(num1, num2){
        let result = "";
        let r = "";

        for(let i = 0; i < num1.length; i++){
            if(this.compareBin(r, num2) === 1 || this.compareBin(r, num2) === 0)
                break;

            r += num1[i];

            if(this.compareBin(r, num2) === -1){
                result += 0;
            }else{
                r = this.sub(r, num2);
                result += 1;
            }
        }

        return result;
    }


    modulo(element1, element2){
        let r = "";

        for(let i = 0; i < element1.length; i++){
            if(this.compareBin(r, element2) === 1 || this.compareBin(r, element2) === 0)
                break;

            r += element1[i];

            if(this.compareBin(r, element2) !== -1){
                r = this.sub(r, element2);
            }
        }

        return r;
    }

    mul(element1, element2) {
        let result = "0";
        let elementMax;
        let elementMin;
        const zero = this.comp(element2);

        if(this.compareBin(element1, element2) === 1){
            elementMax = element1;
            elementMin = element2;
        }else if(this.compareBin(element1, element2) === -1){
            elementMax = element2;
            elementMin = element1;
        }else{
            elementMax = element1;
            elementMin = elementMax;
        }

        for(let i = 0; i < elementMax.length; i++){
            if(elementMin[i] === "1") {
                result = this.add(result, this.leftShift(elementMax, elementMin.length - i - 1));
            }
        }

        result = this.modulo(result, this.generator);


        return  zero || this.deleteZero(result);

    }

    pow(element, pow){
        let result = "1".repeat(this.m);

        for(let i = 0; i < pow.length; i++){
            result = this.mul(result, result);
            if(pow[i] === "1"){
                result = this.mul(result, element);
            }
        }

        return result;

    }

    powQuadratic(element){
        let pow = "10";
        let result = "1";
        for(let i = 0; i < pow.length; i++){
            result = this.mul(result, result);
            if(pow[i] === "1"){
                result = this.mul(result, element);
            }
        }

        return result;
    }

    trace(element){
        let result = "0".repeat(this.m);

        for(let i = 0; i < this.m + 1; i++){
            result = this.addGalois(result, this.leftShift(element, i));
            console.log(result);
        }
        return result;
    }

    inverse(element){
        let result = this.leftShift(element, this.m);
        result = this.div(result, this.powQuadratic(result));

        return this.deleteZero(result, "0");
    }
}

const field = new GaloisField();

const elem1 = field.getGaloisFieldElement();
const elem2 = field.getGaloisFieldElement();
const elem3 = field.getGaloisFieldElement();

console.log('ELEM1');
console.log(elem1, '\n');
console.log('ELEM2');
console.log(elem2, '\n');
console.log('ELEM3');
console.log(elem3, '\n');

console.log('ADD');
console.log(field.addGalois(elem1, elem2), '\n');
console.log('MUL');
console.log(field.mul(elem1, elem2), '\n');
console.log('POW CHECK');
console.log(field.pow(elem1, Math.pow(2, field.m) - 1), '\n');
console.log('TRACE');
console.log(field.trace(elem1), '\n');
console.log('INVERSE CHECK');
console.log(field.mul(elem1,field.inverse(elem1)));
console.log('QUADRATIC');
console.log(field.powQuadratic(elem1));


console.log(field.addGalois(elem1, elem1));


