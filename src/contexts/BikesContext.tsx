import React, { useState, useEffect } from 'react'
import IBike from 'interfaces/IBike'
import http from 'services/http'
import { AxiosRequestConfig } from 'axios'
import { useUserContext } from './UserContext'
import { toast } from 'react-toastify'
   
interface Props {
	bikes: IBike[]
	getBikes: () => void
	getBikeById: (id: number) => Promise<IBike | undefined>
	addBike: (bike: addOrUpdateProps) => void
	updateBike: (id: number, bike: addOrUpdateProps, userKnowsAvailableBikes?: boolean) => void
	deleteBike: (id: number) => void
	inactivateBike: (id: number) => void
	isCollaboratorUsingOtherBike: (bikeId: number, collaboratorId: number) => boolean
	getAvailableBikes: () => IBike[]
}

interface addOrUpdateProps {
	numero: number
	colaborador_id: number | null
	status: boolean | string
}

const BikesContext = React.createContext<Props>({} as Props)
BikesContext.displayName = 'BikesContext'

export const BikesProvider = ({children}: {children: JSX.Element}) => {
	const [bikes, setBikes] = useState<IBike[]>({} as IBike[])

	const { token, user, setUser } = useUserContext()
	let config: AxiosRequestConfig

	useEffect(() => {
		if (token && user.nivel_id === 2) getBikes()
	}, [token])

	const sortBikesByIdAsc = (bikes: IBike[]) => {
		return bikes.sort((a, b) => a.id - b.id)
	}

	const isCollaboratorUsingOtherBike = (bikeId: number, collaboratorId: number) => {
		const bikesWithSameCollaborator = bikes.filter(
			bike => bike.colaborador_id === collaboratorId && bike.id != bikeId
		)
		return (bikesWithSameCollaborator.length > 0) ? true : false
	}

	const getAvailableBikes = () => {
		const available = bikes[0] && bikes.filter(bike => 
			bike.status == true && bike.colaborador_id == null)
		return (available && available.length >= 1) ? available : []
	}

	const getBikes = async () => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		try {
			const res = await http.get<IBike[]>('bicicletas', config)
			setBikes(res.data)
		} catch (error: any) {
			if (error.response.status < 400) toast.error('Não foi possível obter a lista de bicicletas')
		}
	}

	const getBikeById = async (id: number) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		try {
			const res = await http.get<IBike>(`bicicletas/${id}`, config)
			return res.data
		} catch (error: any) {
			if (error.response.status < 400) toast.error(`Não foi possível obter dados da bicicleta #${id}`)
		} 
	}

	const addBike = async (bike: addOrUpdateProps) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		const { numero, status } = bike
		let { colaborador_id } = bike

		colaborador_id = (colaborador_id == 0 || colaborador_id == null) ? null : colaborador_id

		const main = new Promise((resolve, reject) => {
			http.post<IBike>('bicicletas', {
				numero, colaborador_id, status
			}, config)
				.then(res => {
					resolve(setBikes([...bikes, res.data]))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: 'Bicicleta adicionada com sucesso',
				error: 'Não foi possível adicionar a bicicleta'
			}
		)
	}

	const updateBike = async (id: number, bike: addOrUpdateProps, userKnowsAvailableBikes?: boolean) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		const { numero } = bike
		let { status, colaborador_id } = bike
		
		colaborador_id = (colaborador_id == 0 || colaborador_id == null) ? null : colaborador_id
		status = (status === 'true') || (status === true)

		if (status == false && colaborador_id) {
			toast.info('Não é possível desativar a bicicleta, a mesma está em uso.')
			return false
		}

		if (!userKnowsAvailableBikes && colaborador_id && isCollaboratorUsingOtherBike(id, colaborador_id)) {
			toast.info('O colaborador selecionado está utilizando outra bicicleta')
			return false
		}
		
		const main = new Promise((resolve, reject) => {
			http.put<IBike>(`bicicleta/${id}`, {
				numero, colaborador_id, status
			}, config)
				.then(res => {
					if (id === user.bike?.id || colaborador_id === user.id) {
						(!res.data.colaborador_id) ? setUser({...user, bike: null}) : setUser({...user, bike: res.data})
						
						localStorage.removeItem('user') // User must login again next session
					}

					const updatedList = bikes.filter(bike => bike.id !== id)
					updatedList.push(res.data)
					const final = sortBikesByIdAsc(updatedList)
					resolve(setBikes(final))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: `Bicicleta #${numero} atualizada com sucesso!` ,
				error: 'Não foi possível atualizar a bicicleta'
			}
		)
	}

	const inactivateBike = async (id: number) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		const bike = await getBikeById(id)
		if (bike) {
			if (bike.colaborador_id) {
				toast.info('Não é possível desativar a bicicleta, a mesma está em uso.')
				return false
			}			
			bike.status = false
		}

		const main = new Promise((resolve, reject) => {
			http.put<IBike>(`bicicleta/${id}`, bike, config)
				.then(res => {
					const updatedList = bikes.filter(bike => bike.id !== id)
					updatedList.push(res.data)
					const final = sortBikesByIdAsc(updatedList)
					resolve(setBikes(final))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: 'Bicicleta desativada com sucesso!',
				error: 'Não foi possível desativar a bicicleta'
			}
		)
	}

	const deleteBike = async (id: number) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		const bike = await getBikeById(id)
		if (bike) {
			if (bike.colaborador_id) {
				toast.info('Não é possível remover a bicicleta, a mesma está em uso.')
				return false
			}			
		}

		const main = new Promise((resolve, reject) => {
			http.delete<IBike>(`bicicleta/${id}`, config)
				.then(() => {
					const updatedList = bikes.filter(bike => bike.id !== id)
					resolve(setBikes(updatedList))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: 'Bicicleta removida com sucesso!',
				error: 'Não foi possível remover a bicicleta'
			}
		)
	}

	return (
		<BikesContext.Provider value={{
			bikes,
			getBikes,
			getBikeById,
			addBike,
			updateBike,
			deleteBike,
			inactivateBike,
			isCollaboratorUsingOtherBike,
			getAvailableBikes
		}}>
			{children}
		</BikesContext.Provider>
	)
}

export const useBikesContext = () => {
	return React.useContext(BikesContext)
}