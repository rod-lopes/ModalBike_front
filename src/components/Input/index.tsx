import React from 'react'

import {
	TextField
} from '@mui/material'

interface InputProps {
	label: string
	defaultValue?: string
	required?: boolean
	fullWidth?: boolean
	type: string
	disabled?: boolean
	sx?: any
	value: unknown
	setter?: (e: any) => void
}

const Input = ({
	label,
	defaultValue,
	required,
	fullWidth,
	type,
	disabled,
	sx,
	value,
	setter
}: InputProps) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setter ? setter(event.target.value) : null
	}
	
	return (
		<TextField
			error={false}
			id='outlined-error-helper-text'
			label={label}
			defaultValue={defaultValue}
			required={required}
			fullWidth={fullWidth}
			margin='normal'
			type={type}
			disabled={disabled}
			value={value}
			onChange={(e) => handleChange(e)}
			sx={sx}
		/>
	)
}

export default Input