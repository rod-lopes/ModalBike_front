import styled, { css } from 'styled-components'
import { theme } from './theme'

export const Container = styled.main`
	height: 100vh;
	width: 100vw;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2vw;
	background-color: #F1F1F1;

	animation-name: bgModal;
	animation-duration: 14s;
	animation-iteration-count: infinite;
	@keyframes bgModal {
		0%   {background-color: ${theme.colors.main};}
		25%  {background-color: ${theme.colors.seconday};}
		50%  {background-color: #FFF;}
		75%  {background-color: ${theme.colors.main};}
		100% {background-color: ${theme.colors.seconday};}
	}
`

export const fadeAnimation = css`
	animation-name: fade;
	animation-duration: 2s;
	opacity: 1;
	
	@keyframes fade {
		0%   {opacity: 0;}
		100% {opacity: 1;}
	}
`

export const Box = styled.section`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-radius: 6px;
	box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.5);

	@media (min-width: 840px) {
		height: 90vh;
		width: 90vw;
	}

	@media (max-width: 840px) {
		height: 86vh;
		width: 86vw;
	}

	@media (max-width: 360px) {
		height: 100%;
		width: 94vw;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	${fadeAnimation}
`

export const SignInSignUpForm = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content; space-between;
	padding: 10px 20px;
	background-color: #FFF;

	@media (min-width: 840px) {
		height: 100%;
		width: 60%;
	}

	@media (max-width: 840px) {
		height: 100%;
		width: 60%;
	}

	@media (max-width: 360px) {
		width: 100%;
	}
`

export const Details = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	gap: 2px;
	padding: 10px 20px;
	background-color: ${theme.colors.main};
	
	p {
		color: #FFF;
		font-weight: 900;

		@media (min-width: 840px) {
			font-size: 1.75rem;
		}
	
		@media (max-width: 840px) {
			font-size: 1.25rem;
		}
	
		@media (max-width: 360px) {
			font-size: 1rem;
		}
	}
	
	@media (min-width: 840px) {
		height: 100%;
		width: 40%;
	}

	@media (max-width: 840px) {
		height: 100%;
		width: 40%;
	}

	@media (max-width: 360px) {
		width: 100%;
	}
`

export const Logo = styled.img`
	object-fit: contain;
	z-index: 1;
	
	@media (min-width: 840px) {
		width: 10rem;
		height: 14rem;
	}

	@media (max-width: 840px) {
		width: 8rem;
		height: 12rem;
	}

	@media (max-width: 360px) {
		width: 6rem;
		height: 8rem;
	}
`

export const Header = styled.header`
	display: flex;
	justify-content: space-between;
`

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content; space-between;
	background-color: #FFF;
	border-radius: inherit;
	width: 100%;
	padding: 0px 0px 10px 0px;
`

export const AdaptiveImg = css`
	object-fit: contain;
	
	@media (min-width: 840px) {
		width: 8rem;
		height: 8rem;
	}

	@media (max-width: 840px) {
		width: 6rem;
		height: 6rem;
	}

	@media (max-width: 360px) {
		width: 4rem;
		height: 4rem;
	}
`