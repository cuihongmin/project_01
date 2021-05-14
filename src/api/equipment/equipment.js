import request from '@/utils/request'

// 查询群组管理列表
export function detectionindextypeTypeList(query) {
  return request({
    url: '/detectionindextype/type/list',
    method: 'get',
    params: query
  })
}