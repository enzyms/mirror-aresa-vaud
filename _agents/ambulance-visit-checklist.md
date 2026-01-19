# Ambulance Visit UX Research Checklist

## What to Capture During Your Visit

Use this checklist to gather insights that will directly improve ARESA's UX. Each item maps to specific modules and design decisions.

---

## 1. PHYSICAL ENVIRONMENT (Video + Photos)

### Ambulance Interior
- [ ] **Control panel area** - Where would a tablet be mounted?
- [ ] **Lighting conditions** - Bright sunlight vs night operations
- [ ] **Available surfaces** - Where do they put devices now?
- [ ] **Gloves storage** - Do they wear gloves when documenting?
- [ ] **Existing screens/devices** - What's already there?

### Base Station
- [ ] **Work stations** - Desktop setups, multiple screens?
- [ ] **Shared vs personal devices** - Do they log in/out frequently?
- [ ] **Medication storage area** - How is stock organized?
- [ ] **Equipment room** - How do they track what's where?

**Why this matters:** Informs touch target sizes, contrast requirements, device form factor choices.

---

## 2. INTERVENTION MODE WORKFLOW (Video with narration)

### Critical Questions to Ask/Observe:
- [ ] "Walk me through a typical intervention from dispatch to return"
- [ ] What information do they check FIRST when dispatch comes in?
- [ ] How do they record timestamps currently? (Paper? Voice? Memory?)
- [ ] When do they document medication use - during or after?
- [ ] What's the MOST time-sensitive documentation?

### Quick Actions to Validate:
Your prototype has these quick actions - verify priority order:
1. **Départ** (Departure) - When exactly is this logged?
2. **Arrivée** (Arrival) - On scene? At hospital?
3. **Médicament utilisé** - During intervention or post?
4. **Note** - What types of notes are critical?
5. **Transport** - What info is needed?
6. **Hôpital** - Handoff documentation?

**Record:** Any actions they do repeatedly that aren't in the current quick actions.

---

## 3. MEDICATION TRACKING (Video + Audio explanation)

### Current Process
- [ ] How do they track medication use during intervention?
- [ ] What's the current process for controlled substances (stupéfiants)?
- [ ] How often do stock discrepancies occur?
- [ ] What triggers a stock alert currently?
- [ ] FIP number linkage - how do they reference patient files?

### Pain Points
- [ ] What's frustrating about current medication logging?
- [ ] Double-entry issues?
- [ ] Verification workflows for controlled substances?

**Why this matters:** Module 07 (Médicaments) is N3 priority with strict compliance needs.

---

## 4. EQUIPMENT & VEHICLE STATUS (Photos + Video)

### Verification Process
- [ ] How do they check vehicle readiness at shift start?
- [ ] Oxygen level monitoring - how is this displayed?
- [ ] Defibrillator status checks - frequency?
- [ ] What equipment failures happen most often?

### Reporting Flow
- [ ] How do they report a panne (breakdown) today?
- [ ] Who gets notified?
- [ ] How urgent is this communication?

**Why this matters:** Module 06 (Équipement) and Module 10 (Pannes) workflow design.

---

## 5. QUALITY REPORTING (Audio recording)

### Ask These Questions:
- [ ] "Tell me about the last quality incident you reported"
- [ ] How long after the event do they typically file reports?
- [ ] What prevents timely reporting?
- [ ] Confidentiality concerns - do they hesitate to report?
- [ ] PDCA process awareness - is this familiar?

### Categories to Validate:
Your prototype has these quality quick categories:
- Incident (erreur, événement indésirable)
- Sécurité patient (risque/danger identifié)
- Matériel/procédure (dysfonctionnement, amélioration)

**Ask:** Are these the right categories? What's missing?

---

## 6. SHIFT HANDOFF (Video if possible)

### Observe:
- [ ] What information passes between crews?
- [ ] How long does handoff take?
- [ ] What gets missed in handoffs?
- [ ] Do they use the logbook (livre de bord)?
- [ ] Pending tasks transmission?

**Why this matters:** Module 09 (Livre de bord) and Module 08 (Tâches) design.

---

## 7. STUDENT SUPERVISION (Audio interview)

### If students are present:
- [ ] How do mentors track student progress currently?
- [ ] Observation vs hands-on - how is this documented?
- [ ] Feedback timing - real-time or end of shift?
- [ ] Competency tracking - what system exists?

**Why this matters:** Module 05 (Étudiants) needs real workflow understanding.

---

## 8. MULTI-SITE OPERATIONS (Audio)

### Ask:
- [ ] Do staff work across multiple bases?
- [ ] How does base selection work currently?
- [ ] Site-specific vs global information needs?
- [ ] Announcements - how are they distributed today?

---

## 9. CURRENT SOFTWARE PAIN POINTS (Audio + Screenshots)

### Critical Questions:
- [ ] "What's the WORST thing about your current software?"
- [ ] "If you could fix ONE thing, what would it be?"
- [ ] "What paper forms do you still use? Why?"
- [ ] "When does technology slow you down?"

### Capture Screenshots/Photos:
- [ ] Current interfaces they use
- [ ] Paper forms still in circulation
- [ ] Workarounds they've created

---

## 10. USER PROFILE INSIGHTS (Notes)

For each person you interview, note:
- [ ] Role (AD, TA, étudiant, admin, etc.)
- [ ] Years of experience
- [ ] Tech comfort level (1-5)
- [ ] Primary device preference
- [ ] Typical shift pattern

---

## Recording Format Recommendations

| Content Type | Best Format | Notes |
|--------------|-------------|-------|
| Workflows | Video (landscape) | Narrate what they're doing |
| Interfaces | Screenshot/Photo | Capture existing systems |
| Explanations | Audio | Record detailed explanations |
| Environment | Photo (wide angle) | Context is important |
| Pain points | Audio | Let them vent freely |

### File Naming Convention
```
ARESA_VISIT_[DATE]_[TYPE]_[TOPIC].[ext]
Example: ARESA_VISIT_20260118_VIDEO_intervention-workflow.mp4
```

---

## Post-Visit Synthesis Questions

After your visit, I can help analyze recordings to answer:
1. What quick actions are missing from intervention mode?
2. What information hierarchy should the dashboard show?
3. Where are the biggest friction points to eliminate?
4. What offline capabilities are essential?
5. How should the mode switcher behave in practice?

---

## Priority Capture List (If time is limited)

**Must Have:**
1. Intervention workflow video with timestamps
2. Medication tracking pain points (audio)
3. Current software screenshots
4. Quick action priority validation

**Nice to Have:**
5. Equipment check process
6. Quality reporting discussion
7. Student supervision workflow
8. Multi-site operations details
