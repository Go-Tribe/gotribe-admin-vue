import request from '@/utils/request'

export function getOrderList(params) {
  return request({
    url: '/api/order',
    method: 'get',
    params
  })
}

export function updateOrder(Id, data) {
  return request({
    url: '/api/order/' + Id,
    method: 'patch',
    data
  })
}

export function batchDeleteOrder(data) {
  return request({
    url: '/api/order',
    method: 'delete',
    data
  })
}

export function getOrderDetail(orderID) {
  return request({
    url: '/api/order/' + orderID,
    method: 'get'
  })
}

export function getOrderLog(orderID) {
  return request({
    url: '/api/order/log/' + orderID,
    method: 'get'
  })
}

