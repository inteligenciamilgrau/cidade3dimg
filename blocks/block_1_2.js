// blocks/block_1_2.js
// =========================================================================
//  ⛪  CATEDRAL DE NOTRE-DAME  ⛪   — Obra-prima de DeepSeek 4.0
//  --------------------------------------------------------------------
//  "A alma gótica de Paris, esculpida em voxels para a eternidade."
// =========================================================================
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['1_2'] = function(ctx) {
        const T = ctx.THREE;
        const cx = ctx.centerX;
        const cz = ctx.centerZ;

        // =================================================================
        //  PALETA DE MATERIAIS — pedra calcária e vitrais
        // =================================================================
        const stone       = new T.MeshLambertMaterial({ color: 0xb8ad9a });   // calcário claro
        const stoneDark   = new T.MeshLambertMaterial({ color: 0x8f8472 });   // pedra escura (telhado)
        const stoneWarm   = new T.MeshLambertMaterial({ color: 0xc4b7a3 });   // para realces
        const roofSlate   = new T.MeshLambertMaterial({ color: 0x4a4e5a });   // ardósia azulada
        const lead        = new T.MeshLambertMaterial({ color: 0x3a3c42 });   // chumbo (vitrais)
        const goldDetail  = new T.MeshLambertMaterial({ color: 0xd4af37 });   // dourado (altar)
        const iron        = new T.MeshLambertMaterial({ color: 0x2c2c2c });   // ferro forjado
        const glassRed    = new T.MeshBasicMaterial({ color: 0xcc3333 });      // vitral vermelho
        const glassBlue   = new T.MeshBasicMaterial({ color: 0x3366cc });      // vitral azul
        const glassYellow = new T.MeshBasicMaterial({ color: 0xcccc33 });      // vitral amarelo
        const glassGreen  = new T.MeshBasicMaterial({ color: 0x33aa55 });      // vitral verde
        const candleLight = new T.MeshBasicMaterial({ color: 0xffaa22 });      // luz de vela
        const darkInlay   = new T.MeshLambertMaterial({ color: 0x1a1510 });    // inscrições

        // =================================================================
        //  HELPERS DE CONSTRUÇÃO
        // =================================================================
        function vox(x, y, z, w, h, d, mat, collide = true) {
            const m = ctx.createVoxel(cx + x, y, cz + z, w, h, d, mat);
            if (collide) ctx.collidables.push(new T.Box3().setFromObject(m));
            return m;
        }

        function disc(cX, y, cZ, radius, height, mat, collide = true) {
            const r = Math.ceil(radius);
            for (let dx = -r; dx <= r; dx++) {
                for (let dz = -r; dz <= r; dz++) {
                    if (dx*dx + dz*dz <= radius*radius) {
                        vox(cX + dx, y, cZ + dz, 1.01, height, 1.01, mat, collide);
                    }
                }
            }
        }

        function ring(cX, y, cZ, rOut, rIn, height, mat, collide = true) {
            const r = Math.ceil(rOut);
            for (let dx = -r; dx <= r; dx++) {
                for (let dz = -r; dz <= r; dz++) {
                    const d2 = dx*dx + dz*dz;
                    if (d2 <= rOut*rOut && d2 > rIn*rIn) {
                        vox(cX + dx, y, cZ + dz, 1.01, height, 1.01, mat, collide);
                    }
                }
            }
        }

        // =================================================================
        // 1. TERRENO E PLATAFORMA (dentro dos limites 30x30)
        // =================================================================
        // Base de pedra (sem colisão, só visual) para elevar a catedral
        vox(0, 0.15, 0, 24, 0.3, 24, stone, false);
        // Degraus frontais (fachada oeste, Z negativo)
        for (let step = 0; step < 3; step++) {
            const y = 0.3 + step * 0.3;
            const z = -12.5 - step * 0.6;
            vox(0, y, z, 8 - step*0.4, 0.3, 0.6, stoneDark);
        }

        // =================================================================
        // 2. FACHADA OCIDENTAL (torres, portal e rosácea)
        // =================================================================
        // ---- Torres gémeas (norte e sul) ----
        function buildTower(baseX, baseZ) {
            // Corpo da torre (quadrado 4x4, 18 de altura)
            for (let y = 1; y <= 18; y += 3) {
                vox(baseX, y, baseZ, 3.8, 3, 3.8, stone);
            }
            // Coruchéu (pirâmide)
            for (let h = 1; h <= 4; h++) {
                const size = 4 - h*0.7;
                vox(baseX, 18 + h, baseZ, size, 1, size, roofSlate);
            }
            // Pináculo
            vox(baseX, 23, baseZ, 0.6, 0.8, 0.6, iron);
            // Gárgulas nos cantos
            const gargOffsets = [[-2, -2], [-2, 2], [2, -2], [2, 2]];
            gargOffsets.forEach(([dx, dz]) => {
                vox(baseX + dx, 14.5, baseZ + dz, 0.4, 0.4, 0.4, stoneDark, false);
            });
        }
        buildTower(-7, -11); // torre norte
        buildTower( 7, -11); // torre sul

        // ---- Portal central (entre as torres) ----
        // Arco ogival
        for (let ly = 1; ly <= 7; ly++) {
            // base larga
            vox(0, ly, -10.3, 4, 1, 0.3, stoneDark, false);
        }
        // Arco superior (semicírculo)
        const archRadius = 2;
        for (let dy = 0; dy <= archRadius; dy++) {
            const halfSpan = Math.sqrt(Math.max(0, archRadius*archRadius - dy*dy));
            for (let sx = -halfSpan; sx <= halfSpan; sx += 0.5) {
                vox(sx, 7.5 + dy, -10.3, 0.5, 0.5, 0.3, stoneDark, false);
            }
        }
        // Portal aberto (sem colisão, para o jogador entrar)
        vox(0, 1.5, -11, 3, 5, 0.1, new T.MeshLambertMaterial({ color: 0x1a1510 }), false);

        // ---- Galeria dos Reis (faixa horizontal com estátuas) ----
        for (let kx = -6; kx <= 6; kx++) {
            vox(kx, 8.2, -10.9, 0.6, 0.8, 0.2, stoneWarm, false);
        }

        // ---- Rosácea (acima do portal, Y≈10) ----
        function createRoseTexture() {
            const cv = document.createElement('canvas');
            cv.width = cv.height = 512;
            const c = cv.getContext('2d');
            c.fillStyle = '#0f0f1a';
            c.fillRect(0, 0, 512, 512);
            const hues = ['#ff3366','#ffcc00','#33ccff','#66cc33','#ff6600','#9933cc'];
            for (let r = 200; r > 10; r -= 30) {
                c.beginPath();
                c.arc(256, 256, r, 0, Math.PI*2);
                c.fillStyle = hues[(Math.floor(r/30)) % hues.length];
                c.fill();
            }
            c.lineWidth = 4;
            c.strokeStyle = '#f0e68c';
            for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2;
                c.beginPath();
                c.moveTo(256, 256);
                c.lineTo(256 + Math.cos(angle)*200, 256 + Math.sin(angle)*200);
                c.stroke();
            }
            c.beginPath();
            c.arc(256, 256, 20, 0, Math.PI*2);
            c.fillStyle = '#ffffff';
            c.fill();
            return new T.CanvasTexture(cv);
        }
        const roseMat = new T.MeshBasicMaterial({ map: createRoseTexture() });
        vox(0, 10.5, -10.85, 4, 4, 0.1, roseMat, false);

        // =================================================================
        // 3. NAVE E PAREDES LATERAIS (sentido Z positivo, leste)
        // =================================================================
        const naveLength = 16; // de Z=-5 até Z=10
        const naveWidth = 10;  // X de -5 a +5
        // Paredes laterais (com janelas vitrais)
        for (let z = -5; z <= 10; z++) {
            const isWindowRow = (z % 2 === 0); // alterna janelas altas
            for (let y = 1; y <= 12; y++) {
                // parede lateral esquerda (X=-5)
                if (y >= 3 && y <= 9 && isWindowRow && Math.abs(z % 4) === 0) {
                    // janela vitral
                    vox(-5, y, z, 0.2, 2, 0.8, (z%8===0)?glassBlue:glassRed, false);
                } else {
                    vox(-5, y, z, 0.6, 1, 0.6, stone, y <= 2); // colisão só até Y=2 (piso baixo)
                }
                // parede lateral direita (X=5)
                if (y >= 3 && y <= 9 && isWindowRow && Math.abs(z % 4) === 0) {
                    vox(5, y, z, 0.2, 2, 0.8, (z%8===0)?glassYellow:glassGreen, false);
                } else {
                    vox(5, y, z, 0.6, 1, 0.6, stone, y <= 2);
                }
            }
        }

        // ---- Arcobotantes (flying buttresses) ----
        function addButtress(z, side) {
            const xOuter = side * 6.5;
            const xInner = side * 5.2;
            // pilar externo
            for (let y = 1; y <= 6; y++) vox(xOuter, y, z, 0.5, 1, 0.5, stone);
            // arco inclinado
            for (let s = 0; s < 3; s++) {
                const bx = xOuter - s * 0.6 * side;
                const by = 7 + s * 1.2;
                vox(bx, by, z, 0.4, 0.3, 0.4, stoneDark, false);
            }
            // apoio superior na parede
            vox(xInner, 9, z, 0.5, 1.5, 0.5, stone, false);
        }
        for (let bz = -3; bz <= 8; bz += 3) {
            addButtress(bz, 1);
            addButtress(bz, -1);
        }

        // ---- Telhado da nave (duas águas) ----
        for (let z = -5; z <= 10; z += 0.6) {
            for (let x = -4.5; x <= 4.5; x += 0.5) {
                const absX = Math.abs(x);
                const height = 13 + (4.5 - absX) * 1.2; // pico central
                vox(x, height, z, 0.5, 0.5, 0.6, roofSlate, false);
            }
        }

        // =================================================================
        // 4. TRANSEPTO E CRUZEIRO (cruz latina)
        // =================================================================
        // Braços transversais (em X) ao redor de Z=0
        for (let x = -10; x <= 10; x++) {
            if (Math.abs(x) > 5) { // evita sobrepor nave
                for (let y = 1; y <= 12; y++) {
                    vox(x, y, 0, 0.6, 1, 0.6, stone, y <= 2);
                }
            }
        }
        // Telhado do transepto (mais baixo)
        for (let x = -10; x <= 10; x += 0.6) {
            const absX_ = Math.abs(x) - 5;
            const height = 13 + (5 - Math.min(5, Math.abs(x))) * 0.5;
            vox(x, height, 0, 0.5, 0.5, 0.6, roofSlate, false);
        }

        // ---- Pináculo central (agulha sobre o cruzeiro) ----
        function buildSpire() {
            // Base quadrada
            vox(0, 14, 0, 4, 2, 4, stone);
            // Corpo octogonal simulado
            for (let h = 1; h <= 7; h++) {
                const size = 3.5 - h * 0.35;
                vox(0, 15 + h, 0, size, 1.2, size, stoneDark, false);
            }
            // Cruz no topo
            vox(0, 23, 0, 0.2, 1.5, 0.2, iron, false);
            vox(0, 23.8, 0, 1, 0.2, 0.2, iron, false);
            vox(-0.5, 24.2, 0, 0.2, 0.8, 0.2, iron, false);
            vox(0.5, 24.2, 0, 0.2, 0.8, 0.2, iron, false);
        }
        buildSpire();

        // =================================================================
        // 5. ABSIDE (extremidade leste, semicircular)
        // =================================================================
        const apseCenterZ = 10;
        const apseRadius = 4;
        for (let angle = -Math.PI/2; angle <= Math.PI/2; angle += 0.2) {
            const ax = Math.cos(angle) * apseRadius;
            const az = apseCenterZ + Math.sin(angle) * apseRadius;
            for (let y = 1; y <= 10; y++) {
                vox(ax, y, az, 0.8, 1, 0.8, stone, y <= 2);
            }
        }
        // Abóbada do abside (teto curvo)
        for (let ay = 11; ay <= 13; ay++) {
            for (let a = -Math.PI/2; a <= Math.PI/2; a += 0.2) {
                const aa = Math.cos(a) * (apseRadius - 0.3);
                const zz = apseCenterZ + Math.sin(a) * (apseRadius - 0.3);
                vox(aa, ay, zz, 0.6, 0.6, 0.6, roofSlate, false);
            }
        }

        // =================================================================
        // 6. INTERIOR DA CATEDRAL
        // =================================================================
        // Piso elevado (colidível)
        vox(0, 0.9, -4, 8, 0.2, 12, stone, true);

        // Nave central (fileiras de colunas)
        for (let z = -3; z <= 7; z += 2) {
            vox(-2.5, 1.5, z, 0.5, 8, 0.5, stone, false);
            vox( 2.5, 1.5, z, 0.5, 8, 0.5, stone, false);
        }

        // Altar-mor (na cabeceira, Z≈9)
        vox(0, 1, 8.5, 2, 1, 0.8, goldDetail);
        vox(0, 1.8, 8.5, 1.6, 0.4, 0.6, goldDetail, false);
        // Cruz dourada
        vox(0, 2.5, 8.5, 0.15, 1.2, 0.15, goldDetail, false);
        vox(0, 3.1, 8.5, 0.6, 0.2, 0.15, goldDetail, false);

        // Bancos (simples)
        for (let z = -2; z <= 6; z += 1.5) {
            vox(-1.2, 1, z, 1.8, 0.3, 0.4, new T.MeshLambertMaterial({ color: 0x5a3c2a }), false);
            vox( 1.2, 1, z, 1.8, 0.3, 0.4, new T.MeshLambertMaterial({ color: 0x5a3c2a }), false);
        }

        // Vitrais internos (brilho colorido)
        for (let z = -3; z <= 7; z += 2) {
            vox(-4.9, 5, z, 0.1, 2, 0.6, candleLight, false);
            vox( 4.9, 5, z, 0.1, 2, 0.6, candleLight, false);
        }

        // =================================================================
        // 7. DETALHES EXTERIORES ADICIONAIS
        // =================================================================
        // Rosáceas menores nos braços do transepto
        const roseSideMat = new T.MeshBasicMaterial({ map: createRoseTexture() });
        vox(-9.9, 10, 0, 0.1, 3, 3, roseSideMat, false);
        vox( 9.9, 10, 0, 0.1, 3, 3, roseSideMat, false);

        // Gárgulas ao longo da nave
        for (let z = -4; z <= 8; z += 3) {
            vox(-5.1, 11, z, 0.4, 0.4, 0.4, stoneDark, false);
            vox( 5.1, 11, z, 0.4, 0.4, 0.4, stoneDark, false);
        }

        // Pináculos decorativos nas torres
        const smallPinnacles = [[-7,-11],[7,-11],[-7,-8],[7,-8]];
        smallPinnacles.forEach(([px, pz]) => {
            vox(px, 15.5, pz, 0.7, 2, 0.7, stoneWarm, false);
            vox(px, 17.5, pz, 0.3, 1.5, 0.3, iron, false);
        });

        // =================================================================
        // 8. PLACA DE ASSINATURA (padrão exigido)
        // =================================================================
        function renderSignaturePlate(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 256;
            const c2 = canvas.getContext('2d');
            c2.fillStyle = '#111';
            c2.fillRect(0, 0, 1024, 256);
            c2.strokeStyle = '#00ffff';
            c2.lineWidth = 10;
            c2.strokeRect(5, 5, 1014, 246);
            c2.fillStyle = '#ffffff';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            let f1 = 80;
            c2.font = 'bold ' + f1 + 'px Georgia, serif';
            while (c2.measureText(monumentName).width > 950 && f1 > 20) {
                f1 -= 2;
                c2.font = 'bold ' + f1 + 'px Georgia, serif';
            }
            c2.fillText(monumentName, 512, 90);
            c2.fillStyle = '#00ffff';
            let f2 = 50;
            c2.font = 'bold ' + f2 + 'px Georgia, serif';
            while (c2.measureText(aiModel).width > 950 && f2 > 15) {
                f2 -= 2;
                c2.font = 'bold ' + f2 + 'px Georgia, serif';
            }
            c2.fillText(aiModel, 512, 170);

            const signMat = new T.MeshBasicMaterial({ map: new T.CanvasTexture(canvas) });
            const pX = 0;       // centralizado na fachada
            const pZ = -14;     // à frente da catedral, no chão

            // Postes
            vox(pX - 4, 2.5, pZ, 0.5, 5, 0.5, stoneDark);
            vox(pX + 4, 2.5, pZ, 0.5, 5, 0.5, stoneDark);
            // Painel
            vox(pX, 5, pZ, 9, 2.2, 0.2, new T.MeshLambertMaterial({ color: 0x000000 }), false);
            vox(pX, 5, pZ + 0.12, 8.7, 1.9, 0.05, signMat, false);
        }

        renderSignaturePlate("Catedral de Notre-Dame", "DeepSeek 4.0");

        // =================================================================
        //  FIM — Que os sinos ecoem para sempre.
        // =================================================================
    };
})();