// =========================================================================
//  🕌  TAJ MAHAL  🕌   — Obra-prima de Claude Opus 4.7
//  --------------------------------------------------------------------
//  "Uma lágrima de mármore nas faces do tempo" — Rabindranath Tagore
//
//  O mausoléu mais belo do mundo, erguido por Shah Jahan em memória
//  de sua esposa Mumtaz Mahal. Construído aqui em voxels pelo Claude
//  para a posteridade da humanidade digital.
// =========================================================================
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['3_3'] = function(ctx) {
        const THREE = ctx.THREE;
        const cx = ctx.centerX;
        const cz = ctx.centerZ;

        // =================================================================
        //  PALETA DE MATERIAIS — tons reais do mármore Makrana
        // =================================================================
        const marble        = new THREE.MeshLambertMaterial({ color: 0xf5efe0 }); // mármore branco quente
        const marbleWarm    = new THREE.MeshLambertMaterial({ color: 0xe8dec8 }); // mármore envelhecido
        const marbleShadow  = new THREE.MeshLambertMaterial({ color: 0xd8cdb4 }); // sombra/base
        const marbleBase    = new THREE.MeshLambertMaterial({ color: 0xc4b89a }); // pedestal inferior
        const gold          = new THREE.MeshLambertMaterial({ color: 0xffd700 }); // ouro — kalasha
        const goldBright    = new THREE.MeshBasicMaterial(  { color: 0xffee66 }); // ouro brilhante (emissivo)
        const goldDark      = new THREE.MeshLambertMaterial({ color: 0xb8860b }); // detalhe em ouro
        const sandstone     = new THREE.MeshLambertMaterial({ color: 0xa8602a }); // arenito vermelho (contraste)
        const archShadow    = new THREE.MeshLambertMaterial({ color: 0x1c1410 }); // sombra interna dos iwans
        const pietraBlue    = new THREE.MeshLambertMaterial({ color: 0x1e3a8a }); // lápis-lazúli incrustado
        const pietraGreen   = new THREE.MeshLambertMaterial({ color: 0x2d6a4f }); // jade incrustado
        const pietraRed     = new THREE.MeshLambertMaterial({ color: 0x8b1a1a }); // cornalina incrustada
        const water         = new THREE.MeshLambertMaterial({ color: 0x4a90d9, transparent: true, opacity: 0.75 });
        const waterDeep     = new THREE.MeshLambertMaterial({ color: 0x1e3a5f });
        const cypress       = new THREE.MeshLambertMaterial({ color: 0x2d5a2d }); // ciprestes do jardim
        const cypressDark   = new THREE.MeshLambertMaterial({ color: 0x1f3f1f });
        const trunk         = new THREE.MeshLambertMaterial({ color: 0x4a2f1a });
        const grass         = new THREE.MeshLambertMaterial({ color: 0x3a6b2a });
        const pathStone     = new THREE.MeshLambertMaterial({ color: 0xc8ad7f });
        const lanternGlow   = new THREE.MeshBasicMaterial(  { color: 0xffcc55 });
        const moonlight     = new THREE.MeshBasicMaterial(  { color: 0xfff5c2 });
        const signDark      = new THREE.MeshLambertMaterial({ color: 0x2a1a0a });
        const signGold      = new THREE.MeshBasicMaterial(  { color: 0xffe066 });

        // =================================================================
        //  HELPERS DE CONSTRUÇÃO
        // =================================================================

        // Cria um voxel em coordenadas locais (relativas ao centro do bloco)
        function vox(x, y, z, w, h, d, mat, collide) {
            const m = ctx.createVoxel(cx + x, y, cz + z, w, h, d, mat);
            if (collide !== false) {
                ctx.collidables.push(new THREE.Box3().setFromObject(m));
            }
            return m;
        }

        // Disco cheio (aproximação voxel de círculo)
        function disc(cX, y, cZ, radius, height, mat, collide) {
            const r = Math.ceil(radius);
            for (let dx = -r; dx <= r; dx++) {
                for (let dz = -r; dz <= r; dz++) {
                    const d2 = dx*dx + dz*dz;
                    if (d2 <= radius*radius) {
                        vox(cX + dx, y, cZ + dz, 1.01, height, 1.01, mat, collide);
                    }
                }
            }
        }

        // Anel (cilindro oco)
        function ring(cX, y, cZ, rOut, rIn, height, mat, collide) {
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

        // Arco voxel (semicírculo vertical) — desenha o contorno de um iwan
        // Cria blocos formando o arco interior escuro + moldura
        function iwanArch(cX, yBase, cZ, width, height, depth, facing, mat, darkMat) {
            // facing: 'south'(-z), 'north'(+z), 'east'(+x), 'west'(-x)
            const archRadius = width / 2;
            const archCenterY = yBase + height - archRadius;
            // Pinta um retângulo escuro onde seria a abertura, com cantos arredondados no topo
            for (let wy = 0; wy < height; wy++) {
                for (let wx = -Math.floor(width/2); wx <= Math.floor(width/2); wx++) {
                    let draw = true;
                    // Topo arredondado (arco)
                    const yFromArchCenter = (yBase + wy + 0.5) - archCenterY;
                    if (yFromArchCenter > 0) {
                        const rr = wx*wx + yFromArchCenter*yFromArchCenter;
                        if (rr > archRadius*archRadius) draw = false;
                    }
                    if (!draw) continue;
                    let px = cX, pz = cZ;
                    if (facing === 'south') { px = cX + wx; pz = cZ - depth; }
                    if (facing === 'north') { px = cX + wx; pz = cZ + depth; }
                    if (facing === 'east')  { px = cX + depth; pz = cZ + wx; }
                    if (facing === 'west')  { px = cX - depth; pz = cZ + wx; }
                    vox(px, yBase + wy + 0.5, pz, 1.02, 1.02, 1.02, darkMat, false);
                }
            }
        }

        // =================================================================
        //  1. O JARDIM CHARBAGH — O PARAÍSO TERRESTRE
        // =================================================================
        // Tapete de grama cobrindo o quarteirão (abaixo da plataforma)
        vox(0, 0.05, 0, 30, 0.1, 30, grass, false);

        // Caminhos de pedra formando a cruz do charbagh (paraíso de 4 rios)
        // Caminho norte-sul
        vox(0, 0.11, 0, 2, 0.02, 30, pathStone, false);
        // Caminho leste-oeste
        vox(0, 0.11, 0, 30, 0.02, 2, pathStone, false);

        // =================================================================
        //  2. PISCINA REFLETIVA FRONTAL (lado sul, -Z)
        //     O famoso espelho d'água que reflete o mausoléu
        // =================================================================
        // Borda da piscina em mármore
        vox(0, 0.3, -13.5, 10, 0.6, 3, marbleShadow, false);
        // Água
        vox(0, 0.45, -13.5, 9.4, 0.3, 2.4, water, false);
        // Reflexo suave de ouro na água (efeito luz)
        vox(0, 0.47, -13.5, 1, 0.02, 2, goldBright, false);
        vox(-2.5, 0.47, -13.5, 0.5, 0.02, 1.5, lanternGlow, false);
        vox( 2.5, 0.47, -13.5, 0.5, 0.02, 1.5, lanternGlow, false);

        // Piscina traseira (simétrica, no +Z)
        vox(0, 0.3, 13.5, 10, 0.6, 3, marbleShadow, false);
        vox(0, 0.45, 13.5, 9.4, 0.3, 2.4, water, false);
        vox(0, 0.47, 13.5, 1, 0.02, 2, goldBright, false);

        // =================================================================
        //  3. PLATAFORMA PRINCIPAL (CHABUTARA INFERIOR) — 22×22
        // =================================================================
        // Corpo da base em arenito (mais escuro)
        vox(0, 0.6, 0, 22, 1.2, 22, marbleBase);
        // Topo da plataforma em mármore branco
        vox(0, 1.8, 0, 22, 1.2, 22, marbleShadow);
        // Borda decorativa superior (friso)
        vox(0, 2.5, -10.95, 22, 0.3, 0.3, marble, false);
        vox(0, 2.5,  10.95, 22, 0.3, 0.3, marble, false);
        vox(-10.95, 2.5, 0, 0.3, 0.3, 22, marble, false);
        vox( 10.95, 2.5, 0, 0.3, 0.3, 22, marble, false);

        // Pequenos pináculos decorativos nos 4 cantos da plataforma
        const cornerPinnacles = [[-10.5,-10.5],[10.5,-10.5],[-10.5,10.5],[10.5,10.5]];
        cornerPinnacles.forEach(([px,pz]) => {
            vox(px, 2.6, pz, 0.7, 0.3, 0.7, marble, false);
            vox(px, 2.9, pz, 0.4, 0.4, 0.4, gold, false);
        });

        // =================================================================
        //  4. ESCADARIA FRONTAL (degraus convidando ao mausoléu)
        // =================================================================
        for (let i = 0; i < 3; i++) {
            const y = 0.3 + i * 0.4;
            const zOffset = -11.5 - (2 - i) * 0.8;
            vox(0, y, zOffset, 7 - i*0.3, 0.4, 0.8, marbleShadow);
        }

        // =================================================================
        //  5. CHABUTARA SECUNDÁRIA (base elevada do mausoléu) — 17×17
        // =================================================================
        vox(0, 3.4, 0, 17, 0.8, 17, marble);
        // Friso dourado superior
        vox(0, 3.9, -8.45, 17, 0.1, 0.15, gold, false);
        vox(0, 3.9,  8.45, 17, 0.1, 0.15, gold, false);
        vox(-8.45, 3.9, 0, 0.15, 0.1, 17, gold, false);
        vox( 8.45, 3.9, 0, 0.15, 0.1, 17, gold, false);

        // =================================================================
        //  6. MAUSOLÉU PRINCIPAL — o corpo quadrado octogonal
        //     14×14 de base, 10 unidades de altura (y = 4 → 14)
        // =================================================================
        // Corpo sólido principal
        vox(0, 9, 0, 14, 10, 14, marble);

        // Chanfrando os cantos (octogonalidade parcial) — remove cantos com sombra
        // Simulamos com blocos de canto ligeiramente recuados em tom mais claro
        const cornerBevels = [[-6,-6],[6,-6],[-6,6],[6,6]];
        cornerBevels.forEach(([bx,bz]) => {
            // Pilastra de canto decorativa
            vox(bx, 9, bz, 2, 10, 2, marbleWarm, false);
            // Detalhe ornamental em cada canto (incrustação pietra dura)
            for (let yy = 0; yy < 8; yy += 2) {
                vox(bx, 6 + yy, bz - (bz > 0 ? -0.05 : 0.05), 0.3, 0.8, 0.01, pietraBlue, false);
            }
        });

        // =================================================================
        //  7. OS 4 IWANS (portais arqueados nas 4 faces) com decoração
        // =================================================================
        // Moldura externa do iwan (pishtaq) — frente (sul)
        // Molduras retangulares salientes
        function pishtaq(facing) {
            let mx = 0, mz = 0, w = 1, d = 1;
            if (facing === 'south') { mz = -7.05; w = 7; d = 0.15; }
            if (facing === 'north') { mz =  7.05; w = 7; d = 0.15; }
            if (facing === 'east')  { mx =  7.05; w = 0.15; d = 7; }
            if (facing === 'west')  { mx = -7.05; w = 0.15; d = 7; }
            // Moldura vertical externa (alta)
            vox(mx, 10, mz, facing==='south'||facing==='north'?7:0.2, 10.5, facing==='east'||facing==='west'?7:0.2, marbleWarm, false);
            // Topo em cornija
            vox(mx, 15.3, mz, facing==='south'||facing==='north'?7.4:0.3, 0.4, facing==='east'||facing==='west'?7.4:0.3, gold, false);
            // Friso dourado interno do pishtaq
            if (facing==='south'||facing==='north') {
                vox(mx, 15, mz + (facing==='south'?0.05:-0.05), 6.5, 0.15, 0.05, gold, false);
            } else {
                vox(mx + (facing==='east'?-0.05:0.05), 15, mz, 0.05, 0.15, 6.5, gold, false);
            }
        }
        pishtaq('south'); pishtaq('north'); pishtaq('east'); pishtaq('west');

        // Agora as ABERTURAS escuras dos iwans (portais arqueados)
        // Frente (sul, -z)
        iwanArch(0, 5, -7, 4, 7, 6.95, 'south', marble, archShadow);
        // Trás (norte, +z)
        iwanArch(0, 5,  7, 4, 7, 6.95, 'north', marble, archShadow);
        // Leste (+x)
        iwanArch(0, 5,  0, 4, 7, 6.95, 'east',  marble, archShadow);
        // Oeste (-x)
        iwanArch(0, 5,  0, 4, 7, 6.95, 'west',  marble, archShadow);

        // Luz quente vindo de dentro dos iwans (glow dourado)
        vox(0, 7, -6.85, 2, 3, 0.1, lanternGlow, false);
        vox(0, 7,  6.85, 2, 3, 0.1, lanternGlow, false);
        vox(-6.85, 7, 0, 0.1, 3, 2, lanternGlow, false);
        vox( 6.85, 7, 0, 0.1, 3, 2, lanternGlow, false);

        // Detalhe caligráfico / incrustação ao redor dos iwans (pietra dura)
        // Faixas decorativas ao redor das aberturas
        for (let i = -3; i <= 3; i++) {
            if (Math.abs(i) % 2 === 0) {
                // Sul
                vox(i, 12.5, -7.08, 0.6, 0.3, 0.05, pietraRed, false);
                vox(i, 12.5,  7.08, 0.6, 0.3, 0.05, pietraRed, false);
                // Leste/Oeste
                vox( 7.08, 12.5, i, 0.05, 0.3, 0.6, pietraRed, false);
                vox(-7.08, 12.5, i, 0.05, 0.3, 0.6, pietraRed, false);
            } else {
                vox(i, 12.5, -7.08, 0.5, 0.3, 0.05, pietraGreen, false);
                vox(i, 12.5,  7.08, 0.5, 0.3, 0.05, pietraGreen, false);
                vox( 7.08, 12.5, i, 0.05, 0.3, 0.5, pietraGreen, false);
                vox(-7.08, 12.5, i, 0.05, 0.3, 0.5, pietraGreen, false);
            }
        }

        // =================================================================
        //  8. CORNIJA E PARAPEITO DO MAUSOLÉU (y ≈ 14)
        // =================================================================
        // Cornija saliente no topo do mausoléu
        vox(0, 14.3, 0, 15.2, 0.6, 15.2, marbleWarm, false);
        vox(0, 14.75, 0, 14.8, 0.3, 14.8, marble, false);
        // Parapeito decorativo com "ameias" estilizadas
        for (let i = -7; i <= 7; i += 2) {
            vox(i,       15.1, -7.4, 0.4, 0.4, 0.3, marble, false);
            vox(i,       15.1,  7.4, 0.4, 0.4, 0.3, marble, false);
            vox(-7.4,    15.1,  i,  0.3, 0.4, 0.4, marble, false);
            vox( 7.4,    15.1,  i,  0.3, 0.4, 0.4, marble, false);
        }

        // =================================================================
        //  9. OS 4 CHATTRIS (pequenas cúpulas ornamentais nos cantos do telhado)
        // =================================================================
        function chattri(px, pz) {
            // Base/plataforma
            vox(px, 15.3, pz, 2.5, 0.3, 2.5, marble, false);
            // 4 colunas
            vox(px-0.9, 16.3, pz-0.9, 0.3, 1.8, 0.3, marble, false);
            vox(px+0.9, 16.3, pz-0.9, 0.3, 1.8, 0.3, marble, false);
            vox(px-0.9, 16.3, pz+0.9, 0.3, 1.8, 0.3, marble, false);
            vox(px+0.9, 16.3, pz+0.9, 0.3, 1.8, 0.3, marble, false);
            // Topo plano do dossel
            vox(px, 17.3, pz, 2.2, 0.2, 2.2, marbleWarm, false);
            // Cúpula pequena (discos decrescentes)
            disc(px, 17.5, pz, 1.0, 0.3, marble, false);
            disc(px, 17.75, pz, 1.2, 0.25, marble, false);
            disc(px, 18.0, pz, 1.0, 0.25, marble, false);
            disc(px, 18.22, pz, 0.7, 0.25, marble, false);
            disc(px, 18.42, pz, 0.4, 0.25, marble, false);
            // Pináculo dourado
            vox(px, 18.65, pz, 0.15, 0.3, 0.15, gold, false);
            vox(px, 18.9, pz, 0.35, 0.15, 0.35, gold, false);
            vox(px, 19.05, pz, 0.15, 0.2, 0.15, gold, false);
            vox(px, 19.25, pz, 0.3, 0.3, 0.3, goldBright, false);
            vox(px, 19.5, pz, 0.1, 0.3, 0.1, gold, false);
        }
        chattri(-5, -5);
        chattri( 5, -5);
        chattri(-5,  5);
        chattri( 5,  5);

        // =================================================================
        //  10. O TAMBOR (DRUM) DA CÚPULA PRINCIPAL
        // =================================================================
        // Base octogonal do tambor
        disc(0, 15.5, 0, 4.5, 0.6, marbleWarm, false);
        // Drum cilíndrico
        disc(0, 16.2, 0, 4.2, 1.5, marble, false);
        // Friso dourado ao redor do tambor
        ring(0, 17.0, 0, 4.3, 3.9, 0.15, gold, false);
        // Incrustações no drum
        for (let angle = 0; angle < 360; angle += 30) {
            const a = angle * Math.PI / 180;
            const dx = 4.15 * Math.cos(a);
            const dz = 4.15 * Math.sin(a);
            vox(dx, 16.5, dz, 0.3, 0.6, 0.3, pietraBlue, false);
        }

        // =================================================================
        //  11. A GLORIOSA CÚPULA BULBOSA PRINCIPAL
        //      Construída com discos voxel em camadas de raio variável
        //      para formar o perfil bulboso icônico
        // =================================================================
        // Perfil bulboso (raio cresce, atinge máximo, decresce):
        const domeLayers = [
            { y: 17.5,  r: 4.0 },
            { y: 17.9,  r: 4.3 },
            { y: 18.3,  r: 4.5 },
            { y: 18.7,  r: 4.6 },  // ligeiro bulbo inferior
            { y: 19.1,  r: 4.6 },  // parte mais larga
            { y: 19.5,  r: 4.5 },
            { y: 19.9,  r: 4.3 },
            { y: 20.3,  r: 4.0 },
            { y: 20.7,  r: 3.7 },
            { y: 21.1,  r: 3.3 },
            { y: 21.5,  r: 2.9 },
            { y: 21.9,  r: 2.4 },
            { y: 22.3,  r: 1.9 },
            { y: 22.7,  r: 1.4 },
            { y: 23.1,  r: 1.0 },
            { y: 23.5,  r: 0.6 },
        ];
        domeLayers.forEach(l => disc(0, l.y, 0, l.r, 0.42, marble, false));

        // =================================================================
        //  12. O PINÁCULO (KALASHA / FINIAL) DOURADO NO TOPO
        // =================================================================
        vox(0, 24.0, 0, 0.8, 0.3, 0.8, marbleWarm, false);
        vox(0, 24.3, 0, 0.5, 0.4, 0.5, goldDark, false);
        // Esfera dourada inferior (kalasha)
        disc(0, 24.7, 0, 0.9, 0.5, gold, false);
        disc(0, 25.1, 0, 1.1, 0.4, goldBright, false);
        disc(0, 25.5, 0, 0.9, 0.4, gold, false);
        // Haste central
        vox(0, 26.0, 0, 0.25, 1.0, 0.25, goldDark, false);
        // Segunda kalasha menor
        disc(0, 27.0, 0, 0.7, 0.35, gold, false);
        disc(0, 27.3, 0, 0.5, 0.3, goldBright, false);
        // Haste superior
        vox(0, 27.8, 0, 0.15, 0.8, 0.15, goldDark, false);
        // Lua crescente (símbolo islâmico) — aproximação voxel
        vox(0, 28.5, 0, 0.8, 0.15, 0.15, gold, false);
        vox(-0.3, 28.7, 0, 0.15, 0.3, 0.15, gold, false);
        vox( 0.3, 28.7, 0, 0.15, 0.3, 0.15, gold, false);
        // Pico luminoso
        vox(0, 29.0, 0, 0.25, 0.25, 0.25, goldBright, false);

        // =================================================================
        //  13. OS 4 MINARETES — torres altas nos 4 cantos da plataforma
        //      Cada minarete tem 3 varandas e um chattri no topo
        // =================================================================
        function minaret(mx, mz) {
            // Base octogonal
            disc(mx, 3.0, mz, 1.8, 0.5, marbleWarm, false);
            disc(mx, 3.5, mz, 1.6, 0.3, marble, false);
            // Fuste (corpo principal) — dividido em 3 seções pelas varandas
            // Seção 1 (da base até primeira varanda, y=3.8 → y=9)
            disc(mx, 6.4, mz, 1.2, 5.2, marble);
            // Primeira varanda (y ≈ 9)
            ring(mx, 9.1, mz, 1.8, 1.15, 0.2, gold, false);
            disc(mx, 9.3, mz, 1.7, 0.3, marbleWarm, false);
            disc(mx, 9.55, mz, 1.5, 0.15, marble, false);
            // Parapeito da varanda 1 (pequenas colunas)
            for (let a = 0; a < 360; a += 45) {
                const ang = a * Math.PI / 180;
                const dx = 1.5 * Math.cos(ang);
                const dz = 1.5 * Math.sin(ang);
                vox(mx+dx, 9.85, mz+dz, 0.15, 0.4, 0.15, marble, false);
            }

            // Seção 2 (y=9.6 → y=15)
            disc(mx, 12.5, mz, 1.0, 5.0, marble);
            // Segunda varanda
            ring(mx, 15.1, mz, 1.5, 0.95, 0.2, gold, false);
            disc(mx, 15.3, mz, 1.4, 0.3, marbleWarm, false);
            disc(mx, 15.55, mz, 1.2, 0.15, marble, false);
            for (let a = 0; a < 360; a += 45) {
                const ang = a * Math.PI / 180;
                const dx = 1.2 * Math.cos(ang);
                const dz = 1.2 * Math.sin(ang);
                vox(mx+dx, 15.85, mz+dz, 0.13, 0.35, 0.13, marble, false);
            }

            // Seção 3 (y=15.6 → y=20)
            disc(mx, 18.0, mz, 0.85, 4.3, marble);
            // Terceira varanda
            ring(mx, 20.35, mz, 1.3, 0.8, 0.2, gold, false);
            disc(mx, 20.55, mz, 1.2, 0.25, marbleWarm, false);
            disc(mx, 20.75, mz, 1.0, 0.15, marble, false);
            for (let a = 0; a < 360; a += 45) {
                const ang = a * Math.PI / 180;
                const dx = 1.0 * Math.cos(ang);
                const dz = 1.0 * Math.sin(ang);
                vox(mx+dx, 21.05, mz+dz, 0.1, 0.3, 0.1, marble, false);
            }

            // Chattri do minarete (cúpula pequena no topo)
            // Pilares
            vox(mx-0.6, 21.6, mz-0.6, 0.2, 1.4, 0.2, marble, false);
            vox(mx+0.6, 21.6, mz-0.6, 0.2, 1.4, 0.2, marble, false);
            vox(mx-0.6, 21.6, mz+0.6, 0.2, 1.4, 0.2, marble, false);
            vox(mx+0.6, 21.6, mz+0.6, 0.2, 1.4, 0.2, marble, false);
            // Topo
            disc(mx, 22.4, mz, 1.0, 0.2, marbleWarm, false);
            // Cupolazinha
            disc(mx, 22.6, mz, 0.85, 0.25, marble, false);
            disc(mx, 22.85, mz, 1.0, 0.2, marble, false);
            disc(mx, 23.05, mz, 0.8, 0.25, marble, false);
            disc(mx, 23.3, mz, 0.5, 0.25, marble, false);
            disc(mx, 23.55, mz, 0.25, 0.2, marble, false);
            // Pináculo dourado
            vox(mx, 23.8, mz, 0.15, 0.3, 0.15, gold, false);
            disc(mx, 24.1, mz, 0.35, 0.3, gold, false);
            vox(mx, 24.45, mz, 0.12, 0.4, 0.12, goldDark, false);
            disc(mx, 24.85, mz, 0.25, 0.2, goldBright, false);
            vox(mx, 25.1, mz, 0.08, 0.4, 0.08, gold, false);

            // Luz discreta na base do minarete (lanterna noturna)
            vox(mx, 3.6, mz, 0.4, 0.1, 0.4, lanternGlow, false);
        }

        minaret(-9.5, -9.5);
        minaret( 9.5, -9.5);
        minaret(-9.5,  9.5);
        minaret( 9.5,  9.5);

        // =================================================================
        //  14. JARDIM CHARBAGH — CIPRESTES ACROSS O JARDIM
        // =================================================================
        function cypress_tree(px, pz, height) {
            // Tronco
            vox(px, 0.4, pz, 0.4, 0.8, 0.4, trunk, false);
            // Folhagem cônica (vários discos)
            const layers = height || 5;
            for (let i = 0; i < layers; i++) {
                const yy = 0.8 + i * 0.6;
                const r = 0.9 - i * 0.12;
                const mat = i % 2 === 0 ? cypress : cypressDark;
                disc(px, yy, pz, r, 0.6, mat, false);
            }
            // Topo pontudo
            vox(px, 0.8 + layers * 0.6, pz, 0.2, 0.3, 0.2, cypressDark, false);
        }

        // Ciprestes flanqueando a piscina sul
        cypress_tree(-5, -13.8, 6);
        cypress_tree( 5, -13.8, 6);
        cypress_tree(-6.5, -12.5, 5);
        cypress_tree( 6.5, -12.5, 5);
        // Ciprestes flanqueando a piscina norte
        cypress_tree(-5,  13.8, 6);
        cypress_tree( 5,  13.8, 6);
        cypress_tree(-6.5,  12.5, 5);
        cypress_tree( 6.5,  12.5, 5);
        // Ciprestes nas laterais leste/oeste
        cypress_tree(-13.5, -5, 6);
        cypress_tree(-13.5,  5, 6);
        cypress_tree( 13.5, -5, 6);
        cypress_tree( 13.5,  5, 6);
        cypress_tree(-12.5, 0, 5);
        cypress_tree( 12.5, 0, 5);

        // Canteiros floridos na base dos ciprestes (pequenos detalhes)
        function flowerbed(px, pz) {
            vox(px, 0.15, pz, 1.5, 0.05, 1.5, pietraRed, false);
            vox(px-0.3, 0.25, pz-0.3, 0.15, 0.15, 0.15, gold, false);
            vox(px+0.3, 0.25, pz+0.3, 0.15, 0.15, 0.15, pietraBlue, false);
            vox(px+0.3, 0.25, pz-0.3, 0.15, 0.15, 0.15, marble, false);
            vox(px-0.3, 0.25, pz+0.3, 0.15, 0.15, 0.15, pietraGreen, false);
        }
        flowerbed(-7, -9);
        flowerbed( 7, -9);
        flowerbed(-7,  9);
        flowerbed( 7,  9);

        // =================================================================
        //  15. LANTERNAS NO JARDIM (luz noturna romântica)
        // =================================================================
        function lantern(px, pz) {
            vox(px, 0.4, pz, 0.3, 0.8, 0.3, marbleBase, false);
            vox(px, 0.9, pz, 0.5, 0.2, 0.5, marbleWarm, false);
            vox(px, 1.15, pz, 0.35, 0.4, 0.35, lanternGlow, false);
            vox(px, 1.5, pz, 0.45, 0.15, 0.45, marbleWarm, false);
            vox(px, 1.65, pz, 0.15, 0.25, 0.15, gold, false);
        }
        lantern(-8, -13);
        lantern( 8, -13);
        lantern(-8,  13);
        lantern( 8,  13);
        lantern(-13, -8);
        lantern(-13,  8);
        lantern( 13, -8);
        lantern( 13,  8);

        // =================================================================
        //  16. LUZES DECORATIVAS NO MAUSOLÉU (iluminação dramática)
        // =================================================================
        // Anel de luzes dourado ao redor da base da cúpula principal
        for (let angle = 0; angle < 360; angle += 22.5) {
            const a = angle * Math.PI / 180;
            const dx = 4.4 * Math.cos(a);
            const dz = 4.4 * Math.sin(a);
            vox(dx, 17.2, dz, 0.2, 0.2, 0.2, goldBright, false);
        }
        // Luzes sob a cornija
        for (let i = -6; i <= 6; i += 2) {
            vox(i, 14.1, -7.3, 0.3, 0.1, 0.05, lanternGlow, false);
            vox(i, 14.1,  7.3, 0.3, 0.1, 0.05, lanternGlow, false);
            vox(-7.3, 14.1, i, 0.05, 0.1, 0.3, lanternGlow, false);
            vox( 7.3, 14.1, i, 0.05, 0.1, 0.3, lanternGlow, false);
        }

        // =================================================================
        //  17. PLACA DE ASSINATURA "CLAUDE OPUS 4.7"
        //      Em voxel-art, posicionada em frente à escadaria
        // =================================================================

        // Pedestal da placa
        vox(0, 0.5, -9.8, 7.5, 1.0, 0.5, marbleBase);
        // Tabuleta da placa (fundo escuro)
        vox(0, 1.5, -9.75, 7.0, 1.5, 0.15, signDark);
        // Moldura dourada
        vox(0, 2.3, -9.7, 7.2, 0.1, 0.08, gold, false);
        vox(0, 0.75, -9.7, 7.2, 0.1, 0.08, gold, false);
        vox(-3.6, 1.5, -9.7, 0.1, 1.5, 0.08, gold, false);
        vox( 3.6, 1.5, -9.7, 0.1, 1.5, 0.08, gold, false);

        // ---- SISTEMA DE FONTE VOXEL (5x7 pixel) ----
        const FONT = {
            'C': ["01110","10001","10000","10000","10000","10001","01110"],
            'L': ["10000","10000","10000","10000","10000","10000","11111"],
            'A': ["01110","10001","10001","11111","10001","10001","10001"],
            'U': ["10001","10001","10001","10001","10001","10001","01110"],
            'D': ["11110","10001","10001","10001","10001","10001","11110"],
            'E': ["11111","10000","10000","11110","10000","10000","11111"],
            'O': ["01110","10001","10001","10001","10001","10001","01110"],
            'P': ["11110","10001","10001","11110","10000","10000","10000"],
            'S': ["01111","10000","10000","01110","00001","00001","11110"],
            '4': ["10001","10001","10001","11111","00001","00001","00001"],
            '.': ["00000","00000","00000","00000","00000","00000","00100"],
            '7': ["11111","00001","00001","00010","00100","00100","00100"],
            ' ': ["00000","00000","00000","00000","00000","00000","00000"],
        };

        function drawText(text, originX, originY, z, pixelSize, mat) {
            const charW = 5, charH = 7;
            const totalW = text.length * (charW + 1) * pixelSize - pixelSize;
            let startX = originX - totalW / 2;
            for (let ci = 0; ci < text.length; ci++) {
                const glyph = FONT[text[ci]] || FONT[' '];
                for (let row = 0; row < charH; row++) {
                    for (let col = 0; col < charW; col++) {
                        if (glyph[row][col] === '1') {
                            const px = startX + (ci * (charW + 1) + col) * pixelSize + pixelSize/2;
                            const py = originY + (charH - 1 - row) * pixelSize + pixelSize/2;
                            vox(px, py, z, pixelSize*1.02, pixelSize*1.02, pixelSize*1.02, mat, false);
                        }
                    }
                }
            }
        }

        // Linha 1: "CLAUDE OPUS"
        drawText("CLAUDE OPUS", 0, 1.85, -9.62, 0.18, signGold);
        // Linha 2: "4.7"
        drawText("4.7", 0, 0.92, -9.62, 0.18, signGold);

        // Pequenas gemas decorativas na placa (cantos)
        vox(-3.2, 2.25, -9.65, 0.15, 0.15, 0.08, pietraRed, false);
        vox( 3.2, 2.25, -9.65, 0.15, 0.15, 0.08, pietraRed, false);
        vox(-3.2, 0.85, -9.65, 0.15, 0.15, 0.08, pietraBlue, false);
        vox( 3.2, 0.85, -9.65, 0.15, 0.15, 0.08, pietraBlue, false);

        // Luminária sobre a placa
        vox(0, 2.65, -9.8, 0.4, 0.2, 0.3, marbleWarm, false);
        vox(0, 2.5, -9.7, 0.6, 0.1, 0.1, lanternGlow, false);

        // =================================================================
        //  18. PEQUENAS GAIVOTAS / DETALHES FINAIS NO CÉU
        //      (blocos brancos flutuantes dão impressão de pássaros)
        // =================================================================
        vox(-6, 26, 8, 0.4, 0.1, 0.15, marble, false);
        vox(-5.7, 26, 8, 0.4, 0.1, 0.15, marble, false);
        vox( 6, 27, -7, 0.4, 0.1, 0.15, marble, false);
        vox( 6.3, 27, -7, 0.4, 0.1, 0.15, marble, false);
        vox( 8, 24, 10, 0.3, 0.1, 0.1, marble, false);

        // =================================================================
        //  19. REGISTRAR O MAUSOLÉU NO MINIMAPA
        // =================================================================
        // O prédio principal ficará visível no minimapa como um grande ponto central
        if (ctx.buildings) {
            // Adiciona uma referência do mausoléu (pseudo-prédio para o minimapa)
            ctx.buildings.push({
                x: cx,
                z: cz,
                width: 14,
                depth: 14,
                height: 28,
                type: 'taj_mahal'
            });
        }

        // =================================================================
        //  FIM — "Aqui jaz, em voxels, a memória eterna do amor."
        //  Construído por Claude Opus 4.7 · Anthropic · 2026
        // =================================================================
    };
})();
