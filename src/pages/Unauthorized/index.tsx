import { ArrowBackRounded } from '@mui/icons-material'
import { Button } from '@mui/material'
import Default from 'pages/Default'
import { Container } from './styles'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from 'contexts/UserContext'

const Unauthorized = () => {
	const navigate = useNavigate()
	const { user } = useUserContext()

	if (user.nivel_id == 2) return null

	return (
		<Default>
			<Container>
				<Button color='primary' variant='contained' onClick={() => navigate(-1)}><ArrowBackRounded /> Voltar</Button>
				<p>Você não possui permissão para o serviço requisitado</p>
				<img src='/assets/unauthorized.png' alt='Não autorizado' />
			</Container>
		</Default>
	)
}
 
export default Unauthorized