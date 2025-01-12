import request from '@/utils/request'

// 获取接口列表
export function getFeedbackList(params) {
  return request({
    url: '/api/feedback',
    method: 'get',
    params
  })
}

