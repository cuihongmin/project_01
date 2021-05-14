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
// 安全人员保存接口
export function safetyPeopleSave(opt) {
  return request({
    url: '/warn/config/'+opt.id+'/safety/people',
    method: 'put',
    params: {"peopleIds": opt.peopleIds}
  })
}
// 执行任务保存接口
export function executeWaySave(opt) {

  return request({
    url: '/warn/config/'+opt.id+'/execute/way',
    method: 'put',
    params: {"execWayIds": opt.execWayIds}
  })
}