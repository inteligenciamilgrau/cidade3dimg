// blocks/block_2_3.js - Biblioteca Tianjin Binhai (China)
// Inspirada na icônica "Biblioteca do Olho" projetada pelo MVRDV
(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['2_3'] = function(ctx) {
        
        const THREE = ctx.THREE;
        const cx = ctx.centerX;
        const cz = ctx.centerZ;
        
        // === MATERIAIS ===
        const matVidro = new THREE.MeshLambertMaterial({ 
            color: 0x88ccff, 
            transparent: true, 
            opacity: 0.4 
        });
        const matVidroEscuro = new THREE.MeshLambertMaterial({ 
            color: 0x4488bb, 
            transparent: true, 
            opacity: 0.5 
        });
        const matBranco = new THREE.MeshLambertMaterial({ color: 0xf5f5f5 });
        const matBrancoBrilho = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const matCinzaClaro = new THREE.MeshLambertMaterial({ color: 0xdddddd });
        const matCinza = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const matPreto = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const matMadeira = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const matAzulEscuro = new THREE.MeshLambertMaterial({ color: 0x1a3a5c });
        
        // === FUNÇÃO AUXILIAR: Criar esfera voxelizada ===
        function createVoxelSphere(centerX, centerY, centerZ, radius, material, hollow = false) {
            const voxels = [];
            const r2 = radius * radius;
            const innerR2 = (radius - 1) * (radius - 1);
            
            for (let x = -radius; x <= radius; x++) {
                for (let y = -radius; y <= radius; y++) {
                    for (let z = -radius; z <= radius; z++) {
                        const dist2 = x*x + y*y + z*z;
                        if (dist2 <= r2) {
                            if (!hollow || dist2 > innerR2) {
                                const vx = centerX + x;
                                const vy = centerY + y;
                                const vz = centerZ + z;
                                const v = ctx.createVoxel(vx, vy, vz, 1, 1, 1, material);
                                voxels.push(v);
                                ctx.collidables.push(new THREE.Box3().setFromObject(v));
                            }
                        }
                    }
                }
            }
            return voxels;
        }
        
        // === FUNÇÃO AUXILIAR: Criar círculo horizontal ===
        function createCircle(centerX, centerY, centerZ, radius, material, thickness = 1) {
            const voxels = [];
            for (let x = -radius; x <= radius; x++) {
                for (let z = -radius; z <= radius; z++) {
                    const dist = Math.sqrt(x*x + z*z);
                    if (dist >= radius - thickness && dist <= radius) {
                        const v = ctx.createVoxel(centerX + x, centerY, centerZ + z, 1, 1, 1, material);
                        voxels.push(v);
                        ctx.collidables.push(new THREE.Box3().setFromObject(v));
                    }
                }
            }
            return voxels;
        }
        
        // === FUNÇÃO AUXILIAR: Criar arco/anel ===
        function createArc(centerX, centerY, centerZ, radius, startAngle, endAngle, material) {
            const voxels = [];
            const steps = Math.floor(radius * 8);
            for (let i = 0; i <= steps; i++) {
                const angle = startAngle + (endAngle - startAngle) * (i / steps);
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const v = ctx.createVoxel(centerX + x, centerY, centerZ + z, 1.2, 1.2, 1.2, material);
                voxels.push(v);
                ctx.collidables.push(new THREE.Box3().setFromObject(v));
            }
            return voxels;
        }
        
        // === BASE DO EDIFÍCIO ===
        // Plataforma de entrada - apenas nas laterais, deixando centro e entrada livres
        for (let x = -13; x <= 13; x++) {
            for (let z = -13; z <= 13; z++) {
                // Área da entrada completamente livre (caminho até a porta)
                if (Math.abs(x) <= 7 && z >= 8) continue;
                const base = ctx.createVoxel(cx + x, 0.3, cz + z, 1, 0.6, 1, matCinzaClaro);
                ctx.collidables.push(new THREE.Box3().setFromObject(base));
            }
        }
        
        // Rampa interna conectando entrada ao piso do térreo
        for (let z = 8; z <= 12; z++) {
            const rampY = 0.3 + (12 - z) * 0.3;
            for (let x = -6; x <= 6; x++) {
                const ramp = ctx.createVoxel(cx + x, rampY, cz + z, 1, 0.3, 1, matCinzaClaro);
                ctx.collidables.push(new THREE.Box3().setFromObject(ramp));
            }
        }
        
        // === ESTRUTURA EXTERNA - Fachada de vidro ===
        // Paredes de vidro nas 4 direções
        const wallHeight = 32;
        const wallWidth = 24;
        
        // Frente (abertura oval do "olho" - entrada completamente livre no térreo)
        for (let y = 0; y < wallHeight; y++) {
            for (let x = -12; x <= 12; x++) {
                // Entrada completamente livre - área maior para garantir passagem
                const isEntranceArea = y < 10 && Math.abs(x) <= 7;
                if (isEntranceArea) continue;
                
                // Calcular abertura oval - maior na parte inferior
                const ovalWidth = 10 + (y / wallHeight) * 3;
                const ovalHeight = 14;
                const ovalCenterY = 9;
                
                const inOval = (x*x)/(ovalWidth*ovalWidth) + Math.pow(y - ovalCenterY, 2)/(ovalHeight*ovalHeight) <= 1;
                
                if (!inOval) {
                    const v = ctx.createVoxel(cx + x, 2 + y, cz + 12, 1, 1, 1, matVidro);
                    ctx.collidables.push(new THREE.Box3().setFromObject(v));
                }
            }
        }
        
        // Paredes laterais e traseira
        for (let y = 0; y < wallHeight; y++) {
            // Lado esquerdo
            for (let z = -11; z <= 11; z++) {
                const v = ctx.createVoxel(cx - 12, 2 + y, cz + z, 1, 1, 1, matVidro);
                ctx.collidables.push(new THREE.Box3().setFromObject(v));
            }
            // Lado direito
            for (let z = -11; z <= 11; z++) {
                const v = ctx.createVoxel(cx + 12, 2 + y, cz + z, 1, 1, 1, matVidro);
                ctx.collidables.push(new THREE.Box3().setFromObject(v));
            }
            // Traseira
            for (let x = -11; x <= 11; x++) {
                const v = ctx.createVoxel(cx + x, 2 + y, cz - 12, 1, 1, 1, matVidro);
                ctx.collidables.push(new THREE.Box3().setFromObject(v));
            }
        }
        
        // Teto de vidro
        for (let x = -11; x <= 11; x++) {
            for (let z = -11; z <= 11; z++) {
                const v = ctx.createVoxel(cx + x, 35, cz + z, 1, 0.5, 1, matVidroEscuro);
                ctx.collidables.push(new THREE.Box3().setFromObject(v));
            }
        }
        
        // === PISO DO TÉRREO - Espaço aberto para andar ===
        for (let x = -10; x <= 10; x++) {
            for (let z = -10; z <= 8; z++) {  // Limitado a z <= 8 para não conflitar com rampa
                // Deixar espaço vazio no centro para circulação
                const distFromCenter = Math.sqrt(x*x + z*z);
                if (distFromCenter > 4) {
                    const floor = ctx.createVoxel(cx + x, 1.5, cz + z, 1, 0.3, 1, matCinzaClaro);
                    ctx.collidables.push(new THREE.Box3().setFromObject(floor));
                }
            }
        }
        
        // === ESFERA CENTRAL - O "OLHO" (reduzida para mais espaço) ===
        const sphereY = 15;
        const sphereRadius = 5;
        
        // Esfera externa branca (com abertura frontal maior)
        for (let x = -sphereRadius; x <= sphereRadius; x++) {
            for (let y = -sphereRadius; y <= sphereRadius; y++) {
                for (let z = -sphereRadius; z <= sphereRadius; z++) {
                    const dist2 = x*x + y*y + z*z;
                    const outerR2 = sphereRadius * sphereRadius;
                    const innerR2 = (sphereRadius - 1) * (sphereRadius - 1);
                    
                    // Abertura circular frontal maior (o "pupila")
                    const inPupil = z > sphereRadius - 4 && (x*x + y*y) < 12;
                    
                    if (dist2 <= outerR2 && dist2 > innerR2 && !inPupil) {
                        const v = ctx.createVoxel(cx + x, sphereY + y, cz + z, 1, 1, 1, matBranco);
                        ctx.collidables.push(new THREE.Box3().setFromObject(v));
                    }
                }
            }
        }
        
        // Interior da esfera - espaço de leitura iluminado (mais aberto)
        for (let x = -3; x <= 3; x++) {
            for (let y = -3; y <= 3; y++) {
                for (let z = -3; z <= 1; z++) {
                    if (x*x + y*y + z*z <= 9) {
                        const v = ctx.createVoxel(cx + x, sphereY + y, cz + z, 0.8, 0.8, 0.8, matBrancoBrilho);
                    }
                }
            }
        }
        
        // === TERRAÇOS EM ESPIRAL - Andares internos com espaço para andar
        const numLevels = 4;
        const levelHeight = 7; // Aumentado para dar mais espaço vertical
        
        for (let level = 0; level < numLevels; level++) {
            const y = 4 + level * levelHeight;
            const terraceRadius = 11 - level * 0.5;
            const nextTerraceRadius = 11 - (level + 1) * 0.5;
            const nextY = y + levelHeight;
            
            // Terraço curvo - reduzido para NÃO cobrir a escada
            // Ângulo reduzido de 1.6 para 1.3 para deixar espaço livre para escada
            for (let angle = 0; angle < Math.PI * 1.3; angle += 0.04) {
                const x = Math.cos(angle) * terraceRadius;
                const z = Math.sin(angle) * terraceRadius;
                
                // Piso do terraço
                const floor = ctx.createVoxel(cx + x, y, cz + z, 2, 0.5, 2, matMadeira);
                ctx.collidables.push(new THREE.Box3().setFromObject(floor));
                
                // Guarda-corpo fino (mais baixo para não atrapalhar)
                if (level < numLevels - 1) {
                    const rail = ctx.createVoxel(cx + x, y + 0.5, cz + z, 0.2, 0.5, 0.2, matBranco);
                    ctx.collidables.push(new THREE.Box3().setFromObject(rail));
                }
            }
            
            // Escada entre níveis - conectando este andar com o próximo
            // A escada começa onde o terraço termina (1.3) e sobe até logo abaixo do próximo nível
            const stairStartAngle = Math.PI * 1.3;
            const stairEndAngle = Math.PI * 2.0;
            const numSteps = 24;
            
            for (let i = 0; i <= numSteps; i++) {
                const t = i / numSteps;
                // Interpolação do ângulo
                const angle = stairStartAngle + (stairEndAngle - stairStartAngle) * t;
                // Interpolação da altura - termina 1 bloco ANTES do piso superior para dar espaço
                const stairY = y + t * (levelHeight - 1.5);
                // Interpolação do raio (vai do raio atual para o próximo raio)
                const currentRadius = terraceRadius * (1 - t) + nextTerraceRadius * t;
                
                const stairX = Math.cos(angle) * currentRadius;
                const stairZ = Math.sin(angle) * currentRadius;
                
                // Degrau mais largo e espesso para fácil subida
                const stair = ctx.createVoxel(cx + stairX, stairY, cz + stairZ, 2.5, 0.6, 2.5, matCinza);
                ctx.collidables.push(new THREE.Box3().setFromObject(stair));
            }
            
            // Rampa final conectando escada ao piso superior (para transição suave)
            const rampAngle = Math.PI * 2.0;
            const rampX = Math.cos(rampAngle) * nextTerraceRadius;
            const rampZ = Math.sin(rampAngle) * nextTerraceRadius;
            const rampY = y + levelHeight - 1.5;
            const ramp = ctx.createVoxel(cx + rampX, rampY, cz + rampZ, 2, 0.5, 2, matMadeira);
            ctx.collidables.push(new THREE.Box3().setFromObject(ramp));
            
            // Estantes de livros - apenas algumas, afastadas da área de circulação
            for (let angle = 0.5; angle < Math.PI; angle += 0.8) {
                const bx = Math.cos(angle) * (terraceRadius - 3.5);
                const bz = Math.sin(angle) * (terraceRadius - 3.5);
                const bookshelf = ctx.createVoxel(cx + bx, y + 1, cz + bz, 0.4, 1.2, 1.5, matMadeira);
                ctx.collidables.push(new THREE.Box3().setFromObject(bookshelf));
                
                // Apenas 2 livros por estante
                for (let b = 0; b < 2; b++) {
                    const bookColor = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00][b];
                    const bookMat = new THREE.MeshLambertMaterial({ color: bookColor });
                    const book = ctx.createVoxel(cx + bx, y + 0.8 + b * 0.3, cz + bz - 0.3 + b * 0.3, 0.25, 0.2, 0.6, bookMat);
                }
            }
        }
        
        // === PILASTRAS ESTRUTURAIS (apenas nos cantos para mais espaço interno) ===
        const pillarPositions = [
            [-11, -11], [-11, 11], [11, -11], [11, 11]
        ];
        
        pillarPositions.forEach(([px, pz]) => {
            for (let y = 2; y < 35; y++) {
                const pillar = ctx.createVoxel(cx + px, y, cz + pz, 1.5, 1, 1.5, matBranco);
                ctx.collidables.push(new THREE.Box3().setFromObject(pillar));
            }
        });
        
        // === ENTRADA PRINCIPAL - Mais larga para fácil acesso ===
        // Portal de entrada - ajustado para nova altura
        for (let x = -5; x <= 5; x++) {
            for (let y = 2; y <= 9; y++) {
                if (Math.abs(x) > 4 || y > 8) {
                    const frame = ctx.createVoxel(cx + x, y, cz + 12, 1, 1, 1, matBranco);
                    ctx.collidables.push(new THREE.Box3().setFromObject(frame));
                }
            }
        }
        
        // Portas de vidro - entrada ampla (apenas visual, sem colisão)
        for (let x = -4; x <= 4; x++) {
            for (let y = 2; y <= 7; y++) {
                const door = ctx.createVoxel(cx + x, y, cz + 11.5, 0.8, 0.8, 0.2, matVidroEscuro);
            }
        }
        
        // === ILUMINAÇÃO INTERNA ===
        // Luzes no teto
        for (let x = -8; x <= 8; x += 4) {
            for (let z = -8; z <= 8; z += 4) {
                const light = ctx.createVoxel(cx + x, 34, cz + z, 1, 0.5, 1, matBrancoBrilho);
            }
        }
        
        // === ÁREA EXTERNA - JARDIM ===
        // Grama ao redor
        for (let x = -14; x <= 14; x++) {
            for (let z = -14; z <= 14; z++) {
                if (Math.abs(x) > 12 || Math.abs(z) > 12) {
                    const grass = ctx.createVoxel(cx + x, 0.5, cz + z, 1, 0.5, 1, new THREE.MeshLambertMaterial({ color: 0x44aa44 }));
                }
            }
        }
        
        // Árvores decorativas (reposicionadas para não bloquear entrada)
        const treePositions = [
            [-13, -13], [-13, 8], [13, -13], [13, 8],
            [-14, -5], [14, -5], [-5, -14], [5, -14]
        ];
        
        treePositions.forEach(([tx, tz]) => {
            // Tronco
            for (let y = 1; y <= 3; y++) {
                const trunk = ctx.createVoxel(cx + tx, y, cz + tz, 0.8, 1, 0.8, matMadeira);
                ctx.collidables.push(new THREE.Box3().setFromObject(trunk));
            }
            // Folhagem
            for (let x = -2; x <= 2; x++) {
                for (let y = 0; y <= 3; y++) {
                    for (let z = -2; z <= 2; z++) {
                        if (x*x + y*y + z*z <= 5) {
                            const leaf = ctx.createVoxel(cx + tx + x, 4 + y, cz + tz + z, 1, 1, 1, new THREE.MeshLambertMaterial({ color: 0x228822 }));
                            ctx.collidables.push(new THREE.Box3().setFromObject(leaf));
                        }
                    }
                }
            }
        });
        
        // === DETALHES - BANCOS ===
        const benchPositions = [
            [-8, 10], [8, 10], [-8, -10], [8, -10]
        ];
        
        benchPositions.forEach(([bx, bz]) => {
            const bench = ctx.createVoxel(cx + bx, 1.5, cz + bz, 3, 1, 1, matMadeira);
            ctx.collidables.push(new THREE.Box3().setFromObject(bench));
        });
        
        // === PLAQUINHA - Agente Kimi 2.5 ===
        // Criar textura com texto usando canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#1a3a5c';
        context.fillRect(0, 0, 512, 128);
        context.fillStyle = '#ffffff';
        context.font = 'bold 48px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Agente Kimi 2.5', 256, 64);
        // Borda dourada
        context.strokeStyle = '#ffd700';
        context.lineWidth = 8;
        context.strokeRect(4, 4, 504, 120);
        
        const signTexture = new THREE.CanvasTexture(canvas);
        const matPlaca = new THREE.MeshLambertMaterial({ map: signTexture });
        
        // Poste da placa (na frente do prédio, ao lado da entrada)
        const poste = ctx.createVoxel(cx - 9, 1.5, cz + 14, 0.5, 3, 0.5, matCinza);
        ctx.collidables.push(new THREE.Box3().setFromObject(poste));
        
        // Placa propriamente dita - virada para quem chega
        const placa = ctx.createVoxel(cx - 9, 3.5, cz + 14, 5, 1.5, 0.3, matPlaca);
        ctx.collidables.push(new THREE.Box3().setFromObject(placa));
        
        // === REGISTRAR NO MINIMAPA ===
        if (ctx.buildings) {
            ctx.buildings.push({
                name: "Biblioteca Tianjin Binhai",
                x: cx,
                z: cz,
                width: 24,
                depth: 24,
                type: "cultural"
            });
        }
        
    };
})();
