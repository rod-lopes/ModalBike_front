import { Button, Typography } from '@mui/material'
import { Box, Container, Details, SignInSignUpForm, Logo } from 'styles/commom'
import { BikeImg } from './styles'
import { useCollaboratorsContext } from 'contexts/CollaboratorsContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { ControlledInput, Errors } from 'components/ControlledInput/styles'
import { FieldValues, useForm } from 'react-hook-form'

const SignUp = () => {
	const { addColaborator } = useCollaboratorsContext()
	const { register, handleSubmit, formState: { errors } } = useForm()

	const handleCreateUser = (event: FieldValues) => {
		const today = new Date()
		const currentDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

		const { password, confirmPassword, email, name } = event

		if (password !== confirmPassword) {
			toast.info('Senhas não coincidem, tente novamente')
			return false
		}

		addColaborator({
			nome: name,
			email: email,
			senha: password,
			nivel_id: 3,
			data_registro: currentDate,
			ativo: true
		}, true)
	}

	return (
		<Container>
			<Box>
				<Details>
					<p>Explore seus movimentos! Quanto você já contribuiu para o meio ambiente até hoje?</p>
					<BikeImg src='/assets/vintage-bike.png' alt='Vintage Bike' />
				</Details>
				<SignInSignUpForm onSubmit={handleSubmit(e => handleCreateUser(e))}>
					<Logo src='/assets/logo.png' alt='Logo' />
					<ControlledInput
						{...register('name',{
							required: 'Campo obrigatório',
							minLength: {value: 3, message: 'Mínimo de 3 caracteres'},
							maxLength: {value: 128, message: 'Máximo de 128 caracteres'},
						})}
						error={errors.name ? true : false}
						type='string'
						label='Nome completo'
						fullWidth
						required
					/>
					<Errors>{errors.name && `${errors.name.message}`}</Errors>
					<ControlledInput
						{...register('email',{
							required: 'Campo obrigatório',
							maxLength: {value: 128, message: 'Máximo de 128 caracteres'},
							pattern: {value: /^\w+([.-]?\w+)*@modalgr.com.br$/, message: 'E-mail inválido'}
						})}
						error={errors.email ? true : false}
						type='email'
						label='E-mail'
						fullWidth
						required
					/>
					<Errors>{errors.email && `${errors.email.message}`}</Errors>
					<ControlledInput
						{...register('password',{
							required: 'Campo obrigatório',
							minLength: {value: 6, message: 'Mínimo de 6 caracteres'},
							maxLength: {value: 128, message: 'Máximo de 128 caracteres'},
						})}
						error={errors.password ? true : false}
						type='password'
						label='Senha'
						fullWidth
						required
					/>
					<Errors>{errors.password && `${errors.password.message}`}</Errors>
					<ControlledInput
						{...register('confirmPassword',{
							required: 'Campo obrigatório',
							minLength: {value: 6, message: 'Mínimo de 6 caracteres'},
							maxLength: {value: 128, message: 'Máximo de 128 caracteres'},
						})}
						error={errors.confirmPassword ? true : false}
						type='password'
						label='Confirme a senha'
						fullWidth
						required
					/>
					<Errors>{errors.confirmPassword && `${errors.confirmPassword.message}`}</Errors>
					<Typography variant='overline' component='h6'>
						Já possui cadastro? <Link style={{ textDecoration: 'none' }} to='/'>Acesse a plataforma</Link>
					</Typography>
					<Button
						color="primary"
						disabled={false}
						size="large"
						variant="outlined"
						type='submit'
					>
						Começar
					</Button>
				</SignInSignUpForm>
			</Box>
		</Container>
	)
}
 
export default SignUp