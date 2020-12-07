const fs = require('fs');
let file = String(fs.readFileSync('inputs/17')).split(',').map(Number);
let stream = [];
let robot = new intComputer(file);
while(robot.running){
    stream.push(robot.excute());
}

let tmp = '';
for(let char of stream){
    tmp += String.fromCharCode(Number(char));
}
//console.log(tmp);
let map = tmp.substring(0,tmp.length-3).split('\n').map(row=>row.split('').map(c=>(c=='#')?1:(c=='^')?2:0));
let score = 0;
let botX;
let botY;
for(let i = 1; i < map.length - 1; i++){
    for(let j = 1; j < map[i].length - 1; j++){
        if(map[i][j]&&map[i][j+1]&&map[i-1][j]&&map[i+1][j]&&map[i][j-1]){
            score += i*j;
        }
        if(map[i][j]==2){
            botX=i;
            botY=j;
        }
    }
}
console.log("Part 1: "+score);
let instructions = [];
let facing = 0;
let directions = [-1,1,1,-1];
while(true){
    //console.log(botX,botY);
    let prev = facing;
    let prevy = prev%2==1;
    let limit = 0;
    //console.log(prevy);
    if(checkMap(map,botX-1,botY)&&prevy){
        facing = 0;
        limit = 0;
    }
    else if(checkMap(map,botX,botY+1)&&!prevy){
        facing = 1;
        limit = map.length-1;
    }
    else if(checkMap(map,botX+1,botY)&&prevy){
        facing = 2;
        limit = map[0].length-1;
    }
    else if(checkMap(map,botX,botY-1)&&!prevy){
        facing = 3;
    }
    else break;
    //console.log('facing',facing,'before I was facing',prev);
    //console.log('prev',prev);
    //console.log(checkMap(map,botX+1,botY));
    
    let ybol = facing%2==1;
    let start = 0;
    if(ybol) start = botY;
    else start = botX;
    //console.log(facing);
    let dist = -1;
    for(let k = start; true; k+=directions[facing]){
        if(ybol) {
            if(map[botX][k]==0) break;
            else dist++;
        }else{
            if(map[k][botY]==0) break;
            else dist++;
        }
        if(k==limit) break;
    }
    if(ybol) botY+=directions[facing]*dist;
    else botX+=directions[facing]*dist;
    instructions.push(findRot(prev,facing) + dist);
    //console.log('just moved',dist);
}
//console.log(instructions.join(', '));
let f1 = "A,B,A,B,C,C,B,A,C,A\n";
let a = "L,10,R,8,R,6,R,10\n";
let b = "L,12,R,8,L,12\n";
let c = "L,10,R,8,R,8\n";
let inp = (f1+a+b+c).split('').map(c=>c.charCodeAt(0));

function findRot(a,b){
    let l = (a - b + 4)%4;
    let r = (b - a+4)%4;
    if(r<l) return 'R';
    else return 'L';
}

function checkMap(m, x, y){
    if(x<0||x>=m.length) return false;
    if(y<0||y>=m[x].length) return false;
    else return m[x][y]==1;
}

robot = new intComputer(file);
inp.push('n'.charCodeAt(0));
inp.push('\n'.charCodeAt(0));
robot.queue = inp.map(BigInt);
robot.ram[0]=2n;
tmp = '';
let out;
let prev = '';
let fout = '';
while(robot.running){
    prev = out;
    out = robot.excute();
    /*
    if(out==10) {
        //console.log(tmp);
        fout += tmp + '\r\n';
        tmp = '';
    }
    else if(out) tmp+=String.fromCharCode(Number(out));
    else break;*/
}
console.log("Part 2: "+Number(prev));

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
        if(n) while(n.length>0) this.queue.push(n.pop());
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
                    if(this.queue.length==0){
                        this.waiting = true;
                        return;
                    }
                    this.pointer+=2n;
                    this.ram[operation.pointers[0]] = this.queue.shift();
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