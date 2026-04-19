// blocks/block_3_2.js
(function () {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['3_2'] = function (ctx) {
        const { THREE, scene, collidables, centerX, centerZ } = ctx;
        const matRoad = new THREE.MeshLambertMaterial({ color: 0x444444 });

        // Base do heliporto (octógono elevado) 
        const baseGeo = new THREE.CylinderGeometry(8, 8, 1.5, 8);
        const baseMesh = new THREE.Mesh(baseGeo, matRoad);
        baseMesh.position.set(centerX, 0.75, centerZ);
        baseMesh.rotation.y = Math.PI / 8;
        scene.add(baseMesh);

        // Colisões aproximadas
        const boxX = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(centerX, 0.75, centerZ),
            new THREE.Vector3(14.6, 1.5, 6.0)
        );
        const boxZ = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(centerX, 0.75, centerZ),
            new THREE.Vector3(6.0, 1.5, 14.6)
        );
        collidables.push(boxX, boxZ);

        // Escadinha
        const stairH = ctx.createVoxel(centerX, 0.375, centerZ + 8, 3, 0.75, 1.5, matRoad);
        collidables.push(new THREE.Box3().setFromObject(stairH));

        // Círculo amarelo
        const ringGeo = new THREE.RingGeometry(4.5, 5.2, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(centerX, 1.51, centerZ);
        scene.add(ring);

        // Letra H
        const matWhiteH = new THREE.MeshBasicMaterial({ color: 0xffffff });
        ctx.createVoxel(centerX - 2, 1.51, centerZ, 0.8, 0.05, 5.5, matWhiteH);
        ctx.createVoxel(centerX + 2, 1.51, centerZ, 0.8, 0.05, 5.5, matWhiteH);
        ctx.createVoxel(centerX, 1.51, centerZ, 3.2, 0.05, 0.8, matWhiteH);

        // --- Estacionar o Helicóptero aqui ---
        if (window.heliEntity) {
            window.heliEntity.position.set(centerX, 1.5, centerZ);
        }
        window.heliPadPos = new THREE.Vector3(centerX, 1.5, centerZ);
    };
})();
