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
        const pietraPurple  = new THREE.MeshLambertMaterial({ color: 0x6b2a8b }); // ametista incrustada
        const marblePink    = new THREE.MeshLambertMaterial({ color: 0xeacfb3 }); // mármore rosa (piso)
        const warmGlow      = new THREE.MeshBasicMaterial(  { color: 0xffaa44 }); // halo quente
        const darkInlay     = new THREE.MeshLambertMaterial({ color: 0x3a2a1a }); // caligrafia/inscrições
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
        //     Leva do chão até o topo da chabutara principal
        // =================================================================
        for (let i = 0; i < 3; i++) {
            const y = 0.3 + i * 0.4;
            const zOffset = -11.5 - (2 - i) * 0.8;
            vox(0, y, zOffset, 7 - i*0.3, 0.4, 0.8, marbleShadow);
        }
        // Degraus adicionais subindo da plataforma principal (Y=2.4) até a
        // chabutara secundária (Y=3.8). Divididos em dois lados para não
        // colidir com a placa central de assinatura.
        for (let i = 0; i < 3; i++) {
            const y = 2.6 + i * 0.4;          // Y=2.4→2.8, 2.8→3.2, 3.2→3.6
            const z = -9.0 + i * 0.6;         // avança em direção ao mausoléu
            // Escadinha oeste (esquerda do pedestal)
            vox(-5, y, z, 2, 0.4, 0.6, marbleShadow);
            // Escadinha leste (direita do pedestal)
            vox( 5, y, z, 2, 0.4, 0.6, marbleShadow);
        }
        // Rampa final (0.2 de diferença até o piso da chab secundária)
        vox(-5, 3.7, -7.5, 2, 0.2, 0.6, marbleShadow);
        vox( 5, 3.7, -7.5, 2, 0.2, 0.6, marbleShadow);

        // =================================================================
        //  5. CHABUTARA SECUNDÁRIA (base elevada do mausoléu) — 17×17
        //     ATENÇÃO: este bloco gigante (17×0.8×17) é APENAS VISUAL.
        //     A colisão real do "chão" sobre o qual o jogador anda é
        //     fornecida pelo piso fino (height 0.1) na seção 7.5.1.
        //     Caixas grandes com colisão fazem o jogador ficar preso
        //     "dentro" do volume sólido ao entrar pelo iwan.
        // =================================================================
        vox(0, 3.4, 0, 17, 0.8, 17, marble, false);   // ← visual, sem colisão
        // Friso dourado superior
        vox(0, 3.9, -8.45, 17, 0.1, 0.15, gold, false);
        vox(0, 3.9,  8.45, 17, 0.1, 0.15, gold, false);
        vox(-8.45, 3.9, 0, 0.15, 0.1, 17, gold, false);
        vox( 8.45, 3.9, 0, 0.15, 0.1, 17, gold, false);

        // =================================================================
        //  6. MAUSOLÉU — ESTRUTURA OCA COM 4 IWANS ABERTOS (porta real)
        //     4 pilares de canto + 8 paredes laterais + 4 topos sobre iwans
        //     Abertura de cada iwan: 4 de largura, 7 de altura (y=4 → 11)
        //     Parede externa: y=4 → 14 (10 unidades)
        // =================================================================

        // ---- 6.1  PILARES DE CANTO (decorativos, SEM colisão) ----
        // Os cantos são fechados pelas paredes laterais estendidas (6.2).
        // Estes pilares são apenas o "rosto" arquitetônico do canto e o
        // jogador pode atravessar a parte deles que invade a câmara.
        const corners = [[-6,-6],[6,-6],[-6,6],[6,6]];
        corners.forEach(([px, pz]) => {
            vox(px, 9, pz, 2, 10, 2, marbleWarm, false);   // ← agora SEM colisão
            // Arestas verticais douradas
            vox(px-0.9, 9, pz-0.9, 0.15, 9, 0.15, gold, false);
            vox(px+0.9, 9, pz-0.9, 0.15, 9, 0.15, gold, false);
            vox(px-0.9, 9, pz+0.9, 0.15, 9, 0.15, gold, false);
            vox(px+0.9, 9, pz+0.9, 0.15, 9, 0.15, gold, false);
            // Incrustações pietra dura nas faces externas
            const pzOut = pz < 0 ? pz - 1.05 : pz + 1.05;
            const pxOut = px < 0 ? px - 1.05 : px + 1.05;
            vox(px, 8.5, pzOut, 0.6, 5, 0.01, pietraBlue, false);
            vox(pxOut, 8.5, pz, 0.01, 5, 0.6, pietraBlue, false);
            vox(px, 11.5, pzOut, 0.4, 0.4, 0.01, pietraRed, false);
            vox(pxOut, 11.5, pz, 0.01, 0.4, 0.4, pietraRed, false);
        });

        // ---- 6.2  PAREDES LATERAIS DAS 4 FACES ----
        // Paredes ESTENDIDAS até x=±7 / z=±7 para fechar completamente os
        // cantos sem deixar fendas por onde o jogador escape.
        // Cada parede agora cobre 5 unidades de cada lado do iwan (em vez
        // de 3), encostando na borda externa da estrutura.
        // SUL (-Z): segmentos de x=-7..-2 e x=2..7
        vox(-4.5, 9, -6.75, 5, 10, 0.5, marble);
        vox( 4.5, 9, -6.75, 5, 10, 0.5, marble);
        vox( 0,  12.5, -6.75, 4, 3, 0.5, marble);
        // NORTE (+Z)
        vox(-4.5, 9,  6.75, 5, 10, 0.5, marble);
        vox( 4.5, 9,  6.75, 5, 10, 0.5, marble);
        vox( 0,  12.5,  6.75, 4, 3, 0.5, marble);
        // LESTE (+X): segmentos de z=-7..-2 e z=2..7
        vox( 6.75, 9, -4.5, 0.5, 10, 5, marble);
        vox( 6.75, 9,  4.5, 0.5, 10, 5, marble);
        vox( 6.75, 12.5, 0, 0.5, 3, 4, marble);
        // OESTE (-X)
        vox(-6.75, 9, -4.5, 0.5, 10, 5, marble);
        vox(-6.75, 9,  4.5, 0.5, 10, 5, marble);
        vox(-6.75, 12.5, 0, 0.5, 3, 4, marble);

        // ---- 6.3  CANTOS CURVOS DO IWAN (formam o topo arqueado) ----
        // Preenche os cantos superiores da abertura retangular, criando o arco
        function archCorners(axis, fixedCoord) {
            for (let step = 0; step < 20; step++) {
                const dy = step * 0.1;
                const y = 11 - dy;
                if (dy > 2) break;
                const halfArch = Math.sqrt(4 - dy*dy);
                for (let dx_ = halfArch; dx_ <= 2; dx_ += 0.2) {
                    if (axis === 'x') {
                        vox( dx_, y, fixedCoord, 0.22, 0.12, 0.55, marble, false);
                        vox(-dx_, y, fixedCoord, 0.22, 0.12, 0.55, marble, false);
                    } else {
                        vox(fixedCoord, y,  dx_, 0.55, 0.12, 0.22, marble, false);
                        vox(fixedCoord, y, -dx_, 0.55, 0.12, 0.22, marble, false);
                    }
                }
            }
        }
        archCorners('x', -6.75);
        archCorners('x',  6.75);
        archCorners('z',  6.75);
        archCorners('z', -6.75);

        // ---- 6.4  CONTORNO DO ARCO (moldura fina dourada) ----
        function archOutline(axis, fixedCoord, outerOffset) {
            for (let a = 0; a <= 180; a += 10) {
                const ang = a * Math.PI / 180;
                const dx_ = 2 * Math.cos(ang);
                const dy = 2 * Math.sin(ang);
                if (axis === 'x') {
                    vox(dx_, 11 - dy + 0.1, fixedCoord + outerOffset, 0.18, 0.18, 0.05, gold, false);
                } else {
                    vox(fixedCoord + outerOffset, 11 - dy + 0.1, dx_, 0.05, 0.18, 0.18, gold, false);
                }
            }
        }
        // Arcos visíveis de fora
        archOutline('x', -6.75, -0.28);
        archOutline('x',  6.75,  0.28);
        archOutline('z',  6.75,  0.28);
        archOutline('z', -6.75, -0.28);
        // Arcos visíveis de dentro
        archOutline('x', -6.75,  0.28);
        archOutline('x',  6.75, -0.28);
        archOutline('z',  6.75, -0.28);
        archOutline('z', -6.75,  0.28);

        // =================================================================
        //  7. OS 4 IWANS — PISHTAQ em "U" invertido (moldura externa)
        // =================================================================
        function pishtaq(facing) {
            const t = 0.2;
            if (facing === 'south') {
                vox(0, 14.25, -7.05, 7.4, 0.5, t, marbleWarm, false);
                vox(-3.6, 9.65, -7.05, t, 9.8, t, marbleWarm, false);
                vox( 3.6, 9.65, -7.05, t, 9.8, t, marbleWarm, false);
                vox(0, 14.55, -7.06, 7.4, 0.15, t+0.04, gold, false);
            }
            if (facing === 'north') {
                vox(0, 14.25,  7.05, 7.4, 0.5, t, marbleWarm, false);
                vox(-3.6, 9.65,  7.05, t, 9.8, t, marbleWarm, false);
                vox( 3.6, 9.65,  7.05, t, 9.8, t, marbleWarm, false);
                vox(0, 14.55,  7.06, 7.4, 0.15, t+0.04, gold, false);
            }
            if (facing === 'east') {
                vox( 7.05, 14.25, 0, t, 0.5, 7.4, marbleWarm, false);
                vox( 7.05, 9.65, -3.6, t, 9.8, t, marbleWarm, false);
                vox( 7.05, 9.65,  3.6, t, 9.8, t, marbleWarm, false);
                vox( 7.06, 14.55, 0, t+0.04, 0.15, 7.4, gold, false);
            }
            if (facing === 'west') {
                vox(-7.05, 14.25, 0, t, 0.5, 7.4, marbleWarm, false);
                vox(-7.05, 9.65, -3.6, t, 9.8, t, marbleWarm, false);
                vox(-7.05, 9.65,  3.6, t, 9.8, t, marbleWarm, false);
                vox(-7.06, 14.55, 0, t+0.04, 0.15, 7.4, gold, false);
            }
        }
        pishtaq('south'); pishtaq('north'); pishtaq('east'); pishtaq('west');

        // Luz emanando dos iwans (vista de fora — dá vida ao interior)
        vox(0, 8, -6.85, 2.5, 3.5, 0.08, warmGlow, false);
        vox(0, 8,  6.85, 2.5, 3.5, 0.08, warmGlow, false);
        vox(-6.85, 8, 0, 0.08, 3.5, 2.5, warmGlow, false);
        vox( 6.85, 8, 0, 0.08, 3.5, 2.5, warmGlow, false);

        // Incrustações externas ao redor dos iwans
        for (let i = -3; i <= 3; i++) {
            const mat = (Math.abs(i) % 2 === 0) ? pietraRed : pietraGreen;
            const sz = (Math.abs(i) % 2 === 0) ? 0.5 : 0.4;
            vox(i, 13.8, -7.08, sz, 0.3, 0.05, mat, false);
            vox(i, 13.8,  7.08, sz, 0.3, 0.05, mat, false);
            vox( 7.08, 13.8, i, 0.05, 0.3, sz, mat, false);
            vox(-7.08, 13.8, i, 0.05, 0.3, sz, mat, false);
        }


        // =================================================================
        //  7.5  INTERIOR DO MAUSOLÉU — SANTUÁRIO DE MÁRMORE
        //  Ao passar pelos iwans, o visitante encontra:
        //    · piso em mosaico com estrela mogul dourada
        //    · dois cenotáfios (Mumtaz e Shah Jahan) com incrustações
        //    · tela jali rendilhada ao redor dos cenotáfios
        //    · pilares internos com capitéis dourados
        //    · cúpula interna dourada (diferente da externa)
        //    · chiragh (lâmpada) pendurada no centro
        //    · tochas, vasos e raios de luz atravessando a câmara
        // =================================================================

        // ---- 7.5.1  PISO INTERNO — agora é o "chão real" colidível ----
        // Caixa fina (0.1 de altura) cobrindo toda a área do mausoléu (17×17).
        // Por ser fina, o jogador NÃO consegue ficar preso dentro dela —
        // apenas pousa em cima a Y=3.9.
        vox(0, 3.85, 0, 17, 0.1, 17, marble);  // ← AGORA com colisão
        // Caminho cruciforme em pedra rosa (alinha com os 4 iwans)
        vox(0, 3.91, 0, 2, 0.02, 13, marblePink, false);
        vox(0, 3.91, 0, 13, 0.02, 2, marblePink, false);
        // Estrela mogul de 8 pontas (centro)
        disc(0, 3.93, 0, 1.8, 0.02, marbleWarm, false);
        for (let a = 0; a < 360; a += 45) {
            const ang = a * Math.PI / 180;
            const dx = 1.3 * Math.cos(ang);
            const dz = 1.3 * Math.sin(ang);
            vox(dx, 3.94, dz, 0.35, 0.02, 0.35, gold, false);
        }
        vox(0, 3.94, 0, 0.7, 0.02, 0.7, goldBright, false);
        // Mosaico octogonal ao redor
        for (let r = 2.5; r < 5.5; r += 1) {
            for (let a = 0; a < 360; a += 22.5) {
                const ang = a * Math.PI / 180;
                const dx = r * Math.cos(ang);
                const dz = r * Math.sin(ang);
                const mat = ((Math.floor(r) + Math.floor(a/22.5)) % 2 === 0) ? pietraBlue : pietraRed;
                vox(dx, 3.92, dz, 0.3, 0.015, 0.3, mat, false);
            }
        }

        // ---- 7.5.2  CENOTÁFIO DE MUMTAZ MAHAL (central) ----
        vox(0, 4.45, 0, 3, 0.7, 1.6, marble, false);
        // Moldura dourada
        vox(0, 4.82, -0.85, 3.1, 0.05, 0.05, gold, false);
        vox(0, 4.82,  0.85, 3.1, 0.05, 0.05, gold, false);
        vox(-1.55, 4.82, 0, 0.05, 0.05, 1.7, gold, false);
        vox( 1.55, 4.82, 0, 0.05, 0.05, 1.7, gold, false);
        // Tampa
        vox(0, 4.9, 0, 2.8, 0.1, 1.4, marbleWarm, false);
        // Flores pietra dura na tampa
        for (let i = -1; i <= 1; i++) {
            vox(i, 4.98, 0,     0.15, 0.02, 0.4, pietraRed, false);
            vox(i, 4.98, 0.4,   0.1,  0.02, 0.1, pietraGreen, false);
            vox(i, 4.98, -0.4,  0.1,  0.02, 0.1, pietraGreen, false);
            vox(i, 4.98, 0.15,  0.08, 0.02, 0.08, pietraBlue, false);
            vox(i, 4.98, -0.15, 0.08, 0.02, 0.08, pietraPurple, false);
        }
        // Pináculo ornamental
        vox(0, 5.05, 0, 0.15, 0.2, 0.15, goldBright, false);
        vox(0, 5.2, 0, 0.3, 0.1, 0.3, gold, false);
        vox(0, 5.3, 0, 0.1, 0.15, 0.1, gold, false);
        // Inscrições caligráficas laterais
        for (let i = -1.2; i <= 1.2; i += 0.4) {
            vox(i, 4.7, -0.82, 0.1, 0.25, 0.01, darkInlay, false);
            vox(i, 4.7,  0.82, 0.1, 0.25, 0.01, darkInlay, false);
        }

        // ---- 7.5.3  CENOTÁFIO DE SHAH JAHAN (a ÚNICA assimetria do Taj real!) ----
        vox(1.8, 4.55, 0, 2.5, 0.9, 1.4, marble, false);
        vox(1.8, 5.02, -0.75, 2.6, 0.05, 0.05, gold, false);
        vox(1.8, 5.02,  0.75, 2.6, 0.05, 0.05, gold, false);
        vox(0.5, 5.02, 0, 0.05, 0.05, 1.5, gold, false);
        vox(3.1, 5.02, 0, 0.05, 0.05, 1.5, gold, false);
        vox(1.8, 5.1, 0, 2.3, 0.1, 1.2, marbleWarm, false);
        // Ornamento superior diferenciado
        vox(1.8, 5.2, 0, 0.15, 0.2, 0.15, goldDark, false);
        vox(1.8, 5.35, 0, 0.25, 0.1, 0.25, gold, false);
        vox(1.8, 5.45, 0, 0.1, 0.12, 0.1, goldBright, false);
        for (let i = 0.8; i <= 2.8; i += 0.4) {
            vox(i, 4.85, -0.72, 0.1, 0.25, 0.01, darkInlay, false);
            vox(i, 4.85,  0.72, 0.1, 0.25, 0.01, darkInlay, false);
        }

        // Halo místico ao redor dos cenotáfios
        disc(0, 3.97, 0, 5.3, 0.01, warmGlow, false);

        // ---- 7.5.4  JALI — tela de mármore rendilhado OCTOGONAL ----
        const jaliRadius = 4.5;
        for (let a = 0; a < 360; a += 11.25) {
            if (a > 255 && a < 285) continue;  // abertura sul (entrada ao recinto dos cenotáfios)
            const ang = a * Math.PI / 180;
            const px = jaliRadius * Math.cos(ang);
            const pz = jaliRadius * Math.sin(ang);
            if (a % 22.5 < 0.1) {
                vox(px, 5.6, pz, 0.18, 2.8, 0.18, marble, false);
            } else {
                vox(px, 4.55, pz, 0.12, 0.3, 0.12, marble, false);
                vox(px, 5.15, pz, 0.12, 0.3, 0.12, marble, false);
                vox(px, 5.75, pz, 0.12, 0.3, 0.12, marble, false);
                vox(px, 6.35, pz, 0.12, 0.3, 0.12, marble, false);
                vox(px, 6.95, pz, 0.12, 0.3, 0.12, marble, false);
            }
        }
        ring(0, 4.35, 0, jaliRadius+0.15, jaliRadius-0.2, 0.15, marbleWarm, false);
        ring(0, 4.48, 0, jaliRadius+0.15, jaliRadius-0.2, 0.06, gold, false);
        ring(0, 7.1,  0, jaliRadius+0.15, jaliRadius-0.2, 0.15, marbleWarm, false);
        ring(0, 7.23, 0, jaliRadius+0.15, jaliRadius-0.2, 0.06, gold, false);

        // ---- 7.5.5  4 PILARES ORNAMENTAIS INTERNOS ----
        const innerPillars = [[-5.5,-5.5],[5.5,-5.5],[-5.5,5.5],[5.5,5.5]];
        innerPillars.forEach(([px, pz]) => {
            vox(px, 4.3, pz, 0.7, 0.3, 0.7, marbleWarm, false);
            vox(px, 4.55, pz, 0.55, 0.15, 0.55, gold, false);
            vox(px, 8.5, pz, 0.4, 8.0, 0.4, marble, false);
            vox(px, 6, pz, 0.5, 0.12, 0.5, gold, false);
            vox(px, 9, pz, 0.5, 0.12, 0.5, gold, false);
            vox(px, 12, pz, 0.5, 0.12, 0.5, gold, false);
            vox(px, 12.7, pz, 0.7, 0.4, 0.7, marbleWarm, false);
            vox(px, 13, pz, 0.85, 0.15, 0.85, gold, false);
            vox(px, 13.2, pz, 0.65, 0.15, 0.65, marbleWarm, false);
        });

        // ---- 7.5.6  TETO INTERNO PLANO (com abertura para a cúpula interna) ----
        for (let x = -6; x <= 6; x++) {
            for (let z = -6; z <= 6; z++) {
                if (x*x + z*z >= 5.6*5.6 &&
                    Math.max(Math.abs(x), Math.abs(z)) <= 6.2) {
                    vox(x, 14.0, z, 1.02, 0.15, 1.02, marble, false);
                }
            }
        }
        ring(0, 14.08, 0, 5.7, 5.5, 0.08, gold, false);
        ring(0, 13.95, 0, 5.7, 5.5, 0.12, marbleWarm, false);

        // Estrelas douradas no teto
        for (let a = 7.5; a < 360; a += 30) {
            const ang = a * Math.PI / 180;
            const dx = 5.9 * Math.cos(ang);
            const dz = 5.9 * Math.sin(ang);
            vox(dx, 13.95, dz, 0.2, 0.04, 0.2, gold, false);
            vox(dx + 0.18, 13.95, dz, 0.12, 0.04, 0.04, goldBright, false);
            vox(dx - 0.18, 13.95, dz, 0.12, 0.04, 0.04, goldBright, false);
            vox(dx, 13.95, dz + 0.18, 0.04, 0.04, 0.12, goldBright, false);
            vox(dx, 13.95, dz - 0.18, 0.04, 0.04, 0.12, goldBright, false);
        }

        // ---- 7.5.7  CÚPULA INTERNA DOURADA (visível de dentro) ----
        // O Taj real possui DUAS cúpulas — aqui a interior, menor e decorada
        const innerDomeLayers = [
            { y: 14.15, r: 5.5 },
            { y: 14.45, r: 5.35 },
            { y: 14.75, r: 5.15 },
            { y: 15.05, r: 4.85 },
            { y: 15.35, r: 4.45 },
            { y: 15.65, r: 3.95 },
            { y: 15.95, r: 3.35 },
            { y: 16.25, r: 2.65 },
            { y: 16.55, r: 1.85 },
            { y: 16.85, r: 1.0 },
        ];
        innerDomeLayers.forEach(l => {
            ring(0, l.y, 0, l.r, l.r - 0.35, 0.32, marbleWarm, false);
        });
        // 8 raios decorativos
        for (let a = 0; a < 360; a += 45) {
            const ang = a * Math.PI / 180;
            innerDomeLayers.forEach(l => {
                const r = l.r - 0.18;
                const dx = r * Math.cos(ang);
                const dz = r * Math.sin(ang);
                vox(dx, l.y + 0.16, dz, 0.2, 0.04, 0.2, gold, false);
            });
        }
        // Medalhão ápice
        disc(0, 16.95, 0, 0.9, 0.05, gold, false);
        disc(0, 17.00, 0, 0.6, 0.05, goldBright, false);
        disc(0, 17.05, 0, 0.3, 0.05, gold, false);
        vox(0, 16.8, 0, 0.15, 0.15, 0.15, goldDark, false);

        // ---- 7.5.8  CHIRAGH — lâmpada pendurada do centro da cúpula ----
        vox(0, 15.2, 0, 0.1, 3.0, 0.1, goldDark, false);       // corrente
        vox(0, 13.65, 0, 0.2, 0.1, 0.2, gold, false);          // anel de suspensão
        // Corpo bulboso da lâmpada
        disc(0, 13.45, 0, 0.5, 0.2, gold, false);
        disc(0, 13.2, 0, 0.65, 0.3, goldBright, false);
        disc(0, 12.95, 0, 0.55, 0.25, gold, false);
        disc(0, 12.75, 0, 0.35, 0.2, gold, false);
        // Núcleo luminoso
        vox(0, 13.2, 0, 0.5, 0.4, 0.5, moonlight, false);
        // Halo que emana
        disc(0, 13.2, 0, 1.0, 0.01, warmGlow, false);
        // Pingente
        vox(0, 12.55, 0, 0.15, 0.15, 0.15, gold, false);
        vox(0, 12.4, 0, 0.25, 0.1, 0.25, goldBright, false);
        vox(0, 12.3, 0, 0.1, 0.15, 0.1, gold, false);

        // ---- 7.5.9  TOCHAS INTERNAS nas paredes ----
        innerPillars.forEach(([px, pz]) => {
            const sx = px * 0.75;
            const sz = pz * 0.75;
            vox(sx, 7, sz, 0.25, 0.25, 0.25, goldDark, false);
            vox(sx, 7.3, sz, 0.45, 0.3, 0.45, gold, false);
            vox(sx, 7.55, sz, 0.4, 0.15, 0.4, goldBright, false);
            vox(sx, 7.8, sz, 0.35, 0.4, 0.35, lanternGlow, false);
            vox(sx, 8.1, sz, 0.2, 0.2, 0.2, moonlight, false);
            vox(sx, 8.25, sz, 0.1, 0.15, 0.1, warmGlow, false);
        });

        // ---- 7.5.10  PAREDES INTERNAS: pietra dura + caligrafia ----
        const frieseY = [5.5, 9, 12.5];
        frieseY.forEach(y => {
            for (let d = -5; d <= 5; d++) {
                if (Math.abs(d) < 2.5) continue;  // pula área do iwan
                const mat = (d % 2 === 0) ? pietraBlue : pietraRed;
                const matAlt = (d % 2 === 0) ? pietraGreen : pietraPurple;
                vox(d, y, -6.49, 0.5, 0.25, 0.01, mat, false);
                vox(d, y+0.3, -6.49, 0.4, 0.15, 0.01, matAlt, false);
                vox(d, y,  6.49, 0.5, 0.25, 0.01, mat, false);
                vox(d, y+0.3,  6.49, 0.4, 0.15, 0.01, matAlt, false);
                vox( 6.49, y, d, 0.01, 0.25, 0.5, mat, false);
                vox( 6.49, y+0.3, d, 0.01, 0.15, 0.4, matAlt, false);
                vox(-6.49, y, d, 0.01, 0.25, 0.5, mat, false);
                vox(-6.49, y+0.3, d, 0.01, 0.15, 0.4, matAlt, false);
            }
        });
        // Arabescos verticais finos entre as faixas
        for (let d = -5; d <= 5; d += 2) {
            if (Math.abs(d) < 3) continue;
            vox(d, 8, -6.49, 0.08, 5, 0.01, pietraGreen, false);
            vox(d, 8,  6.49, 0.08, 5, 0.01, pietraGreen, false);
            vox( 6.49, 8, d, 0.01, 5, 0.08, pietraGreen, false);
            vox(-6.49, 8, d, 0.01, 5, 0.08, pietraGreen, false);
        }

        // ---- 7.5.11  FAIXA DECORATIVA sobre o iwan sul (dentro) ----
        // Vista ao entrar pelo portal principal
        vox(0, 11.6, -6.50, 3.5, 0.3, 0.02, signDark, false);
        vox(0, 11.6, -6.49, 3.3, 0.25, 0.01, gold, false);
        for (let i = -1.4; i <= 1.4; i += 0.35) {
            vox(i, 11.6, -6.48, 0.1, 0.1, 0.01, goldBright, false);
        }

        // ---- 7.5.12  VASOS ORNAMENTAIS (leste e oeste) ----
        function vaso(px, pz) {
            vox(px, 4.4, pz, 0.8, 0.3, 0.8, marbleWarm, false);
            vox(px, 4.75, pz, 0.4, 0.15, 0.4, marbleShadow, false);
            vox(px, 4.95, pz, 0.55, 0.2, 0.55, pietraBlue, false);
            vox(px, 5.1, pz, 0.45, 0.1, 0.45, gold, false);
            vox(px, 5.3, pz, 0.3, 0.25, 0.3, pietraGreen, false);
            vox(px+0.1, 5.45, pz, 0.15, 0.2, 0.15, pietraRed, false);
            vox(px-0.1, 5.5, pz, 0.12, 0.2, 0.12, pietraPurple, false);
            vox(px, 5.55, pz+0.1, 0.15, 0.2, 0.15, pietraRed, false);
        }
        vaso(-5.8, 0);
        vaso( 5.8, 0);

        // ---- 7.5.13  RAIOS DE LUZ atravessando a câmara ----
        // Feixes dourados vindos dos iwans (efeito místico)
        vox(0, 7, -5.5, 0.3, 0.05, 2, warmGlow, false);
        vox(0, 7,  5.5, 0.3, 0.05, 2, warmGlow, false);
        vox(-5.5, 7, 0, 2, 0.05, 0.3, warmGlow, false);
        vox( 5.5, 7, 0, 2, 0.05, 0.3, warmGlow, false);

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
        // lantern(-8, 13)  ← removida: espaço reservado para a placa padrão (X=-10, Z=+12)
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
        //  17. PLACA DE ASSINATURA — função padrão estilizada
        //      Mantém a assinatura, posição e estrutura do template,
        //      mas com canvas mais rico e moldura voxel temática.
        // =================================================================
        function renderStandardSign(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 192;
            const c2 = canvas.getContext('2d');

            // ---- Fundo: gradiente noturno (céu sobre o Taj) ----
            const grad = c2.createLinearGradient(0, 0, 0, 192);
            grad.addColorStop(0,    '#0a0e2c');
            grad.addColorStop(0.5,  '#1a1845');
            grad.addColorStop(1,    '#2a1a3a');
            c2.fillStyle = grad;
            c2.fillRect(0, 0, 512, 192);

            // ---- Estrelas pontilhadas (posições fixas, reprodutíveis) ----
            const stars = [
                [40, 25, 1.2], [88, 18, 0.8], [132, 32, 1.0], [180, 22, 0.7],
                [228, 30, 1.1], [284, 20, 0.9], [336, 28, 1.0], [388, 24, 0.7],
                [436, 32, 0.9], [472, 18, 1.0], [62, 50, 0.7], [206, 48, 0.8],
                [310, 44, 0.9], [410, 52, 0.7], [156, 168, 0.8], [256, 172, 1.0],
                [368, 166, 0.7], [56, 160, 0.8], [456, 170, 0.9]
            ];
            c2.fillStyle = '#fff8c0';
            stars.forEach(([x, y, r]) => {
                c2.beginPath();
                c2.arc(x, y, r, 0, Math.PI * 2);
                c2.fill();
            });

            // ---- Moldura dourada externa (mantém o espírito da borda do template) ----
            c2.strokeStyle = '#d4a73c';
            c2.lineWidth = 6;
            c2.strokeRect(10, 10, 492, 172);
            // Moldura interna fina mais clara
            c2.strokeStyle = '#ffe580';
            c2.lineWidth = 1.5;
            c2.strokeRect(18, 18, 476, 156);

            // ---- Cantos ornamentais (estilo cartela islâmica) ----
            c2.fillStyle = '#ffd700';
            const cornerSize = 14;
            [[10,10],[488,10],[10,168],[488,168]].forEach(([cx_,cy_]) => {
                c2.fillRect(cx_, cy_, cornerSize, cornerSize);
            });
            c2.fillStyle = '#fff5b0';
            [[14,14],[492,14],[14,172],[492,172]].forEach(([cx_,cy_]) => {
                c2.fillRect(cx_, cy_, 6, 6);
            });

            // ---- Divisor central com losango dourado ----
            c2.strokeStyle = '#d4a73c';
            c2.lineWidth = 1.5;
            c2.beginPath();
            c2.moveTo(80,  108);
            c2.lineTo(232, 108);
            c2.moveTo(280, 108);
            c2.lineTo(432, 108);
            c2.stroke();
            // Losango central
            c2.fillStyle = '#ffd700';
            c2.beginPath();
            c2.moveTo(256, 100);
            c2.lineTo(268, 108);
            c2.lineTo(256, 116);
            c2.lineTo(244, 108);
            c2.closePath();
            c2.fill();
            c2.fillStyle = '#fff5b0';
            c2.beginPath();
            c2.moveTo(256, 104);
            c2.lineTo(262, 108);
            c2.lineTo(256, 112);
            c2.lineTo(250, 108);
            c2.closePath();
            c2.fill();

            // ---- Nome do monumento (mármore creme, serif elegante) ----
            c2.fillStyle = '#fff8e7';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            let f1 = 54;
            c2.font = 'bold ' + f1 + 'px Georgia, serif';
            while (c2.measureText(monumentName).width > 450 && f1 > 20) {
                f1 -= 2;
                c2.font = 'bold ' + f1 + 'px Georgia, serif';
            }
            c2.fillText(monumentName, 256, 72);

            // ---- Modelo de IA (dourado, itálico) ----
            c2.fillStyle = '#6fd3ff';   // mantém a cor azul-ciano do padrão
            let f2 = 30;
            c2.font = 'italic bold ' + f2 + 'px Georgia, serif';
            while (c2.measureText(aiModel).width > 450 && f2 > 15) {
                f2 -= 2;
                c2.font = 'italic bold ' + f2 + 'px Georgia, serif';
            }
            c2.fillText(aiModel, 256, 144);

            // =============================================================
            //  ESTRUTURA VOXEL — mantém a forma padrão e adiciona detalhes
            // =============================================================
            const signMat = new ctx.THREE.MeshBasicMaterial({ map: new ctx.THREE.CanvasTexture(canvas) });
            const matDark = new ctx.THREE.MeshLambertMaterial({ color: 0x222222 });
            let pX = ctx.centerX - 10;
            let pZ = ctx.centerZ + 12;

            // Postes (mesmo padrão do template)
            ctx.createVoxel(pX - 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            ctx.createVoxel(pX + 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            // Capitéis dourados nos postes (pequeno toque)
            ctx.createVoxel(pX - 2.2, 3.25, pZ, 0.32, 0.12, 0.32, gold);
            ctx.createVoxel(pX + 2.2, 3.25, pZ, 0.32, 0.12, 0.32, gold);
            ctx.createVoxel(pX - 2.2, 3.4, pZ, 0.18, 0.18, 0.18, goldBright);
            ctx.createVoxel(pX + 2.2, 3.4, pZ, 0.18, 0.18, 0.18, goldBright);

            // Tabuleta (estrutura padrão + colisão)
            let fundo = ctx.createVoxel(pX, 3.5, pZ, 5.2, 1.8, 0.22, matDark);
            ctx.createVoxel(pX, 3.5, pZ + 0.12, 5.2, 1.8, 0.05, signMat);
            ctx.collidables.push(new ctx.THREE.Box3().setFromObject(fundo));

            // Moldura dourada fina ao redor da tabuleta (face frontal)
            ctx.createVoxel(pX, 4.45, pZ + 0.15, 5.3, 0.08, 0.04, gold);  // topo
            ctx.createVoxel(pX, 2.55, pZ + 0.15, 5.3, 0.08, 0.04, gold);  // base
            ctx.createVoxel(pX - 2.65, 3.5, pZ + 0.15, 0.08, 1.95, 0.04, gold);  // esq
            ctx.createVoxel(pX + 2.65, 3.5, pZ + 0.15, 0.08, 1.95, 0.04, gold);  // dir

            // Mini cúpula bulbosa decorativa coroando a placa (alusão ao Taj)
            ctx.createVoxel(pX, 4.55, pZ, 1.0, 0.15, 0.4, marbleWarm);    // base
            ctx.createVoxel(pX, 4.7, pZ, 0.7, 0.15, 0.3, marble);          // pescoço
            // Bulbo (3 anéis aproximados via cubinhos)
            for (let dx_ = -2; dx_ <= 2; dx_++) {
                for (let dz_ = -1; dz_ <= 1; dz_++) {
                    if (dx_*dx_/4 + dz_*dz_ <= 1) {
                        ctx.createVoxel(pX + dx_*0.18, 4.85, pZ + dz_*0.18, 0.19, 0.2, 0.19, marble);
                    }
                    if (dx_*dx_/6 + dz_*dz_ <= 0.7) {
                        ctx.createVoxel(pX + dx_*0.15, 5.05, pZ + dz_*0.15, 0.16, 0.18, 0.16, marble);
                    }
                }
            }
            // Pináculo dourado (kalasha em miniatura)
            ctx.createVoxel(pX, 5.22, pZ, 0.1, 0.15, 0.1, gold);
            ctx.createVoxel(pX, 5.35, pZ, 0.22, 0.1, 0.22, gold);
            ctx.createVoxel(pX, 5.45, pZ, 0.08, 0.18, 0.08, goldDark);
            ctx.createVoxel(pX, 5.6, pZ, 0.16, 0.1, 0.16, goldBright);
            ctx.createVoxel(pX, 5.72, pZ, 0.06, 0.18, 0.06, gold);

            // Pequena luminária discreta sob a placa (ilumina sem ofuscar)
            ctx.createVoxel(pX, 2.42, pZ + 0.18, 0.6, 0.04, 0.04, lanternGlow);
        }

        renderStandardSign("Taj Mahal", "Claude Opus 4.7");


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
