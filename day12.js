const util = require('./util.js');
util.readInput(12,data=>{
    let planets = data.split('\n').map(line=>line.match(/-?\d+/g).map(Number)).map(arr=>({
        x:arr[0],
        y:arr[1],
        z:arr[2],
        vx:0,
        vy:0,
        vz:0
    }));
    //console.log(planets);
    let sln = JSON.parse(JSON.stringify(planets));
    let p1;
    let xF = 0;
    let yF = 0;
    let zF = 0;
    let t = 0;
    while(t <= 1000 || !xF || !yF || !zF){
        if(t==1000){
            p1 = planets.reduce((acc,p)=>{
                let pot = Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z); 
                let kin = Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.vz); 
                return acc+pot*kin;
            },0);
        }
        let tmpx = true;
        let tmpy = true;
        let tmpz = true;
        for(let i = 0; i < planets.length; i++){
            if(planets[i].x!=sln[i].x) tmpx = false;
            if(planets[i].y!=sln[i].y) tmpy = false;
            if(planets[i].z!=sln[i].z) tmpz = false;
        }
        if(!xF && tmpx) xF = t;
        if(!yF && tmpy) yF = t;
        if(!zF && tmpz) zF = t;
        
        for(let ai = 0; ai < planets.length-1; ai++){
            a = planets[ai];
            for(let bi = ai+1; bi < planets.length; bi++){
                b = planets[bi];
                if(a.x<b.x){
                    a.vx++;
                    b.vx--;
                }else if(a.x!=b.x){
                    a.vx--;
                    b.vx++;
                }
                if(a.y<b.y){
                    a.vy++;
                    b.vy--;
                }else if(a.y!=b.y){
                    a.vy--;
                    b.vy++;
                }
                if(a.z<b.z){
                    a.vz++;
                    b.vz--;
                }else if(a.z!=b.z){
                    a.vz--;
                    b.vz++;
                }
            }
        }
        for(let c of planets){
            c.x+=c.vx;
            c.y+=c.vy;
            c.z+=c.vz;
        }
        t++;
    }
    console.log('Part 1: '+p1);
    console.log('Part 2: '+(lcm(lcm(xF+1,yF+1),zF+1)));
});

function lcm(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number')) 
     return false;
   return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
 }
 
 function gcd(x, y) {
   x = Math.abs(x);
   y = Math.abs(y);
   while(y) {
     var t = y;
     y = x % y;
     x = t;
   }
   return x;
 }