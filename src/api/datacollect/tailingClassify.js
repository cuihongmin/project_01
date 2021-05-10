import request from '@/utils/request'

// 查询尾矿库分类列表
export function listTailingClassify(query) {
  return request({
    url: '/datacollect/tailingClassify/list',
    method: 'get',
    params: query
  })
}

// 查询尾矿库分类详细
export function getTailingClassify(id) {
  return request({
    url: '/datacollect/tailingClassify/' + id,
    method: 'get'
  })
}

// 新增尾矿库分类
export function addTailingClassify(data) {
  return request({
    url: '/datacollect/tailingClassify',
    method: 'post',
    data: data
  })
}

// 修改尾矿库分类
export function updateTailingClassify(data) {
  return request({
    url: '/datacollect/tailingClassify',
    method: 'put',
    data: data
  })
}

// 删除尾矿库分类
export function delTailingClassify(id) {
  return request({
    url: '/datacollect/tailingClassify/' + id,
    method: 'delete'
  })
}

// 导出尾矿库分类
export function exportTailingClassify(query) {
  return request({
    url: '/datacollect/tailingClassify/export',
    method: 'get',
    params: query
  })
}