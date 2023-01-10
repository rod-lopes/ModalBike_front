import styled from 'styled-components'
import { theme } from 'styles/theme'

export const Container = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 32px;
	color: ${theme.colors.main}
`