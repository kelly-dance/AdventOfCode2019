const util = require('./util.js');
util.readParseInput(2,data=>{
    //Part 1
    let program = data.slice();
    program[1]=12;
    program[2]=2;
    console.log("Part 1: "+run(program));

    //Part 2 Brute force
    for(let a = 0; a < 100; a++){
        for(let b = 0; b < 100; b++){
            let arr = data.slice();
            arr[1]=a;
            arr[2]=b;
            if(run(arr)==19690720) {
                console.log("Part 2: " + (100*a+b));
                break;
            }
        }
    }
});

function run(arr){
    for(let i = 0; i < arr.length; i+=4){
        if(arr[i]==1){
            arr[arr[i+3]] = arr[arr[i+1]]+arr[arr[i+2]];
        }else if(arr[i]==2){
            arr[arr[i+3]] = arr[arr[i+1]]*arr[arr[i+2]];
        }else break;
    }
    return arr[0];
}