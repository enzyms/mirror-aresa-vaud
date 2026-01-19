#!/bin/bash

# Script simple pour organiser les données de recherche ARESA
# Usage: ./organize.sh [dossier-source]
# Par défaut: ~/Downloads

SOURCE_DIR="${1:-$HOME/Downloads}"
OUTPUT_DIR="$(dirname "$0")/../../_documents/research"

echo "🔍 Recherche dans: $SOURCE_DIR"
echo "📁 Sortie vers: $OUTPUT_DIR"

# Créer le dossier de sortie
mkdir -p "$OUTPUT_DIR"

# Trouver et copier le JSON
JSON_FILE=$(find "$SOURCE_DIR" -maxdepth 1 -name "aresa-research-*.json" -type f | head -1)
if [ -n "$JSON_FILE" ]; then
    cp "$JSON_FILE" "$OUTPUT_DIR/"
    echo "✓ JSON copié: $(basename "$JSON_FILE")"
else
    echo "⚠️  Pas de fichier JSON trouvé"
fi

# Organiser les fichiers média par catégorie
organize_file() {
    local file="$1"
    local filename=$(basename "$file")
    local question_id=$(echo "$filename" | cut -d'_' -f1)
    local prefix=$(echo "$question_id" | cut -d'-' -f1)

    # Mapping des catégories
    case "$prefix" in
        env) category="environment" ;;
        int) category="intervention" ;;
        med) category="medication" ;;
        equip) category="equipment" ;;
        qual) category="quality" ;;
        hand) category="handoff" ;;
        stud) category="students" ;;
        multi) category="multisite" ;;
        pain) category="painpoints" ;;
        *) category="other" ;;
    esac

    mkdir -p "$OUTPUT_DIR/$category"
    cp "$file" "$OUTPUT_DIR/$category/"
    echo "✓ $filename → $category/"
}

# Trouver tous les fichiers média
for ext in webm mp4 m4a mp3 jpg jpeg png; do
    for file in "$SOURCE_DIR"/*_audio_*.$ext "$SOURCE_DIR"/*_video_*.$ext "$SOURCE_DIR"/*_photo_*.$ext 2>/dev/null; do
        if [ -f "$file" ]; then
            organize_file "$file"
        fi
    done
done

echo ""
echo "✅ Terminé! Fichiers dans: $OUTPUT_DIR"
echo ""
echo "Structure:"
find "$OUTPUT_DIR" -type f -name "*" | head -20
