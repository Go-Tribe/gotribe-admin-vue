import * as xlsx from 'xlsx'

export const exportData = (data, name) => {
  // 1. 创建一个工作簿 workbook
  const workBook = xlsx.utils.book_new()
  // 2. 创建工作表 worksheet
  const workSheet = xlsx.utils.json_to_sheet(data)
  // 3. 将工作表放入工作簿中
  xlsx.utils.book_append_sheet(workBook, workSheet)
  // 4. 生成数据保存
  xlsx.writeFile(workBook, `${name || 'list'}.xlsx`, {
    bookType: 'xlsx'
  })
}
