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
	MoreVertRounded
} from '@mui/icons-material'

import { useReleasesContext } from 'contexts/ReleasesContext'
import { useUserContext } from 'contexts/UserContext'
import moment from 'moment'
import { Form } from 'styles/commom'
import Input from 'components/Input'
import Modal from 'components/Modal'
import Unauthorized from 'pages/Unauthorized'
import { useCollaboratorsContext } from 'contexts/CollaboratorsContext'
import IRelease from 'interfaces/IRelease'

const Releases = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl) // HTML Element
	const [isOpen, setIsOpen] = useState(false)

	const [killometers, setKillometers] = useState<number>(0)
	const [hours, setHours] = useState<number>(0)
	const [selectedRelease, setSelectedRelease] = useState<IRelease>({} as IRelease)
	const average = killometers/hours

	const { releases, removeRelease, getReleases, getReleaseById, updateRelease, validateRelease } = useReleasesContext()
	const { user, token } = useUserContext()
	const { getCollaborators, getCollaboratorNameById } = useCollaboratorsContext()

	useEffect(() => {
		if (token && user.nivel_id === 2) {
			getCollaborators()
			getReleases()
		}
	}, [token, user])

	if (user.nivel_id !== 2) return <Unauthorized />

	const handleCloseModal = () => {
		setIsOpen(false)
		setKillometers(0)
		setHours(0)
		setSelectedRelease({} as IRelease)
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
			collaboratorId: selectedRelease.colaborador_id,
			releaseDate: selectedRelease.createdAt,
			idToEdit: selectedRelease.id
		})) {
			await updateRelease(selectedRelease.id, killometers, hours, selectedRelease.colaborador_id)
			setIsOpen(false)
			handleCloseMenu()
		}
	}
	const handleEditRelease = async () => {
		const res = await getReleaseById(Number(anchorEl?.id))
		if (res) {
			setKillometers(Number(res.km))
			setHours(Number(res.tempo))
			setSelectedRelease(res)
			setIsOpen(true)
			handleCloseMenu()
		}
	}
	
	return (
		<>
			<h1>Gerenciar Lançamentos</h1>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead>
						<TableRow>
							<TableCell align='left'>ID</TableCell>
							<TableCell align='left'>Distância</TableCell>
							<TableCell align='left'>Tempo</TableCell>
							<TableCell align='left'>Colaborador</TableCell>
							<TableCell align='left'>Criação</TableCell>
							<TableCell align='left'>Atualização</TableCell>
							<TableCell align='center'>Ações</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{releases[0] && releases.map((item) => (
							<TableRow key={item.id}>
								<TableCell align='left'>{item.id}</TableCell>
								<TableCell align='left'>{item.km} km</TableCell>
								<TableCell align='left'>{item.tempo} h</TableCell>
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
				title='Editar lançamento'
			>
				<Form onSubmit={e => handleSubmitEdit(e)}>
					<Input
						label='Distância (km)'
						value={killometers}
						setter={setKillometers}
						type='number'
						fullWidth
						required
					/>
					<Input
						label='Horas'
						value={hours}
						setter={setHours}
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
						Editar
					</Button>
				</Form>
			</Modal>
		</>
	)
}

export default Releases