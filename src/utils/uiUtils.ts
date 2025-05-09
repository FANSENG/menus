/**
 * UI工具函数
 * 提供常用的UI交互和提示功能
 */
import Taro from '@tarojs/taro'

/**
 * 显示成功提示
 * @param message 提示信息
 * @param duration 显示时长（毫秒）
 */
export const showSuccess = (message: string, duration = 2000): Promise<void> => {
  return new Promise(resolve => {
    Taro.showToast({
      title: message,
      icon: 'success',
      duration
    })
    setTimeout(resolve, duration)
  })
}

/**
 * 显示错误提示
 * @param message 提示信息
 * @param duration 显示时长（毫秒）
 */
export const showError = (message: string, duration = 2000): Promise<void> => {
  return new Promise(resolve => {
    Taro.showToast({
      title: message,
      icon: 'none',
      duration
    })
    setTimeout(resolve, duration)
  })
}

/**
 * 显示加载提示
 * @param message 提示信息
 */
export const showLoading = (message = '加载中...'): void => {
  Taro.showLoading({
    title: message
  })
}

/**
 * 隐藏加载提示
 */
export const hideLoading = (): void => {
  Taro.hideLoading()
}

/**
 * 显示确认对话框
 * @param title 标题
 * @param content 内容
 * @returns Promise<boolean> 用户是否确认
 */
export const showConfirm = (title: string, content: string): Promise<boolean> => {
  return new Promise(resolve => {
    Taro.showModal({
      title,
      content,
      success: function (res) {
        resolve(res.confirm)
      },
      fail: function () {
        resolve(false)
      }
    })
  })
}