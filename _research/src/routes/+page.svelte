<script lang="ts">
	import { categories } from '$lib/data/questions';
	import { checklistStore, type FileRecord } from '$lib/stores/checklist.svelte';
	import { supabase, BUCKET_NAME } from '$lib/supabase';

	let activeCategory = $state('intervention');
	let showAddQuestion = $state(false);
	let newQuestionText = $state('');
	let newQuestionCategory = $state('custom');

	let showAddProfile = $state(false);
	let profileForm = $state({
		role: '',
		experience: '',
		techComfort: 3,
		device: '',
		shiftPattern: ''
	});

	// Media recording state
	let isRecording = $state(false);
	let recordingType = $state<'audio' | 'video' | null>(null);
	let recordingForQuestion = $state<string | null>(null);
	let mediaRecorder: MediaRecorder | null = null;
	let recordedChunks: Blob[] = [];
	let recordingTime = $state(0);
	let recordingInterval: ReturnType<typeof setInterval> | null = null;

	// Camera preview state
	let showCameraPreview = $state(false);
	let cameraStream = $state<MediaStream | null>(null);
	let cameraQuestionId = $state<string | null>(null);
	let videoElement: HTMLVideoElement | null = null;

	const categoryItems = $derived(checklistStore.getItemsByCategory(activeCategory));
	const currentCategory = $derived(categories.find(c => c.id === activeCategory));

	// Accordion state - track which questions are expanded
	let expandedQuestions = $state<Set<string>>(new Set());

	function toggleQuestion(questionId: string) {
		if (expandedQuestions.has(questionId)) {
			expandedQuestions.delete(questionId);
		} else {
			expandedQuestions.add(questionId);
		}
		expandedQuestions = new Set(expandedQuestions); // trigger reactivity
	}

	async function startRecording(type: 'audio' | 'video', questionId: string) {
		try {
			const constraints = type === 'audio'
				? { audio: true }
				: { audio: true, video: { facingMode: 'environment' } };

			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			mediaRecorder = new MediaRecorder(stream);
			recordedChunks = [];

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					recordedChunks.push(e.data);
				}
			};

			mediaRecorder.onstop = async () => {
				const blob = new Blob(recordedChunks, {
					type: type === 'audio' ? 'audio/webm' : 'video/webm'
				});

				// Stop all tracks
				stream.getTracks().forEach(track => track.stop());

				// Save file
				await saveFile(questionId, blob, type);

				isRecording = false;
				recordingType = null;
				recordingForQuestion = null;
				recordingTime = 0;
				if (recordingInterval) {
					clearInterval(recordingInterval);
					recordingInterval = null;
				}
			};

			mediaRecorder.start();
			isRecording = true;
			recordingType = type;
			recordingForQuestion = questionId;
			recordingTime = 0;
			recordingInterval = setInterval(() => {
				recordingTime++;
			}, 1000);
		} catch (err) {
			console.error('Failed to start recording:', err);
			alert('Impossible d\'accéder au micro/caméra. Vérifiez les permissions.');
		}
	}

	function stopRecording() {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
		}
	}

	let uploadingFile = $state<string | null>(null);

	async function saveFile(questionId: string, blob: Blob, type: 'audio' | 'video' | 'photo') {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const ext = type === 'audio' ? 'webm' : type === 'video' ? 'webm' : 'jpg';
		const category = questionId.split('-')[0];
		const filename = `${category}/${questionId}_${type}_${timestamp}.${ext}`;

		const fileRecord: FileRecord = {
			id: `file-${Date.now()}`,
			name: filename,
			type,
			timestamp: new Date().toISOString(),
			saved: false
		};

		checklistStore.addFile(questionId, fileRecord);
		uploadingFile = fileRecord.id;

		try {
			const { data, error } = await supabase.storage
				.from(BUCKET_NAME)
				.upload(filename, blob, {
					contentType: type === 'photo' ? 'image/jpeg' : `${type}/webm`,
					upsert: true
				});

			if (error) {
				console.error('Upload error:', error);
				alert(`Erreur upload: ${error.message}`);
			} else {
				checklistStore.markFileSaved(questionId, fileRecord.id);
				console.log('Uploaded:', data.path);
			}
		} catch (err) {
			console.error('Upload failed:', err);
			alert('Erreur lors de l\'upload vers Supabase');
		} finally {
			uploadingFile = null;
		}
	}

	async function openCamera(questionId: string) {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
			});
			cameraStream = stream;
			cameraQuestionId = questionId;
			showCameraPreview = true;

			// Wait for DOM update then attach stream
			setTimeout(() => {
				if (videoElement) {
					videoElement.srcObject = stream;
					videoElement.play();
				}
			}, 50);
		} catch (err) {
			console.error('Failed to open camera:', err);
			alert('Impossible d\'accéder à la caméra.');
		}
	}

	function closeCamera() {
		if (cameraStream) {
			cameraStream.getTracks().forEach(track => track.stop());
			cameraStream = null;
		}
		showCameraPreview = false;
		cameraQuestionId = null;
	}

	async function capturePhoto() {
		if (!videoElement || !cameraQuestionId) return;

		// Compress: max 1200px width, keep aspect ratio
		const maxWidth = 1200;
		let width = videoElement.videoWidth;
		let height = videoElement.videoHeight;

		if (width > maxWidth) {
			height = Math.round((height * maxWidth) / width);
			width = maxWidth;
		}

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d')?.drawImage(videoElement, 0, 0, width, height);

		const questionId = cameraQuestionId;
		closeCamera();

		// Compress to 60% quality JPEG (~100-200KB per image)
		canvas.toBlob(async (blob) => {
			if (blob) {
				console.log(`Photo size: ${(blob.size / 1024).toFixed(0)}KB`);
				await saveFile(questionId, blob, 'photo');
			}
		}, 'image/jpeg', 0.6);
	}

	async function deleteFile(questionId: string, file: FileRecord) {
		if (!confirm(`Supprimer ${file.name.split('/').pop()}?`)) return;

		try {
			const { error } = await supabase.storage
				.from(BUCKET_NAME)
				.remove([file.name]);

			if (error) {
				console.error('Delete error:', error);
				alert(`Erreur suppression: ${error.message}`);
			} else {
				checklistStore.removeFile(questionId, file.id);
			}
		} catch (err) {
			console.error('Delete failed:', err);
			alert('Erreur lors de la suppression');
		}
	}

	function addQuestion() {
		if (newQuestionText.trim()) {
			const newId = checklistStore.addCustomQuestion(newQuestionCategory, newQuestionText.trim());
			// Auto-expand the new question so user can add media
			expandedQuestions.add(newId);
			expandedQuestions = new Set(expandedQuestions);
			newQuestionText = '';
			showAddQuestion = false;
		}
	}

	function addProfile() {
		if (profileForm.role.trim()) {
			checklistStore.addProfile(profileForm);
			profileForm = { role: '', experience: '', techComfort: 3, device: '', shiftPattern: '' };
			showAddProfile = false;
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	let isExporting = $state(false);
	let showRawData = $state(false);
	let rawDataText = $state('');

	async function exportAll() {
		isExporting = true;
		const data = checklistStore.exportData();
		const jsonString = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const filename = `exports/aresa-research-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

		let supabaseOk = false;

		// Upload to Supabase
		try {
			const { error } = await supabase.storage
				.from(BUCKET_NAME)
				.upload(filename, blob, {
					contentType: 'application/json',
					upsert: true
				});

			if (error) {
				console.error('Export upload error:', error);
			} else {
				console.log('Exported to Supabase:', filename);
				supabaseOk = true;
			}
		} catch (err) {
			console.error('Export failed:', err);
		}

		// Try download - may not work on iOS
		try {
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `aresa-research-${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Download failed:', err);
		}

		isExporting = false;

		if (supabaseOk) {
			alert('Export Supabase OK! Fichier: ' + filename);
		} else {
			alert('Erreur Supabase. Utilisez "Copier données" ci-dessous.');
		}
	}

	function showData() {
		const data = checklistStore.exportData();
		rawDataText = JSON.stringify(data, null, 2);
		showRawData = true;
	}

	async function copyData() {
		const data = checklistStore.exportData();
		const jsonString = JSON.stringify(data, null, 2);
		try {
			await navigator.clipboard.writeText(jsonString);
			alert('Données copiées dans le presse-papier!');
		} catch (err) {
			// Fallback: show raw data
			rawDataText = jsonString;
			showRawData = true;
		}
	}
</script>

<div class="page">
	<!-- Category Tabs -->
	<div class="tabs">
		{#each categories as cat}
			<button
				class="tab"
				class:active={activeCategory === cat.id}
				onclick={() => activeCategory = cat.id}
				style="--cat-color: {cat.color}"
			>
				<span class="tab-icon">{cat.icon}</span>
				<span class="tab-label">{cat.title}</span>
				{#if checklistStore.getItemsByCategory(cat.id).filter(i => i.checked).length > 0}
					<span class="tab-badge">
						{checklistStore.getItemsByCategory(cat.id).filter(i => i.checked).length}
					</span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Current Category Header -->
	{#if currentCategory}
		<div class="category-header" style="--cat-color: {currentCategory.color}">
			<span class="category-icon">{currentCategory.icon}</span>
			<div>
				<h2>{currentCategory.title}</h2>
				<p>{currentCategory.description}</p>
			</div>
		</div>
	{/if}

	<!-- Recording Overlay -->
	{#if isRecording}
		<div class="recording-overlay">
			<div class="recording-modal">
				<div class="recording-indicator">
					<span class="recording-dot"></span>
					{recordingType === 'audio' ? '🎤 Enregistrement audio' : '📹 Enregistrement vidéo'}
				</div>
				<div class="recording-time">{formatTime(recordingTime)}</div>
				<button class="btn-stop" onclick={stopRecording}>
					⏹️ Arrêter
				</button>
			</div>
		</div>
	{/if}

	<!-- Camera Preview -->
	{#if showCameraPreview}
		<div class="camera-overlay">
			<div class="camera-modal">
				<video bind:this={videoElement} autoplay playsinline class="camera-preview"></video>
				<div class="camera-controls">
					<button class="btn-cancel-camera" onclick={closeCamera}>
						✕ Annuler
					</button>
					<button class="btn-capture" onclick={capturePhoto}>
						📸 Capturer
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Questions List -->
	<div class="questions">
		{#each categoryItems as item (item.question.id)}
			{@const isExpanded = expandedQuestions.has(item.question.id)}
			{@const hasContent = item.notes.trim() || item.files.length > 0}
			<div class="question-card" class:checked={item.checked} class:expanded={isExpanded}>
				<!-- Clickable Header -->
				<button class="question-header" onclick={() => toggleQuestion(item.question.id)}>
					<label class="checkbox-wrapper" onclick={(e) => e.stopPropagation()}>
						<input
							type="checkbox"
							checked={item.checked}
							onchange={() => checklistStore.toggleCheck(item.question.id)}
						/>
						<span class="checkmark"></span>
					</label>
					<div class="question-content">
						<p class="question-text">{item.question.text}</p>
						{#if hasContent && !isExpanded}
							<span class="has-content-badge">
								{item.notes.trim() ? '📝' : ''}{item.files.length > 0 ? ` ${item.files.length} 📎` : ''}
							</span>
						{/if}
					</div>
					<span class="expand-icon" class:rotated={isExpanded}>▼</span>
				</button>

				<!-- Expandable Content -->
				{#if isExpanded}
					<div class="question-body">
						{#if item.question.captureHint}
							<span class="capture-hint">💡 {item.question.captureHint}</span>
						{/if}

						<!-- Notes -->
						<textarea
							placeholder="Notes..."
							value={item.notes}
							oninput={(e) => checklistStore.updateNotes(item.question.id, e.currentTarget.value)}
						></textarea>

						<!-- Media Buttons -->
						<div class="media-buttons">
							<button
								class="media-btn audio"
								onclick={() => startRecording('audio', item.question.id)}
								disabled={isRecording}
							>
								🎤 Audio
							</button>
							<button
								class="media-btn photo"
								onclick={() => openCamera(item.question.id)}
								disabled={isRecording}
							>
								📷 Photo
							</button>
						</div>

						<!-- Files List -->
						{#if item.files.length > 0}
							<div class="files-list">
								{#each item.files as file}
									<div class="file-item" class:saved={file.saved}>
										<span class="file-icon">
											{file.type === 'audio' ? '🎤' : file.type === 'video' ? '📹' : '📷'}
										</span>
										<span class="file-name">{file.name.split('/').pop()}</span>
										<button class="btn-delete-file" onclick={() => deleteFile(item.question.id, file)}>🗑️</button>
										<span class="file-status">
											{file.saved ? '✅' : '⏳'}
										</span>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Add Question Button -->
	<div class="add-section">
		{#if showAddQuestion}
			<div class="add-form">
				<select bind:value={newQuestionCategory}>
					{#each categories as cat}
						<option value={cat.id}>{cat.icon} {cat.title}</option>
					{/each}
				</select>
				<textarea
					bind:value={newQuestionText}
					placeholder="Nouvelle question ou observation..."
				></textarea>
				<div class="add-form-buttons">
					<button class="btn-cancel" onclick={() => showAddQuestion = false}>Annuler</button>
					<button class="btn-add" onclick={addQuestion}>Ajouter</button>
				</div>
			</div>
		{:else}
			<button class="btn-add-question" onclick={() => { newQuestionCategory = activeCategory; showAddQuestion = true; }}>
				➕ Ajouter une question
			</button>
		{/if}
	</div>

	<!-- User Profiles Section -->
	<div class="profiles-section">
		<h3>👤 Profils interviewés</h3>

		{#if checklistStore.profiles.length > 0}
			<div class="profiles-list">
				{#each checklistStore.profiles as profile}
					<div class="profile-card">
						<strong>{profile.role}</strong>
						<span>{profile.experience} d'expérience</span>
						<span>Tech: {'⭐'.repeat(profile.techComfort)}</span>
						<span>{profile.device}</span>
					</div>
				{/each}
			</div>
		{/if}

		{#if showAddProfile}
			<div class="add-form profile-form">
				<input bind:value={profileForm.role} placeholder="Rôle (AD, TA, étudiant...)" />
				<input bind:value={profileForm.experience} placeholder="Années d'expérience" />
				<div class="tech-comfort">
					<label>Confort tech:</label>
					<input type="range" min="1" max="5" bind:value={profileForm.techComfort} />
					<span>{profileForm.techComfort}/5</span>
				</div>
				<input bind:value={profileForm.device} placeholder="Appareil préféré" />
				<input bind:value={profileForm.shiftPattern} placeholder="Pattern de shifts" />
				<div class="add-form-buttons">
					<button class="btn-cancel" onclick={() => showAddProfile = false}>Annuler</button>
					<button class="btn-add" onclick={addProfile}>Ajouter</button>
				</div>
			</div>
		{:else}
			<button class="btn-add-profile" onclick={() => showAddProfile = true}>
				➕ Ajouter un profil
			</button>
		{/if}
	</div>

	<!-- Export Button -->
	<div class="export-section">
		<button class="btn-export" onclick={exportAll} disabled={isExporting}>
			{isExporting ? '⏳ Export...' : '📤 Exporter vers Supabase'}
		</button>
		<div class="backup-buttons">
			<button class="btn-backup" onclick={copyData}>📋 Copier données</button>
			<button class="btn-backup" onclick={showData}>👁️ Voir JSON</button>
		</div>
		<a href="/lexique" class="lexique-link">📖 Lexique des acronymes</a>
	</div>

	<!-- Raw Data Modal -->
	{#if showRawData}
		<div class="modal-overlay" onclick={() => showRawData = false}>
			<div class="modal-content" onclick={(e) => e.stopPropagation()}>
				<div class="modal-header">
					<h3>Données JSON</h3>
					<button class="btn-close" onclick={() => showRawData = false}>✕</button>
				</div>
				<p class="modal-hint">Sélectionnez tout et copiez (Cmd+A, Cmd+C)</p>
				<textarea class="raw-data" readonly>{rawDataText}</textarea>
			</div>
		</div>
	{/if}
</div>

<style>
	.page {
		padding-bottom: 100px;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 20px;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 14px;
		background: white;
		border: 2px solid var(--gray-200);
		border-radius: var(--radius);
		font-size: 15px;
		transition: all 0.15s;
	}

	.tab:hover {
		border-color: var(--cat-color);
	}

	.tab.active {
		border-color: var(--cat-color);
		background: var(--cat-color);
		color: white;
	}

	.tab-icon {
		font-size: 18px;
	}

	.tab-label {
		display: none;
	}

	@media (min-width: 600px) {
		.tab-label {
			display: inline;
		}
	}

	.tab-badge {
		background: white;
		color: var(--cat-color);
		font-size: 13px;
		padding: 2px 8px;
		border-radius: 10px;
		font-weight: 600;
	}

	.tab.active .tab-badge {
		background: rgba(255,255,255,0.9);
	}

	.category-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
		background: white;
		border-radius: var(--radius);
		border-left: 4px solid var(--cat-color);
		margin-bottom: 20px;
	}

	.category-icon {
		font-size: 32px;
	}

	.category-header h2 {
		font-size: 20px;
		margin-bottom: 4px;
	}

	.category-header p {
		font-size: 15px;
		color: var(--gray-500);
	}

	.questions {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.question-card {
		background: white;
		border-radius: var(--radius);
		padding: 16px;
		box-shadow: var(--shadow);
		transition: all 0.15s;
	}

	.question-card.checked {
		border-left: 4px solid var(--success);
		background: linear-gradient(to right, rgba(16, 185, 129, 0.05), white);
	}

	.question-header {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		width: 100%;
		padding: 0;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
	}

	.question-card.expanded .question-header {
		margin-bottom: 12px;
	}

	.expand-icon {
		font-size: 14px;
		color: var(--gray-400);
		transition: transform 0.2s;
		margin-top: 4px;
	}

	.expand-icon.rotated {
		transform: rotate(180deg);
	}

	.has-content-badge {
		display: inline-block;
		font-size: 13px;
		color: var(--gray-500);
		background: var(--gray-100);
		padding: 3px 10px;
		border-radius: 4px;
		margin-top: 4px;
	}

	.question-body {
		padding-top: 4px;
	}

	.checkbox-wrapper {
		position: relative;
		width: 24px;
		height: 24px;
		flex-shrink: 0;
	}

	.checkbox-wrapper input {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}

	.checkmark {
		position: absolute;
		top: 0;
		left: 0;
		width: 24px;
		height: 24px;
		border: 2px solid var(--gray-300);
		border-radius: 6px;
		transition: all 0.15s;
	}

	.checkbox-wrapper input:checked ~ .checkmark {
		background: var(--success);
		border-color: var(--success);
	}

	.checkbox-wrapper input:checked ~ .checkmark::after {
		content: '✓';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 14px;
		font-weight: bold;
	}

	.question-content {
		flex: 1;
	}

	.question-text {
		font-size: 17px;
		line-height: 1.4;
		margin-bottom: 4px;
	}

	.capture-hint {
		font-size: 14px;
		color: var(--gray-500);
		background: var(--gray-100);
		padding: 4px 10px;
		border-radius: 4px;
	}

	.question-card textarea {
		margin-bottom: 12px;
	}

	.media-buttons {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.media-btn {
		flex: 1;
		min-width: 80px;
		padding: 12px;
		font-size: 16px;
		background: var(--gray-100);
		color: var(--gray-700);
	}

	.media-btn:hover:not(:disabled) {
		background: var(--gray-200);
	}

	.media-btn.audio:hover:not(:disabled) {
		background: #fef3c7;
	}

	.media-btn.video:hover:not(:disabled) {
		background: #fee2e2;
	}

	.media-btn.photo:hover:not(:disabled) {
		background: #dbeafe;
	}

	.files-list {
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid var(--gray-200);
	}

	.file-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 10px;
		background: var(--gray-50);
		border-radius: 4px;
		margin-bottom: 4px;
		font-size: 15px;
	}

	.file-item.saved {
		background: #ecfdf5;
	}

	.file-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Recording Overlay */
	.recording-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.recording-modal {
		background: white;
		padding: 32px;
		border-radius: 16px;
		text-align: center;
		min-width: 280px;
	}

	.recording-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-size: 20px;
		margin-bottom: 16px;
	}

	.recording-dot {
		width: 12px;
		height: 12px;
		background: var(--danger);
		border-radius: 50%;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.recording-time {
		font-size: 48px;
		font-weight: bold;
		font-family: monospace;
		margin-bottom: 24px;
	}

	.btn-stop {
		background: var(--danger);
		color: white;
		padding: 14px 36px;
		font-size: 18px;
	}

	.btn-stop:hover {
		background: #dc2626;
	}

	/* Camera Preview */
	.camera-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.95);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.camera-modal {
		width: 100%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
	}

	.camera-preview {
		width: 100%;
		max-height: 70vh;
		border-radius: 12px;
		background: black;
	}

	.camera-controls {
		display: flex;
		gap: 16px;
		margin-top: 20px;
	}

	.btn-cancel-camera {
		background: var(--gray-600);
		color: white;
		padding: 16px 30px;
		font-size: 17px;
		border-radius: 50px;
	}

	.btn-capture {
		background: white;
		color: black;
		padding: 16px 36px;
		font-size: 20px;
		font-weight: bold;
		border-radius: 50px;
	}

	.btn-capture:hover {
		background: #f0f0f0;
	}

	/* Delete button */
	.btn-delete-file {
		background: transparent;
		border: none;
		padding: 4px;
		font-size: 16px;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 0.15s;
	}

	.btn-delete-file:hover {
		opacity: 1;
	}

	/* Add Section */
	.add-section {
		margin-top: 20px;
	}

	.add-form {
		background: white;
		padding: 16px;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	.add-form select,
	.add-form input {
		margin-bottom: 12px;
	}

	.add-form textarea {
		margin-bottom: 12px;
	}

	.add-form-buttons {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
	}

	.btn-cancel {
		background: var(--gray-100);
		color: var(--gray-700);
	}

	.btn-add {
		background: var(--primary);
		color: white;
	}

	.btn-add:hover {
		background: var(--primary-dark);
	}

	.btn-add-question,
	.btn-add-profile {
		width: 100%;
		padding: 12px;
		background: white;
		border: 2px dashed var(--gray-300);
		color: var(--gray-500);
	}

	.btn-add-question:hover,
	.btn-add-profile:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	/* Profiles Section */
	.profiles-section {
		margin-top: 32px;
		padding-top: 24px;
		border-top: 2px solid var(--gray-200);
	}

	.profiles-section h3 {
		margin-bottom: 16px;
	}

	.profiles-list {
		display: grid;
		gap: 12px;
		margin-bottom: 16px;
	}

	.profile-card {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding: 14px;
		background: white;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		font-size: 15px;
	}

	.profile-card strong {
		width: 100%;
	}

	.profile-card span {
		background: var(--gray-100);
		padding: 2px 8px;
		border-radius: 4px;
	}

	.profile-form {
		display: flex;
		flex-direction: column;
	}

	.tech-comfort {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.tech-comfort input[type="range"] {
		flex: 1;
	}

	/* Export Section */
	.export-section {
		margin-top: 32px;
		padding-top: 24px;
		border-top: 2px solid var(--gray-200);
	}

	.btn-export {
		width: 100%;
		padding: 18px;
		background: var(--primary);
		color: white;
		font-size: 18px;
	}

	.btn-export:hover {
		background: var(--primary-dark);
	}

	.backup-buttons {
		display: flex;
		gap: 8px;
		margin-top: 12px;
	}

	.btn-backup {
		flex: 1;
		padding: 12px;
		background: white;
		border: 2px solid var(--gray-300);
		color: var(--gray-700);
		font-size: 15px;
	}

	.btn-backup:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	.lexique-link {
		display: block;
		text-align: center;
		margin-top: 16px;
		color: var(--gray-500);
		font-size: 16px;
		text-decoration: none;
	}

	.lexique-link:hover {
		color: var(--primary);
		text-decoration: underline;
	}

	/* Raw Data Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 16px;
	}

	.modal-content {
		background: white;
		border-radius: 12px;
		width: 100%;
		max-width: 600px;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
		border-bottom: 1px solid var(--gray-200);
	}

	.modal-header h3 {
		font-size: 18px;
	}

	.btn-close {
		background: none;
		border: none;
		font-size: 20px;
		color: var(--gray-500);
		padding: 4px 8px;
	}

	.modal-hint {
		padding: 8px 16px;
		font-size: 14px;
		color: var(--gray-500);
		background: var(--gray-100);
	}

	.raw-data {
		flex: 1;
		margin: 0;
		padding: 16px;
		border: none;
		border-radius: 0 0 12px 12px;
		font-family: monospace;
		font-size: 12px;
		resize: none;
		min-height: 300px;
	}
</style>
