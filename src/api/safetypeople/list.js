import request from '@/utils/request'

// 查询安全人员列表
export function listList(query) {
  return request({
    url: '/safetypeople/list/list',
    method: 'get',
    params: query
  })
}

// 查询安全人员详细
export function getList(id) {
  return request({
    url: '/safetypeople/list/' + id,
    method: 'get'
  })
}

// 新增安全人员
export function addList(data) {
  return request({
    url: '/safetypeople/list',
    method: 'post',
    data: data
  })
}

// 修改安全人员
export function updateList(data) {
  return request({
    url: '/safetypeople/list',
    method: 'put',
    data: data
  })
}

// 删除安全人员
export function delList(id) {
  return request({
    url: '/safetypeople/list/' + id,
    method: 'delete'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  })
}
