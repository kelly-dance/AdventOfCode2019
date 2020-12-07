const fs = require('fs');
const treeSum = (node,d=0) => d + ((node.orbitedBy.length>0) ? node.orbitedBy.map(n=>treeSum(n,d+1)).reduce((a,n)=>a+n,0) : 0);
const pathToCOM = n => (n.orbits) ? [n.id].concat(...pathToCOM(n.orbits)) : [];
fs.readFile('inputs/6',(err,data)=>{
    const start = new Date();
    const orbits = String(data).split('\n');
    let orbitMap = {};
    for(const key of [...new Set(orbits.map(o=>o.split(')')).flat(1))]) orbitMap[key]={id:key,orbits:null,orbitedBy:[]};
    for(const orbit of orbits){
        let [parent, child] = orbit.split(')');
        orbitMap[parent].orbitedBy.push(orbitMap[child]);
        orbitMap[child].orbits = orbitMap[parent];
    }
    console.log("Part 1: "+treeSum(orbitMap.COM));
    const p1 = pathToCOM(orbitMap.YOU.orbits);
    const p2 = pathToCOM(orbitMap.SAN.orbits);
    const ancestor = p1.reduce((acc,key)=>(acc)?acc:(p2.includes(key))?key:0,0);
    console.log("Part 2: "+(p1.findIndex(a=>a==ancestor)+p2.findIndex(a=>a==ancestor)));
    console.log(Date.now()-start+'ms');
});