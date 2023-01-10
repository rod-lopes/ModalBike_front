import {
	Fade,
	Modal as MuiModal
} from '@mui/material'

import { Box, Header, CloseRounded, Content } from './styles'

interface Props {
	isOpen: boolean
	onClose: () => void
	children?: JSX.Element | null | string
	title: string
}

const Modal = ({isOpen, onClose, children, title}: Props) => {
	return (
		<MuiModal
			open={isOpen}
			closeAfterTransition
			onClose={onClose}
		>
			<Fade in={isOpen}>
				<Box>
					<Header>
						<h3><b>{title}</b></h3>
						<CloseRounded onClick={onClose} />
					</Header>
					<Content>
						{children}
					</Content>
				</Box>
			</Fade>
		</MuiModal>
	)
}
 
export default Modal