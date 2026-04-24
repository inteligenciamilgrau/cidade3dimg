(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['1_5'] = function(ctx) {
        
        // ==========================================
        // NOTRE-DAME DE PARIS - KIMI K2.6
        // Obra-prima Gótica em Voxels 3D
        // ==========================================
        
        // 1. PLACA DE ASSINATURA
        function renderSignaturePlate(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 256;
            const c2 = canvas.getContext('2d');

            // Fundo e Borda Neon dourada
            c2.fillStyle = '#0a0a0a';
            c2.fillRect(0, 0, 1024, 256);
            c2.strokeStyle = '#FFD700';
            c2.lineWidth = 12;
            c2.strokeRect(6, 6, 1012, 244);
            
            // Brilho interno
            c2.shadowColor = '#FFD700';
            c2.shadowBlur = 20;
            c2.strokeStyle = '#FFD700';
            c2.lineWidth = 3;
            c2.strokeRect(20, 20, 984, 216);
            c2.shadowBlur = 0;

            // Nome do Monumento (Auto-ajuste de fonte)
            c2.fillStyle = '#ffffff';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            let f1 = 90;
            c2.font = 'bold ' + f1 + 'px "Times New Roman", serif';
            while (c2.measureText(monumentName).width > 940 && f1 > 20) {
                f1 -= 2;
                c2.font = 'bold ' + f1 + 'px "Times New Roman", serif';
            }
            c2.fillText(monumentName, 512, 85);

            // Modelo da IA
            c2.fillStyle = '#FFD700';
            let f2 = 55;
            c2.font = 'bold ' + f2 + 'px Arial';
            while (c2.measureText(aiModel).width > 940 && f2 > 15) {
                f2 -= 2;
                c2.font = 'bold ' + f2 + 'px Arial';
            }
            c2.fillText(aiModel, 512, 175);

            const signMat = new ctx.THREE.MeshBasicMaterial({ 
                map: new ctx.THREE.CanvasTexture(canvas),
                transparent: true
            });
            
            // Posição: calçada frontal
            const pX = ctx.centerX; 
            const pZ = ctx.centerZ + 13;
            
            // Suportes ornamentados
            ctx.createVoxel(pX - 7, 2.5, pZ, 0.8, 5, 0.8, new ctx.THREE.MeshLambertMaterial({color:0x444444}));
            ctx.createVoxel(pX + 7, 2.5, pZ, 0.8, 5, 0.8, new ctx.THREE.MeshLambertMaterial({color:0x444444}));
            // Base
            ctx.createVoxel(pX, 5, pZ, 15, 2.8, 0.4, new ctx.THREE.MeshLambertMaterial({color:0x222222}));
            // Painel luminoso
            ctx.createVoxel(pX, 5, pZ + 0.2, 14.6, 2.4, 0.08, signMat);
        }

        renderSignaturePlate("NOTRE-DAME DE PARIS", "Construído por Kimi K2.6");

        // 2. MATERIAIS
        const M = {
            pedraClara: new ctx.THREE.MeshLambertMaterial({ color: 0xC8B8A8 }),
            pedraMedia: new ctx.THREE.MeshLambertMaterial({ color: 0xA89888 }),
            pedraEscura: new ctx.THREE.MeshLambertMaterial({ color: 0x8B7D6B }),
            pedraMuitoEscura: new ctx.THREE.MeshLambertMaterial({ color: 0x5C4A3D }),
            telha: new ctx.THREE.MeshLambertMaterial({ color: 0x3A3A3A }),
            telhaClara: new ctx.THREE.MeshLambertMaterial({ color: 0x4A4A4A }),
            chumbo: new ctx.THREE.MeshLambertMaterial({ color: 0x2A2A2A }),
            vitralAzul: new ctx.THREE.MeshBasicMaterial({ color: 0x2266AA }),
            vitralVermelho: new ctx.THREE.MeshBasicMaterial({ color: 0xAA2233 }),
            vitralDourado: new ctx.THREE.MeshBasicMaterial({ color: 0xCCAA22 }),
            vitralVerde: new ctx.THREE.MeshBasicMaterial({ color: 0x228844 }),
            vitralRoxo: new ctx.THREE.MeshBasicMaterial({ color: 0x6622AA }),
            ouro: new ctx.THREE.MeshBasicMaterial({ color: 0xFFD700 }),
            madeira: new ctx.THREE.MeshLambertMaterial({ color: 0x4A3728 }),
            chaoPedra: new ctx.THREE.MeshLambertMaterial({ color: 0x999090 }),
            grama: new ctx.THREE.MeshLambertMaterial({ color: 0x5C8F3A }),
            terra: new ctx.THREE.MeshLambertMaterial({ color: 0x5C4033 }),
            agua: new ctx.THREE.MeshBasicMaterial({ color: 0x2266AA, transparent: true, opacity: 0.7 }),
            branco: new ctx.THREE.MeshLambertMaterial({ color: 0xF5F5DC }),
            marmore: new ctx.THREE.MeshLambertMaterial({ color: 0xE8E0D8 }),
        };

        const cx = ctx.centerX;
        const cz = ctx.centerZ;
        const C = ctx.createVoxel;
        const coll = ctx.collidables;

        function addColl(obj) {
            coll.push(new ctx.THREE.Box3().setFromObject(obj));
        }

        // 3. CHÃO DA IGREJA - substitui a grama no interior
        // Base de pedra para toda a área da catedral
        const baseIgreja = C(cx, -0.4, cz, 26, 0.8, 26, M.pedraMuitoEscura);
        addColl(baseIgreja);

        // ==========================================
        // FUNÇÕES ARQUITETÔNICAS
        // ==========================================
        
        function arco(x, z, yBase, altura, largura, profundidade, material, direcao = 'z') {
            // Arco ogival (apontado) - 2 segmentos inclinados
            const espessura = 0.8;
            const meio = largura / 2;
            const alt1 = altura * 0.6;
            const alt2 = altura * 0.4;
            const steps = 4;
            
            for (let i = 0; i < steps; i++) {
                const t1 = i / steps;
                const t2 = (i + 1) / steps;
                const x1 = -meio + t1 * meio;
                const x2 = -meio + t2 * meio;
                const h1 = t1 * alt1;
                const h2 = t2 * alt1;
                
                if (direcao === 'z') {
                    C(x + (x1+x2)/2, yBase + (h1+h2)/2, z, Math.abs(x2-x1)+espessura, Math.abs(h2-h1)+espessura, profundidade, material);
                    C(x - (x1+x2)/2, yBase + (h1+h2)/2, z, Math.abs(x2-x1)+espessura, Math.abs(h2-h1)+espessura, profundidade, material);
                } else {
                    C(x, yBase + (h1+h2)/2, z + (x1+x2)/2, profundidade, Math.abs(h2-h1)+espessura, Math.abs(x2-x1)+espessura, material);
                    C(x, yBase + (h1+h2)/2, z - (x1+x2)/2, profundidade, Math.abs(h2-h1)+espessura, Math.abs(x2-x1)+espessura, material);
                }
            }
            // Topo arredondado
            if (direcao === 'z') {
                C(x, yBase + alt1 + alt2/2, z, meio, alt2, profundidade, material);
            } else {
                C(x, yBase + alt1 + alt2/2, z, profundidade, alt2, meio, material);
            }
        }

        function coluna(x, z, yBase, altura, grossura, material) {
            C(x, yBase + altura/2, z, grossura, altura, grossura, material);
            // Base
            C(x, yBase + 0.3, z, grossura*1.6, 0.6, grossura*1.6, material);
            // Capitel
            C(x, yBase + altura - 0.2, z, grossura*1.4, 0.4, grossura*1.4, material);
        }

        function janelaGoticas(x, z, yBase, direcao = 'z') {
            // Janela alta ogival com "vitral"
            const w = 1.2, h = 5;
            const prof = direcao === 'z' ? 0.3 : 0.3;
            const dx = direcao === 'x' ? 0.6 : 0;
            const dz = direcao === 'z' ? 0.6 : 0;
            
            // Moldura
            arco(x, z, yBase, h, w, prof, M.pedraEscura, direcao);
            // Vitral interior (brilhando)
            const vitral = new ctx.THREE.MeshBasicMaterial({ 
                color: [0x2266AA, 0xAA2233, 0xCCAA22, 0x228844, 0x6622AA][Math.floor(Math.random()*5)] 
            });
            if (direcao === 'z') {
                C(x, yBase + h/2, z, w*0.5, h*0.7, 0.1, vitral);
            } else {
                C(x, yBase + h/2, z, 0.1, h*0.7, w*0.5, vitral);
            }
        }

        function pinaculo(x, z, yBase, altura) {
            // Base
            C(x, yBase + 0.5, z, 1.2, 1, 1.2, M.pedraEscura);
            // Fuste
            C(x, yBase + 1 + altura/2, z, 0.6, altura, 0.6, M.pedraClara);
            // Crochetes (pequenas projeções)
            C(x + 0.5, yBase + altura*0.7, z, 0.4, 0.4, 0.4, M.pedraClara);
            C(x - 0.5, yBase + altura*0.7, z, 0.4, 0.4, 0.4, M.pedraClara);
            C(x, yBase + altura*0.7, z + 0.5, 0.4, 0.4, 0.4, M.pedraClara);
            C(x, yBase + altura*0.7, z - 0.5, 0.4, 0.4, 0.4, M.pedraClara);
            // Pináculo pontudo
            C(x, yBase + 1 + altura + 0.5, z, 0.4, 1, 0.4, M.pedraMedia);
            C(x, yBase + 1 + altura + 1.2, z, 0.2, 0.6, 0.2, M.pedraMedia);
            // Cruz no topo
            C(x, yBase + 1 + altura + 1.8, z, 0.1, 0.6, 0.1, M.ouro);
            C(x, yBase + 1 + altura + 2.0, z, 0.4, 0.1, 0.1, M.ouro);
        }

        function contraforte(x, z, yBase, altura, direcao = 'z') {
            const prof = direcao === 'z' ? 1.5 : 0.8;
            const larg = direcao === 'z' ? 0.8 : 1.5;
            C(x, yBase + altura/2, z, larg, altura, prof, M.pedraMedia);
            // Pináculo do contraforte
            pinaculo(x, z + (direcao==='z'?0.5:0), yBase + altura, 2);
        }

        // ==========================================
        // 4. FACHADA OESTE (Frente da igreja)
        // Posição: Z negativo (frente)
        // ==========================================
        
        const fachadaZ = cz - 10;
        const fachadaLargura = 18;
        const fachadaAltura = 10;
        const torreAltura = 18;
        const torreLargura = 4.5;

        // Plataforma da fachada
        C(cx, 0.3, fachadaZ, fachadaLargura, 0.6, 3, M.pedraEscura);

        // === PORTAIS ===
        // Portal central (maior)
        arco(cx, fachadaZ - 0.2, 0.6, 5.5, 4, 0.6, M.pedraClara, 'z');
        // Portas de madeira esculpidas
        C(cx, 2, fachadaZ - 0.1, 3, 4, 0.2, M.madeira);
        // Detalhes nas portas
        C(cx, 3, fachadaZ - 0.05, 0.3, 2, 0.05, M.ouro);
        
        // Portal esquerdo
        arco(cx - 5.5, fachadaZ - 0.2, 0.6, 4.5, 3, 0.6, M.pedraMedia, 'z');
        C(cx - 5.5, 1.8, fachadaZ - 0.1, 2.2, 3.5, 0.2, M.madeira);
        
        // Portal direito
        arco(cx + 5.5, fachadaZ - 0.2, 0.6, 4.5, 3, 0.6, M.pedraMedia, 'z');
        C(cx + 5.5, 1.8, fachadaZ - 0.1, 2.2, 3.5, 0.2, M.madeira);

        // === PAREDES DA FACHADA ===
        // Entre portais - pilastras
        coluna(cx - 3.8, fachadaZ, 0, 6, 0.8, M.pedraClara);
        coluna(cx + 3.8, fachadaZ, 0, 6, 0.8, M.pedraClara);
        coluna(cx - 7.2, fachadaZ, 0, 5, 0.7, M.pedraClara);
        coluna(cx + 7.2, fachadaZ, 0, 5, 0.7, M.pedraClara);

        // === GALERIA DOS REIS ===
        // Fileira de "estátuas" (pequenos blocos) acima dos portais
        C(cx, 7, fachadaZ, fachadaLargura - 1, 1.2, 0.8, M.pedraClara);
        for (let i = -7; i <= 7; i += 0.9) {
            C(cx + i, 7.8, fachadaZ + 0.3, 0.5, 0.8, 0.4, M.pedraMedia);
            // Cabeça da estátua
            C(cx + i, 8.4, fachadaZ + 0.3, 0.35, 0.35, 0.35, M.pedraClara);
        }

        // === ROSÁCEA (JANELA CIRCULAR) ===
        // Círculo de voxels para simular rosácea
        const rX = cx;
        const rZ = fachadaZ + 0.3;
        const rY = 11.5;
        const raio = 2.8;
        
        // Moldura externa da rosácea
        for (let a = 0; a < Math.PI * 2; a += 0.25) {
            const rx = Math.cos(a) * raio;
            const ry = Math.sin(a) * raio;
            C(rX + rx, rY + ry, rZ, 0.5, 0.5, 0.6, M.pedraEscura);
        }
        // Vitral da rosácea - padrão em cruz
        C(rX, rY, rZ, raio*1.5, raio*1.5, 0.2, M.vitralAzul);
        C(rX, rY, rZ + 0.05, raio*0.3, raio*1.2, 0.05, M.vitralVermelho);
        C(rX, rY, rZ + 0.05, raio*1.2, raio*0.3, 0.05, M.vitralVermelho);
        C(rX, rY, rZ + 0.08, raio*0.15, raio*0.15, 0.05, M.ouro);
        // Detalhes em círculo
        for (let a = 0; a < Math.PI * 2; a += Math.PI/4) {
            const rx = Math.cos(a) * raio * 0.6;
            const ry = Math.sin(a) * raio * 0.6;
            C(rX + rx, rY + ry, rZ + 0.08, 0.3, 0.3, 0.05, M.vitralDourado);
        }

        // === TORRES ===
        function torre(tX, tZ) {
            // Base quadrada
            C(tX, torreAltura/2 + 1, tZ, torreLargura, torreAltura + 2, torreLargura, M.pedraClara);
            
            // Colunas nos cantos
            coluna(tX - torreLargura/2 + 0.4, tZ - torreLargura/2 + 0.4, 0, torreAltura + 3, 0.6, M.pedraEscura);
            coluna(tX + torreLargura/2 - 0.4, tZ - torreLargura/2 + 0.4, 0, torreAltura + 3, 0.6, M.pedraEscura);
            coluna(tX - torreLargura/2 + 0.4, tZ + torreLargura/2 - 0.4, 0, torreAltura + 3, 0.6, M.pedraEscura);
            coluna(tX + torreLargura/2 - 0.4, tZ + torreLargura/2 - 0.4, 0, torreAltura + 3, 0.6, M.pedraEscura);
            
            // Janelas ogivais na torre
            janelaGoticas(tX, tZ - torreLargura/2, 6, 'z');
            janelaGoticas(tX, tZ + torreLargura/2, 6, 'z');
            janelaGoticas(tX - torreLargura/2, tZ, 6, 'x');
            janelaGoticas(tX + torreLargura/2, tZ, 6, 'x');
            
            janelaGoticas(tX, tZ - torreLargura/2, 12, 'z');
            janelaGoticas(tX, tZ + torreLargura/2, 12, 'x');
            
            // Cornija superior
            C(tX, torreAltura + 2, tZ, torreLargura + 0.4, 0.6, torreLargura + 0.4, M.pedraEscura);
            
            // Plataforma superior com balaustrada
            C(tX, torreAltura + 2.8, tZ, torreLargura - 0.5, 0.4, torreLargura - 0.5, M.pedraClara);
            
            // Pilastras da balaustrada
            for (let bx = -1.5; bx <= 1.5; bx += 1.5) {
                for (let bz = -1.5; bz <= 1.5; bz += 1.5) {
                    if (Math.abs(bx) > 1 || Math.abs(bz) > 1) {
                        C(tX + bx, torreAltura + 3.5, tZ + bz, 0.25, 1.2, 0.25, M.pedraClara);
                    }
                }
            }
            
            // Telhado da torre (cônico truncado)
            C(tX, torreAltura + 4.2, tZ, 2.5, 1, 2.5, M.telha);
            C(tX, torreAltura + 4.8, tZ, 1.8, 0.8, 1.8, M.telha);
            C(tX, torreAltura + 5.3, tZ, 1.2, 0.6, 1.2, M.telha);
            C(tX, torreAltura + 5.7, tZ, 0.6, 0.4, 0.6, M.telha);
            
            // Cruz no topo da torre
            C(tX, torreAltura + 6.2, tZ, 0.12, 1.0, 0.12, M.ouro);
            C(tX, torreAltura + 6.5, tZ, 0.5, 0.12, 0.12, M.ouro);
            
            // Campanário (abertura com sino)
            C(tX, torreAltura + 1, tZ, 1.5, 2, 1.5, M.branco); // interior iluminado
            C(tX, torreAltura + 1.5, tZ, 0.8, 0.6, 0.05, M.ouro); // sino
            
            addColl(C(tX, torreAltura/2, tZ, torreLargura-0.5, torreAltura, torreLargura-0.5, M.pedraMedia));
        }

        // Torres nas posições laterais da fachada
        torre(cx - 6, fachadaZ + 1.5);
        torre(cx + 6, fachadaZ + 1.5);

        // ==========================================
        // 5. NAVE CENTRAL
        // ==========================================
        
        const naveZStart = fachadaZ + 2;
        const naveZEnd = cz + 8;
        const naveLargura = 6;
        const naveAltura = 10;
        const naveComprimento = naveZEnd - naveZStart;

        // Paredes laterais da nave
        // Esquerda
        C(cx - naveLargura/2, naveAltura/2, naveZStart + naveComprimento/2, 0.8, naveAltura, naveComprimento + 2, M.pedraClara);
        // Direita
        C(cx + naveLargura/2, naveAltura/2, naveZStart + naveComprimento/2, 0.8, naveAltura, naveComprimento + 2, M.pedraClara);

        // Janelas altas da nave (Clerestório)
        for (let z = naveZStart + 2; z < naveZEnd - 1; z += 3) {
            janelaGoticas(cx - naveLargura/2, z, 5, 'x');
            janelaGoticas(cx + naveLargura/2, z, 5, 'x');
        }

        // Colunas interiores da nave
        for (let z = naveZStart + 2; z < naveZEnd - 1; z += 3.5) {
            coluna(cx - 2, z, 0, naveAltura - 1, 0.5, M.marmore);
            coluna(cx + 2, z, 0, naveAltura - 1, 0.5, M.marmore);
        }

        // Arcobotantes (arcos exteriores de suporte)
        for (let z = naveZStart + 2; z < naveZEnd - 1; z += 3.5) {
            // Viga do arcobotante
            C(cx - naveLargura/2 - 1.2, naveAltura*0.6, z, 2.5, 0.6, 0.6, M.pedraMedia);
            C(cx + naveLargura/2 + 1.2, naveAltura*0.6, z, 2.5, 0.6, 0.6, M.pedraMedia);
            // Pilar do contraforte externo
            contraforte(cx - naveLargura/2 - 2, z, 0, naveAltura*0.7, 'z');
            contraforte(cx + naveLargura/2 + 2, z, 0, naveAltura*0.7, 'z');
        }

        // ==========================================
        // 6. TELHADO DA NAVE
        // ==========================================
        
        const telhadoAltura = 4;
        const telhadoZ = naveZStart + naveComprimento/2;
        const telhadoComp = naveComprimento + 2;

        // Duas águas - lado esquerdo
        C(cx - 1.8, naveAltura + telhadoAltura/2, telhadoZ, 2.5, telhadoAltura, telhadoComp, M.telha);
        // Lado direito
        C(cx + 1.8, naveAltura + telhadoAltura/2, telhadoZ, 2.5, telhadoAltura, telhadoComp, M.telha);
        
        // Cumeira central com decoração
        C(cx, naveAltura + telhadoAltura + 0.3, telhadoZ, 0.6, 0.6, telhadoComp + 1, M.pedraEscura);
        
        // Pináculos ao longo da cumeira
        for (let z = naveZStart; z <= naveZEnd; z += 2.5) {
            pinaculo(cx, z, naveAltura + telhadoAltura + 0.5, 2);
        }

        // ==========================================
        // 7. TRANCEPTO (CRUZ DA NAVE)
        // ==========================================
        
        const transeptoZ = naveZStart + naveComprimento * 0.55;
        const transeptoLargura = 14;
        const transeptoProfundidade = 5;
        const transeptoAltura = naveAltura + 1;

        // Paredes do transepto - braço esquerdo
        C(cx - transeptoLargura/2, transeptoAltura/2, transeptoZ, 0.8, transeptoAltura, transeptoProfundidade, M.pedraClara);
        // Braço direito
        C(cx + transeptoLargura/2, transeptoAltura/2, transeptoZ, 0.8, transeptoAltura, transeptoProfundidade, M.pedraClara);
        
        // Frente do braço esquerdo
        C(cx - transeptoLargura/4, transeptoAltura/2, transeptoZ - transeptoProfundidade/2, transeptoLargura/2, transeptoAltura, 0.8, M.pedraClara);
        // Rosácea do braço esquerdo (pequena)
        const r2X = cx - transeptoLargura/2 + 1.5;
        C(r2X, transeptoAltura/2 + 1, transeptoZ - transeptoProfundidade/2 + 0.3, 2.5, 2.5, 0.2, M.vitralAzul);
        
        // Frente do braço direito
        C(cx + transeptoLargura/4, transeptoAltura/2, transeptoZ - transeptoProfundidade/2, transeptoLargura/2, transeptoAltura, 0.8, M.pedraClara);
        // Rosácea do braço direito
        const r3X = cx + transeptoLargura/2 - 1.5;
        C(r3X, transeptoAltura/2 + 1, transeptoZ - transeptoProfundidade/2 + 0.3, 2.5, 2.5, 0.2, M.vitralRoxo);

        // Telhado do transepto
        C(cx, naveAltura + telhadoAltura/2 + 1, transeptoZ, transeptoLargura - 1, telhadoAltura + 1, transeptoProfundidade, M.telha);

        // Cruz no topo do transepto (ponto mais alto)
        C(cx, naveAltura + telhadoAltura + 2.5, transeptoZ, 0.15, 2.0, 0.15, M.ouro);
        C(cx, naveAltura + telhadoAltura + 3.3, transeptoZ, 0.8, 0.15, 0.15, M.ouro);
        C(cx, naveAltura + telhadoAltura + 2.9, transeptoZ, 0.15, 0.15, 0.8, M.ouro);

        // ==========================================
        // 8. CORO E ABSIDE (Fundo da igreja)
        // ==========================================
        
        const coroZ = naveZEnd + 2;
        const coroLargura = naveLargura;
        const coroProfundidade = 5;
        const coroAltura = naveAltura - 1;

        // Paredes do coro
        C(cx - coroLargura/2, coroAltura/2, coroZ, 0.8, coroAltura, coroProfundidade, M.pedraClara);
        C(cx + coroLargura/2, coroAltura/2, coroZ, 0.8, coroAltura, coroProfundidade, M.pedraClara);
        C(cx, coroAltura/2, coroZ + coroProfundidade/2, coroLargura + 1, coroAltura, 0.8, M.pedraClara);

        // Telhado do coro (menor)
        C(cx - 1.5, coroAltura + 1.5, coroZ, 2, 3, coroProfundidade + 1, M.telha);
        C(cx + 1.5, coroAltura + 1.5, coroZ, 2, 3, coroProfundidade + 1, M.telha);

        // ==========================================
        // 9. INTERIOR - ALTAR E DECORAÇÃO
        // ==========================================
        
        // Piso em padrão xadrez
        const pisoY = 0.1;
        for (let x = -naveLargura/2 + 1; x < naveLargura/2; x += 1.2) {
            for (let z = naveZStart + 1; z < naveZEnd - 1; z += 1.2) {
                const isLight = (Math.floor(x) + Math.floor(z)) % 2 === 0;
                C(cx + x, pisoY, z, 1.1, 0.2, 1.1, isLight ? M.marmore : M.pedraEscura);
            }
        }

        // Altar principal
        const altarZ = naveZEnd - 2;
        C(cx, 1.0, altarZ, 3, 2, 2, M.marmore);
        C(cx, 2.0, altarZ, 2.5, 0.5, 1.5, M.ouro); // tampa dourada
        
        // Cruz atrás do altar
        C(cx, 4, altarZ + 1, 0.2, 3, 0.2, M.ouro);
        C(cx, 5, altarZ + 1, 1.5, 0.2, 0.2, M.ouro);
        
        // Velas no altar
        C(cx - 1, 1.8, altarZ, 0.1, 0.6, 0.1, M.ouro);
        C(cx + 1, 1.8, altarZ, 0.1, 0.6, 0.1, M.ouro);
        // Chama (luz básica)
        C(cx - 1, 2.4, altarZ, 0.15, 0.15, 0.15, new ctx.THREE.MeshBasicMaterial({color:0xFF6600}));
        C(cx + 1, 2.4, altarZ, 0.15, 0.15, 0.15, new ctx.THREE.MeshBasicMaterial({color:0xFF6600}));

        // Bancos de madeira
        for (let z = naveZStart + 3; z < naveZEnd - 4; z += 1.5) {
            // Banco esquerdo
            C(cx - 1.5, 0.6, z, 2, 0.6, 0.5, M.madeira);
            // Banco direito
            C(cx + 1.5, 0.6, z, 2, 0.6, 0.5, M.madeira);
        }

        // ==========================================
        // 10. FACHADA POSTERIOR (VITRAIS COLORIDOS)
        // ==========================================
        
        const absZ = coroZ + coroProfundidade/2;
        // Grande vitral da abside
        C(cx, 5, absZ + 0.2, 4, 6, 0.2, M.vitralAzul);
        C(cx, 5, absZ + 0.25, 1, 5, 0.05, M.vitralVermelho);
        C(cx - 1.2, 4, absZ + 0.25, 0.6, 3, 0.05, M.vitralDourado);
        C(cx + 1.2, 4, absZ + 0.25, 0.6, 3, 0.05, M.vitralVerde);
        C(cx, 7, absZ + 0.25, 2, 1, 0.05, M.vitralRoxo);

        // ==========================================
        // 11. ESCADAS E ENTRADA
        // ==========================================
        
        // Escadaria frontal
        for (let i = 0; i < 4; i++) {
            C(cx, i * 0.25, fachadaZ - 1.5 - i * 0.8, fachadaLargura - 2, 0.25, 0.8, M.pedraClara);
        }

        // ==========================================
        // 12. JARDIM E PÁTIO FRONTAL
        // ==========================================
        
        const jardimZ = fachadaZ - 6;
        // Canteiros
        for (let x = -10; x <= 10; x += 5) {
            C(cx + x, 0.2, jardimZ, 2, 0.4, 3, M.terra);
            // Arbustos (esferas de voxels)
            C(cx + x, 0.8, jardimZ, 1.2, 1, 1.2, M.grama);
            C(cx + x, 1.4, jardimZ, 0.6, 0.6, 0.6, M.grama);
        }

        // Caminho central
        C(cx, 0.05, jardimZ + 1, 4, 0.1, 5, M.chaoPedra);
        
        // Fonte circular (simplificada)
        C(cx, 0.3, jardimZ, 3, 0.6, 3, M.pedraEscura);
        C(cx, 0.5, jardimZ, 2, 0.3, 2, M.agua);
        C(cx, 1.2, jardimZ, 0.4, 1.2, 0.4, M.pedraClara); // coluna central
        C(cx, 1.9, jardimZ, 0.6, 0.1, 0.6, M.pedraEscura); // bacia

        // ==========================================
        // 13. PINÁCULOS E GÁRGULAS NOS CANTOS
        // ==========================================
        
        // Quatro pináculos nos cantos da nave
        pinaculo(cx - naveLargura/2 - 0.5, naveZStart + 1, naveAltura, 3);
        pinaculo(cx + naveLargura/2 + 0.5, naveZStart + 1, naveAltura, 3);
        pinaculo(cx - naveLargura/2 - 0.5, naveZEnd - 1, naveAltura, 3);
        pinaculo(cx + naveLargura/2 + 0.5, naveZEnd - 1, naveAltura, 3);

        // Gárgulas (projeções nas paredes laterais)
        function gargula(x, z, y, dirX) {
            // Corpo da gárgula
            C(x + (dirX * 0.6), y, z, 1.2, 0.5, 0.5, M.pedraEscura);
            // Cabeça
            C(x + (dirX * 1.2), y + 0.2, z, 0.5, 0.4, 0.4, M.pedraMuitoEscura);
        }

        gargula(cx - naveLargura/2, naveZStart + 5, naveAltura * 0.7, -1);
        gargula(cx + naveLargura/2, naveZStart + 5, naveAltura * 0.7, 1);
        gargula(cx - naveLargura/2, naveZEnd - 3, naveAltura * 0.7, -1);
        gargula(cx + naveLargura/2, naveZEnd - 3, naveAltura * 0.7, 1);

        // ==========================================
        // 14. TORRE CENTRAL (FLÈCHE - reconstrução)
        // ==========================================
        
        const flcheX = cx;
        const flcheZ = transeptoZ;
        const flcheAltura = 8;
        
        // Base octogonal simplificada
        C(flcheX, naveAltura + telhadoAltura + 2, flcheZ, 2, flcheAltura, 2, M.telha);
        C(flcheX, naveAltura + telhadoAltura + flcheAltura + 2.5, flcheZ, 1.2, 1.5, 1.2, M.telha);
        C(flcheX, naveAltura + telhadoAltura + flcheAltura + 3.5, flcheZ, 0.6, 1, 0.6, M.telha);
        
        // Cruz no topo da flèche
        C(flcheX, naveAltura + telhadoAltura + flcheAltura + 4.5, flcheZ, 0.12, 1.2, 0.12, M.ouro);
        C(flcheX, naveAltura + telhadoAltura + flcheAltura + 5.0, flcheZ, 0.5, 0.12, 0.12, M.ouro);

        // ==========================================
        // 15. DETALHES EXTRA - KIMI K2.6 SIGNATURE
        // ==========================================
        
        // Parvis (praça frontal) com padrão geométrico
        const parvisZ = fachadaZ - 5;
        for (let px = -12; px <= 12; px += 1.5) {
            for (let pz = -3; pz <= 2; pz += 1.5) {
                const dist = Math.sqrt(px*px + pz*pz);
                const isBorder = Math.abs(px) > 10 || pz < -2;
                C(cx + px, 0.05, parvisZ + pz, 1.4, 0.1, 1.4, 
                    isBorder ? M.pedraEscura : (Math.floor(px+pz)%2===0 ? M.pedraClara : M.pedraMedia));
            }
        }
        
        // Estátua da Virgem no portal central (tímpano)
        C(cx, 5.5, fachadaZ - 0.3, 0.8, 1.2, 0.3, M.pedraClara);
        C(cx, 6.2, fachadaZ - 0.3, 0.4, 0.4, 0.2, new ctx.THREE.MeshLambertMaterial({color:0xDDBB99}));
        
        // Reis na fachada (fileira completa mais detalhada)
        for (let i = -7; i <= 7; i += 0.7) {
            C(cx + i, 6.2, fachadaZ + 0.4, 0.35, 0.9, 0.3, M.pedraClara);
            C(cx + i, 6.8, fachadaZ + 0.4, 0.25, 0.3, 0.25, M.pedraMedia);
            // Manto
            C(cx + i, 6.0, fachadaZ + 0.45, 0.45, 0.5, 0.15, M.pedraEscura);
        }
        
        // Portas laterais do transepto
        C(cx - transeptoLargura/2 - 0.1, 2.5, transeptoZ, 0.2, 4, 2, M.madeira);
        C(cx + transeptoLargura/2 + 0.1, 2.5, transeptoZ, 0.2, 4, 2, M.madeira);
        
        // Mais vitrais no coro
        for (let z = coroZ - 1; z <= coroZ + 1; z += 1) {
            C(cx - coroLargura/2, 4, z, 0.1, 3, 0.6, M.vitralVerde);
            C(cx + coroLargura/2, 4, z, 0.1, 3, 0.6, M.vitralRoxo);
        }
        
        // Coroamento da fachada - arquivoltas
        for (let i = -8; i <= 8; i += 1.2) {
            C(cx + i, 8.5, fachadaZ + 0.3, 0.8, 0.4, 0.4, M.pedraClara);
        }
        
        // Arcadas cegas na fachada
        for (let i = -5; i <= 5; i += 2.5) {
            if (Math.abs(i) > 1) {
                C(cx + i, 9.5, fachadaZ + 0.2, 1.5, 2.5, 0.3, M.pedraEscura);
                C(cx + i, 9.5, fachadaZ + 0.25, 0.8, 2, 0.05, M.pedraMedia);
            }
        }
        
        // Esculturas nos portais laterais
        // Portal esquerdo - Anunciação
        C(cx - 5.5, 4, fachadaZ - 0.3, 0.4, 0.8, 0.2, M.pedraClara);
        C(cx - 4.5, 4, fachadaZ - 0.3, 0.4, 0.8, 0.2, M.pedraClara);
        // Portal direito - Último Julgamento
        C(cx + 5.5, 4, fachadaZ - 0.3, 0.4, 0.8, 0.2, M.pedraClara);
        C(cx + 4.5, 4, fachadaZ - 0.3, 0.4, 0.8, 0.2, M.pedraClara);
        
        // Mais gárgulas (8 ao todo)
        gargula(cx - naveLargura/2, naveZStart + 2, naveAltura * 0.75, -1);
        gargula(cx + naveLargura/2, naveZStart + 2, naveAltura * 0.75, 1);
        gargula(cx - naveLargura/2, naveZStart + 8, naveAltura * 0.75, -1);
        gargula(cx + naveLargura/2, naveZStart + 8, naveAltura * 0.75, 1);
        gargula(cx - naveLargura/2, naveZEnd - 6, naveAltura * 0.75, -1);
        gargula(cx + naveLargura/2, naveZEnd - 6, naveAltura * 0.75, 1);
        
        // Pináculos extras nos contrafortes
        for (let z = naveZStart + 2; z < naveZEnd - 1; z += 3.5) {
            pinaculo(cx - naveLargura/2 - 2, z, naveAltura * 0.7 + 2, 1.5);
            pinaculo(cx + naveLargura/2 + 2, z, naveAltura * 0.7 + 2, 1.5);
        }
        
        // Árvores no jardim frontal (formato voxel de árvore)
        function arvore(tx, tz) {
            // Tronco
            C(tx, 1.5, tz, 0.6, 3, 0.6, M.pedraMuitoEscura);
            // Copa
            C(tx, 3.5, tz, 2.5, 2.5, 2.5, M.grama);
            C(tx, 4.8, tz, 1.5, 1.5, 1.5, M.grama);
            C(tx, 5.8, tz, 0.8, 0.8, 0.8, M.grama);
        }
        
        arvore(cx - 12, fachadaZ - 7);
        arvore(cx + 12, fachadaZ - 7);
        arvore(cx - 10, fachadaZ - 10);
        arvore(cx + 10, fachadaZ - 10);
        
        // Cercado do jardim
        C(cx - 12, 0.5, fachadaZ - 10, 0.3, 1, 0.3, M.pedraEscura);
        C(cx + 12, 0.5, fachadaZ - 10, 0.3, 1, 0.3, M.pedraEscura);
        C(cx, 0.5, fachadaZ - 10, 0.3, 1, 0.3, M.pedraEscura);
        C(cx - 6, 0.4, fachadaZ - 10, 0.3, 0.8, 0.3, M.pedraEscura);
        C(cx + 6, 0.4, fachadaZ - 10, 0.3, 0.8, 0.3, M.pedraEscura);
        
        // Cadeado/corrente entre os postes
        C(cx - 9, 0.7, fachadaZ - 10, 5.8, 0.05, 0.05, M.ouro);
        C(cx + 3, 0.7, fachadaZ - 10, 5.8, 0.05, 0.05, M.ouro);
        C(cx - 3, 0.7, fachadaZ - 10, 5.8, 0.05, 0.05, M.ouro);
        
        // Detalhe: lâmpadas de rua no parvis
        function lampada(lx, lz) {
            C(lx, 1, lz, 0.2, 2, 0.2, new ctx.THREE.MeshLambertMaterial({color:0x222222}));
            C(lx, 2.2, lz, 0.4, 0.1, 0.4, new ctx.THREE.MeshLambertMaterial({color:0x222222}));
            C(lx, 2.4, lz, 0.2, 0.2, 0.2, new ctx.THREE.MeshBasicMaterial({color:0xFFDD88}));
        }
        
        lampada(cx - 8, fachadaZ - 4);
        lampada(cx + 8, fachadaZ - 4);
        lampada(cx - 4, parvisZ);
        lampada(cx + 4, parvisZ);
        
        // Relógio na torre (detalhe circular)
        C(cx - 6, 14, fachadaZ + 2.3, 1.2, 1.2, 0.1, M.branco);
        C(cx - 6, 14, fachadaZ + 2.35, 0.1, 0.5, 0.05, new ctx.THREE.MeshBasicMaterial({color:0x222222}));
        C(cx - 6, 14, fachadaZ + 2.35, 0.4, 0.1, 0.05, new ctx.THREE.MeshBasicMaterial({color:0x222222}));
        
        // Brasões/escudos na torre
        C(cx - 6, 8, fachadaZ + 2.3, 0.6, 0.8, 0.1, M.ouro);
        C(cx + 6, 8, fachadaZ + 2.3, 0.6, 0.8, 0.1, M.ouro);
        
        // Corrimão da escadaria
        for (let i = 0; i < 4; i++) {
            const zEsc = fachadaZ - 1.5 - i * 0.8;
            const yEsc = i * 0.25 + 0.5;
            C(cx - 7, yEsc, zEsc, 0.2, 0.5, 0.2, M.pedraEscura);
            C(cx + 7, yEsc, zEsc, 0.2, 0.5, 0.2, M.pedraEscura);
            if (i < 3) {
                C(cx - 7, yEsc + 0.2, zEsc - 0.4, 0.1, 0.1, 0.6, M.pedraEscura);
                C(cx + 7, yEsc + 0.2, zEsc - 0.4, 0.1, 0.1, 0.6, M.pedraEscura);
            }
        }
        
        // Candelabros no interior
        function candelabro(kx, kz) {
            C(kx, 0.3, kz, 0.15, 0.6, 0.15, M.ouro);
            C(kx, 0.7, kz, 0.1, 0.15, 0.1, new ctx.THREE.MeshBasicMaterial({color:0xFF6600}));
        }
        candelabro(cx - 1, naveZStart + 5);
        candelabro(cx + 1, naveZStart + 5);
        candelabro(cx - 1, naveZStart + 9);
        candelabro(cx + 1, naveZStart + 9);
        
        // Detalhe: púlpito
        C(cx - 1.5, 0.8, naveZStart + 6, 0.8, 1.2, 0.8, M.madeira);
        C(cx - 1.5, 1.5, naveZStart + 6, 0.6, 0.6, 0.1, M.madeira);
        
        // ==========================================
        // 16. COLISÕES PRINCIPAIS DA ESTRUTURA
        // ==========================================
        
        // Fachada
        addColl(C(cx, 5, fachadaZ, fachadaLargura, 10, 2, M.pedraClara));
        // Nave
        addColl(C(cx, 5, naveZStart + naveComprimento/2, naveLargura + 4, naveAltura, naveComprimento, M.pedraClara));
        // Telhado nave
        addColl(C(cx, naveAltura + 2, telhadoZ, naveLargura + 2, 4, telhadoComp, M.telha));
        
        console.log("Notre-Dame de Paris carregada pelo Kimi K2.6!");
    };
})();
