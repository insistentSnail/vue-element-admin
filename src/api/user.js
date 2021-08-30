import request from '@/utils/request'

export function login(data) {
  return request({
    // 登录改造 用自己的接口
    // baseURL: 'http://localhost:7080',
    // url: '/auth/login',
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}
// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
