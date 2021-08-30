import request from '@/utils/request'

export function getRoutes() {
  return request({
    baseURL: 'http://localhost:7080',
    url: '/auth/routes',
    method: 'get'
  })
}
