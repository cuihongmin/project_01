import request from '@/utils/request'

// 查询群组管理列表
export function listGroupManage(query) {
  return request({
    url: '/groupperiod/groupManage/list',
    method: 'get',
    params: query
  })
}

// 查询群组管理详细
export function getGroupManage(id) {
  return request({
    url: '/groupperiod/groupManage/' + id,
    method: 'get'
  })
}

// 新增群组管理
export function addGroupManage(data) {
  return request({
    url: '/groupperiod/groupManage',
    method: 'post',
    data: data
  })
}

// 修改群组管理
export function updateGroupManage(data) {
  return request({
    url: '/groupperiod/groupManage',
    method: 'put',
    data: data
  })
}

// 删除群组管理
export function delGroupManage(id) {
  return request({
    url: '/groupperiod/groupManage/' + id,
    method: 'delete'
  })
}

// 导出群组管理
export function exportGroupManage(query) {
  return request({
    url: '/groupperiod/groupManage/export',
    method: 'get',
    params: query
  })
}