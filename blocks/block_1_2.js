// blocks/block_1_2.js
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['1_2'] = function(ctx) {
        const T = ctx.THREE;
        const cx = ctx.centerX;
        const cz = ctx.centerZ;
        
        // ==============================================
        // 1. PLACA DE ASSINATURA
        // ==============================================
        function renderSignaturePlate(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 256;
            const c2d = canvas.getContext('2d');

            // Fundo escuro com borda neon ciano
            c2d.fillStyle = '#0a0a0a';
            c2d.fillRect(0, 0, 1024, 256);
            c2d.strokeStyle = '#00ffff';
            c2d.lineWidth = 12;
            c2d.strokeRect(6, 6, 1012, 244);

            // Nome do monumento (auto-ajuste)
            c2d.fillStyle = '#ffffff';
            c2d.textAlign = 'center';
            c2d.textBaseline = 'middle';
            let fontSize = 80;
            c2d.font = 'bold ' + fontSize + 'px "Georgia", serif';
            while (c2d.measureText(monumentName).width > 960 && fontSize > 20) {
                fontSize -= 2;
                c2d.font = 'bold ' + fontSize + 'px "Georgia", serif';
            }
            c2d.fillText(monumentName, 512, 90);

            // Nome do modelo IA
            c2d.fillStyle = '#00ffff';
            fontSize = 50;
            c2d.font = 'bold ' + fontSize + 'px "Georgia", serif';
            while (c2d.measureText(aiModel).width > 960 && fontSize > 15) {
                fontSize -= 2;
                c2d.font = 'bold ' + fontSize + 'px "Georgia", serif';
            }
            c2d.fillText(aiModel, 512, 170);

            const signMat = new T.MeshBasicMaterial({ map: new T.CanvasTexture(canvas) });
            
            // Posicionar a placa em frente à catedral (lado oeste)
            const pX = 0;
            const pZ = -16;
            const stoneMat = new T.MeshLambertMaterial({ color: 0x888888 });
            ctx.createVoxel(cx + pX - 6, 2.5, cz + pZ, 0.5, 5, 0.5, stoneMat);
            ctx.createVoxel(cx + pX + 6, 2.5, cz + pZ, 0.5, 5, 0.5, stoneMat);
            ctx.createVoxel(cx + pX, 5, cz + pZ, 12.5, 2.5, 0.2, new T.MeshLambertMaterial({ color: 0x111111 }));
            ctx.createVoxel(cx + pX, 5, cz + pZ + 0.15, 12.2, 2.2, 0.05, signMat);
        }

        // ==============================================
        // 2. MATERIAIS
        // ==============================================
        const stonePale = new T.MeshLambertMaterial({ color: 0xd2c8b4 });   // pedra clara
        const stoneDark = new T.MeshLambertMaterial({ color: 0x9e9478 });   // pedra escura (telhado)
        const woodDark  = new T.MeshLambertMaterial({ color: 0x5a3c2a });   // madeira escura
        const metalIron = new T.MeshLambertMaterial({ color: 0x3a3a3a });   // ferro forjado
        const goldLeaf  = new T.MeshLambertMaterial({ color: 0xd4af37 });   // dourado (altar)
        const glassGlow = new T.MeshBasicMaterial({ color: 0xccffff });      // vidro brilhante

        // Textura da rosácea via Canvas (stained glass)
        function createRoseTexture() {
            const cv = document.createElement('canvas');
            cv.width = cv.height = 512;
            const c = cv.getContext('2d');
            // fundo escuro
            c.fillStyle = '#1a1a1a';
            c.fillRect(0, 0, 512, 512);
            // círculos concêntricos coloridos
            const colors = ['#ff3366','#ffcc00','#33ccff','#66cc33','#ff6600','#9933cc'];
            for (let r = 200; r > 10; r -= 30) {
                c.beginPath();
                c.arc(256, 256, r, 0, Math.PI*2);
                c.fillStyle = colors[(r/30) % colors.length];
                c.fill();
            }
            // raios petalares
            c.lineWidth = 4;
            c.strokeStyle = '#f0e68c';
            for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2;
                c.beginPath();
                c.moveTo(256, 256);
                c.lineTo(256 + Math.cos(angle)*200, 256 + Math.sin(angle)*200);
                c.stroke();
            }
            // centro branco
            c.beginPath();
            c.arc(256, 256, 20, 0, Math.PI*2);
            c.fillStyle = '#ffffff';
            c.fill();
            return new T.CanvasTexture(cv);
        }
        const roseMat = new T.MeshBasicMaterial({ map: createRoseTexture() });

        // ==============================================
        // 3. ESTRUTURA PRINCIPAL
        // ==============================================

        // --- Base (piso) ---
        function addFloor(x, z, w, d) {
            const block = ctx.createVoxel(cx + x, 0.2, cz + z, w, 0.4, d, stonePale);
            ctx.collidables.push(new T.Box3().setFromObject(block));
        }
        addFloor(0, -14, 20, 30); // plataforma retangular completa

        // --- Torres frontais (ocidente) ---
        function addTower(baseX, baseZ) {
            // corpo da torre
            for (let y = 1; y <= 14; y += 3) {
                const seg = ctx.createVoxel(cx + baseX, y, cz + baseZ, 4, 3, 4, stonePale);
                ctx.collidables.push(new T.Box3().setFromObject(seg));
            }
            // coruchéu piramidal
            for (let h = 1; h <= 3; h++) {
                const pyr = ctx.createVoxel(cx + baseX, 14+h, cz + baseZ, 4 - h*0.8, 1, 4 - h*0.8, stoneDark);
                ctx.collidables.push(new T.Box3().setFromObject(pyr));
            }
            // pináculo final
            const pinn = ctx.createVoxel(cx + baseX, 17, cz + baseZ, 0.8, 0.8, 0.8, metalIron);
            ctx.collidables.push(new T.Box3().setFromObject(pinn));
        }
        addTower(-7, -12); // torre norte
        addTower(7, -12);  // torre sul

        // --- Portal central (entre torres) ---
        // vão da porta
        const doorGap = ctx.createVoxel(cx+0, 1.5, cz-12, 3, 3, 0.2, new T.MeshLambertMaterial({ color: 0x2f1d12 }));
        ctx.collidables.push(new T.Box3().setFromObject(doorGap));
        // arco ogival sobre a porta (overlay)
        const archMat = stoneDark;
        for (let dy = 0; dy <= 2; dy++) {
            const left = ctx.createVoxel(cx-1.5, 3+dy, cz-12, 0.5, 1, 0.3, archMat);
            ctx.collidables.push(new T.Box3().setFromObject(left));
            const right = ctx.createVoxel(cx+1.5, 3+dy, cz-12, 0.5, 1, 0.3, archMat);
            ctx.collidables.push(new T.Box3().setFromObject(right));
        }
        const archTop = ctx.createVoxel(cx+0, 5.5, cz-12, 3, 1.5, 0.3, archMat);
        ctx.collidables.push(new T.Box3().setFromObject(archTop));

        // --- Nave e paredes laterais ---
        function buildWall(startZ, endZ, height, leftX, rightX) {
            for (let z = startZ; z <= endZ; z += 1) {
                for (let y = 1; y <= height; y += 1) {
                    if (y === 1) { // base mais larga
                        const baseL = ctx.createVoxel(cx+leftX, y, cz+z, 1, 1, 1, stonePale);
                        ctx.collidables.push(new T.Box3().setFromObject(baseL));
                        const baseR = ctx.createVoxel(cx+rightX, y, cz+z, 1, 1, 1, stonePale);
                        ctx.collidables.push(new T.Box3().setFromObject(baseR));
                    } else {
                        const segL = ctx.createVoxel(cx+leftX, y, cz+z, 0.8, 1, 0.8, stoneDark);
                        ctx.collidables.push(new T.Box3().setFromObject(segL));
                        const segR = ctx.createVoxel(cx+rightX, y, cz+z, 0.8, 1, 0.8, stoneDark);
                        ctx.collidables.push(new T.Box3().setFromObject(segR));
                    }
                }
            }
        }
        buildWall(-7, 8, 10, -7, 7); // nave principal

        // --- Arcobotantes (flying buttresses) ---
        function addButtress(z, side) {
            const xBase = side * 8.5;
            const xMid = side * 6.5;
            // base vertical
            for (let y = 1; y <= 4; y++) {
                const col = ctx.createVoxel(cx+xBase, y, cz+z, 0.6, 1, 0.6, stonePale);
                ctx.collidables.push(new T.Box3().setFromObject(col));
            }
            // arco inclinado (voxel esbelto)
            for (let step = 0; step < 3; step++) {
                const bx = xBase - step * 0.8 * side; // aproximar da parede
                const by = 5 + step*1.2;
                const arc = ctx.createVoxel(cx+bx, by, cz+z, 0.5, 0.4, 0.5, stoneDark);
                ctx.collidables.push(new T.Box3().setFromObject(arc));
            }
            // contraforte superior
            const top = ctx.createVoxel(cx+xMid, 8, cz+z, 0.6, 1.5, 0.6, stonePale);
            ctx.collidables.push(new T.Box3().setFromObject(top));
        }
        for (let zPos = -5; zPos <= 6; zPos += 3) {
            addButtress(zPos, 1);  // lado sul
            addButtress(zPos, -1); // lado norte
        }

        // --- Telhado da nave (duas águas) ---
        function buildRoof(startZ, endZ) {
            for (let z = startZ; z <= endZ; z += 1) {
                for (let x = -5; x <= 5; x += 0.6) {
                    const absX = Math.abs(x);
                    const height = 11 + Math.max(0, (5 - absX) * 1.2); // pico no centro
                    const roofBlock = ctx.createVoxel(cx+x, height, cz+z, 0.6, 0.6, 0.6, stoneDark);
                    ctx.collidables.push(new T.Box3().setFromObject(roofBlock));
                }
            }
        }
        buildRoof(-7, 8);

        // --- Rosácea (fachada oeste, acima do portal) ---
        const rose = ctx.createVoxel(cx+0, 7, cz-11.9, 4, 4, 0.15, roseMat);
        ctx.collidables.push(new T.Box3().setFromObject(rose));

        // --- Campanário / pináculo central (sobre o cruzeiro) ---
        function addSpire() {
            // base quadrada
            const base = ctx.createVoxel(cx+0, 12, cz+0, 3, 2, 3, stonePale);
            ctx.collidables.push(new T.Box3().setFromObject(base));
            // corpo octogonal simulado com slices
            for (let h = 1; h <= 6; h++) {
                const size = 2.5 - h*0.3;
                const seg = ctx.createVoxel(cx+0, 12+h, cz+0, size, 1, size, stoneDark);
                ctx.collidables.push(new T.Box3().setFromObject(seg));
            }
            // cruz no topo
            const crossV = ctx.createVoxel(cx+0, 18.2, cz+0, 0.2, 1.2, 0.2, metalIron);
            ctx.collidables.push(new T.Box3().setFromObject(crossV));
            const crossH = ctx.createVoxel(cx+0, 18.8, cz+0, 1, 0.2, 0.2, metalIron);
            ctx.collidables.push(new T.Box3().setFromObject(crossH));
        }
        addSpire();

        // --- Abside (leste) ---
        function addApse() {
            const centerZ = 9;
            const radius = 4;
            for (let angle = -Math.PI/2; angle <= Math.PI/2; angle += 0.3) {
                const x = Math.cos(angle) * radius;
                const z = centerZ + Math.sin(angle) * radius;
                for (let y = 1; y <= 8; y += 1) {
                    const apseBlock = ctx.createVoxel(cx+x, y, cz+z, 0.8, 1, 0.8, stonePale);
                    ctx.collidables.push(new T.Box3().setFromObject(apseBlock));
                }
            }
            // teto abobadado
            for (let a2 = -Math.PI/2; a2 <= Math.PI/2; a2 += 0.3) {
                const x2 = Math.cos(a2) * radius;
                const z2 = centerZ + Math.sin(a2) * radius;
                const topBlock = ctx.createVoxel(cx+x2, 9, cz+z2, 0.7, 1, 0.7, stoneDark);
                ctx.collidables.push(new T.Box3().setFromObject(topBlock));
            }
        }
        addApse();

        // ==============================================
        // 4. INTERIOR (Nave e altar)
        // ==============================================
        // Piso interno elevado
        const floorInt = ctx.createVoxel(cx+0, 0.5, cz-5, 8, 0.3, 12, new T.MeshLambertMaterial({ color: 0xcbb280 }));
        ctx.collidables.push(new T.Box3().setFromObject(floorInt));
        
        // Fileiras de colunas internas
        for (let zCol = -5; zCol <= 4; zCol += 2) {
            for (let side = -1; side <= 1; side += 2) {
                const col = ctx.createVoxel(cx+side*3, 1.5, cz+zCol, 0.6, 6, 0.6, stonePale);
                ctx.collidables.push(new T.Box3().setFromObject(col));
            }
        }

        // Altar-mor (z = 8)
        const altarBase = ctx.createVoxel(cx+0, 1, cz+8, 2, 1, 1, goldLeaf);
        ctx.collidables.push(new T.Box3().setFromObject(altarBase));
        const altarTop = ctx.createVoxel(cx+0, 1.8, cz+8, 1.8, 0.5, 0.8, goldLeaf);
        ctx.collidables.push(new T.Box3().setFromObject(altarTop));
        // Cruz sobre o altar
        const crossAltar = ctx.createVoxel(cx+0, 2.5, cz+8, 0.2, 1.5, 0.2, metalIron);
        ctx.collidables.push(new T.Box3().setFromObject(crossAltar));

        // Bancos (pew)
        for (let zPew = -3; zPew <= 5; zPew += 1.5) {
            const pew = ctx.createVoxel(cx+1.2, 0.8, cz+zPew, 1.8, 0.4, 0.5, woodDark);
            ctx.collidables.push(new T.Box3().setFromObject(pew));
            const pew2 = ctx.createVoxel(cx-1.2, 0.8, cz+zPew, 1.8, 0.4, 0.5, woodDark);
            ctx.collidables.push(new T.Box3().setFromObject(pew2));
        }

        // Janelas laterais com vitrais (pequenas basic emissive)
        for (let zWin = -5; zWin <= 5; zWin += 2) {
            const winL = ctx.createVoxel(cx-6.9, 5, cz+zWin, 0.2, 2, 0.8, glassGlow);
            ctx.collidables.push(new T.Box3().setFromObject(winL));
            const winR = ctx.createVoxel(cx+6.9, 5, cz+zWin, 0.2, 2, 0.8, glassGlow);
            ctx.collidables.push(new T.Box3().setFromObject(winR));
        }

        // ==============================================
        // 5. DETALHES EXTERIORES
        // ==============================================
        // Gárgulas (pequenos blocos nos cantos das torres)
        const gargoyleMat = stoneDark;
        const gPos = [[-7, -12], [7, -12], [-7, -9], [7, -9]];
        gPos.forEach(([gx, gz]) => {
            const garg = ctx.createVoxel(cx+gx, 12.5, cz+gz, 0.6, 0.6, 0.6, gargoyleMat);
            ctx.collidables.push(new T.Box3().setFromObject(garg));
        });

        // ==============================================
        // 6. PLACA FINAL
        // ==============================================
        renderSignaturePlate("Catedral de Notre-Dame", "DeepSeek 4.0");
        
        // (opcional) grama ao redor (já existe fora do bloco)
    };
})();