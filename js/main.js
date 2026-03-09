// =====================================================================
// main.js — Ponto de entrada do jogo: orquestra todos os módulos
// =====================================================================

// ---- Core ----
import { THREE, scene, camera, renderer, clock, cameraZoom } from './core/renderer.js';

// ---- World ----
import { buildCity, collidables, roads } from './world/city.js';
import { updateTrafficLights } from './world/trafficLights.js';
import {
    boat, boatBox, bBase, duck, dLegL, dLegR,
    bondinho, bondinhoBoxes, chBase, geminiSign
} from './world/landmarks.js';

// ---- Entities ----
import { npcs, spawnNPC, updateNpcs } from './entities/npcs.js';
import { cars, heli, hRotor, isHeliOn, heliVelocity, spawnCar, updateCars } from './entities/vehicles.js';
import { fireBullet, updateBullets } from './entities/projectiles.js';

// ---- Systems ----
import { setupInput, keys } from './systems/input.js';
import { createExplosion, updateParticles } from './systems/collisions.js';
import { pickNewMission, checkMission, tickTimer } from './systems/mission.js';
import { drawMinimap } from './systems/minimap.js';
import { updateDayNight, dayTime } from './systems/dayNight.js';

// ---- UI ----
import { health, updateHealthDisplay, gameOver, setupTimerToggle } from './ui/hud.js';
import { setupPhoneEvents, renderContacts, phoneContacts } from './ui/phone.js';
import { setupAdminEvents, openAdminPanel, closeAdminPanel, adminOpen } from './ui/admin.js';
import { setupScreens, showPauseScreen, hidePauseScreen } from './ui/screens.js';
import { createVoxel, checkCollision, showMsg } from './core/voxel.js';
import { matSkin, matShirt, matPants } from './core/materials.js';
import { CITY_SIZE, NPC_COUNT, NPC_SPECIALS, CAR_COUNT, PLAYER_SPEED, PLAYER_SPEED_RUN, PLAYER_JUMP_FORCE, GRAVITY, STEP_HEIGHT, GAME_TIME_START } from './config.js';

// =====================================================================
// Estado global do jogo
// =====================================================================
const gameState = {
    isPlaying: false,
    isPaused: false,
    phoneOpen: false,
    closingPhone: false,
    carryingTarget: false,
    carriedAnimal: null,
    currentVehicle: null,
    viewMode: 'third', // 'first' | 'third'
    health: 3,
    score: 0,
    timeLeft: GAME_TIME_START,
    timerActive: true,
};

let pitch = 0, yaw = 0;
let pOnGround = false;
const velocity = new THREE.Vector3();

// ---- Construção do mundo ----
buildCity();

// ---- Player ----
const player = new THREE.Group();
player.position.set(-40, 5, -80); // Spawn no centro do quarteirão 2_2
scene.add(player);

const pBody = createVoxel(0, 1.5, 0, 1, 1, 0.5, matShirt);
const pHead = createVoxel(0, 2.5, 0, 0.8, 0.8, 0.8, matSkin);
const faceM = new THREE.MeshLambertMaterial({ color: 0x000000 });
const pEyeL = createVoxel(-0.2, 2.6, 0.41, 0.15, 0.15, 0.05, faceM);
const pEyeR = createVoxel(0.2, 2.6, 0.41, 0.15, 0.15, 0.05, faceM);
const pMouth = createVoxel(0, 2.3, 0.41, 0.4, 0.1, 0.05, faceM);
const pMC1 = createVoxel(-0.25, 2.35, 0.41, 0.1, 0.1, 0.05, faceM);
const pMC2 = createVoxel(0.25, 2.35, 0.41, 0.1, 0.1, 0.05, faceM);
const pArmL = createVoxel(-0.7, 1.5, 0, 0.4, 1, 0.4, matSkin);
const pArmR = createVoxel(0.7, 1.5, 0, 0.4, 1, 0.4, matSkin);
const pLegL = createVoxel(-0.3, 0.5, 0, 0.4, 1, 0.4, matPants);
const pLegR = createVoxel(0.3, 0.5, 0, 0.4, 1, 0.4, matPants);
player.add(pBody, pHead, pEyeL, pEyeR, pMouth, pMC1, pMC2, pArmL, pArmR, pLegL, pLegR);

const handObj = createVoxel(0.6, 1, 0.5, 0.5, 0.5, 0.5, new THREE.MeshLambertMaterial({ color: 0xffff00 }));
handObj.visible = false;
player.add(handObj);
gameState.handObj = handObj; // Referência usada pelo systems/mission.js

// ---- Raycaster ----
const raycaster = new THREE.Raycaster();
const aimMarker = createVoxel(0, -100, 0, 0.3, 0.3, 0.3, new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }), false, false);
aimMarker.visible = false; // Só para lógica, nunca visível

// ---- NPCs e Carros ----
for (let i = 0; i < NPC_COUNT; i++) spawnNPC(i < NPC_SPECIALS);
pickNewMission();
try { for (let i = 0; i < CAR_COUNT; i++) spawnCar(); } catch (e) { console.error('Erro ao spawnar carros:', e); }

// ---- Animações de Landmarks ----
let bondinhoP = 0, boatP = 0, duckP = 0;

// =====================================================================
// Controles de Veículo / Player
// =====================================================================
function toggleVehicle() {
    if (gameState.carriedAnimal) {
        gameState.carriedAnimal.mesh.position.copy(player.position);
        gameState.carriedAnimal.mesh.position.y = 0;
        scene.add(gameState.carriedAnimal.mesh);
        gameState.carriedAnimal = null;
        showMsg("Animal solto!"); return;
    }
    if (gameState.currentVehicle) {
        let groundY = 0;
        if (gameState.currentVehicle === heli) {
            raycaster.set(heli.position, new THREE.Vector3(0, -1, 0));
            const hits = raycaster.intersectObjects(scene.children, true);
            if (hits.length > 0 && hits[0].distance > 3) { showMsg("Muito alto para sair!"); return; }
            if (hits.length > 0) groundY = hits[0].point.y;
        }
        player.position.copy(gameState.currentVehicle.mesh ? gameState.currentVehicle.mesh.position : gameState.currentVehicle.position);
        player.position.x += 3;
        if (gameState.currentVehicle === heli) player.position.y = groundY;
        player.visible = true;
        if (gameState.currentVehicle === heli) heliVelocity.set(0, 0, 0);
        gameState.currentVehicle = null;
        gameState.viewMode = 'third';
        document.getElementById('speedometer').style.display = 'none';
        document.getElementById('crosshair').style.display = 'none';
    } else {
        let closest = null, minDist = 5;
        cars.forEach(c => { const d = player.position.distanceTo(c.mesh.position); if (d < minDist) { closest = c; minDist = d; } });
        if (player.position.distanceTo(heli.position) < 6) closest = heli;
        if (closest) {
            gameState.currentVehicle = closest; player.visible = false;
            document.getElementById('speedometer').style.display = 'block';
            if (closest === heli) { showMsg("Heli: Espaço sobe, Shift desce"); }
            else {
                yaw = Math.atan2(-closest.dir.x, -closest.dir.z);
                document.getElementById('crosshair').style.display = 'block';
                showMsg("Carro: Mouse gira, WASD move");
            }
        } else {
            let closestAnimal = null, minA = 5;
            npcs.forEach(n => {
                if ((n.npcType === 'dog' || n.npcType === 'cat') && !n.isSpc) {
                    const d = player.position.distanceTo(n.mesh.position);
                    if (d < minA) { closestAnimal = n; minA = d; }
                }
            });
            if (closestAnimal) {
                gameState.carriedAnimal = closestAnimal;
                closestAnimal.mesh.position.set(0, 1.5, 1);
                player.add(closestAnimal.mesh);
                showMsg("Você pegou o animal!");
            }
        }
    }
}

function takeDamage() {
    gameState.health--;
    updateHealthDisplay(gameState.health);
    player.position.y += 2; velocity.y = 10;
    showMsg("Ai! -1 Coração!");
    if (gameState.health <= 0) {
        createExplosion(player.position.x, player.position.y, player.position.z);
        gameOver("Você morreu!", gameState.score);
        gameState.isPlaying = false;
    }
}

// =====================================================================
// Input
// =====================================================================
setupInput({
    onToggleVehicle: () => { if (gameState.isPlaying && !gameState.isPaused) toggleVehicle(); },
    onToggleViewMode: () => { if (gameState.currentVehicle) gameState.viewMode = gameState.viewMode === 'third' ? 'first' : 'third'; },
    onFireBullet: () => {
        if (!gameState.isPlaying || gameState.isPaused || gameState.phoneOpen) return;
        const src = gameState.currentVehicle
            ? gameState.currentVehicle.mesh.position.clone().add(new THREE.Vector3(0, 1, 0))
            : player.position.clone().add(new THREE.Vector3(0, 1.5, 0));
        fireBullet(src, camera.quaternion);
    },
    onTogglePhone: () => {
        if (gameState.isPaused || adminOpen) return;
        gameState.phoneOpen = !gameState.phoneOpen;
        const ps = document.getElementById('phoneScreen');
        if (gameState.phoneOpen) {
            ps.style.display = 'flex'; document.exitPointerLock();
        } else {
            ps.style.display = 'none'; document.body.requestPointerLock();
        }
    },
    onToggleAdmin: () => {
        if (gameState.isPaused || gameState.phoneOpen) return;
        adminOpen ? closeAdminPanel() : openAdminPanel();
    },
    onEscape: (e) => {
        if (gameState.isPaused) { gameState.isPaused = false; hidePauseScreen(); document.getElementById('hud').style.display = 'block'; try { document.body.requestPointerLock(); } catch (err) { } }
        else if (gameState.phoneOpen) { gameState.closingPhone = true; gameState.phoneOpen = false; document.getElementById('phoneScreen').style.display = 'none'; }
        else if (adminOpen) { gameState.closingPhone = true; closeAdminPanel(); }
    },
    onMouseMove: (mx, my) => {
        if (gameState.isPlaying && !gameState.isPaused && !gameState.phoneOpen) {
            yaw -= mx * 0.002;
            pitch -= my * 0.002;
            pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
        }
    },
    onMouseDown: (e) => {
        if (gameState.phoneOpen && e.button === 0 && !e.target.closest('#phoneScreen')) {
            gameState.phoneOpen = false;
            document.getElementById('phoneScreen').style.display = 'none';
            document.body.requestPointerLock(); return;
        }
        if (gameState.isPlaying && !gameState.isPaused && !gameState.phoneOpen && e.button === 0) {
            if (document.pointerLockElement !== document.body) document.body.requestPointerLock();
            else {
                const src = gameState.currentVehicle
                    ? gameState.currentVehicle.mesh.position.clone().add(new THREE.Vector3(0, 1, 0))
                    : player.position.clone().add(new THREE.Vector3(0, 1.5, 0));
                fireBullet(src, camera.quaternion);
            }
        }
    },
    onPointerLockChange: (isLocked) => {
        if (isLocked) {
            gameState.isPlaying = true; gameState.isPaused = false;
            gameState.phoneOpen = false; gameState.closingPhone = false;
            document.getElementById('phoneScreen').style.display = 'none';
            hidePauseScreen();
            document.getElementById('hud').style.display = 'block';
        } else {
            if (gameState.health > 0) {
                if (gameState.closingPhone) { gameState.closingPhone = false; }
                else if (!gameState.phoneOpen && !adminOpen) {
                    gameState.isPaused = true; showPauseScreen();
                }
            }
        }
    }
});

// ---- UI setup ----
setupScreens({
    onSaveConfig: ({ npcMode, apiKey }) => { if (apiKey) window._geminiApiKey = apiKey; },
    onClearHistory: () => { phoneContacts.length = 0; renderContacts(); }
});
setupPhoneEvents();
setupAdminEvents();
setupTimerToggle(gameState);

// =====================================================================
// Loop Principal
// =====================================================================
function update() {
    if (!gameState.isPlaying || gameState.isPaused) return;
    const dt = Math.min(clock.getDelta(), 0.1);
    const { dayTime: dt2 } = { dayTime }; // eslint workaround

    updateDayNight(dt);
    if (tickTimer(dt, gameState)) { gameOver("O tempo acabou!", gameState.score); gameState.isPlaying = false; return; }

    // Player a pé
    if (!gameState.currentVehicle && gameState.health > 0) {
        const fwd = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        const dir = new THREE.Vector3();
        if (keys.w) dir.add(fwd);
        if (keys.s) dir.sub(fwd);
        if (keys.a) dir.sub(right);
        if (keys.d) dir.add(right);
        dir.normalize();
        const spd = keys.shift ? PLAYER_SPEED_RUN : PLAYER_SPEED;
        velocity.x = dir.x * spd; velocity.z = dir.z * spd;
        if (pOnGround && keys.space) { velocity.y = PLAYER_JUMP_FORCE; pOnGround = false; }
        velocity.y -= GRAVITY * dt;

        // Colisão X
        const oldX = player.position.x;
        player.position.x += velocity.x * dt;
        const cv = player.position.clone(); cv.y += 1;
        const sz = new THREE.Vector3(0.8, 1.8, 0.8);
        let pBox = new THREE.Box3().setFromCenterAndSize(cv, sz);
        let hitX = false;
        for (const c of collidables) {
            if (checkCollision(pBox, c)) {
                const sTop = c.max.y;
                if (sTop <= player.position.y + STEP_HEIGHT && sTop > player.position.y) {
                    player.position.y = sTop; velocity.y = 0; pOnGround = true;
                } else hitX = true;
                break;
            }
        }
        if (hitX) player.position.x = oldX;

        // Colisão Z
        const oldZ = player.position.z;
        player.position.z += velocity.z * dt;
        cv.copy(player.position); cv.y += 1;
        pBox.setFromCenterAndSize(cv, sz);
        let hitZ = false;
        for (const c of collidables) {
            if (checkCollision(pBox, c)) {
                const sTop = c.max.y;
                if (sTop <= player.position.y + STEP_HEIGHT && sTop > player.position.y) {
                    player.position.y = sTop; velocity.y = 0; pOnGround = true;
                } else hitZ = true;
                break;
            }
        }
        if (hitZ) player.position.z = oldZ;

        // Colisão Y
        const oldY = player.position.y;
        player.position.y += velocity.y * dt;
        if (player.position.y <= 0) {
            player.position.y = 0; velocity.y = 0; pOnGround = true;
        } else {
            cv.copy(player.position); cv.y += 1;
            pBox.setFromCenterAndSize(cv, sz);
            let hitY = false;
            for (const c of collidables) { if (checkCollision(pBox, c)) { hitY = true; break; } }
            if (hitY) { player.position.y = oldY; if (velocity.y < 0) pOnGround = true; velocity.y = 0; }
        }

        // Animação de caminhada
        if (dir.lengthSq() > 0) {
            const t = performance.now() * 0.005;
            player.rotation.y = Math.atan2(velocity.x, velocity.z);
            pArmL.rotation.x = Math.sin(t) * 0.5;
            pArmR.rotation.x = -Math.sin(t) * 0.5;
            pLegL.rotation.x = -Math.sin(t) * 0.5;
            pLegR.rotation.x = Math.sin(t) * 0.5;
        } else {
            pArmL.rotation.x = pArmR.rotation.x = pLegL.rotation.x = pLegR.rotation.x = 0;
        }

        // Atropelamento por carro NPC
        const pBoxCar = new THREE.Box3().setFromObject(pBody);
        cars.forEach(c => {
            if (c !== gameState.currentVehicle && checkCollision(pBoxCar, new THREE.Box3().setFromObject(c.mesh))) takeDamage();
        });

    } else if (gameState.currentVehicle === heli) {
        // Heli
        hRotor.rotation.y += 20 * dt;
        heli.rotation.y = yaw;
        const hFwd = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        const hRight = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        if (keys.w) { heliVelocity.addScaledVector(hFwd, 60 * dt); heli.rotation.x = -0.2; }
        else if (keys.s) { heliVelocity.addScaledVector(hFwd, -60 * dt); heli.rotation.x = 0.2; }
        else heli.rotation.x = 0;
        if (keys.a) { heliVelocity.addScaledVector(hRight, -40 * dt); heli.rotation.z = 0.2; }
        else if (keys.d) { heliVelocity.addScaledVector(hRight, 40 * dt); heli.rotation.z = -0.2; }
        else heli.rotation.z = 0;
        if (keys.space) heliVelocity.y += 30 * dt;
        else if (keys.shift) heliVelocity.y -= 30 * dt;
        else heliVelocity.y *= 0.9;
        heliVelocity.x *= 0.96; heliVelocity.z *= 0.96;

        const cH = heli.position.clone(); cH.y += 1;
        const sH = new THREE.Vector3(2, 2, 4);
        let hBox;
        ['x', 'z', 'y'].forEach(axis => {
            const old = heli.position[axis];
            heli.position[axis] += heliVelocity[axis] * dt;
            cH[axis] = heli.position[axis];
            hBox = new THREE.Box3().setFromCenterAndSize(cH, sH);
            let hit = false;
            for (const c of collidables) { if (checkCollision(hBox, c)) { hit = true; break; } }
            if (hit) { heli.position[axis] = old; heliVelocity[axis] = 0; }
        });
        if (heli.position.y < 1.5) { heli.position.y = 1.5; heliVelocity.y = 0; }

    } else if (gameState.currentVehicle) {
        // Carro do player
        const cv = gameState.currentVehicle;
        if (keys.w) cv.speed = Math.min(cv.maxSpeed * 3, cv.speed + 20 * dt);
        else if (keys.s) cv.speed = Math.max(-10, cv.speed - 20 * dt);
        else cv.speed *= 0.9;
        if (keys.a) yaw += 2 * dt;
        if (keys.d) yaw -= 2 * dt;
        const cvFwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
        cv.mesh.lookAt(cv.mesh.position.clone().add(cvFwd));
        document.getElementById('speedometer').innerText = `${Math.floor(Math.abs(cv.speed) * 3)} km/h`;
        const oldCP = cv.mesh.position.clone();
        cv.mesh.position.addScaledVector(cvFwd, cv.speed * dt);
        const cBox = new THREE.Box3().setFromObject(cv.mesh);
        let hitWall = false;
        for (const c of collidables) { if (checkCollision(cBox, c)) { hitWall = true; break; } }
        if (hitWall) {
            cv.mesh.position.copy(oldCP);
            const bd = cv.speed > 0 ? -1 : 1;
            cv.mesh.position.addScaledVector(cvFwd, bd * 1.5);
            cv.speed = -cv.speed * 0.5;
            if (Math.abs(cv.speed) > 5) showMsg("BATEU!");
        }
        // Atropelar NPC / colidir carro
        cars.forEach((cc, idx) => {
            if (cc !== cv) {
                const ccBox = new THREE.Box3().setFromObject(cc.mesh);
                if (checkCollision(cBox, ccBox)) {
                    createExplosion(cc.mesh.position.x, cc.mesh.position.y, cc.mesh.position.z);
                    scene.remove(cc.mesh); cars.splice(idx, 1); spawnCar();
                }
            }
        });
        npcs.forEach((n, idx) => {
            const nBox = new THREE.Box3().setFromObject(n.mesh);
            if (checkCollision(cBox, nBox)) {
                createExplosion(n.mesh.position.x, n.mesh.position.y, n.mesh.position.z);
                scene.remove(n.mesh); npcs.splice(idx, 1); spawnNPC(n.isSpc);
            }
        });
    }

    // Câmera
    if (gameState.currentVehicle) {
        const vMesh = gameState.currentVehicle.mesh || gameState.currentVehicle;
        if (gameState.viewMode === 'first') {
            camera.position.copy(vMesh.position); camera.position.y += 1;
            camera.rotation.set(pitch, yaw, 0, 'YXZ');
        } else {
            let offset;
            if (gameState.currentVehicle === heli) {
                offset = new THREE.Vector3(0, 5, 10).applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
            } else {
                const bX = Math.sin(yaw), bZ = Math.cos(yaw);
                offset = new THREE.Vector3(bX * 10, 5, bZ * 10).applyAxisAngle(new THREE.Vector3(bZ, 0, -bX), -pitch);
            }
            camera.position.copy(vMesh.position).add(offset);
            camera.lookAt(vMesh.position);
        }
    } else {
        const offset = new THREE.Vector3(0, 3 + cameraZoom, 4 * cameraZoom).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        camera.position.copy(player.position).add(offset);
        camera.position.y = Math.max(0.5, camera.position.y);
        camera.rotation.set(pitch, yaw, 0, 'YXZ');
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const hits = raycaster.intersectObjects(scene.children, true);
        const valid = hits.find(h => h.object !== pBody && h.object !== pHead && h.object !== handObj && h.object !== aimMarker);
        aimMarker.position.copy(valid ? valid.point : new THREE.Vector3(0, -100, 0));
    }

    // Sistemas
    updateNpcs(dt, CITY_SIZE, gameState.carriedAnimal);
    updateCars(dt, gameState.currentVehicle);
    updateTrafficLights(dt);
    updateBullets(dt, gameState.currentVehicle);
    updateParticles(dt);

    // Landmarks animados
    bondinhoP += dt * 0.2;
    const oldBP = bondinho.position.clone();
    bondinho.position.set(-60 + Math.sin(bondinhoP) * 20, 25 + Math.sin(bondinhoP) * 5, -100 - Math.sin(bondinhoP) * 15);
    const bDelta = bondinho.position.clone().sub(oldBP);
    bondinhoBoxes.forEach(b => b.box.setFromObject(b.mesh));
    if (!gameState.currentVehicle && player.position.distanceTo(bondinho.position) < 4 &&
        player.position.y >= bondinho.position.y - 0.5 && player.position.y < bondinho.position.y + 4) {
        player.position.add(bDelta);
    }

    const oldBoatX = boat.position.x;
    boatP += dt * 0.5;
    boat.position.x = 80 + Math.sin(boatP) * 12;
    boatBox.setFromObject(bBase);
    if (!gameState.currentVehicle && player.position.distanceTo(boat.position) < 4 &&
        player.position.y >= boat.position.y && player.position.y < boat.position.y + 3) {
        player.position.x += (boat.position.x - oldBoatX);
    }

    // Patinho — caminha pelo lago OU segue o jogador com o objeto na mão
    duckP += dt;
    if (!duck.userData.dir) {
        duck.userData.dir = new THREE.Vector3(1, 0, 0.5).normalize();
        duck.userData.walkTimer = 0;
    }

    const pObj2 = gameState.currentVehicle ? (gameState.currentVehicle.mesh || gameState.currentVehicle) : player;

    const toDuckVec = new THREE.Vector3(
        pObj2.position.x - duck.position.x,
        0,
        pObj2.position.z - duck.position.z
    );
    const distToPlayer = toDuckVec.length();

    // Só segue se: tem objeto na mão E jogador está perto (<= 20 unidades)
    const shouldFollow = gameState.carryingTarget && distToPlayer <= 20;

    if (shouldFollow && distToPlayer > 2) {
        // ── MODO SEGUIR: velocidade normal de caminhada ──
        toDuckVec.normalize();
        duck.userData.dir.copy(toDuckVec);
        const followSpeed = 6;
        duck.position.x += toDuckVec.x * followSpeed * dt;
        duck.position.z += toDuckVec.z * followSpeed * dt;
        duck.rotation.y = Math.atan2(duck.userData.dir.x, duck.userData.dir.z);
        duck.position.y = 1.0 + Math.abs(Math.sin(duckP * 8)) * 0.2; // Y=1.0 → pernas no chão
        dLegL.visible = dLegR.visible = true;
        dLegL.rotation.x = Math.sin(duckP * 8) * 0.5;
        dLegR.rotation.x = -Math.sin(duckP * 8) * 0.5;
    } else {
        // ── MODO VAGAR: passeio aleatório pelo lago ──
        duck.userData.walkTimer += dt;
        if (duck.userData.walkTimer > 2 + Math.random() * 2) {
            duck.userData.dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * Math.PI * 0.8);
            duck.userData.dir.normalize();
            duck.userData.walkTimer = 0;
        }
        const duckSpeed = 1.5;
        const nextDX = duck.position.x + duck.userData.dir.x * duckSpeed * dt;
        const nextDZ = duck.position.z + duck.userData.dir.z * duckSpeed * dt;
        if (nextDX >= 58 && nextDX <= 102) duck.position.x = nextDX;
        else { duck.userData.dir.x *= -1; duck.userData.dir.normalize(); }
        if (nextDZ >= 58 && nextDZ <= 102) duck.position.z = nextDZ;
        else { duck.userData.dir.z *= -1; duck.userData.dir.normalize(); }
        duck.rotation.y = Math.atan2(duck.userData.dir.x, duck.userData.dir.z);

        const inWater = duck.position.x >= 62 && duck.position.x <= 98 && duck.position.z >= 62 && duck.position.z <= 98;
        if (inWater) {
            duck.position.y = 0.2 + Math.sin(duckP * 3) * 0.1; // Flutua na superfície da água
            dLegL.visible = dLegR.visible = false;
        } else {
            duck.position.y = 1.0 + Math.abs(Math.sin(duckP * 6)) * 0.2; // Y=1.0 → pernas no chão
            dLegL.visible = dLegR.visible = true;
            dLegL.rotation.x = Math.sin(duckP * 6) * 0.4;
            dLegR.rotation.x = -Math.sin(duckP * 6) * 0.4;
        }
    }

    checkMission(gameState.currentVehicle ? (gameState.currentVehicle.mesh || gameState.currentVehicle) : player, gameState, null);
    drawMinimap(gameState.currentVehicle ? (gameState.currentVehicle.mesh || gameState.currentVehicle) : player, yaw);
}

function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}
animate();
