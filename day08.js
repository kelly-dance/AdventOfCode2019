const util = require('./util.js');
util.readInput(8,data=>{
    let segs = [];
    for(let i = 0; i < data.length/150; i++){
        segs.push(data.substring(i*150,(i+1)*150));
    }
    let besti = 0;
    let bests = Infinity;
    for(let i = 0; i < segs.length; i++){
        let score = Array.from(segs[i]).reduce((acc,c)=>{
            if(c=='0') return acc+1;
            else return acc;
        },0);
        if(score<bests) {
            bests = score;
            besti = i; 
        }
    }
    console.log(
        "Part 1: " +
        Array.from(segs[besti]).reduce((acc,c)=>{if(c=='1')return acc+1; else return acc;},0) *
        Array.from(segs[besti]).reduce((acc,c)=>{if(c=='2')return acc+1; else return acc;},0)
    );
    let b = new Array(6).fill(0).map(el=>new Array(25).fill(2));
    let fin = segs.reduce((acc,layer)=>{
        for(let x = 0; x < 6; x++){
            for(let y = 0; y < 25; y++){
                if(acc[x][y]=='2'){
                    acc[x][y] = layer[x*25+y];
                }
            }
        }
        return acc;
    },b);
    console.log("Part 2: ");
    console.log(fin.map(r=>r.join('').replace(/[02]/g,' ').replace(/1/g,'#')).join('\n'));
});