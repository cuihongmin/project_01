import request from '@/utils/request'

const prefix = '/blade/design/form'

export const getList = (query) => {
  return request({
    url: `${prefix}/list`,
    method: 'get',
    params: query
  })
}

export const getDetail = (params) => {
    return request({
      url: `${prefix}/detail`,
      method: 'get',
      params
    })
  }