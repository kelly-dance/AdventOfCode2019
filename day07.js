const util = require('./util.js');
util.readInput(7,data=>{
    data=data.split(',').map(Number);

    let start1 = new Date();
    let best1 = 0;
    for(const perm of [...permutations(0)]){
        let score = perm.reduce((acc,mode)=>new intComputer(data).excute(mode,acc),0);
        if(score>best1) best1 = score;
    }
    console.log("Part 1: "+best1);
    console.log(Date.now()-start1+'ms');

    let start2 = new Date();
    let best2 = 0;
    for(const perm of [...permutations(5)]){
        let computers = [];
        let prev = 0;
        for(const mode of perm){
            let cur = new intComputer(data);
            prev = cur.excute(mode,prev);
            computers.push(cur);
        }
        let iter = cycle(computers);
        while(true){
            let cur = iter.next().value;
            prev = cur.excute(prev);
            if(!cur.running) break;
        }
        if(prev>best2) best2 = prev;
    }
    console.log("Part 2: "+best2);
    console.log(Date.now()-start1+'ms');
},true);

function* permutations(low){ // [low, high)
    for(let a = low; a < low+5; a++){
        for(let b = low; b < low+5; b++){
            if(a==b) continue;
            for(let c = low; c < low+5; c++){
                if(a==c||b==c) continue;
                for(let d = low; d < low+5; d++){
                    if(a==d||b==d||c==d) continue;
                    for(let e = low; e < low+5; e++){
                        if(a==e||b==e||c==e||d==e) continue;
                        yield [a,b,c,d,e];
                    }
                }
            }
        }
    }
}

function* cycle(arr){
    let p = 0;
    while(true) yield arr[p++%arr.length];
}

function intComputer(program){
    this.running = true;
    this.pointer = 0;
    this.ram = program;
    this.excute = function(...n){
        let operation = flags(this.ram[this.pointer]);
        operation.pointers = operation.flags.map((flag,j)=>(flag)?(this.pointer+j+1):(this.ram[this.pointer+j+1]));
        operation.data = operation.pointers.map(p=>this.ram[p]);
        switch (operation.code){
            case 1:
                this.ram[operation.pointers[2]] = operation.data[0] + operation.data[1];
                this.pointer+=4;
                break;
            case 2:
                this.ram[operation.pointers[2]] = operation.data[0] * operation.data[1];
                this.pointer+=4;
                break;
            case 3:
                this.pointer+=2;
                if(n.length==0) {
                    console.log('Insufficient Input for code block. Abruptly exiting');
                    this.running=false;
                    return;
                }
                this.ram[operation.pointers[0]] = n.shift();
                break;
            case 4:
                this.pointer+=2;
                return operation.data[0];
            case 5:
                if(operation.data[0]) this.pointer = operation.data[1];
                else this.pointer+=3;
                break;
            case 6:
                if(!operation.data[0]) this.pointer = operation.data[1];
                else this.pointer+=3;
                break;
            case 7:
                this.ram[operation.pointers[2]] = Number(operation.data[0]<operation.data[1]);
                this.pointer+=4;
                break;
            case 8:
                this.ram[operation.pointers[2]] = Number(operation.data[0]==operation.data[1]);
                this.pointer+=4;
                break;
            default:
                if(operation.code!=99) console.log("Error encounted operation code: "+operation.code);
                this.running = false;
                return n.shift();
        }
        if(this.running) return this.excute(...n);
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