/**
 * 验证工具函数
 * 提供数据验证和表单校验功能
 */

/**
 * 验证字符串是否为空
 * @param value 要验证的字符串
 * @returns 是否为空
 */
export const isEmpty = (value?: string): boolean => {
  return value === undefined || value === null || value.trim() === ''
}

/**
 * 验证字符串长度是否在指定范围内
 * @param value 要验证的字符串
 * @param min 最小长度
 * @param max 最大长度
 * @returns 是否在范围内
 */
export const isLengthValid = (value: string, min: number, max: number): boolean => {
  if (isEmpty(value)) return false
  const length = value.trim().length
  return length >= min && length <= max
}

/**
 * 验证菜品名称
 * @param name 菜品名称
 * @returns 验证结果对象 {valid: boolean, message: string}
 */
export const validateDishName = (name?: string): {valid: boolean, message: string} => {
  if (isEmpty(name)) {
    return {
      valid: false,
      message: '菜品名称不能为空'
    }
  }
  
  if (!isLengthValid(name!, 1, 20)) {
    return {
      valid: false,
      message: '菜品名称长度应在1-20个字符之间'
    }
  }
  
  return {
    valid: true,
    message: ''
  }
}

/**
 * 验证分类名称
 * @param name 分类名称
 * @returns 验证结果对象 {valid: boolean, message: string}
 */
export const validateCategoryName = (name?: string): {valid: boolean, message: string} => {
  if (isEmpty(name)) {
    return {
      valid: false,
      message: '分类名称不能为空'
    }
  }
  
  if (!isLengthValid(name!, 1, 10)) {
    return {
      valid: false,
      message: '分类名称长度应在1-10个字符之间'
    }
  }
  
  return {
    valid: true,
    message: ''
  }
}

/**
 * 验证菜单名称
 * @param name 菜单名称
 * @returns 验证结果对象 {valid: boolean, message: string}
 */
export const validateMenuName = (name?: string): {valid: boolean, message: string} => {
  if (isEmpty(name)) {
    return {
      valid: false,
      message: '菜单名称不能为空'
    }
  }
  
  if (!isLengthValid(name!, 1, 30)) {
    return {
      valid: false,
      message: '菜单名称长度应在1-30个字符之间'
    }
  }
  
  return {
    valid: true,
    message: ''
  }
}