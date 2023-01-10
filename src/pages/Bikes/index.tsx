import React, { useEffect, useState } from 'react'

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	Menu,
	MenuItem,
	Button,
	Select,
	FormControl,
	InputLabel,
	RadioGroup,
	FormControlLabel,
	Radio
} from '@mui/material'

import {
	EditRounded,
	DeleteRounded,
	MoreVertRounded,
	AddRounded,
	BlockRounded
} from '@mui/icons-material'

import Unauthorized from 'pages/Unauthorized'
import { Header, Form } from 'styles/commom'
import Modal from 'components/Modal'
import { useUserContext } from 'contexts/UserContext'
import { useBikesContext } from 'contexts/BikesContext'
import { useCollaboratorsContext } from 'contexts/CollaboratorsContext'
import { toast } from 'react-toastify'
import moment from 'moment'
import { ControlledInput, Errors } from 'components/ControlledInput/styles'
import { FieldValues, useForm } from 'react-hook-form'

const Bikes = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const [isOpen, setIsOpen] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [selectedBike, setSelectedBike] = useState<number>(0)

	interface FormProps {
		bikeNumber: number
	}
	const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormProps>()

	const [collaboratorId, setCollaboratorId] = useState<number>(0)
	const [isActive, setIsActive] = useState<string>('true')

	const { user, token } = useUserContext()
	const { getCollaboratorNameById, collaborators, getCollaborators } = useCollaboratorsContext()
	const { bikes, getBikes, getBikeById, addBike, deleteBike, updateBike, inactivateBike, isCollaboratorUsingOtherBike } = useBikesContext()
	
	useEffect(() => {
		if (token && user.nivel_id === 2) {
			getCollaborators()
			getBikes()
		}
	}, [token, user])

	if (user.nivel_id !== 2) return <Unauthorized />

	const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleCloseMenu = () => {
		setAnchorEl(null)
	}
	const handleCloseModal = () => {
		setIsOpen(false)
		setTimeout(() => {
			setValue('bikeNumber', 1000)
			setCollaboratorId(0)
			setSelectedBike(0)
			setIsActive('true')
			setIsEditing(false)
			reset()
		}, 500)
	}
	const handleAddBike = () => {
		setIsEditing(false)
		setIsOpen(true)
		handleCloseMenu()
	}
	const handleSubmitAdd = (e: FieldValues | FormProps) => {
		addBike({
			colaborador_id: Number(collaboratorId),
			numero: e.bikeNumber,
			status: true
		})
		handleCloseModal()
	}
	const handleEditBike = async () => {
		setIsEditing(true)
		const res = await getBikeById(Number(anchorEl?.id))
		if (res) {
			setValue('bikeNumber', res.numero)
			setCollaboratorId(res.colaborador_id)
			setSelectedBike(Number(anchorEl?.id))
			setIsActive(String(res.status))
			setIsOpen(true)
			handleCloseMenu()
		}
	}
	const handleSubmitEdit = async (e: FieldValues | FormProps) => {
		if (isActive == 'false' && collaboratorId) {
			toast.info('Não é possível desativar a bicicleta, a mesma está em uso.')
			return false
		}
		
		if (collaboratorId && isCollaboratorUsingOtherBike(selectedBike, collaboratorId)) {
			toast.info('O colaborador selecionado está utilizando outra bicicleta')
			return false
		}

		await updateBike(selectedBike, {
			colaborador_id: Number(collaboratorId),
			numero: e.bikeNumber,
			status: isActive
		})
		setIsOpen(false)
		handleCloseMenu()
	}
	const handleDeleteBike = async () => {
		await deleteBike(Number(anchorEl?.id))
		handleCloseMenu()
	}
	const handleInactivateBike = async () => {
		await inactivateBike(Number(anchorEl?.id))
		handleCloseMenu()
	}

	return (
		<>
			<Header>
				<h1>Gerenciar Bicicletas</h1>
				<Button
					variant='outlined'
					color='success'
					sx={{margin: 'auto 0px'}}
					onClick={handleAddBike}
				>
					<AddRounded />
					Adicionar
				</Button>
			</Header>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label='customized table'>
					<TableHead>
						<TableRow>
							<TableCell align='left'>ID</TableCell>
							<TableCell align='left'>Número</TableCell>
							<TableCell align='left'>Status</TableCell>
							<TableCell align='left'>Usuário</TableCell>
							<TableCell align='left'>Criação</TableCell>
							<TableCell align='left'>Atualização</TableCell>
							<TableCell align='center'>Ações</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{bikes[0] && bikes.map((item) => (
							<TableRow key={item.id} style={item.colaborador_id === user.id ? {backgroundColor: '#e9f1f5'} : {}}>
								<TableCell align='left'>{item.id}</TableCell>
								<TableCell align='left'>{item.numero}</TableCell>
								<TableCell align='left'>
									{item.status && item.colaborador_id ? <Chip variant='outlined' color='info' label='Em uso'/> 
										: item.status ? <Chip variant='outlined' color='success' label='Disponível'/>
											: <Chip variant='outlined' color='error' label='Inativa' />
									}
								</TableCell>
								<TableCell align='left'>{`${getCollaboratorNameById(item.colaborador_id)}`}</TableCell>
								<TableCell align='left'>{
									`${moment(item.createdAt).format('DD/MM/YYYY')}`
								}</TableCell>
								<TableCell align='left'>{
									`${moment(item.updatedAt).format('DD/MM/YYYY')}`
								}</TableCell>
								<TableCell align='center'>
									<Button onClick={e => handleMenu(e)} id={`${item.id}`}>
										<MoreVertRounded />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleCloseMenu}
			>
				<MenuItem onClick={handleEditBike} style={{gap: 6}}>
					<EditRounded color='warning'/> Editar
				</MenuItem>
				<MenuItem onClick={handleInactivateBike} style={{gap: 6}}>
					<BlockRounded color='warning' /> Desativar
				</MenuItem>
				<MenuItem onClick={handleDeleteBike} style={{gap: 6}}>
					<DeleteRounded color='error' /> Remover
				</MenuItem>
			</Menu>

			<Modal
				isOpen={isOpen}
				onClose={handleCloseModal}
				title={isEditing ? 'Editar bicicleta' : 'Adicionar bicicleta'}
			>
				<Form
					style={{paddingTop: 20}}
					onSubmit={handleSubmit((e) => isEditing ? handleSubmitEdit(e) : handleSubmitAdd(e))}
				>
					<ControlledInput
						{...register('bikeNumber',{
							required: 'Campo obrigatório',
							maxLength: {value: 4, message: 'Máximo de 4 dígitos'},
							minLength: {value: 4, message: 'Mínimo de 4 dígitos'}
						})}
						error={errors.bikeNumber ? true : false}
						label='Número'
						type='number'
						fullWidth
						required
					/>
					<Errors>{errors.bikeNumber && `${errors.bikeNumber.message}`}</Errors>
					<FormControl fullWidth>
						<InputLabel id='user-label'>Usuário (opcional)</InputLabel>
						<Select
							labelId='user-label'
							label='Usuário (opcional)'
							color='primary'
							value={collaboratorId}
							onChange={e => setCollaboratorId(Number(e.target.value))}
							fullWidth
						>
							<MenuItem value={0}>Nenhum</MenuItem>
							{collaborators[0] && collaborators.map(item => (
								<MenuItem value={item.id} key={item.id}>{item.nome}</MenuItem>
							))}
						</Select>
					</FormControl>
					{isEditing && 
					<FormControl style={{width: '95%'}}>
						<RadioGroup
							value={isActive}
							onChange={e => setIsActive((e.target as HTMLInputElement).value)}
							style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}
						>
							<FormControlLabel value='true' control={<Radio />} label='Ativa' />
							<FormControlLabel value='false' control={<Radio />} label='Inativa' />
						</RadioGroup>
					</FormControl>
					}
					<Button
						variant='outlined'
						color='success'
						type='submit'
					>
						{isEditing ? 'Editar' : 'Adicionar'}
					</Button>
				</Form>
			</Modal>
		</>
	)
}

export default Bikes