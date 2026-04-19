// blocks/block_1_4.js - VERSÃO FINAL PÚBLICA (v8.0 - Três Torres de Vidro)
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['1_4'] = function(ctx) {

        // === FUNÇÃO PADRÃO DE PLACA ===
        function renderStandardSign(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 192;
            const c2 = canvas.getContext('2d');
            c2.fillStyle = '#0f1720';
            c2.fillRect(0, 0, 512, 192);
            c2.strokeStyle = '#6fd3ff';
            c2.lineWidth = 10;
            c2.strokeRect(10, 10, 492, 172);
            
            c2.fillStyle = '#eef7ff';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            let f1 = 56;
            c2.font = 'bold ' + f1 + 'px Arial';
            while (c2.measureText(monumentName).width > 470 && f1 > 20) {
                f1 -= 2;
                c2.font = 'bold ' + f1 + 'px Arial';
            }
            c2.fillText(monumentName, 256, 78);
            
            let f2 = 34;
            c2.font = 'bold ' + f2 + 'px Arial';
            while (c2.measureText(aiModel).width > 470 && f2 > 15) {
                f2 -= 2;
                c2.font = 'bold ' + f2 + 'px Arial';
            }
            c2.fillStyle = '#6fd3ff';
            c2.fillText(aiModel, 256, 132);

            const signMat = new ctx.THREE.MeshBasicMaterial({ map: new ctx.THREE.CanvasTexture(canvas) });
            const matDark = new ctx.THREE.MeshLambertMaterial({ color: 0x222222 });
            let pX = ctx.centerX - 10; // moved left to not collide with corner perfectly
            let pZ = ctx.centerZ + 12;
            ctx.createVoxel(pX - 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            ctx.createVoxel(pX + 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            let fundo = ctx.createVoxel(pX, 3.5, pZ, 5.2, 1.8, 0.22, matDark);
            ctx.createVoxel(pX, 3.5, pZ + 0.12, 5.2, 1.8, 0.05, signMat);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(fundo));
        }


        // === MATERIAIS ===
        const glassMat = new ctx.THREE.MeshLambertMaterial({ color: 0x88ccff, transparent: true, opacity: 0.55 });
        const steelMat = new ctx.THREE.MeshLambertMaterial({ color: 0x2a2a35 });
        const goldMat = new ctx.THREE.MeshLambertMaterial({ color: 0xffd700 });
        const neonMat = new ctx.THREE.MeshBasicMaterial({ color: 0x00ffff });
        const greenNeonMat = new ctx.THREE.MeshBasicMaterial({ color: 0x00ff88 });
        const signMat = new ctx.THREE.MeshBasicMaterial({ color: 0x111118 });
        const textMat = new ctx.THREE.MeshBasicMaterial({ color: 0x00ff88 });
        const doorMat = new ctx.THREE.MeshLambertMaterial({ color: 0x5c3a21 });

        // === BASE PLATAFORMA (Aberta para o Hall) ===
        // Fundo
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(
            ctx.createVoxel(ctx.centerX, 0.5, ctx.centerZ - 5, 16, 1, 8, steelMat)
        ));
        // Lado Esquerdo
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(
            ctx.createVoxel(ctx.centerX - 5, 0.5, ctx.centerZ + 3, 5, 1, 6, steelMat)
        ));
        // Lado Direito
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(
            ctx.createVoxel(ctx.centerX + 5, 0.5, ctx.centerZ + 3, 5, 1, 6, steelMat)
        ));

        // === 🏢 3 TORRES DE VIDRO (Composição Arquitetônica) ===
        // TORRE 1: Central (Principal - Mais Alta)
        let t1 = ctx.createVoxel(ctx.centerX, 28, ctx.centerZ - 1, 8, 55, 8, glassMat);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(t1));
        // Detalhe estrutural horizontal na T1
        ctx.createVoxel(ctx.centerX, 28, ctx.centerZ - 1, 9, 0.4, 9, steelMat);

        // TORRE 2: Esquerda (Média - Deslocada)
        let t2 = ctx.createVoxel(ctx.centerX - 9, 22, ctx.centerZ + 4, 6, 40, 6, glassMat);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(t2));

        // TORRE 3: Direita (Média - Espelhada)
        let t3 = ctx.createVoxel(ctx.centerX + 9, 22, ctx.centerZ + 4, 6, 40, 6, glassMat);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(t3));

        // === 🌉 PONTES AÉREAS (Conexão entre as 3 torres) ===
        // Ponte Inferior (y=18)
        let bridge1 = ctx.createVoxel(ctx.centerX, 18, ctx.centerZ + 1, 18, 0.5, 3, glassMat);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(bridge1));
        // Guarda-corpo neon
        ctx.createVoxel(ctx.centerX - 8.5, 18.5, ctx.centerZ + 1, 0.3, 1.2, 3, neonMat);
        ctx.createVoxel(ctx.centerX + 8.5, 18.5, ctx.centerZ + 1, 0.3, 1.2, 3, neonMat);

        // Ponte Superior (y=32)
        let bridge2 = ctx.createVoxel(ctx.centerX, 32, ctx.centerZ + 1, 14, 0.5, 3, glassMat);
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(bridge2));
        ctx.createVoxel(ctx.centerX - 6.5, 32.5, ctx.centerZ + 1, 0.3, 1.2, 3, greenNeonMat);
        ctx.createVoxel(ctx.centerX + 6.5, 32.5, ctx.centerZ + 1, 0.3, 1.2, 3, greenNeonMat);

        // === 👑 COROAS & TOPOS ===
        // Topo Torre 1 (Pirâmide invertida dourada)
        ctx.createVoxel(ctx.centerX, 58, ctx.centerZ - 1, 10, 6, 10, goldMat);
        // Topo Torre 2
        ctx.createVoxel(ctx.centerX - 9, 44, ctx.centerZ + 4, 8, 4, 8, goldMat);
        // Topo Torre 3
        ctx.createVoxel(ctx.centerX + 9, 44, ctx.centerZ + 4, 8, 4, 8, goldMat);
        
        // Antena Principal
        ctx.createVoxel(ctx.centerX, 66, ctx.centerZ - 1, 2, 14, 2, neonMat);

        // === 🚪 HALL DE ENTRADA MONUMENTAL ===
        const doorZ = ctx.centerZ + 7;
        const doorY = 4;
        
        // Portas recolhidas lateralmente (sempre abertas)
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(
            ctx.createVoxel(ctx.centerX - 6.5, doorY, doorZ, 2, 5, 0.4, doorMat)
        ));
        ctx.collidables.push(new ctx.THREE.Box3().setFromObject(
            ctx.createVoxel(ctx.centerX + 6.5, doorY, doorZ, 2, 5, 0.4, doorMat)
        ));

        // Marco Dourado da Entrada
        ctx.createVoxel(ctx.centerX, doorY + 3.5, doorZ, 8, 0.6, 1.2, goldMat);
        ctx.createVoxel(ctx.centerX - 3.8, doorY + 1, doorZ, 0.6, 6, 1.2, goldMat);
        ctx.createVoxel(ctx.centerX + 3.8, doorY + 1, doorZ, 0.6, 6, 1.2, goldMat);

        // Tapete de Luz (Chão neon guiando ao interior)
        ctx.createVoxel(ctx.centerX, 1.2, ctx.centerZ + 9.5, 5, 0.3, 5, greenNeonMat);

        // Escadaria Cerimonial
        for(let s=0; s<4; s++) {
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(
                ctx.createVoxel(ctx.centerX, 0.5 + s*0.5, ctx.centerZ + 12 + s*1.4, 6.5 - s*1.2, 0.5, 1.8, steelMat)
            ));
        }

        // (Placa de texto voxel removida para usar a placa padrão)

        // === 💡 ILUMINAÇÃO & DETALHES ===
        // Faixas verticais de neon nas torres
        for(let i=0; i<12; i++) {
            let y = 5 + i * 4;
            ctx.createVoxel(ctx.centerX - 3.5, y, ctx.centerZ - 5, 0.3, 2, 0.3, neonMat);
            ctx.createVoxel(ctx.centerX + 3.5, y, ctx.centerZ - 5, 0.3, 2, 0.3, neonMat);
            ctx.createVoxel(ctx.centerX - 9 - 2.5, y + 1, ctx.centerZ + 1, 0.3, 2, 0.3, greenNeonMat);
            ctx.createVoxel(ctx.centerX + 9 + 2.5, y + 1, ctx.centerZ + 1, 0.3, 2, 0.3, greenNeonMat);
        }
        // Luzes de solo
        for (let i = -10; i <= 10; i += 4) {
            ctx.createVoxel(ctx.centerX + i, 0.8, ctx.centerZ + 9, 0.5, 0.5, 0.5, neonMat);
        }

        // === 🗺️ REGISTRO NO MINIMAPA ===
        ctx.buildings.push({
            position: { x: ctx.centerX, z: ctx.centerZ },
            size: { w: 20, h: 75, d: 16 },
            name: "Torre Qwen 3.6 Plus"
        });
        renderStandardSign('TORRE QWEN', 'Qwen 3.6 Plus');
    };
})();