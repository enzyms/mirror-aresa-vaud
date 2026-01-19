import { defaultQuestions, type Question } from '$lib/data/questions';

export interface ChecklistItem {
	question: Question;
	checked: boolean;
	notes: string;
	files: FileRecord[];
}

export interface FileRecord {
	id: string;
	name: string;
	type: 'audio' | 'video' | 'photo' | 'note';
	timestamp: string;
	saved: boolean;
}

export interface UserProfile {
	id: string;
	role: string;
	experience: string;
	techComfort: number;
	device: string;
	shiftPattern: string;
}

function createChecklistStore() {
	let items = $state<ChecklistItem[]>([]);
	let customQuestions = $state<Question[]>([]);
	let profiles = $state<UserProfile[]>([]);
	let initialized = $state(false);

	// Load from localStorage on init
	function init() {
		if (initialized) return;

		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('aresa-research-data');
			if (saved) {
				try {
					const data = JSON.parse(saved);
					customQuestions = data.customQuestions || [];
					profiles = data.profiles || [];

					// Rebuild items from saved state
					const allQuestions = [...defaultQuestions, ...customQuestions];
					items = allQuestions.map(q => {
						const savedItem = data.items?.find((i: ChecklistItem) => i.question.id === q.id);
						return savedItem || {
							question: q,
							checked: false,
							notes: '',
							files: []
						};
					});
				} catch (e) {
					console.error('Failed to load saved data:', e);
					initDefault();
				}
			} else {
				initDefault();
			}
		}
		initialized = true;
	}

	function initDefault() {
		items = defaultQuestions.map(q => ({
			question: q,
			checked: false,
			notes: '',
			files: []
		}));
	}

	function save() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('aresa-research-data', JSON.stringify({
				items,
				customQuestions,
				profiles
			}));
		}
	}

	function toggleCheck(questionId: string) {
		const item = items.find(i => i.question.id === questionId);
		if (item) {
			item.checked = !item.checked;
			save();
		}
	}

	function updateNotes(questionId: string, notes: string) {
		const item = items.find(i => i.question.id === questionId);
		if (item) {
			item.notes = notes;
			save();
		}
	}

	function addFile(questionId: string, file: FileRecord) {
		const item = items.find(i => i.question.id === questionId);
		if (item) {
			item.files.push(file);
			save();
		}
	}

	function markFileSaved(questionId: string, fileId: string) {
		const item = items.find(i => i.question.id === questionId);
		if (item) {
			const file = item.files.find(f => f.id === fileId);
			if (file) {
				file.saved = true;
				save();
			}
		}
	}

	function removeFile(questionId: string, fileId: string) {
		const item = items.find(i => i.question.id === questionId);
		if (item) {
			item.files = item.files.filter(f => f.id !== fileId);
			save();
		}
	}

	function addCustomQuestion(category: string, text: string): string {
		const id = `custom-${Date.now()}`;
		const newQuestion: Question = {
			id,
			category,
			text,
			type: 'interview',
			captureHint: 'Audio / Photo / Notes'
		};
		customQuestions.push(newQuestion);
		items.push({
			question: newQuestion,
			checked: false,
			notes: '',
			files: []
		});
		save();
		return id;
	}

	function addProfile(profile: Omit<UserProfile, 'id'>) {
		profiles.push({
			...profile,
			id: `profile-${Date.now()}`
		});
		save();
	}

	function getItemsByCategory(categoryId: string) {
		return items.filter(i => i.question.category === categoryId);
	}

	function getProgress() {
		const total = items.length;
		const checked = items.filter(i => i.checked).length;
		const withNotes = items.filter(i => i.notes.trim() !== '').length;
		const withFiles = items.filter(i => i.files.length > 0).length;
		return { total, checked, withNotes, withFiles };
	}

	function exportData() {
		return {
			exportDate: new Date().toISOString(),
			items,
			customQuestions,
			profiles
		};
	}

	return {
		get items() { return items; },
		get customQuestions() { return customQuestions; },
		get profiles() { return profiles; },
		init,
		toggleCheck,
		updateNotes,
		addFile,
		markFileSaved,
		removeFile,
		addCustomQuestion,
		addProfile,
		getItemsByCategory,
		getProgress,
		exportData,
		save
	};
}

export const checklistStore = createChecklistStore();
