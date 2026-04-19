// blocks/block_2_2.js - Catedral da Aurora v2.1 com colisão completa
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['2_2'] = function(ctx) {

        function renderStandardSign(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 192;
            const c2 = canvas.getContext('2d');
            c2.fillStyle = '#0f1720'; c2.fillRect(0,0,512,192);
            c2.strokeStyle = '#6fd3ff'; c2.lineWidth = 10; c2.strokeRect(10,10,492,172);
            c2.fillStyle = '#eef7ff'; c2.textAlign = 'center'; c2.textBaseline = 'middle';
            let f1=56; c2.font='bold '+f1+'px Arial';
            while(c2.measureText(monumentName).width>470 && f1>20){f1-=2;c2.font='bold '+f1+'px Arial';}
            c2.fillText(monumentName,256,78);
            let f2=34; c2.font='bold '+f2+'px Arial';
            while(c2.measureText(aiModel).width>470 && f2>15){f2-=2;c2.font='bold '+f2+'px Arial';}
            c2.fillStyle='#6fd3ff'; c2.fillText(aiModel,256,132);
            const signMat = new ctx.THREE.MeshBasicMaterial({map:new ctx.THREE.CanvasTexture(canvas)});
            const matDark = new ctx.THREE.MeshLambertMaterial({color:0x222222});
            let pX=ctx.centerX-10; let pZ=ctx.centerZ+12;
            ctx.createVoxel(pX-2.2,1.8,pZ,0.22,2.8,0.22,matDark);
            ctx.createVoxel(pX+2.2,1.8,pZ,0.22,2.8,0.22,matDark);
            let fundo=ctx.createVoxel(pX,3.5,pZ,5.2,1.8,0.22,matDark);
            ctx.createVoxel(pX,3.5,pZ+0.12,5.2,1.8,0.05,signMat);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(fundo));
        };

        // helper para criar sólido com colisão
        function solido(x,y,z,w,h,d,mat){
            let m = ctx.createVoxel(x,y,z,w,h,d,mat);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(m));
            return m;
        }
        function decor(x,y,z,w,h,d,mat){ // sem colisão
            return ctx.createVoxel(x,y,z,w,h,d,mat);
        }

        // MATERIAIS
        const matBase = new ctx.THREE.MeshLambertMaterial({color:0x0b1220});
        const matVerdade = new ctx.THREE.MeshLambertMaterial({color:0xf8fafc});
        const matBondade = new ctx.THREE.MeshLambertMaterial({color:0x8B4513});
        const matBeleza = new ctx.THREE.MeshBasicMaterial({color:0x6fd3ff,transparent:true,opacity:0.45});
        const matOuro = new ctx.THREE.MeshLambertMaterial({color:0xffcc33});
        const matVerde = new ctx.THREE.MeshLambertMaterial({color:0x0a7f3f});
        const matVerdeClaro = new ctx.THREE.MeshLambertMaterial({color:0x22c55e});
        const matAgua = new ctx.THREE.MeshLambertMaterial({color:0x0ea5e9,transparent:true,opacity:0.7});
        const matAguaBrilho = new ctx.THREE.MeshBasicMaterial({color:0x7dd3fc,transparent:true,opacity:0.6});
        const matCristal = new ctx.THREE.MeshBasicMaterial({color:0xfff4b1});
        const matVitral1 = new ctx.THREE.MeshBasicMaterial({color:0xff3b82,transparent:true,opacity:0.7});
        const matVitral2 = new ctx.THREE.MeshBasicMaterial({color:0x8b5cf6,transparent:true,opacity:0.7});
        const matVitral3 = new ctx.THREE.MeshBasicMaterial({color:0x22d3ee,transparent:true,opacity:0.7});
        const matAzulejo = new ctx.THREE.MeshLambertMaterial({color:0xe2e8f0});

        const CX = ctx.centerX; const CZ = ctx.centerZ;

        // BASE
        solido(CX,1,CZ,30,2,30,matBase);

        // PISO AZULEJO
        for(let x=-6;x<=6;x+=3){ for(let z=-6;z<=6;z+=3){
            decor(CX+x,2.05,CZ+z,2.5,0.1,2.5, ((x+z)%6===0)?matAzulejo:matVerdade);
        }}

        // ANEL DE ÁGUA (decorativo)
        for(let i=-14;i<=14;i+=1.5){
            decor(CX+i,0.3,CZ-14,1.5,0.4,1.5,matAgua);
            decor(CX+i,0.3,CZ+14,1.5,0.4,1.5,matAgua);
            decor(CX-14,0.3,CZ+i,1.5,0.4,1.5,matAgua);
            decor(CX+14,0.3,CZ+i,1.5,0.4,1.5,matAgua);
        }

        decor(CX,2.1,CZ,22,0.2,22,matVerde);

        // ANFITEATRO COM COLISÃO
        for(let r=9;r>=3;r--){ solido(CX,2+(9-r)*0.45,CZ,r*2.1,0.45,r*2.1,matVerdade); }

        // TORRES - AGORA TODAS COM COLISÃO
        function torreEspiral(raio, material, altura, desloc, esp){
            for(let y=0;y<altura;y++){
                let ang = desloc + y*0.24;
                let r = raio * (1 - y/altura*0.35);
                let x = CX + Math.cos(ang)*r;
                let z = CZ + Math.sin(ang)*r;
                let h = 2 + y*1.05;
                solido(x,h,z,esp,1.05,esp,material);
                if(y%5===0 && material===matVerdade){
                    decor(x+0.6,h+0.5,z,0.2,0.8,0.2,matVitral1);
                    decor(x-0.6,h+0.5,z,0.2,0.8,0.2,matVitral2);
                }
            }
        }
        torreEspiral(9.8, matVerdade, 34, 0, 1.3);
        torreEspiral(9.8, matBondade, 34, 2.094, 1.3);
        torreEspiral(9.8, matBeleza, 34, 4.188, 1.3);

        // PLATAFORMAS JARDIM SUSPENSO COM COLISÃO
        for(let h of [14,22,28]){
            for(let a=0;a<3;a++){
                let ang = a*2.094 + h*0.1;
                let x = CX + Math.cos(ang)*5.5;
                let z = CZ + Math.sin(ang)*5.5;
                solido(x,h,z,3.2,0.3,3.2,matVerdeClaro);
                decor(x,h+0.4,z,2,0.6,2,matVerde);
            }
        }

        // ARCOS INFERIORES COM COLISÃO
        for(let a=0;a<3;a++){
            let baseAng=a*2.094;
            for(let t=-1;t<=1;t+=0.07){
                let x=CX+Math.cos(baseAng)*(11-Math.abs(t)*7.5);
                let z=CZ+Math.sin(baseAng)*(11-Math.abs(t)*7.5);
                let y=5+(1-t*t)*6.5;
                solido(x,y,z,1.1,1.1,1.1,matVerdade);
            }
        }

        // ARCOS DOURADOS SUPERIORES
        for(let i=0;i<3;i++){
            let ang=i*2.094;
            let x1=CX+Math.cos(ang)*5; let z1=CZ+Math.sin(ang)*5;
            let x2=CX+Math.cos(ang+2.094)*5; let z2=CZ+Math.sin(ang+2.094)*5;
            for(let t=0;t<=1;t+=0.06){
                let xt=x1*(1-t)+x2*t; let zt=z1*(1-t)+z2*t; let yt=24+Math.sin(Math.PI*t)*4;
                solido(xt,yt,zt,0.7,0.7,0.7,matOuro);
            }
        }

        // CRISTAL + HALO
        solido(CX,38,CZ,2.6,5,2.6,matCristal);
        for(let a=0;a<Math.PI*2;a+=0.2){
            let hx=CX+Math.cos(a)*3.2; let hz=CZ+Math.sin(a)*3.2;
            decor(hx,36.5,hz,0.4,0.4,0.4,matOuro);
        }

        // CASCATAS (decorativas, sem colisão para não travar)
        for(let s=0;s<3;s++){
            let ang=s*2.094;
            let sx=CX+Math.cos(ang)*7; let sz=CZ+Math.sin(ang)*7;
            for(let y=0;y<12;y++){ decor(sx,14-y*0.9,sz,0.6,0.9,0.6,matAguaBrilho); }
            decor(sx,2.3,sz,3,0.2,3,matAgua);
        }
        decor(CX,2.25,CZ,8,0.18,8,matAgua);

        // OBSERVATÓRIO COM COLISÃO
        let obsX = CX - 11; let obsZ = CZ - 9;
        solido(obsX,2.5,obsZ,4.5,3,4.5,matVerdade);
        solido(obsX,5.2,obsZ,4.5,2.5,4.5,matVitral3);
        decor(obsX,7,obsZ,2.5,1,2.5,matOuro);

        // ÁRVORES
        const arvores = [[-10,-10],[10,-10],[-10,10],[10,10],[-13,0],[13,0],[0,-13],[0,13],[-7,-12],[7,12],[-12,7],[12,-7]];
        arvores.forEach(p=>{
            let tx=CX+p[0]; let tz=CZ+p[1];
            solido(tx,4,tz,0.9,5,0.9,matBondade);
            decor(tx,7,tz,3.4,3,3.4,matVerde);
            decor(tx,9,tz,2.4,1.8,2.4,matVerdeClaro);
        });

        // BANCOS
        [[-5,0],[5,0],[0,-5],[0,5]].forEach(p=>{ solido(CX+p[0],2.6,CZ+p[1],2,0.4,0.6,matBondade); });

        // PILARES DE LUZ (com colisão leve)
        [[-12,-12],[12,-12],[-12,12],[12,12]].forEach(p=>{
            for(let y=0;y<8;y++) solido(CX+p[0],3+y*1.1,CZ+p[1],0.5,1.1,0.5,matBeleza);
        });

        renderStandardSign('Catedral da Aurora v2', 'Meta Muse Spark');
    };
})();
