import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Input, Button } from '@tarojs/components'
import './index.scss'

export default function AddDish() {
  const [dishName, setDishName] = useState('')
  const [dishImage, setDishImage] = useState('')

  // 选择本地图片
  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        setDishImage(res.tempFilePaths[0])
      }
    })
  }

  // 使用AI生成图片
  const handleGenerateImage = () => {
    // 这里预留AI生成图片的接口调用
    // 参数：菜品名称
    // 返回：生成的图片URL
    console.log('调用AI生成图片', dishName)
    
    // 模拟生成成功
    Taro.showToast({
      title: 'AI图片生成中',
      icon: 'loading',
      duration: 2000
    })
    
    // 实际项目中这里应该调用后端API
    // setDishImage(generatedImageUrl)
  }

  // 保存菜品信息
  const handleSave = () => {
    if (!dishName.trim()) {
      Taro.showToast({
        title: '请输入菜品名称',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!dishImage) {
      Taro.showToast({
        title: '请上传或生成菜品图片',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 这里预留保存菜品的接口调用
    // 参数：菜品名称、图片
    // 返回：保存结果
    console.log('保存菜品信息', { dishName, dishImage })
    
    // 保存成功后返回上一页
    Taro.navigateBack()
  }

  return (
    <View className='add-dish'>
      <View className='add-dish__content'>
        <View className='add-dish__form-item'>
          <Text className='add-dish__label'>菜名</Text>
          <Input
            className='add-dish__input'
            value={dishName}
            onInput={e => setDishName(e.detail.value)}
            placeholder='请输入菜品名称'
          />
        </View>

        <View className='add-dish__image-section'>
          <Text className='add-dish__label'>菜品图片</Text>
          <View className='add-dish__image-container'>
            {dishImage ? (
              <Image className='add-dish__image' src={dishImage} mode='aspectFill' />
            ) : (
              <View className='add-dish__image-placeholder'>
                <Text className='add-dish__image-text'>请上传或生成图片</Text>
              </View>
            )}
          </View>
          <View className='add-dish__image-buttons'>
            <Button className='add-dish__upload-btn' onClick={handleChooseImage}>上传图片</Button>
            <Button className='add-dish__generate-btn' onClick={handleGenerateImage}>AI生成图片</Button>
          </View>
        </View>
      </View>
      
      <View className='add-dish__footer'>
        <Button className='add-dish__save-btn' onClick={handleSave}>保存</Button>
      </View>
    </View>
  )
}