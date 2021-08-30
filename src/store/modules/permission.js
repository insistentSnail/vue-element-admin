import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '@/api/auth'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */

//  方法中出现的componentMap代码是自己定义的，每添加一个页面就需要自己手动添加一个，具体代码如下：在ronter/index.js中规定
//  export const componentMap = {
//   'layout': require('@/layout').default,
//   'redirect_index': () => import('@/views/redirect/index').then(m => m.default),
//   'login_index': () => import('@/views/login/index').then(m => m.default),
//   'login_auth_redirect': () => import('@/views/login/auth-redirect').then(m => m.default),
//   'error_page_404': () => import('@/views/error-page/404').then(m => m.default),
//   'error_page_401': () => import('@/views/error-page/401').then(m => m.default),
//   'dashboard_index': () => import('@/views/dashboard/index').then(m => m.default),
//   'documentation_index': () => import('@/views/documentation/index').then(m => m.default),
//   'guide_index': () => import('@/views/guide/index').then(m => m.default),
//   'profile_index': () => import('@/views/profile/index').then(m => m.default),
//   'permission_menu': () => import('@/views/permission/menu').then(m => m.default),
//   'permission_resource': () => import('@/views/permission/permResource').then(m => m.default),
//   'permission_role': () => import('@/views/permission/role').then(m => m.default),
//   'user_role': () => import('@/views/permission/user').then(m => m.default),
//   'icons_index': () => import('@/views/icons/index').then(m => m.default),
//   'clipboard_index': () => import('@/views/clipboard/index').then(m => m.default)
// }

// function replaceComponent(comp) {
//   if (comp.component && typeof (comp.component) === 'string') {
//     comp.component = componentMap[comp.component]
//   }

//   if (comp.children && comp.children.length > 0) {
//     for (let i = 0; i < comp.children.length; i++) {
//       comp.children[i] = replaceComponent(comp.children[i])
//     }
//   }
//   return comp
// }

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes: async function({ commit }, roles) {
    // 调接口获取路由表
    // const res = await getRoutes()
    // const myAsyncRoutes = res.data
    // 替换组件名称 删除children
    // const myAsyncRoutes2 = myAsyncRoutes.filter(el => {
    //   if (el.children == null || el.children.length == 0) {
    //     delete el.children
    //   }
    //   // replaceComponent 替换组件名称的方法
    //   return replaceComponent(el)
    // })

    // let accessedRoutes
    // if (roles.includes('admin')) {
    //   console.log(myAsyncRoutes2, 'myAsyncRoutes2')
    //   accessedRoutes = myAsyncRoutes2 || []
    // } else {
    //   // 根据角色过滤掉不能访问的路由表
    //   accessedRoutes = filterAsyncRoutes(myAsyncRoutes2, roles)
    // }
    // commit('SET_ROUTES', accessedRoutes)
    // return accessedRoutes

    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        console.log(asyncRoutes, 'asyncRoutes')
        accessedRoutes = asyncRoutes || []
      } else {
        // 根据角色过滤掉不能访问的路由表
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
