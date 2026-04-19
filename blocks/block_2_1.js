// blocks/block_2_1.js
(function () {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['2_1'] = function (ctx) {
        const { THREE, scene, collidables, centerX, centerZ } = ctx;
        const mountainMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
        const matPlat = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const matWood = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

        // Montanha Pão de Açúcar
        const paoLevels = 24; 
        for (let i = 0; i < paoLevels; i++) {
            const s = 20 - i * (20 / paoLevels);
            const h = 30 / paoLevels;
            const y = i * h + h / 2;
            const layer = ctx.createVoxel(centerX, y, centerZ, s, h, s, mountainMat);
            collidables.push(new THREE.Box3().setFromObject(layer));

            // Trilinha cinza
            ctx.createVoxel(centerX, y, centerZ + (s/2) + 0.2, 5, h, 1, matPlat);
        }

        // Estação Pão de Açúcar (y=30)
        const plat = ctx.createVoxel(centerX, 29.5, centerZ - 7.5, 12, 0.5, 15, matPlat);
        collidables.push(new THREE.Box3().setFromObject(plat));

        // Poste de Sustentação
        ctx.createVoxel(centerX, 33, centerZ - 10, 1, 8, 1, matPlat, true, true);
        
        // Suporte Wood
        ctx.createVoxel(centerX, 36.1, centerZ - 10, 0.4, 2.5, 0.4, matWood, false);
        ctx.createVoxel(centerX, 37.3, centerZ - 10, 1, 0.2, 1, matWood, false);

        
        // ---- Cabo do Bondinho (Dinâmico) ----
        // Aguarda um pequeno tempo para garantir que o outro bloco (1_1) carregou
        setTimeout(() => {
            const p1 = window.corcovadoStationPos || new THREE.Vector3(-72, 35.5, -80);
            const p2 = window.paStationPos || new THREE.Vector3(centerX, 29.5, centerZ - 10);
            
            const dist = p1.distanceTo(p2);
            const cableMesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 0.2, dist),
                new THREE.MeshLambertMaterial({ color: 0x333333 })
            );
            cableMesh.position.copy(p1).add(p2).multiplyScalar(0.5);
            cableMesh.position.y += 7.3; // Alinhado com o suporte
            cableMesh.lookAt(p2.x, p2.y + 7.3, p2.z);
            scene.add(cableMesh);

            // Se o bondinho existir, torná-lo visível agora que temos o cabo
            if (window.bondinho) {
                window.bondinho.visible = true;
            }
        }, 100);

        // Export anchor for cable
        window.paStationPos = new THREE.Vector3(centerX, 29.5, centerZ - 10);
    };
})();
