import { writable } from 'svelte/store';
import { getRandomHex } from '../utils';

export const play = writable(false);
export const seed = writable(getRandomHex(64));
export const iters = writable(0);
export const totalIters = writable(0);
export const currRandom = writable({ hex: '', dec: '' });
