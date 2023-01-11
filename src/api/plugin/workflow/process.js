import request from '@/utils/request'

const prefix = '/blade-workflow/process'

/**
 * 我发起的请求
 */
 export const sendList = (current, size, params) => {
    return request({
      url: `${prefix}/sendList`,
      method: 'get',
      params: {
        ...params,
        current,
        size,
      }
    })
  }