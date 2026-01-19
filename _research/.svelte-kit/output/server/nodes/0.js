

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CBYXTqgy.js","_app/immutable/chunks/D6Pc9y0i.js","_app/immutable/chunks/COqEOOc0.js","_app/immutable/chunks/CIHGOeTO.js","_app/immutable/chunks/BG8Pl6mu.js","_app/immutable/chunks/CM7ta1mX.js"];
export const stylesheets = ["_app/immutable/assets/0.SrzBxqeO.css"];
export const fonts = [];
