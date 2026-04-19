// blocks/block_1_1.js
(function () {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['1_1'] = function (ctx) {
        const { THREE, scene, collidables, centerX, centerZ } = ctx;

        const stoneMat = new THREE.MeshLambertMaterial({ color: 0xdddddd });
        const matPlat = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const matGrass = new THREE.MeshLambertMaterial({ color: 0x0a7f3f });
        const mountainMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
        const matWood = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

        // --- Montanha Corcovado ---
        const corcovadoLevels = 24;
        for (let i = 0; i < corcovadoLevels; i++) {
            const s = 30 - i * (30 / corcovadoLevels);
            const h = 40 / corcovadoLevels;
            const y = i * h + h / 2;
            const layer = ctx.createVoxel(centerX, y, centerZ, s, h, s, mountainMat);
            collidables.push(new THREE.Box3().setFromObject(layer));
        }

        // Suporte Estação Corcovado
        ctx.createVoxel(centerX + 8, 38, centerZ, 1, 8, 1, matPlat, true, true);
        ctx.createVoxel(centerX + 8, 41.1, centerZ, 0.4, 2.5, 0.4, matWood, false);
        ctx.createVoxel(centerX + 8, 42.3, centerZ, 1, 0.2, 1, matWood, false);

        // Export anchor for cable
        window.corcovadoStationPos = new THREE.Vector3(centerX + 8, 35.5, centerZ);

        // Grupo do Cristo
        const christGroup = new THREE.Group();
        christGroup.position.set(centerX, 35, centerZ);
        scene.add(christGroup);

        function addCHPart(x, y, z, w, h, d) {
            const m = ctx.createVoxel(x, y, z, w, h, d, stoneMat);
            christGroup.add(m);
            m.position.set(x - centerX, y - 35, z - centerZ); // Transforma em local
            return m;
        }

        // --- Estátua ---
        addCHPart(centerX, 37.5, centerZ, 10, 5, 10); // Pedestal
        const chBase = addCHPart(centerX, 44, centerZ, 8, 8, 8); // Pés
        addCHPart(centerX, 60, centerZ, 8, 24, 6); // Corpo
        addCHPart(centerX, 68, centerZ, 32, 4, 4); // Braços
        addCHPart(centerX, 75, centerZ, 6, 6, 6); // Cabeça

        christGroup.rotation.y = Math.PI / 4;
        collidables.push(new THREE.Box3().setFromObject(chBase));

        // --- Plataformas Redondas ---
        const circGeo = new THREE.CylinderGeometry(15, 15, 0.5, 32);
        const plat1 = new THREE.Mesh(circGeo, matPlat);
        plat1.position.set(centerX, 35, centerZ);
        scene.add(plat1);

        const grassGeo = new THREE.CylinderGeometry(14, 14, 0.2, 32);
        const grassCorc = new THREE.Mesh(grassGeo, matGrass);
        grassCorc.position.set(centerX, 35.3, centerZ);
        scene.add(grassCorc);

        const platBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(centerX, 35, centerZ), 
            new THREE.Vector3(22, 0.5, 22)
        );
        collidables.push(platBox);

        // --- Placa Padrão ---
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 192;
        const c2 = canvas.getContext('2d');
        c2.fillStyle = '#0f1720'; c2.fillRect(0, 0, 512, 192);
        c2.strokeStyle = '#6fd3ff'; c2.lineWidth = 10; c2.strokeRect(10, 10, 492, 172);
        c2.fillStyle = '#eef7ff'; c2.textAlign = 'center'; c2.textBaseline = 'middle';
        c2.font = 'bold 50px Arial';
        c2.fillText('Cristo Redentor', 256, 78);
        c2.font = 'bold 34px Arial';
        c2.fillStyle = '#6fd3ff';
        c2.fillText('Gemini 1.5 Pro', 256, 132);

        const signMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) });
        const matDark = new THREE.MeshLambertMaterial({ color: 0x222222 });
        
        let pX = centerX + 14, pZ = centerZ;
        ctx.createVoxel(pX, 35.5, pZ, 0.2, 1.5, 0.2, matDark);
        let sign = ctx.createVoxel(pX, 37, pZ, 5, 2, 0.2, signMat);
        sign.rotation.y = Math.PI / 2;
        
        // Exportar referência para sistemas que precisam (minimap)
        window.christBase = chBase;
    };
})();
