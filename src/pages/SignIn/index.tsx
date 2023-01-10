import { Button, Typography } from '@mui/material'
import { Box, Container, SignInSignUpForm, Logo } from 'styles/commom'
import { BackgroundImg } from './styles'
import { useUserContext } from 'contexts/UserContext'
import { Link } from 'react-router-dom'
import { ControlledInput, Errors } from 'components/ControlledInput/styles'
import { FieldValues, useForm } from 'react-hook-form'

const SignIn = () => {
	const { login } = useUserContext()
	const { register, handleSubmit, formState: { errors } } = useForm()
	
	const handleLogin = async (e: FieldValues) => {
		await login(e.email, e.password)
	}

	return (
		<Container>
			<Box>
				<SignInSignUpForm style={{justifyContent: 'center'}} onSubmit={handleSubmit(e => handleLogin(e))}>
					<Logo src='/assets/logo.png' alt='Logo' />
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
						// required
					/>
					<Errors>{errors.password && `${errors.password.message}`}</Errors>
					<Typography variant='overline' component='h6'>
						Ainda não utiliza a plataforma? <Link style={{ textDecoration: 'none' }} to='/signup'>Cadastre-se.</Link>
					</Typography>
					<Button
						color="primary"
						disabled={false}
						size="large"
						variant="outlined"
						type='submit'
					>
						Entrar
					</Button>
				</SignInSignUpForm>
				<BackgroundImg />
			</Box>
		</Container>
	)
}
 
export default SignIn