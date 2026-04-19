// blocks/block_2_2.js
(function () {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['2_2'] = function (ctx) {

        function renderStandardSign(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 192;
            const c2 = canvas.getContext('2d');
            c2.fillStyle = '#0f1720'; c2.fillRect(0, 0, 512, 192);
            c2.strokeStyle = '#6fd3ff'; c2.lineWidth = 10; c2.strokeRect(10, 10, 492, 172);
            c2.fillStyle = '#eef7ff'; c2.textAlign = 'center'; c2.textBaseline = 'middle';
            let f1 = 56; c2.font = 'bold ' + f1 + 'px Arial';
            while (c2.measureText(monumentName).width > 470 && f1 > 20) { f1 -= 2; c2.font = 'bold ' + f1 + 'px Arial'; }
            c2.fillText(monumentName, 256, 78);
            let f2 = 34; c2.font = 'bold ' + f2 + 'px Arial';
            while (c2.measureText(aiModel).width > 470 && f2 > 15) { f2 -= 2; c2.font = 'bold ' + f2 + 'px Arial'; }
            c2.fillStyle = '#6fd3ff'; c2.fillText(aiModel, 256, 132);
            const signMat = new ctx.THREE.MeshBasicMaterial({ map: new ctx.THREE.CanvasTexture(canvas) });
            const matDark = new ctx.THREE.MeshLambertMaterial({ color: 0x222222 });
            let pX = ctx.centerX - 10; let pZ = ctx.centerZ + 12;
            ctx.createVoxel(pX - 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            ctx.createVoxel(pX + 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            let fundo = ctx.createVoxel(pX, 3.5, pZ, 5.2, 1.8, 0.22, matDark);
            ctx.createVoxel(pX, 3.5, pZ + 0.12, 5.2, 1.8, 0.05, signMat);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(fundo));
        };

        // === MATERIAIS ===
        const matBase = new ctx.THREE.MeshLambertMaterial({ color: 0x0b1220 });
        const matVerdade = new ctx.THREE.MeshLambertMaterial({ color: 0xf8fafc });
        const matBondade = new ctx.THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const matBeleza = new ctx.THREE.MeshBasicMaterial({ color: 0x6fd3ff, transparent: true, opacity: 0.45 });
        const matOuro = new ctx.THREE.MeshLambertMaterial({ color: 0xffcc33 });
        const matVerde = new ctx.THREE.MeshLambertMaterial({ color: 0x0a7f3f });
        const matVerdeClaro = new ctx.THREE.MeshLambertMaterial({ color: 0x22c55e });
        const matAgua = new ctx.THREE.MeshLambertMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.7 });
        const matAguaBrilho = new ctx.THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.6 });
        const matCristal = new ctx.THREE.MeshBasicMaterial({ color: 0xfff4b1 });
        const matVitral1 = new ctx.THREE.MeshBasicMaterial({ color: 0xff3b82, transparent: true, opacity: 0.7 });
        const matVitral2 = new ctx.THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.7 });
        const matVitral3 = new ctx.THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.7 });
        const matAzulejo = new ctx.THREE.MeshLambertMaterial({ color: 0xe2e8f0 });

        const CX = ctx.centerX; const CZ = ctx.centerZ;

        // BASE
        let base = ctx.createVoxel(CX, 1, CZ, 30, 2, 30, matBase);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(base));

        // PISO AZULEJO PORTUGUÊS (padrão simples)
        for (let x = -6; x <= 6; x += 3) {
            for (let z = -6; z <= 6; z += 3) {
                ctx.createVoxel(CX + x, 2.05, CZ + z, 2.5, 0.1, 2.5, ((x + z) % 6 === 0) ? matAzulejo : matVerdade);
            }
        }

        // ANEL DE ÁGUA MAIOR
        for (let i = -14; i <= 14; i += 1.5) {
            ctx.createVoxel(CX + i, 0.3, CZ - 14, 1.5, 0.4, 1.5, matAgua);
            ctx.createVoxel(CX + i, 0.3, CZ + 14, 1.5, 0.4, 1.5, matAgua);
            ctx.createVoxel(CX - 14, 0.3, CZ + i, 1.5, 0.4, 1.5, matAgua);
            ctx.createVoxel(CX + 14, 0.3, CZ + i, 1.5, 0.4, 1.5, matAgua);
        }

        // JARDIM
        ctx.createVoxel(CX, 2.1, CZ, 22, 0.2, 22, matVerde);

        // ANFITEATRO
        for (let r = 9; r >= 3; r--) { ctx.createVoxel(CX, 2 + (9 - r) * 0.45, CZ, r * 2.1, 0.45, r * 2.1, matVerdade); }

        // TORRES MAIS ALTAS - agora 34 andares
        function torreEspiral(raio, material, altura, desloc, esp) {
            for (let y = 0; y < altura; y++) {
                let ang = desloc + y * 0.24;
                let r = raio * (1 - y / altura * 0.35);
                let x = CX + Math.cos(ang) * r;
                let z = CZ + Math.sin(ang) * r;
                let h = 2 + y * 1.05;
                let b = ctx.createVoxel(x, h, z, esp, 1.05, esp, material);
                if (y % 4 === 0) ctx.collidables.push(new ctx.THREE.Box3().setFromObject(b));
                // vitrais a cada 5 níveis
                if (y % 5 === 0 && material === matVerdade) {
                    ctx.createVoxel(x + 0.6, h + 0.5, z, 0.2, 0.8, 0.2, matVitral1);
                    ctx.createVoxel(x - 0.6, h + 0.5, z, 0.2, 0.8, 0.2, matVitral2);
                }
            }
        }
        torreEspiral(9.8, matVerdade, 34, 0, 1.3);
        torreEspiral(9.8, matBondade, 34, 2.094, 1.3);
        torreEspiral(9.8, matBeleza, 34, 4.188, 1.3);

        // PLATAFORMAS DE JARDIM SUSPENSO
        for (let h of [14, 22, 28]) {
            for (let a = 0; a < 3; a++) {
                let ang = a * 2.094 + h * 0.1;
                let x = CX + Math.cos(ang) * 5.5;
                let z = CZ + Math.sin(ang) * 5.5;
                ctx.createVoxel(x, h, CZ ? 0 : 0, z, 3.5, 0.3, 3.5, matVerdeClaro); // pequeno erro, corrigir
            }
        }
        // corrigindo plataformas
        for (let h of [14, 22, 28]) {
            for (let a = 0; a < 3; a++) {
                let ang = a * 2.094 + h * 0.1;
                let x = CX + Math.cos(ang) * 5.5;
                let z = CZ + Math.sin(ang) * 5.5;
                ctx.createVoxel(x, h, z, 3.2, 0.3, 3.2, matVerdeClaro);
                ctx.createVoxel(x, h + 0.4, z, 2, 0.6, 2, matVerde);
            }
        }

        // ARCOS INFERIORES
        for (let a = 0; a < 3; a++) {
            let baseAng = a * 2.094;
            for (let t = -1; t <= 1; t += 0.07) {
                let x = CX + Math.cos(baseAng) * (11 - Math.abs(t) * 7.5);
                let z = CZ + Math.sin(baseAng) * (11 - Math.abs(t) * 7.5);
                let y = 5 + (1 - t * t) * 6.5;
                ctx.createVoxel(x, y, z, 1.1, 1.1, 1.1, matVerdade);
            }
        }

        // ARCOS DOURADOS SUPERIORES
        for (let i = 0; i < 3; i++) {
            let ang = i * 2.094;
            let x1 = CX + Math.cos(ang) * 5; let z1 = CZ + Math.sin(ang) * 5;
            let x2 = CX + Math.cos(ang + 2.094) * 5; let z2 = CZ + Math.sin(ang + 2.094) * 5;
            for (let t = 0; t <= 1; t += 0.06) {
                let xt = x1 * (1 - t) + x2 * t; let zt = z1 * (1 - t) + z2 * t; let yt = 24 + Math.sin(Math.PI * t) * 4;
                ctx.createVoxel(xt, yt, zt, 0.7, 0.7, 0.7, matOuro);
            }
        }

        // CRISTAL PRINCIPAL + HALO
        let cristal = ctx.createVoxel(CX, 38, CZ, 2.6, 5, 2.6, matCristal);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(cristal));
        // halo dourado (anel)
        for (let a = 0; a < Math.PI * 2; a += 0.2) {
            let hx = CX + Math.cos(a) * 3.2; let hz = CZ + Math.sin(a) * 3.2;
            ctx.createVoxel(hx, 36.5, hz, 0.4, 0.4, 0.4, matOuro);
        }

        // CASCATAS - descem das torres
        for (let s = 0; s < 3; s++) {
            let ang = s * 2.094;
            let sx = CX + Math.cos(ang) * 7; let sz = CZ + Math.sin(ang) * 7;
            for (let y = 0; y < 12; y++) {
                ctx.createVoxel(sx, 14 - y * 0.9, sz, 0.6, 0.9, 0.6, matAguaBrilho);
            }
            // lago receptor
            ctx.createVoxel(sx, 2.3, sz, 3, 0.2, 3, matAgua);
        }

        // ESPELHO D'ÁGUA CENTRAL MAIOR
        ctx.createVoxel(CX, 2.25, CZ, 8, 0.18, 8, matAgua);

        // OBSERVATÓRIO LATERAL (cúpula azul)
        let obsX = CX - 11; let obsZ = CZ - 9;
        ctx.createVoxel(obsX, 2.5, obsZ, 6, 3, 6, matVerdade);
        ctx.createVoxel(obsX, 5.2, obsZ, 4.5, 2.5, 4.5, matVitral3);
        ctx.createVoxel(obsX, 7, obsZ, 2.5, 1, 2.5, matOuro);

        // ÁRVORES MAIS DENSAS
        const arvores = [[-10, -10], [10, -10], [-10, 10], [10, 10], [-13, 0], [13, 0], [0, -13], [0, 13], [-7, -12], [7, 12], [-12, 7], [12, -7]];
        arvores.forEach(p => {
            let tx = CX + p[0]; let tz = CZ + p[1];
            let tronco = ctx.createVoxel(tx, 4, tz, 0.9, 5, 0.9, matBondade);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(tronco));
            ctx.createVoxel(tx, 7, tz, 3.4, 3, 3.4, matVerde);
            ctx.createVoxel(tx, 9, tz, 2.4, 1.8, 2.4, matVerdeClaro);
        });

        // BANCOS AO REDOR
        [[-5, 0], [5, 0], [0, -5], [0, 5]].forEach(p => {
            ctx.createVoxel(CX + p[0], 2.6, CZ + p[1], 2, 0.4, 0.6, matBondade);
        });

        // PILARES DE LUZ
        [[-12, -12], [12, -12], [-12, 12], [12, 12]].forEach(p => {
            for (let y = 0; y < 8; y++) ctx.createVoxel(CX + p[0], 3 + y * 1.1, CZ + p[1], 0.5, 1.1, 0.5, matBeleza);
        });

        // PLACA
        renderStandardSign('Catedral da Aurora', 'Meta Muse Spark');
    };
})();
