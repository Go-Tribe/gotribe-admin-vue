export const specTypeEnum = {
  text: 1,
  image: 2
}

export const specTypeMap = {
  [specTypeEnum.text]: '文字',
  [specTypeEnum.image]: '图片'
}

export const specTypeOptions = [
  {
    text: '文字',
    value: specTypeEnum.text
  },
  {
    text: '图片',
    value: specTypeEnum.image
  }
]

export const specItemStatusEnum = {
  enable: 1,
  disable: 2
}

export const specItemStatusMap = {
  [specItemStatusEnum.enable]: '启用',
  [specItemStatusEnum.disable]: '图片'
}

export const specItemStatusOptions = [
  {
    text: '启用',
    value: specItemStatusEnum.enable
  },
  {
    text: '不器用',
    value: specItemStatusEnum.disable
  }
]
