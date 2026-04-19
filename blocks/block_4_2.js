(function() {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['4_2'] = function(ctx) {
        const THREE = ctx.THREE;
        const centerX = ctx.centerX;
        const centerZ = ctx.centerZ;

        // ============================================
        // MATERIALS - Futuristic Elon Musk palette
        // ============================================
        const concreteDark = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
        const metalSilver = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const metalDark = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const glassBlue = new THREE.MeshLambertMaterial({ color: 0x66aaff, transparent: true, opacity: 0.65 });
        const glassCyan = new THREE.MeshLambertMaterial({ color: 0x00ddff, transparent: true, opacity: 0.7 });
        const teslaRed = new THREE.MeshLambertMaterial({ color: 0xe82127 });
        const neonCyan = new THREE.MeshLambertMaterial({ color: 0x00ffff });
        const neonYellow = new THREE.MeshLambertMaterial({ color: 0xffee00 });
        const neonPink = new THREE.MeshLambertMaterial({ color: 0xff00aa });
        const solarPanel = new THREE.MeshLambertMaterial({ color: 0x113366 });
        const cyberBlack = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const rocketWhite = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        const flameOrange = new THREE.MeshLambertMaterial({ color: 0xff6600 });

        // ============================================
        // GROUND PLAZA - Cyberpunk futuristic base
        // ============================================
        const ground = ctx.createVoxel(centerX, 0.5, centerZ, 29, 1, 29, concreteDark);
        ctx.collidables.push(new THREE.Box3().setFromObject(ground));

        // Neon grid lines on ground (cyberpunk vibe)
        const lineMat = neonCyan;
        for (let i = -13; i <= 13; i += 5) {
            // Horizontal lines (along X)
            ctx.createVoxel(centerX, 1.05, centerZ + i, 27, 0.15, 0.8, lineMat);
            // Vertical lines (along Z)
            ctx.createVoxel(centerX + i, 1.05, centerZ, 0.8, 0.15, 27, lineMat);
        }
        // Extra diagonal accent lines
        ctx.createVoxel(centerX, 1.05, centerZ, 20, 0.15, 0.8, neonPink);
        ctx.createVoxel(centerX, 1.05, centerZ, 0.8, 0.15, 20, neonPink);

        // ============================================
        // TESLA INNOVATION TOWER - Grand central spire
        // ============================================
        // Podium base (wide foundation)
        const podium = ctx.createVoxel(centerX - 1, 5, centerZ - 3, 20, 10, 16, metalSilver);
        ctx.collidables.push(new THREE.Box3().setFromObject(podium));

        // Lower tower section (impressive height)
        const lowerTower = ctx.createVoxel(centerX - 1, 22, centerZ - 3, 14, 24, 12, glassBlue);
        ctx.collidables.push(new THREE.Box3().setFromObject(lowerTower));

        // Metal frame accents on lower tower (vertical pillars)
        ctx.createVoxel(centerX - 1 - 7, 22, centerZ - 3, 1.5, 24, 1.5, metalDark);
        ctx.createVoxel(centerX - 1 + 7, 22, centerZ - 3, 1.5, 24, 1.5, metalDark);
        ctx.createVoxel(centerX - 1, 22, centerZ - 3 - 6, 1.5, 24, 1.5, metalDark);
        ctx.createVoxel(centerX - 1, 22, centerZ - 3 + 6, 1.5, 24, 1.5, metalDark);

        // Upper tower (sleeker, more futuristic)
        const upperTower = ctx.createVoxel(centerX - 1, 40, centerZ - 3, 9, 16, 8, glassCyan);
        ctx.collidables.push(new THREE.Box3().setFromObject(upperTower));

        // Spire / antenna (reaches for the stars - SpaceX vibe)
        const spire = ctx.createVoxel(centerX - 1, 52, centerZ - 3, 3, 12, 3, metalDark);
        ctx.collidables.push(new THREE.Box3().setFromObject(spire));

        // Glowing spire tip (beacon)
        ctx.createVoxel(centerX - 1, 59, centerZ - 3, 4, 3, 4, neonYellow);

        // Tesla "T" accent on upper tower (red logo block)
        ctx.createVoxel(centerX - 1, 38, centerZ - 3 + 4.5, 2, 8, 0.8, teslaRed);

        // ============================================
        // CYBERTRUCK SHOWROOM - The star of the block!
        // ============================================
        // Display platform (raised stage with neon)
        const displayPlatform = ctx.createVoxel(centerX + 10, 1.8, centerZ + 5, 12, 1.2, 14, metalDark);
        ctx.collidables.push(new THREE.Box3().setFromObject(displayPlatform));

        // Neon underglow on platform
        ctx.createVoxel(centerX + 10, 2.4, centerZ + 5, 13, 0.3, 15, neonCyan);

        // === CYBERTRUCK VOXEL MODEL ===
        const ctX = centerX + 10;
        const ctY = 3.2;
        const ctZ = centerZ + 5.5;

        // Main lower body (angular stainless steel look)
        const ctBody = ctx.createVoxel(ctX, ctY, ctZ, 5.5, 1.8, 11, metalSilver);
        ctx.collidables.push(new THREE.Box3().setFromObject(ctBody));

        // Cabin (tall angular greenhouse)
        const ctCabin = ctx.createVoxel(ctX, ctY + 2.2, ctZ + 1, 4.8, 2.8, 5.5, glassBlue);
        ctx.collidables.push(new THREE.Box3().setFromObject(ctCabin));

        // Front hood section (low and aggressive)
        const ctHood = ctx.createVoxel(ctX, ctY + 0.3, ctZ - 3.5, 5.2, 1.4, 3.5, metalSilver);
        ctx.collidables.push(new THREE.Box3().setFromObject(ctHood));

        // Rear bed (open cargo)
        const ctBed = ctx.createVoxel(ctX, ctY + 1.5, ctZ + 6, 5, 1.8, 4, cyberBlack);
        ctx.collidables.push(new THREE.Box3().setFromObject(ctBed));

        // Bed side rails
        ctx.createVoxel(ctX - 2.3, ctY + 2.8, ctZ + 6, 0.6, 1.2, 4, metalDark);
        ctx.createVoxel(ctX + 2.3, ctY + 2.8, ctZ + 6, 0.6, 1.2, 4, metalDark);

        // Windows (deep tint)
        ctx.createVoxel(ctX, ctY + 3.5, ctZ + 1.2, 4.2, 1.4, 4.8, new THREE.MeshLambertMaterial({ color: 0x112233 }));

        // Wheels (big off-road cyber wheels)
        const wheelMat = cyberBlack;
        // Front left
        ctx.createVoxel(ctX - 2.6, ctY - 0.3, ctZ - 2.5, 1.4, 1.6, 2.2, wheelMat);
        // Front right
        ctx.createVoxel(ctX + 2.6, ctY - 0.3, ctZ - 2.5, 1.4, 1.6, 2.2, wheelMat);
        // Rear left
        ctx.createVoxel(ctX - 2.6, ctY - 0.3, ctZ + 4.5, 1.4, 1.6, 2.2, wheelMat);
        // Rear right
        ctx.createVoxel(ctX + 2.6, ctY - 0.3, ctZ + 4.5, 1.4, 1.6, 2.2, wheelMat);

        // Headlights (aggressive LED bar)
        ctx.createVoxel(ctX - 1.8, ctY + 1.2, ctZ - 5.3, 1.2, 0.8, 0.4, neonYellow);
        ctx.createVoxel(ctX + 1.8, ctY + 1.2, ctZ - 5.3, 1.2, 0.8, 0.4, neonYellow);

        // Taillights (full width cyber red)
        ctx.createVoxel(ctX, ctY + 2.2, ctZ + 9.8, 4.5, 0.6, 0.3, teslaRed);

        // Cybertruck "CYBER" badge accent (small red block)
        ctx.createVoxel(ctX, ctY + 2.5, ctZ + 0.5, 2.5, 0.5, 0.3, teslaRed);

        // ============================================
        // SPOTLIGHTS for Cybertruck (dramatic lighting)
        // ============================================
        // Left spotlight pole
        ctx.createVoxel(centerX + 5, 6, centerZ + 1, 0.8, 10, 0.8, metalDark);
        ctx.createVoxel(centerX + 5, 11.5, centerZ + 1, 2, 1.5, 2, neonYellow); // light head

        // Right spotlight pole
        ctx.createVoxel(centerX + 15, 6, centerZ + 1, 0.8, 10, 0.8, metalDark);
        ctx.createVoxel(centerX + 15, 11.5, centerZ + 1, 2, 1.5, 2, neonYellow);

        // ============================================
        // BORING COMPANY TUNNEL ENTRANCE (Elon classic)
        // ============================================
        const tunnelX = centerX - 11;
        const tunnelZ = centerZ + 8;

        // Tunnel mouth frame (dark concrete)
        const tunnelFrame = ctx.createVoxel(tunnelX, 5, tunnelZ, 7, 7, 2, metalDark);
        ctx.collidables.push(new THREE.Box3().setFromObject(tunnelFrame));

        // Inner glowing tunnel (inviting portal to underground)
        ctx.createVoxel(tunnelX, 5, tunnelZ - 3, 5, 5, 4, new THREE.MeshLambertMaterial({ color: 0x112244 }));
        ctx.createVoxel(tunnelX, 5.5, tunnelZ - 5, 3.5, 4, 3, neonCyan); // deep glow

        // "Boring Co" accent sign (red bar)
        ctx.createVoxel(tunnelX, 9.5, tunnelZ + 1.2, 5, 0.8, 0.4, teslaRed);

        // ============================================
        // SPACEX STARSHIP MODEL (because Elon)
        // ============================================
        const rocketX = centerX - 10;
        const rocketZ = centerZ - 9;

        // Launch pad base
        const pad = ctx.createVoxel(rocketX, 1.5, rocketZ, 6, 1, 6, metalDark);
        ctx.collidables.push(new THREE.Box3().setFromObject(pad));

        // Rocket body (tall & sleek)
        const rocketBody = ctx.createVoxel(rocketX, 14, rocketZ, 3.5, 22, 3.5, rocketWhite);
        ctx.collidables.push(new THREE.Box3().setFromObject(rocketBody));

        // Nose cone (pointed top)
        ctx.createVoxel(rocketX, 26.5, rocketZ, 2.8, 4, 2.8, rocketWhite);
        ctx.createVoxel(rocketX, 29, rocketZ, 1.8, 3, 1.8, rocketWhite);

        // Engine section (dark base)
        ctx.createVoxel(rocketX, 3.5, rocketZ, 4, 2, 4, metalDark);

        // Fins (4 sides for stability)
        ctx.createVoxel(rocketX - 3, 6, rocketZ, 1.5, 5, 2, metalDark);
        ctx.createVoxel(rocketX + 3, 6, rocketZ, 1.5, 5, 2, metalDark);
        ctx.createVoxel(rocketX, 6, rocketZ - 3, 2, 5, 1.5, metalDark);
        ctx.createVoxel(rocketX, 6, rocketZ + 3, 2, 5, 1.5, metalDark);

        // Flame glow (static but dramatic)
        ctx.createVoxel(rocketX, 2.5, rocketZ, 2.5, 2, 2.5, flameOrange);

        // ============================================
        // SOLAR PANEL ARRAY (Tesla Energy)
        // ============================================
        const solarX = centerX + 8;
        const solarZ = centerZ - 10;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                const px = solarX + (col - 1.5) * 3.2;
                const pz = solarZ + (row - 1) * 3.5;
                // Tilted panel (approx with position + small height)
                ctx.createVoxel(px, 3.5 + row * 0.3, pz, 2.8, 0.4, 3, solarPanel);
            }
        }

        // ============================================
        // GROK 4.3 NEON SIGN - VERSÃO SIMPLES E LIMPA (funciona de verdade!)
        // ============================================
        const signX = centerX;
        const signZ = centerZ + 12;
        const signY = 8;

        // Backplate grande e clean
        const plate = ctx.createVoxel(signX, signY, signZ, 20, 5, 1.5, metalDark);
        ctx.collidables.push(new THREE.Box3().setFromObject(plate));

        // Borda neon cyan
        ctx.createVoxel(signX, signY, signZ + 0.8, 21, 0.4, 0.4, neonCyan);
        ctx.createVoxel(signX, signY + 4.6, signZ + 0.8, 21, 0.4, 0.4, neonCyan);
        ctx.createVoxel(signX - 10, signY, signZ + 0.8, 0.4, 5, 0.4, neonCyan);
        ctx.createVoxel(signX + 10, signY, signZ + 0.8, 0.4, 5, 0.4, neonCyan);

        // === TEXTO "GROK 4.3" - letras grandes e claras ===
        const textY = signY + 1.2;
        const textMat = neonYellow;
        const thick = 1.1;

        // G R O K   (linha principal - bem espaçado)
        let x = signX - 7.5;

        // G
        ctx.createVoxel(x, textY, signZ + 1, thick, 3.5, thick, textMat);
        ctx.createVoxel(x + 2.2, textY, signZ + 1, thick, 3.5, thick, textMat);
        ctx.createVoxel(x, textY + 2.4, signZ + 1, 3.3, thick, thick, textMat);
        ctx.createVoxel(x, textY, signZ + 1, 3.3, thick, thick, textMat);
        x += 4.5;

        // R
        ctx.createVoxel(x, textY, signZ + 1, thick, 3.5, thick, textMat);
        ctx.createVoxel(x + 2.2, textY + 1.8, signZ + 1, thick, 1.8, thick, textMat);
        ctx.createVoxel(x, textY + 2.4, signZ + 1, 3.3, thick, thick, textMat);
        ctx.createVoxel(x, textY + 1.1, signZ + 1, 3.3, thick, thick, textMat);
        x += 4.5;

        // O
        ctx.createVoxel(x, textY, signZ + 1, thick, 3.5, thick, textMat);
        ctx.createVoxel(x + 2.2, textY, signZ + 1, thick, 3.5, thick, textMat);
        ctx.createVoxel(x, textY + 2.4, signZ + 1, 3.3, thick, thick, textMat);
        ctx.createVoxel(x, textY, signZ + 1, 3.3, thick, thick, textMat);
        x += 4.8;

        // K
        ctx.createVoxel(x, textY, signZ + 1, thick, 3.5, thick, textMat);
        ctx.createVoxel(x + 1.1, textY + 1.6, signZ + 1, thick, 1.9, thick, textMat);
        ctx.createVoxel(x + 2.1, textY + 2.6, signZ + 1, thick, 1, thick, textMat);
        ctx.createVoxel(x + 2.1, textY, signZ + 1, thick, 1.4, thick, textMat);
        x += 5;

        // 4 . 3   (segunda linha, menor e centralizado)
        const numY = signY + 0.3;
        x = signX - 2.5;

        // 4
        ctx.createVoxel(x, numY, signZ + 1, thick, 2.2, thick, textMat);
        ctx.createVoxel(x + 1.8, numY, signZ + 1, thick, 2.8, thick, textMat);
        ctx.createVoxel(x, numY + 1.1, signZ + 1, 2.9, thick, thick, textMat);
        x += 4;

        // .
        ctx.createVoxel(x + 0.6, numY + 0.3, signZ + 1, 0.9, 0.9, 0.9, textMat);
        x += 2.2;

        // 3
        ctx.createVoxel(x, numY + 2.2, signZ + 1, 2.6, thick, thick, textMat);
        ctx.createVoxel(x + 1.8, numY + 1.2, signZ + 1, thick, 1.2, thick, textMat);
        ctx.createVoxel(x, numY + 1, signZ + 1, 2.6, thick, thick, textMat);
        ctx.createVoxel(x, numY, signZ + 1, 2.6, thick, thick, textMat);

        // ============================================
        // EXTRA DETAILS - Antennas & lights
        // ============================================
        // Roof antennas on tower
        ctx.createVoxel(centerX - 1, 57, centerZ - 6, 0.6, 6, 0.6, metalDark);
        ctx.createVoxel(centerX - 1, 57, centerZ + 0, 0.6, 6, 0.6, metalDark);
        ctx.createVoxel(centerX - 1, 57, centerZ + 6, 0.6, 6, 0.6, metalDark);

        // Glowing orbs on antennas (Starlink vibe)
        ctx.createVoxel(centerX - 1, 61, centerZ - 6, 1.2, 1.2, 1.2, neonCyan);
        ctx.createVoxel(centerX - 1, 61, centerZ + 0, 1.2, 1.2, 1.2, neonCyan);
        ctx.createVoxel(centerX - 1, 61, centerZ + 6, 1.2, 1.2, 1.2, neonCyan);

        // Small accent lights around the block
        ctx.createVoxel(centerX + 13, 2, centerZ - 12, 0.8, 3, 0.8, neonYellow);
        ctx.createVoxel(centerX - 13, 2, centerZ + 12, 0.8, 3, 0.8, neonPink);

        // ============================================
        // FINAL TOUCHES
        // ============================================
        // Add main structures to buildings array for minimap (if supported)
        ctx.buildings = ctx.buildings || [];
        ctx.buildings.push({
            x: centerX,
            z: centerZ,
            type: 'tower',
            label: 'CyberX Hub'
        });
        ctx.buildings.push({
            x: ctX,
            z: ctZ,
            type: 'vehicle',
            label: 'Cybertruck'
        });

        // Easter egg: tiny Grok/xAI node (because 2026 and Grok!)
        ctx.createVoxel(centerX - 3, 8, centerZ + 10, 1.5, 1.5, 1.5, new THREE.MeshLambertMaterial({ color: 0x00ffaa }));
    };
})();