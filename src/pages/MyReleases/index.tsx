import React, { useState, useEffect } from 'react'

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Menu,
	MenuItem,
	Button,
	Chip
} from '@mui/material'

import {
	EditRounded,
	DeleteRounded,
	MoreVertRounded,
	AddRounded
} from '@mui/icons-material'

import moment from 'moment'
import { Header, Form } from 'styles/commom'
import Modal from 'components/Modal'
import Input from 'components/Input'
import { useReleasesContext } from 'contexts/ReleasesContext'
import { useUserContext } from 'contexts/UserContext'
import Unauthorized from 'pages/Unauthorized'
import IRelease from 'interfaces/IRelease'

const MyReleases = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl) // HTML Element
	const [isOpen, setIsOpen] = useState(false)

	const [killometers, setKillometers] = useState<number>(0)
	const [hours, setHours] = useState<number>(0)
	const [selectedRelease, setSelectedRelease] = useState<IRelease>({} as IRelease)
	const [isEditing, setIsEditing] = useState(false)
	const average = killometers/hours

	const { releases, addRelease, getReleases, getMyReleases, getReleaseById, removeRelease, updateRelease, validateRelease } = useReleasesContext()
	const { user, token } = useUserContext()
	const myreleases = releases.filter(item => item.colaborador_id === user.id)

	useEffect(() => {
		if (token && user.id) user.nivel_id === 2 ? getReleases() : getMyReleases()
	}, [token, user])
	
	if (!user.nivel_id) return <Unauthorized />

	const handleCloseModal = () => {
		setIsOpen(false)
		setKillometers(0)
		setHours(0)
		setSelectedRelease({} as IRelease)
		setIsEditing(false)
	}

	const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleCloseMenu = () => {
		setAnchorEl(null)
	}
	const handleDeleteRelease = () => {
		anchorEl ? removeRelease(Number(anchorEl.id)) : null
		handleCloseMenu()
	}
	const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (validateRelease({
			killometers,
			hours,
			collaboratorId: user.id,
			releaseDate: selectedRelease.createdAt,
			idToEdit: selectedRelease.id
		})) {
			await updateRelease(selectedRelease.id, killometers, hours, user.id)
			setIsOpen(false)
			handleCloseMenu()
		}
	}
	const handleEditRelease = async () => {
		setIsEditing(true)
		const res = await getReleaseById(Number(anchorEl?.id))
		if (res) {
			setKillometers(Number(res.km))
			setHours(Number(res.tempo))
			setSelectedRelease(res)
			setIsOpen(true)
			handleCloseMenu()
		}
	}
	const handleAddRelease = () => {
		setIsEditing(false)
		setIsOpen(true)
	}
	const handleSubmitAdd = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (validateRelease({
			killometers,
			hours,
			collaboratorId: user.id,
			releaseDate: new Date()
		})) {
			await addRelease(killometers, hours)
			handleCloseModal()
		}
	}
	
	return (
		<>
			<Header>
				<h1>Meus Lançamentos</h1>
				<Button
					variant="outlined"
					color="success"
					sx={{margin: 'auto 0px'}}
					onClick={handleAddRelease}
				>
					<AddRounded />
					Adicionar
				</Button>
			</Header>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead>
						<TableRow>
							<TableCell align='left'>ID</TableCell>
							<TableCell align='left'>Distância</TableCell>
							<TableCell align='left'>Tempo</TableCell>
							<TableCell align='left'>Criação</TableCell>
							<TableCell align='left'>Atualização</TableCell>
							<TableCell align='center'>Ações</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{myreleases[0] && myreleases.map((item) => (
							<TableRow key={item.id}>
								<TableCell align='left'>{item.id}</TableCell>
								<TableCell align='left'>{item.km} km</TableCell>
								<TableCell align='left'>{item.tempo} h</TableCell>
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
				<MenuItem onClick={handleEditRelease} style={{gap: 6}}>
					<EditRounded color='warning'/> Editar
				</MenuItem>
				<MenuItem onClick={handleDeleteRelease} style={{gap: 6}}>
					<DeleteRounded color='error' /> Remover
				</MenuItem>
			</Menu>

			<Modal
				isOpen={isOpen}
				onClose={() => handleCloseModal()}
				title={isEditing ? 'Editar lançamento' : 'Adicionar lançamento'}
			>
				<Form onSubmit={(e) => isEditing ? handleSubmitEdit(e) : handleSubmitAdd(e)}>
					<Input
						label='Distância (km)'
						value={killometers}
						setter={e => setKillometers(parseFloat(e))}
						type='number'
						fullWidth
						required
					/>
					<Input
						label='Horas'
						value={hours}
						setter={e => setHours(parseFloat(e))}
						type='number'
						fullWidth
						required
					/>
					{average > 0 && hours > 0 && <Chip variant='outlined' color='success' label={`Média de ${average.toFixed(2)} km/h` }/>}
					<Button
						variant='outlined'
						color='success'
						type='submit'
						sx={{marginTop: 2}}
					>
						{isEditing ? 'Editar' : 'Adicionar'}
					</Button>
				</Form>
			</Modal>
		</>
	)
}

export default MyReleases