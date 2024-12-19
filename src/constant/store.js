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
