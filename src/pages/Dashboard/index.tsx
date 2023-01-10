import { useEffect } from 'react'
import { useUserContext } from 'contexts/UserContext'
import Unauthorized from 'pages/Unauthorized'
import { Main, WelcomeCard, DashboardBike, SquareCard, CounterHighlight, RaceChartStyle } from './styles'
import { useBikesContext } from 'contexts/BikesContext'
import { Button } from '@mui/material'
import theme from 'styles/theme'
import { Link } from 'react-router-dom'
import { Co2Rounded, DirectionsBikeRounded, NearMeRounded, ParkRounded } from '@mui/icons-material'
import { useReleasesContext } from 'contexts/ReleasesContext'
import RaceChart from './RaceChart'

const Dashboard = () => {
	const { user, token } = useUserContext()
	const { bikes, getBikes, getAvailableBikes } = useBikesContext()
	const { releases, getReleases } = useReleasesContext()

	useEffect(() => {
		if (token && user.nivel_id === 2) {
			getBikes()
			getReleases()
		}
	}, [token, user])
	
	if (user.nivel_id !== 2) return <Unauthorized />
	
	const availableBikes = bikes[0] && getAvailableBikes().length
	const borrowedBikes = bikes[0] && bikes.filter(bike => bike.colaborador_id).length
	const totalDistance = releases[0] && releases.reduce((sum, release) => {return sum + release.km}, 0)
	const totalConsumeCO2 = totalDistance * 0.82
	const compensedTrees = (totalConsumeCO2 / 1000) / 5.85

	const svgIconsSize = 50
	
	return (
		<Main>
			<WelcomeCard>
				<div>
					<p style={{color: theme.colors.orange, fontWeight: 900}}>Olá {user.nome && user.nome.split(' ')[0]}!</p>
					<p>
						Hoje <b>{availableBikes ? (availableBikes == 1 ? 'temos 1 bicicleta disponível' : `temos ${availableBikes} bicicletas disponíveis`) : 'não temos nenhuma bicicleta disponível'}</b> para entrega. 
					</p>
					<p>
						Verifique a lista no botão abaixo.
					</p>
					<Link to='/admin/bikes' style={{textDecoration: 'none'}}>
						<Button variant='outlined' style={{borderColor: theme.colors.orange, color: theme.colors.orange}}>
							Bicicletas
						</Button>
					</Link>
				</div>
				<div>
					<DashboardBike src='/assets/dashboard-bike.png' alt='Imagem de bicicleta'/>
				</div>
			</WelcomeCard>
			<SquareCard>
				<DirectionsBikeRounded sx={{width: svgIconsSize, height: svgIconsSize}}/>
				<CounterHighlight>Bicicletas</CounterHighlight>
				<CounterHighlight title={'true'}>{bikes.length}</CounterHighlight>
			</SquareCard>
			<SquareCard>
				<DirectionsBikeRounded sx={{width: svgIconsSize, height: svgIconsSize}}/>
				<CounterHighlight>Emprestadas</CounterHighlight>
				<CounterHighlight title={'true'}>{borrowedBikes}</CounterHighlight>
			</SquareCard>
			<SquareCard style={{width: '30%'}}>
				<NearMeRounded sx={{width: svgIconsSize, height: svgIconsSize}}/>
				<CounterHighlight>Distância percorrida</CounterHighlight>
				<CounterHighlight title={'true'}>{totalDistance?.toFixed(2)} KM</CounterHighlight>
			</SquareCard>
			<SquareCard style={{width: '30%'}} title='co2'>
				<Co2Rounded sx={{width: svgIconsSize, height: svgIconsSize}}/>
				<CounterHighlight>Consumo CO2</CounterHighlight>
				<CounterHighlight title={'true'}>
					{(totalConsumeCO2 >= 1000) ? `${(totalConsumeCO2 / 1000).toFixed(2)} kg/km` : `${totalConsumeCO2?.toFixed(2)} g/km`}
				</CounterHighlight>
			</SquareCard>
			<SquareCard style={{width: '30%'}}>
				<ParkRounded sx={{width: svgIconsSize, height: svgIconsSize}}/>
				<CounterHighlight>Árvores Compensadadas</CounterHighlight>
				<CounterHighlight title={'true'}>{compensedTrees.toFixed(2)}</CounterHighlight>
			</SquareCard>
			<RaceChartStyle style={{width: '100%'}}>
				<RaceChart />
			</RaceChartStyle>
		</Main>
	)
}
 
export default Dashboard