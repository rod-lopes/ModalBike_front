import React, { useState } from 'react'
import IRelease from 'interfaces/IRelease'
import http from 'services/http'
import { useUserContext } from './UserContext'
import { AxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { useCollaboratorsContext } from './CollaboratorsContext'

interface Props {
	releases: IRelease[]
	getReleases: () => void
	getMyReleases: () => void
	getReleaseById: (id: number) => Promise<IRelease | undefined>
	addRelease: (km: number, tempo: number) => void
	removeRelease: (id: number) => void
	updateRelease: (releaseId: number, km: number, tempo: number, collaboratorId: number) => void
	validateRelease: (props: validateProps) => boolean
}

interface validateProps {
	killometers: number
	hours: number
	collaboratorId: number
	releaseDate: Date
	idToEdit?: number
}

const ReleasesContext = React.createContext<Props>({} as Props)
ReleasesContext.displayName = 'ReleasesContext'

export const ReleasesProvider = ({children}: {children: JSX.Element}) => {
	const [releases, setReleases] = useState<IRelease[]>([])

	const { user, token } = useUserContext()
	const { collaborators } = useCollaboratorsContext()
	let config: AxiosRequestConfig

	const sortReleasesByIdAsc = (releases: IRelease[]) => {
		return releases.sort((a, b) => a.id - b.id)
	}

	const getReleases = async () => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		const main = new Promise((resolve, reject) => {
			http.get<IRelease[]>('lancamentos', config)
				.then(res => {
					setReleases(res.data)
					setTimeout(resolve, 1)
				})
				.catch(() => {
					setTimeout(reject, 1)
				})
		})
		toast.promise(
			main,
			{
				error: 'Não foi possível obter a lista de lançamentos'
			}
		)
	}

	const getMyReleases = async () => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		try {
			const res = await http.get<IRelease[]>(`lancamento/${user.id}`, config)
			setReleases(res.data)
		} catch (error: any) {
			if (error.response.status < 400) toast.error('Não foi possível obter os seus lançamentos')
		}
	}

	const getReleaseById = async (id: number) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		try {
			const res = await http.get<IRelease>(`lancamentos/${id}`, config)
			return res.data
		} catch (error: any) {
			if (error.response.status < 400) toast.error('Não foi possível obter os dados do lançamento')
		}
	}

	const addRelease = async (km: number, tempo: number) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		const main = new Promise((resolve, reject) => {
			http.post<IRelease>('lancamentos', {
				km, tempo, colaborador_id: user.id, bicicleta_id: user.bike?.id
			}, config)
				.then(res => {
					res.data.tempo = parseFloat(`${res.data.tempo}`)
					res.data.km = parseFloat(`${res.data.km}`)
					resolve(setReleases([...releases, res.data]))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: 'Lançamento adicionado com sucesso',
				error: 'Não foi possível adicionar o lançamento'
			}
		)
	}

	const removeRelease = async (id: number) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null
		
		const main = new Promise((resolve, reject) => {
			http.delete(`lancamentos/${id}`, config)
				.then(() => {
					const filtered = releases.filter(release => release.id !== id)
					resolve(setReleases(filtered))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: `Lançamento #${id} removido com sucesso`,
				error: `Não foi possível remover o lançamento #${id}`
			}
		)
	}

	const updateRelease = async (releaseId: number, km: number, tempo: number, collaboratorId: number) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null
		
		const main = new Promise((resolve, reject) => {
			http.put<IRelease>(`lancamentos/${releaseId}`, {
				km, tempo, colaborador_id: collaboratorId
			}, config)
				.then(res => {
					const updatedList = releases.filter(release => release.id !== releaseId)
					updatedList.push(res.data)
					const final = sortReleasesByIdAsc(updatedList)
					resolve(setReleases(final))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: `Lançamento #${releaseId} atualizado com sucesso`,
				error: `Não foi possível atualizar o lançamento #${releaseId}`
			}
		)
	}

	const validateRelease = ({killometers, collaboratorId, hours, releaseDate, idToEdit}: validateProps) => {
		// Step 1
		if (user.nivel_id == 1 && !user.bike) {
			toast.info(`${user.nome.split(' ')[0]}, você precisa de uma bicicleta para criar lançamentos`)
			return false
		} else if (user.nivel_id == 2) {
			const collaborator = collaborators[0] && collaborators.find(item => item.id == collaboratorId)
			if (collaborator && !collaborator.bike) {
				toast.info(`${collaborator.nome.split(' ')[0]}${collaboratorId == user.id ? ', você' : null} precisa de uma bicicleta para criar lançamentos`)
				return false
			}
		}

		// Step 2
		if (killometers <= 0 || hours <= 0) {
			toast.info('Preencha os dados corretamente')
			return false
		}

		// Step 3
		const average = killometers / hours
		const maxAverage = Number(process.env.REACT_APP_MAX_AVERAGE_SPEED)

		if (!(average <= maxAverage)) {
			toast.info(`Média de velocidade excedida, insira valores inferiores ou iguais a ${maxAverage}`)
			return false
		}
		
		// Step 4
		const baseDate = new Date(releaseDate).toLocaleDateString('pt-br')
		const collaboratorReleases = releases.filter(release => release.colaborador_id === collaboratorId)

		const distance = collaboratorReleases.reduce((sum, release) => {
			const idxDate = new Date(release.createdAt).toLocaleDateString('pt-br')
			if (idToEdit) {
				return (idxDate == baseDate && (release.id != idToEdit)) ? sum + release.km : sum + 0
			} else {
				return (idxDate == baseDate) ? sum + release.km : sum + 0
			}
		}, 0)

		const limitKmPerDay = Number(process.env.REACT_APP_LIMIT_KILLOMETERS_PER_DAY)
		const remainingKmAvailable = limitKmPerDay - Number(distance)
		const final = remainingKmAvailable - Number(killometers)

		if (final < 0) {
			toast.info(
				remainingKmAvailable > 0 ? 
					`Limite de lançamentos excedido na data de ${baseDate}. Você ainda pode adicionar mais ${remainingKmAvailable} km(s)`
					: `Limite de lançamentos excedido na data de ${baseDate}. Você pode adicionar ${limitKmPerDay} kms/dia`, {autoClose: 8000})
			return false
		} 

		return true
	}

	return (
		<ReleasesContext.Provider value={{
			releases,			
			getReleases,
			getMyReleases,
			getReleaseById,
			addRelease,
			removeRelease,
			updateRelease,
			validateRelease
		}}>
			{children}
		</ReleasesContext.Provider>
	)
}

export const useReleasesContext = () => {
	return React.useContext(ReleasesContext)
}