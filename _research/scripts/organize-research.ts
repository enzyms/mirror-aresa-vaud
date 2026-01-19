#!/usr/bin/env npx ts-node

/**
 * Script pour organiser les données de recherche ARESA
 *
 * Usage:
 *   npx ts-node scripts/organize-research.ts [dossier-source]
 *
 * Par défaut, cherche dans ~/Downloads
 * Organise tout dans _documents/research/
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';
import { homedir } from 'os';

// Configuration
const SOURCE_DIR = process.argv[2] || join(homedir(), 'Downloads');
const OUTPUT_DIR = join(__dirname, '..', '..', '_documents', 'research');

// Catégories par préfixe de question
const CATEGORY_MAP: Record<string, string> = {
  'env': 'environment',
  'int': 'intervention',
  'med': 'medication',
  'equip': 'equipment',
  'qual': 'quality',
  'hand': 'handoff',
  'stud': 'students',
  'multi': 'multisite',
  'pain': 'painpoints',
  'custom': 'custom'
};

interface FileRecord {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'photo';
  timestamp: string;
  saved: boolean;
}

interface ChecklistItem {
  question: {
    id: string;
    category: string;
    text: string;
    type: string;
    captureHint?: string;
  };
  checked: boolean;
  notes: string;
  files: FileRecord[];
}

interface ResearchData {
  exportDate: string;
  items: ChecklistItem[];
  customQuestions: any[];
  profiles: any[];
}

function findJsonFile(dir: string): string | null {
  const files = readdirSync(dir);
  const jsonFile = files.find(f => f.startsWith('aresa-research') && f.endsWith('.json'));
  return jsonFile ? join(dir, jsonFile) : null;
}

function findMediaFiles(dir: string): string[] {
  const files = readdirSync(dir);
  const mediaExtensions = ['.webm', '.mp4', '.jpg', '.jpeg', '.png', '.m4a', '.mp3'];
  return files
    .filter(f => mediaExtensions.includes(extname(f).toLowerCase()))
    .filter(f => f.includes('_audio_') || f.includes('_video_') || f.includes('_photo_'))
    .map(f => join(dir, f));
}

function getCategoryFromQuestionId(questionId: string): string {
  const prefix = questionId.split('-')[0];
  return CATEGORY_MAP[prefix] || 'other';
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function generateReport(data: ResearchData, mediaFiles: string[]): string {
  const lines: string[] = [];

  lines.push('# Rapport de Recherche ARESA');
  lines.push(`\nDate d'export: ${new Date(data.exportDate).toLocaleString('fr-CH')}`);
  lines.push(`\n## Résumé`);

  const completed = data.items.filter(i => i.checked).length;
  const withNotes = data.items.filter(i => i.notes.trim()).length;
  const withFiles = data.items.filter(i => i.files.length > 0).length;

  lines.push(`- Questions complétées: ${completed}/${data.items.length}`);
  lines.push(`- Questions avec notes: ${withNotes}`);
  lines.push(`- Questions avec fichiers: ${withFiles}`);
  lines.push(`- Fichiers média trouvés: ${mediaFiles.length}`);
  lines.push(`- Profils interviewés: ${data.profiles.length}`);

  // Profils
  if (data.profiles.length > 0) {
    lines.push(`\n## Profils Interviewés`);
    data.profiles.forEach((p, i) => {
      lines.push(`\n### Profil ${i + 1}: ${p.role}`);
      lines.push(`- Expérience: ${p.experience}`);
      lines.push(`- Confort tech: ${p.techComfort}/5`);
      lines.push(`- Appareil: ${p.device}`);
      lines.push(`- Shifts: ${p.shiftPattern}`);
    });
  }

  // Par catégorie
  const categories = [...new Set(data.items.map(i => i.question.category))];

  categories.forEach(cat => {
    const catItems = data.items.filter(i => i.question.category === cat);
    const catCompleted = catItems.filter(i => i.checked);

    if (catCompleted.length > 0 || catItems.some(i => i.notes.trim())) {
      lines.push(`\n## ${cat.charAt(0).toUpperCase() + cat.slice(1)}`);

      catItems.forEach(item => {
        if (item.checked || item.notes.trim() || item.files.length > 0) {
          lines.push(`\n### ${item.question.text}`);
          lines.push(`- Status: ${item.checked ? '✅ Complété' : '⬜ Non complété'}`);

          if (item.notes.trim()) {
            lines.push(`\n**Notes:**`);
            lines.push(item.notes);
          }

          if (item.files.length > 0) {
            lines.push(`\n**Fichiers:**`);
            item.files.forEach(f => {
              lines.push(`- ${f.type}: ${f.name}`);
            });
          }
        }
      });
    }
  });

  return lines.join('\n');
}

function main() {
  console.log('🔍 Recherche des fichiers dans:', SOURCE_DIR);

  // Trouver le JSON
  const jsonPath = findJsonFile(SOURCE_DIR);
  if (!jsonPath) {
    console.error('❌ Aucun fichier aresa-research-*.json trouvé dans', SOURCE_DIR);
    console.log('   Assure-toi d\'avoir exporté les données depuis l\'app');
    process.exit(1);
  }

  console.log('📄 JSON trouvé:', basename(jsonPath));

  // Charger les données
  const data: ResearchData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

  // Trouver les fichiers média
  const mediaFiles = findMediaFiles(SOURCE_DIR);
  console.log(`🎬 ${mediaFiles.length} fichiers média trouvés`);

  // Créer la structure de dossiers
  ensureDir(OUTPUT_DIR);

  // Copier et organiser les fichiers média par catégorie
  mediaFiles.forEach(file => {
    const filename = basename(file);
    const questionId = filename.split('_')[0]; // ex: "int-1"
    const category = getCategoryFromQuestionId(questionId);
    const categoryDir = join(OUTPUT_DIR, category);

    ensureDir(categoryDir);

    const destPath = join(categoryDir, filename);
    copyFileSync(file, destPath);
    console.log(`  ✓ ${filename} → ${category}/`);
  });

  // Copier le JSON
  const jsonDest = join(OUTPUT_DIR, basename(jsonPath));
  copyFileSync(jsonPath, jsonDest);
  console.log(`  ✓ ${basename(jsonPath)} → research/`);

  // Générer le rapport
  const report = generateReport(data, mediaFiles);
  const reportPath = join(OUTPUT_DIR, `rapport-${new Date().toISOString().split('T')[0]}.md`);
  writeFileSync(reportPath, report);
  console.log(`  ✓ Rapport généré: rapport-${new Date().toISOString().split('T')[0]}.md`);

  console.log('\n✅ Organisation terminée!');
  console.log(`📁 Tout est dans: ${OUTPUT_DIR}`);
}

main();
