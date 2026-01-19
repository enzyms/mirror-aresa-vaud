<script lang="ts">
	const lexique = [
		{ term: 'AD', definition: 'Ambulancier Diplômé - Paramédic certifié ES' },
		{ term: 'TA', definition: 'Technicien Ambulancier - Support technique' },
		{ term: 'SMUR', definition: 'Service Mobile d\'Urgence et de Réanimation' },
		{ term: 'CASU', definition: 'Centrale d\'Appels Sanitaires Urgents (144)' },
		{ term: 'P1', definition: 'Priorité 1 - Urgence vitale (feux bleus)' },
		{ term: 'P2', definition: 'Priorité 2 - Urgence relative' },
		{ term: 'P3', definition: 'Priorité 3 - Transport sanitaire' },
		{ term: 'FIP', definition: 'Fiche d\'Intervention Préhospitalière' },
		{ term: 'CHUV', definition: 'Centre Hospitalier Universitaire Vaudois' },
		{ term: 'EHC', definition: 'Ensemble Hospitalier de la Côte' },
		{ term: 'HIB', definition: 'Hôpital Intercantonal de la Broye' },
		{ term: 'RCP', definition: 'Réanimation Cardio-Pulmonaire' },
		{ term: 'DEA', definition: 'Défibrillateur Externe Automatisé' },
		{ term: 'ECG', definition: 'Électrocardiogramme' },
		{ term: 'SpO2', definition: 'Saturation en Oxygène' },
		{ term: 'TA (med)', definition: 'Tension Artérielle' },
		{ term: 'GCS', definition: 'Glasgow Coma Scale - Échelle de Glasgow' },
		{ term: 'AVP', definition: 'Accident de la Voie Publique' },
		{ term: 'DPS', definition: 'Dispositif Prévisionnel de Secours' },
		{ term: 'PMA', definition: 'Poste Médical Avancé' },
		{ term: 'REGA', definition: 'Garde Aérienne Suisse de Sauvetage' },
		{ term: 'ES', definition: 'École Supérieure (formation AD)' },
		{ term: 'OdA', definition: 'Organisation du monde du travail Santé' },
		{ term: 'OFSP', definition: 'Office Fédéral de la Santé Publique' },
	];
</script>

<div class="page">
	<header>
		<a href="/" class="back-link">← Retour</a>
		<h1>Lexique</h1>
		<p class="subtitle">Acronymes et termes utilisés</p>
	</header>

	<div class="lexique-list">
		{#each lexique as item}
			<div class="lexique-item">
				<span class="term">{item.term}</span>
				<span class="definition">{item.definition}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.page {
		padding-bottom: 40px;
	}

	header {
		margin-bottom: 24px;
	}

	.back-link {
		display: inline-block;
		color: var(--primary);
		text-decoration: none;
		font-size: 15px;
		margin-bottom: 12px;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	h1 {
		font-size: 28px;
		margin-bottom: 4px;
	}

	.subtitle {
		color: var(--gray-500);
		font-size: 16px;
	}

	.lexique-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.lexique-item {
		display: flex;
		gap: 16px;
		padding: 14px 16px;
		background: white;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		align-items: baseline;
	}

	.term {
		font-weight: 700;
		font-size: 17px;
		color: var(--primary);
		min-width: 80px;
		flex-shrink: 0;
	}

	.definition {
		font-size: 16px;
		color: var(--gray-700);
	}
</style>
