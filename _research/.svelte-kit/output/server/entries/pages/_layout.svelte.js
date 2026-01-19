import { w as attr_style, x as stringify } from "../../chunks/index.js";
import { c as checklistStore } from "../../chunks/checklist.svelte.js";
import { e as escape_html } from "../../chunks/context.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    const progress = checklistStore.getProgress();
    $$renderer2.push(`<div class="app svelte-12qhfyh"><header class="svelte-12qhfyh"><div class="header-content svelte-12qhfyh"><h1 class="svelte-12qhfyh">📋 ARESA Research</h1> <div class="progress-bar svelte-12qhfyh"><div class="progress-fill svelte-12qhfyh"${attr_style(`width: ${stringify(progress.checked / progress.total * 100)}%`)}></div></div> <div class="progress-stats svelte-12qhfyh"><span>${escape_html(progress.checked)}/${escape_html(progress.total)} complétés</span> <span>${escape_html(progress.withNotes)} notes</span> <span>${escape_html(progress.withFiles)} fichiers</span></div></div></header> <main class="svelte-12qhfyh">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main></div>`);
  });
}
export {
  _layout as default
};
