import styled from 'styled-components'

export const BackgroundImg = styled.div`
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url('/assets/login.png');

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