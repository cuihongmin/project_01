import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function exportPDF() {
    return request({
      url: '/report/exportBusinessReport4PDF',
      encoding: null,
      method: 'get',
    })
  }