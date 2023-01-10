import styled from 'styled-components'

export const BikeImg = styled.img`
	object-fit: contain;
	z-index: 1;

	@media (min-width: 840px) {
		width: 22rem;
		height: 34rem;
	}

	@media (max-width: 840px) {
		width: 12rem;
		height: 24rem;
	}

	@media (max-width: 360px) {
		width: 10rem;
		height: 10rem;
	}
`