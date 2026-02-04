export type MarkerStatus = 'open' | 'resolved';

export interface FeedbackComment {
	id: string;
	author: string;
	content: string;
	createdAt: string;
}

export interface ElementAnchor {
	selector: string; // CSS selector unique (ex: "#header > nav.main:nth-of-type(1)")
	xpath: string; // XPath comme fallback
	innerText?: string; // Premiers 50 chars pour vérification
	tagName: string; // ex: "button", "div"
	offsetX: number; // Position X du clic relative à l'élément
	offsetY: number; // Position Y du clic relative à l'élément
}

export interface ViewportInfo {
	width: number;
	height: number;
	scrollX: number;
	scrollY: number;
	devicePixelRatio: number;
	timestamp: string;
}

export interface FeedbackMarker {
	id: string;
	pageUrl: string; // URL complète
	pagePath: string; // Pathname uniquement
	number: number; // Numéro affiché (1, 2, 3...)
	anchor: ElementAnchor;
	fallbackPosition: { xPercent: number; yPercent: number }; // Si élément non trouvé
	viewport: ViewportInfo;
	status: MarkerStatus;
	comments: FeedbackComment[];
	createdAt: string;
	updatedAt: string;
	userAgent?: string;
}

// ═══════════════════════════════════════════════════════════════
// Messages FROM parent (sitemap-presenter) TO this app
// ═══════════════════════════════════════════════════════════════

export interface GetMarkersMessage {
	type: 'FEEDBACK_GET_MARKERS';
	pagePath?: string; // Si fourni, filtre par page
}

export interface UpdateStatusMessage {
	type: 'FEEDBACK_UPDATE_STATUS';
	markerId: string;
	status: MarkerStatus;
}

export interface AddCommentMessage {
	type: 'FEEDBACK_ADD_COMMENT';
	markerId: string;
	content: string;
	author?: string;
}

export interface DeleteMarkerMessage {
	type: 'FEEDBACK_DELETE_MARKER';
	markerId: string;
}

export interface HighlightMarkerMessage {
	type: 'FEEDBACK_HIGHLIGHT_MARKER';
	markerId: string | null; // null = désélectionner
}

export type ParentToAppMessage =
	| GetMarkersMessage
	| UpdateStatusMessage
	| AddCommentMessage
	| DeleteMarkerMessage
	| HighlightMarkerMessage;

// ═══════════════════════════════════════════════════════════════
// Messages FROM this app TO parent (sitemap-presenter)
// ═══════════════════════════════════════════════════════════════

export interface MarkersResponseMessage {
	type: 'FEEDBACK_MARKERS_RESPONSE';
	markers: FeedbackMarker[];
}

export interface MarkerCreatedMessage {
	type: 'FEEDBACK_MARKER_CREATED';
	marker: FeedbackMarker;
}

export interface MarkerUpdatedMessage {
	type: 'FEEDBACK_MARKER_UPDATED';
	marker: FeedbackMarker;
}

export interface MarkerDeletedMessage {
	type: 'FEEDBACK_MARKER_DELETED';
	markerId: string;
}

export interface ActionConfirmMessage {
	type: 'FEEDBACK_ACTION_CONFIRMED';
	action: 'status_updated' | 'comment_added' | 'marker_deleted';
	markerId: string;
	success: boolean;
}

export type AppToParentMessage =
	| MarkersResponseMessage
	| MarkerCreatedMessage
	| MarkerUpdatedMessage
	| MarkerDeletedMessage
	| ActionConfirmMessage;
