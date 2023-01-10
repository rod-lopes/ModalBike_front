import React, { useEffect, useState } from 'react'
import IUser from 'interfaces/IUser'
import http from 'services/http'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import ICollaborator from 'interfaces/ICollaborator'
import { AxiosRequestConfig } from 'axios'
   
interface Props {
	user: IUser
	setUser: React.Dispatch<React.SetStateAction<IUser>>
	setToken: React.Dispatch<React.SetStateAction<string | null | undefined>>
	token: string | null | undefined
	login: (email: string, password: string) => void
	logout: () => void
	checkIfCorrectPassword: (email: string, password: string) => Promise<boolean | undefined>
}

const UserContext = React.createContext<Props>({} as Props)
UserContext.displayName = 'UserContext'

export const UserProvider = ({children}: {children: JSX.Element}) => {
	const [user, setUser] = useState<IUser>({} as IUser)
	const [token, setToken] = useState<string | null | undefined>(localStorage.getItem('token'))

	const navigate = useNavigate()

	interface TokenProps {
		id: number
		iat: number
		exp: number
	}

	useEffect(() => {
		let config: AxiosRequestConfig

		async function loadUserFromStorage() {
			const user = localStorage.getItem('user')
			if (user) {
				const userObj = jwtDecode(user) as IUser
				setUser(userObj)
				if (window.location.pathname === '/') navigate('/system/myreleases')
			} else if (token) {
				const myId = jwtDecode<TokenProps>(token).id
				token ? config = {headers: {Authorization: `Bearer ${token}`}} : null
				
				try {
					const res = await http.get<ICollaborator>(`colaboradores/${myId}`, config)
					const myUser = res.data
					myUser ? setUser(myUser) : setUser({} as IUser)
				} catch (error) {
					null
				}
			} else {	
				setUser({} as IUser)
			}
		}
		loadUserFromStorage()
	}, [])

	const login = async (email: string, password: string) => {		
		try {
			const res = await http.post<{
				mensagem: string, colaborador: string, token: string
			}>('login', {email: email, senha: password})

			const { colaborador, token } = res.data
			const colaboradorObj = jwtDecode(colaborador) as IUser

			if (colaboradorObj.nivel_id === 3) {
				toast.info(`${colaboradorObj.nome.split(' ')[0]}, seu acesso ainda não foi concedido. Aguarde liberação.`, {autoClose: false})
				return false
			}
			
			delete colaboradorObj.senha //Security reasons

			setUser(colaboradorObj)
			setToken(token)
			localStorage.setItem('token', token)
			localStorage.setItem('user', colaborador)
			toast.success(`Bem vindo(a) ${colaboradorObj.nome.split(' ')[0]}!`)
			setTimeout(() => navigate('/system/myreleases'), 2500)
		} catch (error: any) {
			if (error.response.status < 400) toast.error('Não foi possível acessar a plataforma')
		}
	}

	const logout = async () => {
		setUser({} as IUser)
		setToken('')
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		navigate('/')
	}

	const checkIfCorrectPassword = async (email: string, password: string) => {
		try {
			const res = await http.post<{
				mensagem: string, colaborador: IUser, token: string
			}>('login', {email: email, senha: password})
			if (res.data.colaborador) return true
		} catch (error: any) {
			return false
		}
	}

	return (
		<UserContext.Provider value={{
			user,
			setUser,
			token,
			setToken,
			login,
			logout,
			checkIfCorrectPassword
		}}>
			{children}
		</UserContext.Provider>
	)
}

export const useUserContext = () => {
	return React.useContext(UserContext)
}