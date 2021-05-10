import request from '@/utils/request'

// 查询获取传感器设备列表
export function listPeriod(query) {
  return request({
    url: '/sensorclassify/classify/list',
    method: 'get',
    params: query
  })
}
// 查询获取传感器设备列表
export function classifyCollectTimeUnitList(query) {
  return request({
    url: '/sensorclassify/classify/collectTimeUnit/list',
    method: 'get',
  })
}