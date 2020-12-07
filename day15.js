const fs = require('fs');

let program = String(fs.readFileSync('inputs/15')).split(',');

let start = Date.now();

let stack = [];

const choiceMap = {
    '1':{
        x:0,
        y:1
    },
    '2':{
        x:0,
        y:-1
    },
    '3':{
        x:-1,
        y:0
    },
    '4':{
        x:1,
        y:0
    }
};

let seen = new Set();
let map = {};
for(let choice in choiceMap) {
    let x = choiceMap[choice].x;
    let y = choiceMap[choice].y;
    let tmp = {};
    tmp.save = new intComputer(program);
    tmp.inst = choice;
    tmp.pos={x:x,y:y};
    tmp.dist = 1;
    seen.add(x+','+y);
    stack.push(tmp);
}
while(stack.length>0){
    let cur = stack.pop();
    let res = cur.save.excute(cur.inst);
    if(!map[cur.pos.x]) map[cur.pos.x]={};
    map[cur.pos.x][cur.pos.y]=res;
    if(res==2) {
        console.log("Part 1: "+cur.dist);
    }
    if(res!=0){
        for(let choice in choiceMap) {
            let x = cur.pos.x+choiceMap[choice].x;
            let y = cur.pos.y+choiceMap[choice].y;
            if(seen.has(x+','+y)) continue;
            else seen.add(x+','+y);
            let tmp = {};
            tmp.save = cur.save.flash();
            tmp.dist = cur.dist+1;
            tmp.inst = choice;
            tmp.pos={x:x,y:y};
            stack.push(tmp);
        }
    }
}
let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = 0;
for(let key in map){
    if(Number(key) < minX) minX = Number(key);
    if(Number(key) > maxX) maxX = Number(key);
    for(let keyY in map[key]){
        if(Number(keyY) < minY) minY = Number(keyY);
        if(Number(keyY) > maxY) maxY = Number(keyY);
    }
}
let out = new Array(maxX-minX+1).fill(0).map(e=>new Array(maxY-minY+1).fill(3));
for(let x in map){
    for(let y in map[x]){
        out[Number(x)-minX][Number(y)-minY] = Number(map[x][y]);
    }
}

let oX = -1;
let oY = -1;
for(let x in out){
    for(let y in out[x]){
        if(out[x][y]==2){
            oX = Number(x);
            oY = Number(y);
        }
    }
}

let bfs = [{x:oX,y:oY}];
let seen2 = new Set();
let depth = 0;
while(bfs.length!=0){
    depth++;
    let next = [];
    while(bfs.length!=0){
        let cur = bfs.pop();
        if(out[cur.x][cur.y]==0) continue;
        else out[cur.x][cur.y] = 2;
        for(let key in choiceMap){
            let x = cur.x+choiceMap[key].x;
            let y = cur.y+choiceMap[key].y;
            if(seen2.has(x+','+y)) continue;
            else seen2.add(x+','+y);
            next.push({x:x,y:y});
        }
    }
    bfs = next;
}
console.log("Part 2: "+(depth-1));
console.log(Date.now() - start + 'ms');

function intComputer(program){
    this.running = true;
    this.pointer = 0n;
    this.ram = program.map(BigInt);
    this.relBase = 0n;
    this.waiting = false;
    this.queue = [];
    this.generateOp = function(){
        let inst = this.ram[this.pointer];
        let operation = {
            code: inst%100n,
            flags:[
                (inst/100n)%10n,
                (inst/1000n)%10n,
                (inst/10000n)
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
    this.flash = function(){
        let copy = new intComputer(this.ram);
        copy.running = this.running;
        copy.pointer = this.pointer;
        copy.relBase = this.relBase;
        copy.waiting = this.waiting;
        copy.queue = this.queue;
        return copy;
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
