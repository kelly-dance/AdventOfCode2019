const util = require('./util.js');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
util.readInput(13,data=>{
    let prog = data.split(',').map(BigInt);
    
    let game = new intComputer(prog);
    let out = [];
    while(game.running){
        let f = game.excute();
        if(!f&&f!=0) break;
        setAt(out,f,game.excute(),game.excute());
    }
    let sum = 0;
    for(let a of out){
        for(let b of a){
            if(b==2) sum++;
        }
    }
    console.log("Part 1: "+sum);
    
    prog[0]=2n;
    let game2 = new intComputer(prog);
    tick(game2,0,[],0);
});

function tick(game,input,board,score){
    game.addQueue(BigInt(input));
    while(!game.waiting){
        let f = game.excute();
        let s = game.excute();
        let t = game.excute();
        //console.log(f,s,t);
        if(!f&&f!=0) break;
        if(f!=-1) setAt(board,f,s,t);
        else score = t;
    }
    //display(board, score);
    //console.log(score);
    if(game.running) inputAssist(game,board,score);
    else {
        console.log("Part 2: "+Number(score));
        process.exit();
    }
}

function inputAssist(game,board,score){
    const map = {a:-1,s:0,d:1};
    let player = findC(board,3);
    let ball = findC(board,4);
    if(ball==player) tick(game,0,board,score);
    else if(ball<player) tick(game,-1,board,score);
    else tick(game,1,board,score);
    /*
    readline.question("Input required: ", input2 => {
        if(map[input2]==undefined) inputAssist(game,board,score);
        else tick(game,map[input2],board,score);
    });
    */
}

function display(out,score){
    console.log(Number(score));
    const chars = [" ", "#", "X", "_", "O"];
    for(let x = 0; x<out[0].length;x++){
        let temp = "";
        for(let y = 0; y<out.length;y++){
            temp+=chars[out[y][x]];
        }
        console.log(temp);
    }
}

function findC(arr,char){
    for(let c = 0; c < arr.length; c++){
        for(let r = 0; r < arr[c].length; r++){
            if(arr[c][r]==char) return c;
        }
    }
    return Math.floor(arr[0].length/2);
}

function setAt(a,x,y,z){
    while(a.length<=x)a.push([]);
    a[x][y]=z;
}

function intComputer(program){
    this.running = true;
    this.pointer = BigInt(0);
    this.ram = program.slice();
    this.relBase = BigInt(0);
    this.waiting = false;
    this.queue = [];
    this.generateOp = function(){
        let inst = this.ram[this.pointer];
        let operation = {
            code: inst%100n,
            flags:[
                (inst/100n)%10n,
                (inst/1000n)%10n,
                (inst/10000n),
            ]
        }
        operation.pointers = operation.flags.map((flag,j)=>{
            j=BigInt(j);
            switch(flag){
                case 0n:
                    return this.ram[this.pointer+j+1n];
                case 1n:
                    return this.pointer+j+1n;
                case 2n:
                    return this.ram[this.pointer+j+1n]+this.relBase;
            }
        });
        operation.data = operation.pointers.map(p=>this.ram[p]||0n);
        return operation;
    }
    this.addQueue = function(n){
        this.waiting=false;
        this.queue.push(n);
    }
    this.excute = function(...n){
        if(!n)n=[];
        n = n.concat(this.queue);
        this.queue=[];
        while(this.running){
            let operation = this.generateOp();
            //console.log(operation);
            switch (operation.code){
                case 1n:
                    this.ram[operation.pointers[2]] = operation.data[0] + operation.data[1];
                    this.pointer+=4n;
                    break;
                case 2n:
                    this.ram[operation.pointers[2]] = operation.data[0] * operation.data[1];
                    this.pointer+=4n;
                    break;
                case 3n:
                    if(n.length==0){
                        this.waiting = true;
                        return;
                    }
                    this.pointer+=2n;
                    this.ram[operation.pointers[0]] = n.shift();
                    break;
                case 4n:
                    this.pointer+=2n;
                    return operation.data[0];
                case 5n:
                    if(operation.data[0]) this.pointer = operation.data[1];
                    else this.pointer+=3n;
                    break;
                case 6n:
                    if(!operation.data[0]) this.pointer = operation.data[1];
                    else this.pointer+=3n;
                    break;
                case 7n:
                    this.ram[operation.pointers[2]] = BigInt(operation.data[0]<operation.data[1]);
                    this.pointer+=4n;
                    break;
                case 8n:
                    this.ram[operation.pointers[2]] = BigInt(operation.data[0]==operation.data[1]);
                    this.pointer+=4n;
                    break;
                case 9n:
                    this.relBase += operation.data[0];
                    this.pointer+=2n;
                    break;
                default:
                    if(operation.code!=99n) console.log("Error encounted operation code: "+operation.code);
                    this.running = false;
                    return n.shift();
            }
        }
    }
}