const util = require('./util.js');
util.readInput(3,data=>{
    const start = new Date();
    data = data.split('\n').map(line=>line.split(',').map(inst=>({dir:inst.substring(0,1),dist:Number(inst.substring(1))})));
    for(set of data){
        let x = 0, y = 0;
        for(instruction of set){
            instruction.x=x;
            instruction.y=y;
            switch(instruction.dir){
                case "U":
                    y+=instruction.dist;
                    break;
                case "D":
                    y-=instruction.dist;
                    break;
                case "R":
                    x+=instruction.dist;
                    break;
                case "L":
                    x-=instruction.dist;
                    break;
            }
            instruction.w=x;
            instruction.h=y;
        }
    }
    let ans = [];
    let i=0;
    for(a of data[0]){
        let j = 0;
        for(b of data[1]){
            let int = intersects(a,b)
            if(int) {
                ans.push({man:Math.abs(int.x)+Math.abs(int.y),a:a,b:b,dist:i+j+Math.abs((a.x-int.x)+(a.y-int.y))+Math.abs((b.x-int.x)+(b.y-int.y))});
            }
            j+=b.dist;
        } 
        i+=a.dist;
    }
    console.log("Part 1: "+ans.reduce((acc,n)=>(n.man<acc.man)?n:acc,{man:Infinity,dist:Infinity}).man);
    console.log("Part 2: "+ans.reduce((acc,n)=>(n.dist<acc.dist)?n:acc,{man:Infinity,dist:Infinity}).dist);
    console.log(Date.now()-start);
});
function intersects(a,b){
    if((a.x==a.w&&b.x==b.w) ||(a.y==a.h&&b.y==b.h)) return false;
    if(a.x!=a.w&&b.x==b.w&&(Math.min(a.x,a.w)<b.x&&b.x<Math.max(a.x,a.w)&&Math.min(b.y,b.h)<a.y&&a.y<Math.max(b.y,b.h))) return {x:a.x,y:b.y};
    if(a.x==a.w&&b.x!=b.w&&(Math.min(a.y,a.h)<b.y&&b.y<Math.max(a.y,a.h)&&Math.min(b.x,b.w)<a.x&&a.x<Math.max(b.x,b.w))) return {x:b.x,y:a.y};
}