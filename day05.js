const util = require('./util.js');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
util.readInput(5,data=>{
    data=data.split(',').map(Number);
    console.log("Instructions:\n\tPart 1: Input 1\n\tPart 2: Input 5\n\tOutput is last non-zero output");
    run(data);
},true);

async function run(arr){
    let running = true; pointer = 0;
    while(running && pointer < arr.length-1){
        let operation = flags(arr[pointer]);
        operation.pointers = operation.flags.map((flag,j)=>(flag)?(pointer+j+1):(arr[pointer+j+1]));
        operation.data = operation.pointers.map(p=>arr[p]);
        //console.log(pointer,arr[pointer],operation);
        switch (operation.code){
            case 1:
                arr[operation.pointers[2]] = operation.data[0] + operation.data[1];
                pointer+=4;
                break;
            case 2:
                arr[operation.pointers[2]] = operation.data[0] * operation.data[1];
                pointer+=4;
                break;
            case 3:
                arr[operation.pointers[0]] = await new Promise((resolve)=>readline.question("Input required: ", input => resolve(Number(input))));
                pointer+=2;
                break;
            case 4:
                console.log(operation.data[0]);
                pointer+=2;
                break;
            case 5:
                if(operation.data[0]) pointer = operation.data[1];
                else pointer+=3;
                break;
            case 6:
                if(!operation.data[0]) pointer = operation.data[1];
                else pointer+=3;
                break;
            case 7:
                arr[operation.pointers[2]] = Number(operation.data[0]<operation.data[1]);
                pointer+=4;
                break;
            case 8:
                arr[operation.pointers[2]] = Number(operation.data[0]==operation.data[1]);
                pointer+=4;
                break;
            default:
                if(operation.code!=99) console.log("Error encounted operation code: "+operation.code);
                running = false;
                break;
        }
    }
}

function flags(n){
    return {
        code: n%100,
        flags:[
            Math.floor(n/100)%10,
            Math.floor(n/1000)%10,
            Math.floor(n/10000),
        ]
    };
}