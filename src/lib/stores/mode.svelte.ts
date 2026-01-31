import { browser } from '$app/environment';

// Shared mode state across the application
export const modes = [
	{ id: 'desktop', label: 'Bureau', icon: 'Monitor' },
	{ id: 'intervention', label: 'Intervention', icon: 'Siren' },
] as const;

export type ModeId = (typeof modes)[number]['id'];

const STORAGE_KEY = 'aresa-mode';

// Reactive state using Svelte 5 runes - initialize with default, hydrate on client
let _currentMode = $state<ModeId>('desktop');
let _initialized = false;

// Hydrate from localStorage on the client side
function initializeMode() {
	if (browser && !_initialized) {
		_initialized = true;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'desktop' || stored === 'intervention') {
			_currentMode = stored;
		}
	}
}

// Persist to localStorage when mode changes (client-side only)
if (browser) {
	$effect.root(() => {
		// Initialize on first run
		initializeMode();
		
		$effect(() => {
			if (_initialized) {
				localStorage.setItem(STORAGE_KEY, _currentMode);
			}
		});
	});
}

export function getCurrentMode(): ModeId {
	return _currentMode;
}

export function setCurrentMode(mode: ModeId) {
	_currentMode = mode;
}

// For reactive access in components
export const modeStore = {
	get current() {
		return _currentMode;
	},
	set current(value: ModeId) {
		_currentMode = value;
	}
};

