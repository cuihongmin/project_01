import request from '@/utils/request'

// 查询获取传感器设备列表
export function warnConfigList(query) {
  return request({
    url: '/warn/config/list',
    method: 'get',
    params: query
  })
}
// 查询获取人员列表
export function safetyPeople(id) {
  return request({
    url: '/warn/config/'+id+'/safety/people',
    method: 'get',
  })
}
// 查询获取报警方式列表
export function alarmWays(id) {
  return request({
    url: '/warn/config/'+id+'/alarm/ways',
    method: 'get',
  })
}
// 查询获取报警方式列表
export function publishfeedbackAlarmwayList(query) {
  return request({
    url: '/publishfeedback/alarmway/list',
    method: 'get',
    params: query
  })
}
// 查询获取报警方式列表
export function safetyPeopleSave(query) {
  return request({
    url: '/warn/config/'+id+'/safety/people',
    method: 'put',
    params: query
  })
}