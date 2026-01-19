import "clsx";
const categories = [
  {
    id: "general",
    title: "Général",
    icon: "👋",
    color: "#059669",
    description: "Introduction et contexte"
  },
  {
    id: "environment",
    title: "Environnement",
    icon: "📍",
    color: "#8b5cf6",
    description: "Contexte physique et lieux de travail"
  },
  {
    id: "intervention",
    title: "Intervention",
    icon: "🚑",
    color: "#ef4444",
    description: "Déroulement des missions"
  },
  {
    id: "medication",
    title: "Médicaments",
    icon: "💊",
    color: "#10b981",
    description: "Gestion et traçabilité"
  },
  {
    id: "equipment",
    title: "Équipement",
    icon: "🔧",
    color: "#f59e0b",
    description: "Matériel et véhicule"
  },
  {
    id: "quality",
    title: "Qualité",
    icon: "✅",
    color: "#3b82f6",
    description: "Signalements et incidents"
  },
  {
    id: "handoff",
    title: "Relève",
    icon: "🔄",
    color: "#06b6d4",
    description: "Transmission entre équipes"
  },
  {
    id: "students",
    title: "Formation",
    icon: "🎓",
    color: "#ec4899",
    description: "Étudiants et apprentissage"
  },
  {
    id: "multisite",
    title: "Multi-sites",
    icon: "🏢",
    color: "#6366f1",
    description: "Travail entre bases"
  },
  {
    id: "painpoints",
    title: "Frustrations",
    icon: "😤",
    color: "#dc2626",
    description: "Ce qui ne fonctionne pas"
  },
  {
    id: "custom",
    title: "Notes libres",
    icon: "📝",
    color: "#64748b",
    description: "Observations spontanées"
  }
];
const defaultQuestions = [
  // GENERAL
  {
    id: "gen-1",
    category: "general",
    text: "Quel est votre rôle? (AD, TA, étudiant, autre)",
    type: "interview"
  },
  {
    id: "gen-2",
    category: "general",
    text: "Depuis combien de temps travaillez-vous ici?",
    type: "interview"
  },
  {
    id: "gen-3",
    category: "general",
    text: "C'est quoi une journée typique pour vous?",
    type: "interview",
    captureHint: "Laisser raconter"
  },
  {
    id: "gen-4",
    category: "general",
    text: "Combien de personnes travaillent sur cette base?",
    type: "interview"
  },
  {
    id: "gen-5",
    category: "general",
    text: "Quels sont les différents rôles dans l'équipe?",
    type: "interview"
  },
  {
    id: "gen-6",
    category: "general",
    text: "Description des locaux - entrée, vestiaires, salle de repos",
    type: "observation",
    captureHint: "Photos des espaces"
  },
  {
    id: "gen-7",
    category: "general",
    text: "Où sont garées les ambulances?",
    type: "observation",
    captureHint: "Photo"
  },
  {
    id: "gen-8",
    category: "general",
    text: "Comment s'organise une garde? Horaires, rotations?",
    type: "interview"
  },
  // ENVIRONMENT
  {
    id: "env-1",
    category: "environment",
    text: "Où posez-vous votre téléphone ou tablette dans l'ambulance?",
    type: "interview",
    captureHint: "Photo"
  },
  {
    id: "env-2",
    category: "environment",
    text: "La luminosité pose problème pour lire un écran? Jour et nuit?",
    type: "interview",
    captureHint: "Photo"
  },
  {
    id: "env-3",
    category: "environment",
    text: "Et sur le terrain, vous posez vos appareils où?",
    type: "interview",
    captureHint: "Photo"
  },
  {
    id: "env-4",
    category: "environment",
    text: "Vous portez des gants quand vous utilisez un écran?",
    type: "interview"
  },
  {
    id: "env-5",
    category: "environment",
    text: "Quels écrans ou appareils avez-vous déjà dans l'ambulance?",
    type: "interview",
    captureHint: "Photo"
  },
  {
    id: "env-6",
    category: "environment",
    text: "Montrez-moi votre poste de travail à la base.",
    type: "interview",
    captureHint: "Photo"
  },
  {
    id: "env-7",
    category: "environment",
    text: "Comment sont rangés les médicaments?",
    type: "interview",
    captureHint: "Photo"
  },
  {
    id: "env-8",
    category: "environment",
    text: "Comment savez-vous où se trouve chaque équipement?",
    type: "interview"
  },
  // INTERVENTION
  {
    id: "int-1",
    category: "intervention",
    text: "Racontez-moi une intervention typique, de l'appel jusqu'au retour.",
    type: "interview",
    captureHint: "Laisser raconter"
  },
  {
    id: "int-2",
    category: "intervention",
    text: "Quand vous recevez un appel, c'est quoi la première info que vous regardez?",
    type: "interview"
  },
  {
    id: "int-3",
    category: "intervention",
    text: "Comment notez-vous les heures pendant une intervention?",
    type: "interview"
  },
  {
    id: "int-4",
    category: "intervention",
    text: "Quand vous donnez un médicament, vous le notez tout de suite ou après?",
    type: "interview",
    captureHint: "Question clé"
  },
  {
    id: "int-5",
    category: "intervention",
    text: "Qu'est-ce que vous devez absolument noter rapidement?",
    type: "interview"
  },
  {
    id: "int-6",
    category: "intervention",
    text: "L'heure de départ, vous la notez quand exactement?",
    type: "observation"
  },
  {
    id: "int-7",
    category: "intervention",
    text: "Vous notez l'arrivée sur place? Et à l'hôpital?",
    type: "interview"
  },
  {
    id: "int-8",
    category: "intervention",
    text: "Quelles actions rapides vous manquent dans votre système?",
    type: "interview"
  },
  // MEDICATION
  {
    id: "med-1",
    category: "medication",
    text: "Comment notez-vous les médicaments utilisés pendant une intervention?",
    type: "interview"
  },
  {
    id: "med-2",
    category: "medication",
    text: "Pour les stupéfiants, c'est quoi le processus?",
    type: "interview",
    captureHint: "Compliance"
  },
  {
    id: "med-3",
    category: "medication",
    text: "Ça arrive souvent d'avoir des écarts de stock?",
    type: "interview"
  },
  {
    id: "med-4",
    category: "medication",
    text: "Comment êtes-vous alerté quand il manque quelque chose?",
    type: "interview"
  },
  {
    id: "med-5",
    category: "medication",
    text: "Comment reliez-vous le médicament au dossier patient?",
    type: "interview"
  },
  {
    id: "med-6",
    category: "medication",
    text: "Qu'est-ce qui vous agace le plus dans la documentation des médicaments?",
    type: "interview"
  },
  {
    id: "med-7",
    category: "medication",
    text: "Vous saisissez parfois la même info plusieurs fois?",
    type: "interview"
  },
  // EQUIPMENT
  {
    id: "equip-1",
    category: "equipment",
    text: "Comment vérifiez-vous que tout est en ordre au début du service?",
    type: "interview",
    captureHint: "Photo checklist"
  },
  {
    id: "equip-2",
    category: "equipment",
    text: "Comment voyez-vous le niveau d'oxygène?",
    type: "interview",
    captureHint: "Photo"
  },
  {
    id: "equip-3",
    category: "equipment",
    text: "Le défibrillateur, vous le vérifiez à quelle fréquence?",
    type: "interview"
  },
  {
    id: "equip-4",
    category: "equipment",
    text: "Quel équipement tombe le plus souvent en panne?",
    type: "interview"
  },
  {
    id: "equip-5",
    category: "equipment",
    text: "Comment signalez-vous une panne?",
    type: "interview"
  },
  {
    id: "equip-6",
    category: "equipment",
    text: "Qui est prévenu quand il y a une panne?",
    type: "interview"
  },
  {
    id: "equip-7",
    category: "equipment",
    text: "Une panne, ça doit être signalé tout de suite ou ça peut attendre?",
    type: "interview"
  },
  // QUALITY
  {
    id: "qual-1",
    category: "quality",
    text: "Racontez-moi le dernier incident que vous avez signalé.",
    type: "interview"
  },
  {
    id: "qual-2",
    category: "quality",
    text: "En général, vous faites le signalement combien de temps après?",
    type: "interview"
  },
  {
    id: "qual-3",
    category: "quality",
    text: "Qu'est-ce qui vous empêche de signaler rapidement?",
    type: "interview"
  },
  {
    id: "qual-4",
    category: "quality",
    text: "Il y a des choses que vous hésitez à signaler?",
    type: "interview"
  },
  {
    id: "qual-5",
    category: "quality",
    text: "Les catégories de signalement actuelles sont adaptées?",
    type: "interview"
  },
  // HANDOFF
  {
    id: "hand-1",
    category: "handoff",
    text: "Qu'est-ce que vous transmettez à l'équipe qui vous remplace?",
    type: "interview"
  },
  {
    id: "hand-2",
    category: "handoff",
    text: "Une relève, ça dure combien de temps?",
    type: "observation"
  },
  {
    id: "hand-3",
    category: "handoff",
    text: "Qu'est-ce qui se perd souvent lors d'une relève?",
    type: "interview"
  },
  {
    id: "hand-4",
    category: "handoff",
    text: "Vous utilisez un carnet ou livre de bord?",
    type: "interview",
    captureHint: "Photo si oui"
  },
  {
    id: "hand-5",
    category: "handoff",
    text: "Les tâches en cours, comment vous les transmettez?",
    type: "interview"
  },
  // STUDENTS
  {
    id: "stud-1",
    category: "students",
    text: "Comment suivez-vous la progression d'un étudiant?",
    type: "interview"
  },
  {
    id: "stud-2",
    category: "students",
    text: "Quand l'étudiant observe vs quand il pratique, vous le notez?",
    type: "interview"
  },
  {
    id: "stud-3",
    category: "students",
    text: "Le feedback, vous le donnez sur le moment ou en fin de service?",
    type: "interview"
  },
  {
    id: "stud-4",
    category: "students",
    text: "Il y a un système pour suivre les compétences acquises?",
    type: "interview",
    captureHint: "Photo si oui"
  },
  // MULTISITE
  {
    id: "multi-1",
    category: "multisite",
    text: "Vous travaillez parfois sur d'autres bases?",
    type: "interview"
  },
  {
    id: "multi-2",
    category: "multisite",
    text: "Comment choisissez-vous votre base au début du service?",
    type: "interview"
  },
  {
    id: "multi-3",
    category: "multisite",
    text: "Chaque base a ses propres infos ou c'est pareil partout?",
    type: "interview"
  },
  {
    id: "multi-4",
    category: "multisite",
    text: "Comment recevez-vous les annonces?",
    type: "interview"
  },
  // PAIN POINTS
  {
    id: "pain-1",
    category: "painpoints",
    text: "C'est quoi le plus frustrant dans vos outils actuels?",
    type: "interview",
    captureHint: "Laisser parler"
  },
  {
    id: "pain-2",
    category: "painpoints",
    text: "Si vous pouviez changer une seule chose, ce serait quoi?",
    type: "interview"
  },
  {
    id: "pain-3",
    category: "painpoints",
    text: "Qu'est-ce que vous faites encore sur papier?",
    type: "interview",
    captureHint: "Photo des papiers"
  },
  {
    id: "pain-4",
    category: "painpoints",
    text: "Dans quelles situations la technologie vous ralentit?",
    type: "interview"
  },
  {
    id: "pain-5",
    category: "painpoints",
    text: "Montrez-moi les interfaces que vous utilisez.",
    type: "interview",
    captureHint: "Photo écrans"
  },
  {
    id: "pain-6",
    category: "painpoints",
    text: "Vous avez inventé des astuces pour aller plus vite?",
    type: "interview"
  }
];
function createChecklistStore() {
  let items = [];
  let customQuestions = [];
  let profiles = [];
  let initialized = false;
  function init() {
    if (initialized) return;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aresa-research-data");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          customQuestions = data.customQuestions || [];
          profiles = data.profiles || [];
          const allQuestions = [...defaultQuestions, ...customQuestions];
          items = allQuestions.map((q) => {
            const savedItem = data.items?.find((i) => i.question.id === q.id);
            return savedItem || { question: q, checked: false, notes: "", files: [] };
          });
        } catch (e) {
          console.error("Failed to load saved data:", e);
          initDefault();
        }
      } else {
        initDefault();
      }
    }
    initialized = true;
  }
  function initDefault() {
    items = defaultQuestions.map((q) => ({ question: q, checked: false, notes: "", files: [] }));
  }
  function save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("aresa-research-data", JSON.stringify({ items, customQuestions, profiles }));
    }
  }
  function toggleCheck(questionId) {
    const item = items.find((i) => i.question.id === questionId);
    if (item) {
      item.checked = !item.checked;
      save();
    }
  }
  function updateNotes(questionId, notes) {
    const item = items.find((i) => i.question.id === questionId);
    if (item) {
      item.notes = notes;
      save();
    }
  }
  function addFile(questionId, file) {
    const item = items.find((i) => i.question.id === questionId);
    if (item) {
      item.files.push(file);
      save();
    }
  }
  function markFileSaved(questionId, fileId) {
    const item = items.find((i) => i.question.id === questionId);
    if (item) {
      const file = item.files.find((f) => f.id === fileId);
      if (file) {
        file.saved = true;
        save();
      }
    }
  }
  function removeFile(questionId, fileId) {
    const item = items.find((i) => i.question.id === questionId);
    if (item) {
      item.files = item.files.filter((f) => f.id !== fileId);
      save();
    }
  }
  function addCustomQuestion(category, text) {
    const id = `custom-${Date.now()}`;
    const newQuestion = {
      id,
      category,
      text,
      type: "interview",
      captureHint: "Audio / Photo / Notes"
    };
    customQuestions.push(newQuestion);
    items.push({ question: newQuestion, checked: false, notes: "", files: [] });
    save();
    return id;
  }
  function addProfile(profile) {
    profiles.push({ ...profile, id: `profile-${Date.now()}` });
    save();
  }
  function getItemsByCategory(categoryId) {
    return items.filter((i) => i.question.category === categoryId);
  }
  function getProgress() {
    const total = items.length;
    const checked = items.filter((i) => i.checked).length;
    const withNotes = items.filter((i) => i.notes.trim() !== "").length;
    const withFiles = items.filter((i) => i.files.length > 0).length;
    return { total, checked, withNotes, withFiles };
  }
  function exportData() {
    return {
      exportDate: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
      items,
      customQuestions,
      profiles
    };
  }
  return {
    get items() {
      return items;
    },
    get customQuestions() {
      return customQuestions;
    },
    get profiles() {
      return profiles;
    },
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
const checklistStore = createChecklistStore();
export {
  categories as a,
  checklistStore as c
};
