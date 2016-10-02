const NMOVES = 18;
const TWISTS = 3;
const FACES = 6;
const M = 48;
const CUBIES = 24;

const identityCube = null;

let cornerOriInc = new Uint8Array(CUBIES);
let cornerOriDec = new Uint8Array(CUBIES);
let cornerOriNegStrip = new Uint8Array(CUBIES);
let mod24 = new Uint8Array(2 ∗ CUBIES);
let faces = [’U’, ’F’, ’R’, ’D’, ’B’, ’L’];

function edgePerm(cubieVal){
  return (cubieVal >> 1);
}

function edgeOri(cubieVal){
  return (cubieVal & 1);
}

function cornerPerm(cubieVal){
    reurn (cubieVal & 7);
}

function cornerOri(cubieVal){
  return (cubieVal >> 3);
}

function edgeFlip(cubieVal){
  return (cubieVal ^ 1);
}

function edgeVal(perm, ori){
  return perm * 2 + ori;
}
function cornerVal(perm, ori){
  return ori * 8 + perm;
}

//permutation/location is unchanged, if cv2 is not twisted, then cv1 is no changed
//if cv2 is twisted, cv1 fliped
function edgeOriAdd(cv1, cv2){
  return (cv1 ^ this.edgeOri(cv2));
}

function cornerOriAdd(cv1, cv2){
  return mod24[cv1 + (cv2 & 24)];
}

function cornerOriSub(cv1, cv2){
  return cv1 + cornerOriNegStrip[cv2];
}

function init(){
  for(let i = 0; i<CUBIES; i++){
    let perm = cornerPerm(i);
    let ori = cornerOri(i);
    cornerOriInc[i] = cornerVal(perm, (ori+1) % 3);
    cornerOriDec[i] = cornerVal(perm, (ori+2) % 3);
    cornerOriNegStrip[i] = cornerVal(0, (3-ori) % 3);
    mod24[i] = mod24[CUBIES + i] = i;
  }
}

class CubePosition{
  constructor(){
    //low three bits indicating slot position (0-7), next two bits: about orientation
    this.c = new Uint8Array(8);
    //low one bit orientation, next four bits indicating slot position (0-11)
    this.e = new Uint8Array(12);
    for(let i=0; i<8; i++) this.c[i] = cornerVal(i, 0);
    for(let i=0; i<12; i++) this.e[i] = edgeVal(i, 0);
  }

  eqTo(cp){
    return this.c.every((v,i)=>v==cp.c[i]) && this.e.every((v,i)=>v==cp.e[i]);
  }

  lessThan(cp){
    for(let i=0, len = this.c.length; i<len, i++){
      if(this.c[i] < cp.c[i]) return true;
    }
    for(let i=0, len = this.e.length; i<len, i++){
      if(this.e[i] < cp.e[i]) return true;
    }
    return false;
  }

  notEqualTo(cp){
    return !this.eqto(cp);
  }

}
