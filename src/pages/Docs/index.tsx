import { useUserContext } from 'contexts/UserContext'
import Unauthorized from 'pages/Unauthorized'
import { Object } from './styles'

const Docs = () => {
	const { user } = useUserContext()
	if (!user.nivel_id) return <Unauthorized />

	return (
		<>
			<h1>Documentação</h1>
			<Object data="/assets/manual.pdf" type="application/pdf" />
		</>
	)
}
 
export default Docs