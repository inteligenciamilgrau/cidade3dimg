// blocks/block_4_5.js
(function () {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['4_5'] = function (ctx) {
        const THREE = ctx.THREE;
        const cx = ctx.centerX;
        const cz = ctx.centerZ;
        const parent = ctx.parent || ctx.scene;

        const matVoid = new THREE.MeshLambertMaterial({ color: 0x111826 });
        const matVoidDark = new THREE.MeshLambertMaterial({ color: 0x070b12 });
        const matObsidian = new THREE.MeshLambertMaterial({ color: 0x172033 });
        const matBasalt = new THREE.MeshLambertMaterial({ color: 0x263143 });
        const matPearl = new THREE.MeshLambertMaterial({ color: 0xe9eef2 });
        const matMoon = new THREE.MeshLambertMaterial({ color: 0xb9c4d6 });
        const matGold = new THREE.MeshLambertMaterial({ color: 0xd8a83a });
        const matGoldDark = new THREE.MeshLambertMaterial({ color: 0x8d6720 });
        const matCopper = new THREE.MeshLambertMaterial({ color: 0xb97843 });
        const matGlass = new THREE.MeshLambertMaterial({ color: 0x7ddcff, transparent: true, opacity: 0.34 });
        const matGlassDeep = new THREE.MeshLambertMaterial({ color: 0x2c7da0, transparent: true, opacity: 0.46 });
        const matVioletGlass = new THREE.MeshLambertMaterial({ color: 0xb794f6, transparent: true, opacity: 0.35 });
        const matWater = new THREE.MeshLambertMaterial({ color: 0x12b8d6, transparent: true, opacity: 0.72 });
        const matGrass = new THREE.MeshLambertMaterial({ color: 0x2d7a4b });
        const matLeaf = new THREE.MeshLambertMaterial({ color: 0x39b563 });
        const matTrunk = new THREE.MeshLambertMaterial({ color: 0x6f4a2d });
        const matWarm = new THREE.MeshBasicMaterial({ color: 0xffd27d });
        const matCyan = new THREE.MeshBasicMaterial({ color: 0x2efcff });
        const matBlue = new THREE.MeshBasicMaterial({ color: 0x4d8dff });
        const matMagenta = new THREE.MeshBasicMaterial({ color: 0xff4fd8 });
        const matViolet = new THREE.MeshBasicMaterial({ color: 0x9d7cff });
        const matWhiteGlow = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const matAmberGlow = new THREE.MeshBasicMaterial({ color: 0xffb02e });

        function addCollidable(mesh) {
            mesh.updateMatrixWorld();
            ctx.collidables.push(new THREE.Box3().setFromObject(mesh));
            return mesh;
        }

        function box(lx, y, lz, w, h, d, material, collide = false) {
            const mesh = ctx.createVoxel(cx + lx, y, cz + lz, w, h, d, material, true, true);
            if (collide) addCollidable(mesh);
            return mesh;
        }

        function rbox(lx, y, lz, w, h, d, material, rotY, collide = false) {
            const mesh = box(lx, y, lz, w, h, d, material, false);
            mesh.rotation.y = rotY;
            if (collide) addCollidable(mesh);
            return mesh;
        }

        function addMesh(mesh, lx, y, lz, collide = false) {
            mesh.position.set(cx + lx, y, cz + lz);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            parent.add(mesh);
            if (collide) addCollidable(mesh);
            return mesh;
        }

        function cylinder(lx, y, lz, topRadius, bottomRadius, height, material, segments = 16, collide = false) {
            const mesh = new THREE.Mesh(
                new THREE.CylinderGeometry(topRadius, bottomRadius, height, segments),
                material
            );
            return addMesh(mesh, lx, y, lz, collide);
        }

        function sphere(lx, y, lz, radius, material, segments = 16) {
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, Math.max(8, segments / 2)), material);
            return addMesh(mesh, lx, y, lz, false);
        }

        function drawFittedText(ctx2d, text, x, y, maxWidth, startSize, color, style = 'bold') {
            let size = startSize;
            ctx2d.fillStyle = color;
            ctx2d.textAlign = 'center';
            ctx2d.textBaseline = 'middle';
            ctx2d.font = style + ' ' + size + 'px Arial';
            while (ctx2d.measureText(text).width > maxWidth && size > 12) {
                size -= 2;
                ctx2d.font = style + ' ' + size + 'px Arial';
            }
            ctx2d.fillText(text, x, y);
        }

        function makePanelTexture(title, subtitle, accent) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 192;
            const c2 = canvas.getContext('2d');
            const grd = c2.createLinearGradient(0, 0, 512, 192);
            grd.addColorStop(0, '#070b12');
            grd.addColorStop(0.55, '#142132');
            grd.addColorStop(1, '#03050a');
            c2.fillStyle = grd;
            c2.fillRect(0, 0, 512, 192);
            c2.strokeStyle = accent;
            c2.lineWidth = 9;
            c2.strokeRect(10, 10, 492, 172);
            c2.strokeStyle = '#ffffff';
            c2.globalAlpha = 0.22;
            c2.lineWidth = 2;
            for (let x = 32; x < 512; x += 48) {
                c2.beginPath();
                c2.moveTo(x, 24);
                c2.lineTo(x + 70, 168);
                c2.stroke();
            }
            c2.globalAlpha = 1;
            drawFittedText(c2, title, 256, 76, 450, 46, '#ffffff');
            drawFittedText(c2, subtitle, 256, 126, 450, 30, accent);
            return new THREE.CanvasTexture(canvas);
        }

        function labelPanel(lx, y, lz, width, height, title, subtitle, accent, rotY = 0, collide = true) {
            const panelMat = new THREE.MeshBasicMaterial({
                map: makePanelTexture(title, subtitle, accent)
            });
            const frame = rbox(lx, y, lz, width + 0.35, height + 0.35, 0.16, matVoidDark, rotY, collide);
            const panel = rbox(lx, y, lz + Math.cos(rotY) * 0.09, width, height, 0.06, panelMat, rotY, false);
            panel.position.x += Math.sin(rotY) * 0.09;
            return frame;
        }

        function renderSignaturePlate(monumentName, aiModel) {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 256;
            const c2 = canvas.getContext('2d');

            const grd = c2.createLinearGradient(0, 0, 1024, 256);
            grd.addColorStop(0, '#05070d');
            grd.addColorStop(0.5, '#13283a');
            grd.addColorStop(1, '#05070d');
            c2.fillStyle = grd;
            c2.fillRect(0, 0, 1024, 256);

            c2.strokeStyle = '#2efcff';
            c2.lineWidth = 10;
            c2.strokeRect(7, 7, 1010, 242);
            c2.strokeStyle = '#d8a83a';
            c2.lineWidth = 4;
            c2.strokeRect(28, 28, 968, 200);

            c2.fillStyle = '#2efcff';
            for (let i = 0; i < 24; i++) {
                const x = 55 + i * 40;
                c2.globalAlpha = i % 2 ? 0.55 : 0.25;
                c2.fillRect(x, 32, 3, 192);
            }
            c2.globalAlpha = 1;

            drawFittedText(c2, monumentName, 512, 88, 900, 78, '#ffffff');
            drawFittedText(c2, aiModel, 512, 168, 900, 48, '#2efcff');

            const signMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) });
            box(-12.8, 2.4, 13.65, 0.38, 4.8, 0.38, matGoldDark, true);
            box(0.8, 2.4, 13.65, 0.38, 4.8, 0.38, matGoldDark, true);
            box(-6, 4.85, 13.65, 14.4, 3.15, 0.22, matVoidDark, true);
            box(-6, 4.85, 13.8, 14.0, 2.85, 0.05, signMat, false);
            box(-6, 6.6, 13.62, 15.0, 0.18, 0.34, matCyan, false);
            box(-6, 3.1, 13.62, 15.0, 0.18, 0.34, matGold, false);
        }

        function createTree(lx, lz, scale = 1) {
            box(lx, 1.2 * scale, lz, 0.45 * scale, 2.4 * scale, 0.45 * scale, matTrunk, true);
            box(lx, 2.75 * scale, lz, 2.1 * scale, 1.35 * scale, 2.1 * scale, matLeaf, false);
            box(lx + 0.7 * scale, 3.35 * scale, lz, 1.5 * scale, 1.0 * scale, 1.5 * scale, matLeaf, false);
            box(lx - 0.7 * scale, 3.35 * scale, lz, 1.5 * scale, 1.0 * scale, 1.5 * scale, matLeaf, false);
            box(lx, 3.55 * scale, lz + 0.7 * scale, 1.5 * scale, 0.9 * scale, 1.5 * scale, matLeaf, false);
        }

        function createBench(lx, lz, rotY = 0) {
            rbox(lx, 0.95, lz, 3.2, 0.32, 0.9, matCopper, rotY, true);
            rbox(lx, 1.48, lz - Math.cos(rotY) * 0.34, 3.2, 0.75, 0.24, matCopper, rotY, true);
            rbox(lx - Math.cos(rotY) * 1.3, 0.55, lz + Math.sin(rotY) * 1.3, 0.26, 0.65, 0.26, matGoldDark, rotY, true);
            rbox(lx + Math.cos(rotY) * 1.3, 0.55, lz - Math.sin(rotY) * 1.3, 0.26, 0.65, 0.26, matGoldDark, rotY, true);
        }

        function createConsole(lx, lz, rotY, title, color) {
            rbox(lx, 1.1, lz, 2.0, 0.8, 1.0, matBasalt, rotY, true);
            const screenMat = new THREE.MeshBasicMaterial({ map: makePanelTexture(title, 'LIVE ORBIT', color) });
            const screen = rbox(lx, 1.75, lz - Math.cos(rotY) * 0.56, 1.7, 0.85, 0.05, screenMat, rotY, false);
            screen.rotation.x = -0.16;
        }

        function createStairHelix(radius, steps, startY, stepY, startAngle, angularStep) {
            for (let i = 0; i < steps; i++) {
                const angle = startAngle + i * angularStep;
                const lx = Math.cos(angle) * radius;
                const lz = Math.sin(angle) * radius;
                const stair = rbox(lx, startY + i * stepY, lz, 1.75, 0.24, 1.0, i % 2 ? matMoon : matPearl, -angle, true);
                stair.userData.maquinaStep = true;

                if (i % 2 === 0) {
                    const railX = Math.cos(angle) * (radius + 0.82);
                    const railZ = Math.sin(angle) * (radius + 0.82);
                    box(railX, startY + i * stepY + 0.75, railZ, 0.18, 1.1, 0.18, matGold, false);
                    rbox(railX, startY + i * stepY + 1.28, railZ, 1.0, 0.14, 0.14, matCyan, -angle, false);
                }
            }
        }

        function createStarburst(y, radius, material) {
            for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2;
                rbox(Math.cos(angle) * radius * 0.52, y, Math.sin(angle) * radius * 0.52,
                    radius, 0.12, 0.12, material, -angle, false);
            }
        }

        // Ground, reflecting pools and celestial floor.
        box(0, 0.03, 0, 29.5, 0.06, 29.5, matVoid, false);
        box(0, 0.08, 0, 26.5, 0.08, 26.5, matObsidian, false);
        box(0, 0.2, 0, 24.0, 0.4, 24.0, matBasalt, true);
        cylinder(0, 0.48, 0, 10.6, 11.2, 0.28, matVoidDark, 32, true);
        cylinder(0, 0.66, 0, 9.3, 9.8, 0.18, matPearl, 32, false);
        cylinder(0, 0.8, 0, 7.65, 8.15, 0.18, matObsidian, 32, true);

        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            rbox(Math.cos(angle) * 5.9, 0.96, Math.sin(angle) * 5.9, 2.6, 0.06, 0.08, i % 2 ? matCyan : matGold, -angle, false);
        }

        for (let i = 0; i < 4; i++) {
            box(0, 0.12 + i * 0.14, 14.0 - i * 0.86, 12.5 - i * 0.8, 0.22, 0.72, i % 2 ? matMoon : matPearl, true);
        }

        const poolData = [
            [-10.0, -9.9], [10.0, -9.9], [-10.0, 8.8], [10.0, 8.8]
        ];
        poolData.forEach(([px, pz], idx) => {
            box(px, 0.74, pz, 5.4, 0.16, 4.2, matWater, false);
            box(px, 0.86, pz - 2.18, 5.8, 0.18, 0.18, matCyan, false);
            box(px, 0.86, pz + 2.18, 5.8, 0.18, 0.18, matCyan, false);
            box(px - 2.9, 0.86, pz, 0.18, 0.18, 4.4, matCyan, false);
            box(px + 2.9, 0.86, pz, 0.18, 0.18, 4.4, matCyan, false);
            if (idx < 2) createBench(px, pz + 3.4, 0);
        });

        for (let i = 0; i < 14; i++) {
            const angle = (i / 14) * Math.PI * 2;
            rbox(Math.cos(angle) * 7.0, 1.05, Math.sin(angle) * 7.0, 0.36, 0.7, 0.36, i % 2 ? matGold : matCyan, -angle, false);
        }

        createTree(-13.0, -12.2, 0.9);
        createTree(13.0, -12.2, 0.9);
        createTree(-13.0, 11.5, 0.9);
        createTree(13.0, 11.5, 0.9);

        // Lower observatory hall.
        box(0, 1.05, 0, 13.8, 0.34, 13.8, matMoon, true);
        box(0, 1.32, 0, 12.8, 0.16, 12.8, matVoidDark, false);

        [-5.8, 5.8].forEach((x) => {
            [-5.8, 5.8].forEach((z) => {
                box(x, 3.0, z, 0.7, 3.7, 0.7, matGoldDark, true);
                box(x, 5.1, z, 1.05, 0.45, 1.05, matGold, true);
            });
        });

        box(0, 3.4, -6.4, 12.6, 4.1, 0.36, matGlassDeep, true);
        box(-6.4, 3.4, 0, 0.36, 4.1, 12.6, matGlassDeep, true);
        box(6.4, 3.4, 0, 0.36, 4.1, 12.6, matGlassDeep, true);
        box(-4.3, 3.4, 6.4, 4.4, 4.1, 0.36, matGlassDeep, true);
        box(4.3, 3.4, 6.4, 4.4, 4.1, 0.36, matGlassDeep, true);
        box(0, 5.62, 0, 13.6, 0.34, 13.6, matObsidian, true);
        box(0, 5.85, 0, 11.5, 0.12, 11.5, matCyan, false);

        box(-1.15, 2.65, 6.23, 1.1, 2.5, 0.12, matGlass, false);
        box(1.15, 2.65, 6.23, 1.1, 2.5, 0.12, matGlass, false);
        box(0, 4.5, 6.25, 3.6, 0.35, 0.18, matGold, true);
        box(0, 5.1, 6.05, 4.8, 0.16, 0.2, matWarm, false);

        createConsole(-3.8, 3.3, Math.PI, 'SOLAR MAP', '#2efcff');
        createConsole(3.8, 3.3, Math.PI, 'CITY GRID', '#ff4fd8');
        createConsole(-3.8, -3.2, 0, 'DEEP SKY', '#d8a83a');
        createConsole(3.8, -3.2, 0, 'AI HEART', '#9d7cff');
        box(0, 1.78, -3.8, 2.8, 0.56, 1.0, matGoldDark, true);
        box(0, 2.32, -3.8, 2.1, 0.22, 0.8, matCyan, false);
        sphere(0, 2.95, -3.8, 0.62, matWhiteGlow, 16);

        // Central spine, stairs and upper decks.
        box(0, 6.1, 0, 2.25, 9.6, 2.25, matVoidDark, true);
        box(0, 6.1, 0, 1.18, 10.0, 1.18, matCyan, false);
        for (let y = 2.0; y <= 10.3; y += 1.05) {
            box(0, y, 1.22, 2.0, 0.08, 0.08, matGold, false);
            box(0, y, -1.22, 2.0, 0.08, 0.08, matGold, false);
            box(1.22, y, 0, 0.08, 0.08, 2.0, matGold, false);
            box(-1.22, y, 0, 0.08, 0.08, 2.0, matGold, false);
        }

        createStairHelix(4.2, 34, 1.35, 0.255, Math.PI * 0.18, Math.PI * 0.23);
        box(0, 9.88, 0, 13.4, 0.34, 13.4, matPearl, true);
        box(0, 10.11, 0, 11.8, 0.12, 11.8, matObsidian, false);

        box(0, 10.85, 6.55, 13.4, 1.1, 0.28, matGlass, true);
        box(0, 10.85, -6.55, 13.4, 1.1, 0.28, matGlass, true);
        box(6.55, 10.85, 0, 0.28, 1.1, 13.4, matGlass, true);
        box(-6.55, 10.85, 0, 0.28, 1.1, 13.4, matGlass, true);
        for (let i = -2; i <= 2; i++) {
            box(i * 2.35, 11.72, 6.56, 0.12, 0.9, 0.12, matGold, false);
            box(i * 2.35, 11.72, -6.56, 0.12, 0.9, 0.12, matGold, false);
            box(6.56, 11.72, i * 2.35, 0.12, 0.9, 0.12, matGold, false);
            box(-6.56, 11.72, i * 2.35, 0.12, 0.9, 0.12, matGold, false);
        }

        function telescope(lx, lz, rotY) {
            box(lx, 10.9, lz, 0.28, 1.1, 0.28, matGoldDark, true);
            const tube = rbox(lx, 11.55, lz, 0.42, 0.42, 1.7, matMoon, rotY, false);
            tube.rotation.x = -0.16;
            box(lx + Math.sin(rotY) * 0.85, 11.62, lz + Math.cos(rotY) * 0.85, 0.55, 0.55, 0.18, matGlass, false);
        }

        telescope(-4.5, 4.8, -Math.PI * 0.25);
        telescope(4.5, 4.8, Math.PI * 0.25);
        telescope(-4.5, -4.8, -Math.PI * 0.75);
        telescope(4.5, -4.8, Math.PI * 0.75);

        // Crystal tower and buttresses.
        for (let i = 0; i < 8; i++) {
            const y = 12.5 + i * 2.35;
            const s = 5.8 - i * 0.42;
            const mat = i % 2 ? matVioletGlass : matGlassDeep;
            const crystal = cylinder(0, y, 0, Math.max(1.1, s * 0.28), Math.max(1.8, s * 0.44), 2.55, mat, 4, i < 4);
            crystal.rotation.y = Math.PI / 4 + i * 0.12;
        }

        box(0, 22.2, 0, 1.1, 23.0, 1.1, matGoldDark, true);
        for (let i = 0; i < 4; i++) {
            const angle = Math.PI / 4 + i * Math.PI / 2;
            const sx = Math.cos(angle);
            const sz = Math.sin(angle);
            const buttress = rbox(sx * 4.9, 15.8, sz * 4.9, 0.55, 12.0, 0.55, matObsidian, -angle, true);
            buttress.rotation.z = sx * 0.16;
            box(sx * 5.4, 21.9, sz * 5.4, 0.34, 9.6, 0.34, matCyan, false);
        }

        for (let y = 13.8; y <= 29.5; y += 3.2) {
            createStarburst(y, 7.4 - (y - 13.8) * 0.09, y % 2 ? matBlue : matMagenta);
        }

        cylinder(0, 31.8, 0, 2.0, 3.2, 4.8, matVioletGlass, 6, true);
        cylinder(0, 35.2, 0, 0.9, 2.0, 2.4, matGlass, 6, true);
        box(0, 38.0, 0, 0.46, 5.2, 0.46, matGold, true);
        box(0, 41.1, 0, 0.22, 1.4, 0.22, matWhiteGlow, false);

        // Animated orrery crown.
        const orbitRoot = new THREE.Group();
        orbitRoot.position.set(cx, 0, cz);
        parent.add(orbitRoot);

        const orbiters = [];
        function orbit(radius, y, tube, material, tiltX, tiltZ, speed, planetMat, planetSize, phase) {
            const group = new THREE.Group();
            group.position.y = y;
            group.rotation.x = tiltX;
            group.rotation.z = tiltZ;
            orbitRoot.add(group);

            const torus = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 96), material);
            torus.rotation.x = Math.PI / 2;
            group.add(torus);

            const planet = new THREE.Mesh(new THREE.SphereGeometry(planetSize, 16, 10), planetMat);
            planet.position.set(Math.cos(phase) * radius, 0, Math.sin(phase) * radius);
            group.add(planet);
            const trail = new THREE.Mesh(new THREE.SphereGeometry(Math.max(0.15, planetSize * 0.35), 8, 6), matWhiteGlow);
            trail.position.set(Math.cos(phase + 0.18) * radius, 0, Math.sin(phase + 0.18) * radius);
            group.add(trail);
            orbiters.push({ group, speed, planet, trail, radius, phase });
        }

        orbit(7.2, 25.5, 0.055, matCyan, 0.06, 0.18, 0.45, matAmberGlow, 0.55, 0.2);
        orbit(5.6, 30.2, 0.055, matMagenta, 0.35, -0.18, -0.62, matViolet, 0.42, 1.1);
        orbit(4.1, 34.8, 0.05, matGold, -0.28, 0.28, 0.78, matBlue, 0.36, 2.1);

        sphere(0, 39.6, 0, 1.35, matWhiteGlow, 24);
        sphere(0, 39.6, 0, 2.3, new THREE.MeshBasicMaterial({ color: 0x2efcff, transparent: true, opacity: 0.16 }), 24);
        createStarburst(39.6, 5.7, matWhiteGlow);

        const starLight = new THREE.PointLight(0x8eefff, 2.2, 65);
        starLight.position.set(cx, 39.8, cz);
        parent.add(starLight);
        const amberLight = new THREE.PointLight(0xffb02e, 1.2, 36);
        amberLight.position.set(cx, 14.0, cz + 5.5);
        parent.add(amberLight);

        // Floating crystal fragments around the crown.
        const shardRoot = new THREE.Group();
        shardRoot.position.set(cx, 0, cz);
        parent.add(shardRoot);
        for (let i = 0; i < 26; i++) {
            const angle = (i / 26) * Math.PI * 2;
            const radius = 8.4 + (i % 4) * 0.8;
            const y = 16.0 + (i % 9) * 2.2;
            const shard = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.35 + (i % 3) * 0.25, 0.32), i % 2 ? matGlass : matVioletGlass);
            shard.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
            shard.rotation.set(i * 0.31, angle, i * 0.17);
            shardRoot.add(shard);
        }

        // Constellation pylons for the competitors and the final signature.
        const pylons = [
            [-12.2, -1.7, Math.PI / 2, 'GEMINI', 'LIBERTY', '#43b3ae'],
            [12.2, -1.7, -Math.PI / 2, 'KIMI K2.5', 'TIANJIN', '#f7d774'],
            [-9.6, -12.2, Math.PI, 'CLAUDE', 'TAJ / MUSEUM', '#d6e4ff'],
            [9.6, -12.2, Math.PI, 'GROK', 'CYBERXHUB', '#ff4fd8'],
            [-3.2, -12.7, Math.PI, 'DEEPSEEK', 'NOTRE DAME', '#8eefff'],
            [3.2, -12.7, Math.PI, 'GPT-5.4', 'BURJ', '#d8a83a']
        ];

        pylons.forEach(([lx, lz, rot, title, subtitle, accent]) => {
            box(lx, 0.95, lz, 1.8, 0.7, 1.2, matVoidDark, true);
            box(lx, 1.68, lz, 1.25, 0.62, 0.84, matGoldDark, true);
            labelPanel(lx, 2.38, lz, 2.1, 1.08, title, subtitle, accent, rot, true);
            sphere(lx, 3.25, lz, 0.28, new THREE.MeshBasicMaterial({ color: accent }), 8);
        });

        labelPanel(8.2, 4.05, 7.0, 4.2, 1.45, 'GALERIA DA AURORA', 'ENTRADA', '#2efcff', 0, true);
        renderSignaturePlate('MAQUINA DO MUNDO', 'GPT-5.5 xHigh');

        if (ctx.buildings) {
            ctx.buildings.push({
                name: 'Maquina do Mundo',
                x: cx,
                z: cz,
                width: 28,
                depth: 28,
                type: 'landmark'
            });
        }

        function animateMaquina(t) {
            const time = t * 0.001;
            orbitRoot.rotation.y = Math.sin(time * 0.18) * 0.04;
            orbiters.forEach((item, idx) => {
                item.group.rotation.y += item.speed * 0.012;
                item.group.rotation.z += Math.sin(time * 0.5 + idx) * 0.0008;
                const phase = time * item.speed + item.phase;
                item.planet.position.set(Math.cos(phase) * item.radius, 0, Math.sin(phase) * item.radius);
                item.trail.position.set(Math.cos(phase - 0.28) * item.radius, 0, Math.sin(phase - 0.28) * item.radius);
            });
            shardRoot.rotation.y = time * 0.08;
            shardRoot.children.forEach((shard, idx) => {
                shard.rotation.y += 0.01 + idx * 0.0002;
                shard.position.y += Math.sin(time * 1.7 + idx) * 0.003;
            });
            starLight.intensity = 1.8 + Math.sin(time * 2.2) * 0.45;
            amberLight.intensity = 0.85 + Math.cos(time * 1.4) * 0.25;
            requestAnimationFrame(animateMaquina);
        }
        requestAnimationFrame(animateMaquina);
    };
})();
