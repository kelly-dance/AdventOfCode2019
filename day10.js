const util = require('./util.js');
util.readInput(10,data=>{
    data = data.split('\n').map(a=>a.split(''));
    const map = data.map(r=>r.map(c=>c=='#'));
    let best = 0;
    let xb, yb;
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map[x].length; y++){
            if(!map[x][y]) continue;
            let valid = new Set();
            let hist = [];
            for(let x2 = 0; x2 < map.length; x2++){
                for(let y2 = 0; y2 < map[x2].length; y2++){
                    if(!map[x2][y2] || (x==x2&&y==y2)) continue;
                    valid.add(round((y-y2)/(x-x2))+(((x-x2)>0)?'p':'n'));
                }
            }
            let size = [...valid].length;
            if(size>best) {
                best = size;
                xb=x;
                yb=y;
            }
        }
    }
    console.log("Part 1: " +best);
    console.log(xb,yb);
    data[xb][yb]='X';
    let h = [];
    let subset = [];
    let seen = new Set();
    while(subset.length<=200){
        for(let x2 = 0; x2 < map.length; x2++){
            for(let y2 = 0; y2 < map[x2].length; y2++){
                if(!map[x2][y2] || (xb==x2&&yb==y2)) continue;
                subset.push({
                    neg: (y2-yb)<0,
                    ang: round((x2-xb)/(y2-yb)),
                    score: y2*100+x2,
                    x:x2,
                    y:y2,
                    d: Math.abs(x2-xb)+Math.abs(y2-yb)
                });
            }
        }
    }
    let unique = [];
    while(subset.length){
        //console.log(subset.length);
        [unique, subset] = split(subset);
        h = h.concat(unique.sort((a,b)=>{
            if(a.neg?!b.neg:b.neg){
                return a.neg?1:-1;
            }else return (a.ang<b.ang)?-1:1;
        }));
    }
    
    for(let astroid of h){
        //console.log(astroid.x,astroid.y);
        data[astroid.x][astroid.y]=(astroid.neg)?'O':'Q';
        //console.log(data.map(r=>r.join('')).join('\n'));
        //console.log();
    }
    console.log(h[199]);
});

function split(arr){
    let family = new Map();
    let marked = new Array(arr.length).fill(false);
    for(let i = 0; i < arr.length; i++){
        for(let j = 0; j < arr.length; j++){
            if(i==j) continue;
            if(arr[i].neg==arr[j].neg&&arr[i].ang==arr[j].ang){
                marked[i]=true;
                marked[j]=true;
                if(!family.has(arr[i].ang+','+arr[i].neg)){
                    family.set(arr[i].ang+','+arr[i].neg, new Set());
                }
                //console.log(family.get(arr[i].ang+','+arr[i].neg));
                family.get(arr[i].ang+','+arr[i].neg).add(arr[i]).add(arr[j]);
            }
        }
    }
    let unique = [];
    let dup = [];
    for(let i = 0; i < arr.length; i++){
        if(!marked[i]) unique.push(arr[i]);
    }
    for(let fam of family){
        let best;
        let min = Infinity;
        for(let point of fam[1]){
            if(point.d<min){
                min=point.d;
                best = point;
            }
        }
        for(let point of fam[1]){
            if(point!=best) dup.push(point);
            else unique.push(point);
        }
    }
    return [unique,dup];
}

function round(n){
    return Math.round(n*1000000)/1000000;
}