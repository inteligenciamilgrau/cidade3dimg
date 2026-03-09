// =====================================================================
// entities/npcs.js — Spawn, animação e dados persistentes dos NPCs
// =====================================================================
import { THREE, scene } from '../core/renderer.js';
import { createVoxel, checkCollision } from '../core/voxel.js';
import { collidables } from '../world/city.js';
import { CITY_SIZE, BLOCK_SIZE, ROAD_WIDTH } from '../config.js';

// --- Dados persistentes ---
export const npcNames = [
    "Ana", "Bruno", "Carlos", "Dani", "Edu", "Fabi", "Gabi", "Hugo", "Igor", "Julia",
    "Kaio", "Lara", "Malu", "Nuno", "Otto", "Pati", "Quim", "Raul", "Sara", "Theo",
    "Uly", "Vera", "Will", "Ximb", "Yuri", "Zeca", "Rex", "Max", "Bidu", "Mel", "Nina", "Thor"
];
export const npcBackstories = [
    "Um carteiro muito rápido que adora conversar.",
    "Ama cachorros quentes e odeia pombos.",
    "Tem pavor de altura e nunca anda de helicóptero.",
    "Gosta de observar helicópteros no tempo livre.",
    "Dormiu pouco essa noite e está mal humorado.",
    "Está sempre com pressa para chegar no trabalho.",
    "Um turista perdido na cidade grande, procurando atrações.",
    "Trabalha no escritório da esquina e vive estressado.",
    "Gosta de jogar papo fora com qualquer um que dê atenção.",
    "Um espião disfarçado observando movimentos suspeitos.",
    "Só sabe falar sobre a previsão do tempo.",
    "Dono de uma loja de doces muito famosa.",
    "Procurando o cachorro que fugiu na semana passada.",
    "Sabe de todas as fofocas do bairro.",
    "Adora tirar fotos de absolutamente tudo na cidade.",
    "Um mágico de rua amador que sempre erra os truques.",
    "Sempre reclamando do trânsito terrível.",
    "Muito fã do Cristo Redentor, vai lá todo final de semana.",
    "Um animal muito esperto que entende as pessoas.",
    "Apenas um bichinho faminto procurando petiscos."
];
export const npcSurnames = [
    "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves",
    "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho",
    "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Gomes"
];

export let persistentNpcs = [];
try { persistentNpcs = JSON.parse(localStorage.getItem('gameNpcsData')) || []; } catch (e) { }

export function getPersistentNpc(index) {
    let data = persistentNpcs[index];
    if (data && data.phone && data.phone.length === 2 && !/\d/.test(data.name)) {
        return data;
    }
    const name = npcNames[Math.floor(Math.random() * npcNames.length)] + " " + npcSurnames[Math.floor(Math.random() * npcSurnames.length)];
    const backstory = npcBackstories[Math.floor(Math.random() * npcBackstories.length)];
    const phone = Math.floor(10 + (index % 90)).toString();
    data = { id: index, name, backstory, phone };
    persistentNpcs[index] = data;
    localStorage.setItem('gameNpcsData', JSON.stringify(persistentNpcs));
    return data;
}

export const npcs = [];
let npcSpawnCount = 0;

export function spawnNPC(isSpecial = false) {
    const myNpcData = getPersistentNpc(npcSpawnCount++);
    let x, z, valid = false;
    while (!valid) {
        x = (Math.random() - 0.5) * CITY_SIZE;
        z = (Math.random() - 0.5) * CITY_SIZE;
        valid = true;
        if (Math.abs(x % BLOCK_SIZE) < ROAD_WIDTH / 2 || Math.abs(z % BLOCK_SIZE) < ROAD_WIDTH / 2) valid = false;
        if (valid) {
            const dummyBox = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1.5, z), new THREE.Vector3(1.5, 3, 1.5));
            for (const c of collidables) {
                if (checkCollision(dummyBox, c)) { valid = false; break; }
            }
        }
    }

    const g = new THREE.Group();
    g.position.set(x, 0, z);

    const typeRand = Math.random();
    let npcType = 'man';
    if (typeRand > 0.85) npcType = 'cat';
    else if (typeRand > 0.70) npcType = 'dog';
    else if (typeRand > 0.35) npcType = 'woman';

    const npcMatRosto = new THREE.MeshLambertMaterial({ color: 0x000000 });
    let armL, armR, legL, legR;
    const parts = [];

    if (npcType === 'man' || npcType === 'woman') {
        const shirtColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500, 0x800080, 0xffffff, 0x222222];
        const pantColors = [0x1111ff, 0x333333, 0x442200, 0xaaaaaa, 0x225522];
        const skinColors = [0xffcc99, 0xd2b48c, 0x8d5524, 0xc68642, 0x3d2314];
        const myShirtMat = new THREE.MeshLambertMaterial({ color: shirtColors[Math.floor(Math.random() * shirtColors.length)] });
        const myPantMat = new THREE.MeshLambertMaterial({ color: pantColors[Math.floor(Math.random() * pantColors.length)] });
        const mySkinMat = new THREE.MeshLambertMaterial({ color: skinColors[Math.floor(Math.random() * skinColors.length)] });

        const body = createVoxel(0, 1.5, 0, 1, 1, 0.5, myShirtMat);
        const head = createVoxel(0, 2.5, 0, 0.8, 0.8, 0.8, mySkinMat);
        if (npcType === 'woman') {
            const hairColors = [0x111111, 0x884411, 0xddaa11, 0xaa2222];
            const myHairMat = new THREE.MeshLambertMaterial({ color: hairColors[Math.floor(Math.random() * hairColors.length)] });
            parts.push(createVoxel(0, 2.95, 0, 0.85, 0.2, 0.85, myHairMat));
            parts.push(createVoxel(0, 2.4, -0.45, 0.85, 1.0, 0.2, myHairMat));
        }
        armL = createVoxel(-0.7, 1.5, 0, 0.4, 1, 0.4, mySkinMat);
        armR = createVoxel(0.7, 1.5, 0, 0.4, 1, 0.4, mySkinMat);
        legL = createVoxel(-0.3, 0.5, 0, 0.4, 1, 0.4, myPantMat);
        legR = createVoxel(0.3, 0.5, 0, 0.4, 1, 0.4, myPantMat);
        const olhoL = createVoxel(-0.2, 2.6, 0.41, 0.15, 0.15, 0.05, npcMatRosto);
        const olhoR = createVoxel(0.2, 2.6, 0.41, 0.15, 0.15, 0.05, npcMatRosto);
        const boca = createVoxel(0, 2.3, 0.41, 0.4, 0.1, 0.05, npcMatRosto);
        g.userData.phone = myNpcData.phone;
        parts.push(body, head, olhoL, olhoR, boca, armL, armR, legL, legR);
    } else if (npcType === 'dog') {
        const dogColors = [0x8B4513, 0xCD853F, 0xD2B48C, 0x000000, 0xFFFFFF];
        const dMat = new THREE.MeshLambertMaterial({ color: dogColors[Math.floor(Math.random() * dogColors.length)] });
        const dBody = createVoxel(0, 0.7, 0, 0.5, 0.4, 0.9, dMat);
        const dHead = createVoxel(0, 1.0, 0.4, 0.4, 0.4, 0.4, dMat);
        const dSnout = createVoxel(0, 0.9, 0.6, 0.2, 0.2, 0.3, dMat);
        const dNose = createVoxel(0, 0.95, 0.76, 0.1, 0.1, 0.05, npcMatRosto);
        const dEarL = createVoxel(-0.2, 1.2, 0.3, 0.1, 0.3, 0.2, dMat);
        const dEarR = createVoxel(0.2, 1.2, 0.3, 0.1, 0.3, 0.2, dMat);
        const dTail = createVoxel(0, 0.8, -0.5, 0.1, 0.4, 0.1, dMat);
        dTail.rotation.x = Math.PI / 4;
        const dEyeL = createVoxel(-0.1, 1.1, 0.61, 0.08, 0.08, 0.05, npcMatRosto);
        const dEyeR = createVoxel(0.1, 1.1, 0.61, 0.08, 0.08, 0.05, npcMatRosto);
        legL = createVoxel(-0.15, 0.45, 0.3, 0.1, 0.3, 0.1, dMat);
        legR = createVoxel(0.15, 0.45, 0.3, 0.1, 0.3, 0.1, dMat);
        armL = createVoxel(-0.15, 0.45, -0.3, 0.1, 0.3, 0.1, dMat);
        armR = createVoxel(0.15, 0.45, -0.3, 0.1, 0.3, 0.1, dMat);
        g.userData.phone = myNpcData.phone;
        parts.push(dBody, dHead, dSnout, dNose, dEarL, dEarR, dTail, dEyeL, dEyeR, legL, legR, armL, armR);
    } else { // cat
        const catColors = [0xFFFFFF, 0x000000, 0xFFA500, 0x808080, 0xA0522D];
        const cMat = new THREE.MeshLambertMaterial({ color: catColors[Math.floor(Math.random() * catColors.length)] });
        const cBody = createVoxel(0, 0.6, 0, 0.3, 0.3, 0.6, cMat);
        const cHead = createVoxel(0, 0.8, 0.3, 0.3, 0.3, 0.3, cMat);
        const cEarL = createVoxel(-0.1, 1.0, 0.3, 0.1, 0.2, 0.1, cMat);
        const cEarR = createVoxel(0.1, 1.0, 0.3, 0.1, 0.2, 0.1, cMat);
        const cTail = createVoxel(0, 0.9, -0.3, 0.05, 0.5, 0.05, cMat);
        cTail.rotation.x = -Math.PI / 6;
        const cEyeL = createVoxel(-0.08, 0.88, 0.46, 0.06, 0.06, 0.05, npcMatRosto);
        const cEyeR = createVoxel(0.08, 0.88, 0.46, 0.06, 0.06, 0.05, npcMatRosto);
        legL = createVoxel(-0.1, 0.4, 0.2, 0.05, 0.2, 0.05, cMat);
        legR = createVoxel(0.1, 0.4, 0.2, 0.05, 0.2, 0.05, cMat);
        armL = createVoxel(-0.1, 0.4, -0.2, 0.05, 0.2, 0.05, cMat);
        armR = createVoxel(0.1, 0.4, -0.2, 0.05, 0.2, 0.05, cMat);
        g.userData.phone = myNpcData.phone;
        parts.push(cBody, cHead, cEarL, cEarR, cTail, cEyeL, cEyeR, legL, legR, armL, armR);
    }

    parts.forEach(p => g.add(p));

    // Name Sprite
    const nameCanvas = document.createElement('canvas');
    nameCanvas.width = 256; nameCanvas.height = 64;
    const ctxName = nameCanvas.getContext('2d');
    ctxName.fillStyle = 'rgba(0,0,0,0.5)'; ctxName.fillRect(0, 0, 256, 64);
    ctxName.fillStyle = '#ffffff'; ctxName.font = 'bold 24px Arial';
    ctxName.textAlign = 'center'; ctxName.textBaseline = 'middle';
    ctxName.fillText(myNpcData.phone ? `(${myNpcData.phone}) ${myNpcData.name}` : myNpcData.name, 128, 32);
    const nameSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(nameCanvas) }));
    nameSprite.position.set(0, 3.8, 0);
    nameSprite.scale.set(3, 0.75, 1);
    g.add(nameSprite);

    // Talking Indicator Sprite
    const iconCanvas = document.createElement('canvas');
    iconCanvas.width = 64; iconCanvas.height = 64;
    const ctxIcon = iconCanvas.getContext('2d');
    ctxIcon.fillStyle = '#ffaa00'; ctxIcon.beginPath();
    ctxIcon.arc(32, 32, 28, 0, Math.PI * 2); ctxIcon.fill();
    ctxIcon.fillStyle = '#ffffff'; ctxIcon.font = 'bold 30px Arial';
    ctxIcon.textAlign = 'center'; ctxIcon.textBaseline = 'middle';
    ctxIcon.fillText('...', 32, 34);
    const talkingSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(iconCanvas) }));
    talkingSprite.position.set(0, 4.8, 0);
    talkingSprite.scale.set(1, 1, 1);
    talkingSprite.visible = false;
    g.add(talkingSprite);

    scene.add(g);

    let specialMarker = null;
    if (isSpecial) {
        specialMarker = createVoxel(0, 4, 0, 0.5, 0.5, 0.5, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        g.add(specialMarker);
    }

    npcs.push({
        mesh: g, armL, armR, legL, legR,
        dir: new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize(),
        speed: 2 + Math.random() * 2,
        t: Math.random() * 10,
        isSpc: isSpecial, marker: specialMarker,
        state: 'walk', phone: myNpcData.phone, data: myNpcData,
        npcType,
        talkingIndicator: talkingSprite
    });
}

/**
 * Anima todos os NPCs.
 */
export function updateNpcs(dt, citySize, carriedAnimal) {
    npcs.forEach(n => {
        if (n === carriedAnimal) return;
        n.t += dt * n.speed;
        n.armL.rotation.x = Math.sin(n.t) * 0.5;
        n.armR.rotation.x = -Math.sin(n.t) * 0.5;
        n.legL.rotation.x = -Math.sin(n.t) * 0.5;
        n.legR.rotation.x = Math.sin(n.t) * 0.5;
        n.mesh.position.addScaledVector(n.dir, n.speed * dt);
        n.mesh.rotation.y = Math.atan2(n.dir.x, n.dir.z);

        if (n.jumpTimer > 0) {
            n.jumpTimer -= dt * 5;
            n.mesh.position.y = Math.max(0, Math.sin(n.jumpTimer) * 1.5);
        } else {
            n.mesh.position.y = 0;
        }

        const nBox = new THREE.Box3().setFromObject(n.mesh);
        let hitWall = false;
        for (const c of collidables) {
            if (checkCollision(nBox, c)) { hitWall = true; break; }
        }
        if (hitWall || Math.random() < 0.01 ||
            Math.abs(n.mesh.position.x) > citySize / 2 ||
            Math.abs(n.mesh.position.z) > citySize / 2) {
            if (hitWall) {
                n.mesh.position.addScaledVector(n.dir, -n.speed * dt);
                n.dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
            } else {
                n.dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
            }
        }
    });
}
