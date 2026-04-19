// blocks/block_5_5.js
(function () {
    window.customBlocks = window.customBlocks || {};
    window.customBlocks['5_5'] = function (ctx) {
        const { THREE, scene, collidables, centerX, centerZ } = ctx;
        const matWater = new THREE.MeshLambertMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.7 });
        const matWood = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const pondMat = new THREE.MeshLambertMaterial({ color: 0xdbce9d });
        const matGrass = new THREE.MeshLambertMaterial({ color: 0x3a6b2a });
        const matBark = new THREE.MeshLambertMaterial({ color: 0x4a2f1a });
        const matLeaves = new THREE.MeshLambertMaterial({ color: 0x1d3a1d });

        // 1. Gramado Base (Cobre todo o quarteirão modular)
        ctx.createVoxel(centerX, -0.1, centerZ, 30, 0.2, 30, matGrass, true, true);

        // 2. Fundo do Lago Arredondado (Vários planos sobrepostos)
        function createRoundedLayer(y, w, h, mat) {
            // Desenha uma cruz gordinha para simular círculo
            ctx.createVoxel(centerX, y, centerZ, w, h, w * 0.8, mat, false, true);
            ctx.createVoxel(centerX, y, centerZ, w * 0.8, h, w, mat, false, true);
        }

        // Camadas de areia (fundo)
        for (let i = 0; i < 3; i++) {
            const size = 26 - i * 6;
            const dY = -0.5 - i * 0.4;
            createRoundedLayer(dY, size, 0.5, pondMat);
        }

        // 3. Água Arredondada (Elevada para brilhar na grama)
        // Usamos dois blocos cruzados para o efeito "arredondado" voxel
        ctx.createVoxel(centerX, 0.05, centerZ, 26, 0.2, 20, matWater, false, true);
        ctx.createVoxel(centerX, 0.05, centerZ, 20, 0.2, 26, matWater, false, true);

        // 4. Decoração: Árvores nos cantos da grama
        function addTree(tx, tz) {
            ctx.createVoxel(tx, 1.5, tz, 0.8, 3, 0.8, matBark);
            ctx.createVoxel(tx, 4, tz, 4, 3, 4, matLeaves);
        }
        addTree(centerX - 12, centerZ - 12);
        addTree(centerX + 12, centerZ + 12);
        addTree(centerX - 12, centerZ + 12);
        addTree(centerX + 12, centerZ - 12);

        // 5. Ponte Arqueada (Sobre o novo lago)
        for (let i = 0; i < 15; i++) {
            const zProg = i / 14;
            const bZ = (centerZ + 12) - 24 * zProg;
            const bY = 0.4 + Math.sin(zProg * Math.PI) * 2.5;
            const step = ctx.createVoxel(centerX, bY, bZ, 6, 0.4, 2, matWood, true, true);
            collidables.push(new THREE.Box3().setFromObject(step));
        }

        // 6. Entidades Dinâmicas
        if (window.boatGroup) {
            const boat = window.boatGroup;
            boat.children.forEach(c => boat.remove(c)); // Limpa meshes antigos se houver
            
            const matSail = new THREE.MeshLambertMaterial({ color: 0xffffff });
            const b1 = ctx.createVoxel(0, 0, 0, 2.5, 0.5, 5, matWood);
            const b2 = ctx.createVoxel(0, 1.5, 0, 0.2, 3, 0.2, matWood);
            const b3 = ctx.createVoxel(0, 1.5, 0.8, 0.1, 2, 1.8, matSail);
            boat.add(b1, b2, b3);
            boat.position.set(centerX, 0.2, centerZ);
        }

        if (window.duckGroup) {
            const duck = window.duckGroup;
            duck.children.forEach(c => duck.remove(c));
            
            const matYellow = new THREE.MeshLambertMaterial({ color: 0xffff00 });
            const matOrange = new THREE.MeshLambertMaterial({ color: 0xffaa00 });
            const matBlack = new THREE.MeshLambertMaterial({ color: 0x000000 });
            
            duck.add(ctx.createVoxel(0, 0, 0, 1.2, 0.8, 1.6, matYellow));
            duck.add(ctx.createVoxel(0, 0.8, 0.6, 0.8, 0.8, 0.8, matYellow));
            duck.add(ctx.createVoxel(0, 0.7, 1.1, 0.6, 0.2, 0.4, matOrange));
            duck.add(ctx.createVoxel(-0.41, 0.9, 0.7, 0.1, 0.1, 0.1, matBlack));
            duck.add(ctx.createVoxel(0.41, 0.9, 0.7, 0.1, 0.1, 0.1, matBlack));
            
            const l1 = ctx.createVoxel(-0.3, -0.6, 0.4, 0.2, 0.8, 0.2, matOrange);
            const l2 = ctx.createVoxel(0.3, -0.6, 0.4, 0.2, 0.8, 0.2, matOrange);
            duck.add(l1, l2);
            duck.position.set(centerX - 8, 0.3, centerZ - 8);
        }
    };
})();
