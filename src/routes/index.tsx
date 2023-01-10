import { Route, Routes, BrowserRouter } from 'react-router-dom'

import NotFound from 'pages/NotFound'
import Default from 'pages/Default'
import Dashboard from 'pages/Dashboard'
import Collaborators from 'pages/Collaborators'
import Releases from 'pages/Releases'
import MyReleases from 'pages/MyReleases'
import SignUp from 'pages/SignUp'
import SignIn from 'pages/SignIn'
import Docs from 'pages/Docs'
import Bikes from 'pages/Bikes'
import Profile from 'pages/Profile'

import ScrollToTop from 'components/ScrollToTop'
import { UserProvider } from 'contexts/UserContext'
import { ReleasesProvider } from 'contexts/ReleasesContext'
import { CollaboratorsProvider } from 'contexts/CollaboratorsContext'
import { BikesProvider } from 'contexts/BikesContext'
import { AccessLevelProvider } from 'contexts/AccessLevelsContext'

const CommomRoutes = () => {
	return (
		<BrowserRouter>
			<UserProvider>
				<CollaboratorsProvider>
					<ReleasesProvider>
						<AccessLevelProvider>
							<BikesProvider>
								<>
									<ScrollToTop />
									<Routes>
										<Route path='/' element={<SignIn />} />
										<Route path='/signup' element={<SignUp />} />
										<Route path='/system' element={<Default />} >
											<Route path='me' element={<Profile />} />
											<Route path='myreleases' element={<MyReleases />} />
											<Route path='docs' element={<Docs />} />
										</Route>

										<Route path='/admin' element={<Default />}>
											<Route index element={<Dashboard /> } />
											<Route path='dashboard' element={<Dashboard />} />
											<Route path='releases' element={<Releases />} />
											<Route path='collaborators' element={<Collaborators />} />
											<Route path='bikes' element={<Bikes />} />
										</Route>
										<Route path='*' element={<NotFound />} />
									</Routes>
								</>
							</BikesProvider>
						</AccessLevelProvider>
					</ReleasesProvider>
				</CollaboratorsProvider>
			</UserProvider>
		</BrowserRouter>
	)
}

export default CommomRoutes