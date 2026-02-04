import type { User } from '$lib/types/user';

export const users: User[] = [
	{
		id: '1',
		nom: 'Dubois',
		prenom: 'Marie',
		email: 'marie.dubois@ams.ch',
		telephone: '+41 79 123 45 67',
		role_base: 'ad',
		responsabilites: [
			{ type: 'qualite', scope: 'service', adjoint: false }
		]
	},
	{
		id: '2',
		nom: 'Dupuis',
		prenom: 'Jean',
		email: 'jean.dupuis@ams.ch',
		telephone: '+41 79 234 56 78',
		role_base: 'ta',
		responsabilites: []
	},
	{
		id: '3',
		nom: 'Martin',
		prenom: 'Pierre',
		email: 'pierre.martin@ams.ch',
		telephone: '+41 79 345 67 89',
		role_base: 'etudiant',
		responsabilites: []
	},
	{
		id: '4',
		nom: 'Schneider',
		prenom: 'Anna',
		email: 'anna.schneider@ams.ch',
		telephone: '+41 79 456 78 90',
		role_base: 'ad',
		responsabilites: [
			{ type: 'formation', scope: 'base', adjoint: false },
			{ type: 'logistique', scope: 'base', adjoint: true, adjoint_de: 'Marc Favre' }
		]
	},
	{
		id: '5',
		nom: 'Favre',
		prenom: 'Marc',
		email: 'marc.favre@ams.ch',
		telephone: '+41 79 567 89 01',
		role_base: 'ad',
		responsabilites: [
			{ type: 'logistique', scope: 'service', adjoint: false }
		]
	},
	{
		id: '6',
		nom: 'Rochat',
		prenom: 'Sophie',
		email: 'sophie.rochat@ams.ch',
		telephone: '+41 79 678 90 12',
		role_base: 'ta',
		responsabilites: [
			{ type: 'base', scope: 'base', adjoint: false }
		]
	},
	{
		id: '7',
		nom: 'Müller',
		prenom: 'Thomas',
		email: 'thomas.muller@ams.ch',
		telephone: '+41 79 789 01 23',
		role_base: 'ad',
		responsabilites: [
			{ type: 'direction', scope: 'service', adjoint: false }
		]
	},
	{
		id: '8',
		nom: 'Blanc',
		prenom: 'Julie',
		email: 'julie.blanc@ams.ch',
		telephone: '+41 79 890 12 34',
		role_base: 'etudiant',
		responsabilites: []
	},
	{
		id: '9',
		nom: 'Perret',
		prenom: 'Lucas',
		email: 'lucas.perret@ams.ch',
		telephone: '+41 79 901 23 45',
		role_base: 'ta',
		responsabilites: []
	},
	{
		id: '10',
		nom: 'Weber',
		prenom: 'Emma',
		email: 'emma.weber@ams.ch',
		telephone: '+41 79 012 34 56',
		role_base: 'ad',
		responsabilites: [
			{ type: 'qualite', scope: 'base', adjoint: true, adjoint_de: 'Marie Dubois' }
		]
	}
];
