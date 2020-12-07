const fs = require('fs');
let file = String(fs.readFileSync("inputs/18"));
let maze = file.split('\n').map(r=>r.split(''));
let startx = maze.findIndex(r=>r.includes('@'));
let starty = maze[startx].findIndex(c=>c=='@');
maze[startx][starty] = '.';
let position = {x:startx,y:starty,dist:0};

let calls = 0;
let start = Date.now();
console.log(solveBoard([], position));
console.log(Date.now() - start + 'ms');

function solveBoard(inventory, position){
    let dist = position.dist;
    let visible = findVisible(inventory,position);
    if(visible.length == 0) {
        calls++;
        if(calls%20==0) console.log(calls); 
        //console.log(inventory.filter((_,i)=>i%2==1));
        return dist;
    }
    let best = Infinity; 
    for(let choice of visible){
        let cur = inventory.concat([choice.key,choice.door]);
        let score = solveBoard(cur,choice);
        if(score<best) best = score;
    }
    return best + dist;
}

function findVisible(inventory, start){
    let visible = [];
    start.dist = 0;
    let stack = [start];
    let seen = new Set();
    seen.add(`${start.x},${start.y}`);
    while(stack.length>0){
        let cur = stack.pop();
        if(cur.x<0||cur.x>=maze.length||cur.y<0||cur.y>=maze[cur.x].length) continue;
        let char = maze[cur.x][cur.y];
        if(char=='#' || (char!='.' && char==char.toUpperCase() && !inventory.includes(char))) continue;
        else if(char==char.toLowerCase() && char!='.' && !inventory.includes(char)) visible.push({key:char, door:char.toUpperCase(), dist:cur.dist, x:cur.x, y:cur.y});
        else {
            let [s1,s2,s3,s4] = [`${cur.x+1},${cur.y}`,`${cur.x-1},${cur.y}`,`${cur.x},${cur.y+1}`,`${cur.x},${cur.y-1}`]
            if(!seen.has(s1)) {
                stack.push({x:cur.x+1,y:cur.y,dist:cur.dist+1});
                seen.add(s1);
            }
            if(!seen.has(s2)) {
                stack.push({x:cur.x-1,y:cur.y,dist:cur.dist+1});
                seen.add(s2);
            }
            if(!seen.has(s3)) {
                stack.push({x:cur.x,y:cur.y+1,dist:cur.dist+1});
                seen.add(s3);
            }
            if(!seen.has(s4)) {
                stack.push({x:cur.x,y:cur.y-1,dist:cur.dist+1});
                seen.add(s4);
            }
        }
    }
    return visible;
}