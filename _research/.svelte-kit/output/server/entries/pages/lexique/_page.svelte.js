import { y as ensure_array_like } from "../../../chunks/index.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer) {
  const lexique = [
    {
      term: "AD",
      definition: "Ambulancier Diplômé - Paramédic certifié ES"
    },
    {
      term: "TA",
      definition: "Technicien Ambulancier - Support technique"
    },
    {
      term: "SMUR",
      definition: "Service Mobile d'Urgence et de Réanimation"
    },
    {
      term: "CASU",
      definition: "Centrale d'Appels Sanitaires Urgents (144)"
    },
    {
      term: "P1",
      definition: "Priorité 1 - Urgence vitale (feux bleus)"
    },
    { term: "P2", definition: "Priorité 2 - Urgence relative" },
    { term: "P3", definition: "Priorité 3 - Transport sanitaire" },
    {
      term: "FIP",
      definition: "Fiche d'Intervention Préhospitalière"
    },
    {
      term: "CHUV",
      definition: "Centre Hospitalier Universitaire Vaudois"
    },
    { term: "EHC", definition: "Ensemble Hospitalier de la Côte" },
    { term: "HIB", definition: "Hôpital Intercantonal de la Broye" },
    { term: "RCP", definition: "Réanimation Cardio-Pulmonaire" },
    { term: "DEA", definition: "Défibrillateur Externe Automatisé" },
    { term: "ECG", definition: "Électrocardiogramme" },
    { term: "SpO2", definition: "Saturation en Oxygène" },
    { term: "TA (med)", definition: "Tension Artérielle" },
    {
      term: "GCS",
      definition: "Glasgow Coma Scale - Échelle de Glasgow"
    },
    { term: "AVP", definition: "Accident de la Voie Publique" },
    {
      term: "DPS",
      definition: "Dispositif Prévisionnel de Secours"
    },
    { term: "PMA", definition: "Poste Médical Avancé" },
    {
      term: "REGA",
      definition: "Garde Aérienne Suisse de Sauvetage"
    },
    { term: "ES", definition: "École Supérieure (formation AD)" },
    {
      term: "OdA",
      definition: "Organisation du monde du travail Santé"
    },
    {
      term: "OFSP",
      definition: "Office Fédéral de la Santé Publique"
    }
  ];
  $$renderer.push(`<div class="page svelte-178jyli"><header class="svelte-178jyli"><a href="/" class="back-link svelte-178jyli">← Retour</a> <h1 class="svelte-178jyli">Lexique</h1> <p class="subtitle svelte-178jyli">Acronymes et termes utilisés</p></header> <div class="lexique-list svelte-178jyli"><!--[-->`);
  const each_array = ensure_array_like(lexique);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$renderer.push(`<div class="lexique-item svelte-178jyli"><span class="term svelte-178jyli">${escape_html(item.term)}</span> <span class="definition svelte-178jyli">${escape_html(item.definition)}</span></div>`);
  }
  $$renderer.push(`<!--]--></div></div>`);
}
export {
  _page as default
};
