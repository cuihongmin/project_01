import request from '@/utils/request'

// 查询流程类别下拉树结构
export const tree = () => {
    return request({
      url: '/blade/design/category/tree',
      method: 'get',
    })
  }