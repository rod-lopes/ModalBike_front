export default interface IRelease {
	readonly id: number,
	km: number,
	tempo: number,
	colaborador_id: number,
	bicicleta_id: number,
	readonly createdAt: Date,
	readonly updatedAt: Date
}