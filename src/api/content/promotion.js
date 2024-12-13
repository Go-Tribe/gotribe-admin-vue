import request from '@/utils/request'

// 获取推广场景列表
export function getSceneList(params) {
  return request({
    url: '/api/ad/scene',
    method: 'get',
    params
  })
}

// 创建推广场景
export function createScene(data) {
  return request({
    url: '/api/ad/scene',
    method: 'post',
    data
  })
}

// 更新推广场景
export function updateScene(Id, data) {
  return request({
    url: '/api/ad/scene/' + Id,
    method: 'patch',
    data
  })
}

// 批量删除推广场景
export function batchDeleteScene(data) {
  return request({
    url: '/api/ad/scene',
    method: 'delete',
    data
  })
}
