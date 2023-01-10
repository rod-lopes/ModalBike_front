import { useEffect } from 'react'
import { Bar } from '@nivo/bar'
import { useCollaboratorsContext } from 'contexts/CollaboratorsContext'
import { useReleasesContext } from 'contexts/ReleasesContext'
import { useUserContext } from 'contexts/UserContext'

const RaceChart = () => {
	const { user, token } = useUserContext()
	const { collaborators, getCollaborators } = useCollaboratorsContext()
	const { releases } = useReleasesContext()

	useEffect(() => {
		getCollaborators()
	}, [token, user])

	const distanceByCollaborator = collaborators[0] && collaborators.map(collaborator => (
		{id: collaborator.nome, value: releases.reduce((sum, release) => {
			return (release.colaborador_id == collaborator.id) ? sum + release.km : sum + 0
		}, 0)}
	))

	if (!distanceByCollaborator) return null
	
	const raceChartData = distanceByCollaborator.filter(data => data.value > 6).sort((a: any, b: any) => a.value - b.value)

	const BarComponent = ({ bar, borderColor }: {bar: any, borderColor?: any}) => {
		return (
			<g transform={`translate(${bar.x},${bar.y})`}>
				<rect x={-3} y={7} width={bar.width} height={bar.height} fill="rgba(0, 0, 0, 0.25)" />
				<rect width={bar.width} height={bar.height} fill={bar.color} />
				<rect
					x={bar.width - 5}
					width={5}
					height={bar.height}
					fill={borderColor}
					fillOpacity={0.2}
				/>
				<text
					x={bar.width - 16}
					y={bar.height / 2 - 8}
					textAnchor="end"
					dominantBaseline="central"
					fill='dark'
					style={{
						fontWeight: 900,
						fontSize: 15,
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					{bar.data.indexValue}
				</text>
				<text
					x={bar.width - 16}
					y={bar.height / 2 + 10}
					textAnchor="end"
					dominantBaseline="central"
					fill={borderColor}
					style={{
						fontWeight: 400,
						fontSize: 13,
					}}
				>
					{bar.data.value} km
				</text>
			</g>
		)
	}

	return (
		<>
			<h2 style={{ marginLeft: 10, fontWeight: 400, color: '#555' }}>
				Distância percorrida por colaboradores
			</h2>
			<Bar
				width={1000}
				height={500}
				layout="horizontal"
				margin={{ top: 26, right: 10, bottom: 26, left: 10 }}
				data={raceChartData}
				indexBy="id"
				keys={['value']}
				colors={{ scheme: 'spectral' }}
				colorBy="indexValue"
				borderColor={{ from: 'color', modifiers: [['darker', 2.6]] }}
				enableGridX
				enableGridY={false}
				axisTop={{
					format: '~s',
				}}
				axisBottom={{
					format: '~s',
				}}
				axisLeft={null}
				padding={0.3}
				labelTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
				isInteractive={true}
				barComponent={BarComponent}
			/>
		</>
	)
}

export default RaceChart