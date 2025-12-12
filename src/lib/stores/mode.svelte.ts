// Shared mode state across the application
export const modes = [
	{ id: 'desktop', label: 'Bureau', icon: 'Monitor' },
	{ id: 'intervention', label: 'Intervention', icon: 'Siren' },
] as const;

export type ModeId = typeof modes[number]['id'];

// Reactive state using Svelte 5 runes
let _currentMode = $state<ModeId>('desktop');

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

