import request from '@/utils/request'

// 查询获取传感器设备列表
export function warnConfigList(query) {
  return request({
    url: '/warn/config/list',
    method: 'get',
    params: query
  })
}