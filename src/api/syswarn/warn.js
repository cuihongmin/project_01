import request from '@/utils/request'

// 查询warn列表
export function listWarn(query) {
  return request({
    url: '/syswarn/warn/list',
    method: 'get',
    params: query
  })
}

// 查询warn详细
export function getWarn(id) {
  return request({
    url: '/syswarn/warn/' + id,
    method: 'get'
  })
}

// 新增warn
export function addWarn(data) {
  return request({
    url: '/syswarn/warn',
    method: 'post',
    data: data
  })
}

// 修改warn
export function updateWarn(data) {
  return request({
    url: '/syswarn/warn',
    method: 'put',
    data: data
  })
}

/**
 * 解除预警
 * @param id
 * @returns {*}
 */
export  function relieveWarn(id) {
    return request({
      url: '/syswarn/warn/relieve/' + id,
      method: 'put'
    })
}
// 删除warn
export function delWarn(id) {
  return request({
    url: '/syswarn/warn/' + id,
    method: 'delete'
  })
}

// 导出warn
export function exportWarn(query) {
  return request({
    url: '/syswarn/warn/export',
    method: 'get',
    params: query
  })

}
