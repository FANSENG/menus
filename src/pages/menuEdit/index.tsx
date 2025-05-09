import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Input, Button } from '@tarojs/components'
import './index.scss'

export default function MenuEdit() {
  const [menuName, setMenuName] = useState('')
  const [menuImage, setMenuImage] = useState('')
  
  // 接收从主页传递的菜单信息
  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const eventChannel = instance?.page?.getOpenerEventChannel?.()
    if (eventChannel) {
      eventChannel.on('acceptMenuInfo', (data) => {
        if (data) {
          setMenuName(data.menuName || '')
          setMenuImage(data.menuImage || '')
        }
      })
    }
  }, [])

  // 选择图片
  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        setMenuImage(res.tempFilePaths[0])
      }
    })
  }

  // 保存菜单信息
  const handleSave = () => {
    // 这里可以添加保存逻辑，例如调用API保存数据
    console.log('保存菜单信息', { menuName, menuImage })
    
    // 保存后返回首页
    Taro.navigateBack()
  }

  // 跳转到添加菜品页面
  const handleAddDish = () => {
    const instance = Taro.getCurrentInstance()
    const menuId = instance?.router?.params?.id
    
    Taro.navigateTo({
      url: `/pages/dishEdit/index?menuId=${menuId || ''}`
    })
  }

  return (
    <View className='menu-edit'>
      <View className='menu-edit__header'>
        <Text className='menu-edit__title'>编辑菜单</Text>
      </View>
      
      <View className='menu-edit__content'>
        <View className='menu-edit__image-section'>
          <View className='menu-edit__image-container' onClick={handleChooseImage}>
            {menuImage ? (
              <Image className='menu-edit__image' src={menuImage} mode='aspectFill' />
            ) : (
              <View className='menu-edit__image-placeholder'>
                <Text className='menu-edit__image-text'>点击选择图片</Text>
              </View>
            )}
          </View>
        </View>
        
        <View className='menu-edit__form-item'>
          <Text className='menu-edit__label'>菜单名</Text>
          <Input
            className='menu-edit__input'
            value={menuName}
            onInput={e => setMenuName(e.detail.value)}
            placeholder='请输入菜单名称'
          />
        </View>

        <View className='menu-edit__add-dish'>
          <Button className='menu-edit__add-dish-btn' onClick={handleAddDish}>添加菜品</Button>
        </View>
      </View>
      
      <View className='menu-edit__footer'>
        <Button className='menu-edit__save-btn' onClick={handleSave}>保存</Button>
      </View>
    </View>
  )
}