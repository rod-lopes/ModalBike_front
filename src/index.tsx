import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'react-toastify/dist/ReactToastify.css'

import Routes from 'routes'
import { ToastContainer } from 'react-toastify'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
	<>
		<Routes />

		<ToastContainer
			position='top-right'
			autoClose={3000}
			closeButton={true}
			hideProgressBar={false}
			rtl={false}
			theme='colored'
		/>
	</>
)