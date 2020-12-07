const util = require('./util.js');
util.readInput(9,data=>{
    data=data.split(',').map(BigInt);
    console.log("Part 1: "+ new intComputer(data).excute(1));
    console.log("Part 2: "+ new intComputer(data).excute(2));
},true);

function intComputer(program){
    this.running = true;
    this.pointer = BigInt(0);
    this.ram = program;
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
            operation.data = operation.pointers.map(p=>this.ram[p]);
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
                    this.ram[operation.pointers[2]] = Number(operation.data[0]<operation.data[1]);
                    this.pointer+=4n;
                    break;
                case 8n:
                    this.ram[operation.pointers[2]] = Number(operation.data[0]==operation.data[1]);
                    this.pointer+=4n;
                    break;
                case 9n:
                    this.relBase += operation.data[0];
                    this.pointer+=2n;
                    break;
                default:
                    if(operation.code!=99) console.log("Error encounted operation code: "+operation.code);
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