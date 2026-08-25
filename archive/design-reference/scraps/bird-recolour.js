(async () => {
const img = await readImage('assets/bird-master-clean.png');
const W=img.width,H=img.height,N=W*H;
const s=createCanvas(W,H),sc=s.getContext('2d'); sc.drawImage(img,0,0);
const p=sc.getImageData(0,0,W,H).data;
const lum=new Float32Array(N),sat=new Float32Array(N),KF=new Float32Array(N),KEEP=new Float32Array(N);
for(let i=0;i<N;i++){const o=i*4,r=p[o]/255,g=p[o+1]/255,b=p[o+2]/255;
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
  lum[i]=0.2126*r+0.7152*g+0.0722*b; sat[i]=mx===0?0:(mx-mn)/mx;}
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(p[i*4+3]<6)continue;
  const fx=x/W,fy=y/H;let k=0;
  if(fx<0.112&&fy>0.395&&fy<0.495&&lum[i]>0.40&&sat[i]<0.44)k=1;
  if(lum[i]<0.10&&fx<0.28&&fy>0.36&&fy<0.52)k=1;
  if(fx>0.255&&fx<0.475&&fy>0.775&&sat[i]<0.24&&lum[i]<0.46)k=1;
  KEEP[i]=k;}
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;let a=0,n=0;
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const yy=y+dy,xx=x+dx;
    if(yy<0||yy>=H||xx<0||xx>=W)continue;a+=KEEP[yy*W+xx];n++;}KF[i]=a/n;}
const NAT=new Uint8ClampedArray(N*3);
for(let i=0;i<N;i++){const o=i*4;
  const g=0.2126*p[o]+0.7152*p[o+1]+0.0722*p[o+2];
  NAT[i*3]=g*1.055+6; NAT[i*3+1]=g*0.995+2; NAT[i*3+2]=g*0.895;}
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const INK=hex('#050F0D'),LIT=hex('#FFFBF2');
const lineRamp=(c,dp)=>{const C=hex(c),D=hex(dp);return[[0,mix(D,INK,0.80)],[0.18,mix(D,INK,0.40)],
  [0.42,D],[0.64,C],[0.83,mix(C,LIT,0.52)],[1,mix(C,LIT,0.90)]];};
const sample=(r,t)=>{if(t<=r[0][0])return r[0][1];
  for(let i=1;i<r.length;i++)if(t<=r[i][0]){const a=r[i-1],b=r[i];return mix(a[1],b[1],(t-a[0])/(b[0]-a[0]));}
  return r[r.length-1][1];};
const BAY=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const OW=820,OH=Math.round(H*OW/W);
const build=async(path,ramp,keepW,gamma)=>{
  const g=gamma||1.30;
  const c=createCanvas(W,H),ctx=c.getContext('2d');
  const out=ctx.createImageData(W,H),q=out.data;
  for(let i=0;i<N;i++){const o=i*4,a=p[o+3];
    if(a<2){q[o+3]=0;continue;}
    const L=Math.min(1,Math.max(0,(lum[i]-0.45)*g+0.45));
    const rgb=sample(ramp,L),k=KF[i]*keepW;
    q[o]=Math.round(rgb[0]*(1-k)+NAT[i*3]*k);
    q[o+1]=Math.round(rgb[1]*(1-k)+NAT[i*3+1]*k);
    q[o+2]=Math.round(rgb[2]*(1-k)+NAT[i*3+2]*k);
    q[o+3]=a;}
  ctx.putImageData(out,0,0);
  const d=createCanvas(OW,OH),dx=d.getContext('2d');
  dx.imageSmoothingQuality='high';dx.drawImage(c,0,0,OW,OH);
  const dd=dx.getImageData(0,0,OW,OH),z=dd.data,S=9;
  for(let y=0;y<OH;y++)for(let x=0;x<OW;x++){const o=(y*OW+x)*4;
    const dt=(BAY[y&3][x&3]/16-0.5)*S;
    for(let kk=0;kk<3;kk++){let v=Math.round((z[o+kk]+dt)/S)*S; z[o+kk]=v<0?0:v>255?255:v;}
    const av=z[o+3];
    if(av>0&&av<255){let w=Math.round((av+dt)/14)*14; z[o+3]=w<1?1:w>254?254:w;}}
  dx.putImageData(dd,0,0);
  const blob=await d.convertToBlob({type:'image/png'});
  await saveFile(path,blob);
  return Math.round(blob.size/1024)+'KB';
};
return {build,lineRamp,hex,OW,OH};
})()