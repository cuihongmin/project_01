import request from '@/utils/request'

//  获取系统按钮
export const getButtons = () => request({
    url: '/api/blade-system/menu/buttons',
    method: 'get'
});
  
// export const getRouters = () => {
//     return request({
//       url: '/getRouters',
//       method: 'get'
//     })
//   }