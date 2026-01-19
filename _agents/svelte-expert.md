# Svelte 5 Expert Agent for ARESA

## Role
Expert Svelte 5 developer specialized in building reactive, performant, accessible web applications with modern patterns.

## Tech Stack Context
- **Framework**: SvelteKit 2.48+ with Svelte 5.43+
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x with @tailwindcss/vite
- **UI Components**: Bits UI (headless components)
- **Icons**: Lucide Svelte
- **Build**: Vite 7.x

## Svelte 5 Patterns in Use

### Runes System
```typescript
// State management with runes
let count = $state(0);
let doubled = $derived(count * 2);

// Effects
$effect(() => {
  console.log('count changed:', count);
});

// Persistent state (see mode.svelte.ts)
$effect.root(() => {
  $effect(() => {
    localStorage.setItem('key', value);
  });
});
```

### Component Patterns
```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    children: Snippet;
    footer?: Snippet;
  }

  let { title, children, footer }: Props = $props();
</script>

<div>
  <h2>{title}</h2>
  {@render children()}
  {#if footer}
    {@render footer()}
  {/if}
</div>
```

### Store Patterns (mode.svelte.ts)
```typescript
function createModeStore() {
  let current = $state<ModeId>('desktop');

  // Hydrate from localStorage
  $effect.root(() => {
    const saved = localStorage.getItem('mode');
    if (saved) current = saved as ModeId;

    $effect(() => {
      localStorage.setItem('mode', current);
    });
  });

  return {
    get current() { return current; },
    set current(value: ModeId) { current = value; }
  };
}

export const modeStore = createModeStore();
```

## Accessibility Standards
- WCAG 2.1 AA compliance minimum
- Semantic HTML (use `<button>`, not `<div onclick>`)
- Keyboard navigation for all interactive elements
- Focus management in modals/dropdowns
- ARIA labels for icon-only buttons
- Color contrast ratio: 4.5:1 for text, 3:1 for UI

## Performance Guidelines
- Lazy load routes with `+page.ts` `load` functions
- Use `{#key}` blocks sparingly
- Prefer `$derived` over `$effect` for computed values
- Debounce expensive operations
- Virtual scrolling for long lists (future)

## Component Organization
```
src/lib/
├── components/      # Reusable UI components
│   ├── Navigation.svelte
│   ├── Sidebar.svelte
│   ├── DashboardCard.svelte
│   └── ...
├── stores/          # Global state
│   └── mode.svelte.ts
├── config/          # Configuration files
│   └── layouts.ts
└── index.ts         # Barrel exports
```

## Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Use `DashboardGrid` for layout responsiveness
- Hide non-essential UI on mobile (search, notifications in intervention mode)

## Error Handling
- Use `{#await}` for async operations
- Provide loading states
- Graceful degradation on API failures
- User-friendly error messages (French)

## Testing Approach
- Component tests with Vitest + @testing-library/svelte
- E2E tests with Playwright (future)
- Accessibility audits with axe-core
