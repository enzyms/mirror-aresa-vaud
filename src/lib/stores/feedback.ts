import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import type {
	FeedbackMarker,
	FeedbackComment,
	ElementAnchor,
	ViewportInfo,
	MarkerStatus,
	AppToParentMessage
} from '$lib/types/feedback';

const STORAGE_KEY = 'feedback-markers';

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Génère un sélecteur CSS unique pour un élément
 * Priorité: id > classes stables + nth-of-type > chemin complet
 */
function generateSelector(element: HTMLElement): string {
	if (element.id) {
		return `#${CSS.escape(element.id)}`;
	}

	const path: string[] = [];
	let current: HTMLElement | null = element;

	while (current && current !== document.body && current !== document.documentElement) {
		let selector = current.tagName.toLowerCase();

		if (current.id) {
			path.unshift(`#${CSS.escape(current.id)}`);
			break;
		}

		// Filtrer les classes dynamiques (svelte-, s-, _, js-, chiffres)
		const classes = Array.from(current.classList)
			.filter((c) => !c.match(/^(svelte-|s-|_|js-)/i) && !c.match(/^\d/))
			.slice(0, 2);
		if (classes.length > 0) {
			selector += `.${classes.map((c) => CSS.escape(c)).join('.')}`;
		}

		// nth-of-type pour unicité
		const parentEl: HTMLElement | null = current.parentElement;
		if (parentEl) {
			const currentTagName = current.tagName;
			const siblings = Array.from(parentEl.children).filter(
				(el: Element) => el.tagName === currentTagName
			);
			if (siblings.length > 1) {
				const index = siblings.indexOf(current) + 1;
				selector += `:nth-of-type(${index})`;
			}
		}

		path.unshift(selector);
		current = parentEl;
	}

	return path.join(' > ');
}

/**
 * Génère un XPath comme fallback
 */
function generateXPath(element: HTMLElement): string {
	const parts: string[] = [];
	let current: HTMLElement | null = element;

	while (current && current.nodeType === Node.ELEMENT_NODE) {
		let index = 0;
		let sibling: Node | null = current.previousSibling;

		while (sibling) {
			if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === current.nodeName) {
				index++;
			}
			sibling = sibling.previousSibling;
		}

		const tagName = current.nodeName.toLowerCase();
		const position = index > 0 ? `[${index + 1}]` : '';
		parts.unshift(`${tagName}${position}`);

		current = current.parentElement;
	}

	return `/${parts.join('/')}`;
}

function getViewportInfo(): ViewportInfo {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
		scrollX: window.scrollX,
		scrollY: window.scrollY,
		devicePixelRatio: window.devicePixelRatio,
		timestamp: new Date().toISOString()
	};
}

function loadFromStorage(): FeedbackMarker[] {
	if (!browser) return [];
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (e) {
		console.error('[FeedbackStore] Failed to load from storage:', e);
	}
	return [];
}

function saveToStorage(markers: FeedbackMarker[]): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(markers));
	} catch (e) {
		console.error('[FeedbackStore] Failed to save to storage:', e);
	}
}

/**
 * Envoie un message au parent (sitemap-presenter) via postMessage
 */
function notifyParent(message: AppToParentMessage): void {
	if (browser && window.parent && window.parent !== window) {
		window.parent.postMessage(message, '*');
	}
}

// ═══════════════════════════════════════════════════════════════
// Store
// ═══════════════════════════════════════════════════════════════

export interface PreparedMarker {
	element: HTMLElement;
	anchor: ElementAnchor;
	fallbackPosition: { xPercent: number; yPercent: number };
	viewport: ViewportInfo;
}

function createFeedbackStore() {
	const markers = writable<FeedbackMarker[]>(loadFromStorage());
	const preparedMarker = writable<PreparedMarker | null>(null);
	const isActive = writable<boolean>(false);
	const highlightedMarkerId = writable<string | null>(null);

	// Persist on change
	markers.subscribe((value) => {
		saveToStorage(value);
	});

	// ─────────────────────────────────────────────────────────────
	// Marker creation
	// ─────────────────────────────────────────────────────────────

	function getNextMarkerNumber(pagePath: string): number {
		const currentMarkers = get(markers);
		const pageMarkers = currentMarkers.filter((m) => m.pagePath === pagePath);
		if (pageMarkers.length === 0) return 1;
		return Math.max(...pageMarkers.map((m) => m.number)) + 1;
	}

	/**
	 * Prépare un marker après clic sur un élément
	 * Le marker n'est pas encore sauvegardé - attend le commentaire
	 */
	function prepareMarker(element: HTMLElement, offsetX: number, offsetY: number): void {
		const rect = element.getBoundingClientRect();
		const xPercent = ((rect.left + offsetX) / window.innerWidth) * 100;
		const yPercent = ((rect.top + offsetY) / window.innerHeight) * 100;

		const anchor: ElementAnchor = {
			selector: generateSelector(element),
			xpath: generateXPath(element),
			innerText: element.innerText?.substring(0, 50),
			tagName: element.tagName.toLowerCase(),
			offsetX,
			offsetY
		};

		preparedMarker.set({
			element,
			anchor,
			fallbackPosition: { xPercent, yPercent },
			viewport: getViewportInfo()
		});
	}

	/**
	 * Sauvegarde le marker préparé avec un commentaire initial (optionnel)
	 */
	function saveMarker(comment: string): FeedbackMarker | null {
		const prepared = get(preparedMarker);
		if (!prepared) return null;

		const pagePath = window.location.pathname;
		const marker: FeedbackMarker = {
			id: `feedback-${generateId()}`,
			pageUrl: window.location.href,
			pagePath,
			number: getNextMarkerNumber(pagePath),
			anchor: prepared.anchor,
			fallbackPosition: prepared.fallbackPosition,
			viewport: prepared.viewport,
			status: 'open',
			comments: comment.trim()
				? [
						{
							id: `comment-${generateId()}`,
							author: 'User',
							content: comment.trim(),
							createdAt: new Date().toISOString()
						}
					]
				: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userAgent: navigator.userAgent
		};

		markers.update((current) => [...current, marker]);
		preparedMarker.set(null);
		isActive.set(false);

		// Notifier le parent
		notifyParent({ type: 'FEEDBACK_MARKER_CREATED', marker });

		return marker;
	}

	function cancelPreparedMarker(): void {
		preparedMarker.set(null);
	}

	// ─────────────────────────────────────────────────────────────
	// Marker modification
	// ─────────────────────────────────────────────────────────────

	/**
	 * Change le status d'un marker
	 * @param fromParent - true si la commande vient du parent (évite boucle infinie)
	 */
	function setStatus(markerId: string, status: MarkerStatus, fromParent = false): void {
		let updatedMarker: FeedbackMarker | null = null;

		markers.update((current) =>
			current.map((m) => {
				if (m.id === markerId) {
					updatedMarker = { ...m, status, updatedAt: new Date().toISOString() };
					return updatedMarker;
				}
				return m;
			})
		);

		if (updatedMarker) {
			if (fromParent) {
				notifyParent({
					type: 'FEEDBACK_ACTION_CONFIRMED',
					action: 'status_updated',
					markerId,
					success: true
				});
			} else {
				notifyParent({ type: 'FEEDBACK_MARKER_UPDATED', marker: updatedMarker });
			}
		}
	}

	/**
	 * Ajoute un commentaire à un marker
	 * @param fromParent - true si la commande vient du parent
	 */
	function addComment(
		markerId: string,
		content: string,
		author = 'User',
		fromParent = false
	): FeedbackComment | null {
		if (!content.trim()) return null;

		const comment: FeedbackComment = {
			id: `comment-${generateId()}`,
			author,
			content: content.trim(),
			createdAt: new Date().toISOString()
		};

		let updatedMarker: FeedbackMarker | null = null;

		markers.update((current) =>
			current.map((m) => {
				if (m.id === markerId) {
					updatedMarker = {
						...m,
						comments: [...m.comments, comment],
						updatedAt: new Date().toISOString()
					};
					return updatedMarker;
				}
				return m;
			})
		);

		if (updatedMarker) {
			if (fromParent) {
				notifyParent({
					type: 'FEEDBACK_ACTION_CONFIRMED',
					action: 'comment_added',
					markerId,
					success: true
				});
			} else {
				notifyParent({ type: 'FEEDBACK_MARKER_UPDATED', marker: updatedMarker });
			}
		}

		return comment;
	}

	/**
	 * Supprime un marker
	 * @param fromParent - true si la commande vient du parent
	 */
	function deleteMarker(markerId: string, fromParent = false): void {
		markers.update((current) => current.filter((m) => m.id !== markerId));

		if (fromParent) {
			notifyParent({
				type: 'FEEDBACK_ACTION_CONFIRMED',
				action: 'marker_deleted',
				markerId,
				success: true
			});
		} else {
			notifyParent({ type: 'FEEDBACK_MARKER_DELETED', markerId });
		}
	}

	// ─────────────────────────────────────────────────────────────
	// Queries & export
	// ─────────────────────────────────────────────────────────────

	function exportAll(): FeedbackMarker[] {
		return get(markers);
	}

	function exportForPage(pagePath: string): FeedbackMarker[] {
		return get(markers).filter((m) => m.pagePath === pagePath);
	}

	function getMarkerById(markerId: string): FeedbackMarker | undefined {
		return get(markers).find((m) => m.id === markerId);
	}

	function getMarkersForCurrentPage(): FeedbackMarker[] {
		if (!browser) return [];
		return exportForPage(window.location.pathname);
	}

	/**
	 * Envoie les markers au parent (réponse à GET_MARKERS)
	 */
	function sendMarkersToParent(pagePath?: string): void {
		const markersToSend = pagePath ? exportForPage(pagePath) : exportAll();
		notifyParent({ type: 'FEEDBACK_MARKERS_RESPONSE', markers: markersToSend });
	}

	// ─────────────────────────────────────────────────────────────
	// UI state
	// ─────────────────────────────────────────────────────────────

	function toggleActive(): void {
		const currentActive = get(isActive);
		if (currentActive) {
			preparedMarker.set(null);
		}
		isActive.set(!currentActive);
	}

	function setHighlightedMarker(markerId: string | null): void {
		highlightedMarkerId.set(markerId);
	}

	function clearAll(): void {
		markers.set([]);
	}

	return {
		// Stores
		markers,
		preparedMarker,
		isActive,
		highlightedMarkerId,

		// Creation
		prepareMarker,
		saveMarker,
		cancelPreparedMarker,

		// Modification
		setStatus,
		addComment,
		deleteMarker,

		// Queries
		exportAll,
		exportForPage,
		getMarkerById,
		getMarkersForCurrentPage,
		sendMarkersToParent,

		// UI
		toggleActive,
		setHighlightedMarker,
		clearAll
	};
}

export const feedbackStore = createFeedbackStore();
