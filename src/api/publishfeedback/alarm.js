import request from '@/utils/request'

// 查询报警： 包括电话报警、短信邮件等列表
export function listAlarm(query) {
  return request({
    url: '/publishfeedback/alarm/list',
    method: 'get',
    params: query
  })
}

// 查询报警： 包括电话报警、短信邮件等详细
export function getAlarm(id) {
  return request({
    url: '/publishfeedback/alarm/' + id,
    method: 'get'
  })
}

// 新增报警： 包括电话报警、短信邮件等
export function addAlarm(data) {
  return request({
    url: '/publishfeedback/alarm',
    method: 'post',
    data: data
  })
}

// 修改报警： 包括电话报警、短信邮件等
export function updateAlarm(data) {
  return request({
    url: '/publishfeedback/alarm',
    method: 'put',
    data: data
  })
}

// 删除报警： 包括电话报警、短信邮件等
export function delAlarm(id) {
  return request({
    url: '/publishfeedback/alarm/' + id,
    method: 'delete'
  })
}

// 导出报警： 包括电话报警、短信邮件等
export function exportAlarm(query) {
  return request({
    url: '/publishfeedback/alarm/export',
    method: 'get',
    params: query
  })
}