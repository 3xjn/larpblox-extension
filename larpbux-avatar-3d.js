"use strict";var LarpbloxAvatar3D=(()=>{var Aa=Object.defineProperty;var Eu=Object.getOwnPropertyDescriptor;var bu=Object.getOwnPropertyNames;var _u=Object.prototype.hasOwnProperty;var wu=(i,t)=>{for(var e in t)Aa(i,e,{get:t[e],enumerable:!0})},Tu=(i,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of bu(t))!_u.call(i,s)&&s!==e&&Aa(i,s,{get:()=>t[s],enumerable:!(n=Eu(t,s))||n.enumerable});return i};var Cu=i=>Tu(Aa({},"__esModule",{value:!0}),i);var Gx={};wu(Gx,{avatarMaterials:()=>pu,create:()=>Vx,headshotFrame:()=>fu,matchEffectMesh:()=>Wc,readSmokestackMesh:()=>xa,repairCoincidentFaces:()=>mu,restoreGearPose:()=>gu,smokestackMeshUVs:()=>va,smokestackSeason:()=>uu,smokestackTextureMatches:()=>Nx});var fn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},yn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},wl=0,nc=1,Tl=2;var ic=1,Cl=2,Mn=3,Ve=0,Ie=1,Ye=2,Nn=0,Un=1,pi=2,sc=3,rc=4,Rl=5,Wn=100,Pl=101,Il=102,Dl=103,Ll=104,Ul=200,Nl=201,Fl=202,Bl=203,Nr=204,Fr=205,Ol=206,zl=207,Hl=208,kl=209,Vl=210,Gl=211,Wl=212,Xl=213,Yl=214,ao=0,co=1,lo=2,ci=3,ho=4,uo=5,fo=6,po=7,mo=0,ql=1,jl=2,pn=0,Ql=1,Zl=2,Kl=3,Jl=4,$l=5,th=6,eh=7;var oc=300,mi=301,gi=302,go=303,xo=304,Zs=306,Wi=1e3,Gn=1001,Br=1002,$e=1003,nh=1004;var Ks=1005;var ln=1006,vo=1007;var Kn=1008;var mn=1009,ac=1010,cc=1011,ss=1012,yo=1013,Jn=1014,An=1015,rs=1016,Mo=1017,Ao=1018,os=1020,lc=35902,hc=35899,uc=1021,dc=1022,en=1023,Xi=1026,as=1027,fc=1028,So=1029,pc=1030,Eo=1031;var bo=1033,Js=33776,$s=33777,tr=33778,er=33779,_o=35840,wo=35841,To=35842,Co=35843,Ro=36196,Po=37492,Io=37496,Do=37808,Lo=37809,Uo=37810,No=37811,Fo=37812,Bo=37813,Oo=37814,zo=37815,Ho=37816,ko=37817,Vo=37818,Go=37819,Wo=37820,Xo=37821,Yo=36492,qo=36494,jo=36495,Qo=36283,Zo=36284,Ko=36285,Jo=36286;var Cs=2300,Or=2301,Ur=2302,qa=2400,ja=2401,Qa=2402;var ih=3200,sh=3201;var $o=0,rh=1,Fn="",ie="srgb",li="srgb-linear",Rs="linear",$t="srgb";var ai=7680;var Za=519,oh=512,ah=513,ch=514,mc=515,lh=516,hh=517,uh=518,dh=519,zr=35044;var gc="300 es",cn=2e3,Ps=2001;var xn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},_e=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Kc=1234567,ws=Math.PI/180,Yi=180/Math.PI;function Dn(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(_e[i&255]+_e[i>>8&255]+_e[i>>16&255]+_e[i>>24&255]+"-"+_e[t&255]+_e[t>>8&255]+"-"+_e[t>>16&15|64]+_e[t>>24&255]+"-"+_e[e&63|128]+_e[e>>8&255]+"-"+_e[e>>16&255]+_e[e>>24&255]+_e[n&255]+_e[n>>8&255]+_e[n>>16&255]+_e[n>>24&255]).toLowerCase()}function Vt(i,t,e){return Math.max(t,Math.min(e,i))}function xc(i,t){return(i%t+t)%t}function Ru(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Pu(i,t,e){return i!==t?(e-i)/(t-i):0}function Ts(i,t,e){return(1-e)*i+e*t}function Iu(i,t,e,n){return Ts(i,t,1-Math.exp(-e*n))}function Du(i,t=1){return t-Math.abs(xc(i,t*2)-t)}function Lu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Uu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Nu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Fu(i,t){return i+Math.random()*(t-i)}function Bu(i){return i*(.5-Math.random())}function Ou(i){i!==void 0&&(Kc=i);let t=Kc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function zu(i){return i*ws}function Hu(i){return i*Yi}function ku(i){return(i&i-1)===0&&i!==0}function Vu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Gu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Wu(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),u=o((t+n)/2),h=r((t-n)/2),f=o((t-n)/2),p=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*u,l*h,l*f,a*c);break;case"YZY":i.set(l*f,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*f,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function an(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Kt(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var qe={DEG2RAD:ws,RAD2DEG:Yi,generateUUID:Dn,clamp:Vt,euclideanModulo:xc,mapLinear:Ru,inverseLerp:Pu,lerp:Ts,damp:Iu,pingpong:Du,smoothstep:Lu,smootherstep:Uu,randInt:Nu,randFloat:Fu,randFloatSpread:Bu,seededRandom:Ou,degToRad:zu,radToDeg:Hu,isPowerOfTwo:ku,ceilPowerOfTwo:Vu,floorPowerOfTwo:Gu,setQuaternionFromProperEuler:Wu,normalize:Kt,denormalize:an},St=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Vt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ue=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3],f=r[o+0],p=r[o+1],g=r[o+2],x=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=x;return}if(h!==x||l!==f||c!==p||u!==g){let m=1-a,d=l*f+c*p+u*g+h*x,S=d>=0?1:-1,E=1-d*d;if(E>Number.EPSILON){let C=Math.sqrt(E),w=Math.atan2(C,d*S);m=Math.sin(m*w)/C,a=Math.sin(a*w)/C}let M=a*S;if(l=l*m+f*M,c=c*m+p*M,u=u*m+g*M,h=h*m+x*M,m===1-a){let C=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=C,c*=C,u*=C,h*=C}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+u*h+l*p-c*f,t[e+1]=l*g+u*f+c*h-a*p,t[e+2]=c*g+u*p+a*f-l*h,t[e+3]=u*g-a*h-l*f-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),f=l(n/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*u*h+c*p*g,this._y=c*p*h-f*u*g,this._z=c*u*g+f*p*h,this._w=c*u*h-f*p*g;break;case"YXZ":this._x=f*u*h+c*p*g,this._y=c*p*h-f*u*g,this._z=c*u*g-f*p*h,this._w=c*u*h+f*p*g;break;case"ZXY":this._x=f*u*h-c*p*g,this._y=c*p*h+f*u*g,this._z=c*u*g+f*p*h,this._w=c*u*h-f*p*g;break;case"ZYX":this._x=f*u*h-c*p*g,this._y=c*p*h+f*u*g,this._z=c*u*g-f*p*h,this._w=c*u*h+f*p*g;break;case"YZX":this._x=f*u*h+c*p*g,this._y=c*p*h+f*u*g,this._z=c*u*g-f*p*h,this._w=c*u*h-f*p*g;break;case"XZY":this._x=f*u*h-c*p*g,this._y=c*p*h-f*u*g,this._z=c*u*g+f*p*h,this._w=c*u*h+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],f=n+a+h;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>h){let p=2*Math.sqrt(1+n-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>h){let p=2*Math.sqrt(1+a-n-h);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+u)/p}else{let p=2*Math.sqrt(1+h-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Vt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,f=Math.sin(e*u)/c;return this._w=o*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},T=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Jc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Jc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),u=2*(a*e-r*s),h=2*(r*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this.z=Vt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this.z=Vt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Sa.copy(this).projectOnVector(t),this.sub(Sa)}reflect(t){return this.sub(Sa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Vt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Sa=new T,Jc=new Ue,Ot=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],p=n[5],g=n[8],x=s[0],m=s[3],d=s[6],S=s[1],E=s[4],M=s[7],C=s[2],w=s[5],I=s[8];return r[0]=o*x+a*S+l*C,r[3]=o*m+a*E+l*w,r[6]=o*d+a*M+l*I,r[1]=c*x+u*S+h*C,r[4]=c*m+u*E+h*w,r[7]=c*d+u*M+h*I,r[2]=f*x+p*S+g*C,r[5]=f*m+p*E+g*w,r[8]=f*d+p*M+g*I,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,f=a*l-u*r,p=c*r-o*l,g=e*h+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return t[0]=h*x,t[1]=(s*c-u*n)*x,t[2]=(a*n-s*o)*x,t[3]=f*x,t[4]=(u*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=p*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ea.makeScale(t,e)),this}rotate(t){return this.premultiply(Ea.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ea.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ea=new Ot;function vc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function qi(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function fh(){let i=qi("canvas");return i.style.display="block",i}var $c={};function ji(i){i in $c||($c[i]=!0,console.warn(i))}function ph(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var tl=new Ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),el=new Ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xu(){let i={enabled:!0,workingColorSpace:li,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===$t&&(s.r=Ln(s.r),s.g=Ln(s.g),s.b=Ln(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===$t&&(s.r=Vi(s.r),s.g=Vi(s.g),s.b=Vi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Fn?Rs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ji("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ji("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[li]:{primaries:t,whitePoint:n,transfer:Rs,toXYZ:tl,fromXYZ:el,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ie},outputColorSpaceConfig:{drawingBufferColorSpace:ie}},[ie]:{primaries:t,whitePoint:n,transfer:$t,toXYZ:tl,fromXYZ:el,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ie}}}),i}var Wt=Xu();function Ln(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Vi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var _i,Hr=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{_i===void 0&&(_i=qi("canvas")),_i.width=t.width,_i.height=t.height;let s=_i.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=_i}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=qi("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ln(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ln(e[n]/255)*255):e[n]=Ln(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Yu=0,Qi=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Yu++}),this.uuid=Dn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ba(s[o].image)):r.push(ba(s[o]))}else r=ba(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ba(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Hr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var qu=0,_a=new T,Ne=class i extends xn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Gn,s=Gn,r=ln,o=Kn,a=en,l=mn,c=i.DEFAULT_ANISOTROPY,u=Fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=Dn(),this.name="",this.source=new Qi(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new St(0,0),this.repeat=new St(1,1),this.center=new St(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(_a).x}get height(){return this.source.getSize(_a).y}get depth(){return this.source.getSize(_a).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==oc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Wi:t.x=t.x-Math.floor(t.x);break;case Gn:t.x=t.x<0?0:1;break;case Br:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Wi:t.y=t.y-Math.floor(t.y);break;case Gn:t.y=t.y<0?0:1;break;case Br:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Ne.DEFAULT_IMAGE=null;Ne.DEFAULT_MAPPING=oc;Ne.DEFAULT_ANISOTROPY=1;var Jt=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],u=l[4],h=l[8],f=l[1],p=l[5],g=l[9],x=l[2],m=l[6],d=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let E=(c+1)/2,M=(p+1)/2,C=(d+1)/2,w=(u+f)/4,I=(h+x)/4,N=(g+m)/4;return E>M&&E>C?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=w/n,r=I/n):M>C?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=w/s,r=N/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=I/r,s=N/r),this.set(n,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(h-x)*(h-x)+(f-u)*(f-u));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(h-x)/S,this.z=(f-u)/S,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this.z=Vt(this.z,t.z,e.z),this.w=Vt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this.z=Vt(this.z,t,e),this.w=Vt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},kr=class extends xn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ln,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Jt(0,0,t,e),this.scissorTest=!1,this.viewport=new Jt(0,0,t,e);let s={width:t,height:e,depth:n.depth},r=new Ne(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:ln,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Qi(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},vn=class extends kr{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Is=class extends Ne{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=$e,this.minFilter=$e,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Vr=class extends Ne{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=$e,this.minFilter=$e,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var pe=class{constructor(t=new T(1/0,1/0,1/0),e=new T(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,sn):sn.fromBufferAttribute(r,o),sn.applyMatrix4(t.matrixWorld),this.expandByPoint(sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),lr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),lr.copy(n.boundingBox)),lr.applyMatrix4(t.matrixWorld),this.union(lr)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,sn),sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(xs),hr.subVectors(this.max,xs),wi.subVectors(t.a,xs),Ti.subVectors(t.b,xs),Ci.subVectors(t.c,xs),Bn.subVectors(Ti,wi),On.subVectors(Ci,Ti),ii.subVectors(wi,Ci);let e=[0,-Bn.z,Bn.y,0,-On.z,On.y,0,-ii.z,ii.y,Bn.z,0,-Bn.x,On.z,0,-On.x,ii.z,0,-ii.x,-Bn.y,Bn.x,0,-On.y,On.x,0,-ii.y,ii.x,0];return!wa(e,wi,Ti,Ci,hr)||(e=[1,0,0,0,1,0,0,0,1],!wa(e,wi,Ti,Ci,hr))?!1:(ur.crossVectors(Bn,On),e=[ur.x,ur.y,ur.z],wa(e,wi,Ti,Ci,hr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(_n),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},_n=[new T,new T,new T,new T,new T,new T,new T,new T],sn=new T,lr=new pe,wi=new T,Ti=new T,Ci=new T,Bn=new T,On=new T,ii=new T,xs=new T,hr=new T,ur=new T,si=new T;function wa(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){si.fromArray(i,r);let a=s.x*Math.abs(si.x)+s.y*Math.abs(si.y)+s.z*Math.abs(si.z),l=t.dot(si),c=e.dot(si),u=n.dot(si);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var ju=new pe,vs=new T,Ta=new T,Xn=class{constructor(t=new T,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):ju.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;vs.subVectors(t,this.center);let e=vs.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(vs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ta.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(vs.copy(t.center).add(Ta)),this.expandByPoint(vs.copy(t.center).sub(Ta))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},wn=new T,Ca=new T,dr=new T,zn=new T,Ra=new T,fr=new T,Pa=new T,Yn=class{constructor(t=new T,e=new T(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,wn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=wn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(wn.copy(this.origin).addScaledVector(this.direction,e),wn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ca.copy(t).add(e).multiplyScalar(.5),dr.copy(e).sub(t).normalize(),zn.copy(this.origin).sub(Ca);let r=t.distanceTo(e)*.5,o=-this.direction.dot(dr),a=zn.dot(this.direction),l=-zn.dot(dr),c=zn.lengthSq(),u=Math.abs(1-o*o),h,f,p,g;if(u>0)if(h=o*l-a,f=o*a-l,g=r*u,h>=0)if(f>=-g)if(f<=g){let x=1/u;h*=x,f*=x,p=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=r,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;else f=-r,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;else f<=-g?(h=Math.max(0,-(-o*r+a)),f=h>0?-r:Math.min(Math.max(-r,-l),r),p=-h*h+f*(f+2*l)+c):f<=g?(h=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(h=Math.max(0,-(o*r+a)),f=h>0?r:Math.min(Math.max(-r,-l),r),p=-h*h+f*(f+2*l)+c);else f=o>0?-r:r,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Ca).addScaledVector(dr,f),p}intersectSphere(t,e){wn.subVectors(t.center,this.origin);let n=wn.dot(this.direction),s=wn.dot(wn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),u>=0?(r=(t.min.y-f.y)*u,o=(t.max.y-f.y)*u):(r=(t.max.y-f.y)*u,o=(t.min.y-f.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-f.z)*h,l=(t.max.z-f.z)*h):(a=(t.max.z-f.z)*h,l=(t.min.z-f.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,wn)!==null}intersectTriangle(t,e,n,s,r){Ra.subVectors(e,t),fr.subVectors(n,t),Pa.crossVectors(Ra,fr);let o=this.direction.dot(Pa),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;zn.subVectors(this.origin,t);let l=a*this.direction.dot(fr.crossVectors(zn,fr));if(l<0)return null;let c=a*this.direction.dot(Ra.cross(zn));if(c<0||l+c>o)return null;let u=-a*zn.dot(Pa);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},se=class i{constructor(t,e,n,s,r,o,a,l,c,u,h,f,p,g,x,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,u,h,f,p,g,x,m)}set(t,e,n,s,r,o,a,l,c,u,h,f,p,g,x,m){let d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=f,d[3]=p,d[7]=g,d[11]=x,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Ri.setFromMatrixColumn(t,0).length(),r=1/Ri.setFromMatrixColumn(t,1).length(),o=1/Ri.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){let f=o*u,p=o*h,g=a*u,x=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=p+g*c,e[5]=f-x*c,e[9]=-a*l,e[2]=x-f*c,e[6]=g+p*c,e[10]=o*l}else if(t.order==="YXZ"){let f=l*u,p=l*h,g=c*u,x=c*h;e[0]=f+x*a,e[4]=g*a-p,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=p*a-g,e[6]=x+f*a,e[10]=o*l}else if(t.order==="ZXY"){let f=l*u,p=l*h,g=c*u,x=c*h;e[0]=f-x*a,e[4]=-o*h,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*u,e[9]=x-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let f=o*u,p=o*h,g=a*u,x=a*h;e[0]=l*u,e[4]=g*c-p,e[8]=f*c+x,e[1]=l*h,e[5]=x*c+f,e[9]=p*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let f=o*l,p=o*c,g=a*l,x=a*c;e[0]=l*u,e[4]=x-f*h,e[8]=g*h+p,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=p*h+g,e[10]=f-x*h}else if(t.order==="XZY"){let f=o*l,p=o*c,g=a*l,x=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=f*h+x,e[5]=o*u,e[9]=p*h-g,e[2]=g*h-p,e[6]=a*u,e[10]=x*h+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Qu,t,Zu)}lookAt(t,e,n){let s=this.elements;return He.subVectors(t,e),He.lengthSq()===0&&(He.z=1),He.normalize(),Hn.crossVectors(n,He),Hn.lengthSq()===0&&(Math.abs(n.z)===1?He.x+=1e-4:He.z+=1e-4,He.normalize(),Hn.crossVectors(n,He)),Hn.normalize(),pr.crossVectors(He,Hn),s[0]=Hn.x,s[4]=pr.x,s[8]=He.x,s[1]=Hn.y,s[5]=pr.y,s[9]=He.y,s[2]=Hn.z,s[6]=pr.z,s[10]=He.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],p=n[13],g=n[2],x=n[6],m=n[10],d=n[14],S=n[3],E=n[7],M=n[11],C=n[15],w=s[0],I=s[4],N=s[8],b=s[12],A=s[1],P=s[5],F=s[9],H=s[13],X=s[2],q=s[6],G=s[10],et=s[14],k=s[3],ot=s[7],lt=s[11],_t=s[15];return r[0]=o*w+a*A+l*X+c*k,r[4]=o*I+a*P+l*q+c*ot,r[8]=o*N+a*F+l*G+c*lt,r[12]=o*b+a*H+l*et+c*_t,r[1]=u*w+h*A+f*X+p*k,r[5]=u*I+h*P+f*q+p*ot,r[9]=u*N+h*F+f*G+p*lt,r[13]=u*b+h*H+f*et+p*_t,r[2]=g*w+x*A+m*X+d*k,r[6]=g*I+x*P+m*q+d*ot,r[10]=g*N+x*F+m*G+d*lt,r[14]=g*b+x*H+m*et+d*_t,r[3]=S*w+E*A+M*X+C*k,r[7]=S*I+E*P+M*q+C*ot,r[11]=S*N+E*F+M*G+C*lt,r[15]=S*b+E*H+M*et+C*_t,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],f=t[10],p=t[14],g=t[3],x=t[7],m=t[11],d=t[15];return g*(+r*l*h-s*c*h-r*a*f+n*c*f+s*a*p-n*l*p)+x*(+e*l*p-e*c*f+r*o*f-s*o*p+s*c*u-r*l*u)+m*(+e*c*h-e*a*p-r*o*h+n*o*p+r*a*u-n*c*u)+d*(-s*a*u-e*l*h+e*a*f+s*o*h-n*o*f+n*l*u)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],f=t[10],p=t[11],g=t[12],x=t[13],m=t[14],d=t[15],S=h*m*c-x*f*c+x*l*p-a*m*p-h*l*d+a*f*d,E=g*f*c-u*m*c-g*l*p+o*m*p+u*l*d-o*f*d,M=u*x*c-g*h*c+g*a*p-o*x*p-u*a*d+o*h*d,C=g*h*l-u*x*l-g*a*f+o*x*f+u*a*m-o*h*m,w=e*S+n*E+s*M+r*C;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let I=1/w;return t[0]=S*I,t[1]=(x*f*r-h*m*r-x*s*p+n*m*p+h*s*d-n*f*d)*I,t[2]=(a*m*r-x*l*r+x*s*c-n*m*c-a*s*d+n*l*d)*I,t[3]=(h*l*r-a*f*r-h*s*c+n*f*c+a*s*p-n*l*p)*I,t[4]=E*I,t[5]=(u*m*r-g*f*r+g*s*p-e*m*p-u*s*d+e*f*d)*I,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*d-e*l*d)*I,t[7]=(o*f*r-u*l*r+u*s*c-e*f*c-o*s*p+e*l*p)*I,t[8]=M*I,t[9]=(g*h*r-u*x*r-g*n*p+e*x*p+u*n*d-e*h*d)*I,t[10]=(o*x*r-g*a*r+g*n*c-e*x*c-o*n*d+e*a*d)*I,t[11]=(u*a*r-o*h*r-u*n*c+e*h*c+o*n*p-e*a*p)*I,t[12]=C*I,t[13]=(u*x*s-g*h*s+g*n*f-e*x*f-u*n*m+e*h*m)*I,t[14]=(g*a*s-o*x*s-g*n*l+e*x*l+o*n*m-e*a*m)*I,t[15]=(o*h*s-u*a*s+u*n*l-e*h*l-o*n*f+e*a*f)*I,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,h=a+a,f=r*c,p=r*u,g=r*h,x=o*u,m=o*h,d=a*h,S=l*c,E=l*u,M=l*h,C=n.x,w=n.y,I=n.z;return s[0]=(1-(x+d))*C,s[1]=(p+M)*C,s[2]=(g-E)*C,s[3]=0,s[4]=(p-M)*w,s[5]=(1-(f+d))*w,s[6]=(m+S)*w,s[7]=0,s[8]=(g+E)*I,s[9]=(m-S)*I,s[10]=(1-(f+x))*I,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Ri.set(s[0],s[1],s[2]).length(),o=Ri.set(s[4],s[5],s[6]).length(),a=Ri.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],rn.copy(this);let c=1/r,u=1/o,h=1/a;return rn.elements[0]*=c,rn.elements[1]*=c,rn.elements[2]*=c,rn.elements[4]*=u,rn.elements[5]*=u,rn.elements[6]*=u,rn.elements[8]*=h,rn.elements[9]*=h,rn.elements[10]*=h,e.setFromRotationMatrix(rn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=cn,l=!1){let c=this.elements,u=2*r/(e-t),h=2*r/(n-s),f=(e+t)/(e-t),p=(n+s)/(n-s),g,x;if(l)g=r/(o-r),x=o*r/(o-r);else if(a===cn)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Ps)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=cn,l=!1){let c=this.elements,u=2/(e-t),h=2/(n-s),f=-(e+t)/(e-t),p=-(n+s)/(n-s),g,x;if(l)g=1/(o-r),x=o/(o-r);else if(a===cn)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===Ps)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=h,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Ri=new T,rn=new se,Qu=new T(0,0,0),Zu=new T(1,1,1),Hn=new T,pr=new T,He=new T,nl=new se,il=new Ue,tn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Vt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Vt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Vt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Vt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return nl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(nl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return il.setFromEuler(this),this.setFromQuaternion(il,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};tn.DEFAULT_ORDER="XYZ";var Ds=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Ku=0,sl=new T,Pi=new Ue,Tn=new se,mr=new T,ys=new T,Ju=new T,$u=new Ue,rl=new T(1,0,0),ol=new T(0,1,0),al=new T(0,0,1),cl={type:"added"},td={type:"removed"},Ii={type:"childadded",child:null},Ia={type:"childremoved",child:null},Se=class i extends xn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=Dn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new T,e=new tn,n=new Ue,s=new T(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new Ot}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ds,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Pi.setFromAxisAngle(t,e),this.quaternion.multiply(Pi),this}rotateOnWorldAxis(t,e){return Pi.setFromAxisAngle(t,e),this.quaternion.premultiply(Pi),this}rotateX(t){return this.rotateOnAxis(rl,t)}rotateY(t){return this.rotateOnAxis(ol,t)}rotateZ(t){return this.rotateOnAxis(al,t)}translateOnAxis(t,e){return sl.copy(t).applyQuaternion(this.quaternion),this.position.add(sl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(rl,t)}translateY(t){return this.translateOnAxis(ol,t)}translateZ(t){return this.translateOnAxis(al,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?mr.copy(t):mr.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(ys,mr,this.up):Tn.lookAt(mr,ys,this.up),this.quaternion.setFromRotationMatrix(Tn),s&&(Tn.extractRotation(s.matrixWorld),Pi.setFromRotationMatrix(Tn),this.quaternion.premultiply(Pi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(cl),Ii.child=t,this.dispatchEvent(Ii),Ii.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(td),Ia.child=t,this.dispatchEvent(Ia),Ia.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Tn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Tn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(cl),Ii.child=t,this.dispatchEvent(Ii),Ii.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,t,Ju),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,$u,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),f=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Se.DEFAULT_UP=new T(0,1,0);Se.DEFAULT_MATRIX_AUTO_UPDATE=!0;Se.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var on=new T,Cn=new T,Da=new T,Rn=new T,Di=new T,Li=new T,ll=new T,La=new T,Ua=new T,Na=new T,Fa=new Jt,Ba=new Jt,Oa=new Jt,In=class i{constructor(t=new T,e=new T,n=new T){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),on.subVectors(t,e),s.cross(on);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){on.subVectors(s,e),Cn.subVectors(n,e),Da.subVectors(t,e);let o=on.dot(on),a=on.dot(Cn),l=on.dot(Da),c=Cn.dot(Cn),u=Cn.dot(Da),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;let f=1/h,p=(c*l-a*u)*f,g=(o*u-a*l)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Rn)===null?!1:Rn.x>=0&&Rn.y>=0&&Rn.x+Rn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Rn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Rn.x),l.addScaledVector(o,Rn.y),l.addScaledVector(a,Rn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Fa.setScalar(0),Ba.setScalar(0),Oa.setScalar(0),Fa.fromBufferAttribute(t,e),Ba.fromBufferAttribute(t,n),Oa.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Fa,r.x),o.addScaledVector(Ba,r.y),o.addScaledVector(Oa,r.z),o}static isFrontFacing(t,e,n,s){return on.subVectors(n,e),Cn.subVectors(t,e),on.cross(Cn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return on.subVectors(this.c,this.b),Cn.subVectors(this.a,this.b),on.cross(Cn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Di.subVectors(s,n),Li.subVectors(r,n),La.subVectors(t,n);let l=Di.dot(La),c=Li.dot(La);if(l<=0&&c<=0)return e.copy(n);Ua.subVectors(t,s);let u=Di.dot(Ua),h=Li.dot(Ua);if(u>=0&&h<=u)return e.copy(s);let f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(Di,o);Na.subVectors(t,r);let p=Di.dot(Na),g=Li.dot(Na);if(g>=0&&p<=g)return e.copy(r);let x=p*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Li,a);let m=u*g-p*h;if(m<=0&&h-u>=0&&p-g>=0)return ll.subVectors(r,s),a=(h-u)/(h-u+(p-g)),e.copy(s).addScaledVector(ll,a);let d=1/(m+x+f);return o=x*d,a=f*d,e.copy(n).addScaledVector(Di,o).addScaledVector(Li,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},mh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},kn={h:0,s:0,l:0},gr={h:0,s:0,l:0};function za(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Rt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ie){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Wt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Wt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Wt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Wt.workingColorSpace){if(t=xc(t,1),e=Vt(e,0,1),n=Vt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=za(o,r,t+1/3),this.g=za(o,r,t),this.b=za(o,r,t-1/3)}return Wt.colorSpaceToWorking(this,s),this}setStyle(t,e=ie){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ie){let n=mh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ln(t.r),this.g=Ln(t.g),this.b=Ln(t.b),this}copyLinearToSRGB(t){return this.r=Vi(t.r),this.g=Vi(t.g),this.b=Vi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ie){return Wt.workingToColorSpace(we.copy(this),t),Math.round(Vt(we.r*255,0,255))*65536+Math.round(Vt(we.g*255,0,255))*256+Math.round(Vt(we.b*255,0,255))}getHexString(t=ie){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Wt.workingColorSpace){Wt.workingToColorSpace(we.copy(this),e);let n=we.r,s=we.g,r=we.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Wt.workingColorSpace){return Wt.workingToColorSpace(we.copy(this),e),t.r=we.r,t.g=we.g,t.b=we.b,t}getStyle(t=ie){Wt.workingToColorSpace(we.copy(this),t);let e=we.r,n=we.g,s=we.b;return t!==ie?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(kn),this.setHSL(kn.h+t,kn.s+e,kn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(kn),t.getHSL(gr);let n=Ts(kn.h,gr.h,e),s=Ts(kn.s,gr.s,e),r=Ts(kn.l,gr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},we=new Rt;Rt.NAMES=mh;var ed=0,Pe=class extends xn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ed++}),this.uuid=Dn(),this.name="",this.type="Material",this.blending=Un,this.side=Ve,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nr,this.blendDst=Fr,this.blendEquation=Wn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Rt(0,0,0),this.blendAlpha=0,this.depthFunc=ci,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Za,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ai,this.stencilZFail=ai,this.stencilZPass=ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Un&&(n.blending=this.blending),this.side!==Ve&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Nr&&(n.blendSrc=this.blendSrc),this.blendDst!==Fr&&(n.blendDst=this.blendDst),this.blendEquation!==Wn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ci&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Za&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Ls=class extends Pe{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.combine=mo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var me=new T,xr=new St,nd=0,Le=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:nd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=zr,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)xr.fromBufferAttribute(this,e),xr.applyMatrix3(t),this.setXY(e,xr.x,xr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=an(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Kt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=an(e,this.array)),e}setX(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=an(e,this.array)),e}setY(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=an(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=an(e,this.array)),e}setW(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),s=Kt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),s=Kt(s,this.array),r=Kt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==zr&&(t.usage=this.usage),t}};var Us=class extends Le{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Ns=class extends Le{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var ae=class extends Le{constructor(t,e,n){super(new Float32Array(t),e,n)}},id=0,Ze=new se,Ha=new Se,Ui=new T,ke=new pe,Ms=new pe,Ae=new T,xe=class i extends xn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:id++}),this.uuid=Dn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(vc(t)?Ns:Us)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ze.makeRotationFromQuaternion(t),this.applyMatrix4(Ze),this}rotateX(t){return Ze.makeRotationX(t),this.applyMatrix4(Ze),this}rotateY(t){return Ze.makeRotationY(t),this.applyMatrix4(Ze),this}rotateZ(t){return Ze.makeRotationZ(t),this.applyMatrix4(Ze),this}translate(t,e,n){return Ze.makeTranslation(t,e,n),this.applyMatrix4(Ze),this}scale(t,e,n){return Ze.makeScale(t,e,n),this.applyMatrix4(Ze),this}lookAt(t){return Ha.lookAt(t),Ha.updateMatrix(),this.applyMatrix4(Ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ui).negate(),this.translate(Ui.x,Ui.y,Ui.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ae(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pe);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new T(-1/0,-1/0,-1/0),new T(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];ke.setFromBufferAttribute(r),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,ke.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,ke.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(ke.min),this.boundingBox.expandByPoint(ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new T,1/0);return}if(t){let n=this.boundingSphere.center;if(ke.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Ms.setFromBufferAttribute(a),this.morphTargetsRelative?(Ae.addVectors(ke.min,Ms.min),ke.expandByPoint(Ae),Ae.addVectors(ke.max,Ms.max),ke.expandByPoint(Ae)):(ke.expandByPoint(Ms.min),ke.expandByPoint(Ms.max))}ke.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ae.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ae));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Ae.fromBufferAttribute(a,c),l&&(Ui.fromBufferAttribute(t,c),Ae.add(Ui)),s=Math.max(s,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Le(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let N=0;N<n.count;N++)a[N]=new T,l[N]=new T;let c=new T,u=new T,h=new T,f=new St,p=new St,g=new St,x=new T,m=new T;function d(N,b,A){c.fromBufferAttribute(n,N),u.fromBufferAttribute(n,b),h.fromBufferAttribute(n,A),f.fromBufferAttribute(r,N),p.fromBufferAttribute(r,b),g.fromBufferAttribute(r,A),u.sub(c),h.sub(c),p.sub(f),g.sub(f);let P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(P),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(P),a[N].add(x),a[b].add(x),a[A].add(x),l[N].add(m),l[b].add(m),l[A].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let N=0,b=S.length;N<b;++N){let A=S[N],P=A.start,F=A.count;for(let H=P,X=P+F;H<X;H+=3)d(t.getX(H+0),t.getX(H+1),t.getX(H+2))}let E=new T,M=new T,C=new T,w=new T;function I(N){C.fromBufferAttribute(s,N),w.copy(C);let b=a[N];E.copy(b),E.sub(C.multiplyScalar(C.dot(b))).normalize(),M.crossVectors(w,b);let P=M.dot(l[N])<0?-1:1;o.setXYZW(N,E.x,E.y,E.z,P)}for(let N=0,b=S.length;N<b;++N){let A=S[N],P=A.start,F=A.count;for(let H=P,X=P+F;H<X;H+=3)I(t.getX(H+0)),I(t.getX(H+1)),I(t.getX(H+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Le(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);let s=new T,r=new T,o=new T,a=new T,l=new T,c=new T,u=new T,h=new T;if(t)for(let f=0,p=t.count;f<p;f+=3){let g=t.getX(f+0),x=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(a,l){let c=a.array,u=a.itemSize,h=a.normalized,f=new c.constructor(l.length*u),p=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*u;for(let d=0;d<u;d++)f[g++]=c[p++]}return new Le(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){let f=c[u],p=t(f,n);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){let p=c[h];u.push(p.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(e))}let r=t.morphAttributes;for(let c in r){let u=[],h=r[c];for(let f=0,p=h.length;f<p;f++)u.push(h[f].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},hl=new se,ri=new Yn,vr=new Xn,ul=new T,yr=new T,Mr=new T,Ar=new T,ka=new T,Sr=new T,dl=new T,Er=new T,be=class extends Se{constructor(t=new xe,e=new Ls){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Sr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],h=r[l];u!==0&&(ka.fromBufferAttribute(h,t),o?Sr.addScaledVector(ka,u):Sr.addScaledVector(ka.sub(e),u))}e.add(Sr)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vr.copy(n.boundingSphere),vr.applyMatrix4(r),ri.copy(t.ray).recast(t.near),!(vr.containsPoint(ri.origin)===!1&&(ri.intersectSphere(vr,ul)===null||ri.origin.distanceToSquared(ul)>(t.far-t.near)**2))&&(hl.copy(r).invert(),ri.copy(t.ray).applyMatrix4(hl),!(n.boundingBox!==null&&ri.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ri)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],d=o[m.materialIndex],S=Math.max(m.start,p.start),E=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=S,C=E;M<C;M+=3){let w=a.getX(M),I=a.getX(M+1),N=a.getX(M+2);s=br(this,d,t,n,c,u,h,w,I,N),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=g,d=x;m<d;m+=3){let S=a.getX(m),E=a.getX(m+1),M=a.getX(m+2);s=br(this,o,t,n,c,u,h,S,E,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],d=o[m.materialIndex],S=Math.max(m.start,p.start),E=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=S,C=E;M<C;M+=3){let w=M,I=M+1,N=M+2;s=br(this,d,t,n,c,u,h,w,I,N),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=g,d=x;m<d;m+=3){let S=m,E=m+1,M=m+2;s=br(this,o,t,n,c,u,h,S,E,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function sd(i,t,e,n,s,r,o,a){let l;if(t.side===Ie?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Ve,a),l===null)return null;Er.copy(a),Er.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Er);return c<e.near||c>e.far?null:{distance:c,point:Er.clone(),object:i}}function br(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,yr),i.getVertexPosition(l,Mr),i.getVertexPosition(c,Ar);let u=sd(i,t,e,n,yr,Mr,Ar,dl);if(u){let h=new T;In.getBarycoord(dl,yr,Mr,Ar,h),s&&(u.uv=In.getInterpolatedAttribute(s,a,l,c,h,new St)),r&&(u.uv1=In.getInterpolatedAttribute(r,a,l,c,h,new St)),o&&(u.normal=In.getInterpolatedAttribute(o,a,l,c,h,new T),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new T,materialIndex:0};In.getNormal(yr,Mr,Ar,f.normal),u.face=f,u.barycoord=h}return u}var Zi=class i extends xe{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],h=[],f=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ae(c,3)),this.setAttribute("normal",new ae(u,3)),this.setAttribute("uv",new ae(h,2));function g(x,m,d,S,E,M,C,w,I,N,b){let A=M/I,P=C/N,F=M/2,H=C/2,X=w/2,q=I+1,G=N+1,et=0,k=0,ot=new T;for(let lt=0;lt<G;lt++){let _t=lt*P-H;for(let Nt=0;Nt<q;Nt++){let Zt=Nt*A-F;ot[x]=Zt*S,ot[m]=_t*E,ot[d]=X,c.push(ot.x,ot.y,ot.z),ot[x]=0,ot[m]=0,ot[d]=w>0?1:-1,u.push(ot.x,ot.y,ot.z),h.push(Nt/I),h.push(1-lt/N),et+=1}}for(let lt=0;lt<N;lt++)for(let _t=0;_t<I;_t++){let Nt=f+_t+q*lt,Zt=f+_t+q*(lt+1),re=f+(_t+1)+q*(lt+1),qt=f+(_t+1)+q*lt;l.push(Nt,Zt,qt),l.push(Zt,re,qt),k+=6}a.addGroup(p,k,b),p+=k,f+=et}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function xi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Te(i){let t={};for(let e=0;e<i.length;e++){let n=xi(i[e]);for(let s in n)t[s]=n[s]}return t}function rd(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function yc(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Wt.workingColorSpace}var gh={clone:xi,merge:Te},od=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ad=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,hn=class extends Pe{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=od,this.fragmentShader=ad,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=xi(t.uniforms),this.uniformsGroups=rd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Fs=class extends Se{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=cn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Vn=new T,fl=new St,pl=new St,Ee=class extends Fs{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Yi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ws*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Yi*2*Math.atan(Math.tan(ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Vn.x,Vn.y).multiplyScalar(-t/Vn.z),Vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vn.x,Vn.y).multiplyScalar(-t/Vn.z)}getViewSize(t,e){return this.getViewBounds(t,fl,pl),e.subVectors(pl,fl)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ws*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Ni=-90,Fi=1,Gr=class extends Se{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ee(Ni,Fi,t,e);s.layers=this.layers,this.add(s);let r=new Ee(Ni,Fi,t,e);r.layers=this.layers,this.add(r);let o=new Ee(Ni,Fi,t,e);o.layers=this.layers,this.add(o);let a=new Ee(Ni,Fi,t,e);a.layers=this.layers,this.add(a);let l=new Ee(Ni,Fi,t,e);l.layers=this.layers,this.add(l);let c=new Ee(Ni,Fi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===cn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ps)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,h=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Bs=class extends Ne{constructor(t=[],e=mi,n,s,r,o,a,l,c,u){super(t,e,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Wr=class extends vn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Bs(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Zi(5,5,5),r=new hn({name:"CubemapFromEquirect",uniforms:xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ie,blending:Nn});r.uniforms.tEquirect.value=e;let o=new be(s,r),a=e.minFilter;return e.minFilter===Kn&&(e.minFilter=ln),new Gr(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},Je=class extends Se{constructor(){super(),this.isGroup=!0,this.type="Group"}},cd={type:"move"},Ki=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Je,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Je,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new T,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new T),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Je,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new T,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new T),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let x of t.hand.values()){let m=e.getJointPose(x,n),d=this._getHandJoint(c,x);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(cd)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Je;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}};var Os=class extends Se{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new tn,this.environmentIntensity=1,this.environmentRotation=new tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},Xr=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=zr,this.updateRanges=[],this.version=0,this.uuid=Dn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Dn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Dn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Re=new T,zs=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix4(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyNormalMatrix(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.transformDirection(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=an(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Kt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=an(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=an(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=an(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=an(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),s=Kt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),s=Kt(s,this.array),r=Kt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Le(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},hi=class extends Pe{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Rt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Bi,As=new T,Oi=new T,zi=new T,Hi=new St,Ss=new St,xh=new se,_r=new T,Es=new T,wr=new T,ml=new St,Va=new St,gl=new St,Ji=class extends Se{constructor(t=new hi){if(super(),this.isSprite=!0,this.type="Sprite",Bi===void 0){Bi=new xe;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Xr(e,5);Bi.setIndex([0,1,2,0,2,3]),Bi.setAttribute("position",new zs(n,3,0,!1)),Bi.setAttribute("uv",new zs(n,2,3,!1))}this.geometry=Bi,this.material=t,this.center=new St(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Oi.setFromMatrixScale(this.matrixWorld),xh.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),zi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Oi.multiplyScalar(-zi.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;Tr(_r.set(-.5,-.5,0),zi,o,Oi,s,r),Tr(Es.set(.5,-.5,0),zi,o,Oi,s,r),Tr(wr.set(.5,.5,0),zi,o,Oi,s,r),ml.set(0,0),Va.set(1,0),gl.set(1,1);let a=t.ray.intersectTriangle(_r,Es,wr,!1,As);if(a===null&&(Tr(Es.set(-.5,.5,0),zi,o,Oi,s,r),Va.set(0,1),a=t.ray.intersectTriangle(_r,wr,Es,!1,As),a===null))return;let l=t.ray.origin.distanceTo(As);l<t.near||l>t.far||e.push({distance:l,point:As.clone(),uv:In.getInterpolation(As,_r,Es,wr,ml,Va,gl,new St),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function Tr(i,t,e,n,s,r){Hi.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Ss.x=r*Hi.x-s*Hi.y,Ss.y=s*Hi.x+r*Hi.y):Ss.copy(Hi),i.copy(t),i.x+=Ss.x,i.y+=Ss.y,i.applyMatrix4(xh)}var Ga=new T,ld=new T,hd=new Ot,Ke=class{constructor(t=new T(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Ga.subVectors(n,e).cross(ld.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Ga),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||hd.getNormalMatrix(t),s=this.coplanarPoint(Ga).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},oi=new Xn,ud=new St(.5,.5),Cr=new T,$i=class{constructor(t=new Ke,e=new Ke,n=new Ke,s=new Ke,r=new Ke,o=new Ke){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=cn,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],f=r[6],p=r[7],g=r[8],x=r[9],m=r[10],d=r[11],S=r[12],E=r[13],M=r[14],C=r[15];if(s[0].setComponents(c-o,p-u,d-g,C-S).normalize(),s[1].setComponents(c+o,p+u,d+g,C+S).normalize(),s[2].setComponents(c+a,p+h,d+x,C+E).normalize(),s[3].setComponents(c-a,p-h,d-x,C-E).normalize(),n)s[4].setComponents(l,f,m,M).normalize(),s[5].setComponents(c-l,p-f,d-m,C-M).normalize();else if(s[4].setComponents(c-l,p-f,d-m,C-M).normalize(),e===cn)s[5].setComponents(c+l,p+f,d+m,C+M).normalize();else if(e===Ps)s[5].setComponents(l,f,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),oi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),oi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(oi)}intersectsSprite(t){oi.center.set(0,0,0);let e=ud.distanceTo(t.center);return oi.radius=.7071067811865476+e,oi.applyMatrix4(t.matrixWorld),this.intersectsSphere(oi)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Cr.x=s.normal.x>0?t.max.x:t.min.x,Cr.y=s.normal.y>0?t.max.y:t.min.y,Cr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Cr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var qn=class extends Pe{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Yr=new T,qr=new T,xl=new se,bs=new Yn,Rr=new Xn,Wa=new T,vl=new T,jr=class extends Se{constructor(t=new xe,e=new qn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Yr.fromBufferAttribute(e,s-1),qr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Yr.distanceTo(qr);t.setAttribute("lineDistance",new ae(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Rr.copy(n.boundingSphere),Rr.applyMatrix4(s),Rr.radius+=r,t.ray.intersectsSphere(Rr)===!1)return;xl.copy(s).invert(),bs.copy(t.ray).applyMatrix4(xl);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,f=n.attributes.position;if(u!==null){let p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let x=p,m=g-1;x<m;x+=c){let d=u.getX(x),S=u.getX(x+1),E=Pr(this,t,bs,l,d,S,x);E&&e.push(E)}if(this.isLineLoop){let x=u.getX(g-1),m=u.getX(p),d=Pr(this,t,bs,l,x,m,g-1);d&&e.push(d)}}else{let p=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let x=p,m=g-1;x<m;x+=c){let d=Pr(this,t,bs,l,x,x+1,x);d&&e.push(d)}if(this.isLineLoop){let x=Pr(this,t,bs,l,g-1,p,g-1);x&&e.push(x)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Pr(i,t,e,n,s,r,o){let a=i.geometry.attributes.position;if(Yr.fromBufferAttribute(a,s),qr.fromBufferAttribute(a,r),e.distanceSqToSegment(Yr,qr,Wa,vl)>n)return;Wa.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Wa);if(!(c<t.near||c>t.far))return{distance:c,point:vl.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var yl=new T,Ml=new T,ts=class extends jr{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)yl.fromBufferAttribute(e,s),Ml.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+yl.distanceTo(Ml);t.setAttribute("lineDistance",new ae(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Ge=class extends Pe{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Rt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Al=new se,Ka=new Yn,Ir=new Xn,Dr=new T,un=class extends Se{constructor(t=new xe,e=new Ge){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ir.copy(n.boundingSphere),Ir.applyMatrix4(s),Ir.radius+=r,t.ray.intersectsSphere(Ir)===!1)return;Al.copy(s).invert(),Ka.copy(t.ray).applyMatrix4(Al);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){let f=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=f,x=p;g<x;g++){let m=c.getX(g);Dr.fromBufferAttribute(h,m),Sl(Dr,m,l,s,t,e,this)}}else{let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let g=f,x=p;g<x;g++)Dr.fromBufferAttribute(h,g),Sl(Dr,g,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Sl(i,t,e,n,s,r,o){let a=Ka.distanceSqToPoint(i);if(a<e){let l=new T;Ka.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Hs=class extends Ne{constructor(t,e,n=Jn,s,r,o,a=$e,l=$e,c,u=Xi,h=1){if(u!==Xi&&u!==as)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:t,height:e,depth:h};super(f,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Qi(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},ks=class extends Ne{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}};var Vs=class i extends xe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=t/a,f=e/l,p=[],g=[],x=[],m=[];for(let d=0;d<u;d++){let S=d*f-o;for(let E=0;E<c;E++){let M=E*h-r;g.push(M,-S,0),x.push(0,0,1),m.push(E/a),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let S=0;S<a;S++){let E=S+c*d,M=S+c*(d+1),C=S+1+c*(d+1),w=S+1+c*d;p.push(E,M,w),p.push(M,C,w)}this.setIndex(p),this.setAttribute("position",new ae(g,3)),this.setAttribute("normal",new ae(x,3)),this.setAttribute("uv",new ae(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var Gs=class extends Pe{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$o,this.normalScale=new St(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var ui=class extends Pe{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Rt(16777215),this.specular=new Rt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$o,this.normalScale=new St(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.combine=mo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Qr=class extends Pe{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ih,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Zr=class extends Pe{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Lr(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function dd(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var di=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Kr=class extends di{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:qa,endingEnd:qa}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case ja:r=t,a=2*e-n;break;case Qa:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ja:o=t,l=2*n-e;break;case Qa:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,u=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,p=this._weightNext,g=(n-e)/(s-e),x=g*g,m=x*g,d=-f*m+2*f*x-f*g,S=(1+f)*m+(-1.5-2*f)*x+(-.5+f)*g+1,E=(-1-p)*m+(1.5+p)*x+.5*g,M=p*m-p*x;for(let C=0;C!==a;++C)r[C]=d*o[u+C]+S*o[c+C]+E*o[l+C]+M*o[h+C];return r}},Jr=class extends di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=(n-e)/(s-e),h=1-u;for(let f=0;f!==a;++f)r[f]=o[c+f]*h+o[l+f]*u;return r}},$r=class extends di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},We=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Lr(e,this.TimeBufferType),this.values=Lr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Lr(t.times,Array),values:Lr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new $r(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Jr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Kr(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Cs:e=this.InterpolantFactoryMethodDiscrete;break;case Or:e=this.InterpolantFactoryMethodLinear;break;case Ur:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Cs;case this.InterpolantFactoryMethodLinear:return Or;case this.InterpolantFactoryMethodSmooth:return Ur}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&dd(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ur,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],u=t[a+1];if(c!==u&&(a!==1||c!==t[0]))if(s)l=!0;else{let h=a*n,f=h-n,p=h+n;for(let g=0;g!==n;++g){let x=e[h+g];if(x!==e[f+g]||x!==e[p+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let h=a*n,f=o*n;for(let p=0;p!==n;++p)e[f+p]=e[h+p]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};We.prototype.ValueTypeName="";We.prototype.TimeBufferType=Float32Array;We.prototype.ValueBufferType=Float32Array;We.prototype.DefaultInterpolation=Or;var jn=class extends We{constructor(t,e,n){super(t,e,n)}};jn.prototype.ValueTypeName="bool";jn.prototype.ValueBufferType=Array;jn.prototype.DefaultInterpolation=Cs;jn.prototype.InterpolantFactoryMethodLinear=void 0;jn.prototype.InterpolantFactoryMethodSmooth=void 0;var to=class extends We{constructor(t,e,n,s){super(t,e,n,s)}};to.prototype.ValueTypeName="color";var eo=class extends We{constructor(t,e,n,s){super(t,e,n,s)}};eo.prototype.ValueTypeName="number";var no=class extends di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let u=c+a;c!==u;c+=4)Ue.slerpFlat(r,0,o,c-a,o,c,l);return r}},Ws=class extends We{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new no(this.times,this.values,this.getValueSize(),t)}};Ws.prototype.ValueTypeName="quaternion";Ws.prototype.InterpolantFactoryMethodSmooth=void 0;var Qn=class extends We{constructor(t,e,n){super(t,e,n)}};Qn.prototype.ValueTypeName="string";Qn.prototype.ValueBufferType=Array;Qn.prototype.DefaultInterpolation=Cs;Qn.prototype.InterpolantFactoryMethodLinear=void 0;Qn.prototype.InterpolantFactoryMethodSmooth=void 0;var io=class extends We{constructor(t,e,n,s){super(t,e,n,s)}};io.prototype.ValueTypeName="vector";var Gi={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},es=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=c.length;h<f;h+=2){let p=c[h],g=c[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},ta=new es,dn=class{constructor(t){this.manager=t!==void 0?t:ta,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};dn.DEFAULT_MATERIAL_NAME="__DEFAULT";var Pn={},Ja=class extends Error{constructor(t,e){super(t),this.response=e}},fi=class extends dn{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=Gi.get(`file:${t}`);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(Pn[t]!==void 0){Pn[t].push({onLoad:e,onProgress:n,onError:s});return}Pn[t]=[],Pn[t].push({onLoad:e,onProgress:n,onError:s});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=Pn[t],h=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=f?parseInt(f):0,g=p!==0,x=0,m=new ReadableStream({start(d){S();function S(){h.read().then(({done:E,value:M})=>{if(E)d.close();else{x+=M.byteLength;let C=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:p});for(let w=0,I=u.length;w<I;w++){let N=u[w];N.onProgress&&N.onProgress(C)}d.enqueue(M),S()}},E=>{d.error(E)})}}});return new Response(m)}else throw new Ja(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(a),f=h&&h[1]?h[1].toLowerCase():void 0,p=new TextDecoder(f);return c.arrayBuffer().then(g=>p.decode(g))}}}).then(c=>{Gi.add(`file:${t}`,c);let u=Pn[t];delete Pn[t];for(let h=0,f=u.length;h<f;h++){let p=u[h];p.onLoad&&p.onLoad(c)}}).catch(c=>{let u=Pn[t];if(u===void 0)throw this.manager.itemError(t),c;delete Pn[t];for(let h=0,f=u.length;h<f;h++){let p=u[h];p.onError&&p.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var ki=new WeakMap,so=class extends dn{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Gi.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let h=ki.get(o);h===void 0&&(h=[],ki.set(o,h)),h.push({onLoad:e,onError:s})}return o}let a=qi("img");function l(){u(),e&&e(this);let h=ki.get(this)||[];for(let f=0;f<h.length;f++){let p=h[f];p.onLoad&&p.onLoad(this)}ki.delete(this),r.manager.itemEnd(t)}function c(h){u(),s&&s(h),Gi.remove(`image:${t}`);let f=ki.get(this)||[];for(let p=0;p<f.length;p++){let g=f[p];g.onError&&g.onError(h)}ki.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Gi.add(`image:${t}`,a),r.manager.itemStart(t),a.src=t,a}};var Xe=class extends dn{constructor(t){super(t)}load(t,e,n,s){let r=new Ne,o=new so(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},ns=class extends Se{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Rt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}};var Xa=new se,El=new T,bl=new T,ro=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new St(512,512),this.mapType=mn,this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $i,this._frameExtents=new St(1,1),this._viewportCount=1,this._viewports=[new Jt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;El.setFromMatrixPosition(t.matrixWorld),e.position.copy(El),bl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(bl),e.updateMatrixWorld(),Xa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xa,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Xa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var _l=new se,_s=new T,Ya=new T,$a=class extends ro{constructor(){super(new Ee(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new St(4,2),this._viewportCount=6,this._viewports=[new Jt(2,1,1,1),new Jt(0,1,1,1),new Jt(3,1,1,1),new Jt(1,1,1,1),new Jt(3,0,1,1),new Jt(1,0,1,1)],this._cubeDirections=[new T(1,0,0),new T(-1,0,0),new T(0,0,1),new T(0,0,-1),new T(0,1,0),new T(0,-1,0)],this._cubeUps=[new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,0,1),new T(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),_s.setFromMatrixPosition(t.matrixWorld),n.position.copy(_s),Ya.copy(n.position),Ya.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ya),n.updateMatrixWorld(),s.makeTranslation(-_s.x,-_s.y,-_s.z),_l.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_l,n.coordinateSystem,n.reversedDepth)}},Xs=class extends ns{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new $a}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},Ys=class extends Fs{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},tc=class extends ro{constructor(){super(new Ys(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},is=class extends ns{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Se.DEFAULT_UP),this.updateMatrix(),this.target=new Se,this.shadow=new tc}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},qs=class extends ns{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var js=class{static extractUrlBase(t){let e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}};var oo=class extends Ee{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Mc="\\[\\]\\.:\\/",fd=new RegExp("["+Mc+"]","g"),Ac="[^"+Mc+"]",pd="[^"+Mc.replace("\\.","")+"]",md=/((?:WC+[\/:])*)/.source.replace("WC",Ac),gd=/(WCOD+)?/.source.replace("WCOD",pd),xd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ac),vd=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ac),yd=new RegExp("^"+md+gd+xd+vd+"$"),Md=["material","materials","bones","map"],ec=class{constructor(t,e,n){let s=n||le.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},le=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(fd,"")}static parseTrackName(t){let e=yd.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Md.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};le.Composite=ec;le.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};le.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};le.prototype.GetterByBindingType=[le.prototype._getValue_direct,le.prototype._getValue_array,le.prototype._getValue_arrayElement,le.prototype._getValue_toArray];le.prototype.SetterByBindingTypeAndVersioning=[[le.prototype._setValue_direct,le.prototype._setValue_direct_setNeedsUpdate,le.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[le.prototype._setValue_array,le.prototype._setValue_array_setNeedsUpdate,le.prototype._setValue_array_setMatrixWorldNeedsUpdate],[le.prototype._setValue_arrayElement,le.prototype._setValue_arrayElement_setNeedsUpdate,le.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[le.prototype._setValue_fromArray,le.prototype._setValue_fromArray_setNeedsUpdate,le.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Xx=new Float32Array(1);var Zn=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Vt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Vt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Qs=class extends xn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Sc(i,t,e,n){let s=Ad(n);switch(e){case uc:return i*t;case fc:return i*t/s.components*s.byteLength;case So:return i*t/s.components*s.byteLength;case pc:return i*t*2/s.components*s.byteLength;case Eo:return i*t*2/s.components*s.byteLength;case dc:return i*t*3/s.components*s.byteLength;case en:return i*t*4/s.components*s.byteLength;case bo:return i*t*4/s.components*s.byteLength;case Js:case $s:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case tr:case er:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case wo:case Co:return Math.max(i,16)*Math.max(t,8)/4;case _o:case To:return Math.max(i,8)*Math.max(t,8)/2;case Ro:case Po:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Io:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Do:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Lo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Uo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case No:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Fo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Bo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Oo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case zo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ko:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Vo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Go:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Wo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Xo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Yo:case qo:case jo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Qo:case Zo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ko:case Jo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Ad(i){switch(i){case mn:case ac:return{byteLength:1,components:1};case ss:case cc:case rs:return{byteLength:2,components:1};case Mo:case Ao:return{byteLength:2,components:4};case Jn:case yo:case An:return{byteLength:4,components:1};case lc:case hc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function kh(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Ed(i){let t=new WeakMap;function e(a,l){let c=a.array,u=a.usage,h=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){let u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<h.length;p++){let g=h[f],x=h[p];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,h[f]=x)}h.length=f+1;for(let p=0,g=h.length;p<g;p++){let x=h[p];i.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var bd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_d=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,wd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Td=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Rd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Id=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Dd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Ld=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ud=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Nd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Bd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Od=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,zd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Hd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,kd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Wd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Xd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Yd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,qd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,jd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Qd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Zd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Kd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$d=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,tf="gl_FragColor = linearToOutputTexel( gl_FragColor );",ef=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,nf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,sf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,rf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,of=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,af=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,cf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,lf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,hf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,uf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,df=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ff=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,pf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,mf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,gf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,xf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,vf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,yf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Mf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Af=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Sf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ef=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,bf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,_f=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,wf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Tf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Cf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,If=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Df=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Lf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Uf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ff=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Bf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Of=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,zf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Hf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,kf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Gf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Wf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,qf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,jf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Zf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Kf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Jf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$f=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,tp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ep=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,np=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ip=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,sp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,rp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,op=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ap=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,cp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,lp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,hp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,up=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,dp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,pp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,mp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,vp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,yp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Mp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Sp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Ep=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,bp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_p=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ip=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Dp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Lp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Np=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Bp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Op=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,zp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Gp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Xp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Yp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Qp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,$p=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,em=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,nm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,im=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,zt={alphahash_fragment:bd,alphahash_pars_fragment:_d,alphamap_fragment:wd,alphamap_pars_fragment:Td,alphatest_fragment:Cd,alphatest_pars_fragment:Rd,aomap_fragment:Pd,aomap_pars_fragment:Id,batching_pars_vertex:Dd,batching_vertex:Ld,begin_vertex:Ud,beginnormal_vertex:Nd,bsdfs:Fd,iridescence_fragment:Bd,bumpmap_pars_fragment:Od,clipping_planes_fragment:zd,clipping_planes_pars_fragment:Hd,clipping_planes_pars_vertex:kd,clipping_planes_vertex:Vd,color_fragment:Gd,color_pars_fragment:Wd,color_pars_vertex:Xd,color_vertex:Yd,common:qd,cube_uv_reflection_fragment:jd,defaultnormal_vertex:Qd,displacementmap_pars_vertex:Zd,displacementmap_vertex:Kd,emissivemap_fragment:Jd,emissivemap_pars_fragment:$d,colorspace_fragment:tf,colorspace_pars_fragment:ef,envmap_fragment:nf,envmap_common_pars_fragment:sf,envmap_pars_fragment:rf,envmap_pars_vertex:of,envmap_physical_pars_fragment:xf,envmap_vertex:af,fog_vertex:cf,fog_pars_vertex:lf,fog_fragment:hf,fog_pars_fragment:uf,gradientmap_pars_fragment:df,lightmap_pars_fragment:ff,lights_lambert_fragment:pf,lights_lambert_pars_fragment:mf,lights_pars_begin:gf,lights_toon_fragment:vf,lights_toon_pars_fragment:yf,lights_phong_fragment:Mf,lights_phong_pars_fragment:Af,lights_physical_fragment:Sf,lights_physical_pars_fragment:Ef,lights_fragment_begin:bf,lights_fragment_maps:_f,lights_fragment_end:wf,logdepthbuf_fragment:Tf,logdepthbuf_pars_fragment:Cf,logdepthbuf_pars_vertex:Rf,logdepthbuf_vertex:Pf,map_fragment:If,map_pars_fragment:Df,map_particle_fragment:Lf,map_particle_pars_fragment:Uf,metalnessmap_fragment:Nf,metalnessmap_pars_fragment:Ff,morphinstance_vertex:Bf,morphcolor_vertex:Of,morphnormal_vertex:zf,morphtarget_pars_vertex:Hf,morphtarget_vertex:kf,normal_fragment_begin:Vf,normal_fragment_maps:Gf,normal_pars_fragment:Wf,normal_pars_vertex:Xf,normal_vertex:Yf,normalmap_pars_fragment:qf,clearcoat_normal_fragment_begin:jf,clearcoat_normal_fragment_maps:Qf,clearcoat_pars_fragment:Zf,iridescence_pars_fragment:Kf,opaque_fragment:Jf,packing:$f,premultiplied_alpha_fragment:tp,project_vertex:ep,dithering_fragment:np,dithering_pars_fragment:ip,roughnessmap_fragment:sp,roughnessmap_pars_fragment:rp,shadowmap_pars_fragment:op,shadowmap_pars_vertex:ap,shadowmap_vertex:cp,shadowmask_pars_fragment:lp,skinbase_vertex:hp,skinning_pars_vertex:up,skinning_vertex:dp,skinnormal_vertex:fp,specularmap_fragment:pp,specularmap_pars_fragment:mp,tonemapping_fragment:gp,tonemapping_pars_fragment:xp,transmission_fragment:vp,transmission_pars_fragment:yp,uv_pars_fragment:Mp,uv_pars_vertex:Ap,uv_vertex:Sp,worldpos_vertex:Ep,background_vert:bp,background_frag:_p,backgroundCube_vert:wp,backgroundCube_frag:Tp,cube_vert:Cp,cube_frag:Rp,depth_vert:Pp,depth_frag:Ip,distanceRGBA_vert:Dp,distanceRGBA_frag:Lp,equirect_vert:Up,equirect_frag:Np,linedashed_vert:Fp,linedashed_frag:Bp,meshbasic_vert:Op,meshbasic_frag:zp,meshlambert_vert:Hp,meshlambert_frag:kp,meshmatcap_vert:Vp,meshmatcap_frag:Gp,meshnormal_vert:Wp,meshnormal_frag:Xp,meshphong_vert:Yp,meshphong_frag:qp,meshphysical_vert:jp,meshphysical_frag:Qp,meshtoon_vert:Zp,meshtoon_frag:Kp,points_vert:Jp,points_frag:$p,shadow_vert:tm,shadow_frag:em,sprite_vert:nm,sprite_frag:im},at={common:{diffuse:{value:new Rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new St(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new Rt(16777215)},opacity:{value:1},center:{value:new St(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},Sn={basic:{uniforms:Te([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:zt.meshbasic_vert,fragmentShader:zt.meshbasic_frag},lambert:{uniforms:Te([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Rt(0)}}]),vertexShader:zt.meshlambert_vert,fragmentShader:zt.meshlambert_frag},phong:{uniforms:Te([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Rt(0)},specular:{value:new Rt(1118481)},shininess:{value:30}}]),vertexShader:zt.meshphong_vert,fragmentShader:zt.meshphong_frag},standard:{uniforms:Te([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new Rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag},toon:{uniforms:Te([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new Rt(0)}}]),vertexShader:zt.meshtoon_vert,fragmentShader:zt.meshtoon_frag},matcap:{uniforms:Te([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:zt.meshmatcap_vert,fragmentShader:zt.meshmatcap_frag},points:{uniforms:Te([at.points,at.fog]),vertexShader:zt.points_vert,fragmentShader:zt.points_frag},dashed:{uniforms:Te([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:zt.linedashed_vert,fragmentShader:zt.linedashed_frag},depth:{uniforms:Te([at.common,at.displacementmap]),vertexShader:zt.depth_vert,fragmentShader:zt.depth_frag},normal:{uniforms:Te([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:zt.meshnormal_vert,fragmentShader:zt.meshnormal_frag},sprite:{uniforms:Te([at.sprite,at.fog]),vertexShader:zt.sprite_vert,fragmentShader:zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:zt.background_vert,fragmentShader:zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:zt.backgroundCube_vert,fragmentShader:zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:zt.cube_vert,fragmentShader:zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:zt.equirect_vert,fragmentShader:zt.equirect_frag},distanceRGBA:{uniforms:Te([at.common,at.displacementmap,{referencePosition:{value:new T},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:zt.distanceRGBA_vert,fragmentShader:zt.distanceRGBA_frag},shadow:{uniforms:Te([at.lights,at.fog,{color:{value:new Rt(0)},opacity:{value:1}}]),vertexShader:zt.shadow_vert,fragmentShader:zt.shadow_frag}};Sn.physical={uniforms:Te([Sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new St(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new Rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new St},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new Rt(0)},specularColor:{value:new Rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new St},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag};var ea={r:0,b:0,g:0},vi=new tn,sm=new se;function rm(i,t,e,n,s,r,o){let a=new Rt(0),l=r===!0?0:1,c,u,h=null,f=0,p=null;function g(E){let M=E.isScene===!0?E.background:null;return M&&M.isTexture&&(M=(E.backgroundBlurriness>0?e:t).get(M)),M}function x(E){let M=!1,C=g(E);C===null?d(a,l):C&&C.isColor&&(d(C,1),M=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,M){let C=g(M);C&&(C.isCubeTexture||C.mapping===Zs)?(u===void 0&&(u=new be(new Zi(1,1,1),new hn({name:"BackgroundCubeMaterial",uniforms:xi(Sn.backgroundCube.uniforms),vertexShader:Sn.backgroundCube.vertexShader,fragmentShader:Sn.backgroundCube.fragmentShader,side:Ie,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,I,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),vi.copy(M.backgroundRotation),vi.x*=-1,vi.y*=-1,vi.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),u.material.uniforms.envMap.value=C,u.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(sm.makeRotationFromEuler(vi)),u.material.toneMapped=Wt.getTransfer(C.colorSpace)!==$t,(h!==C||f!==C.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,h=C,f=C.version,p=i.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new be(new Vs(2,2),new hn({name:"BackgroundMaterial",uniforms:xi(Sn.background.uniforms),vertexShader:Sn.background.vertexShader,fragmentShader:Sn.background.fragmentShader,side:Ve,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Wt.getTransfer(C.colorSpace)!==$t,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(h!==C||f!==C.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,h=C,f=C.version,p=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function d(E,M){E.getRGB(ea,yc(i)),n.buffers.color.setClear(ea.r,ea.g,ea.b,M,o)}function S(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,M=1){a.set(E),l=M,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,d(a,l)},render:x,addToRenderList:m,dispose:S}}function om(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,o=!1;function a(A,P,F,H,X){let q=!1,G=h(H,F,P);r!==G&&(r=G,c(r.object)),q=p(A,H,F,X),q&&g(A,H,F,X),X!==null&&t.update(X,i.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,M(A,P,F,H),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function l(){return i.createVertexArray()}function c(A){return i.bindVertexArray(A)}function u(A){return i.deleteVertexArray(A)}function h(A,P,F){let H=F.wireframe===!0,X=n[A.id];X===void 0&&(X={},n[A.id]=X);let q=X[P.id];q===void 0&&(q={},X[P.id]=q);let G=q[H];return G===void 0&&(G=f(l()),q[H]=G),G}function f(A){let P=[],F=[],H=[];for(let X=0;X<e;X++)P[X]=0,F[X]=0,H[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:H,object:A,attributes:{},index:null}}function p(A,P,F,H){let X=r.attributes,q=P.attributes,G=0,et=F.getAttributes();for(let k in et)if(et[k].location>=0){let lt=X[k],_t=q[k];if(_t===void 0&&(k==="instanceMatrix"&&A.instanceMatrix&&(_t=A.instanceMatrix),k==="instanceColor"&&A.instanceColor&&(_t=A.instanceColor)),lt===void 0||lt.attribute!==_t||_t&&lt.data!==_t.data)return!0;G++}return r.attributesNum!==G||r.index!==H}function g(A,P,F,H){let X={},q=P.attributes,G=0,et=F.getAttributes();for(let k in et)if(et[k].location>=0){let lt=q[k];lt===void 0&&(k==="instanceMatrix"&&A.instanceMatrix&&(lt=A.instanceMatrix),k==="instanceColor"&&A.instanceColor&&(lt=A.instanceColor));let _t={};_t.attribute=lt,lt&&lt.data&&(_t.data=lt.data),X[k]=_t,G++}r.attributes=X,r.attributesNum=G,r.index=H}function x(){let A=r.newAttributes;for(let P=0,F=A.length;P<F;P++)A[P]=0}function m(A){d(A,0)}function d(A,P){let F=r.newAttributes,H=r.enabledAttributes,X=r.attributeDivisors;F[A]=1,H[A]===0&&(i.enableVertexAttribArray(A),H[A]=1),X[A]!==P&&(i.vertexAttribDivisor(A,P),X[A]=P)}function S(){let A=r.newAttributes,P=r.enabledAttributes;for(let F=0,H=P.length;F<H;F++)P[F]!==A[F]&&(i.disableVertexAttribArray(F),P[F]=0)}function E(A,P,F,H,X,q,G){G===!0?i.vertexAttribIPointer(A,P,F,X,q):i.vertexAttribPointer(A,P,F,H,X,q)}function M(A,P,F,H){x();let X=H.attributes,q=F.getAttributes(),G=P.defaultAttributeValues;for(let et in q){let k=q[et];if(k.location>=0){let ot=X[et];if(ot===void 0&&(et==="instanceMatrix"&&A.instanceMatrix&&(ot=A.instanceMatrix),et==="instanceColor"&&A.instanceColor&&(ot=A.instanceColor)),ot!==void 0){let lt=ot.normalized,_t=ot.itemSize,Nt=t.get(ot);if(Nt===void 0)continue;let Zt=Nt.buffer,re=Nt.type,qt=Nt.bytesPerElement,Y=re===i.INT||re===i.UNSIGNED_INT||ot.gpuType===yo;if(ot.isInterleavedBufferAttribute){let Q=ot.data,gt=Q.stride,It=ot.offset;if(Q.isInstancedInterleavedBuffer){for(let Mt=0;Mt<k.locationSize;Mt++)d(k.location+Mt,Q.meshPerAttribute);A.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let Mt=0;Mt<k.locationSize;Mt++)m(k.location+Mt);i.bindBuffer(i.ARRAY_BUFFER,Zt);for(let Mt=0;Mt<k.locationSize;Mt++)E(k.location+Mt,_t/k.locationSize,re,lt,gt*qt,(It+_t/k.locationSize*Mt)*qt,Y)}else{if(ot.isInstancedBufferAttribute){for(let Q=0;Q<k.locationSize;Q++)d(k.location+Q,ot.meshPerAttribute);A.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Q=0;Q<k.locationSize;Q++)m(k.location+Q);i.bindBuffer(i.ARRAY_BUFFER,Zt);for(let Q=0;Q<k.locationSize;Q++)E(k.location+Q,_t/k.locationSize,re,lt,_t*qt,_t/k.locationSize*Q*qt,Y)}}else if(G!==void 0){let lt=G[et];if(lt!==void 0)switch(lt.length){case 2:i.vertexAttrib2fv(k.location,lt);break;case 3:i.vertexAttrib3fv(k.location,lt);break;case 4:i.vertexAttrib4fv(k.location,lt);break;default:i.vertexAttrib1fv(k.location,lt)}}}}S()}function C(){N();for(let A in n){let P=n[A];for(let F in P){let H=P[F];for(let X in H)u(H[X].object),delete H[X];delete P[F]}delete n[A]}}function w(A){if(n[A.id]===void 0)return;let P=n[A.id];for(let F in P){let H=P[F];for(let X in H)u(H[X].object),delete H[X];delete P[F]}delete n[A.id]}function I(A){for(let P in n){let F=n[P];if(F[A.id]===void 0)continue;let H=F[A.id];for(let X in H)u(H[X].object),delete H[X];delete F[A.id]}}function N(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:N,resetDefaultState:b,dispose:C,releaseStatesOfGeometry:w,releaseStatesOfProgram:I,initAttributes:x,enableAttribute:m,disableUnusedAttributes:S}}function am(i,t,e){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),e.update(u,n,h))}function a(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];e.update(p,n,1)}function l(c,u,h,f){if(h===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],u[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,h);let g=0;for(let x=0;x<h;x++)g+=u[x]*f[x];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function cm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let I=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(I){return!(I!==en&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(I){let N=I===rs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(I!==mn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==An&&!N)}function l(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:S,maxVaryings:E,maxFragmentUniforms:M,vertexTextures:C,maxSamples:w}}function lm(i){let t=this,e=null,n=0,s=!1,r=!1,o=new Ke,a=new Ot,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){let p=h.length!==0||f||n!==0||s;return s=f,n=h.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){e=u(h,f,0)},this.setState=function(h,f,p){let g=h.clippingPlanes,x=h.clipIntersection,m=h.clipShadows,d=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{let S=r?0:n,E=S*4,M=d.clippingState||null;l.value=M,M=u(g,f,E,p);for(let C=0;C!==E;++C)M[C]=e[C];d.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,f,p,g){let x=h!==null?h.length:0,m=null;if(x!==0){if(m=l.value,g!==!0||m===null){let d=p+x*4,S=f.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<d)&&(m=new Float32Array(d));for(let E=0,M=p;E!==x;++E,M+=4)o.copy(h[E]).applyMatrix4(S,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function hm(i){let t=new WeakMap;function e(o,a){return a===go?o.mapping=mi:a===xo&&(o.mapping=gi),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===go||a===xo)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Wr(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var ls=4,vh=[.125,.215,.35,.446,.526,.582],Ai=20,Ec=new Ys,yh=new Rt,bc=null,_c=0,wc=0,Tc=!1,Mi=(1+Math.sqrt(5))/2,cs=1/Mi,Mh=[new T(-Mi,cs,0),new T(Mi,cs,0),new T(-cs,0,Mi),new T(cs,0,Mi),new T(0,Mi,-cs),new T(0,Mi,cs),new T(-1,1,-1),new T(1,1,-1),new T(-1,1,1),new T(1,1,1)],um=new T,sa=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=um}=r;bc=this._renderer.getRenderTarget(),_c=this._renderer.getActiveCubeFace(),wc=this._renderer.getActiveMipmapLevel(),Tc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Eh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(bc,_c,wc),this._renderer.xr.enabled=Tc,t.scissorTest=!1,na(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===mi||t.mapping===gi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),bc=this._renderer.getRenderTarget(),_c=this._renderer.getActiveCubeFace(),wc=this._renderer.getActiveMipmapLevel(),Tc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ln,minFilter:ln,generateMipmaps:!1,type:rs,format:en,colorSpace:li,depthBuffer:!1},s=Ah(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ah(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=dm(r)),this._blurMaterial=fm(r,t,e)}return s}_compileMaterial(t){let e=new be(this._lodPlanes[0],t);this._renderer.compile(e,Ec)}_sceneToCubeUV(t,e,n,s,r){let l=new Ee(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor(yh),h.toneMapping=pn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));let x=new Ls({name:"PMREM.Background",side:Ie,depthWrite:!1,depthTest:!1}),m=new be(new Zi,x),d=!1,S=t.background;S?S.isColor&&(x.color.copy(S),t.background=null,d=!0):(x.color.copy(yh),d=!0);for(let E=0;E<6;E++){let M=E%3;M===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[E],r.y,r.z)):M===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[E]));let C=this._cubeSize;na(s,M*C,E>2?C:0,C,C),h.setRenderTarget(s),d&&h.render(m,l),h.render(t,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=p,h.autoClear=f,t.background=S}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===mi||t.mapping===gi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Eh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sh());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new be(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;na(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Ec)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Mh[(s-r-1)%Mh.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,h=new be(this._lodPlanes[s],c),f=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Ai-1),x=r/g,m=isFinite(r)?1+Math.floor(u*x):Ai;m>Ai&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ai}`);let d=[],S=0;for(let I=0;I<Ai;++I){let N=I/x,b=Math.exp(-N*N/2);d.push(b),I===0?S+=b:I<m&&(S+=2*b)}for(let I=0;I<d.length;I++)d[I]=d[I]/S;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:E}=this;f.dTheta.value=g,f.mipInt.value=E-n;let M=this._sizeLods[s],C=3*M*(s>E-ls?s-E+ls:0),w=4*(this._cubeSize-M);na(e,C,w,3*M,2*M),l.setRenderTarget(e),l.render(h,Ec)}};function dm(i){let t=[],e=[],n=[],s=i,r=i-ls+1+vh.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-ls?l=vh[o-i+ls-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,x=3,m=2,d=1,S=new Float32Array(x*g*p),E=new Float32Array(m*g*p),M=new Float32Array(d*g*p);for(let w=0;w<p;w++){let I=w%3*2/3-1,N=w>2?0:-1,b=[I,N,0,I+2/3,N,0,I+2/3,N+1,0,I,N,0,I+2/3,N+1,0,I,N+1,0];S.set(b,x*g*w),E.set(f,m*g*w);let A=[w,w,w,w,w,w];M.set(A,d*g*w)}let C=new xe;C.setAttribute("position",new Le(S,x)),C.setAttribute("uv",new Le(E,m)),C.setAttribute("faceIndex",new Le(M,d)),t.push(C),s>ls&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ah(i,t,e){let n=new vn(i,t,e);return n.texture.mapping=Zs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function na(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function fm(i,t,e){let n=new Float32Array(Ai),s=new T(0,1,0);return new hn({name:"SphericalGaussianBlur",defines:{n:Ai,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Bc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Sh(){return new hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Eh(){return new hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Bc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function pm(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===go||l===xo,u=l===mi||l===gi;if(c||u){let h=t.get(a),f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new sa(i)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{let p=a.image;return c&&p&&p.height>0||u&&p&&s(p)?(e===null&&(e=new sa(i)),h=c?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0,c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function mm(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&ji("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function gm(i,t,e,n){let s={},r=new WeakMap;function o(h){let f=h.target;f.index!==null&&t.remove(f.index);for(let g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];let p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(h,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function l(h){let f=h.attributes;for(let p in f)t.update(f[p],i.ARRAY_BUFFER)}function c(h){let f=[],p=h.index,g=h.attributes.position,x=0;if(p!==null){let S=p.array;x=p.version;for(let E=0,M=S.length;E<M;E+=3){let C=S[E+0],w=S[E+1],I=S[E+2];f.push(C,w,w,I,I,C)}}else if(g!==void 0){let S=g.array;x=g.version;for(let E=0,M=S.length/3-1;E<M;E+=3){let C=E+0,w=E+1,I=E+2;f.push(C,w,w,I,I,C)}}else return;let m=new(vc(f)?Ns:Us)(f,1);m.version=x;let d=r.get(h);d&&t.remove(d),r.set(h,m)}function u(h){let f=r.get(h);if(f){let p=h.index;p!==null&&f.version<p.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function xm(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,p){i.drawElements(n,p,r,f*o),e.update(p,n,1)}function c(f,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,f*o,g),e.update(p,n,g))}function u(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];e.update(m,n,1)}function h(f,p,g,x){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/o,p[d],x[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,x,0,g);let d=0;for(let S=0;S<g;S++)d+=p[S]*x[S];e.update(d,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function vm(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function ym(i,t,e){let n=new WeakMap,s=new Jt;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,f=n.get(a);if(f===void 0||f.count!==h){let b=function(){I.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],E=0;p===!0&&(E=1),g===!0&&(E=2),x===!0&&(E=3);let M=a.attributes.position.count*E,C=1;M>t.maxTextureSize&&(C=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let w=new Float32Array(M*C*4*h),I=new Is(w,M,C,h);I.type=An,I.needsUpdate=!0;let N=E*4;for(let A=0;A<h;A++){let P=m[A],F=d[A],H=S[A],X=M*C*4*A;for(let q=0;q<P.count;q++){let G=q*N;p===!0&&(s.fromBufferAttribute(P,q),w[X+G+0]=s.x,w[X+G+1]=s.y,w[X+G+2]=s.z,w[X+G+3]=0),g===!0&&(s.fromBufferAttribute(F,q),w[X+G+4]=s.x,w[X+G+5]=s.y,w[X+G+6]=s.z,w[X+G+7]=0),x===!0&&(s.fromBufferAttribute(H,q),w[X+G+8]=s.x,w[X+G+9]=s.y,w[X+G+10]=s.z,w[X+G+11]=H.itemSize===4?s.w:1)}}f={count:h,texture:I,size:new St(M,C)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let x=0;x<c.length;x++)p+=c[x];let g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Mm(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,u=l.geometry,h=t.get(l,u);if(s.get(h)!==c&&(t.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return h}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var Vh=new Ne,bh=new Hs(1,1),Gh=new Is,Wh=new Vr,Xh=new Bs,_h=[],wh=[],Th=new Float32Array(16),Ch=new Float32Array(9),Rh=new Float32Array(4);function us(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=_h[s];if(r===void 0&&(r=new Float32Array(s),_h[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function ve(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ye(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function oa(i,t){let e=wh[t];e===void 0&&(e=new Int32Array(t),wh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Am(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Sm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ve(e,t))return;i.uniform2fv(this.addr,t),ye(e,t)}}function Em(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ve(e,t))return;i.uniform3fv(this.addr,t),ye(e,t)}}function bm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ve(e,t))return;i.uniform4fv(this.addr,t),ye(e,t)}}function _m(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(ve(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ye(e,t)}else{if(ve(e,n))return;Rh.set(n),i.uniformMatrix2fv(this.addr,!1,Rh),ye(e,n)}}function wm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(ve(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ye(e,t)}else{if(ve(e,n))return;Ch.set(n),i.uniformMatrix3fv(this.addr,!1,Ch),ye(e,n)}}function Tm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(ve(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ye(e,t)}else{if(ve(e,n))return;Th.set(n),i.uniformMatrix4fv(this.addr,!1,Th),ye(e,n)}}function Cm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Rm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ve(e,t))return;i.uniform2iv(this.addr,t),ye(e,t)}}function Pm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ve(e,t))return;i.uniform3iv(this.addr,t),ye(e,t)}}function Im(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ve(e,t))return;i.uniform4iv(this.addr,t),ye(e,t)}}function Dm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Lm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ve(e,t))return;i.uniform2uiv(this.addr,t),ye(e,t)}}function Um(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ve(e,t))return;i.uniform3uiv(this.addr,t),ye(e,t)}}function Nm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ve(e,t))return;i.uniform4uiv(this.addr,t),ye(e,t)}}function Fm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(bh.compareFunction=mc,r=bh):r=Vh,e.setTexture2D(t||r,s)}function Bm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Wh,s)}function Om(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Xh,s)}function zm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Gh,s)}function Hm(i){switch(i){case 5126:return Am;case 35664:return Sm;case 35665:return Em;case 35666:return bm;case 35674:return _m;case 35675:return wm;case 35676:return Tm;case 5124:case 35670:return Cm;case 35667:case 35671:return Rm;case 35668:case 35672:return Pm;case 35669:case 35673:return Im;case 5125:return Dm;case 36294:return Lm;case 36295:return Um;case 36296:return Nm;case 35678:case 36198:case 36298:case 36306:case 35682:return Fm;case 35679:case 36299:case 36307:return Bm;case 35680:case 36300:case 36308:case 36293:return Om;case 36289:case 36303:case 36311:case 36292:return zm}}function km(i,t){i.uniform1fv(this.addr,t)}function Vm(i,t){let e=us(t,this.size,2);i.uniform2fv(this.addr,e)}function Gm(i,t){let e=us(t,this.size,3);i.uniform3fv(this.addr,e)}function Wm(i,t){let e=us(t,this.size,4);i.uniform4fv(this.addr,e)}function Xm(i,t){let e=us(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Ym(i,t){let e=us(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function qm(i,t){let e=us(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function jm(i,t){i.uniform1iv(this.addr,t)}function Qm(i,t){i.uniform2iv(this.addr,t)}function Zm(i,t){i.uniform3iv(this.addr,t)}function Km(i,t){i.uniform4iv(this.addr,t)}function Jm(i,t){i.uniform1uiv(this.addr,t)}function $m(i,t){i.uniform2uiv(this.addr,t)}function tg(i,t){i.uniform3uiv(this.addr,t)}function eg(i,t){i.uniform4uiv(this.addr,t)}function ng(i,t,e){let n=this.cache,s=t.length,r=oa(e,s);ve(n,r)||(i.uniform1iv(this.addr,r),ye(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Vh,r[o])}function ig(i,t,e){let n=this.cache,s=t.length,r=oa(e,s);ve(n,r)||(i.uniform1iv(this.addr,r),ye(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Wh,r[o])}function sg(i,t,e){let n=this.cache,s=t.length,r=oa(e,s);ve(n,r)||(i.uniform1iv(this.addr,r),ye(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Xh,r[o])}function rg(i,t,e){let n=this.cache,s=t.length,r=oa(e,s);ve(n,r)||(i.uniform1iv(this.addr,r),ye(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Gh,r[o])}function og(i){switch(i){case 5126:return km;case 35664:return Vm;case 35665:return Gm;case 35666:return Wm;case 35674:return Xm;case 35675:return Ym;case 35676:return qm;case 5124:case 35670:return jm;case 35667:case 35671:return Qm;case 35668:case 35672:return Zm;case 35669:case 35673:return Km;case 5125:return Jm;case 36294:return $m;case 36295:return tg;case 36296:return eg;case 35678:case 36198:case 36298:case 36306:case 35682:return ng;case 35679:case 36299:case 36307:return ig;case 35680:case 36300:case 36308:case 36293:return sg;case 36289:case 36303:case 36311:case 36292:return rg}}var Rc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Hm(e.type)}},Pc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=og(e.type)}},Ic=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Cc=/(\w+)(\])?(\[|\.)?/g;function Ph(i,t){i.seq.push(t),i.map[t.id]=t}function ag(i,t,e){let n=i.name,s=n.length;for(Cc.lastIndex=0;;){let r=Cc.exec(n),o=Cc.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Ph(e,c===void 0?new Rc(a,i,t):new Pc(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new Ic(a),Ph(e,h)),e=h}}}var hs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);ag(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Ih(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var cg=37297,lg=0;function hg(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var Dh=new Ot;function ug(i){Wt._getMatrix(Dh,Wt.workingColorSpace,i);let t=`mat3( ${Dh.elements.map(e=>e.toFixed(4))} )`;switch(Wt.getTransfer(i)){case Rs:return[t,"LinearTransferOETF"];case $t:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Lh(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+hg(i.getShaderSource(t),a)}else return r}function dg(i,t){let e=ug(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function fg(i,t){let e;switch(t){case Ql:e="Linear";break;case Zl:e="Reinhard";break;case Kl:e="Cineon";break;case Jl:e="ACESFilmic";break;case th:e="AgX";break;case eh:e="Neutral";break;case $l:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var ia=new T;function pg(){Wt.getLuminanceCoefficients(ia);let i=ia.x.toFixed(4),t=ia.y.toFixed(4),e=ia.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function mg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(nr).join(`
`)}function gg(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function xg(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function nr(i){return i!==""}function Uh(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var vg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Dc(i){return i.replace(vg,Mg)}var yg=new Map;function Mg(i,t){let e=zt[t];if(e===void 0){let n=yg.get(t);if(n!==void 0)e=zt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Dc(e)}var Ag=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fh(i){return i.replace(Ag,Sg)}function Sg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bh(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Eg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ic?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Cl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Mn&&(t="SHADOWMAP_TYPE_VSM"),t}function bg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case mi:case gi:t="ENVMAP_TYPE_CUBE";break;case Zs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function _g(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===gi&&(t="ENVMAP_MODE_REFRACTION"),t}function wg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case mo:t="ENVMAP_BLENDING_MULTIPLY";break;case ql:t="ENVMAP_BLENDING_MIX";break;case jl:t="ENVMAP_BLENDING_ADD";break}return t}function Tg(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Cg(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=Eg(e),c=bg(e),u=_g(e),h=wg(e),f=Tg(e),p=mg(e),g=gg(r),x=s.createProgram(),m,d,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(nr).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(nr).join(`
`),d.length>0&&(d+=`
`)):(m=[Bh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(nr).join(`
`),d=[Bh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==pn?"#define TONE_MAPPING":"",e.toneMapping!==pn?zt.tonemapping_pars_fragment:"",e.toneMapping!==pn?fg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",zt.colorspace_pars_fragment,dg("linearToOutputTexel",e.outputColorSpace),pg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(nr).join(`
`)),o=Dc(o),o=Uh(o,e),o=Nh(o,e),a=Dc(a),a=Uh(a,e),a=Nh(a,e),o=Fh(o),a=Fh(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",e.glslVersion===gc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===gc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let E=S+m+o,M=S+d+a,C=Ih(s,s.VERTEX_SHADER,E),w=Ih(s,s.FRAGMENT_SHADER,M);s.attachShader(x,C),s.attachShader(x,w),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function I(P){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(x)||"",H=s.getShaderInfoLog(C)||"",X=s.getShaderInfoLog(w)||"",q=F.trim(),G=H.trim(),et=X.trim(),k=!0,ot=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(k=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,C,w);else{let lt=Lh(s,C,"vertex"),_t=Lh(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+q+`
`+lt+`
`+_t)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(G===""||et==="")&&(ot=!1);ot&&(P.diagnostics={runnable:k,programLog:q,vertexShader:{log:G,prefix:m},fragmentShader:{log:et,prefix:d}})}s.deleteShader(C),s.deleteShader(w),N=new hs(s,x),b=xg(s,x)}let N;this.getUniforms=function(){return N===void 0&&I(this),N};let b;this.getAttributes=function(){return b===void 0&&I(this),b};let A=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=s.getProgramParameter(x,cg)),A},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=lg++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=C,this.fragmentShader=w,this}var Rg=0,Lc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Uc(t),e.set(t,n)),n}},Uc=class{constructor(t){this.id=Rg++,this.code=t,this.usedTimes=0}};function Pg(i,t,e,n,s,r,o){let a=new Ds,l=new Lc,c=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,A,P,F,H){let X=F.fog,q=H.geometry,G=b.isMeshStandardMaterial?F.environment:null,et=(b.isMeshStandardMaterial?e:t).get(b.envMap||G),k=et&&et.mapping===Zs?et.image.height:null,ot=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));let lt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,_t=lt!==void 0?lt.length:0,Nt=0;q.morphAttributes.position!==void 0&&(Nt=1),q.morphAttributes.normal!==void 0&&(Nt=2),q.morphAttributes.color!==void 0&&(Nt=3);let Zt,re,qt,Y;if(ot){let Qt=Sn[ot];Zt=Qt.vertexShader,re=Qt.fragmentShader}else Zt=b.vertexShader,re=b.fragmentShader,l.update(b),qt=l.getVertexShaderID(b),Y=l.getFragmentShaderID(b);let Q=i.getRenderTarget(),gt=i.state.buffers.depth.getReversed(),It=H.isInstancedMesh===!0,Mt=H.isBatchedMesh===!0,kt=!!b.map,ge=!!b.matcap,R=!!et,it=!!b.aoMap,ft=!!b.lightMap,st=!!b.bumpMap,ut=!!b.normalMap,Ft=!!b.displacementMap,pt=!!b.emissiveMap,Ut=!!b.metalnessMap,Gt=!!b.roughnessMap,fe=b.anisotropy>0,_=b.clearcoat>0,v=b.dispersion>0,B=b.iridescence>0,W=b.sheen>0,Z=b.transmission>0,V=fe&&!!b.anisotropyMap,wt=_&&!!b.clearcoatMap,nt=_&&!!b.clearcoatNormalMap,At=_&&!!b.clearcoatRoughnessMap,Et=B&&!!b.iridescenceMap,$=B&&!!b.iridescenceThicknessMap,dt=W&&!!b.sheenColorMap,Dt=W&&!!b.sheenRoughnessMap,bt=!!b.specularMap,ct=!!b.specularColorMap,Ht=!!b.specularIntensityMap,D=Z&&!!b.transmissionMap,tt=Z&&!!b.thicknessMap,rt=!!b.gradientMap,xt=!!b.alphaMap,K=b.alphaTest>0,j=!!b.alphaHash,yt=!!b.extensions,Bt=pn;b.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Bt=i.toneMapping);let oe={shaderID:ot,shaderType:b.type,shaderName:b.name,vertexShader:Zt,fragmentShader:re,defines:b.defines,customVertexShaderID:qt,customFragmentShaderID:Y,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:Mt,batchingColor:Mt&&H._colorsTexture!==null,instancing:It,instancingColor:It&&H.instanceColor!==null,instancingMorph:It&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Q===null?i.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:li,alphaToCoverage:!!b.alphaToCoverage,map:kt,matcap:ge,envMap:R,envMapMode:R&&et.mapping,envMapCubeUVHeight:k,aoMap:it,lightMap:ft,bumpMap:st,normalMap:ut,displacementMap:f&&Ft,emissiveMap:pt,normalMapObjectSpace:ut&&b.normalMapType===rh,normalMapTangentSpace:ut&&b.normalMapType===$o,metalnessMap:Ut,roughnessMap:Gt,anisotropy:fe,anisotropyMap:V,clearcoat:_,clearcoatMap:wt,clearcoatNormalMap:nt,clearcoatRoughnessMap:At,dispersion:v,iridescence:B,iridescenceMap:Et,iridescenceThicknessMap:$,sheen:W,sheenColorMap:dt,sheenRoughnessMap:Dt,specularMap:bt,specularColorMap:ct,specularIntensityMap:Ht,transmission:Z,transmissionMap:D,thicknessMap:tt,gradientMap:rt,opaque:b.transparent===!1&&b.blending===Un&&b.alphaToCoverage===!1,alphaMap:xt,alphaTest:K,alphaHash:j,combine:b.combine,mapUv:kt&&x(b.map.channel),aoMapUv:it&&x(b.aoMap.channel),lightMapUv:ft&&x(b.lightMap.channel),bumpMapUv:st&&x(b.bumpMap.channel),normalMapUv:ut&&x(b.normalMap.channel),displacementMapUv:Ft&&x(b.displacementMap.channel),emissiveMapUv:pt&&x(b.emissiveMap.channel),metalnessMapUv:Ut&&x(b.metalnessMap.channel),roughnessMapUv:Gt&&x(b.roughnessMap.channel),anisotropyMapUv:V&&x(b.anisotropyMap.channel),clearcoatMapUv:wt&&x(b.clearcoatMap.channel),clearcoatNormalMapUv:nt&&x(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:At&&x(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&x(b.iridescenceMap.channel),iridescenceThicknessMapUv:$&&x(b.iridescenceThicknessMap.channel),sheenColorMapUv:dt&&x(b.sheenColorMap.channel),sheenRoughnessMapUv:Dt&&x(b.sheenRoughnessMap.channel),specularMapUv:bt&&x(b.specularMap.channel),specularColorMapUv:ct&&x(b.specularColorMap.channel),specularIntensityMapUv:Ht&&x(b.specularIntensityMap.channel),transmissionMapUv:D&&x(b.transmissionMap.channel),thicknessMapUv:tt&&x(b.thicknessMap.channel),alphaMapUv:xt&&x(b.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(ut||fe),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!q.attributes.uv&&(kt||xt),fog:!!X,useFog:b.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:gt,skinning:H.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:_t,morphTextureStride:Nt,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Bt,decodeVideoTexture:kt&&b.map.isVideoTexture===!0&&Wt.getTransfer(b.map.colorSpace)===$t,decodeVideoTextureEmissive:pt&&b.emissiveMap.isVideoTexture===!0&&Wt.getTransfer(b.emissiveMap.colorSpace)===$t,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ye,flipSided:b.side===Ie,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:yt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(yt&&b.extensions.multiDraw===!0||Mt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return oe.vertexUv1s=c.has(1),oe.vertexUv2s=c.has(2),oe.vertexUv3s=c.has(3),c.clear(),oe}function d(b){let A=[];if(b.shaderID?A.push(b.shaderID):(A.push(b.customVertexShaderID),A.push(b.customFragmentShaderID)),b.defines!==void 0)for(let P in b.defines)A.push(P),A.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(S(A,b),E(A,b),A.push(i.outputColorSpace)),A.push(b.customProgramCacheKey),A.join()}function S(b,A){b.push(A.precision),b.push(A.outputColorSpace),b.push(A.envMapMode),b.push(A.envMapCubeUVHeight),b.push(A.mapUv),b.push(A.alphaMapUv),b.push(A.lightMapUv),b.push(A.aoMapUv),b.push(A.bumpMapUv),b.push(A.normalMapUv),b.push(A.displacementMapUv),b.push(A.emissiveMapUv),b.push(A.metalnessMapUv),b.push(A.roughnessMapUv),b.push(A.anisotropyMapUv),b.push(A.clearcoatMapUv),b.push(A.clearcoatNormalMapUv),b.push(A.clearcoatRoughnessMapUv),b.push(A.iridescenceMapUv),b.push(A.iridescenceThicknessMapUv),b.push(A.sheenColorMapUv),b.push(A.sheenRoughnessMapUv),b.push(A.specularMapUv),b.push(A.specularColorMapUv),b.push(A.specularIntensityMapUv),b.push(A.transmissionMapUv),b.push(A.thicknessMapUv),b.push(A.combine),b.push(A.fogExp2),b.push(A.sizeAttenuation),b.push(A.morphTargetsCount),b.push(A.morphAttributeCount),b.push(A.numDirLights),b.push(A.numPointLights),b.push(A.numSpotLights),b.push(A.numSpotLightMaps),b.push(A.numHemiLights),b.push(A.numRectAreaLights),b.push(A.numDirLightShadows),b.push(A.numPointLightShadows),b.push(A.numSpotLightShadows),b.push(A.numSpotLightShadowsWithMaps),b.push(A.numLightProbes),b.push(A.shadowMapType),b.push(A.toneMapping),b.push(A.numClippingPlanes),b.push(A.numClipIntersection),b.push(A.depthPacking)}function E(b,A){a.disableAll(),A.supportsVertexTextures&&a.enable(0),A.instancing&&a.enable(1),A.instancingColor&&a.enable(2),A.instancingMorph&&a.enable(3),A.matcap&&a.enable(4),A.envMap&&a.enable(5),A.normalMapObjectSpace&&a.enable(6),A.normalMapTangentSpace&&a.enable(7),A.clearcoat&&a.enable(8),A.iridescence&&a.enable(9),A.alphaTest&&a.enable(10),A.vertexColors&&a.enable(11),A.vertexAlphas&&a.enable(12),A.vertexUv1s&&a.enable(13),A.vertexUv2s&&a.enable(14),A.vertexUv3s&&a.enable(15),A.vertexTangents&&a.enable(16),A.anisotropy&&a.enable(17),A.alphaHash&&a.enable(18),A.batching&&a.enable(19),A.dispersion&&a.enable(20),A.batchingColor&&a.enable(21),A.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),b.push(a.mask)}function M(b){let A=g[b.type],P;if(A){let F=Sn[A];P=gh.clone(F.uniforms)}else P=b.uniforms;return P}function C(b,A){let P;for(let F=0,H=u.length;F<H;F++){let X=u[F];if(X.cacheKey===A){P=X,++P.usedTimes;break}}return P===void 0&&(P=new Cg(i,A,b,r),u.push(P)),P}function w(b){if(--b.usedTimes===0){let A=u.indexOf(b);u[A]=u[u.length-1],u.pop(),b.destroy()}}function I(b){l.remove(b)}function N(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:M,acquireProgram:C,releaseProgram:w,releaseShaderCache:I,programs:u,dispose:N}}function Ig(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Dg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Oh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function zh(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(h,f,p,g,x,m){let d=i[t];return d===void 0?(d={id:h.id,object:h,geometry:f,material:p,groupOrder:g,renderOrder:h.renderOrder,z:x,group:m},i[t]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=h.renderOrder,d.z=x,d.group=m),t++,d}function a(h,f,p,g,x,m){let d=o(h,f,p,g,x,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):e.push(d)}function l(h,f,p,g,x,m){let d=o(h,f,p,g,x,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function c(h,f){e.length>1&&e.sort(h||Dg),n.length>1&&n.sort(f||Oh),s.length>1&&s.sort(f||Oh)}function u(){for(let h=t,f=i.length;h<f;h++){let p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function Lg(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new zh,i.set(n,[o])):s>=r.length?(o=new zh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Ug(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new T,color:new Rt};break;case"SpotLight":e={position:new T,direction:new T,color:new Rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new T,color:new Rt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new T,skyColor:new Rt,groundColor:new Rt};break;case"RectAreaLight":e={color:new Rt,position:new T,halfWidth:new T,halfHeight:new T};break}return i[t.id]=e,e}}}function Ng(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Fg=0;function Bg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Og(i){let t=new Ug,e=Ng(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new T);let s=new T,r=new se,o=new se;function a(c){let u=0,h=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let p=0,g=0,x=0,m=0,d=0,S=0,E=0,M=0,C=0,w=0,I=0;c.sort(Bg);for(let b=0,A=c.length;b<A;b++){let P=c[b],F=P.color,H=P.intensity,X=P.distance,q=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=F.r*H,h+=F.g*H,f+=F.b*H;else if(P.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(P.sh.coefficients[G],H);I++}else if(P.isDirectionalLight){let G=t.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let et=P.shadow,k=e.get(P);k.shadowIntensity=et.intensity,k.shadowBias=et.bias,k.shadowNormalBias=et.normalBias,k.shadowRadius=et.radius,k.shadowMapSize=et.mapSize,n.directionalShadow[p]=k,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=P.shadow.matrix,S++}n.directional[p]=G,p++}else if(P.isSpotLight){let G=t.get(P);G.position.setFromMatrixPosition(P.matrixWorld),G.color.copy(F).multiplyScalar(H),G.distance=X,G.coneCos=Math.cos(P.angle),G.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),G.decay=P.decay,n.spot[x]=G;let et=P.shadow;if(P.map&&(n.spotLightMap[C]=P.map,C++,et.updateMatrices(P),P.castShadow&&w++),n.spotLightMatrix[x]=et.matrix,P.castShadow){let k=e.get(P);k.shadowIntensity=et.intensity,k.shadowBias=et.bias,k.shadowNormalBias=et.normalBias,k.shadowRadius=et.radius,k.shadowMapSize=et.mapSize,n.spotShadow[x]=k,n.spotShadowMap[x]=q,M++}x++}else if(P.isRectAreaLight){let G=t.get(P);G.color.copy(F).multiplyScalar(H),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=G,m++}else if(P.isPointLight){let G=t.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),G.distance=P.distance,G.decay=P.decay,P.castShadow){let et=P.shadow,k=e.get(P);k.shadowIntensity=et.intensity,k.shadowBias=et.bias,k.shadowNormalBias=et.normalBias,k.shadowRadius=et.radius,k.shadowMapSize=et.mapSize,k.shadowCameraNear=et.camera.near,k.shadowCameraFar=et.camera.far,n.pointShadow[g]=k,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=P.shadow.matrix,E++}n.point[g]=G,g++}else if(P.isHemisphereLight){let G=t.get(P);G.skyColor.copy(P.color).multiplyScalar(H),G.groundColor.copy(P.groundColor).multiplyScalar(H),n.hemi[d]=G,d++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=at.LTC_FLOAT_1,n.rectAreaLTC2=at.LTC_FLOAT_2):(n.rectAreaLTC1=at.LTC_HALF_1,n.rectAreaLTC2=at.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=f;let N=n.hash;(N.directionalLength!==p||N.pointLength!==g||N.spotLength!==x||N.rectAreaLength!==m||N.hemiLength!==d||N.numDirectionalShadows!==S||N.numPointShadows!==E||N.numSpotShadows!==M||N.numSpotMaps!==C||N.numLightProbes!==I)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=M+C-w,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=I,N.directionalLength=p,N.pointLength=g,N.spotLength=x,N.rectAreaLength=m,N.hemiLength=d,N.numDirectionalShadows=S,N.numPointShadows=E,N.numSpotShadows=M,N.numSpotMaps=C,N.numLightProbes=I,n.version=Fg++)}function l(c,u){let h=0,f=0,p=0,g=0,x=0,m=u.matrixWorldInverse;for(let d=0,S=c.length;d<S;d++){let E=c[d];if(E.isDirectionalLight){let M=n.directional[h];M.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),h++}else if(E.isSpotLight){let M=n.spot[p];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),p++}else if(E.isRectAreaLight){let M=n.rectArea[g];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(E.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(E.width*.5,0,0),M.halfHeight.set(0,E.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){let M=n.point[f];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),f++}else if(E.isHemisphereLight){let M=n.hemi[x];M.direction.setFromMatrixPosition(E.matrixWorld),M.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function Hh(i){let t=new Og(i),e=[],n=[];function s(u){c.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function l(u){t.setupView(e,u)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function zg(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Hh(i),t.set(s,[a])):r>=o.length?(a=new Hh(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var Hg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,kg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Vg(i,t,e){let n=new $i,s=new St,r=new St,o=new Jt,a=new Qr({depthPacking:sh}),l=new Zr,c={},u=e.maxTextureSize,h={[Ve]:Ie,[Ie]:Ve,[Ye]:Ye},f=new hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new St},radius:{value:4}},vertexShader:Hg,fragmentShader:kg}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let g=new xe;g.setAttribute("position",new Le(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new be(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ic;let d=this.type;this.render=function(w,I,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let b=i.getRenderTarget(),A=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Nn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let H=d!==Mn&&this.type===Mn,X=d===Mn&&this.type!==Mn;for(let q=0,G=w.length;q<G;q++){let et=w[q],k=et.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",et,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);let ot=k.getFrameExtents();if(s.multiply(ot),r.copy(k.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ot.x),s.x=r.x*ot.x,k.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ot.y),s.y=r.y*ot.y,k.mapSize.y=r.y)),k.map===null||H===!0||X===!0){let _t=this.type!==Mn?{minFilter:$e,magFilter:$e}:{};k.map!==null&&k.map.dispose(),k.map=new vn(s.x,s.y,_t),k.map.texture.name=et.name+".shadowMap",k.camera.updateProjectionMatrix()}i.setRenderTarget(k.map),i.clear();let lt=k.getViewportCount();for(let _t=0;_t<lt;_t++){let Nt=k.getViewport(_t);o.set(r.x*Nt.x,r.y*Nt.y,r.x*Nt.z,r.y*Nt.w),F.viewport(o),k.updateMatrices(et,_t),n=k.getFrustum(),M(I,N,k.camera,et,this.type)}k.isPointLightShadow!==!0&&this.type===Mn&&S(k,N),k.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(b,A,P)};function S(w,I){let N=t.update(x);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new vn(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(I,null,N,f,x,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(I,null,N,p,x,null)}function E(w,I,N,b){let A=null,P=N.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)A=P;else if(A=N.isPointLight===!0?l:a,i.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){let F=A.uuid,H=I.uuid,X=c[F];X===void 0&&(X={},c[F]=X);let q=X[H];q===void 0&&(q=A.clone(),X[H]=q,I.addEventListener("dispose",C)),A=q}if(A.visible=I.visible,A.wireframe=I.wireframe,b===Mn?A.side=I.shadowSide!==null?I.shadowSide:I.side:A.side=I.shadowSide!==null?I.shadowSide:h[I.side],A.alphaMap=I.alphaMap,A.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,A.map=I.map,A.clipShadows=I.clipShadows,A.clippingPlanes=I.clippingPlanes,A.clipIntersection=I.clipIntersection,A.displacementMap=I.displacementMap,A.displacementScale=I.displacementScale,A.displacementBias=I.displacementBias,A.wireframeLinewidth=I.wireframeLinewidth,A.linewidth=I.linewidth,N.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let F=i.properties.get(A);F.light=N}return A}function M(w,I,N,b,A){if(w.visible===!1)return;if(w.layers.test(I.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&A===Mn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,w.matrixWorld);let H=t.update(w),X=w.material;if(Array.isArray(X)){let q=H.groups;for(let G=0,et=q.length;G<et;G++){let k=q[G],ot=X[k.materialIndex];if(ot&&ot.visible){let lt=E(w,ot,b,A);w.onBeforeShadow(i,w,I,N,H,lt,k),i.renderBufferDirect(N,null,H,lt,w,k),w.onAfterShadow(i,w,I,N,H,lt,k)}}}else if(X.visible){let q=E(w,X,b,A);w.onBeforeShadow(i,w,I,N,H,q,null),i.renderBufferDirect(N,null,H,q,w,null),w.onAfterShadow(i,w,I,N,H,q,null)}}let F=w.children;for(let H=0,X=F.length;H<X;H++)M(F[H],I,N,b,A)}function C(w){w.target.removeEventListener("dispose",C);for(let N in c){let b=c[N],A=w.target.uuid;A in b&&(b[A].dispose(),delete b[A])}}}var Gg={[ao]:co,[lo]:fo,[ho]:po,[ci]:uo,[co]:ao,[fo]:lo,[po]:ho,[uo]:ci};function Wg(i,t){function e(){let D=!1,tt=new Jt,rt=null,xt=new Jt(0,0,0,0);return{setMask:function(K){rt!==K&&!D&&(i.colorMask(K,K,K,K),rt=K)},setLocked:function(K){D=K},setClear:function(K,j,yt,Bt,oe){oe===!0&&(K*=Bt,j*=Bt,yt*=Bt),tt.set(K,j,yt,Bt),xt.equals(tt)===!1&&(i.clearColor(K,j,yt,Bt),xt.copy(tt))},reset:function(){D=!1,rt=null,xt.set(-1,0,0,0)}}}function n(){let D=!1,tt=!1,rt=null,xt=null,K=null;return{setReversed:function(j){if(tt!==j){let yt=t.get("EXT_clip_control");j?yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.ZERO_TO_ONE_EXT):yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.NEGATIVE_ONE_TO_ONE_EXT),tt=j;let Bt=K;K=null,this.setClear(Bt)}},getReversed:function(){return tt},setTest:function(j){j?Q(i.DEPTH_TEST):gt(i.DEPTH_TEST)},setMask:function(j){rt!==j&&!D&&(i.depthMask(j),rt=j)},setFunc:function(j){if(tt&&(j=Gg[j]),xt!==j){switch(j){case ao:i.depthFunc(i.NEVER);break;case co:i.depthFunc(i.ALWAYS);break;case lo:i.depthFunc(i.LESS);break;case ci:i.depthFunc(i.LEQUAL);break;case ho:i.depthFunc(i.EQUAL);break;case uo:i.depthFunc(i.GEQUAL);break;case fo:i.depthFunc(i.GREATER);break;case po:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xt=j}},setLocked:function(j){D=j},setClear:function(j){K!==j&&(tt&&(j=1-j),i.clearDepth(j),K=j)},reset:function(){D=!1,rt=null,xt=null,K=null,tt=!1}}}function s(){let D=!1,tt=null,rt=null,xt=null,K=null,j=null,yt=null,Bt=null,oe=null;return{setTest:function(Qt){D||(Qt?Q(i.STENCIL_TEST):gt(i.STENCIL_TEST))},setMask:function(Qt){tt!==Qt&&!D&&(i.stencilMask(Qt),tt=Qt)},setFunc:function(Qt,bn,gn){(rt!==Qt||xt!==bn||K!==gn)&&(i.stencilFunc(Qt,bn,gn),rt=Qt,xt=bn,K=gn)},setOp:function(Qt,bn,gn){(j!==Qt||yt!==bn||Bt!==gn)&&(i.stencilOp(Qt,bn,gn),j=Qt,yt=bn,Bt=gn)},setLocked:function(Qt){D=Qt},setClear:function(Qt){oe!==Qt&&(i.clearStencil(Qt),oe=Qt)},reset:function(){D=!1,tt=null,rt=null,xt=null,K=null,j=null,yt=null,Bt=null,oe=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,u={},h={},f=new WeakMap,p=[],g=null,x=!1,m=null,d=null,S=null,E=null,M=null,C=null,w=null,I=new Rt(0,0,0),N=0,b=!1,A=null,P=null,F=null,H=null,X=null,q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),G=!1,et=0,k=i.getParameter(i.VERSION);k.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(k)[1]),G=et>=1):k.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),G=et>=2);let ot=null,lt={},_t=i.getParameter(i.SCISSOR_BOX),Nt=i.getParameter(i.VIEWPORT),Zt=new Jt().fromArray(_t),re=new Jt().fromArray(Nt);function qt(D,tt,rt,xt){let K=new Uint8Array(4),j=i.createTexture();i.bindTexture(D,j),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let yt=0;yt<rt;yt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(tt,0,i.RGBA,1,1,xt,0,i.RGBA,i.UNSIGNED_BYTE,K):i.texImage2D(tt+yt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,K);return j}let Y={};Y[i.TEXTURE_2D]=qt(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=qt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=qt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=qt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Q(i.DEPTH_TEST),o.setFunc(ci),st(!1),ut(nc),Q(i.CULL_FACE),it(Nn);function Q(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function gt(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function It(D,tt){return h[D]!==tt?(i.bindFramebuffer(D,tt),h[D]=tt,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=tt),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=tt),!0):!1}function Mt(D,tt){let rt=p,xt=!1;if(D){rt=f.get(tt),rt===void 0&&(rt=[],f.set(tt,rt));let K=D.textures;if(rt.length!==K.length||rt[0]!==i.COLOR_ATTACHMENT0){for(let j=0,yt=K.length;j<yt;j++)rt[j]=i.COLOR_ATTACHMENT0+j;rt.length=K.length,xt=!0}}else rt[0]!==i.BACK&&(rt[0]=i.BACK,xt=!0);xt&&i.drawBuffers(rt)}function kt(D){return g!==D?(i.useProgram(D),g=D,!0):!1}let ge={[Wn]:i.FUNC_ADD,[Pl]:i.FUNC_SUBTRACT,[Il]:i.FUNC_REVERSE_SUBTRACT};ge[Dl]=i.MIN,ge[Ll]=i.MAX;let R={[Ul]:i.ZERO,[Nl]:i.ONE,[Fl]:i.SRC_COLOR,[Nr]:i.SRC_ALPHA,[Vl]:i.SRC_ALPHA_SATURATE,[Hl]:i.DST_COLOR,[Ol]:i.DST_ALPHA,[Bl]:i.ONE_MINUS_SRC_COLOR,[Fr]:i.ONE_MINUS_SRC_ALPHA,[kl]:i.ONE_MINUS_DST_COLOR,[zl]:i.ONE_MINUS_DST_ALPHA,[Gl]:i.CONSTANT_COLOR,[Wl]:i.ONE_MINUS_CONSTANT_COLOR,[Xl]:i.CONSTANT_ALPHA,[Yl]:i.ONE_MINUS_CONSTANT_ALPHA};function it(D,tt,rt,xt,K,j,yt,Bt,oe,Qt){if(D===Nn){x===!0&&(gt(i.BLEND),x=!1);return}if(x===!1&&(Q(i.BLEND),x=!0),D!==Rl){if(D!==m||Qt!==b){if((d!==Wn||M!==Wn)&&(i.blendEquation(i.FUNC_ADD),d=Wn,M=Wn),Qt)switch(D){case Un:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case pi:i.blendFunc(i.ONE,i.ONE);break;case sc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case rc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Un:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case pi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case sc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case rc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}S=null,E=null,C=null,w=null,I.set(0,0,0),N=0,m=D,b=Qt}return}K=K||tt,j=j||rt,yt=yt||xt,(tt!==d||K!==M)&&(i.blendEquationSeparate(ge[tt],ge[K]),d=tt,M=K),(rt!==S||xt!==E||j!==C||yt!==w)&&(i.blendFuncSeparate(R[rt],R[xt],R[j],R[yt]),S=rt,E=xt,C=j,w=yt),(Bt.equals(I)===!1||oe!==N)&&(i.blendColor(Bt.r,Bt.g,Bt.b,oe),I.copy(Bt),N=oe),m=D,b=!1}function ft(D,tt){D.side===Ye?gt(i.CULL_FACE):Q(i.CULL_FACE);let rt=D.side===Ie;tt&&(rt=!rt),st(rt),D.blending===Un&&D.transparent===!1?it(Nn):it(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),r.setMask(D.colorWrite);let xt=D.stencilWrite;a.setTest(xt),xt&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),pt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Q(i.SAMPLE_ALPHA_TO_COVERAGE):gt(i.SAMPLE_ALPHA_TO_COVERAGE)}function st(D){A!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),A=D)}function ut(D){D!==wl?(Q(i.CULL_FACE),D!==P&&(D===nc?i.cullFace(i.BACK):D===Tl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):gt(i.CULL_FACE),P=D}function Ft(D){D!==F&&(G&&i.lineWidth(D),F=D)}function pt(D,tt,rt){D?(Q(i.POLYGON_OFFSET_FILL),(H!==tt||X!==rt)&&(i.polygonOffset(tt,rt),H=tt,X=rt)):gt(i.POLYGON_OFFSET_FILL)}function Ut(D){D?Q(i.SCISSOR_TEST):gt(i.SCISSOR_TEST)}function Gt(D){D===void 0&&(D=i.TEXTURE0+q-1),ot!==D&&(i.activeTexture(D),ot=D)}function fe(D,tt,rt){rt===void 0&&(ot===null?rt=i.TEXTURE0+q-1:rt=ot);let xt=lt[rt];xt===void 0&&(xt={type:void 0,texture:void 0},lt[rt]=xt),(xt.type!==D||xt.texture!==tt)&&(ot!==rt&&(i.activeTexture(rt),ot=rt),i.bindTexture(D,tt||Y[D]),xt.type=D,xt.texture=tt)}function _(){let D=lt[ot];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function B(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function W(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Z(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function V(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function wt(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function nt(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function At(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Et(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function $(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function dt(D){Zt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Zt.copy(D))}function Dt(D){re.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),re.copy(D))}function bt(D,tt){let rt=c.get(tt);rt===void 0&&(rt=new WeakMap,c.set(tt,rt));let xt=rt.get(D);xt===void 0&&(xt=i.getUniformBlockIndex(tt,D.name),rt.set(D,xt))}function ct(D,tt){let xt=c.get(tt).get(D);l.get(tt)!==xt&&(i.uniformBlockBinding(tt,xt,D.__bindingPointIndex),l.set(tt,xt))}function Ht(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ot=null,lt={},h={},f=new WeakMap,p=[],g=null,x=!1,m=null,d=null,S=null,E=null,M=null,C=null,w=null,I=new Rt(0,0,0),N=0,b=!1,A=null,P=null,F=null,H=null,X=null,Zt.set(0,0,i.canvas.width,i.canvas.height),re.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:Q,disable:gt,bindFramebuffer:It,drawBuffers:Mt,useProgram:kt,setBlending:it,setMaterial:ft,setFlipSided:st,setCullFace:ut,setLineWidth:Ft,setPolygonOffset:pt,setScissorTest:Ut,activeTexture:Gt,bindTexture:fe,unbindTexture:_,compressedTexImage2D:v,compressedTexImage3D:B,texImage2D:Et,texImage3D:$,updateUBOMapping:bt,uniformBlockBinding:ct,texStorage2D:nt,texStorage3D:At,texSubImage2D:W,texSubImage3D:Z,compressedTexSubImage2D:V,compressedTexSubImage3D:wt,scissor:dt,viewport:Dt,reset:Ht}}function Xg(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new St,u=new WeakMap,h,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(_,v){return p?new OffscreenCanvas(_,v):qi("canvas")}function x(_,v,B){let W=1,Z=fe(_);if((Z.width>B||Z.height>B)&&(W=B/Math.max(Z.width,Z.height)),W<1)if(typeof HTMLImageElement<"u"&&_ instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&_ instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&_ instanceof ImageBitmap||typeof VideoFrame<"u"&&_ instanceof VideoFrame){let V=Math.floor(W*Z.width),wt=Math.floor(W*Z.height);h===void 0&&(h=g(V,wt));let nt=v?g(V,wt):h;return nt.width=V,nt.height=wt,nt.getContext("2d").drawImage(_,0,0,V,wt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+V+"x"+wt+")."),nt}else return"data"in _&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),_;return _}function m(_){return _.generateMipmaps}function d(_){i.generateMipmap(_)}function S(_){return _.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:_.isWebGL3DRenderTarget?i.TEXTURE_3D:_.isWebGLArrayRenderTarget||_.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(_,v,B,W,Z=!1){if(_!==null){if(i[_]!==void 0)return i[_];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+_+"'")}let V=v;if(v===i.RED&&(B===i.FLOAT&&(V=i.R32F),B===i.HALF_FLOAT&&(V=i.R16F),B===i.UNSIGNED_BYTE&&(V=i.R8)),v===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(V=i.R8UI),B===i.UNSIGNED_SHORT&&(V=i.R16UI),B===i.UNSIGNED_INT&&(V=i.R32UI),B===i.BYTE&&(V=i.R8I),B===i.SHORT&&(V=i.R16I),B===i.INT&&(V=i.R32I)),v===i.RG&&(B===i.FLOAT&&(V=i.RG32F),B===i.HALF_FLOAT&&(V=i.RG16F),B===i.UNSIGNED_BYTE&&(V=i.RG8)),v===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(V=i.RG8UI),B===i.UNSIGNED_SHORT&&(V=i.RG16UI),B===i.UNSIGNED_INT&&(V=i.RG32UI),B===i.BYTE&&(V=i.RG8I),B===i.SHORT&&(V=i.RG16I),B===i.INT&&(V=i.RG32I)),v===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(V=i.RGB8UI),B===i.UNSIGNED_SHORT&&(V=i.RGB16UI),B===i.UNSIGNED_INT&&(V=i.RGB32UI),B===i.BYTE&&(V=i.RGB8I),B===i.SHORT&&(V=i.RGB16I),B===i.INT&&(V=i.RGB32I)),v===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(V=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(V=i.RGBA16UI),B===i.UNSIGNED_INT&&(V=i.RGBA32UI),B===i.BYTE&&(V=i.RGBA8I),B===i.SHORT&&(V=i.RGBA16I),B===i.INT&&(V=i.RGBA32I)),v===i.RGB&&(B===i.UNSIGNED_INT_5_9_9_9_REV&&(V=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(V=i.R11F_G11F_B10F)),v===i.RGBA){let wt=Z?Rs:Wt.getTransfer(W);B===i.FLOAT&&(V=i.RGBA32F),B===i.HALF_FLOAT&&(V=i.RGBA16F),B===i.UNSIGNED_BYTE&&(V=wt===$t?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(V=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(V=i.RGB5_A1)}return(V===i.R16F||V===i.R32F||V===i.RG16F||V===i.RG32F||V===i.RGBA16F||V===i.RGBA32F)&&t.get("EXT_color_buffer_float"),V}function M(_,v){let B;return _?v===null||v===Jn||v===os?B=i.DEPTH24_STENCIL8:v===An?B=i.DEPTH32F_STENCIL8:v===ss&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Jn||v===os?B=i.DEPTH_COMPONENT24:v===An?B=i.DEPTH_COMPONENT32F:v===ss&&(B=i.DEPTH_COMPONENT16),B}function C(_,v){return m(_)===!0||_.isFramebufferTexture&&_.minFilter!==$e&&_.minFilter!==ln?Math.log2(Math.max(v.width,v.height))+1:_.mipmaps!==void 0&&_.mipmaps.length>0?_.mipmaps.length:_.isCompressedTexture&&Array.isArray(_.image)?v.mipmaps.length:1}function w(_){let v=_.target;v.removeEventListener("dispose",w),N(v),v.isVideoTexture&&u.delete(v)}function I(_){let v=_.target;v.removeEventListener("dispose",I),A(v)}function N(_){let v=n.get(_);if(v.__webglInit===void 0)return;let B=_.source,W=f.get(B);if(W){let Z=W[v.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&b(_),Object.keys(W).length===0&&f.delete(B)}n.remove(_)}function b(_){let v=n.get(_);i.deleteTexture(v.__webglTexture);let B=_.source,W=f.get(B);delete W[v.__cacheKey],o.memory.textures--}function A(_){let v=n.get(_);if(_.depthTexture&&(_.depthTexture.dispose(),n.remove(_.depthTexture)),_.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(v.__webglFramebuffer[W]))for(let Z=0;Z<v.__webglFramebuffer[W].length;Z++)i.deleteFramebuffer(v.__webglFramebuffer[W][Z]);else i.deleteFramebuffer(v.__webglFramebuffer[W]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[W])}else{if(Array.isArray(v.__webglFramebuffer))for(let W=0;W<v.__webglFramebuffer.length;W++)i.deleteFramebuffer(v.__webglFramebuffer[W]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let W=0;W<v.__webglColorRenderbuffer.length;W++)v.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[W]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let B=_.textures;for(let W=0,Z=B.length;W<Z;W++){let V=n.get(B[W]);V.__webglTexture&&(i.deleteTexture(V.__webglTexture),o.memory.textures--),n.remove(B[W])}n.remove(_)}let P=0;function F(){P=0}function H(){let _=P;return _>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+_+" texture units while this GPU supports only "+s.maxTextures),P+=1,_}function X(_){let v=[];return v.push(_.wrapS),v.push(_.wrapT),v.push(_.wrapR||0),v.push(_.magFilter),v.push(_.minFilter),v.push(_.anisotropy),v.push(_.internalFormat),v.push(_.format),v.push(_.type),v.push(_.generateMipmaps),v.push(_.premultiplyAlpha),v.push(_.flipY),v.push(_.unpackAlignment),v.push(_.colorSpace),v.join()}function q(_,v){let B=n.get(_);if(_.isVideoTexture&&Ut(_),_.isRenderTargetTexture===!1&&_.isExternalTexture!==!0&&_.version>0&&B.__version!==_.version){let W=_.image;if(W===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(B,_,v);return}}else _.isExternalTexture&&(B.__webglTexture=_.sourceTexture?_.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+v)}function G(_,v){let B=n.get(_);if(_.isRenderTargetTexture===!1&&_.version>0&&B.__version!==_.version){Y(B,_,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+v)}function et(_,v){let B=n.get(_);if(_.isRenderTargetTexture===!1&&_.version>0&&B.__version!==_.version){Y(B,_,v);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+v)}function k(_,v){let B=n.get(_);if(_.version>0&&B.__version!==_.version){Q(B,_,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+v)}let ot={[Wi]:i.REPEAT,[Gn]:i.CLAMP_TO_EDGE,[Br]:i.MIRRORED_REPEAT},lt={[$e]:i.NEAREST,[nh]:i.NEAREST_MIPMAP_NEAREST,[Ks]:i.NEAREST_MIPMAP_LINEAR,[ln]:i.LINEAR,[vo]:i.LINEAR_MIPMAP_NEAREST,[Kn]:i.LINEAR_MIPMAP_LINEAR},_t={[oh]:i.NEVER,[dh]:i.ALWAYS,[ah]:i.LESS,[mc]:i.LEQUAL,[ch]:i.EQUAL,[uh]:i.GEQUAL,[lh]:i.GREATER,[hh]:i.NOTEQUAL};function Nt(_,v){if(v.type===An&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===ln||v.magFilter===vo||v.magFilter===Ks||v.magFilter===Kn||v.minFilter===ln||v.minFilter===vo||v.minFilter===Ks||v.minFilter===Kn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(_,i.TEXTURE_WRAP_S,ot[v.wrapS]),i.texParameteri(_,i.TEXTURE_WRAP_T,ot[v.wrapT]),(_===i.TEXTURE_3D||_===i.TEXTURE_2D_ARRAY)&&i.texParameteri(_,i.TEXTURE_WRAP_R,ot[v.wrapR]),i.texParameteri(_,i.TEXTURE_MAG_FILTER,lt[v.magFilter]),i.texParameteri(_,i.TEXTURE_MIN_FILTER,lt[v.minFilter]),v.compareFunction&&(i.texParameteri(_,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(_,i.TEXTURE_COMPARE_FUNC,_t[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===$e||v.minFilter!==Ks&&v.minFilter!==Kn||v.type===An&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(_,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Zt(_,v){let B=!1;_.__webglInit===void 0&&(_.__webglInit=!0,v.addEventListener("dispose",w));let W=v.source,Z=f.get(W);Z===void 0&&(Z={},f.set(W,Z));let V=X(v);if(V!==_.__cacheKey){Z[V]===void 0&&(Z[V]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),Z[V].usedTimes++;let wt=Z[_.__cacheKey];wt!==void 0&&(Z[_.__cacheKey].usedTimes--,wt.usedTimes===0&&b(v)),_.__cacheKey=V,_.__webglTexture=Z[V].texture}return B}function re(_,v,B){return Math.floor(Math.floor(_/B)/v)}function qt(_,v,B,W){let V=_.updateRanges;if(V.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,B,W,v.data);else{V.sort(($,dt)=>$.start-dt.start);let wt=0;for(let $=1;$<V.length;$++){let dt=V[wt],Dt=V[$],bt=dt.start+dt.count,ct=re(Dt.start,v.width,4),Ht=re(dt.start,v.width,4);Dt.start<=bt+1&&ct===Ht&&re(Dt.start+Dt.count-1,v.width,4)===ct?dt.count=Math.max(dt.count,Dt.start+Dt.count-dt.start):(++wt,V[wt]=Dt)}V.length=wt+1;let nt=i.getParameter(i.UNPACK_ROW_LENGTH),At=i.getParameter(i.UNPACK_SKIP_PIXELS),Et=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let $=0,dt=V.length;$<dt;$++){let Dt=V[$],bt=Math.floor(Dt.start/4),ct=Math.ceil(Dt.count/4),Ht=bt%v.width,D=Math.floor(bt/v.width),tt=ct,rt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ht),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),e.texSubImage2D(i.TEXTURE_2D,0,Ht,D,tt,rt,B,W,v.data)}_.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,nt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,At),i.pixelStorei(i.UNPACK_SKIP_ROWS,Et)}}function Y(_,v,B){let W=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(W=i.TEXTURE_3D);let Z=Zt(_,v),V=v.source;e.bindTexture(W,_.__webglTexture,i.TEXTURE0+B);let wt=n.get(V);if(V.version!==wt.__version||Z===!0){e.activeTexture(i.TEXTURE0+B);let nt=Wt.getPrimaries(Wt.workingColorSpace),At=v.colorSpace===Fn?null:Wt.getPrimaries(v.colorSpace),Et=v.colorSpace===Fn||nt===At?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);let $=x(v.image,!1,s.maxTextureSize);$=Gt(v,$);let dt=r.convert(v.format,v.colorSpace),Dt=r.convert(v.type),bt=E(v.internalFormat,dt,Dt,v.colorSpace,v.isVideoTexture);Nt(W,v);let ct,Ht=v.mipmaps,D=v.isVideoTexture!==!0,tt=wt.__version===void 0||Z===!0,rt=V.dataReady,xt=C(v,$);if(v.isDepthTexture)bt=M(v.format===as,v.type),tt&&(D?e.texStorage2D(i.TEXTURE_2D,1,bt,$.width,$.height):e.texImage2D(i.TEXTURE_2D,0,bt,$.width,$.height,0,dt,Dt,null));else if(v.isDataTexture)if(Ht.length>0){D&&tt&&e.texStorage2D(i.TEXTURE_2D,xt,bt,Ht[0].width,Ht[0].height);for(let K=0,j=Ht.length;K<j;K++)ct=Ht[K],D?rt&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,ct.width,ct.height,dt,Dt,ct.data):e.texImage2D(i.TEXTURE_2D,K,bt,ct.width,ct.height,0,dt,Dt,ct.data);v.generateMipmaps=!1}else D?(tt&&e.texStorage2D(i.TEXTURE_2D,xt,bt,$.width,$.height),rt&&qt(v,$,dt,Dt)):e.texImage2D(i.TEXTURE_2D,0,bt,$.width,$.height,0,dt,Dt,$.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){D&&tt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,xt,bt,Ht[0].width,Ht[0].height,$.depth);for(let K=0,j=Ht.length;K<j;K++)if(ct=Ht[K],v.format!==en)if(dt!==null)if(D){if(rt)if(v.layerUpdates.size>0){let yt=Sc(ct.width,ct.height,v.format,v.type);for(let Bt of v.layerUpdates){let oe=ct.data.subarray(Bt*yt/ct.data.BYTES_PER_ELEMENT,(Bt+1)*yt/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,Bt,ct.width,ct.height,1,dt,oe)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,ct.width,ct.height,$.depth,dt,ct.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,bt,ct.width,ct.height,$.depth,0,ct.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?rt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,ct.width,ct.height,$.depth,dt,Dt,ct.data):e.texImage3D(i.TEXTURE_2D_ARRAY,K,bt,ct.width,ct.height,$.depth,0,dt,Dt,ct.data)}else{D&&tt&&e.texStorage2D(i.TEXTURE_2D,xt,bt,Ht[0].width,Ht[0].height);for(let K=0,j=Ht.length;K<j;K++)ct=Ht[K],v.format!==en?dt!==null?D?rt&&e.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,ct.width,ct.height,dt,ct.data):e.compressedTexImage2D(i.TEXTURE_2D,K,bt,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?rt&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,ct.width,ct.height,dt,Dt,ct.data):e.texImage2D(i.TEXTURE_2D,K,bt,ct.width,ct.height,0,dt,Dt,ct.data)}else if(v.isDataArrayTexture)if(D){if(tt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,xt,bt,$.width,$.height,$.depth),rt)if(v.layerUpdates.size>0){let K=Sc($.width,$.height,v.format,v.type);for(let j of v.layerUpdates){let yt=$.data.subarray(j*K/$.data.BYTES_PER_ELEMENT,(j+1)*K/$.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,$.width,$.height,1,dt,Dt,yt)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,dt,Dt,$.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,bt,$.width,$.height,$.depth,0,dt,Dt,$.data);else if(v.isData3DTexture)D?(tt&&e.texStorage3D(i.TEXTURE_3D,xt,bt,$.width,$.height,$.depth),rt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,dt,Dt,$.data)):e.texImage3D(i.TEXTURE_3D,0,bt,$.width,$.height,$.depth,0,dt,Dt,$.data);else if(v.isFramebufferTexture){if(tt)if(D)e.texStorage2D(i.TEXTURE_2D,xt,bt,$.width,$.height);else{let K=$.width,j=$.height;for(let yt=0;yt<xt;yt++)e.texImage2D(i.TEXTURE_2D,yt,bt,K,j,0,dt,Dt,null),K>>=1,j>>=1}}else if(Ht.length>0){if(D&&tt){let K=fe(Ht[0]);e.texStorage2D(i.TEXTURE_2D,xt,bt,K.width,K.height)}for(let K=0,j=Ht.length;K<j;K++)ct=Ht[K],D?rt&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,dt,Dt,ct):e.texImage2D(i.TEXTURE_2D,K,bt,dt,Dt,ct);v.generateMipmaps=!1}else if(D){if(tt){let K=fe($);e.texStorage2D(i.TEXTURE_2D,xt,bt,K.width,K.height)}rt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,dt,Dt,$)}else e.texImage2D(i.TEXTURE_2D,0,bt,dt,Dt,$);m(v)&&d(W),wt.__version=V.version,v.onUpdate&&v.onUpdate(v)}_.__version=v.version}function Q(_,v,B){if(v.image.length!==6)return;let W=Zt(_,v),Z=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,_.__webglTexture,i.TEXTURE0+B);let V=n.get(Z);if(Z.version!==V.__version||W===!0){e.activeTexture(i.TEXTURE0+B);let wt=Wt.getPrimaries(Wt.workingColorSpace),nt=v.colorSpace===Fn?null:Wt.getPrimaries(v.colorSpace),At=v.colorSpace===Fn||wt===nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);let Et=v.isCompressedTexture||v.image[0].isCompressedTexture,$=v.image[0]&&v.image[0].isDataTexture,dt=[];for(let j=0;j<6;j++)!Et&&!$?dt[j]=x(v.image[j],!0,s.maxCubemapSize):dt[j]=$?v.image[j].image:v.image[j],dt[j]=Gt(v,dt[j]);let Dt=dt[0],bt=r.convert(v.format,v.colorSpace),ct=r.convert(v.type),Ht=E(v.internalFormat,bt,ct,v.colorSpace),D=v.isVideoTexture!==!0,tt=V.__version===void 0||W===!0,rt=Z.dataReady,xt=C(v,Dt);Nt(i.TEXTURE_CUBE_MAP,v);let K;if(Et){D&&tt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,Ht,Dt.width,Dt.height);for(let j=0;j<6;j++){K=dt[j].mipmaps;for(let yt=0;yt<K.length;yt++){let Bt=K[yt];v.format!==en?bt!==null?D?rt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,yt,0,0,Bt.width,Bt.height,bt,Bt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,yt,Ht,Bt.width,Bt.height,0,Bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,yt,0,0,Bt.width,Bt.height,bt,ct,Bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,yt,Ht,Bt.width,Bt.height,0,bt,ct,Bt.data)}}}else{if(K=v.mipmaps,D&&tt){K.length>0&&xt++;let j=fe(dt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,Ht,j.width,j.height)}for(let j=0;j<6;j++)if($){D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,dt[j].width,dt[j].height,bt,ct,dt[j].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ht,dt[j].width,dt[j].height,0,bt,ct,dt[j].data);for(let yt=0;yt<K.length;yt++){let oe=K[yt].image[j].image;D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,yt+1,0,0,oe.width,oe.height,bt,ct,oe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,yt+1,Ht,oe.width,oe.height,0,bt,ct,oe.data)}}else{D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,bt,ct,dt[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ht,bt,ct,dt[j]);for(let yt=0;yt<K.length;yt++){let Bt=K[yt];D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,yt+1,0,0,bt,ct,Bt.image[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,yt+1,Ht,bt,ct,Bt.image[j])}}}m(v)&&d(i.TEXTURE_CUBE_MAP),V.__version=Z.version,v.onUpdate&&v.onUpdate(v)}_.__version=v.version}function gt(_,v,B,W,Z,V){let wt=r.convert(B.format,B.colorSpace),nt=r.convert(B.type),At=E(B.internalFormat,wt,nt,B.colorSpace),Et=n.get(v),$=n.get(B);if($.__renderTarget=v,!Et.__hasExternalTextures){let dt=Math.max(1,v.width>>V),Dt=Math.max(1,v.height>>V);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,V,At,dt,Dt,v.depth,0,wt,nt,null):e.texImage2D(Z,V,At,dt,Dt,0,wt,nt,null)}e.bindFramebuffer(i.FRAMEBUFFER,_),pt(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,Z,$.__webglTexture,0,Ft(v)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,Z,$.__webglTexture,V),e.bindFramebuffer(i.FRAMEBUFFER,null)}function It(_,v,B){if(i.bindRenderbuffer(i.RENDERBUFFER,_),v.depthBuffer){let W=v.depthTexture,Z=W&&W.isDepthTexture?W.type:null,V=M(v.stencilBuffer,Z),wt=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=Ft(v);pt(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,V,v.width,v.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,V,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,V,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,wt,i.RENDERBUFFER,_)}else{let W=v.textures;for(let Z=0;Z<W.length;Z++){let V=W[Z],wt=r.convert(V.format,V.colorSpace),nt=r.convert(V.type),At=E(V.internalFormat,wt,nt,V.colorSpace),Et=Ft(v);B&&pt(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Et,At,v.width,v.height):pt(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Et,At,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,At,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Mt(_,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,_),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let W=n.get(v.depthTexture);W.__renderTarget=v,(!W.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),q(v.depthTexture,0);let Z=W.__webglTexture,V=Ft(v);if(v.depthTexture.format===Xi)pt(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0,V):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0);else if(v.depthTexture.format===as)pt(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0,V):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function kt(_){let v=n.get(_),B=_.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==_.depthTexture){let W=_.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),W){let Z=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,W.removeEventListener("dispose",Z)};W.addEventListener("dispose",Z),v.__depthDisposeCallback=Z}v.__boundDepthTexture=W}if(_.depthTexture&&!v.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");let W=_.texture.mipmaps;W&&W.length>0?Mt(v.__webglFramebuffer[0],_):Mt(v.__webglFramebuffer,_)}else if(B){v.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[W]),v.__webglDepthbuffer[W]===void 0)v.__webglDepthbuffer[W]=i.createRenderbuffer(),It(v.__webglDepthbuffer[W],_,!1);else{let Z=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,V=v.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,V),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,V)}}else{let W=_.texture.mipmaps;if(W&&W.length>0?e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),It(v.__webglDepthbuffer,_,!1);else{let Z=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,V=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,V),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,V)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ge(_,v,B){let W=n.get(_);v!==void 0&&gt(W.__webglFramebuffer,_,_.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&kt(_)}function R(_){let v=_.texture,B=n.get(_),W=n.get(v);_.addEventListener("dispose",I);let Z=_.textures,V=_.isWebGLCubeRenderTarget===!0,wt=Z.length>1;if(wt||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=v.version,o.memory.textures++),V){B.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(v.mipmaps&&v.mipmaps.length>0){B.__webglFramebuffer[nt]=[];for(let At=0;At<v.mipmaps.length;At++)B.__webglFramebuffer[nt][At]=i.createFramebuffer()}else B.__webglFramebuffer[nt]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){B.__webglFramebuffer=[];for(let nt=0;nt<v.mipmaps.length;nt++)B.__webglFramebuffer[nt]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(wt)for(let nt=0,At=Z.length;nt<At;nt++){let Et=n.get(Z[nt]);Et.__webglTexture===void 0&&(Et.__webglTexture=i.createTexture(),o.memory.textures++)}if(_.samples>0&&pt(_)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let nt=0;nt<Z.length;nt++){let At=Z[nt];B.__webglColorRenderbuffer[nt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[nt]);let Et=r.convert(At.format,At.colorSpace),$=r.convert(At.type),dt=E(At.internalFormat,Et,$,At.colorSpace,_.isXRRenderTarget===!0),Dt=Ft(_);i.renderbufferStorageMultisample(i.RENDERBUFFER,Dt,dt,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,B.__webglColorRenderbuffer[nt])}i.bindRenderbuffer(i.RENDERBUFFER,null),_.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),It(B.__webglDepthRenderbuffer,_,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(V){e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),Nt(i.TEXTURE_CUBE_MAP,v);for(let nt=0;nt<6;nt++)if(v.mipmaps&&v.mipmaps.length>0)for(let At=0;At<v.mipmaps.length;At++)gt(B.__webglFramebuffer[nt][At],_,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,At);else gt(B.__webglFramebuffer[nt],_,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);m(v)&&d(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(wt){for(let nt=0,At=Z.length;nt<At;nt++){let Et=Z[nt],$=n.get(Et),dt=i.TEXTURE_2D;(_.isWebGL3DRenderTarget||_.isWebGLArrayRenderTarget)&&(dt=_.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(dt,$.__webglTexture),Nt(dt,Et),gt(B.__webglFramebuffer,_,Et,i.COLOR_ATTACHMENT0+nt,dt,0),m(Et)&&d(dt)}e.unbindTexture()}else{let nt=i.TEXTURE_2D;if((_.isWebGL3DRenderTarget||_.isWebGLArrayRenderTarget)&&(nt=_.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(nt,W.__webglTexture),Nt(nt,v),v.mipmaps&&v.mipmaps.length>0)for(let At=0;At<v.mipmaps.length;At++)gt(B.__webglFramebuffer[At],_,v,i.COLOR_ATTACHMENT0,nt,At);else gt(B.__webglFramebuffer,_,v,i.COLOR_ATTACHMENT0,nt,0);m(v)&&d(nt),e.unbindTexture()}_.depthBuffer&&kt(_)}function it(_){let v=_.textures;for(let B=0,W=v.length;B<W;B++){let Z=v[B];if(m(Z)){let V=S(_),wt=n.get(Z).__webglTexture;e.bindTexture(V,wt),d(V),e.unbindTexture()}}}let ft=[],st=[];function ut(_){if(_.samples>0){if(pt(_)===!1){let v=_.textures,B=_.width,W=_.height,Z=i.COLOR_BUFFER_BIT,V=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,wt=n.get(_),nt=v.length>1;if(nt)for(let Et=0;Et<v.length;Et++)e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,wt.__webglMultisampledFramebuffer);let At=_.texture.mipmaps;At&&At.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let Et=0;Et<v.length;Et++){if(_.resolveDepthBuffer&&(_.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),_.stencilBuffer&&_.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),nt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,wt.__webglColorRenderbuffer[Et]);let $=n.get(v[Et]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,$,0)}i.blitFramebuffer(0,0,B,W,0,0,B,W,Z,i.NEAREST),l===!0&&(ft.length=0,st.length=0,ft.push(i.COLOR_ATTACHMENT0+Et),_.depthBuffer&&_.resolveDepthBuffer===!1&&(ft.push(V),st.push(V),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,st)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ft))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),nt)for(let Et=0;Et<v.length;Et++){e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,wt.__webglColorRenderbuffer[Et]);let $=n.get(v[Et]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,$,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglMultisampledFramebuffer)}else if(_.depthBuffer&&_.resolveDepthBuffer===!1&&l){let v=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function Ft(_){return Math.min(s.maxSamples,_.samples)}function pt(_){let v=n.get(_);return _.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Ut(_){let v=o.render.frame;u.get(_)!==v&&(u.set(_,v),_.update())}function Gt(_,v){let B=_.colorSpace,W=_.format,Z=_.type;return _.isCompressedTexture===!0||_.isVideoTexture===!0||B!==li&&B!==Fn&&(Wt.getTransfer(B)===$t?(W!==en||Z!==mn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),v}function fe(_){return typeof HTMLImageElement<"u"&&_ instanceof HTMLImageElement?(c.width=_.naturalWidth||_.width,c.height=_.naturalHeight||_.height):typeof VideoFrame<"u"&&_ instanceof VideoFrame?(c.width=_.displayWidth,c.height=_.displayHeight):(c.width=_.width,c.height=_.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=F,this.setTexture2D=q,this.setTexture2DArray=G,this.setTexture3D=et,this.setTextureCube=k,this.rebindTextures=ge,this.setupRenderTarget=R,this.updateRenderTargetMipmap=it,this.updateMultisampleRenderTarget=ut,this.setupDepthRenderbuffer=kt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=pt}function Yg(i,t){function e(n,s=Fn){let r,o=Wt.getTransfer(s);if(n===mn)return i.UNSIGNED_BYTE;if(n===Mo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ao)return i.UNSIGNED_SHORT_5_5_5_1;if(n===lc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===hc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ac)return i.BYTE;if(n===cc)return i.SHORT;if(n===ss)return i.UNSIGNED_SHORT;if(n===yo)return i.INT;if(n===Jn)return i.UNSIGNED_INT;if(n===An)return i.FLOAT;if(n===rs)return i.HALF_FLOAT;if(n===uc)return i.ALPHA;if(n===dc)return i.RGB;if(n===en)return i.RGBA;if(n===Xi)return i.DEPTH_COMPONENT;if(n===as)return i.DEPTH_STENCIL;if(n===fc)return i.RED;if(n===So)return i.RED_INTEGER;if(n===pc)return i.RG;if(n===Eo)return i.RG_INTEGER;if(n===bo)return i.RGBA_INTEGER;if(n===Js||n===$s||n===tr||n===er)if(o===$t)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Js)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$s)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Js)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$s)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===tr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===er)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===_o||n===wo||n===To||n===Co)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===_o)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===wo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===To)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Co)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ro||n===Po||n===Io)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ro||n===Po)return o===$t?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Io)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Do||n===Lo||n===Uo||n===No||n===Fo||n===Bo||n===Oo||n===zo||n===Ho||n===ko||n===Vo||n===Go||n===Wo||n===Xo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Do)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Lo)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Uo)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===No)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Fo)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Bo)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Oo)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===zo)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ho)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ko)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Vo)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Go)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Wo)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Xo)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Yo||n===qo||n===jo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Yo)return o===$t?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===qo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===jo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Qo||n===Zo||n===Ko||n===Jo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Qo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Zo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ko)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Jo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===os?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var qg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,jg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Nc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new ks(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new hn({vertexShader:qg,fragmentShader:jg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new be(new Vs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Fc=class extends xn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,f=null,p=null,g=null,x=typeof XRWebGLBinding<"u",m=new Nc,d={},S=e.getContextAttributes(),E=null,M=null,C=[],w=[],I=new St,N=null,b=new Ee;b.viewport=new Jt;let A=new Ee;A.viewport=new Jt;let P=[b,A],F=new oo,H=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Q=C[Y];return Q===void 0&&(Q=new Ki,C[Y]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Y){let Q=C[Y];return Q===void 0&&(Q=new Ki,C[Y]=Q),Q.getGripSpace()},this.getHand=function(Y){let Q=C[Y];return Q===void 0&&(Q=new Ki,C[Y]=Q),Q.getHandSpace()};function q(Y){let Q=w.indexOf(Y.inputSource);if(Q===-1)return;let gt=C[Q];gt!==void 0&&(gt.update(Y.inputSource,Y.frame,c||o),gt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function G(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",et);for(let Y=0;Y<C.length;Y++){let Q=w[Y];Q!==null&&(w[Y]=null,C[Y].disconnect(Q))}H=null,X=null,m.reset();for(let Y in d)delete d[Y];t.setRenderTarget(E),p=null,f=null,h=null,s=null,M=null,qt.stop(),n.isPresenting=!1,t.setPixelRatio(N),t.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(s,e)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(E=t.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",G),s.addEventListener("inputsourceschange",et),S.xrCompatible!==!0&&await e.makeXRCompatible(),N=t.getPixelRatio(),t.getSize(I),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let gt=null,It=null,Mt=null;S.depth&&(Mt=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,gt=S.stencil?as:Xi,It=S.stencil?os:Jn);let kt={colorFormat:e.RGBA8,depthFormat:Mt,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(kt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),M=new vn(f.textureWidth,f.textureHeight,{format:en,type:mn,depthTexture:new Hs(f.textureWidth,f.textureHeight,It,void 0,void 0,void 0,void 0,void 0,void 0,gt),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let gt={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,gt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new vn(p.framebufferWidth,p.framebufferHeight,{format:en,type:mn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),qt.setContext(s),qt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function et(Y){for(let Q=0;Q<Y.removed.length;Q++){let gt=Y.removed[Q],It=w.indexOf(gt);It>=0&&(w[It]=null,C[It].disconnect(gt))}for(let Q=0;Q<Y.added.length;Q++){let gt=Y.added[Q],It=w.indexOf(gt);if(It===-1){for(let kt=0;kt<C.length;kt++)if(kt>=w.length){w.push(gt),It=kt;break}else if(w[kt]===null){w[kt]=gt,It=kt;break}if(It===-1)break}let Mt=C[It];Mt&&Mt.connect(gt)}}let k=new T,ot=new T;function lt(Y,Q,gt){k.setFromMatrixPosition(Q.matrixWorld),ot.setFromMatrixPosition(gt.matrixWorld);let It=k.distanceTo(ot),Mt=Q.projectionMatrix.elements,kt=gt.projectionMatrix.elements,ge=Mt[14]/(Mt[10]-1),R=Mt[14]/(Mt[10]+1),it=(Mt[9]+1)/Mt[5],ft=(Mt[9]-1)/Mt[5],st=(Mt[8]-1)/Mt[0],ut=(kt[8]+1)/kt[0],Ft=ge*st,pt=ge*ut,Ut=It/(-st+ut),Gt=Ut*-st;if(Q.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Gt),Y.translateZ(Ut),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Mt[10]===-1)Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let fe=ge+Ut,_=R+Ut,v=Ft-Gt,B=pt+(It-Gt),W=it*R/_*fe,Z=ft*R/_*fe;Y.projectionMatrix.makePerspective(v,B,W,Z,fe,_),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function _t(Y,Q){Q===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Q.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let Q=Y.near,gt=Y.far;m.texture!==null&&(m.depthNear>0&&(Q=m.depthNear),m.depthFar>0&&(gt=m.depthFar)),F.near=A.near=b.near=Q,F.far=A.far=b.far=gt,(H!==F.near||X!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),H=F.near,X=F.far),F.layers.mask=Y.layers.mask|6,b.layers.mask=F.layers.mask&3,A.layers.mask=F.layers.mask&5;let It=Y.parent,Mt=F.cameras;_t(F,It);for(let kt=0;kt<Mt.length;kt++)_t(Mt[kt],It);Mt.length===2?lt(F,b,A):F.projectionMatrix.copy(b.projectionMatrix),Nt(Y,F,It)};function Nt(Y,Q,gt){gt===null?Y.matrix.copy(Q.matrixWorld):(Y.matrix.copy(gt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Q.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Yi*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(Y){l=Y,f!==null&&(f.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(Y){return d[Y]};let Zt=null;function re(Y,Q){if(u=Q.getViewerPose(c||o),g=Q,u!==null){let gt=u.views;p!==null&&(t.setRenderTargetFramebuffer(M,p.framebuffer),t.setRenderTarget(M));let It=!1;gt.length!==F.cameras.length&&(F.cameras.length=0,It=!0);for(let R=0;R<gt.length;R++){let it=gt[R],ft=null;if(p!==null)ft=p.getViewport(it);else{let ut=h.getViewSubImage(f,it);ft=ut.viewport,R===0&&(t.setRenderTargetTextures(M,ut.colorTexture,ut.depthStencilTexture),t.setRenderTarget(M))}let st=P[R];st===void 0&&(st=new Ee,st.layers.enable(R),st.viewport=new Jt,P[R]=st),st.matrix.fromArray(it.transform.matrix),st.matrix.decompose(st.position,st.quaternion,st.scale),st.projectionMatrix.fromArray(it.projectionMatrix),st.projectionMatrixInverse.copy(st.projectionMatrix).invert(),st.viewport.set(ft.x,ft.y,ft.width,ft.height),R===0&&(F.matrix.copy(st.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),It===!0&&F.cameras.push(st)}let Mt=s.enabledFeatures;if(Mt&&Mt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){h=n.getBinding();let R=h.getDepthInformation(gt[0]);R&&R.isValid&&R.texture&&m.init(R,s.renderState)}if(Mt&&Mt.includes("camera-access")&&x){t.state.unbindTexture(),h=n.getBinding();for(let R=0;R<gt.length;R++){let it=gt[R].camera;if(it){let ft=d[it];ft||(ft=new ks,d[it]=ft);let st=h.getCameraImage(it);ft.sourceTexture=st}}}}for(let gt=0;gt<C.length;gt++){let It=w[gt],Mt=C[gt];It!==null&&Mt!==void 0&&Mt.update(It,Q,c||o)}Zt&&Zt(Y,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}let qt=new kh;qt.setAnimationLoop(re),this.setAnimationLoop=function(Y){Zt=Y},this.dispose=function(){}}},yi=new tn,Qg=new se;function Zg(i,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,yc(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,S,E,M){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),h(m,d)):d.isMeshPhongMaterial?(r(m,d),u(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,M)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),x(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?l(m,d,S,E):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Ie&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Ie&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let S=t.get(d),E=S.envMap,M=S.envMapRotation;E&&(m.envMap.value=E,yi.copy(M),yi.x*=-1,yi.y*=-1,yi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(yi.y*=-1,yi.z*=-1),m.envMapRotation.value.setFromMatrix4(Qg.makeRotationFromEuler(yi)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,S,E){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*S,m.scale.value=E*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function h(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,S){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ie&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function x(m,d){let S=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Kg(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,E){let M=E.program;n.uniformBlockBinding(S,M)}function c(S,E){let M=s[S.id];M===void 0&&(g(S),M=u(S),s[S.id]=M,S.addEventListener("dispose",m));let C=E.program;n.updateUBOMapping(S,C);let w=t.render.frame;r[S.id]!==w&&(f(S),r[S.id]=w)}function u(S){let E=h();S.__bindingPointIndex=E;let M=i.createBuffer(),C=S.__size,w=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,C,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,M),M}function h(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){let E=s[S.id],M=S.uniforms,C=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let w=0,I=M.length;w<I;w++){let N=Array.isArray(M[w])?M[w]:[M[w]];for(let b=0,A=N.length;b<A;b++){let P=N[b];if(p(P,w,b,C)===!0){let F=P.__offset,H=Array.isArray(P.value)?P.value:[P.value],X=0;for(let q=0;q<H.length;q++){let G=H[q],et=x(G);typeof G=="number"||typeof G=="boolean"?(P.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,F+X,P.__data)):G.isMatrix3?(P.__data[0]=G.elements[0],P.__data[1]=G.elements[1],P.__data[2]=G.elements[2],P.__data[3]=0,P.__data[4]=G.elements[3],P.__data[5]=G.elements[4],P.__data[6]=G.elements[5],P.__data[7]=0,P.__data[8]=G.elements[6],P.__data[9]=G.elements[7],P.__data[10]=G.elements[8],P.__data[11]=0):(G.toArray(P.__data,X),X+=et.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(S,E,M,C){let w=S.value,I=E+"_"+M;if(C[I]===void 0)return typeof w=="number"||typeof w=="boolean"?C[I]=w:C[I]=w.clone(),!0;{let N=C[I];if(typeof w=="number"||typeof w=="boolean"){if(N!==w)return C[I]=w,!0}else if(N.equals(w)===!1)return N.copy(w),!0}return!1}function g(S){let E=S.uniforms,M=0,C=16;for(let I=0,N=E.length;I<N;I++){let b=Array.isArray(E[I])?E[I]:[E[I]];for(let A=0,P=b.length;A<P;A++){let F=b[A],H=Array.isArray(F.value)?F.value:[F.value];for(let X=0,q=H.length;X<q;X++){let G=H[X],et=x(G),k=M%C,ot=k%et.boundary,lt=k+ot;M+=ot,lt!==0&&C-lt<et.storage&&(M+=C-lt),F.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=et.storage}}}let w=M%C;return w>0&&(M+=C-w),S.__size=M,S.__cache={},this}function x(S){let E={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(E.boundary=4,E.storage=4):S.isVector2?(E.boundary=8,E.storage=8):S.isVector3||S.isColor?(E.boundary=16,E.storage=12):S.isVector4?(E.boundary=16,E.storage=16):S.isMatrix3?(E.boundary=48,E.storage=48):S.isMatrix4?(E.boundary=64,E.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),E}function m(S){let E=S.target;E.removeEventListener("dispose",m);let M=o.indexOf(E.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function d(){for(let S in s)i.deleteBuffer(s[S]);o=[],s={},r={}}return{bind:l,update:c,dispose:d}}var ra=class{constructor(t={}){let{canvas:e=fh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),x=new Int32Array(4),m=null,d=null,S=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=pn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let M=this,C=!1;this._outputColorSpace=ie;let w=0,I=0,N=null,b=-1,A=null,P=new Jt,F=new Jt,H=null,X=new Rt(0),q=0,G=e.width,et=e.height,k=1,ot=null,lt=null,_t=new Jt(0,0,G,et),Nt=new Jt(0,0,G,et),Zt=!1,re=new $i,qt=!1,Y=!1,Q=new se,gt=new T,It=new Jt,Mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},kt=!1;function ge(){return N===null?k:1}let R=n;function it(y,L){return e.getContext(y,L)}try{let y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",xt,!1),e.addEventListener("webglcontextcreationerror",K,!1),R===null){let L="webgl2";if(R=it(L,y),R===null)throw it(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let ft,st,ut,Ft,pt,Ut,Gt,fe,_,v,B,W,Z,V,wt,nt,At,Et,$,dt,Dt,bt,ct,Ht;function D(){ft=new mm(R),ft.init(),bt=new Yg(R,ft),st=new cm(R,ft,t,bt),ut=new Wg(R,ft),st.reversedDepthBuffer&&f&&ut.buffers.depth.setReversed(!0),Ft=new vm(R),pt=new Ig,Ut=new Xg(R,ft,ut,pt,st,bt,Ft),Gt=new hm(M),fe=new pm(M),_=new Ed(R),ct=new om(R,_),v=new gm(R,_,Ft,ct),B=new Mm(R,v,_,Ft),$=new ym(R,st,Ut),nt=new lm(pt),W=new Pg(M,Gt,fe,ft,st,ct,nt),Z=new Zg(M,pt),V=new Lg,wt=new zg(ft),Et=new rm(M,Gt,fe,ut,B,p,l),At=new Vg(M,B,st),Ht=new Kg(R,Ft,st,ut),dt=new am(R,ft,Ft),Dt=new xm(R,ft,Ft),Ft.programs=W.programs,M.capabilities=st,M.extensions=ft,M.properties=pt,M.renderLists=V,M.shadowMap=At,M.state=ut,M.info=Ft}D();let tt=new Fc(M,R);this.xr=tt,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let y=ft.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=ft.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(y){y!==void 0&&(k=y,this.setSize(G,et,!1))},this.getSize=function(y){return y.set(G,et)},this.setSize=function(y,L,O=!0){if(tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=y,et=L,e.width=Math.floor(y*k),e.height=Math.floor(L*k),O===!0&&(e.style.width=y+"px",e.style.height=L+"px"),this.setViewport(0,0,y,L)},this.getDrawingBufferSize=function(y){return y.set(G*k,et*k).floor()},this.setDrawingBufferSize=function(y,L,O){G=y,et=L,k=O,e.width=Math.floor(y*O),e.height=Math.floor(L*O),this.setViewport(0,0,y,L)},this.getCurrentViewport=function(y){return y.copy(P)},this.getViewport=function(y){return y.copy(_t)},this.setViewport=function(y,L,O,z){y.isVector4?_t.set(y.x,y.y,y.z,y.w):_t.set(y,L,O,z),ut.viewport(P.copy(_t).multiplyScalar(k).round())},this.getScissor=function(y){return y.copy(Nt)},this.setScissor=function(y,L,O,z){y.isVector4?Nt.set(y.x,y.y,y.z,y.w):Nt.set(y,L,O,z),ut.scissor(F.copy(Nt).multiplyScalar(k).round())},this.getScissorTest=function(){return Zt},this.setScissorTest=function(y){ut.setScissorTest(Zt=y)},this.setOpaqueSort=function(y){ot=y},this.setTransparentSort=function(y){lt=y},this.getClearColor=function(y){return y.copy(Et.getClearColor())},this.setClearColor=function(){Et.setClearColor(...arguments)},this.getClearAlpha=function(){return Et.getClearAlpha()},this.setClearAlpha=function(){Et.setClearAlpha(...arguments)},this.clear=function(y=!0,L=!0,O=!0){let z=0;if(y){let U=!1;if(N!==null){let J=N.texture.format;U=J===bo||J===Eo||J===So}if(U){let J=N.texture.type,ht=J===mn||J===Jn||J===ss||J===os||J===Mo||J===Ao,vt=Et.getClearColor(),mt=Et.getClearAlpha(),Pt=vt.r,Lt=vt.g,Tt=vt.b;ht?(g[0]=Pt,g[1]=Lt,g[2]=Tt,g[3]=mt,R.clearBufferuiv(R.COLOR,0,g)):(x[0]=Pt,x[1]=Lt,x[2]=Tt,x[3]=mt,R.clearBufferiv(R.COLOR,0,x))}else z|=R.COLOR_BUFFER_BIT}L&&(z|=R.DEPTH_BUFFER_BIT),O&&(z|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",xt,!1),e.removeEventListener("webglcontextcreationerror",K,!1),Et.dispose(),V.dispose(),wt.dispose(),pt.dispose(),Gt.dispose(),fe.dispose(),B.dispose(),ct.dispose(),Ht.dispose(),W.dispose(),tt.dispose(),tt.removeEventListener("sessionstart",gn),tt.removeEventListener("sessionend",Xc),ei.stop()};function rt(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function xt(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let y=Ft.autoReset,L=At.enabled,O=At.autoUpdate,z=At.needsUpdate,U=At.type;D(),Ft.autoReset=y,At.enabled=L,At.autoUpdate=O,At.needsUpdate=z,At.type=U}function K(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function j(y){let L=y.target;L.removeEventListener("dispose",j),yt(L)}function yt(y){Bt(y),pt.remove(y)}function Bt(y){let L=pt.get(y).programs;L!==void 0&&(L.forEach(function(O){W.releaseProgram(O)}),y.isShaderMaterial&&W.releaseShaderCache(y))}this.renderBufferDirect=function(y,L,O,z,U,J){L===null&&(L=Mt);let ht=U.isMesh&&U.matrixWorld.determinant()<0,vt=xu(y,L,O,z,U);ut.setMaterial(z,ht);let mt=O.index,Pt=1;if(z.wireframe===!0){if(mt=v.getWireframeAttribute(O),mt===void 0)return;Pt=2}let Lt=O.drawRange,Tt=O.attributes.position,Yt=Lt.start*Pt,te=(Lt.start+Lt.count)*Pt;J!==null&&(Yt=Math.max(Yt,J.start*Pt),te=Math.min(te,(J.start+J.count)*Pt)),mt!==null?(Yt=Math.max(Yt,0),te=Math.min(te,mt.count)):Tt!=null&&(Yt=Math.max(Yt,0),te=Math.min(te,Tt.count));let de=te-Yt;if(de<0||de===1/0)return;ct.setup(U,z,vt,O,mt);let ce,ne=dt;if(mt!==null&&(ce=_.get(mt),ne=Dt,ne.setIndex(ce)),U.isMesh)z.wireframe===!0?(ut.setLineWidth(z.wireframeLinewidth*ge()),ne.setMode(R.LINES)):ne.setMode(R.TRIANGLES);else if(U.isLine){let Ct=z.linewidth;Ct===void 0&&(Ct=1),ut.setLineWidth(Ct*ge()),U.isLineSegments?ne.setMode(R.LINES):U.isLineLoop?ne.setMode(R.LINE_LOOP):ne.setMode(R.LINE_STRIP)}else U.isPoints?ne.setMode(R.POINTS):U.isSprite&&ne.setMode(R.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)ji("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ne.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(ft.get("WEBGL_multi_draw"))ne.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{let Ct=U._multiDrawStarts,he=U._multiDrawCounts,jt=U._multiDrawCount,Oe=mt?_.get(mt).bytesPerElement:1,bi=pt.get(z).currentProgram.getUniforms();for(let ze=0;ze<jt;ze++)bi.setValue(R,"_gl_DrawID",ze),ne.render(Ct[ze]/Oe,he[ze])}else if(U.isInstancedMesh)ne.renderInstances(Yt,de,U.count);else if(O.isInstancedBufferGeometry){let Ct=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,he=Math.min(O.instanceCount,Ct);ne.renderInstances(Yt,de,he)}else ne.render(Yt,de)};function oe(y,L,O){y.transparent===!0&&y.side===Ye&&y.forceSinglePass===!1?(y.side=Ie,y.needsUpdate=!0,cr(y,L,O),y.side=Ve,y.needsUpdate=!0,cr(y,L,O),y.side=Ye):cr(y,L,O)}this.compile=function(y,L,O=null){O===null&&(O=y),d=wt.get(O),d.init(L),E.push(d),O.traverseVisible(function(U){U.isLight&&U.layers.test(L.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),y!==O&&y.traverseVisible(function(U){U.isLight&&U.layers.test(L.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),d.setupLights();let z=new Set;return y.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;let J=U.material;if(J)if(Array.isArray(J))for(let ht=0;ht<J.length;ht++){let vt=J[ht];oe(vt,O,U),z.add(vt)}else oe(J,O,U),z.add(J)}),d=E.pop(),z},this.compileAsync=function(y,L,O=null){let z=this.compile(y,L,O);return new Promise(U=>{function J(){if(z.forEach(function(ht){pt.get(ht).currentProgram.isReady()&&z.delete(ht)}),z.size===0){U(y);return}setTimeout(J,10)}ft.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)})};let Qt=null;function bn(y){Qt&&Qt(y)}function gn(){ei.stop()}function Xc(){ei.start()}let ei=new kh;ei.setAnimationLoop(bn),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(y){Qt=y,tt.setAnimationLoop(y),y===null?ei.stop():ei.start()},tt.addEventListener("sessionstart",gn),tt.addEventListener("sessionend",Xc),this.render=function(y,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),tt.enabled===!0&&tt.isPresenting===!0&&(tt.cameraAutoUpdate===!0&&tt.updateCamera(L),L=tt.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,L,N),d=wt.get(y,E.length),d.init(L),E.push(d),Q.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),re.setFromProjectionMatrix(Q,cn,L.reversedDepth),Y=this.localClippingEnabled,qt=nt.init(this.clippingPlanes,Y),m=V.get(y,S.length),m.init(),S.push(m),tt.enabled===!0&&tt.isPresenting===!0){let J=M.xr.getDepthSensingMesh();J!==null&&ya(J,L,-1/0,M.sortObjects)}ya(y,L,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(ot,lt),kt=tt.enabled===!1||tt.isPresenting===!1||tt.hasDepthSensing()===!1,kt&&Et.addToRenderList(m,y),this.info.render.frame++,qt===!0&&nt.beginShadows();let O=d.state.shadowsArray;At.render(O,y,L),qt===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();let z=m.opaque,U=m.transmissive;if(d.setupLights(),L.isArrayCamera){let J=L.cameras;if(U.length>0)for(let ht=0,vt=J.length;ht<vt;ht++){let mt=J[ht];qc(z,U,y,mt)}kt&&Et.render(y);for(let ht=0,vt=J.length;ht<vt;ht++){let mt=J[ht];Yc(m,y,mt,mt.viewport)}}else U.length>0&&qc(z,U,y,L),kt&&Et.render(y),Yc(m,y,L);N!==null&&I===0&&(Ut.updateMultisampleRenderTarget(N),Ut.updateRenderTargetMipmap(N)),y.isScene===!0&&y.onAfterRender(M,y,L),ct.resetDefaultState(),b=-1,A=null,E.pop(),E.length>0?(d=E[E.length-1],qt===!0&&nt.setGlobalState(M.clippingPlanes,d.state.camera)):d=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function ya(y,L,O,z){if(y.visible===!1)return;if(y.layers.test(L.layers)){if(y.isGroup)O=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(L);else if(y.isLight)d.pushLight(y),y.castShadow&&d.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||re.intersectsSprite(y)){z&&It.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Q);let ht=B.update(y),vt=y.material;vt.visible&&m.push(y,ht,vt,O,It.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||re.intersectsObject(y))){let ht=B.update(y),vt=y.material;if(z&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),It.copy(y.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),It.copy(ht.boundingSphere.center)),It.applyMatrix4(y.matrixWorld).applyMatrix4(Q)),Array.isArray(vt)){let mt=ht.groups;for(let Pt=0,Lt=mt.length;Pt<Lt;Pt++){let Tt=mt[Pt],Yt=vt[Tt.materialIndex];Yt&&Yt.visible&&m.push(y,ht,Yt,O,It.z,Tt)}}else vt.visible&&m.push(y,ht,vt,O,It.z,null)}}let J=y.children;for(let ht=0,vt=J.length;ht<vt;ht++)ya(J[ht],L,O,z)}function Yc(y,L,O,z){let U=y.opaque,J=y.transmissive,ht=y.transparent;d.setupLightsView(O),qt===!0&&nt.setGlobalState(M.clippingPlanes,O),z&&ut.viewport(P.copy(z)),U.length>0&&ar(U,L,O),J.length>0&&ar(J,L,O),ht.length>0&&ar(ht,L,O),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function qc(y,L,O,z){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[z.id]===void 0&&(d.state.transmissionRenderTarget[z.id]=new vn(1,1,{generateMipmaps:!0,type:ft.has("EXT_color_buffer_half_float")||ft.has("EXT_color_buffer_float")?rs:mn,minFilter:Kn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Wt.workingColorSpace}));let J=d.state.transmissionRenderTarget[z.id],ht=z.viewport||P;J.setSize(ht.z*M.transmissionResolutionScale,ht.w*M.transmissionResolutionScale);let vt=M.getRenderTarget(),mt=M.getActiveCubeFace(),Pt=M.getActiveMipmapLevel();M.setRenderTarget(J),M.getClearColor(X),q=M.getClearAlpha(),q<1&&M.setClearColor(16777215,.5),M.clear(),kt&&Et.render(O);let Lt=M.toneMapping;M.toneMapping=pn;let Tt=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),d.setupLightsView(z),qt===!0&&nt.setGlobalState(M.clippingPlanes,z),ar(y,O,z),Ut.updateMultisampleRenderTarget(J),Ut.updateRenderTargetMipmap(J),ft.has("WEBGL_multisampled_render_to_texture")===!1){let Yt=!1;for(let te=0,de=L.length;te<de;te++){let ce=L[te],ne=ce.object,Ct=ce.geometry,he=ce.material,jt=ce.group;if(he.side===Ye&&ne.layers.test(z.layers)){let Oe=he.side;he.side=Ie,he.needsUpdate=!0,jc(ne,O,z,Ct,he,jt),he.side=Oe,he.needsUpdate=!0,Yt=!0}}Yt===!0&&(Ut.updateMultisampleRenderTarget(J),Ut.updateRenderTargetMipmap(J))}M.setRenderTarget(vt,mt,Pt),M.setClearColor(X,q),Tt!==void 0&&(z.viewport=Tt),M.toneMapping=Lt}function ar(y,L,O){let z=L.isScene===!0?L.overrideMaterial:null;for(let U=0,J=y.length;U<J;U++){let ht=y[U],vt=ht.object,mt=ht.geometry,Pt=ht.group,Lt=ht.material;Lt.allowOverride===!0&&z!==null&&(Lt=z),vt.layers.test(O.layers)&&jc(vt,L,O,mt,Lt,Pt)}}function jc(y,L,O,z,U,J){y.onBeforeRender(M,L,O,z,U,J),y.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),U.onBeforeRender(M,L,O,z,y,J),U.transparent===!0&&U.side===Ye&&U.forceSinglePass===!1?(U.side=Ie,U.needsUpdate=!0,M.renderBufferDirect(O,L,z,U,y,J),U.side=Ve,U.needsUpdate=!0,M.renderBufferDirect(O,L,z,U,y,J),U.side=Ye):M.renderBufferDirect(O,L,z,U,y,J),y.onAfterRender(M,L,O,z,U,J)}function cr(y,L,O){L.isScene!==!0&&(L=Mt);let z=pt.get(y),U=d.state.lights,J=d.state.shadowsArray,ht=U.state.version,vt=W.getParameters(y,U.state,J,L,O),mt=W.getProgramCacheKey(vt),Pt=z.programs;z.environment=y.isMeshStandardMaterial?L.environment:null,z.fog=L.fog,z.envMap=(y.isMeshStandardMaterial?fe:Gt).get(y.envMap||z.environment),z.envMapRotation=z.environment!==null&&y.envMap===null?L.environmentRotation:y.envMapRotation,Pt===void 0&&(y.addEventListener("dispose",j),Pt=new Map,z.programs=Pt);let Lt=Pt.get(mt);if(Lt!==void 0){if(z.currentProgram===Lt&&z.lightsStateVersion===ht)return Zc(y,vt),Lt}else vt.uniforms=W.getUniforms(y),y.onBeforeCompile(vt,M),Lt=W.acquireProgram(vt,mt),Pt.set(mt,Lt),z.uniforms=vt.uniforms;let Tt=z.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Tt.clippingPlanes=nt.uniform),Zc(y,vt),z.needsLights=yu(y),z.lightsStateVersion=ht,z.needsLights&&(Tt.ambientLightColor.value=U.state.ambient,Tt.lightProbe.value=U.state.probe,Tt.directionalLights.value=U.state.directional,Tt.directionalLightShadows.value=U.state.directionalShadow,Tt.spotLights.value=U.state.spot,Tt.spotLightShadows.value=U.state.spotShadow,Tt.rectAreaLights.value=U.state.rectArea,Tt.ltc_1.value=U.state.rectAreaLTC1,Tt.ltc_2.value=U.state.rectAreaLTC2,Tt.pointLights.value=U.state.point,Tt.pointLightShadows.value=U.state.pointShadow,Tt.hemisphereLights.value=U.state.hemi,Tt.directionalShadowMap.value=U.state.directionalShadowMap,Tt.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Tt.spotShadowMap.value=U.state.spotShadowMap,Tt.spotLightMatrix.value=U.state.spotLightMatrix,Tt.spotLightMap.value=U.state.spotLightMap,Tt.pointShadowMap.value=U.state.pointShadowMap,Tt.pointShadowMatrix.value=U.state.pointShadowMatrix),z.currentProgram=Lt,z.uniformsList=null,Lt}function Qc(y){if(y.uniformsList===null){let L=y.currentProgram.getUniforms();y.uniformsList=hs.seqWithValue(L.seq,y.uniforms)}return y.uniformsList}function Zc(y,L){let O=pt.get(y);O.outputColorSpace=L.outputColorSpace,O.batching=L.batching,O.batchingColor=L.batchingColor,O.instancing=L.instancing,O.instancingColor=L.instancingColor,O.instancingMorph=L.instancingMorph,O.skinning=L.skinning,O.morphTargets=L.morphTargets,O.morphNormals=L.morphNormals,O.morphColors=L.morphColors,O.morphTargetsCount=L.morphTargetsCount,O.numClippingPlanes=L.numClippingPlanes,O.numIntersection=L.numClipIntersection,O.vertexAlphas=L.vertexAlphas,O.vertexTangents=L.vertexTangents,O.toneMapping=L.toneMapping}function xu(y,L,O,z,U){L.isScene!==!0&&(L=Mt),Ut.resetTextureUnits();let J=L.fog,ht=z.isMeshStandardMaterial?L.environment:null,vt=N===null?M.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:li,mt=(z.isMeshStandardMaterial?fe:Gt).get(z.envMap||ht),Pt=z.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,Lt=!!O.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Tt=!!O.morphAttributes.position,Yt=!!O.morphAttributes.normal,te=!!O.morphAttributes.color,de=pn;z.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(de=M.toneMapping);let ce=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,ne=ce!==void 0?ce.length:0,Ct=pt.get(z),he=d.state.lights;if(qt===!0&&(Y===!0||y!==A)){let Ce=y===A&&z.id===b;nt.setState(z,y,Ce)}let jt=!1;z.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==he.state.version||Ct.outputColorSpace!==vt||U.isBatchedMesh&&Ct.batching===!1||!U.isBatchedMesh&&Ct.batching===!0||U.isBatchedMesh&&Ct.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ct.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ct.instancing===!1||!U.isInstancedMesh&&Ct.instancing===!0||U.isSkinnedMesh&&Ct.skinning===!1||!U.isSkinnedMesh&&Ct.skinning===!0||U.isInstancedMesh&&Ct.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ct.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ct.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ct.instancingMorph===!1&&U.morphTexture!==null||Ct.envMap!==mt||z.fog===!0&&Ct.fog!==J||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==nt.numPlanes||Ct.numIntersection!==nt.numIntersection)||Ct.vertexAlphas!==Pt||Ct.vertexTangents!==Lt||Ct.morphTargets!==Tt||Ct.morphNormals!==Yt||Ct.morphColors!==te||Ct.toneMapping!==de||Ct.morphTargetsCount!==ne)&&(jt=!0):(jt=!0,Ct.__version=z.version);let Oe=Ct.currentProgram;jt===!0&&(Oe=cr(z,L,U));let bi=!1,ze=!1,gs=!1,ue=Oe.getUniforms(),je=Ct.uniforms;if(ut.useProgram(Oe.program)&&(bi=!0,ze=!0,gs=!0),z.id!==b&&(b=z.id,ze=!0),bi||A!==y){ut.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ue.setValue(R,"projectionMatrix",y.projectionMatrix),ue.setValue(R,"viewMatrix",y.matrixWorldInverse);let De=ue.map.cameraPosition;De!==void 0&&De.setValue(R,gt.setFromMatrixPosition(y.matrixWorld)),st.logarithmicDepthBuffer&&ue.setValue(R,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ue.setValue(R,"isOrthographic",y.isOrthographicCamera===!0),A!==y&&(A=y,ze=!0,gs=!0)}if(U.isSkinnedMesh){ue.setOptional(R,U,"bindMatrix"),ue.setOptional(R,U,"bindMatrixInverse");let Ce=U.skeleton;Ce&&(Ce.boneTexture===null&&Ce.computeBoneTexture(),ue.setValue(R,"boneTexture",Ce.boneTexture,Ut))}U.isBatchedMesh&&(ue.setOptional(R,U,"batchingTexture"),ue.setValue(R,"batchingTexture",U._matricesTexture,Ut),ue.setOptional(R,U,"batchingIdTexture"),ue.setValue(R,"batchingIdTexture",U._indirectTexture,Ut),ue.setOptional(R,U,"batchingColorTexture"),U._colorsTexture!==null&&ue.setValue(R,"batchingColorTexture",U._colorsTexture,Ut));let Qe=O.morphAttributes;if((Qe.position!==void 0||Qe.normal!==void 0||Qe.color!==void 0)&&$.update(U,O,Oe),(ze||Ct.receiveShadow!==U.receiveShadow)&&(Ct.receiveShadow=U.receiveShadow,ue.setValue(R,"receiveShadow",U.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(je.envMap.value=mt,je.flipEnvMap.value=mt.isCubeTexture&&mt.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&L.environment!==null&&(je.envMapIntensity.value=L.environmentIntensity),ze&&(ue.setValue(R,"toneMappingExposure",M.toneMappingExposure),Ct.needsLights&&vu(je,gs),J&&z.fog===!0&&Z.refreshFogUniforms(je,J),Z.refreshMaterialUniforms(je,z,k,et,d.state.transmissionRenderTarget[y.id]),hs.upload(R,Qc(Ct),je,Ut)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(hs.upload(R,Qc(Ct),je,Ut),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ue.setValue(R,"center",U.center),ue.setValue(R,"modelViewMatrix",U.modelViewMatrix),ue.setValue(R,"normalMatrix",U.normalMatrix),ue.setValue(R,"modelMatrix",U.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){let Ce=z.uniformsGroups;for(let De=0,Ma=Ce.length;De<Ma;De++){let ni=Ce[De];Ht.update(ni,Oe),Ht.bind(ni,Oe)}}return Oe}function vu(y,L){y.ambientLightColor.needsUpdate=L,y.lightProbe.needsUpdate=L,y.directionalLights.needsUpdate=L,y.directionalLightShadows.needsUpdate=L,y.pointLights.needsUpdate=L,y.pointLightShadows.needsUpdate=L,y.spotLights.needsUpdate=L,y.spotLightShadows.needsUpdate=L,y.rectAreaLights.needsUpdate=L,y.hemisphereLights.needsUpdate=L}function yu(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(y,L,O){let z=pt.get(y);z.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),pt.get(y.texture).__webglTexture=L,pt.get(y.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:O,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,L){let O=pt.get(y);O.__webglFramebuffer=L,O.__useDefaultFramebuffer=L===void 0};let Mu=R.createFramebuffer();this.setRenderTarget=function(y,L=0,O=0){N=y,w=L,I=O;let z=!0,U=null,J=!1,ht=!1;if(y){let mt=pt.get(y);if(mt.__useDefaultFramebuffer!==void 0)ut.bindFramebuffer(R.FRAMEBUFFER,null),z=!1;else if(mt.__webglFramebuffer===void 0)Ut.setupRenderTarget(y);else if(mt.__hasExternalTextures)Ut.rebindTextures(y,pt.get(y.texture).__webglTexture,pt.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let Tt=y.depthTexture;if(mt.__boundDepthTexture!==Tt){if(Tt!==null&&pt.has(Tt)&&(y.width!==Tt.image.width||y.height!==Tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ut.setupDepthRenderbuffer(y)}}let Pt=y.texture;(Pt.isData3DTexture||Pt.isDataArrayTexture||Pt.isCompressedArrayTexture)&&(ht=!0);let Lt=pt.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Lt[L])?U=Lt[L][O]:U=Lt[L],J=!0):y.samples>0&&Ut.useMultisampledRTT(y)===!1?U=pt.get(y).__webglMultisampledFramebuffer:Array.isArray(Lt)?U=Lt[O]:U=Lt,P.copy(y.viewport),F.copy(y.scissor),H=y.scissorTest}else P.copy(_t).multiplyScalar(k).floor(),F.copy(Nt).multiplyScalar(k).floor(),H=Zt;if(O!==0&&(U=Mu),ut.bindFramebuffer(R.FRAMEBUFFER,U)&&z&&ut.drawBuffers(y,U),ut.viewport(P),ut.scissor(F),ut.setScissorTest(H),J){let mt=pt.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+L,mt.__webglTexture,O)}else if(ht){let mt=L;for(let Pt=0;Pt<y.textures.length;Pt++){let Lt=pt.get(y.textures[Pt]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+Pt,Lt.__webglTexture,O,mt)}}else if(y!==null&&O!==0){let mt=pt.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,mt.__webglTexture,O)}b=-1},this.readRenderTargetPixels=function(y,L,O,z,U,J,ht,vt=0){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let mt=pt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ht!==void 0&&(mt=mt[ht]),mt){ut.bindFramebuffer(R.FRAMEBUFFER,mt);try{let Pt=y.textures[vt],Lt=Pt.format,Tt=Pt.type;if(!st.textureFormatReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!st.textureTypeReadable(Tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=y.width-z&&O>=0&&O<=y.height-U&&(y.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+vt),R.readPixels(L,O,z,U,bt.convert(Lt),bt.convert(Tt),J))}finally{let Pt=N!==null?pt.get(N).__webglFramebuffer:null;ut.bindFramebuffer(R.FRAMEBUFFER,Pt)}}},this.readRenderTargetPixelsAsync=async function(y,L,O,z,U,J,ht,vt=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let mt=pt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ht!==void 0&&(mt=mt[ht]),mt)if(L>=0&&L<=y.width-z&&O>=0&&O<=y.height-U){ut.bindFramebuffer(R.FRAMEBUFFER,mt);let Pt=y.textures[vt],Lt=Pt.format,Tt=Pt.type;if(!st.textureFormatReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!st.textureTypeReadable(Tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Yt=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Yt),R.bufferData(R.PIXEL_PACK_BUFFER,J.byteLength,R.STREAM_READ),y.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+vt),R.readPixels(L,O,z,U,bt.convert(Lt),bt.convert(Tt),0);let te=N!==null?pt.get(N).__webglFramebuffer:null;ut.bindFramebuffer(R.FRAMEBUFFER,te);let de=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await ph(R,de,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Yt),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,J),R.deleteBuffer(Yt),R.deleteSync(de),J}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,L=null,O=0){let z=Math.pow(2,-O),U=Math.floor(y.image.width*z),J=Math.floor(y.image.height*z),ht=L!==null?L.x:0,vt=L!==null?L.y:0;Ut.setTexture2D(y,0),R.copyTexSubImage2D(R.TEXTURE_2D,O,0,0,ht,vt,U,J),ut.unbindTexture()};let Au=R.createFramebuffer(),Su=R.createFramebuffer();this.copyTextureToTexture=function(y,L,O=null,z=null,U=0,J=null){J===null&&(U!==0?(ji("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),J=U,U=0):J=0);let ht,vt,mt,Pt,Lt,Tt,Yt,te,de,ce=y.isCompressedTexture?y.mipmaps[J]:y.image;if(O!==null)ht=O.max.x-O.min.x,vt=O.max.y-O.min.y,mt=O.isBox3?O.max.z-O.min.z:1,Pt=O.min.x,Lt=O.min.y,Tt=O.isBox3?O.min.z:0;else{let Qe=Math.pow(2,-U);ht=Math.floor(ce.width*Qe),vt=Math.floor(ce.height*Qe),y.isDataArrayTexture?mt=ce.depth:y.isData3DTexture?mt=Math.floor(ce.depth*Qe):mt=1,Pt=0,Lt=0,Tt=0}z!==null?(Yt=z.x,te=z.y,de=z.z):(Yt=0,te=0,de=0);let ne=bt.convert(L.format),Ct=bt.convert(L.type),he;L.isData3DTexture?(Ut.setTexture3D(L,0),he=R.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(Ut.setTexture2DArray(L,0),he=R.TEXTURE_2D_ARRAY):(Ut.setTexture2D(L,0),he=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,L.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,L.unpackAlignment);let jt=R.getParameter(R.UNPACK_ROW_LENGTH),Oe=R.getParameter(R.UNPACK_IMAGE_HEIGHT),bi=R.getParameter(R.UNPACK_SKIP_PIXELS),ze=R.getParameter(R.UNPACK_SKIP_ROWS),gs=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,ce.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ce.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Pt),R.pixelStorei(R.UNPACK_SKIP_ROWS,Lt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Tt);let ue=y.isDataArrayTexture||y.isData3DTexture,je=L.isDataArrayTexture||L.isData3DTexture;if(y.isDepthTexture){let Qe=pt.get(y),Ce=pt.get(L),De=pt.get(Qe.__renderTarget),Ma=pt.get(Ce.__renderTarget);ut.bindFramebuffer(R.READ_FRAMEBUFFER,De.__webglFramebuffer),ut.bindFramebuffer(R.DRAW_FRAMEBUFFER,Ma.__webglFramebuffer);for(let ni=0;ni<mt;ni++)ue&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,pt.get(y).__webglTexture,U,Tt+ni),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,pt.get(L).__webglTexture,J,de+ni)),R.blitFramebuffer(Pt,Lt,ht,vt,Yt,te,ht,vt,R.DEPTH_BUFFER_BIT,R.NEAREST);ut.bindFramebuffer(R.READ_FRAMEBUFFER,null),ut.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(U!==0||y.isRenderTargetTexture||pt.has(y)){let Qe=pt.get(y),Ce=pt.get(L);ut.bindFramebuffer(R.READ_FRAMEBUFFER,Au),ut.bindFramebuffer(R.DRAW_FRAMEBUFFER,Su);for(let De=0;De<mt;De++)ue?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Qe.__webglTexture,U,Tt+De):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Qe.__webglTexture,U),je?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ce.__webglTexture,J,de+De):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Ce.__webglTexture,J),U!==0?R.blitFramebuffer(Pt,Lt,ht,vt,Yt,te,ht,vt,R.COLOR_BUFFER_BIT,R.NEAREST):je?R.copyTexSubImage3D(he,J,Yt,te,de+De,Pt,Lt,ht,vt):R.copyTexSubImage2D(he,J,Yt,te,Pt,Lt,ht,vt);ut.bindFramebuffer(R.READ_FRAMEBUFFER,null),ut.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else je?y.isDataTexture||y.isData3DTexture?R.texSubImage3D(he,J,Yt,te,de,ht,vt,mt,ne,Ct,ce.data):L.isCompressedArrayTexture?R.compressedTexSubImage3D(he,J,Yt,te,de,ht,vt,mt,ne,ce.data):R.texSubImage3D(he,J,Yt,te,de,ht,vt,mt,ne,Ct,ce):y.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,J,Yt,te,ht,vt,ne,Ct,ce.data):y.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,J,Yt,te,ce.width,ce.height,ne,ce.data):R.texSubImage2D(R.TEXTURE_2D,J,Yt,te,ht,vt,ne,Ct,ce);R.pixelStorei(R.UNPACK_ROW_LENGTH,jt),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Oe),R.pixelStorei(R.UNPACK_SKIP_PIXELS,bi),R.pixelStorei(R.UNPACK_SKIP_ROWS,ze),R.pixelStorei(R.UNPACK_SKIP_IMAGES,gs),J===0&&L.generateMipmaps&&R.generateMipmap(he),ut.unbindTexture()},this.initRenderTarget=function(y){pt.get(y).__webglFramebuffer===void 0&&Ut.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Ut.setTextureCube(y,0):y.isData3DTexture?Ut.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Ut.setTexture2DArray(y,0):Ut.setTexture2D(y,0),ut.unbindTexture()},this.resetState=function(){w=0,I=0,N=null,ut.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Wt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Wt._getUnpackColorSpace()}};var aa=class extends dn{constructor(t){super(t)}load(t,e,n,s){let r=this,o=this.path===""?js.extractUrlBase(t):this.path,a=new fi(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(l){try{e(r.parse(l,o))}catch(c){s?s(c):console.error(c),r.manager.itemError(t)}},n,s)}setMaterialOptions(t){return this.materialOptions=t,this}parse(t,e){let n=t.split(`
`),s={},r=/\s+/,o={};for(let l=0;l<n.length;l++){let c=n[l];if(c=c.trim(),c.length===0||c.charAt(0)==="#")continue;let u=c.indexOf(" "),h=u>=0?c.substring(0,u):c;h=h.toLowerCase();let f=u>=0?c.substring(u+1):"";if(f=f.trim(),h==="newmtl")s={name:f},o[f]=s;else if(h==="ka"||h==="kd"||h==="ks"||h==="ke"){let p=f.split(r,3);s[h]=[parseFloat(p[0]),parseFloat(p[1]),parseFloat(p[2])]}else s[h]=f}let a=new Oc(this.resourcePath||e,this.materialOptions);return a.setCrossOrigin(this.crossOrigin),a.setManager(this.manager),a.setMaterials(o),a}},Oc=class{constructor(t="",e={}){this.baseUrl=t,this.options=e,this.materialsInfo={},this.materials={},this.materialsArray=[],this.nameLookup={},this.crossOrigin="anonymous",this.side=this.options.side!==void 0?this.options.side:Ve,this.wrap=this.options.wrap!==void 0?this.options.wrap:Wi}setCrossOrigin(t){return this.crossOrigin=t,this}setManager(t){this.manager=t}setMaterials(t){this.materialsInfo=this.convert(t),this.materials={},this.materialsArray=[],this.nameLookup={}}convert(t){if(!this.options)return t;let e={};for(let n in t){let s=t[n],r={};e[n]=r;for(let o in s){let a=!0,l=s[o],c=o.toLowerCase();switch(c){case"kd":case"ka":case"ks":this.options&&this.options.normalizeRGB&&(l=[l[0]/255,l[1]/255,l[2]/255]),this.options&&this.options.ignoreZeroRGBs&&l[0]===0&&l[1]===0&&l[2]===0&&(a=!1);break;default:break}a&&(r[c]=l)}}return e}preload(){for(let t in this.materialsInfo)this.create(t)}getIndex(t){return this.nameLookup[t]}getAsArray(){let t=0;for(let e in this.materialsInfo)this.materialsArray[t]=this.create(e),this.nameLookup[e]=t,t++;return this.materialsArray}create(t){return this.materials[t]===void 0&&this.createMaterial_(t),this.materials[t]}createMaterial_(t){let e=this,n=this.materialsInfo[t],s={name:t,side:this.side};function r(a,l){return typeof l!="string"||l===""?"":/^https?:\/\//i.test(l)?l:a+l}function o(a,l){if(s[a])return;let c=e.getTextureParams(l,s),u=e.loadTexture(r(e.baseUrl,c.url));u.repeat.copy(c.scale),u.offset.copy(c.offset),u.wrapS=e.wrap,u.wrapT=e.wrap,(a==="map"||a==="emissiveMap")&&(u.colorSpace=ie),s[a]=u}for(let a in n){let l=n[a],c;if(l!=="")switch(a.toLowerCase()){case"kd":s.color=Wt.colorSpaceToWorking(new Rt().fromArray(l),ie);break;case"ks":s.specular=Wt.colorSpaceToWorking(new Rt().fromArray(l),ie);break;case"ke":s.emissive=Wt.colorSpaceToWorking(new Rt().fromArray(l),ie);break;case"map_kd":o("map",l);break;case"map_ks":o("specularMap",l);break;case"map_ke":o("emissiveMap",l);break;case"norm":o("normalMap",l);break;case"map_bump":case"bump":o("bumpMap",l);break;case"disp":o("displacementMap",l);break;case"map_d":o("alphaMap",l),s.transparent=!0;break;case"ns":s.shininess=parseFloat(l);break;case"d":c=parseFloat(l),c<1&&(s.opacity=c,s.transparent=!0);break;case"tr":c=parseFloat(l),this.options&&this.options.invertTrProperty&&(c=1-c),c>0&&(s.opacity=1-c,s.transparent=!0);break;default:break}}return this.materials[t]=new ui(s),this.materials[t]}getTextureParams(t,e){let n={scale:new St(1,1),offset:new St(0,0)},s=t.split(/\s+/),r;return r=s.indexOf("-bm"),r>=0&&(e.bumpScale=parseFloat(s[r+1]),s.splice(r,2)),r=s.indexOf("-mm"),r>=0&&(e.displacementBias=parseFloat(s[r+1]),e.displacementScale=parseFloat(s[r+2]),s.splice(r,3)),r=s.indexOf("-s"),r>=0&&(n.scale.set(parseFloat(s[r+1]),parseFloat(s[r+2])),s.splice(r,4)),r=s.indexOf("-o"),r>=0&&(n.offset.set(parseFloat(s[r+1]),parseFloat(s[r+2])),s.splice(r,4)),n.url=s.join(" ").trim(),n}loadTexture(t,e,n,s,r){let o=this.manager!==void 0?this.manager:ta,a=o.getHandler(t);a===null&&(a=new Xe(o)),a.setCrossOrigin&&a.setCrossOrigin(this.crossOrigin);let l=a.load(t,n,s,r);return e!==void 0&&(l.mapping=e),l}};var Jg=/^[og]\s*(.+)?/,$g=/^mtllib /,tx=/^usemtl /,ex=/^usemap /,qh=/\s+/,jh=new T,zc=new T,Qh=new T,Zh=new T,nn=new T,ca=new Rt;function nx(){let i={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&this.object.fromDeclaration===!1){this.object.name=t,this.object.fromDeclaration=e!==!1;return}let n=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:e!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(s,r){let o=this._finalize(!1);o&&(o.inherited||o.groupCount<=0)&&this.materials.splice(o.index,1);let a={index:this.materials.length,name:s||"",mtllib:Array.isArray(r)&&r.length>0?r[r.length-1]:"",smooth:o!==void 0?o.smooth:this.smooth,groupStart:o!==void 0?o.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(l){let c={index:typeof l=="number"?l:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return c.clone=this.clone.bind(c),c}};return this.materials.push(a),a},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(s){let r=this.currentMaterial();if(r&&r.groupEnd===-1&&(r.groupEnd=this.geometry.vertices.length/3,r.groupCount=r.groupEnd-r.groupStart,r.inherited=!1),s&&this.materials.length>1)for(let o=this.materials.length-1;o>=0;o--)this.materials[o].groupCount<=0&&this.materials.splice(o,1);return s&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),r}},n&&n.name&&typeof n.clone=="function"){let s=n.clone(0);s.inherited=!0,this.object.materials.push(s)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(t,e){let n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseNormalIndex:function(t,e){let n=parseInt(t,10);return(n>=0?n-1:n+e/3)*3},parseUVIndex:function(t,e){let n=parseInt(t,10);return(n>=0?n-1:n+e/2)*2},addVertex:function(t,e,n){let s=this.vertices,r=this.object.geometry.vertices;r.push(s[t+0],s[t+1],s[t+2]),r.push(s[e+0],s[e+1],s[e+2]),r.push(s[n+0],s[n+1],s[n+2])},addVertexPoint:function(t){let e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){let e=this.vertices;this.object.geometry.vertices.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,n){let s=this.normals,r=this.object.geometry.normals;r.push(s[t+0],s[t+1],s[t+2]),r.push(s[e+0],s[e+1],s[e+2]),r.push(s[n+0],s[n+1],s[n+2])},addFaceNormal:function(t,e,n){let s=this.vertices,r=this.object.geometry.normals;jh.fromArray(s,t),zc.fromArray(s,e),Qh.fromArray(s,n),nn.subVectors(Qh,zc),Zh.subVectors(jh,zc),nn.cross(Zh),nn.normalize(),r.push(nn.x,nn.y,nn.z),r.push(nn.x,nn.y,nn.z),r.push(nn.x,nn.y,nn.z)},addColor:function(t,e,n){let s=this.colors,r=this.object.geometry.colors;s[t]!==void 0&&r.push(s[t+0],s[t+1],s[t+2]),s[e]!==void 0&&r.push(s[e+0],s[e+1],s[e+2]),s[n]!==void 0&&r.push(s[n+0],s[n+1],s[n+2])},addUV:function(t,e,n){let s=this.uvs,r=this.object.geometry.uvs;r.push(s[t+0],s[t+1]),r.push(s[e+0],s[e+1]),r.push(s[n+0],s[n+1])},addDefaultUV:function(){let t=this.object.geometry.uvs;t.push(0,0),t.push(0,0),t.push(0,0)},addUVLine:function(t){let e=this.uvs;this.object.geometry.uvs.push(e[t+0],e[t+1])},addFace:function(t,e,n,s,r,o,a,l,c){let u=this.vertices.length,h=this.parseVertexIndex(t,u),f=this.parseVertexIndex(e,u),p=this.parseVertexIndex(n,u);if(this.addVertex(h,f,p),this.addColor(h,f,p),a!==void 0&&a!==""){let g=this.normals.length;h=this.parseNormalIndex(a,g),f=this.parseNormalIndex(l,g),p=this.parseNormalIndex(c,g),this.addNormal(h,f,p)}else this.addFaceNormal(h,f,p);if(s!==void 0&&s!==""){let g=this.uvs.length;h=this.parseUVIndex(s,g),f=this.parseUVIndex(r,g),p=this.parseUVIndex(o,g),this.addUV(h,f,p),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(t){this.object.geometry.type="Points";let e=this.vertices.length;for(let n=0,s=t.length;n<s;n++){let r=this.parseVertexIndex(t[n],e);this.addVertexPoint(r),this.addColor(r)}},addLineGeometry:function(t,e){this.object.geometry.type="Line";let n=this.vertices.length,s=this.uvs.length;for(let r=0,o=t.length;r<o;r++)this.addVertexLine(this.parseVertexIndex(t[r],n));for(let r=0,o=e.length;r<o;r++)this.addUVLine(this.parseUVIndex(e[r],s))}};return i.startObject("",!1),i}var la=class extends dn{constructor(t){super(t),this.materials=null}load(t,e,n,s){let r=this,o=new fi(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(a){try{e(r.parse(a))}catch(l){s?s(l):console.error(l),r.manager.itemError(t)}},n,s)}setMaterials(t){return this.materials=t,this}parse(t){let e=new nx;t.indexOf(`\r
`)!==-1&&(t=t.replace(/\r\n/g,`
`)),t.indexOf(`\\
`)!==-1&&(t=t.replace(/\\\n/g,""));let n=t.split(`
`),s=[];for(let a=0,l=n.length;a<l;a++){let c=n[a].trimStart();if(c.length===0)continue;let u=c.charAt(0);if(u!=="#")if(u==="v"){let h=c.split(qh);switch(h[0]){case"v":e.vertices.push(parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3])),h.length>=7?(ca.setRGB(parseFloat(h[4]),parseFloat(h[5]),parseFloat(h[6]),ie),e.colors.push(ca.r,ca.g,ca.b)):e.colors.push(void 0,void 0,void 0);break;case"vn":e.normals.push(parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3]));break;case"vt":e.uvs.push(parseFloat(h[1]),parseFloat(h[2]));break}}else if(u==="f"){let f=c.slice(1).trim().split(qh),p=[];for(let x=0,m=f.length;x<m;x++){let d=f[x];if(d.length>0){let S=d.split("/");p.push(S)}}let g=p[0];for(let x=1,m=p.length-1;x<m;x++){let d=p[x],S=p[x+1];e.addFace(g[0],d[0],S[0],g[1],d[1],S[1],g[2],d[2],S[2])}}else if(u==="l"){let h=c.substring(1).trim().split(" "),f=[],p=[];if(c.indexOf("/")===-1)f=h;else for(let g=0,x=h.length;g<x;g++){let m=h[g].split("/");m[0]!==""&&f.push(m[0]),m[1]!==""&&p.push(m[1])}e.addLineGeometry(f,p)}else if(u==="p"){let f=c.slice(1).trim().split(" ");e.addPointGeometry(f)}else if((s=Jg.exec(c))!==null){let h=(" "+s[0].slice(1).trim()).slice(1);e.startObject(h)}else if(tx.test(c))e.object.startMaterial(c.substring(7).trim(),e.materialLibraries);else if($g.test(c))e.materialLibraries.push(c.substring(7).trim());else if(ex.test(c))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(u==="s"){if(s=c.split(" "),s.length>1){let f=s[1].trim().toLowerCase();e.object.smooth=f!=="0"&&f!=="off"}else e.object.smooth=!0;let h=e.object.currentMaterial();h&&(h.smooth=e.object.smooth)}else{if(c==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+c+'"')}}e.finalize();let r=new Je;if(r.materialLibraries=[].concat(e.materialLibraries),!(e.objects.length===1&&e.objects[0].geometry.vertices.length===0)===!0)for(let a=0,l=e.objects.length;a<l;a++){let c=e.objects[a],u=c.geometry,h=c.materials,f=u.type==="Line",p=u.type==="Points",g=!1;if(u.vertices.length===0)continue;let x=new xe;x.setAttribute("position",new ae(u.vertices,3)),u.normals.length>0&&x.setAttribute("normal",new ae(u.normals,3)),u.colors.length>0&&(g=!0,x.setAttribute("color",new ae(u.colors,3))),u.hasUVIndices===!0&&x.setAttribute("uv",new ae(u.uvs,2));let m=[];for(let S=0,E=h.length;S<E;S++){let M=h[S],C=M.name+"_"+M.smooth+"_"+g,w=e.materials[C];if(this.materials!==null){if(w=this.materials.create(M.name),f&&w&&!(w instanceof qn)){let I=new qn;Pe.prototype.copy.call(I,w),I.color.copy(w.color),w=I}else if(p&&w&&!(w instanceof Ge)){let I=new Ge({size:10,sizeAttenuation:!1});Pe.prototype.copy.call(I,w),I.color.copy(w.color),I.map=w.map,w=I}}w===void 0&&(f?w=new qn:p?w=new Ge({size:1,sizeAttenuation:!1}):w=new ui,w.name=M.name,w.flatShading=!M.smooth,w.vertexColors=g,e.materials[C]=w),m.push(w)}let d;if(m.length>1){for(let S=0,E=h.length;S<E;S++){let M=h[S];x.addGroup(M.groupStart,M.groupCount,S)}f?d=new ts(x,m):p?d=new un(x,m):d=new be(x,m)}else f?d=new ts(x,m[0]):p?d=new un(x,m[0]):d=new be(x,m[0]);d.name=c.name,r.add(d)}else if(e.vertices.length>0){let a=new Ge({size:1,sizeAttenuation:!1}),l=new xe;l.setAttribute("position",new ae(e.vertices,3)),e.colors.length>0&&e.colors[0]!==void 0&&(l.setAttribute("color",new ae(e.colors,3)),a.vertexColors=!0);let c=new un(l,a);r.add(c)}return r}};var Kh={type:"change"},kc={type:"start"},$h={type:"end"},ha=new Yn,Jh=new Ke,ix=Math.cos(70*qe.DEG2RAD),Me=new T,Fe=2*Math.PI,ee={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Hc=1e-6,ua=class extends Qs{constructor(t,e=null){super(t,e),this.state=ee.NONE,this.target=new T,this.cursor=new T,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:fn.ROTATE,MIDDLE:fn.DOLLY,RIGHT:fn.PAN},this.touches={ONE:yn.ROTATE,TWO:yn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new T,this._lastQuaternion=new Ue,this._lastTargetPosition=new T,this._quat=new Ue().setFromUnitVectors(t.up,new T(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Zn,this._sphericalDelta=new Zn,this._scale=1,this._panOffset=new T,this._rotateStart=new St,this._rotateEnd=new St,this._rotateDelta=new St,this._panStart=new St,this._panEnd=new St,this._panDelta=new St,this._dollyStart=new St,this._dollyEnd=new St,this._dollyDelta=new St,this._dollyDirection=new T,this._mouse=new St,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=rx.bind(this),this._onPointerDown=sx.bind(this),this._onPointerUp=ox.bind(this),this._onContextMenu=fx.bind(this),this._onMouseWheel=lx.bind(this),this._onKeyDown=hx.bind(this),this._onTouchStart=ux.bind(this),this._onTouchMove=dx.bind(this),this._onMouseDown=ax.bind(this),this._onMouseMove=cx.bind(this),this._interceptControlDown=px.bind(this),this._interceptControlUp=mx.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Kh),this.update(),this.state=ee.NONE}update(t=null){let e=this.object.position;Me.copy(e).sub(this.target),Me.applyQuaternion(this._quat),this._spherical.setFromVector3(Me),this.autoRotate&&this.state===ee.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Fe:n>Math.PI&&(n-=Fe),s<-Math.PI?s+=Fe:s>Math.PI&&(s-=Fe),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Me.setFromSpherical(this._spherical),Me.applyQuaternion(this._quatInverse),e.copy(this.target).add(Me),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Me.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new T(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new T(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Me.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(ha.origin.copy(this.object.position),ha.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ha.direction))<ix?this.object.lookAt(this.target):(Jh.setFromNormalAndCoplanarPoint(this.object.up,this.target),ha.intersectPlane(Jh,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Hc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Hc||this._lastTargetPosition.distanceToSquared(this.target)>Hc?(this.dispatchEvent(Kh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Fe/60*this.autoRotateSpeed*t:Fe/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Me.setFromMatrixColumn(e,0),Me.multiplyScalar(-t),this._panOffset.add(Me)}_panUp(t,e){this.screenSpacePanning===!0?Me.setFromMatrixColumn(e,1):(Me.setFromMatrixColumn(e,0),Me.crossVectors(this.object.up,Me)),Me.multiplyScalar(t),this._panOffset.add(Me)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Me.copy(s).sub(this.target);let r=Me.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Fe*this._rotateDelta.x/e.clientHeight),this._rotateUp(Fe*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Fe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Fe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Fe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Fe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Fe*this._rotateDelta.x/e.clientHeight),this._rotateUp(Fe*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new St,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function sx(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function rx(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function ox(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent($h),this.state=ee.NONE;break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function ax(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case fn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ee.DOLLY;break;case fn.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ee.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ee.ROTATE}break;case fn.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ee.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ee.PAN}break;default:this.state=ee.NONE}this.state!==ee.NONE&&this.dispatchEvent(kc)}function cx(i){switch(this.state){case ee.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ee.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ee.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function lx(i){this.enabled===!1||this.enableZoom===!1||this.state!==ee.NONE||(i.preventDefault(),this.dispatchEvent(kc),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent($h))}function hx(i){this.enabled!==!1&&this._handleKeyDown(i)}function ux(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case yn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ee.TOUCH_ROTATE;break;case yn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ee.TOUCH_PAN;break;default:this.state=ee.NONE}break;case 2:switch(this.touches.TWO){case yn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ee.TOUCH_DOLLY_PAN;break;case yn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ee.TOUCH_DOLLY_ROTATE;break;default:this.state=ee.NONE}break;default:this.state=ee.NONE}this.state!==ee.NONE&&this.dispatchEvent(kc)}function dx(i){switch(this._trackPointer(i),this.state){case ee.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ee.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ee.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ee.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ee.NONE}}function fx(i){this.enabled!==!1&&i.preventDefault()}function px(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function mx(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var tu={source:"Roblox Player content/textures/particles/sparkles_main.dds",sourceSha256:"3e52b300742ee9e267c32d5886842e21b4a5f065906c224dd4e22a72b94ee8cc",dataUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAABH2UlEQVR4nLV9e5PkxnFn4dnA9OxylpRk2aQk26eHJdsX54j7/h/g4u4fy5ItiZJFvSiSS+5odtBAV6GAi19WZiFRDfTM0ne1MduNRgEoVGblO7OypmkMWp7l9Gkys24Ff2ThSyE/yLnZmDzna40xdV4bI4fFch0dFoXxxq9/y9X9Npq+93PalE+bv1dlJePHG87q1CtjzJv0edO0fZ+Llt7NGOMnvxzMxni/HMt90cfPnuZTzst18XP2xvClq/FM6t7SQT2Pro0XJuNNxlo+5x01wJYfLwEEAEcESi6hcxqRBPDSnz/ziD2X1z6rJQgszxEEkF7TOM3cu9bvEccJZFWA22sTZlgjwRyeqZFg7140FwlA9hrGF5EAQ522kS/eG4iVIsdGexYCbNz9OpB2gL+56gVg+RVku3KvpxCgKhbA12WNSRHAZ/TUKYx2677XnhUBqoFhFoCkSPDUO+F+ck38xFwUy7M2keDafZ+BBOWK/G+Q0yqr1oBLWcQ7rNDdfleo/Dut/v3+WV3WBPiiLPBJ3/3op0JdsHXtHhWQvtM8LeO/ApCUCjyFIPr8LjXCc5+HY+9OAfDQFb+XFnj+QnyAoZqv50wGM3DbwvjCXyDNiq9rwpHtPHPruoTnbyHx6n7oVhiN0HNREhRXvCGVAVKkSIGG+xGv1vIHo5gGIvrsncc5n6/lhgtWEqc3jM/Nbj0+vnW64i+QJ/uaLECRbQF+RIKnyLZuqcyQCoXhhPqeCJmrbgo4T4xhpnuqLnme59O0hqZ+jv6uBTDNvuIKBaLPnpCQgKyEtNX9cX6HTMg9ntuAeIIE4eb7FOiaPFNurpwrZDfPcwE++mWMUbOenC1gpNJ+KhTGPteoxZY88dSzUqEwXJ977wvggDHmsHdvzXuvIYPw6xUA+bman9N5Dag9ATCRJ/YQBEhALOgZbQ8J3k3HSm6oWrbbbwtAWwJXqg6qFUvsiP82n5EXq7/tTiuZOSuKYuL3P1wTAq89Nx37ig2+Q4uaET6Ta/X7PElpvwY0y50VshwLFHZAXOQkVK2bUgXT64UPXqiD6WqfGGsLv2ITewDeYxNKRsiLrPBFSXaAhYKNxAaFkmESV++zx4NXz5imNWvQ/N7znHpexfwPz8PqTSlEMS3zRSs+27C9aOrEFFwowQpJEjvBFhX4emrgukUZmB6+SwsS4SwB5IU9QfWN369cs3Vtco8prtSyMH5UalzsyJ9KwlmpZLpPwiJWrIH77pFnAYRct6f20e9AAtwuod5AXu/9vJI/RCORx16xE/xXESDKAdywuvS5edMuAAqXyBzXePwWMJ+SCdKmKMdqKkAJ/OixuNrVBZE+8Od0iXgRQPzsXWAS1k0BeAkQr6mFm/x6uT7OO1EwvwHiZ9gINhHggvzjmNWnjbYIg0HlY1Ma/Y6rnmXj2uXrVwD7da7hBjtAVlREAfKiLEoikQKgrbYxkRrwcryHBLQqBXhY4PO+RE7XJfdcdzAZrtfPpp9TKvAOSFBeTF5Kwlmv1ytXm0uZf0LNEr6amkVmuVZsA6vn7Jhu91Y7TcCK9lxHBJ/RRGmVNauyKjNVWOvjPJbOOLpLVVYX68kZpWqZNQDjAlHjtsZu2+bDOEgNjFSpLIwdl/5AHpisrQ+/5WVuzLi+m/B0uQfJSBiPMqVfQ4IUsfLnSOUrAK77ymrXxBN/6ETCVZ7TjXYlAzetJzg+U9nmV5J4fl1LSN8FpuCqqGb+pDtUVbT9FNSnrOgPpmLVNHVbIe/qOfI4jCtf5nLLt7BMrvqq7iXX1EUcB7QVvajKBOU34bdarBtCs+7/pAyggf9EA98PpuWgX2MCcewjv1LWw9WnttlnT8gDV7SWLUSe1ZLGxGJ11HVdOOcIhfKJ3u/WjvYRx3VR+2sUQJ5PtvuC+bY8VhSGlCWIrb9glqBZzri5MjOMVSgBn8dcTuwhhOwyG7+s7+c6r9L+5bN0cvV7JEHFhXCFT88rPufzGGDJrwm7e2AXdGG4qMqVswYvPdkngbpaQfkTQmMidMrqx6dzrqir2lhnafXjO0bKEy/GrQtZWoCpSXvK46OvQJmUI4AUwujf6fvoswRhibZ47+VFcB4XwI1VFXPhViwJ+JHIA9f8DiQE7alaNHlKp1/1Xa/ERYEKenTOMgEIZzjmgedZ8CNsuoVL+GZXZHh5gJpw7eG7kBkSmSAxvc51UWd5lefFVMzTNOGpTV2Ro4iu9KX3+poLvT/hqeJbEEohQppuq5Wprsc1TIGWvou1j+aMz0cxsva1Y6Rr/eR7kxmItYGOgLjA9yIarkYCBhGujc8oDF18MWC5eHdlpYcFnhpNqvgunje8wMxXyCrywg5S3oeJqut6LeEm1ECPi3jlFbsDhKzEuUQX14fauLMrq7qqLoI5nE9jB+ZoM7gSNCJIOY0Lyd96B4zfebd7P4yZVvxIKz5jfR99CvZdiPUSdo3cz36M6CGOuOtq5MqsvFYDeTWt+H4isOxMOO7WG2OO7F07RyRYawVFigSpsJdO2DUESM/HF5WvZXGxgmOAyIEAVvKk3DjnerAFP3thWdTc6AQoy5uqVmeBYgm/1vx+NUEiM4yBggEJiP0pmQJz4ScfWGiwWGo2IZJDWxTF2XuP+cbD+cHX7QxPq4FbwL/WRAheJOOZB9MyhhKaKwSQJprCxHJB4LVqwq5RASUhr8Zx+UZLU9J9zrywrA91Zc+2wrOstZAJMO5e+op6tgL+1jQkJF9b/9J3IArHwl2kGPMkyIF5Kqac2JI2R83qPi+LohgAfPT33tstK6F+ZhQ6d6gAEckwEu4gGAl+L3q3Ej8iYrCtXgHnkOf5eTKTr8rqfQoPNDkk65n0Wb7zZCLTCzJCYB/0ojRJmTfjPBISAAhlFiDK97gEsDoG6b6IJ1jO0/OP5bGo8oqigaq2gsTSMMK+xZjtaEG9RBa5EABFz4+knmdU5AbwbC39Q8DUjea1LIiyEI83JBMJeAgJcMDn0d8xA/2WmUxnMvMIWwazgMJO1keY5RxjqGIQSIbINnwWgF9WqOm55OuXevfWee4F4KveXxljvg31yhhzov4h+EIANCZmCrCE1f1JIo9gM6vVGJFhY4Xqc+E96REB4CUBPtz/UBt7tnV8Djc72lndZxX3QEBPn2dyAlaUG7S8xzxdZAiRSYDYMhZI/XmZCxwyfT9hP370HyJwNS/z0+QnGN0C5uXGAxngE9iT9p9iBeUzgPvkedb78XsMsarK6s/GmO/x6nqTCGVYdVaFaoggKfEGQTWDijbaOOmap2tAJELb6pymCHVZwzBFwKfjQ31glnKDP+vsqW5qCGDalE2fAGKKXOn9CWBKBqDvNqx4vgcBHWzGjjYIeWFhhPhE8H5DbmqNBAT8oiycH5kaQP9fyPm851eQoNPULhGAFpbfBce8EMC00LcR5q2EOJkdEVYws58YY/7WGPMNY8wDztVVLSufBJjEseLzQoWbKWDufQpCCO8WEruDAPk4jXV9qNG5ph/HIHNEIFoHAczsNVAB/Xy6XlkQhTXQWIAIVbF24GTEFnKMBYfMQtiOaHK4p+uypsXhRvddnjdQUYdn0vOxDuhFdw1Jz4tMzoEApDovgt9FiBa7RMPb8XfNxeOtSKCjec7z3BZZMZBGUJpPJzN9py1brPrPTRmBS0aiogwYL6tgMmQbzqqyIrv33Ys7GGyW8ZQXcf5rI8+8pgilKaNQVVVV3hwoDyJrDk1Qpw7mZjgPgCAmvpwmCheP7Gk040oGoMhipRaKIQhjpHOlX2sP48LPCRkA4LAI9F98hd70lryUxny3MMVfTGY+z/N8jCsXcQKAJOIJgpyRedgH2W0c9X2JLk6AnsYPLFrAjtR/YWnbiPvn6Bq6P4DPZN/y7+eqrH5vR/v9uqy/ZYz5TAEIXzA7ZOZkfCY1jHnkrIFP1rt54beY8AtLnzpHJHZ5L/IBQCYAEuBvOA+EDYwUODZVXQlQ6J0gRDHP5vlf68EywWJhzOc1D1dyR7DoGdLvZd5l8DVTFpEYf2iM+QstGF7jmnwnJH0mGEHYnzfYQGJpFEvhZkygjsnbi+FbAV+xBG36hZ5aFKTnCGJAQPzYGPNPzG//syqjR0ZDMETnGAMSickgJDjeHKM0rZ02+Bz9uAiM6m7SJ/EoEgVoDs1BA94E+wXajc1sh37uTB7CKXEQrSyLoAT87ExJ+7MCPuQJULN0xW9SgGmccLN/MMbcG2N+x/NKC0IAvrIpJCRfNLnn6P9iJSy3Vv9zga/OR+OJUutwLFZAAci/GWP+2RjzI2PMb/g3nBeRRpxIMstjVVUTJvf2eDtDX08BrIGveblqWV3X4kUjst8eKAakSfoBCaBmFfZsi+pQ0RgmN3mNBMM47MoYaMx3xfRNUYrybAh+RRmP5d1nRQX+joH/K7pJmQMpZF4FsNnKuRSownw10SRFFhU/EGIC+R2I/2uSjxtwvHoM4+Iwbb3ywaN45Y9s2EHELal2bPGb4LtiQfGXxph/FCQwJZF73CogoylA82W06I97j8hFyIscQsOsSa5GTvzGz1taeEO5hpSUvMzz482x6E5dO5kJFOkFJO22bGuDKMEFeUdfkkYgcsh8U96IIJhhxJhY4v91Tc8dp7F0luSB1IWbN2VTDGbQ4wNSB+k38z8xpfmq9vV/ShwkyaST1YsLRqs00IZMxTEQJV39QtFV/AADOw7uyUhXHcN3JUY/mk8F+NyAFGTw4d8gHP7MGPM/jTF/X5UVNIVzXdYgy+c8Q3YpDc8mK2S6Pd5O6Qsq336cWKWuUfSPDDG1MBpjbpp6IQSDHcAWMCdlc2jG+4d7QhrnnOfniC8zDIgRgc/lzhHbyKo6PLQ+1PnwSACXQVbVXGGe6KFgE6BO1trvsykdbFKilckgddWrGFqwW2y4np9lCt6yu0fgK0uXbtpmnwZz7gR3kqtYMQ4gwf9mJPhJXdY/ZzILa6I8EHRaBEosP1qCVVWtBlRVi3GHWr5WFcXEyghQ5CZvjzdH+jOXNo2bvu8nIEF7aMvhMADkYrSiNgVIRD2I3zeSedaoclgYHh8e86IiipQLEtSTwjhjGje6HzPwf7q8Ac2PKHkXQmB6vAds8T1c8xWU7xrBu+ew2TveitJR7WcsE/zEGPNrogR1rWUCYIV2nU11TaRV5IVL3l9eppyqexYQKKUdl+9kCCJ9eyJA0SptDs0w2GGua3IX00obhkEcNcLj6eWstdAyco4fyCFHAAlY3VpCkMbg+7CjbZgVdgr4mKtBIq1WcQc7gajyXVOKi9gD7QsYnxkPkFKDNMRJftOTnx6LbR+uzLqkSBsLXRs8uCgLoN9jURa/yav8R3mVQ/r9hSkjwIPJsGwyHnYIhChN0TTNOAwDvUrdEHBia6tWU4SsaRpMPlnbmrYBaccAD3fv37VDP7xk4IDK4LpjURVTdwJMjG3Ldsxmup0gnUYuGuMwDIRydUlIRno+EMGVFHFEQqNiY60lSda8n2f5DwtTfFmMBRbBMJkpc8adYQgb57Hwk3emNLUf2eHDshfZFBRjhNoZ4w1hkJXsZIYpfBpyfkstjPEATxVq2AK+biQYbrATVtuE/JMHUAl3mPgvCfDG/Kiu63/BamgODUhiuD6vGkUKRzcHaaxpiFfjN69UuknZGPLqUOWTm0xDNigCNJ3kY2kSFt42bdPXpq6Px6Ppus50p842TRMRbBhIRshgL2gOTTGchwLHSpYq2hdt/vj4WHDEEVhUXBEsLL5vrf0hW/d+JbyeP8mrX5c1aUNudFZ8CXufusG9TIEpz48M22YBG7b+zYv3SLsm/yomD2bgQ17meCkADp0AzFohwb80hwYs4WNBgiIjrUCAPUKcxCdTAQIEAC8IEP3oPHSsehLq5PPQ3DRtc2xvCO7HFAlO/SkO+HhzrL0l+70HxUE1lZlJAoZGz0YMFM9je2iLh4cHYTlhAGxnYWR43zn3twz8f2Xej0bz0VSNt9aKBgL7AVY8rKVjCmzdJL5gDYTLGMUttbC8GgO4E5iRrvb0WPdn4a6qq9oxlgfnT0mA1UkZJ6EEjAQ/bQ9tnyBpOQcH/Ni2Lf0FG2igLO2hnay3Mzt7SPhragJ81d60RAEO9cEw8G/4k2CH//pTb47Ho/gJ4Mo2NrcYgyBs6Hxoi/7cByP/TCRUxliKOijNZxEyHzrnPgIu1HX9K2U4ChSsauzgBiyS2joLrWi246IC8pxFj6RQAfIuquDRFPhPtfIisVF8U9yeJeVHL3aYCvJUZnkIaswo1t154w9VWeHFoKaRkFOUBfgsYvHrpmzGuqy/unt59+uhH37YtM2/zGb+Rdu0Ur8nPKFcpGNQAX7ViP4vm5dxwpq2gbeUAAq5H58vji/gojZVU2VucGBBJYw+7uxumpcNVpLl++FcAVNu13euuaVngQ3Q7LRlKzxfQuHCLMBNwyolWSrtiH4fmdx8AMQc5uE/rLUPbdm6ci5dX/Y+N/nsRge/KHj+GaqrG11WVuWYTdlarQu+gKgFEH/PAqslrUBqEmUsEyRUILULPGkHWAF643jLRQqSlEbuAPj8NbiOgb3BEQR+iWGGieuHL5u2+T1RgpvmR2Yyv2+aBvEFgmBRNWqaRtRDQQDXVMQSBAHKsijxjgEJbmh1A/ht3dRACJowcQ+j1aYuu1NXHlviDkOVVzf6GZAJRPAjgI8kaBb39zDgkSxSkYwQtL3BZvaH9mw/qA7VyZ0djGD3ygci80FR05gjiQeIUclXtAANj73j58UDyIXsDdxq15BA692rmjxF8I6tnDdljsocYp2TxJKUB33Z3BASfKdpGvjD26Zp/sgjJl5ObKBpy9nMejIdT/yorXDHm+OtIMA4jwC+qVuOA5gM1DWCHY9Z6GkFbeB4c8S94zPc5MRhRa0t27wfeiDGEp/HbTgP/wNdOPjkDxwoQ7fRCMBCX/QaynzJ8TVE0L9ptXAzaXXDLnDhC9jT+/eO4+/llbi9dVwemiABLGwxeUTFFKL9vr1pWzOaj5qmodXaNu1XTAFonvi3SU28a5pmFbhdF7WsfPpj4JPeXwMJ+G6RCoymYqADIUrEDSokMPeP91PbKNElXA/VFO/QDsMws6fxH0gwzQ2A/3sWdKVFhNVzIiFtEo8Yo4KurPB3pgKJfLA2mxRP6/1yLN+jxD9zalYeAhHBGrD6mdQTZRFPnvzGjg1MIYz0jmoPlRT40Djr4J//5PjyiDF+eGyPiC56UR9qrKTY7m7vZgYOXqtRCEKtfUHCH+7RHJtjVZVV8AQ2TQajDvsKoqUOgKDfjfHHl8f86I/F0EeS71Or5v3j/dzeBqMi/VcVcCb9vSCy9/5XVVv9ycxmdN5NsCxOZpqLqvBudmPd1JMfvZd8iG7s4mIiU3O1XvUQHglBCg4ohQzMPolYnkbVYoCdgPA0Y0xFqEHGTisEhKSGnxSrtoB/rd+uXHCZeycvOsHjh7+6jmlZsjIwiX88tmS2BRJ86CZXNYfmUwIiVthkJtbr6dqijt7IcIOmFTWtOjZHGKHo94YrZFaB3NL3t4+ICzW5FM+Emkkn2yBXDP2AcPIlZPzsyC5A587UGRf+sD7UFGHsrPuTMea1Hg98DKRWngcZ54piben3KTnnkLJ9asDq3l75H60Sfq36AHuFGVK5gGQCTrxMfxfgK7s63kLMsOPx5gjSCxXsViHB+82h+Zvm0KC658/h1p3NjHcomhsiwSCZHoYcabDp89cSCNCP/YEB3KBxAgYB78XtC1wv4e1Bqg8BAH7oh6JpG8+xfGoyIrJiTP8N19izBUuB9vLp0RxhUJLeuK9PVLuIADp4NG1bgpywiP9K20SALStf2vZs/FhhWy+Qrn5psJhBC6jrmsj4sT2uIzyX9vHx5vjPJifXbdseWvgPftPchBWId2lv2rH2dB/o8/RjW0YEoMe9unu1Hq/Jzcvbl83DI0LvjDkNJwxePJJidJXviAoPtvxg6/dlXpb9uW+BmMN5IAdWfai/smeL1X+t+aZu/GCJ3UTNKLXVp6tcchm3+qQBK1qoT5NNpQUh8ImMnK1jfQf46WHxkzJoEGQiyS/DoDAQSsAsa3HhzuyfR44eeJlDsCZLxLbIC9LD26Yd60Nt3eSOwzh8/OrVK8QR3JEboGl+3JQNXKjUqrIqwdvxHWwBf3VBmcArawUjXemcQ3/6FfZBjAN5DVommCeOnxqDc6q5aSZhDejXT33b3DTfJatk28wmMw/DMPwBQiUSO8/DeZ7mCfmGtm3bue97n0/5VJkK7mOofsgkiIEltrQxApkEQmNplRN/z43x50C+ScNivZ7mXeIBKq4XoOAj8QKIPk9dxe/EAsQQtIUMIvmnIdry21buvUQAcfRNnsYFsiwQmHTTwPCD33/bNA0cR6DjWM7/UDXVb2kMDSGXrKEClr6mbPKu6wTwEQnqOuiLRVEE9a+uG+/9IG5dAmgw/ZqhG4AgRAEGSwGkdG4YBnARCHxo3TAMp6ZpaOUrJDFsUxi7viN9n3/W35c5XkLIL+ZwSyMQuLxTgWu5LteJIc+w/G09VDfCSpb2t5pa/fSpPYdYMfUh6MOYXPyxurVlmBAkwLOauqnx/bd1Uw8I9Vd2BYr2PR5JlhCyvjyzXvnmCRl0YAsaTL7NkbrBkFVnueSDExVC8ovpe7ID4OvvNODF5axkAHnuxL6BzZBzaVIhZI/XbxmF4rVX4gd0264P8Fzyv2P1Q5MVvyX963FWh+pqLSFBBpHMEyT4cVEWZNjh/AMkowztTSs8WxBcFHf8JhjdJOdwPMg1/DwsEaFKpD6e+zPsAHf90H+bqQBIO5DgP/SYpQ2Pw/a8sbeQ22YuBAWdKon/OYCX88+1G8R4gF13MPgO6tdhUMzPJVIIgwNfgT5K2Fyww4J5vhg2RB3R7COyEw7ZyoscmcIwqwbrYGb8nJPnjSqQ1QUFgsxNQ/H88Aq6Oq9/ebw9IqIG7a6qqqaqqk+SUjaiWUib1e95EjxyQRE5HoEcSZiwu7u7u2EYsPqlwVP4myzLDm3b2slRcmfpMoJuNpczRQ1Vc5XfNXdmnmdiD3AaoT6B936CPR/zgHlrTUsAx/zJPNJ84R9qCrEgB72ecv0pfXixqT5l+k3Pb9P3J1Y9ml7VKZtIVT/qv7jFKYYuJX+6iQCXtuMNGYWIpx7b4wQLXVVVv7u5uRHBrqnr+idFUSDQA42cPWLV47+DLg+bNLEYSl8KHuFzh6IoPmKyL2YEtD9qCoVgU/5dopBMc9vQX/o7PbCudc2iiyYqs9gvUmqrNa7U/nLNdvNuG0ZcycO71q6Q/nA+yABACMTr5WlYN4Q4AnawCVRKoJIGUzJ48+fH4xFBFmg56+OwGD4k8feaEhyS0HAKSt2YFywXINQ30UdMzSwkQvg8wxeQ9EfoWXS39Y+9BKNUbUuma0QSyaSK1jFtzd2eni+IcBEHwG2LEmzJARcU4CmMeaqlCKKxG2RPHafPFpOs8O5owNG3w3/H9rji43Vdg9Eiuli3jxhoEhJWPUEBDopiCHsI6WPhXu/x8+CYAvAhb8SmqMAq7pCpCO5XN7cxPI3+4EWUeYCGIpHHktVk3qE9WcdgB66UGSQ6PHWUegCcL6D1ejov1IuzTqkpsBHPZ1IE/tQWJGNlJEsYb5qgdcEHgKzWvG4pgIKSJZuqQc4e6fKYHMTzIawrr/JsLmYDPbo6VKWdLM6DvwKjBViOHS7fUAD+kNOryMarq5Yp23+h5gNjqZPfP0oQBsv9z1VZWcppuK3K3OSue+yKpmzKvugpQAVjrg5VUw2Vr9qqLKYC3sVDlVejzewEFtb1Hc1/c2g8zMpk2y89AkGIu3M1U6mvEI08ZOCBAAf5yy9yAp3n5UJq5AVdWZBBqpvtygDXSP5zqIQy9y6+bXYA4T+O7pW0FPmT1a4fStSgbReLnlYTedXIubcK2LKiP2KkuM6PLhv6I1MHlsclm9iYL0D2i7JAeBuOaRUfb9ny2EZPIb3s8UisS/7K483xgD+5HyKHkzkIiazrHMer7Tl99tolAlxHiafIki5tErNy8zJHHnzkxeD5K1JYN4ivQ7we7O0VBEAJ4YLxhw1AaEsgRphAWBJTOWYPCcAO9Ey1/Cm/pbP44QareM1yQigxXxIjLo63xO+FzRBCMAUjiyLM0sfjEcCXCGT6O7aLm5ociXWF6Gn8E9awNd/PYg2r9LUrC/Y5QqDoqGtdldO+kgCPdJAxgULxeDmG0CdIQQ4dnhi9YrRELvp5roxE6ZuJ5P7AnwC6NPkOlrCHBPJdgC/h4mh/kjhBPcm88ovusaPvw/0wtW1bwDikvO+aomUiI7CBCEkkFBHlzk4io6RAhRBwinlkg1BaqNvE1Lev4RwqY3WSBGSo58d77gTATrGsWyj2mJuM04ypV8yKKU3GcgOSJqgCAdfHReq4hHOTREr5Ag05bxDph1oCZXbI2rIusQpaCHvsis04uLNABA7EJdT/5yAOLTzKZJUKCSgaiM/9NfcHGa8VyZUAEBx/oBBDRy3DuycIK6ZrAXBeNzWilLPmtsntYFEDwGQ+m7MX2dyfeuRBwN2NXH6KZkaJt5e3LzGXCDpBqbexvqnHh/nBYc+A0pS+LEsUzoTNA3NIyOBR5srTZldi/0cRKYEB7YqmZYJYlk5iBKevu2fQmowQuujqF0iBRgkWIvHB+ofj0I31fg6Xjt47RS6J1LdNDN7Qnyu9WQFOrr/GvF6r3yVki9S5pF/FmUHHxIxsGPgI5dIhXzKNNAZYAzUypFOXpMXhXekLm43PUrYOgiDyCSUK2VmiCBScIjmKzEJhRZQci3QDmlXy6W7YuHqBzegf3TbKwMiD8h1SLzeKadJqMgghyO8XEGIFcPjsjw28/1F4qu9e3hFpv3vvjhCJo4T0tbIqUz5ecqEFaeIPEEORNABQrHv6PvcMfG2L1e8m4Wja+CPUQVMLxCtIn1LbDeoDLZpABQLFEWTxVR3D5XLrLN0HfgRr6TsQQSOA1BLEYpykOIWyBcwxceSaO5itR5SDrlKuY0471dtfki9otfPqD/osf1erXww94pED4AkBKFEjqHyy+vXKj5k8MsGv3nuFkFA92RoozQ5Vc0wJ/nrjOmmyums1offMKi6d6AugnQR5sE7v+0cCrl4YFxRAbkK+hMch01HJwzighiFd484UgIq5i1HToAJsMINDKZUVMO9QIyXgNuY07uweQNE05JRQ5lzYqMNbFgXO1SsHhPHQe7VvHy3MYl0j5Pog5+glDw2pS6IWliUitQuTVzlFyzZlgzg92A7IqfOieXEEOcyrHMWcMEkHTCPYxP3jvblpbiA3CAmX1S/uYyqhKi/HAJIX+0IhgVClWfWVe+JFO9YkRLJfRQYriyHFI8I62HUdARnx/qYy2JIOqy1vhmacDzNCxSEYlaYx2Kakrkzl3eAQ0zAiG6goi6qcy6rxDaqBeaoldFOXQz041BAALyepqix6hJ1P+VQUB4IJRS8JfB5Pj0jHj55FX/iZkkny4OWEDLFgcUFVGLVQIy8lZkQqqKCCEi9kBvFoMRIctBRal+RulUmmhAz1HAhabdWQ//5GCV7yPaZriQWOP0Pw57LiZfkcEk0gIrRCFnm/tDjjrIpCSN+/UQikqUCmkAB/NLEwSfNc4D8wd3EDWvV94PELD+j5+KSOMf42L/OegVhKf+L93oV4tpoyl2PuoXMhTIgroEKmcJApVICpUHvhFHGyYOjQx1pIEwSRSal4krRhRD6bK25W3VbHyM6pyEJKgNeAbHeOUxevOHukpUKYXrlyPtblMwuZxH3eNcBOTMfyXpLXL+MZNliIIIMgwawQwLCRib4wAowqFKxvD61dXT/F+0cERAQVI0FwK4bmuNyMRGL7aZrGMnGAePVCOgFCVg+eQJExGJN1VGlzSKTq1L/vEiTbagL8aw0v3E7jNPjRNyCFCglkUi9diOsY/JQKzEntYmElIhNIuHnazhcPcS51/D91/JxGeYlcz7gHEkx2sgiG7c/9QPkH/YBcw2VMpRnt2SIuEXGLVkcg5SWV8pEqK9Qf4Q4Dx5hniGErULtwaYIAMlE4D56CXHaUX6GyZ4g9L6YCYVRUf5dyA8xUDONQVFNVolomii9hk6Y5nys7WnRCsEBlGlO70VXFWNRmNPUwDojtr4uJrGy1ArI2DMk5DVShRPnOsVFAFVWrTFiCqF0SFYz7j+o3qxB8lZZ2PB7t/f19EApnY2lljsYO42DBFinPfzTWDMb5s0cdRedyR7+hRH1u8n6e5qU2EVooODVhNWNs9my9Q757KDARNIAxqIKw/UNTyEwmO4kE18HI/puMAK8FQaJ8muTTwxIMlMIMMpGes1Jl1ZAE6sZYUg2BjkbF3XnoslVNyRgh9+88wOGj4/30Z6eoiTaTasugdtjoPinAU2dPxRY+ec+cPzXV0+2PCsCSMCpzoudHqIH0xW9Cli2fl2vlPm44D4gvjPcbzlTwgv4Y4IKQeF+Q9GgVxHd3ZkQIKuE02EGOCSaqmBQMRbTqKfjWexxTIK4gwLWQLC0pp8hBE60KJeNeKi9lFVY9YoMGUmkOlCYeVSFKpVqHe+ksHd1CaG+ZH5hHpjq/qHFm53odxSNIMinWJ3KA2AG+xUgQcwX5UyyHZoM9puPROYBCQTSCuP5M3kMCPKR7rHJWAVG21iPdPaqA1lH6OwN/QjUyBfxpcCDmVElMKpsRsAX4ysQcWaAYVATTTIIQAlCaMA4p1vZp3fTKoAFDfUFUrrMOjg7pQ9mz0tqy1c+rrgA1PHScYm580q65xGD90wkBWj+ek3cQ5DgyxaCI40SYE4qF+eOqL/E3AXS46GyJF7tzSDvvzz1WvxvsEBEDq58pAI2BgS/zCNJPwMcPsvLlWAOfy87RNElZO4psX6JANDLkqX88/Aj3MmQCWJ/nSfb8EcyRKQOTh64aYgCyIpv8NPHUobwrZQqi4sUwDFNVV1M+576YSU6AbYDqBmZzNhZwBpa1OHewl1CJfX0otq4yFdcCIgsiDOd3374T65cuMSt/YjaeFDL9FQNTACsr8MRUQSaH9gtggVSQCYNCwebfq4ghYRvyByENqV4jlXqGHcVPMOOeYSL2E+X7WwcpsQfYifi7YSAEcOf+PDrrRshJMPIMI5PyyVICCH4DwuNvGqfJTU62sCG+D55PC3MuQOZn2VKergjX0AJm/i/7JCEeALRhxfsiqeE7YCpDnXxlGFJndUu9hboWUJQVcHz3kgBYoMqGkN7usdPjAGBuOJy6Or48EgK0DRdkWICY+tG3mgBfNwD/Uwa0TagOonzel8QTJXQaRgKahmQOAvDXFDHyc1rhpwHA74AAKzkgIEFc+TKXWMWc/bOlgYQKYqOfiBoyidcm3ySnIMKV+8z/T9zBuoH8NNVSTKmpGvpr63bK27AjBps75+E8XKiJcKN2j93IrtUoGCLok03Fvh/6M6jE/cP9gWv9ou6vdr745J1esfFJ7BaGhUwBpNt531DpIcgA0hAORrGHic4ucs4ESx+Euq6j5A+iDsebo2e3cAQ8kkcAeAY+8Q8AnB09uhIokXFEBPFKDg+8UivoCXlus4XJ0pbqy+PrcftUxMuYuyPLWNXyW297k43ZDBaA4sucAbQgChdrFl+6Ah7V7OtO3Q1s/1ygKWgHocdZCj4rQBZKZRTgmwT4ocjEdrNPIAEcSINiITRD4OeJV64EEqhkELfzJys+2vmTdmGd/f/RSv0I8uenx9wQwweDg9QClAheABEY/HCi6lgm9/liOq6LrM1bEmhgL5/chIS3iSJrQ9g7Sp0jm3c+Ho+EHPZkyyqrTnawx+Px6PM+h6OFNAmSH6rGwpZgaigQA6J0RV8H8D0bne4SZwhiA/6047kc1XwIMADckC26CI8Vh5ZZCQujzRxnk/VDj3xBkgfyIscfNtAENUANApwnWYjcxqMZm7LxzW3j3zy8wfoGX6cnUrn6oqJPFuImxGTQ+TzUHaLdYjC/jG5kK0C+v/EhGIT1ft0nbXojiV0WIA4cybIVgI/jSADHH34DUMTfT79Rqd8YK5D6qKOa+OrVKxkFcvfi2PIiD+Q/PNeiHg8Xg0p5pVjpJMzqzNI+yDUNmT9fqxCxveocW8cju4J79gsYRRVOG6yA5kK/CxCYff4r7aY/98Qy8B1WPfy9eXjzTiv9XfIAtxJFKGxEhMCYdIDkSmTzqNQkeSF8smuYjgXgiFpB28p1IwtgOE0yxN3dHRVZwg9v3rwh3p5lsYoBSdcvXr4QEtl1XXc8vkeTOCYBl1TSDXkDrJoK8DXJthwLICs5bS6xJMpvqfn3kakHIoWkIQ0Nz/4Cvn2sbn0Nz1mhkCEiV3/uaYVHuaGPKjGVlsFdgBCfvqYaGNKXVv8eQNPUsXdppQDeDpb+8IsEDezl+j+3FXWBVCr6znl0S9WNUG0r40SJlRGoO3WaCqyaTBgCR/tTP7EXAfvp6fg/Wfm01w4fi30/fSGXIEG6XDxTgkd2JwvCfnOapk4sgfxekkcYkQCIOvRDJeMGcAFUbQuh6/kY/dGwVQ7auTwLdQiDeUYF8HfZRLpErpl/WPYJkM2bxaeM/PSIBMgF4PmjFR9236TvADCRpYMx730gVNiYL+9DbSS5x01zQ9+5hm5mrPEos8J8CUiBki/kY3Czy8RGl2UZJOfCNGbGlrvYLQ2Ay8osN5n5Kw5aAYBveMX+JWFzMuNCZnMxTPHnkMgEMTJHXQ8e/j0FsG9nZTaYzPRmMiXUvbePb4Ua4F18NmWwC2TOu7rrux53b+s2w9+bhzcZ7aSANvEq59Hd/yXIoVAHm5uG/mAQ6mxHMKIxwPijeD62t0n2St5GCoHj1q5hmxdvW95iA/BlpWNi3ny5YCyAq8vI6RRoLo9CtXfReCePizac+PzNqtoH3Z7TwLQ38hMFfNmeTq4TA9EezbSqn0nkDkGSx+E8UE0A7DnUux7WQizbVX7YTqv6cw/LX6g5yCSfVeOoZmuyj0CQ7iGwErYOmle3QS799E1gE8+lApvp4ddusBEjuOy+cajM7ctbRPQQ+ZNCifRiIbFT1wLU1z+rSRlXkE6p89ufevHggey+1zbttzFJdy/vzsN5ABL8ASXe1W2k4EMaw7fVrPICpubu4KSxdpwcBVb8HEiAZw+nARTn+82x+Xg4UbBf1fc0zlWRiKRRqNj9wz20IXGQrfi8NJiFNfDR3jwuC+wayWfnj7nWCAEovFu2hEtvMoaSb9zm48sjGXUeHx7pb8iXQcdo1wC0lUQbDRhIMVdUYDBkGiasbw9U0QutevPlGySIVM1LirUbh9OAwEpB2MMwDBDEGpRo+/PrPyNChvYbQJ6bFlYTH4Fcr5HAJq8sVr0IfF4M2LpNrH4A1s85c4ggc//FvVCCNxr4aXEIZT/AR86rf7p/Swsoaw/trLSCiyZIwrb/ZX4Xb9/mdbqfbqVsIYZPrGb2Aax2ovqrb8KiSpK7eXgThGqZYFe6pUjEaGJlUNr5E/voeU9bmyKYAX4FZMPTm2fBXkCbKpVUbjW82DggdJXqAAx2yMg27iiREk4kX+TFVOUV7PPY8mqyAxVzhoUOM4KCPGFcHMso9QR44rV7e5CqH3x8Uq7daJwZHoPl0hkK0BQXruHI3l8Mp+E7bIMou777nhnNm7Zq3du/vCVPJ8rW9ae+oF1DR1NQUajMlNgZBT4T8qkQSQjb08GegtbWLfFp8HwCdhaADn8I2/55oP5JIG+qgU/VCPr2N6j6CZH2Tz/9NK5uXWRoL4x8tZfu2hYwg5TBMwjShsRPBhLhVN/3qLdfSi1e0Ry49U3TwE7/o+7UNZxdA6c6pWiLLeBwe6gYOAMijVG/j0vKpyreIRl2n7AMqJ+UpdOdKOAzzp0Ydvj4N9AOur57vxu61vXuBygFT76MviOpnjWAmN3Ept8YTwnAsyoXKpC56AiimsP4+/P9Khk5wuIa+b92LG2FAK9eviIwgRyBrBIQynWU1YZjKLwEV66AFKoTSsU+YF2wcfP2K9E/gPvf399jhQPgMPtulYMxXIb1Q6kR0J06zOpvpUycHewZ6izb2AmI8B0MZ0Im7CcQQ9t5ss80hrLutS49jUEdYeB7b8mL5gFMOp7DMfdx3lGdwd90A50HJbjpTt1/JyRoj1GtU/q+eGAFcovtH0WglJaFdt8tstW11fyuBaLourRQJPhOFnczX7crgKGsE10kmn7j6OCtzFVQgZsXN6TWgCzyz5LoIXkBq2fDNy81g7u+uz+2x0/AX3mPnuWlSgII5Q+CEpzHs0jWwckETYlbVVYDwtHkMW50A8Kx+ZkU78+ROASwrqdqY6HS50IB8m6gf5AJ/t6dAuvp+g4Jqb+C5jL00ddvVNxhiOkeLeL4Y1SVLJRr7drKfxfyT4NBHhrNPvR+Rzl8awer8rJDd6cY/jxHXiB8/kEPLQpsnBBkB+ayZBXkKVpZCRnlTj1ZUufiJiSdWG9R5Tdvs7by1o+moVgAYhtN00Dge8mrG7XZPuEVCSzOosbwSGXadbQRPjLcS1y/XPMH7QwirLwhRNozE6uAOTh1OCOH+mM1qyph5uHtg/EDlZYz/kS5Vz/r+u5Dthq+Z8/2J13f/R/k/TW3TXn/+h4OdmgSsLSUbnRw6ealKSn3D1SIbB9w6QaPPtEHsAOREcgvwLZ/GiT8/6i9MHHMAFMCOp7XlIFsLRL7JAiwiUZPeAiRoUqC3hgEPY1VUTjcMA1TdCstrJhhRJsscgqUrgrScrlVfKfCy1jNqBaOIoxyP5IRTkFIU2qjZTW0hv0AhR37oY/Wvrma1ytsjN/gXELBBR37R7GL/akP1r7TYN1M2bkx1Lw7dfF+XAfwD/ZMgulHHNv3fXu2H7uz60H1+i9ppxH9p71+MdBDu4B3QcSa1RMu4qut1LtM7+aRp8iQnk6uTYEvtfIeu8eQdrb4GqABXLM1fzQMA1k9UICxH/o/ZUg+1myp5Jo9AdgGljc67olaVAZPCC0Eooa4JREAB80SgAF1Vc/s0yeX7TiOHoDXwZ9SVpbfbfr8y89j/QIAn/cGAKt733p7487ufWfdH4HsQFSMFbWHFRvAnwNFYGBGe4uUhdX2/i2Ar3Y0Z2+faHPyG1V7kyxi1v7KJwGu8dMHP4HaHPkqIlCqWFVFXRiIwZsWUEIkF42gxA4EjdYHyhcUowd4aNhmZRhg2iWzV9u0MLHGZ8CtKjwWgtarV6+KFQIUm+HjF3H9hk3FGvgQNOdxHjiSB9fYbuxmriqOBrc0SfvRpmJ9xuPHjmDvuzNtEoV3AVX46s3rN29ffeNV8envP01NzUINjET7pE1nXW2tfn2N3iF8BaPkd6qWr20BVBGAIgEDf7e5XY6BCxMV+4m+AtmTTgDfu54CQo6HIAF3ead3DIFNIOQXUPW/Iie9Pyd/APICSptZlPd9ZXLaZAl2g1+3bfsnLE62xQsPD+ZUpgBy/NkXn1Uvbyn5F6u8NyX5BsTeLxG4Is063oEkwK63YAES6j10b7uzHeyjWAmxjZyzxAKoAbH7uidq0nUdvSRvHxvUvbP9bHLEhL9rrYXR6Iyg3c8++2zAvDlHewuCBoWdhkZTSAEIlgGoyjAWFvR/wIBYrV/qBGnff6wCxkFgkBuo1qCwZzx8tokWsEPehTXsrO6L8DCJD0BkEIwlYq7MygAvpCrzBNF+vCo1C007AT7w1tO+ekVdwJP0mQqrOptqScxAnAAnZcb24r0Xw8PjA63yl7cvD+yVi5lHox1BaaS2f28cPZskUjvYEzZq6t6Sinlmn0IPwJNQ2HeI7o3PwsrPXS6+Boyl5H3ySJ6BDFDm5e+stSdGgu8qe4NJMoiF1sJoBOBLpHbM1dTS+5blb+v4KY1gzQKAXJwYpLeRSUk7LHtS6Uv4/e3t7UpvlbCwDbUw6OKOds1GTZzYZzgP32hM81FRFSdvPfjol0MW1S1C3czT1hdh9QcEkIggCV4pHh4fYh2frKB4g9PxSLuG0WPsmbZtHegoi4EdJzc4A6cCgN89EhIMCNjresIifCLgBUWfFyQIK18SOJGYKRtdllT5K6hZr9n481072b9zzv0nB6DSwkkWgwTNZNM4pQGfmyrgteNddZHlhO2YwKTT1mZEHGNOSADgPz6G8jmcsiyBohH4zAYIw0EmdeXuCPxDgxVivPO/lA2W7GwpM0b6ZT6LGbkcXyBkndpczBV4NDZ/gLCGdHQ+RXJAHtwNOlu30dm53WMXyH/4PFtvO6z8KPX3nRiFZC4ylhtQlBoWzjGx+km2FIJRT845aDVAAjwbq6WAqsnsQKiA3lBLZ2s/29L3nNWPRrWCCXDM44GwtNoTc8TWBsWI5cPx6zevhcTPAEWscom6A3OOwocz8t+IXyFoMNi+C5/7evRjYUf7Xl3XP8DGiaYwAH7gH8il83GbFRrGo3tE9quHcPj5l59PTc21hRFEcXNn7r+6J8sFVjNtv5qTXh09gRTHF1oTdvpdBWra4ZEEPgiAWNHIzafj/kwevimbs2z2QbwmYhF2F6+ttbTrJza+kFwGNmnHrWXt2X4xzdOZVUNsGf9TP/keyTaYX+dcxbmCVGVlnEfo/diDINoFVoJeuGa1WMkuILbWa9ohw3dTC0hJPgCe1gOW/XW3ooe1fYB/l1416/2rLdSxezjLED+3Z+KXdBtKdS5rhE5FAa6qq5mzbSYgQfdIevhMoeVvu0zr5WhQO+FV7E89dg8N1scllbs3I8UQrmL8NM8fR5pxeAHDzM8hhSu+qw0UigFRTtNEqW4wb7MlkXIqZTigbPZssVv4PwMJirz4lbWWUrvVxhaYQ89ss0SKRypzbbICLeHrr9xPkGRlCSTJHxJlIvQ9hRjR/z8v5cn0pyABvwQSR1ObMBWBcM6h2jdSn//dWjuwnhrTpqYw6iVKZzaoETR1D92kZBXCeYSXd0OXsa+ALqhLykWMOXpVSQUVCII1UqiHiHBo/fl0Bq8PUn/fOWz3IRSGkECBAYigky0cNHnnEP0bVNFh8Khmhu1lROWb5gnPh63gfxEShI2k/1WppjrPIRamYtV5kx2s9P53tAldUIA9w9AWFZCmgA8jD7ZBJZYAJGCjT86GjBx748p1WAGQyFkoCi6zuZT8ujCnIR2abPHwimF/AQE+VcBooi8AGUaU8A4erYtKsx4fdNFD5PvGWeLD0BmBBKRqCL/nTwCZPIIKCS7ff6n7T2Fg+HJ3dwd/ATaQIqUM+ZEAqJ+C6Zif/1PvSeP5oXMOVIFSvJUBHuldpBUQaEKa17y5qrdW/6TOb6x+KjdLKy6J2VnZBVDRhvcTABKAVK+KSsEuwA+FQKiOQ13B0RRUJ7AsClQgoHO5OUzzhJU/mjFsoc6UwrsyApzIfjXRhhLg+XCUwPFEZF7iEc1AvgKqmUsTaG2GXD0W1PIhD77h+lCfh7dDcRgOvj20koY+iM7PXPPE5lxKyOTxEYuJGTuTstKNliR1mTk4dmZPexx4hMUhuKMbOvwB6UNxhgDM4P8Y7WkaJ2IHxpgfWGd/hbxCkjUm0vupagnLaYiThNMoPD9NbRU01cgg+wNKF/VdWqlXOn0XZ5BqacRQuvHQjpagqcjK9+5H/4+EQGXxsR3tOghjNCiYJMmfRvN9hKB1D4HHiz6OAJZXr15RsArdJPOUwMIA87LdPCVxhtT0vD+T8eaczIWwAoeSbVy2DRpJXP1iyRSzLLtvCfCEJKB4WRFj/EA9Xt28yrqBqImQz5KvJw9gYQo4nIAEP+C/nwl/lzpN/KxL0yDD87mewa1z14NC2S4gNoFULUxvmG5elNQVNEx6aYcPP/qfhUfQSGSkoDeoZTPlcJAFJJEgEppUiY3jdHNqMBSJebhqQ74Cl1ADXxxBLeyZtmIvJWKIU8vOfIsTk3aoaUCAUGzn7CgcTDcAW1YhrHZYnRohSGoPbUZE0+f2c0IOUAJSQ1Hyb6RaCWQ8so6ERKDcvxlj/imbsh977/9dPU++LtoMDIMkDS0tegGFNezICWkL9uvUEZTYBYSkCCKkQSEiH2w4lHCgHQbY3Ok8jVOI34t1TJZ0a9lIEW5SrmljRGB78/oN+QI0IhRNsQpIpTArnA+f2KJeqAVRAT95PZ4z5wxSAxKAynF/t8HjJZw9RvFq4Mc+S3AnAG++dfetshuCjwHIA1FRahEh0yo+Z3T/VszF973331FJrGjBigrEQzUZMRZNBqZy865tXSVM8RAS/jbsAvSZ2AZoj72NKBTw4MReAH5Vm8kgXg4v/lt5Aax03us3ClrWRCEIW7nPspfu8CZMvD95IEPku4goYkGLAII9eBUwMtTaVQADApzJwRRW/Mz9SAi0Z4u6BMSrkcHDej/V7xeAsi8iknyZL3HKyLPlGLGPr//ymra86x66kSkEuZM9NhMOgl2Y4mDX/wWEQu894go+wUKgle+Nr7IKuRJBIgTtmRJ/P/sJtAyXAlzHA0BrKGmjZ87Okk0E9rBGNhrY8hFsrH7t34ekCxfaJ9bTZEqgJhWK0Bk1BWTGoK4Fnsp76eqK5FJDRxCBjwnI9Q3tsiUAR3Kl2CEChWGE5uvPEXFRhePserwbl22B7o93pUANebYS+laAXrlj9W9ZkFfAThBRDWoFwPN5sfdDIAzVUMKlv/Tef48zkT4TWUBUTjbFyzjo3d4lG0i7iqMMIPaAawCnh7DBcs9RxBipS9DiReDUeYt+vIu1lC+jDGFBBrYb7IVExd+F/zNbWHIVICyuAywzdvZF1+s0hbQalguMNBEqYfFT5VrivYTv6+3dGYjLpMI7KpE8cqxI9P3r+2VVch9GVpozNzrLWlQ9TRMSXP7ae4+Utz9773UpHwjvEuEsZd8CfPhuW6tfn5dGsyNUQAcM6LZlJNr8zXvsQ+jVvRFPjtn6Mg4yo4HHmjWCCLLiSwoOWmwLqV+ceDpHFqt7hGsgF+QGPDYKYmXJ7kgI9M55Kn+7JFmc+ZMye+j3kIwGPi5yyUrhorAsxe/J5arNsxuRPDqpYyeKBxoBfqimiTBAaiMBCb7jvUda+mtF7snjiEKPqwc9EQsQH6YCRcK2iLw3ULg62ZgwW7YjRyMEYbjLeQoTmGl0k0QZmdx8E+TcjvY1+LKyx8vfzDpuLsYjNPi9Vy05dBlnyvTO3N7cijeNGtQ/N6wpyOP4SPIGs5BpPlMRnYPayXsQOwCKMaKgEnz+XBtJ8hiisJcC9zQuhkRiVTw5Eskj9om4AERmEFlrDJZM7z1pJey/D/p/KOeGQBhERd1579+yDIAdG8gi4cfYdwV8iQCq53qhQvNllNCmN/DC/XstNiAS19U9vsmTitkRISqspvB8bHgQKnIVZO262DOXeD8KKBZh7zt5plj5vvXBt+AMikUsJARtL1UawRUkTE6UiWT7c19L2VVBIgANpme9OzeCX+W7hG2nz9CrOd3Z+0ItC0CL1/HvwZ8A0WCmviQjTROloUEVfcNIEGIYxDQeNIIIfA0vjQj8Hhd91naAJ5DgYkLX5wHWBiqxM+5lVdJeftBtyVCiSD70/HlFWpGpyoKeNCX4bWoaQAIdZqa3YaWoWdXULmZUWAmbiQ/noUY6Wn/uUbGT+qEOL9XkCZMJdsHTsoyLKn5KNO5GeJZugiSSySNzlmoN8d4+UC7vSU21/N4APkUzoRYBVT6ZCQlk6xq9J0EA/IZaKMDXq1/ahSEotfmnzqJUKIyUATudh9IsunomhT4rPzf0clr500TiOJVS0as+nRzaUpWRgD55xJ9/Fbb+gRqog1A1YCQUjZM9SHwdzIBNqpCha5pDc+QVCwNQuJ6LNXGLrCkCSh3ju1AgYQ1w4erzMYxrT2jktHjqPzmU4oegahRgscJJ8Jum6d5k5mh8qKFEhWKZZ65MvgrgezLdRTxA1P2zBVNoT+CsuowNUDeg+gFhF0AiT+iPVc8TIiqeCDaodYwS9EHlg0DGDqQ4iZmSQVD/VuVuIr8QljxkMEnyZCTHZYgM1i8MACD5VG1wYSpfIb8e5uJs6EnQk8gf9OmHMSRrsoomFCw6YKQO34XUzUBOKVDKAi6E2on2Aw6LweQj7R0YAD4pg1aMevKjx+KiKCRwK5/TGAIaBLoa8jXoYRwfIE2HmwgCpIDVQh4ZFbCx8YZQmDRSS2RTKYXxIuU7MgiFtjavFktdOyL9ya7XOrYAqzVNhpTsZYmlT4VGXg3R3IXdLXi1jzqnP5J8LsLIP1Ni6wqQKS9N1awsWek79voEMeg/kQGkomdSdxFFNILgHMYUrKyhXOdFu7AL7IwjxgNcdH6+UCi4F8vJchNjBVSv9IWi6VhkAJk0bVIWu4MWuj54/wPz6RdLYYS2agkJYvGJ1PuQr8juzFm+hPiVsI0QjEHIwH0X1U8tWCLN2YZlTc2TRlCSYzh6N16/QRXSDZ3S/qyNBOQLp4JnMVQIC6a0a80/oz7ABRKk99hGgsB/vIfrlwgMImK4C/H+PM/FcrUbX6ApwEVsG7Ojpzat5hCwS6FRHWKPQ/6KwA0j0rRzblXxi8n0ZmHMNBInhmXrPtoqmCRuptdr4IN9iDtdp3jR5xzC6QWcPuqXq3cFK4hUSxB2r1E8QNT7hZdla1+ANhXvBI/GNadejIAPpNAvvyXRY6+B1WQyy4kTAOQMsgIdf/kF1xySPXLGR3Pb3l6oX/GeifoqNXmw+5YLHsMQc26pSrfeji1cw3aAeJxI77TmNUC1jMB2gdV55Vgi4CoUoxo/qW1/edDFeOh71KWCdSAilDJfbdUQeLpEjCLz2lKoDUW6H2OdqHe0seGWzCAvJecF4ZBdTCnmKcaW64mgzZP01uh8a80mdKh5gpT5PM8hRzHo/l5Oii0gQ00nPfHZ+v4xtWovFHvNcp7lnt0g+Vuh3TK/+vp5rwjUVlulhul4gD2dfwsJVMs2/AWrMGY6B9IVKoJedR0L5oLUp0giTVMGaRhXuvo1MmitgNkUNlOgm9Y1BYgA+HFLWNlcQdQwcN7nxNxfkGxBgkSGuFDXpNt14K/vnej6m8AXir5lF1i5g9WPDLBdeSBSggV4C/kXnqTIrghxElEk5zQSIKIHGxrqSaIbq/O6yfWx5QaBoJvjTeQGyCLiUYuFLrdIs26pHSCGvO2wtFTPj+laug/StsUok9xih2KIBiAApfT80HHpdK1IxKZrWOIBIsATeUA9cCHjoT+5TOAqTaT+ZW96bnHvYeU/WK3keSlMudxFNb2CYCev1i+wZUWURhE6SQXY3NBm14hRmOiHEKMgGkwv+flxJIv/P44hzs0GG9hK0NgyBEUDEt8v9pGua69eGg1Muj49T1v3eKSrVc/3kf6b2cHP0gIWMp9p6yDfb95FGDU5K3uC1gpkvMVlvOGeDLG6Xj8nEdIu3gvPGCNZnwpTnPiePX2ChyuVNSLwlm6985ueh9RQpBtkHhTWWF2n7Ayr70+kg4Ufrwt8W/e9iAd4ygcwzdOMncUjZoosllyzZzrWfelZAiDl7b7ot8HHohwBzN6wxUdKEE7FVcxeS6kUnqPKp165FGnzhECVTv5FFY4NHi/9wEKlntK1e34d4D9H6LtMD08fygCIk6+ogwATSIBjLRRqGQIt9R/Qb0lU8dYLCM/XMoA8R69mkSNQFkaaqme42BaE9wjFZbk+mmTzSwFsRcZ32Ooev00dLxQvoPo+Bfxrlsb0OOr5O8Dfu4duSJtSR0EvX5HNlBikpmBNwYogJKXAXR0n/evssoiU7p9oHqvxoCrYtiF0aanmAueglGepw3b3f2tHiyDVkMKEOMVntD12sIsYO/33gjojFYQzSfVZ2fbNPs9fbpQgZoLRazuAEjyuyQSrFa2NQ4qEJ+nkof/Gqk8LTFztvzWWHeyOtYqUpQ22BpbqUeNo4jgFq6X9Te/ZM+Lr3+X8u9xvz58fAXuF50cWOT+XAijpNJJxbCK2t4L1hBWXK24LgCuevyGkpdfM2YLSqEYaSSuXsqc9Ca4878KwtNQMKvgTYWux8BTH2+/FJW4Cb1MdTITArWs3s3Y2VrAGIK1gdZuV72GD56f3u04B0mcrmQAt5fHpQCm0TNv4r61k7r8lH+xdA/5Z5uUSGxi33lPOpaSldgS8P+IP036OKQDc2U+t6qv6drJiN30FT6RrbQFwz26gn7W67pkt1OjVq2TeWMlPyATx1EZ2MZlun3F9vDaREWK9Ao3lyGiUqKGrRcYuRgnPOcLQ5Lc89zl2GRH34rQVNbPXnpLGZVuWr3P9tSiea2wl1fP39g+gNusNXdB2PEcrTeCKmriXYr5LNbT6KZQgzVBK3a9sa48GoHTMKYtaxrPkB4RYOjTMjvYEXrSLFbrLHNYBIlfvuWc7SK5PgZ86j/bu91RUMDW+z7M2jFjd9IqaGEbNnzzFkWcrZxJauqrpN9xHGYWuIZUUnNwbZ5LPOG/ILPOWWnYRlZxMaEpxdoG5E4T5LLvCFuB32jsDfysvYKtpwF19cLGzwiX8SN0vtRus9H7JS1Bm6XAimYApqH8xsjadAIRIXWnk5g4b5BpGsyUHcHK7VGr1XlvzscfL3wF4V4XJZ1yfNoLhFoVUSPB/AZXZ0QWMzpE4AAAAAElFTkSuQmCC"};var eu={dataUrl:"data:image/png;base64,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",nativePath:"rbxasset://textures/particles/fire_main.dds",source:"https://raw.githubusercontent.com/kiemfp/Roblox/master/content/textures/particles/fire_main.dds"};var da;async function vx(){return typeof document>"u"?null:(da||(da=new Xe().loadAsync(tu.dataUrl).catch(i=>{throw da=void 0,i})),(await da).clone())}var fa=new Map,yx=async i=>{let t=await fetch(`https://assetdelivery.roblox.com/v2/assetId/${i}`);if(!t.ok)throw new Error(`Gear metadata failed (${t.status})`);let e=(await t.json())?.locations?.[0]?.location;if(!e)throw new Error("Gear metadata has no public location.");return e},Be=(i,t=0)=>i!=null&&String(i).trim()!==""&&Number.isFinite(Number(i))?Number(i):t,Xt=(i,t,e)=>i.match(new RegExp(`<${t} name=["']${e}["'][^>]*>([\\s\\S]*?)</${t}>`))?.[1]?.trim()||"",ds=i=>({x:Be(i.match(/<X>([^<]*)<\/X>/)?.[1]),y:Be(i.match(/<Y>([^<]*)<\/Y>/)?.[1]),z:Be(i.match(/<Z>([^<]*)<\/Z>/)?.[1])}),Vc=i=>({r:Be(i.match(/<R>([^<]*)<\/R>/)?.[1]),g:Be(i.match(/<G>([^<]*)<\/G>/)?.[1]),b:Be(i.match(/<B>([^<]*)<\/B>/)?.[1])}),nu=(i,t)=>{let e=Xt(i,"Color3",t);if(/<R>/.test(e))return Vc(e);let n=Number(e)>>>0;return{r:(n>>>16&255)/255,g:(n>>>8&255)/255,b:(n&255)/255}},ir=i=>Xt(i,"bool","Enabled").toLowerCase()==="true",$n=i=>(i.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi)||[]).map(Number),Mx=i=>Xt(i,"Content","Texture").match(/(?:id=|rbxassetid:\/\/)(\d+)/i)?.[1];function su(i){let t=[],e=[];for(let n of i.matchAll(/<Item class="([^"]+)"[^>]*>|<\/Item>/g))if(n[1]){let s={className:n[1],start:n.index+n[0].length,end:0,parent:e.at(-1)};t.push(s),e.push(t.length-1)}else{let s=e.pop();s!==void 0&&(t[s].end=n.index)}return t}var Ax=(i,t,e)=>{let n=su(i),s=new Set(t);return n.filter(r=>s.has(r.className)&&(!e||n[r.parent]?.className===e)).map(r=>({...r,body:i.slice(r.start,r.end)}))},En=i=>i.split("<Item",1)[0];function Sx(i){i=i.replace(/<!--[\s\S]*?-->/g,"").replace(/<ProtectedString[\s\S]*?<\/ProtectedString>/g,"").replace(/<!\[CDATA\[[\s\S]*?\]\]>/g,"");let t=su(i),e=(h,f)=>{let p=new Set(h);return t.filter(g=>p.has(g.className)&&(!f||t[g.parent]?.className===f)).map((g,x)=>({...g,index:t.indexOf(g),body:i.slice(g.start,g.end)}))},n=e(["Part"]).find(h=>Xt(En(h.body),"string","Name")==="Handle"),s=n?n.index:-1,r=n&&e(["SpecialMesh"],"Part").find(h=>h.parent===s&&Xt(En(h.body),"string","Name")==="Mesh"),o=r?{id:Xt(r.body,"Content","MeshId").match(/id[=\/](\d+)/i)?.[1],scale:ds(Xt(r.body,"Vector3","Scale")),offset:ds(Xt(r.body,"Vector3","Offset"))}:null,a=new Map(e(["Attachment"],"Part").filter(h=>h.parent===s).map(h=>[Xt(En(h.body),"string","Name"),ds(Xt(En(h.body),"CoordinateFrame","CFrame"))])),l=[];for(let h of e(["Sparkles","PointLight"],"Part").filter(f=>f.parent===s)){if(!ir(h.body))continue;let f=Xt(En(h.body),"string","Name");h.className==="Sparkles"&&l.push({kind:"sparkles",name:f,color:Vc(Xt(h.body,"Color3","SparkleColor"))}),h.className==="PointLight"&&l.push({kind:"pointLight",name:f,color:Vc(Xt(h.body,"Color3","Color")),brightness:Be(Xt(h.body,"float","Brightness")),range:Be(Xt(h.body,"float","Range"))})}for(let h of e(["Fire"],"Part").filter(f=>f.parent===s))ir(h.body)&&l.push({kind:"fire",name:Xt(En(h.body),"string","Name"),color:nu(h.body,"Color"),secondaryColor:nu(h.body,"SecondaryColor"),size:Be(Xt(h.body,"float","size_xml")),heat:Be(Xt(h.body,"float","heat_xml"))});let c=e(["ParticleEmitter"]).filter(h=>h.parent===s||t[h.parent]?.className==="Attachment"&&t[h.parent]?.parent===s).filter(h=>ir(h.body)).map(h=>({kind:"particleEmitter",textureId:Mx(h.body),parentIndex:h.parent,rate:Be(Xt(h.body,"float","Rate")),lifetime:$n(Xt(h.body,"NumberRange","Lifetime")),speed:$n(Xt(h.body,"NumberRange","Speed")),size:$n(Xt(h.body,"NumberSequence","Size")),transparency:$n(Xt(h.body,"NumberSequence","Transparency")),color:$n(Xt(h.body,"ColorSequence","Color")),acceleration:ds(Xt(h.body,"Vector3","Acceleration")),rotation:$n(Xt(h.body,"NumberRange","Rotation")),rotSpeed:$n(Xt(h.body,"NumberRange","RotSpeed")),spread:$n(Xt(h.body,"Vector2","SpreadAngle")),direction:Be(Xt(h.body,"token","EmissionDirection"),1),drag:Be(Xt(h.body,"float","Drag")),lightEmission:Be(Xt(h.body,"float","LightEmission")),parentPosition:t[h.parent]?.className==="Attachment"?ds(Xt(En(i.slice(t[h.parent].start,t[h.parent].end)),"CoordinateFrame","CFrame")):{x:0,y:0,z:0}})),u=e(["Trail"],"Part").filter(h=>h.parent===s&&ir(h.body)).map(h=>({kind:"trail",name:Xt(En(h.body),"string","Name"),attachment0:Xt(h.body,"Ref","Attachment0"),attachment1:Xt(h.body,"Ref","Attachment1")}));return{mesh:o,handleSize:n?ds(Xt(En(n.body),"Vector3","size")||Xt(En(n.body),"Vector3","Size")):{x:1,y:1,z:1},attachments:a,staticEffects:[...l,...c],trails:u,disabledEmitters:Ax(i,["ParticleEmitter","Fire","Smoke"]).filter(h=>!ir(h.body)).length}}var iu=i=>i?.traverse(t=>{t.geometry?.dispose?.(),t.material?.map?.dispose?.(),t.material?.dispose?.()});async function Ex(i,t,e,n,s){if(!t.textureId||typeof document>"u")return null;let r=Math.max(...t.lifetime,.01),o=Math.min(32,Math.ceil(t.rate*r));if(!o)return null;let a=await n(t.textureId,s),l=await new Promise((d,S)=>{let E=()=>S(new DOMException("Aborted","AbortError"));if(s.aborted)return E();s.addEventListener("abort",E,{once:!0}),new Xe().load(a,M=>{s.removeEventListener("abort",E),s.aborted?(M.dispose(),E()):d(M)},void 0,M=>{s.removeEventListener("abort",E),S(M)})});l.colorSpace=ie;let c=new Je,u=new T(t.parentPosition.x,t.parentPosition.y,t.parentPosition.z),h=d=>{let S=Math.sin(d*127.1+311.7)*43758.5453;return S-Math.floor(S)},f=(d,S,E=0)=>d.length?d[0]+((d[1]??d[0])-d[0])*S:E,p=(d,S,E,M=1,C=1)=>{if(d.length<E)return C;for(let w=E;w<d.length;w+=E)if(S<=d[w]){let I=(S-d[w-E])/Math.max(d[w]-d[w-E],1e-6);return qe.lerp(d[w-E+M],d[w+M],I)}return d[d.length-E+M]},g=[new T(1,0,0),new T(0,1,0),new T(0,0,1),new T(-1,0,0),new T(0,-1,0),new T(0,0,-1)][t.direction]||new T(0,1,0),x=new Ue().setFromUnitVectors(new T(0,1,0),g),m=new T(t.acceleration.x,t.acceleration.y,t.acceleration.z).transformDirection(i.matrixWorld.clone().invert()).multiplyScalar(Math.hypot(t.acceleration.x,t.acceleration.y,t.acceleration.z));for(let d=0;d<o;d++){let S=new hi({map:l,transparent:!0,depthWrite:!1,blending:t.lightEmission>=.5?pi:Un}),E=new Ji(S);c.add(E);let M=qe.degToRad((h(d*5+1)-.5)*(t.spread[0]||0)),C=qe.degToRad((h(d*5+2)-.5)*(t.spread[1]||0)),w=new T(Math.tan(M),1,Math.tan(C)).normalize().applyQuaternion(x).multiplyScalar(f(t.speed,h(d*5+3)));E.userData.tick=I=>{let N=Math.max(f(t.lifetime,h(d*5+4),1),.01),b=(Math.max(0,I)+d/o*N)%N,A=b/N,P=t.drag>0?(1-Math.exp(-t.drag*b))/t.drag:b;E.position.copy(e(u.clone().addScaledVector(w,P))).addScaledVector(m,.5*b*b),E.scale.setScalar(Math.max(0,p(t.size,A,3))),S.opacity=qe.clamp(1-p(t.transparency,A,3,1,0),0,1),S.color.setRGB(p(t.color,A,5,1),p(t.color,A,5,2),p(t.color,A,5,3)).convertSRGBToLinear(),S.rotation=qe.degToRad(f(t.rotation,h(d+1))+f(t.rotSpeed,h(d+2))*b)}}return c.userData.tick=d=>c.children.forEach(S=>S.userData.tick(d)),c.userData.tick(1),c}async function bx(i,t,e){let n=`${i}:${t}`;return fa.has(n)||fa.set(n,(async()=>{let s=await t(i,e),r=await fetch(s,{signal:e});if(!r.ok)throw new Error(`Gear model failed (${r.status})`);return Sx(await r.text())})().catch(s=>{throw fa.delete(n),s})),fa.get(n)}async function _x(i,t,e,n){let r=new xe,o=new ae(new Float32Array(72),3);r.setAttribute("position",o);let a=g=>{let x=Math.sin(g*127.1+311.7)*43758.5453;return x-Math.floor(x)},l=new Rt(t.r,t.g,t.b).convertSRGBToLinear(),c=await vx();c&&(c.needsUpdate=!0);let u=e(new T),h=i.localToWorld(e(new T(0,1,0))).distanceTo(i.localToWorld(u)),f=new Ge({color:l,map:c,size:.5*h,transparent:!0,opacity:.9,depthWrite:!1,blending:pi}),p=new un(r,f);return p.userData.tick=g=>{for(let x=0;x<24;x++){let m=((Number(g)+x/24*2)%2+2)%2,d=new T((a(x*3+1)-.5)*n.x,(a(x*3+2)-.5)*n.y,(a(x*3+3)-.5)*n.z);d.addScaledVector(new T(a(x+71)-.5,a(x+91)-.2,a(x+113)-.5),m*.3);let S=e(d);o.setXYZ(x,S.x,S.y,S.z)}o.needsUpdate=!0,r.computeBoundingSphere()},p.userData.tick(1),p}async function wx(i,t,e){let n=typeof document>"u"?null:await new Xe().loadAsync(eu.dataUrl),s=new Je,r=24,o=i.localToWorld(e(new T)),a=Math.max(i.localToWorld(e(new T(0,1,0))).distanceTo(o),.01),l=h=>{let f=Math.sin(h*127.1+311.7)*43758.5453;return f-Math.floor(f)},c=new Rt(t.color.r,t.color.g,t.color.b).convertSRGBToLinear(),u=new Rt(t.secondaryColor.r,t.secondaryColor.g,t.secondaryColor.b).convertSRGBToLinear();for(let h=0;h<r;h++){let f=new hi({map:n,transparent:!0,depthWrite:!1,blending:pi}),p=new Ji(f);s.add(p),p.userData.tick=g=>{let x=Number(g)*(.7+t.heat*.04)+h/r,m=(x%1+1)%1,d=i.localToWorld(e(new T((l(h*3+1)-.5)*t.size*.35,0,(l(h*3+2)-.5)*t.size*.25)));d.y+=m*a*t.size*.7,p.position.copy(i.worldToLocal(d)),p.scale.setScalar(a*Math.max(t.size,0)*(.22+.12*(1-m))/Math.max(i.getWorldScale(new T).y,.001)),f.color.copy(c).lerp(u,m),f.opacity=.85*(1-m)}}return s.userData.tick=h=>s.children.forEach(f=>f.userData.tick(h)),s.userData.tick(1),s}async function ru(i,t,e={}){let n=e.signal||new AbortController().signal,s=e.deliveryUrl||yx,r=e.readMesh,o=e.matchMesh,a=[...new Map((t||[]).filter(d=>[19,8].includes(Number(d?.assetType))&&Number.isSafeInteger(Number(d?.id))).map(d=>[Number(d.id),d])).values()].sort((d,S)=>Number(S.assetType)-Number(d.assetType)).slice(0,20),l=[],c=[],u=[],h=[],f=[];async function p(d){if(n.aborted)throw new DOMException("Aborted","AbortError");try{let S=new AbortController,E=()=>S.abort(),M=setTimeout(()=>S.abort(),2500);n.addEventListener("abort",E,{once:!0});let C;try{C=await bx(Number(d.id),s,S.signal)}finally{clearTimeout(M),n.removeEventListener("abort",E)}let w=C.staticEffects.length&&C.mesh&&r?await r(C.mesh.id,C.mesh):null,I=w&&o?o(i,w,C.mesh):null,N=I?.node||(I?.isObject3D?I:null);if(!N){l.push({id:Number(d.id),attached:!1,reason:C.staticEffects.length?"mesh-not-matched":"no-supported-effects",effects:C.staticEffects.map(P=>P.kind)});return}let b=I.mapPosition||(P=>P.clone());for(let P of C.staticEffects){let F;if(P.kind==="sparkles")F=await _x(N,P.color,b,C.handleSize);else if(P.kind==="fire")F=await wx(N,P,b);else if(P.kind==="particleEmitter"){try{F=await Ex(N,P,H=>b(H),s,n)}catch{F=null}if(!F)continue}else F=new Xs(new Rt(P.color.r,P.color.g,P.color.b).convertSRGBToLinear(),P.brightness,P.range),F.position.copy(b(new T));if(n.aborted)throw iu(F),new DOMException("Aborted","AbortError");F.name=`LarpbloxGear${P.kind[0].toUpperCase()}${P.kind.slice(1)}`,F.userData.avatarEffectAssetType=Number(d.assetType),N.add(F),c.push(F),P.kind==="sparkles"&&u.push(F),P.kind==="particleEmitter"&&h.push(F),P.kind==="fire"&&f.push(F)}let A=[...C.attachments].map(([P,F])=>({name:P,position:b(new T(F.x,F.y,F.z)).toArray()}));l.push({id:Number(d.id),attached:!0,meshId:C.mesh?.id,effects:C.staticEffects.map(P=>P.kind),trails:C.trails.length,attachmentPositions:A,disabledEmitters:C.disabledEmitters})}catch(S){if(n.aborted)throw S;l.push({id:Number(d.id),attached:!1,reason:String(S.message||S)})}}let g=0;async function x(){for(;g<a.length;){let d=a[g++];await p(d)}}let m=()=>{for(let d of c)d.removeFromParent(),iu(d)};if(await Promise.allSettled(Array.from({length:Math.min(3,a.length)},x)),n.aborted)throw m(),new DOMException("Aborted","AbortError");return{update(d=0){for(let S of u)S.userData.tick(d),S.material.opacity=.72+.18*(.5+.5*Math.sin(Number(d)*2.1));for(let S of h)S.userData.tick(Number(d));for(let S of f)S.userData.tick(Number(d))},dispose:m,diagnostics:l}}var lu=/^https:\/\/[a-z0-9-]+\.rbxcdn\.com\/[A-Za-z0-9._~%/-]+(?:\?[^#]*)?$/,hu=/^[A-Za-z0-9._~-]+$/,fs=new Map,Gc=Object.freeze({normal:6991140417,halloween:6991166143,thanksgiving:6991393806,birthday:2399316028,stpatricks:2399447918,valentines:2399448372}),Tx=new Set(["auto",...Object.keys(Gc),"christmas","aprilfools"]),pa=new Map,sr,Cx=1055299,Rx=1045320,Px=1055256,rr;function xa(i){let t=new Uint8Array(i),e=new DataView(i),s=new TextDecoder().decode(t.subarray(0,32)).match(/^version (\d+\.\d+)/)?.[1],r=t.indexOf(10)+1;if(!r||!s)throw new Error("Invalid hat mesh");if(s==="1.00"||s==="1.01"){let S=new TextDecoder().decode(t).trim().split(/\r?\n/),E=[...S.slice(2).join("").matchAll(/\[([^\]]+)\]/g)].map(w=>w[1].split(",").map(Number));if(E.length!==Number(S[1])*9)throw new Error("Invalid hat mesh");let M=[],C=[];for(let w=0;w<E.length;w+=3)M.push(...E[w].map(I=>I*(s==="1.00"?.5:1))),C.push(E[w+2][0],1-E[w+2][1]);return{positions:M,uvs:C}}let o=Number(s[0]);if(![2,3,4].includes(o)||i.byteLength<r+12)throw new Error("Unsupported hat mesh");let a=e.getUint16(r,!0),l=o===4?40:e.getUint8(r+2),c=o===4?12:e.getUint8(r+3),u=r+(o===3?8:4),h=e.getUint32(u,!0),f=e.getUint32(u+4,!0),p=r+a,g=o===4?e.getUint16(r+14,!0):0,x=p+h*(l+(g?8:0));if(l<32||c<12||!f||f>1e5||x+f*c>i.byteLength)throw new Error("Invalid hat mesh");let m=[],d=[];for(let S=0;S<f;S++)for(let E=0;E<3;E++){let M=e.getUint32(x+S*c+E*4,!0);if(M>=h)throw new Error("Invalid hat mesh index");let C=p+M*l;for(let w=0;w<3;w++)m.push(e.getFloat32(C+w*4,!0));d.push(e.getFloat32(C+24,!0),1-e.getFloat32(C+28,!0))}if(![...m,...d].every(Number.isFinite))throw new Error("Invalid hat mesh coordinates");return{positions:m,uvs:d}}function Ix(){return sr||(sr=ms(2399307491).then(i=>fetch(i)).then(i=>{if(!i.ok)throw new Error("Hat mesh unavailable");return i.arrayBuffer()}).then(xa),sr.catch(()=>{sr=void 0})),sr}function Dx(){return rr||(rr=ms(Rx).then(i=>fetch(i)).then(i=>{if(!i.ok)throw new Error("Teapot mesh unavailable");return i.arrayBuffer()}).then(xa),rr.catch(()=>{rr=void 0})),rr}async function Lx(){let i=await ms(Px),t=await new Xe().loadAsync(i);return t.colorSpace=ie,t}function ga(i){let t,e=[],n=new pe;i.traverse(l=>{if(l.isMesh){if(/^Head$/i.test(l.name))t=l;else if(/^Player\d+$/i.test(l.name)){let c=new pe().setFromObject(l);c.isEmpty()||(e.push({part:l,center:c.getCenter(new T),size:c.getSize(new T)}),n.union(c))}}});let s=n.getCenter(new T),r=n.getSize(new T).y,o=e.find(({center:l,size:c})=>l.y>s.y&&Math.max(c.x,c.y,c.z)<r*.03),a=l=>l.y-Math.hypot(l.x-s.x,l.z-s.z);if(e.length>=10){let l=f=>e.map(p=>p.center[f]).sort((p,g)=>p-g)[Math.floor(e.length/2)],c=l("x"),u=l("z"),h=e.filter(({center:f,size:p})=>Math.hypot(f.x-c,f.z-u)<=r*.12&&p.y>=Math.max(p.x,p.z)*.5);if(h.length)return t||o?.part||h.sort((f,p)=>p.center.y-f.center.y)[0].part}return e.sort((l,c)=>a(c.center)-a(l.center)),t||o?.part||e[0]?.part}async function Ux(i,t,e){if(!(t?.assets||[]).some(x=>Number(x?.id)===Cx))return null;let n=await ti(Dx(),e),s=!1;if(i.traverse(x=>{!s&&x.isMesh&&va(x.geometry,n)&&(s=!0)}),s)return null;let r=ga(i);if(!r)throw new Error("Teapot preview has no exported head.");let o=Lx();o.then(x=>{e.aborted&&x.dispose()},()=>{});let a=await ti(o,e),l=new xe;l.setAttribute("position",new ae(n.positions,3)),l.setAttribute("uv",new ae(n.uvs,2)),l.computeVertexNormals();let c=new Gs({map:a,color:16777215,side:Ye}),u=new be(l,c);u.name="LarpbloxTeapotTurret";let h=Number(t?.scales?.head)>0?Number(t.scales.head):1;u.scale.setScalar(2.4*h),i.updateMatrixWorld(!0);let f=new pe().setFromObject(r),p=f.getCenter(new T),g=new T(p.x,f.max.y-.25*h,p.z-.1*h);return i.worldToLocal(g),u.position.copy(g),i.add(u),u}function va(i,t){let e=i.getAttribute("position"),n=i.index,s=n?.count||e?.count;if(!e||s*3!==t.positions.length)return null;let r=f=>[e.getX(f),e.getY(f),e.getZ(f)],o=(f,p)=>Math.hypot(...f.map((g,x)=>g-p[x])),a=Array.from({length:s},(f,p)=>r(n?n.getX(p):p)),l=Array.from({length:s},(f,p)=>t.positions.slice(p*3,p*3+3)),c=f=>f.flatMap((p,g)=>g%3?[]:[o(f[g],f[g+1]),o(f[g+1],f[g+2]),o(f[g+2],f[g])]),u=c(a),h=u.reduce((f,p)=>Math.max(f,p),0);if(!h)return null;for(let f of[[0,1,2],[2,1,0],[1,2,0],[0,2,1],[2,0,1],[1,0,2]]){let p=l.map((m,d)=>l[d-d%3+f[d%3]]),g=c(p),x=g.reduce((m,d)=>Math.max(m,d),0);if(!(!x||g.some((m,d)=>Math.abs(m/x-u[d]/h)>.015)))return n?null:new ae(a.flatMap((m,d)=>{let S=(d-d%3+f[d%3])*2;return t.uvs.slice(S,S+2)}),2)}return null}function Wc(i,t,e){let n=new T(e.scale.x,e.scale.y,e.scale.z),s=new T(e.offset.x,e.offset.y,e.offset.z),r=Array.from({length:t.positions.length/3},(l,c)=>new T().fromArray(t.positions,c*3).multiply(n).add(s)),o={...t,positions:r.flatMap(l=>l.toArray())},a;return i.traverse(l=>{if(a||!l.isMesh||!va(l.geometry,o))return;let c=l.geometry.getAttribute("position"),u=l.geometry.index,h=r.map((p,g)=>new T().fromBufferAttribute(c,u?u.getX(g):g)),f=(p,g,x)=>{let m=g.clone().sub(p),d=x.clone().sub(p),S=m.clone().cross(d);if(!(S.lengthSq()<1e-12))return S.normalize().multiplyScalar(Math.sqrt(m.length()*d.length())),new se().makeBasis(m,d,S).setPosition(p)};for(let p of[[0,1,2],[2,1,0],[1,2,0],[0,2,1],[2,0,1],[1,0,2]]){let g=r.map((M,C)=>r[C-C%3+p[C%3]]),x=g.findIndex((M,C)=>C%3===0&&f(g[C],g[C+1],g[C+2]));if(x<0)continue;let m=f(g[x],g[x+1],g[x+2]),d=f(h[x],h[x+1],h[x+2]);if(!d)continue;let S=d.multiply(m.invert()),E=Math.max(new pe().setFromBufferAttribute(c).getSize(new T).length()*.015,1e-4);if(!g.some((M,C)=>M.clone().applyMatrix4(S).distanceTo(h[C])>E)){a={node:l,mapPosition:M=>M.clone().applyMatrix4(S)};break}}}),a}function uu(i="auto",t=new Date){if(i=Tx.has(i)?i:"auto",i!=="auto")return i;let e=t.getMonth()+1,n=t.getDate();return e===2&&n>=9&&n<=16?"valentines":e===3&&n>=12&&n<=19?"stpatricks":e===4&&n===1?"aprilfools":e===8&&n===27?"birthday":e===10&&n>=22&&n<=31?"halloween":e===11&&n>=20&&n<=30?"thanksgiving":e===12&&n>=18&&n<=27?"christmas":"normal"}function or(i){try{return new URL(i).pathname.replace(/^\//,"")}catch{return""}}function Nx(i,t){return!!(or(i)&&or(i)===or(t))}async function ms(i,t){let e=await fetch(`https://assetdelivery.roblox.com/v2/assetId/${i}`,{signal:t,credentials:"include"});if(!e.ok)throw new Error("Smokestack texture unavailable");return Si((await e.json()).locations?.[0]?.location)}function du(i){if(!pa.has(i)){let t=ms(i).then(e=>new Xe().loadAsync(e)).then(e=>(e.colorSpace=ie,e));pa.set(i,t),t.catch(()=>pa.delete(i))}return pa.get(i)}function ou(i){let t=i?.naturalWidth||i?.videoWidth||i?.width,e=i?.naturalHeight||i?.videoHeight||i?.height;if(!t||!e||typeof document>"u")return null;try{let n=document.createElement("canvas");n.width=n.height=16;let s=n.getContext("2d",{willReadFrequently:!0});return s.drawImage(i,0,0,16,16),`${t}x${e}:${Array.from(s.getImageData(0,0,16,16).data).join(",")}`}catch{return null}}async function Fx(i,t){if(!Number.isSafeInteger(i)||i<=0)throw new Error("Invalid avatar background");if(fs.has(i))return fs.get(i);let e;try{let n=await fetch(`https://assetdelivery.roblox.com/v2/assetId/${i}`,{signal:t,credentials:"include"});if(!n.ok)throw new Error("Background definition unavailable");let s=(await n.json()).locations?.[0]?.location,r=await fetch(Si(s),{signal:t,credentials:"omit"});if(!r.ok)throw new Error("Background definition unavailable");let a=[...new DOMParser().parseFromString(await r.text(),"application/xml").querySelectorAll('Item[class="IntValue"]')].find(u=>u.querySelector('Properties > string[name="Name"]')?.textContent.trim()==="ImageId"),l=Number(a?.querySelector('Properties > int64[name="Value"], Properties > int[name="Value"]')?.textContent.trim());if(!Number.isSafeInteger(l)||l<=0)throw new Error("Invalid background image");let c=await fetch(`https://assetdelivery.roblox.com/v1/asset/?id=${l}`,{signal:t,credentials:"include"});if(!c.ok)throw new Error("Background image unavailable");if(lu.test(c.url))e=c.url;else{let u=await c.blob();e=await new Promise((h,f)=>{let p=new FileReader;p.onload=()=>h(p.result),p.onerror=f,p.readAsDataURL(u)})}}catch(n){if(t.aborted)throw n}if(!e){let n=await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${i}&size=768x432&format=Png&isCircular=false`,{signal:t,credentials:"omit"});if(!n.ok)throw new Error("Background preview unavailable");let s=(await n.json()).data?.find(r=>Number(r.targetId)===i);if(s?.state!=="Completed"||!s.imageUrl)throw new Error("Background preview unavailable");e=Si(s.imageUrl)}if(fs.size>=16){let n=fs.keys().next().value;fs.delete(n)}return fs.set(i,e),e}function Bx(i){let t=31;for(let e of String(i))t=(t^e.charCodeAt(0))%8;return t}function ma(i){if(String(i).startsWith("https://"))return Si(i);if(!hu.test(String(i)))throw new Error("Invalid Roblox asset hash");return`https://t${Bx(i)}.rbxcdn.com/${i}`}function Si(i){let t=new URL(i,location.href).href;if(!lu.test(t))throw new Error("Refused non-CDN avatar asset URL");return t}function Ei(){return new DOMException("Avatar load aborted","AbortError")}function ti(i,t){if(t.aborted)return Promise.reject(Ei());let e;return Promise.race([i,new Promise((n,s)=>{e=()=>s(Ei()),t.addEventListener("abort",e,{once:!0})})]).finally(()=>t.removeEventListener("abort",e))}function au(i,t){return{position:i.position.toArray(),target:t.target.toArray(),zoom:i.zoom}}function Ox(i,t,e){if(!e)return!1;let n=e.position||e.camera?.position,s=e.target||e.controls?.target;return Array.isArray(n)&&n.length===3&&i.position.fromArray(n),Array.isArray(s)&&s.length===3&&t.target.fromArray(s),Number.isFinite(e.zoom)&&(i.zoom=e.zoom),Array.isArray(n)||Array.isArray(s)||Number.isFinite(e.zoom)}function zx(i){let t=i?.position,e=i?.direction;if(!t||!e)return null;let n=new T(t.x,t.y,t.z),s=new T(e.x,e.y,e.z);return{position:n.toArray(),direction:s.toArray()}}function fu(i,t){let e=t.getSize(new T),n=ga(i),s=n&&new pe().setFromObject(n);(!s||s.isEmpty())&&(s=t.clone(),s.min.y=t.min.y+e.y*.65);let r=s.getSize(new T),o=s.getCenter(new T),a=s.min.y-r.y*.25,l=new pe;i.traverse(f=>{f.userData.avatarEffectAssetType===8&&l.union(new pe().setFromObject(f.parent))});let c=Math.max(s.max.y,t.max.y,l.isEmpty()?-1/0:l.max.y);o.y=(a+c)/2;let u=l.isEmpty()?r.x/2:Math.max(r.x/2,o.x-l.min.x,l.max.x-o.x),h=Math.max(Math.hypot(u,Math.max(c-o.y,o.y-a)),r.z/2,.25)*1.1;return{target:o,radius:h}}function pu(i,t){let e=new aa(t).parse(i,"");e.preload();for(let[n,s]of Object.entries(e.materials)){let r=e.materialsInfo[n],o=s.map&&r.rbx_alphamode?.trim().toLowerCase()==="overlay",a=/^Player\d+Mtl$/i.test(n);o?s.onBeforeCompile=u=>{u.fragmentShader=u.fragmentShader.replace("#include <map_fragment>",zt.map_fragment.replace("diffuseColor *= sampledDiffuseColor;","diffuseColor.rgb = mix( diffuseColor.rgb, sampledDiffuseColor.rgb, sampledDiffuseColor.a );"))}:s.map&&a&&s.color.setHex(16777215);let l=u=>{let h=u?.image,f=h?.currentSrc||h?.src||u?.userData?.url||"";try{let p=new URL(f);return`${p.hostname.toLowerCase().split(".").slice(-2).join(".")}${p.pathname.replace(/^\/+/,"")}`}catch{return String(f).replace(/[?#].*$/,"").replace(/^\/+/,"")}},c=s.alphaMap&&s.map&&(s.alphaMap===s.map||s.alphaMap.image&&s.map.image&&s.alphaMap.image===s.map.image||l(s.alphaMap)&&l(s.alphaMap)===l(s.map));s.alphaMap&&(o||c||r.map_kd&&r.map_d&&l({userData:{url:r.map_kd}})===l({userData:{url:r.map_d}}))&&(s.alphaMap!==s.map&&s.alphaMap.dispose(),s.alphaMap=null,s.transparent=s.opacity<1),(s.map||s.alphaMap)&&(s.alphaTest=.01),s.specular.setHex(0),s.side=Ye}return e}function mu(i){let t=0;return i.traverse(e=>{if(!e.isMesh)return;let n=e.geometry.getAttribute("position"),s=e.geometry.index;if(!n)return;let r=s?.count||n.count,o=new Set;for(let a=0;a+2<r;a+=3){let l=[0,1,2].map(p=>{let g=s?s.getX(a+p):a+p;return[n.getX(g),n.getY(g),n.getZ(g)].map(x=>Math.round(x*1e5)).join(",")});if(new Set(l).size!==3)continue;let c=l.indexOf([...l].sort()[0]),u=l[c],h=l[(c+1)%3],f=l[(c+2)%3];if(o.has(`${u}|${f}|${h}`)){let p=g=>{let x=g.clone();return x.side=Ve,x.onBeforeCompile=g.onBeforeCompile,x.customProgramCacheKey=g.customProgramCacheKey,x};e.material=Array.isArray(e.material)?e.material.map(p):p(e.material),t++;break}o.add(`${u}|${h}|${f}`)}}),t}async function Hx(i,t){let e=[];try{let n=await ti(du(Gc.normal),t),s=or(n.image?.currentSrc||n.image?.src||""),r=ou(n.image);i.traverse(o=>{if(!o.isMesh)return;(Array.isArray(o.material)?o.material:[o.material]).forEach((l,c)=>{let u=l?.map?.image,h=u?.currentSrc||u?.src||"";if(or(h)!==s&&(!r||ou(u)!==r))return;let f=l.clone();Array.isArray(o.material)?(o.material=[...o.material],o.material[c]=f):o.material=f,e.push({node:o,material:f,index:c,original:l.map,visible:o.visible,current:null})})})}catch(n){if(t.aborted)throw n}if(!e.length){let n=await ti(Ix(),t),s=[];if(i.traverse(r=>{if(!r.isMesh||Array.isArray(r.material))return;let o=va(r.geometry,n);o&&s.push({node:r,nativeUV:o})}),s.length===1){let{node:r,nativeUV:o}=s[0];r.material=r.material.clone(),e.push({node:r,material:r.material,original:r.material.map,visible:r.visible,current:null,nativeUV:o,exportedUV:r.geometry.getAttribute("uv")})}}return e}function kx(i,t,e){if(!t.length||!["halloween","thanksgiving","christmas","birthday","stpatricks","valentines"].includes(e))return null;let n=new pe;if(t.forEach(u=>n.expandByObject(u.node)),n.isEmpty())return null;let s=n.getCenter(new T),r=n.getSize(new T),o={halloween:16741422,thanksgiving:15181624,christmas:16186367,birthday:15879289,stpatricks:4306788,valentines:15753874}[e],a=[];for(let u=0;u<16;u++){let h=u*2.399963229728653;a.push(s.x+Math.cos(h)*(r.x*.6+u%3*.025),s.y+r.y*.25+u%5*r.y*.16,s.z+Math.sin(h)*(r.z*.6+u%3*.025))}let l=new xe;l.setAttribute("position",new ae(a,3));let c=new un(l,new Ge({color:o,size:Math.max(r.length()*.07,.035),sizeAttenuation:!0,transparent:!0,opacity:.9}));return c.name="LarpbloxSmokestackEffect",i.add(c),c}var ps=i=>i?.traverse?.(t=>{t.geometry?.dispose();let e=Array.isArray(t.material)?t.material:[t.material];for(let n of e)if(n){for(let s of["map","normalMap","roughnessMap","metalnessMap","emissiveMap","alphaMap"])n[s]?.dispose?.();n.dispose?.()}});async function cu(i,t){let e=await fetch(Si(i),{signal:t});if(!e.ok)throw new Error(`Avatar descriptor failed (${e.status})`);let n=await e.json();if(t.aborted)throw Ei();let s=ma(n.obj),r=ma(n.mtl),o=new Map((n.textures||[]).map(x=>[String(x),ma(x)])),[a,l]=await Promise.all([fetch(s,{signal:t}).then(x=>{if(!x.ok)throw new Error("Avatar OBJ failed");return x.text()}),fetch(r,{signal:t}).then(x=>{if(!x.ok)throw new Error("Avatar MTL failed");return x.text()})]);if(t.aborted)throw Ei();let c=new es;c.setURLModifier(x=>{if(String(x).startsWith("https://"))return Si(x);let m=decodeURIComponent(String(x)).split(/[\\/]/).pop(),d=m.replace(/\.[^/.]+$/,""),S=o.get(m)||o.get(d)||(hu.test(m)?ma(m):null);return Si(S||x)});let u=!1,h,f=new Promise((x,m)=>{h=x,c.onStart=()=>{u=!0},c.onLoad=x,c.onError=()=>m(new Error("Roblox could not load an avatar texture."))}),p=pu(l,c),g=new la(c).setMaterials(p).parse(a);mu(g),u||h();try{if(await ti(f,t),t.aborted)throw Ei();return{root:g,descriptor:n,objText:a,mtlText:l}}catch(x){throw ps(g),x}}function gu(i,t){let e=ga(i),n=ga(t),s=p=>{let g=[];return p.traverse(x=>{x.isMesh&&/^Player\d+$/i.test(x.name)&&g.push(x)}),g},r=s(i).filter(p=>p!==e),o=s(t).filter(p=>p!==n);if(!e||!n||r.length!==14||o.length!==14)return!1;let a=p=>new pe().setFromObject(p).getCenter(new T);if(!r.some(p=>o.every(g=>a(p).distanceTo(a(g))>.02)))return!1;let l=(p,g)=>{let x=a(g),m=p.map(E=>({node:E,p:a(E)})),d=E=>Math.hypot(E.x-x.x,E.z-x.z),S=Math.min(...m.map(({p:E})=>d(E)));return m.filter(({p:E})=>d(E)<=S+.05).sort((E,M)=>M.p.y-E.p.y)[0].node},c=a(l(o,n)).sub(a(l(r,e))),u=new pe().setFromObject(e),h=u.getSize(new T).y,f=[];i.traverse(p=>{if(!p.isMesh||/^Player\d+$/i.test(p.name))return;let g=new pe().setFromObject(p);if(g.min.y<u.min.y-h*.5||g.getCenter(new T).y<u.min.y)return;let x=p.geometry.getAttribute("position"),m=p.geometry.index,d={uvs:[],positions:Array.from({length:m?.count||x.count},(E,M)=>new T().fromBufferAttribute(x,m?m.getX(M):M).toArray()).flat()},S=Wc(t,d,{scale:{x:1,y:1,z:1},offset:{x:0,y:0,z:0}});if(S&&!/^Player\d+$/i.test(S.node.name)){let E=g.getCenter(new T);[new T,new T(1,0,0),new T(0,1,0),new T(0,0,1)].every(C=>{let w=E.clone().add(C);return S.node.localToWorld(S.mapPosition(p.worldToLocal(w.clone()))).distanceTo(w.add(c))<.02})&&f.push({node:p,placeholder:S.node})}});for(let p of f)p.node.position.add(c),i.attach(p.placeholder),t.attach(p.node);return e.position.add(c),i.attach(n),t.attach(e),!0}async function Vx(i,t,e={}){if(!i||typeof i.append!="function")throw new TypeError("A host element is required");let n=new AbortController,s=n.signal,r=e.signal,o=()=>n.abort();r?.addEventListener("abort",o,{once:!0}),r?.aborted&&n.abort();let a=!1,l,c,u,h,f,p,g,x,m,d=[],S,E,M=0,C,w,I,N={applied:!1},b,A=F=>{if(!m)return;let H=m.image,X=H.width/H.height,q=Math.min(1,F/X),G=Math.min(1,X/F);m.repeat.set(q,G),m.offset.set((1-q)/2,(1-G)/2),m.updateMatrix()},P=()=>{if(a||s.aborted)throw Ei()};try{let F=await cu(t,s),{descriptor:H,objText:X,mtlText:q}=F;if(g=F.root,P(),e.poseDescriptorUrl&&e.poseDescriptorUrl!==t){let it;try{it=await cu(e.poseDescriptorUrl,s),P(),gu(g,it.root)&&(I=g,g=it.root,N={applied:!0,descriptorUrl:e.poseDescriptorUrl},it=void 0)}catch(ft){if(s.aborted)throw ft}finally{it&&ps(it.root)}}S=await Ux(g,e.definition,s),P(),C=(e.definition?.assets||[]).some(it=>Number(it?.id)===169444515)?Hx(g,s):Promise.resolve([]),f=document.createElement("canvas"),f.setAttribute("aria-label","3D avatar preview"),f.style.display="block",f.style.width="100%",f.style.height="100%",f.style.background="transparent",i.append(f),u=new Os;let G=e.definition?.backgroundRequestModel?.id;if(G)try{let it=await Fx(G,s),ft=new Xe().loadAsync(it);ft.then(st=>{(s.aborted||a)&&st.dispose()},()=>{}),m=await ti(ft,s),P(),m.colorSpace=ie,e.background!==!1&&(u.background=m)}catch(it){if(s.aborted)throw it}h=new Ee(H.camera?.fov||35,1,.01,1e4),l=new ra({canvas:f,alpha:!0,antialias:!0}),l.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),l.setClearColor(16777215,0),l.outputColorSpace=ie,l.toneMapping=pn,u.add(new qs(16777215,Math.PI*.65));let et=new is(16777215,Math.PI*.45);et.position.set(-3,5,5),u.add(et);let k=new is(16777215,Math.PI*.2);k.position.set(3,2,-5),u.add(k),c=new ua(h,f),c.enablePan=!1,c.enableDamping=!1,c.autoRotate=!e.static,c.autoRotateSpeed=4,c.mouseButtons.LEFT=fn.ROTATE,c.mouseButtons.RIGHT=fn.ROTATE,c.touches.ONE=yn.ROTATE,u.add(g);let ot=new pe().setFromObject(g),lt=ot.getCenter(new T),_t=ot.getSize(new T),Nt=Math.max(_t.length()/2,.5),Zt=(e.items||[]).filter(it=>e.definition?.assets?.some(ft=>Number(ft.id)===Number(it.id)));if(Zt.length){let it=new AbortController,ft=()=>it.abort();s.addEventListener("abort",ft,{once:!0});let st=setTimeout(ft,3e3);try{w=await ru(g,Zt,{signal:it.signal,deliveryUrl:ms,readMesh:async ut=>{let Ft=await fetch(await ms(ut,it.signal),{signal:it.signal});if(!Ft.ok)throw new Error("Effect mesh unavailable");return xa(await Ft.arrayBuffer())},matchMesh:Wc}),w.update(1)}catch(ut){if(s.aborted)throw ut}finally{clearTimeout(st),s.removeEventListener("abort",ft)}}let re=typeof e.view=="function"?e.view():e.view,qt=Ox(h,c,re),Y=!qt;if(!qt){let it=zx(H.camera);it?(h.position.fromArray(it.position),c.target.copy(lt)):h.position.set(lt.x,lt.y+Nt*.15,lt.z+Nt*2.4),c.target.copy(lt)}h.near=Math.max(Nt/100,.01),h.far=Math.max(Nt*100,100),c.minDistance=Math.max(Nt*.35,.05),c.maxDistance=Math.max(Nt*8,2),h.updateProjectionMatrix(),c.update();let Q=()=>{a||l.render(u,h)},gt=async it=>{let ft=++M,st=uu(it),ut=(e.definition?.assets||[]).some(Ft=>Number(Ft?.id)===169444515);try{let Ft=await ti(C,s);if(ft!==M||a)return!1;if(d=Ft,!Ft.length){if(ut)throw new Error("Smokestack hat texture was not found in this avatar export.");return!1}if(st===b)return!0;let pt=Gc[st],Ut=pt?await ti(du(pt),s):null;if(ft!==M||a)return!1;E?.removeFromParent(),E?.geometry.dispose(),E?.material.dispose(),E=void 0;for(let Gt of Ft)Gt.nativeUV&&Gt.node.geometry.setAttribute("uv",Ut?Gt.nativeUV:Gt.exportedUV),Gt.node.visible=st==="aprilfools"?!1:Gt.visible,Gt.current?.dispose(),Gt.current=null,Gt.material.map=Gt.original,Gt.material.needsUpdate=!0;if(Ut)for(let Gt of Ft)Gt.current=Ut.clone(),Gt.material.map=Gt.current,Gt.material.needsUpdate=!0;return ft!==M||a?!1:(E=kx(u,Ft,st),b=st,Q(),!0)}catch(Ft){throw s.aborted||Ft?.name==="AbortError"?Ft:new Error(`Smokestack style could not load: ${Ft?.message||"texture unavailable"}`)}};c.addEventListener("change",Q),c.addEventListener("start",()=>{Y=!1});let It=it=>{let ft=h.position.clone().sub(c.target),st=new Zn().setFromVector3(ft);if(it.key==="ArrowLeft")st.theta+=.15;else if(it.key==="ArrowRight")st.theta-=.15;else if(it.key==="ArrowUp")st.phi=Math.max(.05,st.phi-.15);else if(it.key==="ArrowDown")st.phi=Math.min(Math.PI-.05,st.phi+.15);else if(it.key==="+"||it.key==="=")st.radius/=1.1;else if(it.key==="-")st.radius*=1.1;else return;st.radius=qe.clamp(st.radius,c.minDistance,c.maxDistance),h.position.setFromSpherical(st).add(c.target),c.update(),it.preventDefault()};f.tabIndex=0,f.addEventListener("keydown",It);let Mt=()=>{let it=i.clientWidth||280,ft=i.clientHeight||340;if(l.setSize(it,ft,!1),h.aspect=it/ft,A(h.aspect),Y){let st=Nt/(Math.tan(qe.degToRad(h.fov/2))*Math.min(h.aspect,1)),ut=h.position.clone().sub(c.target),Ft=Math.max(ut.length(),st*1.08);h.position.copy(c.target).add(ut.normalize().multiplyScalar(Ft))}h.updateProjectionMatrix(),Q()};p=new ResizeObserver(Mt),p.observe(i),Mt();let kt,ge=it=>{if(a)return;let ft=kt===void 0?0:Math.min((it-kt)/1e3,.25);kt=it,w?.update(it/1e3),!document.hidden&&i.isConnected&&i.getClientRects().length&&c.update(ft),x=requestAnimationFrame(ge)};e.static||(x=requestAnimationFrame(ge));let R=e.definition?.assets?.find(it=>Number(it?.id)===169444515);return R&&await gt(R.meta?.smokestackStyle||"auto"),r?.removeEventListener("abort",o),{capture(it="fullBody",ft={}){P();let st=h.clone();if(st.aspect=1,it==="headshot"){let{target:pt,radius:Ut}=fu(g,ot);st.fov=35;let Gt=new T(0,0,-1);st.position.copy(pt).addScaledVector(Gt,Ut/Math.sin(qe.degToRad(st.fov/2))),st.lookAt(pt)}st.updateProjectionMatrix();let ut=l.getSize(new St),Ft=u.background;try{return ft.background===!1&&(u.background=null),l.setSize(420,420,!1),A(1),l.render(u,st),f.toDataURL("image/png")}finally{u.background=Ft,l.setSize(ut.x,ut.y,!1),A(h.aspect),Q()}},getBackgroundUrl:()=>m?.image?.currentSrc||m?.image?.src||"",getBackgroundAspect:()=>{let it=m?.image;return it?.width>0&&it?.height>0?it.width/it.height:1},getView:()=>au(h,c),setHatStyle:gt,getDiagnostics:()=>({version:1,descriptorUrl:t,descriptor:H,objText:X,mtlText:q,avatarDefinition:e.definition,view:au(h,c),gearEffects:w?.diagnostics||[],gearPose:N,teapot:{present:!!S,position:S?.getWorldPosition(new T).toArray(),scale:S?.scale.toArray()},smokestack:{season:b,matchedParts:d.length,visible:d.map(it=>it.node.visible),textures:d.map(it=>it.material.map?.image?.currentSrc||it.material.map?.image?.src||"")}}),dispose(){if(!a){a=!0,cancelAnimationFrame(x),n.abort(),r?.removeEventListener("abort",o),p?.disconnect(),c?.dispose(),f?.removeEventListener("keydown",It),w?.dispose(),ps(g),ps(I);for(let it of new Set(d.map(ft=>ft.original)))it.dispose();E?.geometry.dispose(),E?.material.dispose(),m?.dispose(),l?.dispose(),l?.forceContextLoss(),f?.remove()}}}}catch(F){let H=s.aborted||F?.name==="AbortError";throw a=!0,cancelAnimationFrame(x),n.abort(),r?.removeEventListener("abort",o),p?.disconnect(),c?.dispose(),ps(g),ps(I),E?.geometry.dispose(),E?.material.dispose(),m?.dispose(),l?.dispose(),l?.forceContextLoss(),f?.remove(),H?Ei():F}}return Cu(Gx);})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
