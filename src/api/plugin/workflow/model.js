import request from '@/utils/request'
const prefix = '/blade-workflow/design/model'

// 流程定义模型数据
export const ListList = (query) => {
    return request({
        url: '/blade/model/list',
        method: 'get',
        params: query
    })
}
  
// 查询流程定义模型员详细(根据id查询)
export function getList(id) {
    return request({
      url: '/safetypeople/list/' + id,
      method: 'get'
    })
  }
  