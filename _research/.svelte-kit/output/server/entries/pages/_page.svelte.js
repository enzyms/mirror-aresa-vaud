import { y as ensure_array_like, z as attr_class, w as attr_style, x as stringify, F as attr } from "../../chunks/index.js";
import { c as checklistStore, a as categories } from "../../chunks/checklist.svelte.js";
import { createClient } from "@supabase/supabase-js";
import { e as escape_html } from "../../chunks/context.js";
const supabaseUrl = "https://puasomqhzewevhlijqwb.supabase.co";
const supabaseAnonKey = "sb_publishable_hyrSTWAKt8LDMaZJy5OeTA_wD7u6LFL";
createClient(supabaseUrl, supabaseAnonKey);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeCategory = "intervention";
    let isRecording = false;
    const categoryItems = checklistStore.getItemsByCategory(activeCategory);
    const currentCategory = categories.find((c) => c.id === activeCategory);
    let expandedQuestions = /* @__PURE__ */ new Set();
    let isExporting = false;
    $$renderer2.push(`<div class="page svelte-1uha8ag"><div class="tabs svelte-1uha8ag"><!--[-->`);
    const each_array = ensure_array_like(categories);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cat = each_array[$$index];
      $$renderer2.push(`<button${attr_class("tab svelte-1uha8ag", void 0, { "active": activeCategory === cat.id })}${attr_style(`--cat-color: ${stringify(cat.color)}`)}><span class="tab-icon svelte-1uha8ag">${escape_html(cat.icon)}</span> <span class="tab-label svelte-1uha8ag">${escape_html(cat.title)}</span> `);
      if (checklistStore.getItemsByCategory(cat.id).filter((i) => i.checked).length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="tab-badge svelte-1uha8ag">${escape_html(checklistStore.getItemsByCategory(cat.id).filter((i) => i.checked).length)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (currentCategory) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="category-header svelte-1uha8ag"${attr_style(`--cat-color: ${stringify(currentCategory.color)}`)}><span class="category-icon svelte-1uha8ag">${escape_html(currentCategory.icon)}</span> <div class="svelte-1uha8ag"><h2 class="svelte-1uha8ag">${escape_html(currentCategory.title)}</h2> <p class="svelte-1uha8ag">${escape_html(currentCategory.description)}</p></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="questions svelte-1uha8ag"><!--[-->`);
    const each_array_1 = ensure_array_like(categoryItems);
    for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
      let item = each_array_1[$$index_2];
      const isExpanded = expandedQuestions.has(item.question.id);
      const hasContent = item.notes.trim() || item.files.length > 0;
      $$renderer2.push(`<div${attr_class("question-card svelte-1uha8ag", void 0, { "checked": item.checked, "expanded": isExpanded })}><button class="question-header svelte-1uha8ag"><label class="checkbox-wrapper svelte-1uha8ag"><input type="checkbox"${attr("checked", item.checked, true)} class="svelte-1uha8ag"/> <span class="checkmark svelte-1uha8ag"></span></label> <div class="question-content svelte-1uha8ag"><p class="question-text svelte-1uha8ag">${escape_html(item.question.text)}</p> `);
      if (hasContent && !isExpanded) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="has-content-badge svelte-1uha8ag">${escape_html(item.notes.trim() ? "📝" : "")}${escape_html(item.files.length > 0 ? ` ${item.files.length} 📎` : "")}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <span${attr_class("expand-icon svelte-1uha8ag", void 0, { "rotated": isExpanded })}>▼</span></button> `);
      if (isExpanded) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="question-body svelte-1uha8ag">`);
        if (item.question.captureHint) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="capture-hint svelte-1uha8ag">💡 ${escape_html(item.question.captureHint)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <textarea placeholder="Notes..." class="svelte-1uha8ag">`);
        const $$body = escape_html(item.notes);
        if ($$body) {
          $$renderer2.push(`${$$body}`);
        }
        $$renderer2.push(`</textarea> <div class="media-buttons svelte-1uha8ag"><button class="media-btn audio svelte-1uha8ag"${attr("disabled", isRecording, true)}>🎤 Audio</button> <button class="media-btn photo svelte-1uha8ag"${attr("disabled", isRecording, true)}>📷 Photo</button></div> `);
        if (item.files.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="files-list svelte-1uha8ag"><!--[-->`);
          const each_array_2 = ensure_array_like(item.files);
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let file = each_array_2[$$index_1];
            $$renderer2.push(`<div${attr_class("file-item svelte-1uha8ag", void 0, { "saved": file.saved })}><span class="file-icon svelte-1uha8ag">${escape_html(file.type === "audio" ? "🎤" : file.type === "video" ? "📹" : "📷")}</span> <span class="file-name svelte-1uha8ag">${escape_html(file.name.split("/").pop())}</span> <button class="btn-delete-file svelte-1uha8ag">🗑️</button> <span class="file-status svelte-1uha8ag">${escape_html(file.saved ? "✅" : "⏳")}</span></div>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="add-section svelte-1uha8ag">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="btn-add-question svelte-1uha8ag">➕ Ajouter une question</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="profiles-section svelte-1uha8ag"><h3 class="svelte-1uha8ag">👤 Profils interviewés</h3> `);
    if (checklistStore.profiles.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="profiles-list svelte-1uha8ag"><!--[-->`);
      const each_array_4 = ensure_array_like(checklistStore.profiles);
      for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
        let profile = each_array_4[$$index_4];
        $$renderer2.push(`<div class="profile-card svelte-1uha8ag"><strong class="svelte-1uha8ag">${escape_html(profile.role)}</strong> <span class="svelte-1uha8ag">${escape_html(profile.experience)} d'expérience</span> <span class="svelte-1uha8ag">Tech: ${escape_html("⭐".repeat(profile.techComfort))}</span> <span class="svelte-1uha8ag">${escape_html(profile.device)}</span></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="btn-add-profile svelte-1uha8ag">➕ Ajouter un profil</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="export-section svelte-1uha8ag"><button class="btn-export svelte-1uha8ag"${attr("disabled", isExporting, true)}>${escape_html("📤 Exporter vers Supabase")}</button> <div class="backup-buttons svelte-1uha8ag"><button class="btn-backup svelte-1uha8ag">📋 Copier données</button> <button class="btn-backup svelte-1uha8ag">👁️ Voir JSON</button></div> <a href="/lexique" class="lexique-link svelte-1uha8ag">📖 Lexique des acronymes</a></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
