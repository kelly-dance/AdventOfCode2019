const util = require('./util.js');
util.readInput(11,data=>{
    data=data.split(',').map(BigInt);
    let robot1 = new intComputer(data);
    let x = 0, y = 0, dir = 0;
    let b = {};
    while(robot1.running){
        if(!b[x]) b[x]={};
        let color = robot1.excute(BigInt(b[x][y]==1));//excute gets next output & can be used to feed input
        if(!robot1.running)break;
        b[x][y]=color;
        if(robot1.excute()) dir++;
        else dir--;
        dir = (dir+4)%4;
        switch(dir){
            case 0:
                y++;
                break;
            case 1:
                x++;
                break;
            case 2:
                y--;
                break;
            case 3:
                x--;
                break;
        }
    }
    let s = 0;
    for(let key in b) s+=Object.keys(b[key]).length; //sum visited locations
    console.log("Part 1: "+s);
    let robot2 = new intComputer(data);
    x = 0, y = 0, dir = 0;
    b = {'0':{'0':1n}};
    while(robot2.running){
        if(!b[x]) b[x]={};
        let color = robot2.excute(BigInt(b[x][y]==1));//excute gets next output & can be used to feed input
        if(!robot2.running)break;
        b[x][y]=color;
        if(robot2.excute()) dir++;
        else dir--;
        dir = (dir+4)%4;
        switch(dir){
            case 0:
                y++;
                break;
            case 1:
                x++;
                break;
            case 2:
                y--;
                break;
            case 3:
                x--;
                break;
        }
    }
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    for(let key in b){
        if(Number(key) < minX) minX = Number(key);
        if(Number(key) > maxX) maxX = Number(key);
        for(let keyY in b[key]){
            if(Number(keyY) < minY) minY = Number(keyY);
            if(Number(keyY) > maxY) maxY = Number(keyY);
        }
    }
    let out = new Array(maxX-minX+1).fill(0).map(e=>new Array(maxY-minY+1).fill(false));
    for(let x in b){
        for(let y in b[x]){
            out[Number(x)-minX][Number(y)-minY] = Boolean(b[x][y]);
        }
    }
    console.log('Part 2:');
    for(let i = out[0].length-1; i >= 0; i--){
        let msg = '';
        for(let j = 0; j < out.length; j++){
            msg+=(out[j][i])?'#':' ';
        }
        console.log(msg);
    }
},true);

function intComputer(program){
    this.running = true;
    this.pointer = BigInt(0);
    this.ram = program.slice();
    this.relBase = BigInt(0);
    this.excute = function(...n){
        while(this.running){
            let operation = flags(this.ram[this.pointer]);
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
                    this.pointer+=2n;
                    if(n.length==0) {
                        console.log('Insufficient Input for code block. Abruptly exiting');
                        this.running=false;
                        return;
                    }
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

function flags(n){
    return {
        code: n%100n,
        flags:[
            (n/100n)%10n,
            (n/1000n)%10n,
            (n/10000n),
        ]
    };
}