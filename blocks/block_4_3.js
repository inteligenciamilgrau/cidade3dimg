// =========================================================================
//  🗽  ESTÁTUA DA LIBERDADE (ULTRA-PROCEDURAL V8 - THE FINAL CUT)  🗽 
//  --------------------------------------------------------------------
//  "A Liberdade Iluminando o Mundo... agora com a placa no lugar certo!"
// =========================================================================
(function () {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['4_3'] = function (ctx) {
        const THREE = ctx.THREE;
        const cx = ctx.centerX;
        const cz = ctx.centerZ;

        // =================================================================
        //  PALETA DE MATERIAIS
        // =================================================================
        const matFortBase = new THREE.MeshLambertMaterial({ color: 0x4a4d42 });
        const matFortTrim = new THREE.MeshLambertMaterial({ color: 0x6e7362 });
        const matPedestal = new THREE.MeshLambertMaterial({ color: 0xdfd3c3 });
        const matPedDark = new THREE.MeshLambertMaterial({ color: 0xc4b7a3 });
        const matCopper = new THREE.MeshLambertMaterial({ color: 0x43b3ae });
        const matCopperDark = new THREE.MeshLambertMaterial({ color: 0x2c8c88 });
        const matCopperLite = new THREE.MeshLambertMaterial({ color: 0x5cd6d0 });
        const matGold = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        const matGoldGlow = new THREE.MeshBasicMaterial({ color: 0xffea00 });
        const matFireCore = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const matFireMid = new THREE.MeshBasicMaterial({ color: 0xff8800 });
        const matFireOut = new THREE.MeshBasicMaterial({ color: 0xff2200, transparent: true, opacity: 0.8 });
        const matGlass = new THREE.MeshBasicMaterial({ color: 0xaaccff, transparent: true, opacity: 0.4 });
        const matForceField = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.05 });
        const matMuseum = new THREE.MeshLambertMaterial({ color: 0x8a1c1c });
        const matStairs = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const matWater = new THREE.MeshLambertMaterial({ color: 0x1e5a7a, transparent: true, opacity: 0.8 });

        // A função mágica que causou o sumiço da placa
        function vox(x, y, z, w, h, d, mat, collide = true) {
            const mesh = ctx.createVoxel(cx + x, y, cz + z, w, h, d, mat);
            if (collide) ctx.collidables.push(new THREE.Box3().setFromObject(mesh));
            return mesh;
        }

        // =================================================================
        //  1. FUNDAÇÃO E BAÍA
        // =================================================================
        vox(0, 0.2, 0, 30, 0.2, 30, matWater, false);

        const numPoints = 11;
        for (let x = -13; x <= 13; x += 0.6) {
            for (let z = -13; z <= 13; z += 0.6) {
                let r = Math.sqrt(x * x + z * z);
                if (r > 13.5) continue;
                let angle = Math.atan2(z, x);
                let maxR = 9 + 4 * Math.cos(numPoints * angle);

                if (r <= maxR) {
                    vox(x, 1.9, z, 0.65, 3, 0.65, matFortBase);
                    if (r > maxR - 0.8) vox(x, 3.25, z, 0.65, 0.3, 0.65, matFortTrim);
                }
            }
        }

        // =================================================================
        //  2. PEDESTAL, MUSEU E ESCADAS
        // =================================================================
        vox(0, 4.9, 0, 14, 3, 14, matPedDark);
        vox(0, 6.9, 0, 12, 1, 12, matPedestal);
        vox(0, 7.5, 0, 11, 0.2, 11, matMuseum);

        for (let i = 0; i < 9; i++) {
            vox(0, 0.2 + (i * 0.4), 13.0 - (i * 0.5), 8, 0.4, 0.5, matPedestal);
        }
        for (let i = 0; i < 10; i++) {
            vox(0, 3.6 + (i * 0.4), 8.5 - (i * 0.4), 6, 0.4, 0.5, matPedestal);
        }
        vox(0, 7.4, 5.5, 6, 0.2, 2.5, matPedestal);

        vox(-3, 8.5, -3, 1.5, 2, 1.5, matGoldGlow, false);
        vox(3, 8.5, -3, 1.5, 2, 1.5, matGoldGlow, false);

        const pedHeight = 12;
        const pedY = 13.6;
        vox(0, pedY, -5.5, 12, pedHeight, 1, matPedestal);
        vox(-5.5, pedY, 0, 1, pedHeight, 10, matPedestal);
        vox(5.5, pedY, 0, 1, pedHeight, 10, matPedestal);
        vox(-4, pedY, 5.5, 4, pedHeight, 1, matPedestal);
        vox(4, pedY, 5.5, 4, pedHeight, 1, matPedestal);
        vox(0, 16.1, 5.5, 4, 7, 1, matPedestal);

        const tetoY = 20.1;
        vox(0, tetoY, -4.5, 12, 1, 3, matPedDark);
        vox(0, tetoY, 4.5, 12, 1, 3, matPedDark);
        vox(-4.5, tetoY, 0, 3, 1, 6, matPedDark);
        vox(4.5, tetoY, 0, 3, 1, 6, matPedDark);

        // =================================================================
        //  3. A ESTÁTUA
        // =================================================================
        const tuboY = 37.6;
        const tuboH = 34;
        vox(0, tuboY, -4, 8, tuboH, 0.5, matForceField, true);
        vox(0, tuboY, 4, 8, tuboH, 0.5, matForceField, true);
        vox(-4, tuboY, 0, 0.5, tuboH, 7.5, matForceField, true);
        vox(4, tuboY, 0, 0.5, tuboH, 7.5, matForceField, true);

        for (let y = 20.6; y < 48; y += 1.2) {
            let taper = (y - 20.6) / 27.4;
            let baseR = 5.2 - (taper * 1.5);

            for (let a = 0; a < Math.PI * 2; a += 0.25) {
                let ripple = Math.sin(a * 8 + y * 0.1) * 0.4;
                let pX = (baseR + ripple) * Math.cos(a);
                let pZ = (baseR + ripple) * Math.sin(a);
                let mat = (ripple > 0.1) ? matCopperLite : (ripple < -0.1) ? matCopperDark : matCopper;
                vox(pX, y, pZ, 1.4, 1.4, 1.4, mat, false);
            }
        }

        // =================================================================
        //  4. BRAÇOS, TÁBUA E TOCHA
        // =================================================================
        vox(-5.5, 41, 2, 2.5, 8, 2.5, matCopper);
        vox(-5, 37, 4, 2, 4, 4, matCopper);
        vox(-4.8, 38, 7.5, 4, 7, 1, matCopperDark);
        vox(-4.8, 38, 8.1, 3.6, 6.5, 0.1, matGold);

        for (let t = 0; t <= 1; t += 0.15) {
            let px = 5.5 + t * 4;
            let py = 45 + t * 11;
            vox(px, py, 0, 2.2, 2.2, 2.2, matCopper, false);
        }

        const tX = 9.5;
        const tY = 57;
        vox(tX, tY, 0, 4.5, 0.5, 4.5, matGold);
        vox(tX, tY + 2.5, 0, 2, 3, 2, matGold);
        vox(tX, tY + 4.5, 0, 3.5, 5, 3.5, matFireOut, false);
        vox(tX, tY + 4.0, 0, 2.5, 4, 2.5, matFireMid, false);
        vox(tX, tY + 3.5, 0, 1.5, 3, 1.5, matFireCore, false);

        // =================================================================
        //  5. CABEÇA E MIRANTE VIP
        // =================================================================
        const deckY = 48.6;
        vox(0, deckY, -3.5, 8, 0.2, 3, matPedDark);
        vox(0, deckY, 3.5, 8, 0.2, 3, matPedDark);
        vox(-3.5, deckY, 0, 3, 0.2, 4, matPedDark);
        vox(3.5, deckY, 0, 3, 0.2, 4, matPedDark);

        const hY = 51.2;
        vox(0, hY, -3.5, 6, 5, 1.5, matCopper);
        vox(-3.5, hY, 0, 1.5, 5, 6, matCopper);
        vox(3.5, hY, 0, 1.5, 5, 6, matCopper);
        vox(0, hY + 1, 3.5, 6, 3, 0.6, matGlass, true);

        vox(0, hY + 3.5, 0, 6.5, 1.5, 6.5, matCopperDark);
        for (let i = 0; i < 7; i++) {
            let angle = (i / 6) * Math.PI - Math.PI / 2;
            let rP = 3.5;
            let px = Math.cos(angle) * rP;
            let pz = Math.sin(angle) * rP;
            for (let step = 1; step <= 4; step += 1) {
                vox(px * step * 0.4, hY + 3.5 + step * 0.8, 1 + pz * step * 0.4, 0.4, 1, 0.4, matCopper, false);
            }
        }

        // =================================================================
        //  6. ESCADA CARACOL E ELEVADOR INTELIGENTE
        // =================================================================
        for (let y = 7.6; y < 48; y += 0.5) {
            let angle = y * 1.5;
            let radius = 2.8;
            let pX = radius * Math.cos(angle);
            let pZ = radius * Math.sin(angle);
            vox(pX, y, pZ, 1.2, 0.2, 1.2, matStairs);
        }

        function initElevator() {
            const platform = ctx.createVoxel(cx, 7.7, cz, 3.2, 0.2, 3.2, matGold);
            const elBox = new THREE.Box3().setFromObject(platform);
            ctx.collidables.push(elBox);

            let state = 'WAIT_BOTTOM';
            let timer = 0;
            const Y_BOT = 7.7;
            const Y_TOP = 48.7;

            setInterval(() => {
                let pos = (ctx.camera && ctx.camera.position) || null;
                let playerIsOnPlatform = false;
                let playerIsWaitingAtTop = false;

                if (pos) {
                    let dx = Math.abs(pos.x - platform.position.x);
                    let dz = Math.abs(pos.z - platform.position.z);
                    let dy = pos.y - platform.position.y;

                    if (dx < 1.6 && dz < 1.6 && dy >= 0 && dy < 3) {
                        playerIsOnPlatform = true;
                    }

                    let distToCenter = Math.sqrt((pos.x - cx) ** 2 + (pos.z - cz) ** 2);
                    if (distToCenter < 5 && pos.y >= Y_TOP) {
                        playerIsWaitingAtTop = true;
                    }
                }

                if (state === 'UP') {
                    platform.position.y += 0.25;
                    if (platform.position.y >= Y_TOP) {
                        platform.position.y = Y_TOP;
                        state = 'WAIT_TOP';
                        timer = 0;
                    }
                } else if (state === 'DOWN') {
                    platform.position.y -= 0.25;
                    if (platform.position.y <= Y_BOT) {
                        platform.position.y = Y_BOT;
                        state = 'WAIT_BOTTOM';
                        timer = 0;
                    }
                } else if (state === 'WAIT_TOP') {
                    if (pos) {
                        if (!playerIsWaitingAtTop || playerIsOnPlatform) {
                            timer += 16;
                            if (timer > 3000) state = 'DOWN';
                        } else {
                            timer = 0;
                        }
                    } else {
                        timer += 16;
                        if (timer > 6000) state = 'DOWN';
                    }
                } else if (state === 'WAIT_BOTTOM') {
                    if (pos) {
                        if (playerIsOnPlatform || playerIsWaitingAtTop) {
                            timer += 16;
                            if (timer > 1000) state = 'UP';
                        } else {
                            timer = 0;
                        }
                    } else {
                        timer += 16;
                        if (timer > 4000) state = 'UP';
                    }
                }
                platform.updateMatrixWorld();
                elBox.setFromObject(platform);
            }, 16);
        }
        initElevator();

        // =================================================================
        //  7. PLACA DE ASSINATURA (CORRIGIDA)
        // =================================================================
        function renderStandardSign(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 192;
            const c2 = canvas.getContext('2d');

            c2.fillStyle = '#0f1720';
            c2.fillRect(0, 0, 512, 192);
            c2.strokeStyle = '#43b3ae';
            c2.lineWidth = 12;
            c2.strokeRect(10, 10, 492, 172);

            c2.fillStyle = '#eef7ff';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            c2.font = 'bold 45px Arial';
            c2.fillText(monumentName, 256, 78);

            c2.fillStyle = '#ffd700';
            c2.font = 'italic bold 32px Arial';
            c2.fillText(aiModel, 256, 132);

            const signMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) });
            const matDark = new THREE.MeshLambertMaterial({ color: 0x222222 });

            // CORREÇÃO AQUI: Coordenadas locais, pois a função vox já soma o centro da cidade!
            let pX = -10;
            let pZ = 12;

            vox(pX - 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            vox(pX + 2.2, 1.8, pZ, 0.22, 2.8, 0.22, matDark);
            vox(pX, 3.5, pZ, 5.2, 1.8, 0.22, matDark);
            vox(pX, 3.5, pZ + 0.12, 5.2, 1.8, 0.05, signMat);
        }

        renderStandardSign('Estátua da Liberdade (V2)', 'GEMINI 3.1 PRO');
    };
})();