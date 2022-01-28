enum ApiMethod {
	Get = 'GET',
	Post = 'POST',
	Put = 'PUT',
	Delete = 'DELETE',
	Patch = 'PATCH',
}

interface ApiConfig {
	headers: { 'Content-Type': string }
	method: ApiMethod
	body?: string
}

type ApiBody = any

export { ApiMethod }
export type { ApiConfig, ApiBody }
