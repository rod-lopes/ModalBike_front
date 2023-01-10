import IPagination from 'interfaces/IPagination'

export const userPages: IPagination[] = [
	{
		id: 1,
		title: 'Conta',
		path: '/system/me'
	},
	{
		id: 2,
		title: 'Meus lançamentos',
		path: '/system/myreleases'
	},
	{
		id: 3,
		title: 'Documentação',
		path: '/system/docs'
	}
]


export const adminPages: IPagination[] = [
	{
		id: 1,
		title: 'Dashboard',
		path: '/admin/dashboard'
	},
	{
		id: 2,
		title: 'Lançamentos',
		path: '/admin/releases'
	},
	{
		id: 3,
		title: 'Colaboradores',
		path: '/admin/collaborators'
	},
	{
		id: 4,
		title: 'Bicicletas',
		path: '/admin/bikes'
	}
]