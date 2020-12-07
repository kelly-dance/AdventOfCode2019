const fs = require('fs');
module.exports = {};

function readInput(n,callback){//alias to read problem input, saves a couple keystrokes
    fs.readFile(`inputs/${n}`,(err,data)=>{
        if(err) throw err;
        else callback(String(data));
    });
} module.exports.readInput = readInput;

function parseInput(data,twoD){ //parses string into an array and if its numbers will put into number type. if twoD is true it will seperate at commas
    data = data.replace('\r','');
    if(!data.includes('\n') && data.includes(',')) data = data.split(',');
    else data = data.split('\n');
    if(twoD) {
        data = data.map(line=>line.split(','));
        if(data.every(line=>line.every(isDigit))) data = data.map(line=>line.map(Number));
    }else{
        if(data.every(isDigit)) data = data.map(Number);
    }
    return data;
} module.exports.parseInput = parseInput;

function isDigit(str){ //regex test to see if a string is a number
    return /^[+-]?\d+$/.test(str);
} module.exports.isDigit = isDigit;

function readParseInput(n,callback,twoD){ //given an input number reads the file and parses into an array and makes numbers into number types. twoD = true if there arre multiple values per line.
    readInput(n,data=>{
        callback(parseInput(data,twoD));
    });
} module.exports.readParseInput = readParseInput;

function sum(values) { //simple function to save keystrokes summing arrays
    return values.reduce((acc,n)=>acc+n,0);
} module.exports.sum = sum;

function dist(p1,p2){ //simple function to take distance between 2 points in n dimensions
    let dim = Math.min(p1.length,p2.length);
    let temp = 0;
    for(let i = 0; i < dim; i++){
        temp+=Math.pow(p1[i]-p2[i],2);
    }
    return Math.sqrt(temp);
} module.exports.dist = dist;