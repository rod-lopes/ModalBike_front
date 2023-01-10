import styled from 'styled-components'

import {
	Avatar as MuiAvatar
} from '@mui/material'

export const Main = styled.main`
	box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.20);
	border-radius: 8px;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	flex-direction: row;
	height: 100%;
	overflow: scroll;
`

export const SideAvatar = styled.div`
`

export const Content = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	gap: 40px;
	padding: 5vh;
	height: 100%;
	width: 100%;
	flex-direction: row;

	@media (max-width: 840px) {
		flex-direction: column;
	}
`

export const Avatar = styled(MuiAvatar)`
`

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	aling-items: flex-start;
	justify-content: flex-start;
	width: 60%;

	@media (max-width: 840px) {
		width: 100%;
	}
`

export const BackgroundImg = styled.div`
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url('/assets/login.png');
	width: 40%;
	height: 100%;
	object-fit: contain;

	@media (max-width: 660px) {
		display: none;
	}
`