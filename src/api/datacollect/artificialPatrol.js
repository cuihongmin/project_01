import request from '@/utils/request'

// 查询人工巡检登记列表
export function listArtificialPatrol(query) {
  return request({
    url: '/datacollect/artificialPatrol/list',
    method: 'get',
    params: query
  })
}

// 查询人工巡检登记详细
export function getArtificialPatrol(id) {
  return request({
    url: '/datacollect/artificialPatrol/' + id,
    method: 'get'
  })
}

// 新增人工巡检登记
export function addArtificialPatrol(data) {
  return request({
    url: '/datacollect/artificialPatrol',
    method: 'post',
    data: data
  })
}

// 修改人工巡检登记
export function updateArtificialPatrol(data) {
  return request({
    url: '/datacollect/artificialPatrol',
    method: 'put',
    data: data
  })
}
// 修改人工巡检登记
export function relieveWarning(data) {
  return request({
    url: '/datacollect/artificialPatrol/relieveWarning',
    method: 'POST',
    data: data
  })
}

// 删除人工巡检登记
export function delArtificialPatrol(id) {
  return request({
    url: '/datacollect/artificialPatrol/' + id,
    method: 'delete'
  })
}

// 导出人工巡检登记
export function exportArtificialPatrol(query) {
  return request({
    url: '/datacollect/artificialPatrol/export',
    method: 'get',
    params: query
  })
}
