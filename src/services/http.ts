import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import { toast } from 'react-toastify'

export const instance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	timeout: Number(process.env.REACT_APP_REQUEST_TIMEOUT),
})

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
	return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
	delete error.stack
	console.info(`[request error] [${JSON.stringify(error)}]`)
	return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
	return response
}

interface ResponseDataProps extends AxiosResponse {
	mensagem?: string
}

const onResponseError = (error: AxiosError<ResponseDataProps>): Promise<AxiosError> => {
	delete error.stack
	console.info('[response error]')
	
	if (error.response && error.response.data.mensagem) {
		const { mensagem } = error.response.data
		toast.error(`${mensagem}`, {autoClose: 5000})
		console.error(`[${mensagem.toUpperCase()}]`)
	}

	return Promise.reject(error)
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
	axiosInstance.interceptors.request.use(onRequest, onRequestError)
	axiosInstance.interceptors.response.use(onResponse, onResponseError)
	axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'
	axiosInstance.defaults.headers.common['Accept'] = 'application/json'
	return axiosInstance
}

setupInterceptorsTo(instance)

export const http = {
	get: instance.get,
	post: instance.post,
	put: instance.put,
	patch: instance.patch,
	delete: instance.delete
}

export default http