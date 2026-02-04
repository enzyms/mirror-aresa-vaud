export interface Responsabilite {
	type: 'qualite' | 'formation' | 'logistique' | 'base' | 'direction';
	scope: 'base' | 'service';
	adjoint: boolean;
	adjoint_de?: string;
}

export interface User {
	id: string;
	nom: string;
	prenom: string;
	email: string;
	telephone: string;
	role_base: 'ad' | 'ta' | 'etudiant';
	responsabilites: Responsabilite[];
}
