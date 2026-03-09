// =====================================================================
// config.js — Constantes globais do jogo
// =====================================================================

export const CITY_SIZE = 200;
export const BLOCK_SIZE = 40;
export const ROAD_WIDTH = 10;
export const SIDEWALK_WIDTH = 2;

// Limites do mundo
export const WORLD_HALF = CITY_SIZE / 2;

// Física do jogador
export const PLAYER_SPEED = 8;
export const PLAYER_SPEED_RUN = 15;
export const PLAYER_JUMP_FORCE = 15;
export const GRAVITY = 30;
export const STEP_HEIGHT = 0.5;

// Missões
export const MISSION_POINTS = 10;
export const MISSION_TIME_BONUS = 30;
export const GAME_TIME_START = 600; // 10 minutos

// NPCs
export const NPC_COUNT = 30;
export const NPC_SPECIALS = 5;
export const CAR_COUNT = 15;
