export default interface IBike {
	readonly id: number
	numero: number
	colaborador_id: number
	status: boolean
	readonly createdAt: Date
	readonly updatedAt: Date
}