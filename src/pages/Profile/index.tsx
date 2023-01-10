import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import Input from 'components/Input'
import { ControlledInput, Errors } from 'components/ControlledInput/styles'
import { Main, Avatar, Form, Content, SideAvatar, BackgroundImg } from './styles'
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Unauthorized from 'pages/Unauthorized'

import { useUserContext } from 'contexts/UserContext'
import { useAccessLevelsContext } from 'contexts/AccessLevelsContext'
import { useBikesContext } from 'contexts/BikesContext'
import { useCollaboratorsContext } from 'contexts/CollaboratorsContext'
import moment from 'moment'
import { FieldValues, useForm } from 'react-hook-form'

const Profile = () => {
	const { getLevels, getAccessLevelNameById } = useAccessLevelsContext()
	const { bikes, getBikes, updateBike, getAvailableBikes } = useBikesContext()
	const { updateCollaborator } = useCollaboratorsContext()
	const { user, token, checkIfCorrectPassword } = useUserContext()

	const { register, handleSubmit, formState: { errors } } = useForm()
	
	useEffect(() => {
		if (token && user) {
			getLevels()
			if (user.nivel_id == 2) getBikes()
		}
		setBikeNumber(user.bike?.numero)
	}, [user, token])
	
	const [isEditing, setIsEditing] = useState(false)
	const [bikeNumber, setBikeNumber] = useState<number | null | undefined>()

	if (!user.nivel_id) return <Unauthorized />
	
	const avatarSize = 120
	const availableBikes = getAvailableBikes()
	if (user.bike) availableBikes.push(user.bike)

	interface FieldsProps {
		email: string,
		name: string,
		oldPassword: string,
		newPassword: string
	}
	
	const handleSubmitForm = async (fields: FieldValues | FieldsProps) => {
		const { email, name, oldPassword, newPassword } = fields
		const isValid = await checkIfCorrectPassword(email, oldPassword)

		if (!isValid) {
			toast.info('Senha atual incorreta, tente novamente')
			return false
		}

		if (user.nivel_id === 2) {
			if (bikeNumber != 0 && bikeNumber != user.bike?.numero) {
				// If selected a bike different than his previous one
				const myNewBike = bikes.find(bike => bike.numero === bikeNumber)
	
				if (myNewBike) {
					await updateBike(myNewBike.id, {
						colaborador_id: user.id,
						numero: myNewBike.numero,
						status: myNewBike.status
					}, true)
				}
	
				const myPreviousBike = bikes.find(bike => bike.numero === user.bike?.numero)
	
				if (myPreviousBike) {
					await updateBike(myPreviousBike.id, {
						colaborador_id: null,
						numero: myPreviousBike.numero,
						status: myPreviousBike.status
					}, true)
				}
			} else if (bikeNumber == 0 && user.bike) {
				// If selected none and previously had a bike
				const myPreviousBike = bikes.find(bike => bike.id === user.bike?.id)
	
				if (myPreviousBike) {
					await updateBike(myPreviousBike.id, {
						colaborador_id: null,
						numero: myPreviousBike.numero,
						status: myPreviousBike.status
					}, true)
				}
			}
		}

		await updateCollaborator(user.id, {
			nome: name,
			email: email,
			senha: newPassword,
			nivel_id: user.nivel_id,
			ativo: true,
			numeroBike: bikeNumber != 0 ? bikeNumber : null
		}, true)

		setIsEditing(false)
	}

	return (
		<Main>
			<Content>
				<SideAvatar>
					<h1>Conta</h1>
					<Avatar
						alt={user.nome && user.nome[0]}
						sx={{fontSize: avatarSize, width: avatarSize+10 , height: avatarSize+10}}
						// src={user.avatarUrl}
					>
						{user.nome && user?.nome[0]}
					</Avatar>
				</SideAvatar>
				<Form onSubmit={handleSubmit((e) => handleSubmitForm(e))}>
					<Input
						type='number'
						label='ID'
						fullWidth
						value={`${user.id}`}
						disabled
					/>
					<ControlledInput
						{...register('name',{
							required: 'Campo obrigatório',
							maxLength: {value: 128, message: 'Máximo de 128 caracteres'},
							minLength: {value: 3, message: 'Mínimo de 3 caracteres'},
							value: user.nome
						})}
						error={errors.name ? true : false}
						type='string'
						label='Nome'
						fullWidth
						disabled={!isEditing}
						required
					/>
					<Errors>{errors.name && `${errors.name.message}`}</Errors>
					<ControlledInput
						{...register('email',{
							required: 'Campo obrigatório',
							value: user.email
							// pattern: 
						})}
						error={errors.email ? true : false}
						type='string'
						label='E-mail'
						fullWidth
						disabled={!isEditing || user.nivel_id != 2}
						required
					/>
					<Errors>{errors.email && `${errors.email.message}`}</Errors>
					<ControlledInput
						{...register('oldPassword',{
							required: 'Campo obrigatório',
							maxLength: {value: 128, message: 'Máximo de 128 caracteres'},
							minLength: {value: 6, message: 'Mínimo de 6 caracteres'}
						})}
						error={errors.oldPassword ? true : false}
						type='password'
						label='Senha'
						fullWidth
						disabled={!isEditing}
						required
					/>
					<Errors>{errors.oldPassword && `${errors.oldPassword.message}`}</Errors>
					<ControlledInput
						{...register('newPassword',{
							required: 'Campo obrigatório',
							maxLength: {value: 128, message: 'Máximo de 128 caracteres'},
							minLength: {value: 6, message: 'Mínimo de 6 caracteres'}
						})}
						error={errors.newPassword ? true : false}
						type='password'
						label='Nova senha'
						fullWidth
						disabled={!isEditing}
						required
					/>
					<Errors>{errors.newPassword && `${errors.newPassword.message}`}</Errors>
					<FormControl fullWidth>
						<InputLabel id='bike-label'>Bicicleta</InputLabel>
						<Select
							labelId='bike-label'
							label='Bicicleta'
							color='primary'
							value={String(bikeNumber)}
							onChange={e => setBikeNumber(Number(e.target.value))}
							margin='dense'
							fullWidth
							required
							disabled={!isEditing || user.nivel_id != 2}
						>
							
							{availableBikes.length > 0 && <MenuItem value={0}>Nenhuma</MenuItem>}
							{availableBikes.length > 0 ?
								availableBikes.map(item => (
									<MenuItem value={item.numero} key={item.numero}>{item.numero}</MenuItem>
								))
								: <MenuItem value={0}>Nenhuma bicicleta disponível</MenuItem>
							}
						</Select>
					</FormControl>
					<Input
						label='Data de registro'
						value={`${moment(user.data_registro?.toLocaleString()).format('DD/MM/YYYY')}`}
						type='string'
						fullWidth
						disabled
						sx={{marginTop: 3}}
					/>
					<Input
						label='Perfil de acesso'
						value={`${getAccessLevelNameById(user.nivel_id)}`}
						type='string'
						fullWidth
						disabled
					/>
					{!isEditing ?
						<Button
							onClick={() => setIsEditing(true)}
							type='button'
							variant='outlined'
							sx={{marginTop: 3}}
						>
							Editar
						</Button>
						: <>
							<Button
								onClick={() => setIsEditing(false)}
								type='button'
								variant='outlined'
								color='error'
								sx={{marginTop: 3}}
							>
								Cancelar
							</Button>
							<Button
								type='submit'
								variant='outlined'
								sx={{marginTop: 3}}
							>
								Salvar
							</Button>
						</>
					}
				</Form>
			</Content>
			<BackgroundImg />
		</Main>	
	)
}


export default Profile