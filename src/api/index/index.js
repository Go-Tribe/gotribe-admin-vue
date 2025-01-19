import request from '@/utils/request'

// 获取操作日志列表
export function getIndex(params) {
  return request({
    url: '/api/index',
    method: 'get',
    params
  })
}

// 批量删除操作日志
export function getIndexData(params) {
  return request({
    url: '/api/index/data',
    method: 'get',
    params
  })
}

