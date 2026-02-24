// blocks/block_3_3.js
// Quarteirão 3,3 — Centro do Mapa (X=0, Z=0)
// Exemplo: Praça Central com Torre de Observação e jardim

(function () {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['3_3'] = function (ctx) {
        let cx = ctx.centerX; // 0
        let cz = ctx.centerZ; // 0
        let bw = ctx.blockW;  // 30

        // === PRAÇA CENTRAL ===

        // Piso da praça (pedra clara)
        let matPiso = new ctx.THREE.MeshLambertMaterial({ color: 0xccbbaa });
        ctx.createVoxel(cx, 0.15, cz, bw, 0.1, bw, matPiso, false, true);

        // === TORRE DE OBSERVAÇÃO ===
        let matTorre = new ctx.THREE.MeshLambertMaterial({ color: 0x994422 });
        let matVidro = new ctx.THREE.MeshLambertMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5 });
        let matTeto = new ctx.THREE.MeshLambertMaterial({ color: 0x333333 });

        // Base da torre (quadrada, mais larga)
        let base = ctx.createVoxel(cx, 2, cz, 8, 4, 8, matTorre);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(base));

        // Corpo da torre (mais fino, mais alto)
        let corpo = ctx.createVoxel(cx, 14, cz, 5, 20, 5, matTorre);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(corpo));

        // Mirante no topo (vidro)
        let mirante = ctx.createVoxel(cx, 26, cz, 7, 4, 7, matVidro);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(mirante));

        // Teto do mirante
        let teto = ctx.createVoxel(cx, 28.5, cz, 8, 1, 8, matTeto);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(teto));

        // Escadas em espiral ao redor da torre
        for (let i = 0; i < 20; i++) {
            let ang = (i / 20) * Math.PI * 4; // 2 voltas completas
            let sx = cx + Math.cos(ang) * 4;
            let sz = cz + Math.sin(ang) * 4;
            let sy = 1 + i * 1.2;
            let escada = ctx.createVoxel(sx, sy, sz, 2, 0.5, 2, matTorre);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(escada));
        }

        // === JARDIM AO REDOR ===
        let matTronco = new ctx.THREE.MeshLambertMaterial({ color: 0x8B4513 });
        let matFolha = new ctx.THREE.MeshLambertMaterial({ color: 0x228B22 });
        let matFlor1 = new ctx.THREE.MeshLambertMaterial({ color: 0xff4488 });
        let matFlor2 = new ctx.THREE.MeshLambertMaterial({ color: 0xffaa00 });

        // 4 árvores nos cantos
        let cantos = [
            [cx - 10, cz - 10],
            [cx + 10, cz - 10],
            [cx - 10, cz + 10],
            [cx + 10, cz + 10]
        ];
        cantos.forEach(([tx, tz]) => {
            let tronco = ctx.createVoxel(tx, 2, tz, 1, 4, 1, matTronco);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(tronco));
            let copa = ctx.createVoxel(tx, 5.5, tz, 4, 3, 4, matFolha);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(copa));
        });

        // Canteiros de flores aleatórios
        for (let i = 0; i < 12; i++) {
            let fx = cx + (Math.random() - 0.5) * 24;
            let fz = cz + (Math.random() - 0.5) * 24;
            // Não colocar em cima da torre
            if (Math.abs(fx - cx) < 6 && Math.abs(fz - cz) < 6) continue;
            let matF = (i % 2 === 0) ? matFlor1 : matFlor2;
            ctx.createVoxel(fx, 0.5, fz, 0.8, 1, 0.8, matF);
        }

        // === BANCOS ===
        let matBanco = new ctx.THREE.MeshLambertMaterial({ color: 0x654321 });
        // Frente
        let banco1 = ctx.createVoxel(cx - 6, 0.5, cz + 6, 3, 1, 1, matBanco);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(banco1));
        // Trás
        let banco2 = ctx.createVoxel(cx + 6, 0.5, cz - 6, 3, 1, 1, matBanco);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(banco2));

        // === LUMINÁRIA ===
        let matPoste = new ctx.THREE.MeshLambertMaterial({ color: 0x444444 });
        let matLuz = new ctx.THREE.MeshBasicMaterial({ color: 0xffffaa });
        // 4 postes de luz
        let postes = [
            [cx - 8, cz],
            [cx + 8, cz],
            [cx, cz - 8],
            [cx, cz + 8]
        ];
        postes.forEach(([px, pz]) => {
            ctx.createVoxel(px, 3, pz, 0.3, 6, 0.3, matPoste);
            ctx.createVoxel(px, 6.5, pz, 1, 0.5, 1, matLuz);
        });

        // === PLAQUINHA "Claude Opus 4.6" ===
        let signCanvas = document.createElement('canvas');
        signCanvas.width = 256; signCanvas.height = 64;
        let signCtx = signCanvas.getContext('2d');
        signCtx.fillStyle = '#1a1a2e';
        signCtx.fillRect(0, 0, 256, 64);
        signCtx.fillStyle = '#e94560';
        signCtx.font = 'bold 28px Arial';
        signCtx.textAlign = 'center';
        signCtx.textBaseline = 'middle';
        signCtx.fillText('Claude Opus 4.6', 128, 32);
        let signTex = new ctx.THREE.CanvasTexture(signCanvas);
        let signMat = new ctx.THREE.MeshBasicMaterial({ map: signTex });
        // Poste da placa
        ctx.createVoxel(cx + 12, 2, cz + 12, 0.3, 4, 0.3, matPoste);
        // Placa em si
        let placa = ctx.createVoxel(cx + 12, 4.5, cz + 12, 4, 1, 0.2, signMat);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(placa));
    };
})();
