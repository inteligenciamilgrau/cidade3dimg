// =====================================================================
// systems/input.js — Teclado, mouse e Pointer Lock
// =====================================================================

export const keys = { w: false, a: false, s: false, d: false, space: false, shift: false };
export let pitch = 0;
export let yaw = 0;

// Exportamos como objeto mutável para que outros módulos leiam o valor atual
export const mouse = { pitch: 0, yaw: 0 };

/**
 * Configura todos os event listeners de input.
 * Callbacks permitem que o caller reaja a eventos específicos.
 *
 * @param {object} callbacks
 *   .onToggleVehicle()
 *   .onToggleViewMode()
 *   .onFireBullet()
 *   .onTogglePhone()
 *   .onToggleAdmin()
 *   .onEscapeMenu()
 *   .onPointerLockChange(isLocked: bool)
 */
export function setupInput(callbacks = {}) {
    document.addEventListener('keydown', (e) => {
        const k = e.key.toLowerCase();

        // Delega teclas especiais via callbacks
        if (e.key === 'Escape') { callbacks.onEscape?.(e); return; }
        if (k === 'c' && e.target.tagName !== 'INPUT') { callbacks.onTogglePhone?.(); return; }
        if (k === 'o' && e.target.tagName !== 'INPUT') { callbacks.onToggleAdmin?.(); return; }
        if (e.target.tagName === 'INPUT') return;

        if (keys.hasOwnProperty(k)) keys[k] = true;
        if (k === ' ') keys.space = true;
        if (e.key === 'Shift') keys.shift = true;

        if (k === 'f') callbacks.onToggleVehicle?.();
        if (k === 'v') callbacks.onToggleViewMode?.();
        if (k === 'e') callbacks.onFireBullet?.();
    });

    document.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (keys.hasOwnProperty(k)) keys[k] = false;
        if (k === ' ') keys.space = false;
        if (e.key === 'Shift') keys.shift = false;
    });

    document.addEventListener('mousemove', (e) => {
        callbacks.onMouseMove?.(e.movementX, e.movementY);
    });

    document.addEventListener('mousedown', (e) => {
        callbacks.onMouseDown?.(e);
    });

    document.addEventListener('pointerlockchange', () => {
        callbacks.onPointerLockChange?.(document.pointerLockElement === document.body);
    });
}
