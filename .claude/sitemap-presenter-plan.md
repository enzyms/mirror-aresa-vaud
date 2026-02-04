Implémente un outil de feedback/annotation "inspecteur" pour cette app SvelteKit.
   Cet outil permet de placer des marqueurs ancrés aux éléments DOM, avec          
  commentaires, et communique avec une app parente (sitemap-presenter) via         
  postMessage.                                                                     
                                                                                   
  ## Architecture                                                                  
                                                                                   
  ┌─────────────────────────────────────────────────────────────────┐              
  │                         App Aresa                               │              
  │                                                                 │              
  │  ┌──────────────────────────────────────────────────────────┐  │               
  │  │                   FeedbackTool.svelte                     │  │              
  │  │                                                           │  │              
  │  │  1. Bouton toggle (fixed bottom-right, orange)           │  │               
  │  │  2. Mode actif → highlight éléments au survol            │  │               
  │  │  3. Clic élément → popup commentaire sous l'élément      │  │               
  │  │  4. Save → marker ancré créé + notifie parent            │  │               
  │  │                                                           │  │              
  │  │  ┌─────────────────────────────────────────────────────┐ │  │               
  │  │  │  MarkerDisplay.svelte (pour chaque marker)          │ │  │               
  │  │  │  - Pin numéroté ancré à l'élément DOM               │ │  │               
  │  │  │  - Bouton resolve (top-right du pin)                │ │  │               
  │  │  │  - Panel expandable: commentaires + input           │ │  │               
  │  │  │  - Se repositionne au scroll/resize                 │ │  │               
  │  │  └─────────────────────────────────────────────────────┘ │  │               
  │  └──────────────────────────────────────────────────────────┘  │               
  │                              ↕                                  │              
  │                    postMessage bidirectionnel                   │              
  │                              ↕                                  │              
  │  ┌──────────────────────────────────────────────────────────┐  │               
  │  │  Parent commands:           App notifications:            │  │              
  │  │  • GET_MARKERS              • MARKERS_RESPONSE            │  │              
  │  │  • UPDATE_STATUS            • MARKER_CREATED              │  │              
  │  │  • ADD_COMMENT              • MARKER_UPDATED              │  │              
  │  │  • DELETE_MARKER            • MARKER_DELETED              │  │              
  │  │  • HIGHLIGHT_MARKER         • ACTION_CONFIRMED            │  │              
  │  └──────────────────────────────────────────────────────────┘  │               
  │                                                                 │              
  │                    localStorage (persistence)                   │              
  └─────────────────────────────────────────────────────────────────┘              
                                                                                   
  ---                                                                              
                                                                                   
  ## FICHIER 1: src/lib/types/feedback.ts                                          
                                                                                   
  ```typescript                                                                    
  export type MarkerStatus = 'open' | 'resolved';                                  
                                                                                   
  export interface FeedbackComment {                                               
        id: string;                                                                
        author: string;                                                            
        content: string;                                                           
        createdAt: string;                                                         
  }                                                                                
                                                                                   
  export interface ElementAnchor {                                                 
        selector: string;      // CSS selector unique (ex: "#header >              
  nav.main:nth-of-type(1)")                                                        
        xpath: string;         // XPath comme fallback                             
        innerText?: string;    // Premiers 50 chars pour vérification              
        tagName: string;       // ex: "button", "div"                              
        offsetX: number;       // Position X du clic relative à l'élément          
        offsetY: number;       // Position Y du clic relative à l'élément          
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
        pageUrl: string;       // URL complète                                     
        pagePath: string;      // Pathname uniquement                              
        number: number;        // Numéro affiché (1, 2, 3...)                      
        anchor: ElementAnchor;                                                     
        fallbackPosition: { xPercent: number; yPercent: number }; // Si élément non
  trouvé                                                                           
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
                                                                                   
  ---                                                                              
  FICHIER 2: src/lib/stores/feedback.ts                                            
                                                                                   
  import { writable, get } from 'svelte/store';                                    
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
                                                                                   
        while (current && current !== document.body && current !==                 
  document.documentElement) {                                                      
                let selector = current.tagName.toLowerCase();                      
                                                                                   
                if (current.id) {                                                  
                        path.unshift(`#${CSS.escape(current.id)}`);                
                        break;                                                     
                }                                                                  
                                                                                   
                // Filtrer les classes dynamiques (svelte-, s-, _, js-, chiffres)  
                const classes = Array.from(current.classList)                      
                        .filter((c) => !c.match(/^(svelte-|s-|_|js-)/i) && !c.match
                        .slice(0, 2);                                              
                if (classes.length > 0) {                                          
                        selector += `.${classes.map((c) => CSS.escape(c)).join('.')
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
                        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeN
  current.nodeName) {                                                              
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
        if (window.parent && window.parent !== window) {                           
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
                const pageMarkers = currentMarkers.filter((m) => m.pagePath === pag
                if (pageMarkers.length === 0) return 1;                            
                return Math.max(...pageMarkers.map((m) => m.number)) + 1;          
        }                                                                          
                                                                                   
        /**                                                                        
         * Prépare un marker après clic sur un élément                             
         * Le marker n'est pas encore sauvegardé - attend le commentaire           
         */                                                                        
        function prepareMarker(element: HTMLElement, offsetX: number, offsetY: numb
  void {                                                                           
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
                                                        id: `comment-${generateId()
                                                        author: 'User',            
                                                        content: comment.trim(),   
                                                        createdAt: new Date().toISO
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
         * @param fromParent - true si la commande vient du parent (évite boucle in
         */                                                                        
        function setStatus(markerId: string, status: MarkerStatus, fromParent = fal
  void {                                                                           
                let updatedMarker: FeedbackMarker | null = null;                   
                                                                                   
                markers.update((current) =>                                        
                        current.map((m) => {                                       
                                if (m.id === markerId) {                           
                                        updatedMarker = { ...m, status, updatedAt: 
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
                                notifyParent({ type: 'FEEDBACK_MARKER_UPDATED', mar
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
                                notifyParent({ type: 'FEEDBACK_MARKER_UPDATED', mar
                        }                                                          
                }                                                                  
                                                                                   
                return comment;                                                    
        }                                                                          
                                                                                   
        /**                                                                        
         * Supprime un marker                                                      
         * @param fromParent - true si la commande vient du parent                 
         */                                                                        
        function deleteMarker(markerId: string, fromParent = false): void {        
                markers.update((current) => current.filter((m) => m.id !== markerId
                                                                                   
                if (fromParent) {                                                  
                        notifyParent({                                             
                                type: 'FEEDBACK_ACTION_CONFIRMED',                 
                                action: 'marker_deleted',                          
                                markerId,                                          
                                success: true                                      
                        });                                                        
                } else {                                                           
                        notifyParent({ type: 'FEEDBACK_MARKER_DELETED', markerId })
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
                return exportForPage(window.location.pathname);                    
        }                                                                          
                                                                                   
        /**                                                                        
         * Envoie les markers au parent (réponse à GET_MARKERS)                    
         */                                                                        
        function sendMarkersToParent(pagePath?: string): void {                    
                const markersToSend = pagePath ? exportForPage(pagePath) : exportAl
                notifyParent({ type: 'FEEDBACK_MARKERS_RESPONSE', markers: markersT
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
                                                                                   
  ---                                                                              
  FICHIER 3: src/lib/components/feedback/MarkerDisplay.svelte                      
                                                                                   
  Composant pour afficher UN marker ancré à un élément DOM.                        
                                                                                   
  Props:                                                                           
  - marker: FeedbackMarker - le marker à afficher                                  
  - isHighlighted: boolean - true si ce marker doit être mis en évidence (depuis   
  parent)                                                                          
                                                                                   
  Fonctionnalités:                                                                 
  1. Trouve l'élément DOM via selector CSS, fallback sur XPath                     
  2. Se positionne relativement à l'élément (anchor.offsetX, anchor.offsetY)       
  3. Si élément non trouvé → utilise fallbackPosition (pourcentage du viewport)    
  4. Se repositionne au scroll et resize (throttled avec requestAnimationFrame)    
  5. Pin rond numéroté (orange si open, vert si resolved)                          
  6. Petit bouton checkmark en top-right pour toggle le status                     
  7. Au clic sur le pin → expand/collapse le panel de détail                       
  8. Panel de détail contient:                                                     
    - Liste des commentaires existants (scrollable si > 3)                         
    - Input pour ajouter un nouveau commentaire                                    
    - Bouton delete                                                                
  9. Si isHighlighted → scroll l'élément dans la vue + style différent (ring)      
                                                                                   
  Style:                                                                           
  - Pin: w-8 h-8 rounded-full, border-2 border-white, shadow-lg                    
  - Orange: bg-orange-500 (open), Vert: bg-green-500 (resolved)                    
  - Panel: bg-white rounded-lg shadow-xl border, w-72, positioned below pin        
  - Utiliser z-[99999] pour être au-dessus de tout                                 
  - Ajouter data-feedback-tool="marker" sur le container                           
                                                                                   
  ---                                                                              
  FICHIER 4: src/lib/components/feedback/FeedbackTool.svelte                       
                                                                                   
  Composant principal qui orchestre tout.                                          
                                                                                   
  State:                                                                           
  - hoveredElement: HTMLElement | null - élément survolé                           
  - commentText: string - texte du commentaire en cours                            
  - commentPosition: {x, y} | null - position du popup de commentaire              
                                                                                   
  Stores utilisés:                                                                 
  - feedbackStore.isActive - mode feedback actif                                   
  - feedbackStore.preparedMarker - marker en préparation                           
  - feedbackStore.markers - tous les markers                                       
  - feedbackStore.highlightedMarkerId - marker à highlight (depuis parent)         
                                                                                   
  Logique:                                                                         
                                                                                   
  1. Bouton toggle (fixed bottom-right):                                           
    - Position: fixed bottom-6 right-6 z-[99999]                                   
    - Taille: w-14 h-14 rounded-full shadow-lg                                     
    - Couleur: orange quand inactif, gris foncé quand actif                        
    - Icône: bulle de commentaire (inactif) / X (actif)                            
    - Badge avec count des markers de la page courante                             
  2. Capture layer (quand actif):                                                  
    - fixed inset-0 z-[99990] cursor-crosshair                                     
    - Intercepte mousemove et click                                                
    - Ne PAS intercepter les clics sur les éléments du tool (data-feedback-tool)   
  3. Highlight au survol:                                                          
    - Ajouter dynamiquement des styles à hoveredElement:                           
    outline: 2px solid rgb(249, 115, 22);                                          
  outline-offset: 2px;                                                             
  background-color: rgba(249, 115, 22, 0.05);                                      
  transition: all 120ms ease-out;                                                  
    - Retirer les styles quand on quitte l'élément ou désactive                    
  4. Clic sur élément:                                                             
    - event.preventDefault() et event.stopPropagation()                            
    - Calculer offsetX/offsetY relatifs à l'élément                                
    - Appeler feedbackStore.prepareMarker(element, offsetX, offsetY)               
    - Afficher le popup de commentaire sous l'élément                              
    - Garder le highlight (plus intense: background 0.1 au lieu de 0.05)           
  5. Popup de commentaire (quand preparedMarker existe):                           
    - Position: sous le point cliqué, centré horizontalement                       
    - Contenu:                                                                     
        - Texte "Selected: {tagName}"                                              
      - Input text pour le commentaire (placeholder: "Add a comment (optional)...")
      - Boutons Cancel / Save marker                                               
      - Texte "Press Enter to save, Esc to cancel"                                 
    - Shortcuts: Enter = save, Escape = cancel                                     
    - Auto-focus l'input                                                           
  6. Affichage des markers:                                                        
    - Filtrer par page courante: markers.filter(m => m.pagePath ===                
  $page.url.pathname)                                                              
    - Pour chaque marker, render <MarkerDisplay {marker} isHighlighted={marker.id  
  === $highlightedMarkerId} />                                                     
  7. Indicateur mode actif:                                                        
    - Barre en haut de l'écran: "Feedback mode active - Click on any element [Esc]"
    - fixed top-4 left-1/2 -translate-x-1/2 z-[99999]                              
    - Background orange avec texte blanc                                           
  8. Keyboard shortcuts:                                                           
    - Escape: si preparedMarker → cancel, sinon si isActive → désactiver           
                                                                                   
  Helper function:                                                                 
  function isToolElement(element: HTMLElement): boolean {                          
      return !!element.closest('[data-feedback-tool]');                            
  }                                                                                
                                                                                   
  ---                                                                              
  FICHIER 5: Modifier src/routes/+layout.svelte                                    
                                                                                   
  <script lang="ts">                                                               
      import { onMount } from 'svelte';                                            
      import { browser } from '$app/environment';                                  
      import FeedbackTool from '$lib/components/feedback/FeedbackTool.svelte';     
      import { feedbackStore } from '$lib/stores/feedback';                        
      import type { ParentToAppMessage } from '$lib/types/feedback';               
                                                                                   
      let { children } = $props();                                                 
                                                                                   
      onMount(() => {                                                              
          if (!browser) return;                                                    
                                                                                   
          function handleMessage(event: MessageEvent): void {                      
              const data = event.data as ParentToAppMessage | undefined;           
              if (!data?.type?.startsWith('FEEDBACK_')) return;                    
                                                                                   
              switch (data.type) {                                                 
                  case 'FEEDBACK_GET_MARKERS':                                     
                      feedbackStore.sendMarkersToParent(data.pagePath);            
                      break;                                                       
                  case 'FEEDBACK_UPDATE_STATUS':                                   
                      feedbackStore.setStatus(data.markerId, data.status, true);   
                      break;                                                       
                  case 'FEEDBACK_ADD_COMMENT':                                     
                      feedbackStore.addComment(data.markerId, data.content,        
  data.author, true);                                                              
                      break;                                                       
                  case 'FEEDBACK_DELETE_MARKER':                                   
                      feedbackStore.deleteMarker(data.markerId, true);             
                      break;                                                       
                  case 'FEEDBACK_HIGHLIGHT_MARKER':                                
                      feedbackStore.setHighlightedMarker(data.markerId);           
                      break;                                                       
              }                                                                    
          }                                                                        
                                                                                   
          window.addEventListener('message', handleMessage);                       
          return () => window.removeEventListener('message', handleMessage);       
      });                                                                          
  </script>                                                                        
                                                                                   
  {@render children()}                                                             
  <FeedbackTool />                                                                 
                                                                                   
  ---                                                                              
  Checklist de vérification                                                        
                                                                                   
  Création de marker:                                                              
                                                                                   
  - Bouton orange visible en bas à droite                                          
  - Clic sur bouton → mode actif (indicateur en haut)                              
  - Survol d'éléments → highlight orange avec transition 120ms                     
  - Clic sur élément → highlight persiste + popup commentaire apparaît             
  - Input auto-focusé                                                              
  - Enter → sauvegarde (même si commentaire vide)                                  
  - Escape → annule, mode reste actif                                              
  - Marker créé visible avec numéro                                                
                                                                                   
  Affichage des markers:                                                           
                                                                                   
  - Pin ancré à l'élément                                                          
  - Scroll → pin suit l'élément                                                    
  - Resize → pin se repositionne                                                   
  - Clic pin → panel avec commentaires                                             
  - Bouton resolve → toggle status (orange ↔ vert)                                 
  - Input commentaire dans panel → ajoute commentaire                              
  - Delete → supprime le marker                                                    
                                                                                   
  Communication parent:                                                            
                                                                                   
  - Création marker → notifie parent (MARKER_CREATED)                              
  - Modification → notifie parent (MARKER_UPDATED)                                 
  - Suppression → notifie parent (MARKER_DELETED)                                  
  - Parent demande markers → répond (MARKERS_RESPONSE)                             
  - Parent modifie status → applique + confirme                                    
  - Parent ajoute commentaire → applique + confirme                                
  - Parent supprime → applique + confirme                                          
  - Parent highlight → scroll to + style                                           
                                                                                   
  Persistence:                                                                     
                                                                                   
  - Markers sauvés dans localStorage                                               
  - Reload page → markers toujours là                                              
  - Markers filtrés par page courante                                              
                                                                                   
  ---                                                                              
  Notes techniques importantes                                                     
                                                                                   
  1. Z-index: Tous les éléments du tool doivent utiliser z-[99999] ou plus         
  2. data-feedback-tool: Attribut obligatoire sur TOUS les éléments du tool pour   
  les exclure du highlight                                                         
  3. Throttling: Le repositionnement au scroll doit utiliser requestAnimationFrame 
  4. fromParent flag: Évite les boucles infinies de notifications                  
  5. CSS escape: Utiliser CSS.escape() pour les sélecteurs avec caractères spéciaux
                                                       