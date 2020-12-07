const util = require('./util.js');
util.readParseInput(1,data=>{
    console.log("Part 1: " + util.sum(data.map(mass=>Math.floor(mass/3)-2)));
    console.log("Part 2: " + util.sum(data.map(mass=>fuel(mass)-mass)));
});
function fuel(mass){
    let mine = Math.floor(mass/3)-2;
    if(mine<0) return mass;
    else return mass + fuel(mine);
}