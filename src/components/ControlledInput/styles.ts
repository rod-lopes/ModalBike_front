import styled from 'styled-components'
import { TextField } from '@mui/material'
import theme from 'styles/theme'

export const ControlledInput = styled(TextField)`
	margin: 0.125em 0em !important;
`

export const Errors = styled.p`
	margin: 0.5em 0;
	padding: 0px;
	color: ${theme.colors.error}
`
