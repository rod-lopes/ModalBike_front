import { styled } from '@mui/material/styles'
import { CloseRounded as MuiCloseRounded } from '@mui/icons-material'

import {
	Box as MuiBox
} from '@mui/material'
import { theme } from 'styles/theme'

const modalPadding = '0px 10px'

export const Box = styled(MuiBox, {})(() => ({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	minWidth: 400,
	background: '#FFF',
	border: `2px solid ${theme.colors.main}`,
	boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.5)',
	borderRadius: 8,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'flex-start'
}))

export const Header = styled('header')`
	background: ${theme.colors.main};
	color: #FFF;
	margin: 0;
	width: 100%;
	padding: ${modalPadding};
	display: flex;
	align-items: center;
	justify-content: space-between;
`

export const CloseRounded = styled(MuiCloseRounded, {})(() => ({
	width: 20,
	':hover': {
		cursor: 'pointer'
	}
}))

export const Content = styled('div')`
	width: 100%;
	padding: ${modalPadding};
`