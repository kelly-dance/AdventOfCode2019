const util = require('./util.js');
let tome = {};
util.readInput(14,data=>{
    

    //temporary array for processing in the data
    const dict = data.split('\n').map(line=>{
        let half = line.split('=>').map(s=>s.split(',').map(s=>{
            let comp = s.trim().split(' ');
            return {
                amt: Number(comp[0]),//obviously the associated amount
                name: comp[1]//compound key
            }
        }));
        return {
            reactants: half[0],
            product: half[1][0]
        }
    });
    
    //loading tome
    for(let rxn of dict){
        tome[rxn.product.name] = {
            reactants: rxn.reactants, //array of objects created on line 10
            magnitude: rxn.product.amt, //how much product the reaction created
            stored: 0 //used as buffer for excese resource
        };
    }
    let start = Date.now();
    let ans1 = compute("FUEL",1);
    let time1 = Date.now() - start;
    console.log("Part 1: "+ans1);
    console.log( time1+ 'ms');
    start = Date.now();
    
    //binary search for answer
    let low = 0;
    let high = 1<<24;
    while(low<high){
        let mid = Math.floor((high+low)/2);
        let cur = compute("FUEL",mid);
        if(1E12<cur){
            high = mid-1;
        }else{ 
            low = mid;
        }
    }
    let ans2 = low-1;
    let time2 = Date.now() - start;
    console.log("Part 2: "+ans2);
    console.log(time2 + 'ms');
});

function compute(key, toMake){ 
    if(key=='ORE') return toMake;
    let rxn = tome[key];//created on line 23

    //removed excess from how much we need to make
    if(rxn.stored>toMake){
        rxn.stored-=toMake;
        return 0;
    }
    toMake-=rxn.stored;
    let left = rxn.magnitude-(toMake%rxn.magnitude); //left will be how much extra this reaction will produce
    if(left==rxn.magnitude) left = 0;
    rxn.stored = left; 


    let mult = Math.ceil(toMake/rxn.magnitude); // calculate how much total ingrediants are needed

    let subTotal = 0;
    for(let cmp of rxn.reactants){//cmp is instant of object from line 10
        subTotal+=compute(cmp.name,cmp.amt*mult); 
    }
    return subTotal;
}