import React, { useState, useEffect } from 'react'
import ICollaborator from 'interfaces/ICollaborator'
import http from 'services/http'
import { AxiosRequestConfig } from 'axios'
import { useUserContext } from './UserContext'
import { toast } from 'react-toastify'
   
interface Props {
	collaborators: ICollaborator[]
	getCollaborators: () => void
	getCollaboratorById: (id: number) => Promise<ICollaborator | undefined>
	getCollaboratorNameById: (id: number) => void
	addColaborator: (collaborator: addOrUpdateProps, isSignUpPage?: boolean) => void
	updateCollaborator: (id: number, collaborator: addOrUpdateProps, isUpdatingCurrentUser?: boolean) => void
	inactivateCollaborator: (id: number) => void
	guaranteeAccess: (collaboratorId: number) => void
}

interface addOrUpdateProps {
	nome: ICollaborator['nome']
	email: ICollaborator['email']
	senha?: string //Change a password isn't required
	data_registro?: ICollaborator['data_registro']
	nivel_id: ICollaborator['nivel_id']
	ativo: boolean | string
	numeroBike?: number | null 
}

const CollaboratorsContext = React.createContext<Props>({} as Props)
CollaboratorsContext.displayName = 'CollaboratorsContext'

export const CollaboratorsProvider = ({children}: {children: JSX.Element}) => {
	const [collaborators, setCollaborators] = useState<ICollaborator[]>({} as ICollaborator[])

	const { token, user, setUser } = useUserContext()
	let config: AxiosRequestConfig

	useEffect(() => {
		if (token && user.nivel_id === 2) getCollaborators()
	}, [token, user])

	const sortCollaboratorsByIdAsc = (collaborators: ICollaborator[]) => {
		return collaborators.sort((a, b) => a.id - b.id)
	}

	const getCollaborators = async () => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		try {
			const res = await http.get<ICollaborator[]>('colaboradores', config)
			setCollaborators(res.data)
		} catch (error: any) {
			if (error.response.status < 400) toast.error('Não foi possível obter a lista de colaboradores')
		}
	}

	const getCollaboratorById = async (id: number) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		try {
			const res = await http.get<ICollaborator>(`colaboradores/${id}`, config)
			return res.data
		} catch (error: any) {
			if (error.response.status < 400) toast.error(`Não foi possível obter dados do colaborador #${id}`)
		} 
	}

	const getCollaboratorNameById = (id: number) => {
		if (collaborators[0]) {
			const collaborator = collaborators.find(item => item.id === id)
			return collaborator?.nome ? collaborator.nome : ''
		}
	}

	const addColaborator = async (collaborator: addOrUpdateProps, isSignUpPage?: boolean) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		const { nome, email, senha, data_registro, nivel_id } = collaborator
		const main = new Promise((resolve, reject) => {
			http.post<ICollaborator>('colaboradores', {
				nome, email, senha, data_registro, ativo: true, nivel_id
			}, config)
				.then(res => {
					resolve(setCollaborators([...collaborators, res.data]))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: 
					isSignUpPage
						? `Bem vindo, ${collaborator.nome.split(' ')[0]}, em breve você receberá um e-mail com devidas instruções de acesso.`
						: 'Usuário adicionado com sucesso',
				error: isSignUpPage
					? 'Desculpe, não foi possível executar o cadastro. Tente novamente mais tarde.'
					: 'Não foi possível adicionar o usuário'
			}
		)
	}

	const updateCollaborator = async (id: number, collaborator: addOrUpdateProps, isUpdatingCurrentUser?: boolean) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		const { nome, email, senha, data_registro, nivel_id } = collaborator
		let { ativo } = collaborator
		ativo = (ativo === 'true') || (ativo === true)
		const body = {nome, email, senha, data_registro, ativo, nivel_id}
		if (!body.senha) delete body.senha

		const main = new Promise((resolve, reject) => {
			http.put<ICollaborator>(`colaborador/${id}`, body, config)
				.then(res => {
					const updatedList = collaborators.filter(collaborator => collaborator.id !== id)
					updatedList.push(res.data)
					
					delete res.data.senha
					if (isUpdatingCurrentUser) {
						setUser({...res.data})
						localStorage.removeItem('user') // User must login again next session
					}
					const final = sortCollaboratorsByIdAsc(updatedList)
					resolve(setCollaborators(final))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: isUpdatingCurrentUser ? 'Perfil atualizado com sucesso!' : `${nome} atualizado(a) com sucesso!`,
				error: 'Não foi possível atualizar o colaborador'
			}
		)
	}

	const inactivateCollaborator = async (id: number) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		const main = new Promise((resolve, reject) => {
			http.put<ICollaborator>(`colaborador/${id}`, {ativo: false}, config)
				.then(res => {
					const updatedList = collaborators.filter(collaborator => collaborator.id !== id)
					updatedList.push(res.data)
					const final = sortCollaboratorsByIdAsc(updatedList)
					resolve(setCollaborators(final))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: 'Usuário desativado com sucesso!',
				error: 'Não foi possível desativar o usuário'
			}
		)
	}

	const guaranteeAccess = async (collaboratorId: number) => {
		token ? config = {headers: {Authorization: `Bearer ${token}`}} : null

		const main = new Promise((resolve, reject) => {
			http.put<ICollaborator>(`liberar/${collaboratorId}`, {nivel_id: 1}, config)
				.then(res => {
					const updatedList = collaborators.filter(collaborator => collaborator.id !== collaboratorId)
					updatedList.push(res.data)
					const final = sortCollaboratorsByIdAsc(updatedList)
					resolve(setCollaborators(final))
				}).catch(() => {
					reject()
				})
		})
		toast.promise(
			main,
			{
				pending: 'Aguarde...',
				success: 'Acesso liberado com sucesso!',
				error: 'Não foi possível liberar o acesso para o usuário'
			}
		)
	}

	return (
		<CollaboratorsContext.Provider value={{
			collaborators,
			getCollaborators,
			getCollaboratorById,
			getCollaboratorNameById,
			addColaborator,
			updateCollaborator,
			inactivateCollaborator,
			guaranteeAccess
		}}>
			{children}
		</CollaboratorsContext.Provider>
	)
}

export const useCollaboratorsContext = () => {
	return React.useContext(CollaboratorsContext)
}