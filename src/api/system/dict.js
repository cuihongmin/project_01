import request from '@/utils/request'

export const getDictionary = (params) => {
    return request({
      url: 'api/blade-system/dict/dictionary',
      method: 'get',
      params,
    })
  }