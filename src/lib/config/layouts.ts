import type { ModeId } from '$lib/stores/mode.svelte';

export type BreakpointLayout = string[][]; // Each array is a row, items are columns

export interface ModeLayout {
	lg: BreakpointLayout; // >= 1280px (xl screens and up)
	md?: BreakpointLayout; // >= 768px (tablets) - falls back to lg if not defined
	sm: BreakpointLayout; // < 1280px (below xl)
}

export type DashboardLayouts = Record<ModeId, ModeLayout>;

export const dashboardLayouts: DashboardLayouts = {
	desktop: {
		lg: [
			['kpi-tasks', 'kpi-quality', 'kpi-equipment', 'kpi-meds'],
			['activities', 'quality-reports', 'stock'],
			['logbook', 'shortcuts']
		],
		sm: [
			['kpi-tasks', 'kpi-quality'],
			['kpi-equipment', 'kpi-meds'],
			['activities'],
			['quality-reports'],
			['stock'],
			['logbook'],
			['shortcuts']
		]
	},
	intervention: {
		lg: [
			['intervention-current'],
			['intervention-meds', 'intervention-equipment', 'intervention-quality']
		],
		sm: [
			['intervention-current'],
			['intervention-meds'],
			['intervention-equipment'],
			['intervention-quality']
		]
	}
};

// Helper to get the current layout based on mode and screen size
export function getLayoutForMode(mode: ModeId, breakpoint: 'lg' | 'md' | 'sm'): BreakpointLayout {
	const modeLayout = dashboardLayouts[mode];
	
	if (breakpoint === 'md') {
		return modeLayout.md ?? modeLayout.lg;
	}
	
	return modeLayout[breakpoint];
}

// Get all card IDs used in a mode (for both breakpoints)
export function getCardsForMode(mode: ModeId): string[] {
	const layout = dashboardLayouts[mode];
	const allCards = new Set<string>();
	
	[layout.lg, layout.md, layout.sm].forEach(breakpointLayout => {
		if (breakpointLayout) {
			breakpointLayout.flat().forEach(id => allCards.add(id));
		}
	});
	
	return Array.from(allCards);
}

