(function () {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['4_4'] = function (ctx) {
        const THREE = ctx.THREE;
        const cx = ctx.centerX;
        const cz = ctx.centerZ;

        const matPlaza = new THREE.MeshLambertMaterial({ color: 0xe6dccb });
        const matPodium = new THREE.MeshLambertMaterial({ color: 0xd3cdc4 });
        const matFloor = new THREE.MeshLambertMaterial({ color: 0xf3eee6 });
        const matStone = new THREE.MeshLambertMaterial({ color: 0xb8b1a7 });
        const matMetal = new THREE.MeshLambertMaterial({ color: 0xc6ced8 });
        const matMetalDark = new THREE.MeshLambertMaterial({ color: 0x6f7681 });
        const matFin = new THREE.MeshLambertMaterial({ color: 0x9aa5b6 });
        const matGlass = new THREE.MeshLambertMaterial({ color: 0x8ec4ff, transparent: true, opacity: 0.38 });
        const matGlassDark = new THREE.MeshLambertMaterial({ color: 0x5b7ba8, transparent: true, opacity: 0.56 });
        const matWater = new THREE.MeshLambertMaterial({ color: 0x4db7ff, transparent: true, opacity: 0.8 });
        const matPalmLeaf = new THREE.MeshLambertMaterial({ color: 0x2f8c48 });
        const matPalmTrunk = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
        const matWood = new THREE.MeshLambertMaterial({ color: 0x8f6846 });
        const matWarmLight = new THREE.MeshBasicMaterial({ color: 0xffefc1 });
        const matBand = new THREE.MeshBasicMaterial({ color: 0xdceeff });

        function addCollidable(mesh) {
            ctx.collidables.push(new THREE.Box3().setFromObject(mesh));
            return mesh;
        }

        function createBlock(lx, y, lz, w, h, d, material, collide = true) {
            const mesh = ctx.createVoxel(cx + lx, y, cz + lz, w, h, d, material);
            if (collide) addCollidable(mesh);
            return mesh;
        }

        function createBand(y, width, depth) {
            createBlock(0, y, depth / 2, width, 0.12, 0.18, matBand, false);
            createBlock(0, y, -depth / 2, width, 0.12, 0.18, matBand, false);
            createBlock(width / 2, y, 0, 0.18, 0.12, depth, matBand, false);
            createBlock(-width / 2, y, 0, 0.18, 0.12, depth, matBand, false);
        }

        function createStraightStair(startX, startY, startZ, dirX, dirZ, steps, stepW, stepH, stepD, material) {
            for (let i = 0; i < steps; i++) {
                const lx = startX + dirX * i * stepD;
                const lz = startZ + dirZ * i * stepD;
                const width = dirX !== 0 ? stepD : stepW;
                const depth = dirZ !== 0 ? stepD : stepW;
                createBlock(lx, startY + i * stepH, lz, width, stepH, depth, material, true);
            }
        }

        function createPalm(lx, lz) {
            const trunk = createBlock(lx, 2.0, lz, 0.7, 3.0, 0.7, matPalmTrunk, true);
            trunk.rotation.y = Math.PI / 8;

            const leafOffsets = [
                [0, 4.2, 0],
                [0.9, 3.9, 0],
                [-0.9, 3.9, 0],
                [0, 3.9, 0.9],
                [0, 3.9, -0.9]
            ];

            leafOffsets.forEach(([ox, oy, oz]) => {
                createBlock(lx + ox, oy, lz + oz, 2.8, 0.45, 1.2, matPalmLeaf, false);
            });
        }

        function createBench(lx, lz, rotate = false) {
            if (rotate) {
                createBlock(lx, 1.05, lz, 1.0, 0.35, 3.0, matWood, true);
                createBlock(lx - 0.35, 1.55, lz, 0.3, 0.8, 3.0, matWood, true);
                return;
            }

            createBlock(lx, 1.05, lz, 3.0, 0.35, 1.0, matWood, true);
            createBlock(lx, 1.55, lz - 0.35, 3.0, 0.8, 0.3, matWood, true);
        }

        function createTelescope(lx, lz) {
            createBlock(lx, 15.0, lz, 0.35, 1.2, 0.35, matMetalDark, true);
            const viewer = createBlock(lx, 15.7, lz - 0.2, 0.5, 0.25, 1.1, matMetal, false);
            viewer.rotation.x = -0.25;
        }

        function createSign() {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 192;
            const c2 = canvas.getContext('2d');

            c2.fillStyle = '#10161d';
            c2.fillRect(0, 0, 512, 192);
            c2.strokeStyle = '#d4b86a';
            c2.lineWidth = 10;
            c2.strokeRect(10, 10, 492, 172);
            c2.fillStyle = '#f6e4a7';
            c2.font = 'bold 56px Arial';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            c2.fillText('BURJ KHALIFA', 256, 78);
            c2.font = 'bold 34px Arial';
            c2.fillStyle = '#d7e6ff';
            c2.fillText('Tour Route  At the Top', 256, 132);

            const signMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) });
            createBlock(-10.8, 1.8, 11.95, 0.22, 2.8, 0.22, matMetalDark, true);
            createBlock(-6.9, 1.8, 11.95, 0.22, 2.8, 0.22, matMetalDark, true);
            createBlock(-8.85, 3.5, 12.25, 5.2, 1.8, 0.18, signMat, true);
        }

        function createInteriorSign() {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 192;
            const c2 = canvas.getContext('2d');

            c2.fillStyle = '#0f1720';
            c2.fillRect(0, 0, 512, 192);
            c2.strokeStyle = '#6fd3ff';
            c2.lineWidth = 8;
            c2.strokeRect(10, 10, 492, 172);
            c2.fillStyle = '#eef7ff';
            c2.font = 'bold 76px Arial';
            c2.textAlign = 'center';
            c2.textBaseline = 'middle';
            c2.fillText('GPT 5.4', 256, 98);

            const signMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) });
            createBlock(0, 3.1, -7.15, 3.8, 1.4, 0.12, signMat, false);
            createBlock(0, 3.1, -7.28, 4.2, 1.8, 0.08, matMetalDark, false);
        }

        // Plaza and arrival court
        createBlock(0, 0.05, 0, 29.5, 0.1, 29.5, matPlaza, false);
        createBlock(0, 0.35, 0, 26.0, 0.7, 26.0, matPodium, true);
        createBlock(0, 0.76, 0, 23.4, 0.08, 23.4, matFloor, false);

        for (let i = 0; i < 4; i++) {
            createBlock(0, 0.09 + (i * 0.18), 13.1 - (i * 1.1), 9.5 + (i * 1.4), 0.18, 1.15, matStone, true);
        }

        const poolCenters = [-8.1, 8.1];
        poolCenters.forEach((px) => {
            createBlock(px, 0.82, 8.5, 5.6, 0.18, 6.2, matWater, false);
            createBlock(px, 0.9, 11.7, 6.4, 0.22, 0.3, matStone, false);
            createBlock(px, 0.9, 5.3, 6.4, 0.22, 0.3, matStone, false);
            createBlock(px - 3.2, 0.9, 8.5, 0.3, 0.22, 6.0, matStone, false);
            createBlock(px + 3.2, 0.9, 8.5, 0.3, 0.22, 6.0, matStone, false);
        });

        createBench(-11.2, -9.0);
        createBench(11.2, -9.0);
        createBench(-11.0, 0.0, true);
        createBench(11.0, 0.0, true);

        createPalm(-10.5, 10.2);
        createPalm(10.5, 10.2);
        createPalm(-10.7, -9.2);
        createPalm(10.7, -9.2);

        createSign();

        // Lobby shell
        createBlock(0, 0.8, 0, 15.2, 0.12, 17.0, matFloor, false);
        createBlock(0, 4.95, 10.1, 9.2, 0.3, 4.2, matMetal, true);
        createBlock(-4.8, 2.8, 10.1, 0.35, 4.0, 4.0, matMetalDark, true);
        createBlock(4.8, 2.8, 10.1, 0.35, 4.0, 4.0, matMetalDark, true);
        createBlock(0, 4.95, 11.8, 7.6, 0.22, 0.5, matWarmLight, false);

        createBlock(-4.2, 3.75, 7.4, 4.4, 6.1, 0.4, matGlass, true);
        createBlock(4.2, 3.75, 7.4, 4.4, 6.1, 0.4, matGlass, true);
        createBlock(0, 5.55, 7.4, 4.0, 2.5, 0.4, matGlass, true);
        createBlock(-7.4, 3.75, 0, 0.4, 6.1, 14.8, matGlass, true);
        createBlock(7.4, 3.75, 0, 0.4, 6.1, 14.8, matGlass, true);
        createBlock(0, 3.75, -7.4, 14.4, 6.1, 0.4, matGlass, true);

        createBlock(-1.15, 2.45, 7.26, 1.2, 3.5, 0.15, matGlassDark, false);
        createBlock(1.15, 2.45, 7.26, 1.2, 3.5, 0.15, matGlassDark, false);

        [-6.8, 6.8].forEach((x) => {
            [-6.8, 6.8].forEach((z) => {
                createBlock(x, 3.75, z, 0.8, 6.1, 0.8, matMetalDark, true);
            });
        });

        [-5.0, -2.5, 0, 2.5, 5.0].forEach((x) => {
            createBlock(x, 3.75, 7.25, 0.12, 6.0, 0.12, matFin, false);
            createBlock(x, 3.75, -7.25, 0.12, 6.0, 0.12, matFin, false);
        });

        [-4.5, 0, 4.5].forEach((z) => {
            createBlock(-7.25, 3.75, z, 0.12, 6.0, 0.12, matFin, false);
            createBlock(7.25, 3.75, z, 0.12, 6.0, 0.12, matFin, false);
        });

        // Lobby details
        createBlock(-4.3, 1.25, 4.1, 3.3, 1.0, 1.4, matStone, true);
        createBlock(-4.3, 1.85, 3.35, 3.3, 0.22, 0.3, matWarmLight, false);
        createBlock(4.1, 1.15, 3.2, 3.0, 0.85, 1.0, matMetalDark, true);
        createBlock(4.1, 1.15, 5.1, 3.0, 0.85, 1.0, matMetalDark, true);
        createBlock(0, 1.1, -1.2, 2.8, 0.7, 2.8, matStone, true);
        createBlock(0, 2.15, -1.2, 0.9, 1.7, 0.9, matMetal, false);
        createBlock(4.5, 1.05, -3.8, 3.0, 0.35, 1.0, matWood, true);
        createBlock(4.5, 1.55, -4.1, 3.0, 0.8, 0.25, matWood, true);
        createBlock(-2.0, 6.3, -5.2, 2.0, 0.18, 2.0, matWarmLight, false);
        createBlock(2.0, 6.3, -5.2, 2.0, 0.18, 2.0, matWarmLight, false);
        createInteriorSign();

        // Tourist circulation
        createStraightStair(-4.7, 0.95, 5.6, 0, -1, 11, 3.4, 0.4, 0.95, matStone);
        createBlock(1.9, 5.15, -1.1, 9.8, 0.3, 11.4, matFloor, true);
        createBlock(-5.2, 5.15, -4.3, 2.0, 0.3, 3.2, matFloor, true);
        createBlock(-3.6, 5.15, -4.8, 1.2, 0.3, 2.2, matFloor, true);
        createBlock(-5.2, 5.85, 3.1, 3.2, 1.0, 1.2, matStone, true);
        createBlock(4.6, 5.9, 1.6, 2.2, 0.9, 2.2, matStone, true);
        createBlock(0, 6.35, 0.0, 2.2, 0.2, 2.2, matWarmLight, false);

        createStraightStair(4.5, 5.45, -4.2, 0, 1, 11, 2.8, 0.4, 0.85, matStone);

        // Observation gallery
        createBlock(-1.25, 9.55, 0, 8.4, 0.3, 10.8, matFloor, true);
        createBlock(3.65, 9.8, 4.1, 1.8, 0.2, 2.6, matFloor, true);
        createBlock(0, 11.85, 5.25, 10.8, 4.4, 0.35, matGlass, true);
        createBlock(0, 11.85, -5.25, 10.8, 4.4, 0.35, matGlass, true);
        createBlock(-5.25, 11.85, 0, 0.35, 4.4, 10.8, matGlass, true);
        createBlock(5.25, 11.85, 0, 0.35, 4.4, 10.8, matGlass, true);

        [-3.5, 0, 3.5].forEach((x) => {
            createBlock(x, 11.85, 5.1, 0.12, 4.2, 0.12, matFin, false);
            createBlock(x, 11.85, -5.1, 0.12, 4.2, 0.12, matFin, false);
        });

        [-3.5, 0, 3.5].forEach((z) => {
            createBlock(-5.1, 11.85, z, 0.12, 4.2, 0.12, matFin, false);
            createBlock(5.1, 11.85, z, 0.12, 4.2, 0.12, matFin, false);
        });

        createBlock(-2.8, 10.15, -2.5, 2.0, 0.7, 1.2, matStone, true);
        createBlock(2.8, 10.15, -2.5, 2.0, 0.7, 1.2, matStone, true);
        createBlock(0, 13.75, 0.0, 2.0, 0.18, 2.0, matWarmLight, false);

        createStraightStair(-3.6, 9.95, 3.8, 1, 0, 11, 2.4, 0.4, 0.7, matStone);

        // Rooftop terrace
        createBlock(0, 14.25, -2.0, 12.0, 0.3, 8.0, matFloor, true);
        createBlock(-5.0, 14.25, 4.0, 2.0, 0.3, 4.0, matFloor, true);
        createBlock(4.8, 14.25, 4.0, 2.0, 0.3, 2.8, matFloor, true);

        createBlock(-5.0, 14.95, 6.0, 2.0, 0.9, 0.35, matGlassDark, true);
        createBlock(-6.0, 14.95, 0, 0.35, 0.9, 12.0, matGlassDark, true);
        createBlock(0, 14.95, -6.0, 12.0, 0.9, 0.35, matGlassDark, true);
        createBlock(6.0, 14.95, -2.0, 0.35, 0.9, 8.0, matGlassDark, true);
        createBlock(4.8, 14.95, 5.35, 2.0, 0.9, 0.25, matGlassDark, true);
        createBlock(5.8, 14.95, 4.0, 0.25, 0.9, 2.8, matGlassDark, true);

        createTelescope(-4.4, -4.0);
        createTelescope(-4.4, 3.8);
        createTelescope(4.2, -4.0);

        // Lower tower with Burj-like setbacks
        createBlock(0, 21.0, 0, 7.6, 8.4, 7.6, matGlassDark, true);
        createBlock(0, 18.9, 4.4, 5.6, 4.2, 2.8, matMetal, true);
        createBlock(-4.4, 19.8, -0.3, 2.8, 6.0, 5.8, matMetal, true);
        createBlock(4.4, 18.2, -0.3, 2.8, 2.8, 5.8, matMetal, true);
        createBand(16.0, 7.9, 7.9);
        createBand(18.6, 7.9, 7.9);
        createBand(21.2, 7.9, 7.9);
        createBand(23.8, 7.9, 7.9);

        createBlock(0, 29.5, 0, 5.4, 8.6, 5.4, matGlassDark, true);
        createBlock(-2.9, 27.2, -0.2, 1.7, 4.0, 3.7, matMetal, true);
        createBand(27.0, 5.7, 5.7);
        createBand(29.4, 5.7, 5.7);
        createBand(31.8, 5.7, 5.7);

        createBlock(0, 37.1, 0, 4.0, 6.6, 4.0, matMetal, true);
        createBlock(0, 43.9, 0, 2.8, 7.0, 2.8, matFin, true);
        createBlock(0, 50.9, 0, 1.9, 7.0, 1.9, matFin, true);
        createBlock(0, 58.2, 0, 1.1, 7.6, 1.1, matMetalDark, true);
        createBlock(0, 63.2, 0, 0.35, 2.0, 0.35, matWarmLight, false);

        [-2.5, 0, 2.5].forEach((x) => {
            createBlock(x, 31.5, 2.7, 0.16, 17.0, 0.16, matBand, false);
            createBlock(x, 31.5, -2.7, 0.16, 17.0, 0.16, matBand, false);
        });

        [-2.5, 2.5].forEach((z) => {
            createBlock(2.7, 31.5, z, 0.16, 17.0, 0.16, matBand, false);
            createBlock(-2.7, 31.5, z, 0.16, 17.0, 0.16, matBand, false);
        });

        if (ctx.buildings) {
            ctx.buildings.push({
                name: 'Burj Khalifa',
                x: cx,
                z: cz,
                width: 20,
                depth: 20,
                type: 'landmark'
            });
        }
    };
})();
