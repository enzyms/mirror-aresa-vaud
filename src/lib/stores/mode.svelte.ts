import { browser } from '$app/environment';

// Shared mode state across the application
export const modes = [
	{ id: 'desktop', label: 'Bureau', icon: 'Monitor' },
	{ id: 'intervention', label: 'Intervention', icon: 'Siren' },
] as const;

export type ModeId = typeof modes[number]['id'];

const STORAGE_KEY = 'aresa-mode';

// Initialize from localStorage or default to 'desktop'
function getInitialMode(): ModeId {
	if (browser) {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'desktop' || stored === 'intervention') {
			return stored;
		}
	}
	return 'desktop';
}

// Reactive state using Svelte 5 runes
let _currentMode = $state<ModeId>(getInitialMode());

// Persist to localStorage when mode changes
$effect.root(() => {
	$effect(() => {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, _currentMode);
		}
	});
});

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

