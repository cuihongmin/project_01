import request from '@/utils/request'

// 查询系统信息维护列表
export function listMaintain(query) {
  return request({
    url: '/maintain/maintain/list',
    method: 'get',
    params: query
  })
}

// 查询系统信息维护详细
export function getMaintain(sysId) {
  return request({
    url: '/maintain/maintain/' + sysId,
    method: 'get'
  })
}

// 查询系统信息维护详细
export function getMaintainByTitle(sysColumn) {
  return request({
    url: '/maintain/maintain/title?sysColumn=' + sysColumn,
    method: 'get'
  })
}

// 新增系统信息维护
export function addMaintain(data) {
  return request({
    url: '/maintain/maintain',
    method: 'post',
    data: data
  })
}

// 修改系统信息维护
export function updateMaintain(data) {
  return request({
    url: '/maintain/maintain',
    method: 'put',
    data: data
  })
}

// 删除系统信息维护
export function delMaintain(sysId) {
  return request({
    url: '/maintain/maintain/' + sysId,
    method: 'delete'
  })
}

// 导出系统信息维护
export function exportMaintain(query) {
  return request({
    url: '/maintain/maintain/export',
    method: 'get',
    params: query
  })
}
