const min = 168630;
const max = 718098;
let p1 = 0;
let p2 = 0;
const start = new Date();
for(let i = min; i < max; i++){
    if(check1(i))p1++;
    if(check2(i))p2++;
}

function check1(n){
    n = String(n);
    n='0'+n;
    let valid = true;
    let dec = false;
    let double = false;
    for(let i = 1; i < 7; i++){
        if(n.charAt(i)<n.charAt(i-1)) valid = false;
        else if(n.charAt(i)==n.charAt(i-1)) double=true;
        else dec = true;
    }
    return valid&&double&&dec;
}
console.log("Part 1: "+p1);
console.log("Part 2: "+p2);
function check2(n){
    n = String(n);
    n='00'+n+'a';
    let valid = true;
    let dec = false;
    let double = false;
    for(let i = 2; i < 8; i++){
        if(n.charAt(i)<n.charAt(i-1)) valid = false;
        else if(n.charAt(i)==n.charAt(i-1)&&n.charAt(i)!=n.charAt(i-2)&&n.charAt(i)!=n.charAt(i+1)) double=true;
        else dec = true;
    }
    return valid&&double&&dec;
}

console.log(Date.now()-start);