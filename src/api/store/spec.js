import request from '@/utils/request'

// 获取接口列表
export function getSpecList(params) {
  return request({
    url: '/api/product/spec',
    method: 'get',
    params
  })
}

// 创建接口
export function createSpec(data) {
  return request({
    url: '/api/product/spec',
    method: 'post',
    data
  })
}

// 更新接口
export function updateSpec(Id, data) {
  return request({
    url: '/api/product/spec/' + Id,
    method: 'patch',
    data
  })
}

// 批量删除接口
export function batchDeleteSpec(data) {
  return request({
    url: '/api/product/spec',
    method: 'delete',
    data
  })
}

// 获取详情接口
export function getSpecDetail(Id) {
  return request({
    url: '/api/product/spec/' + Id,
    method: 'get'
  })
}
