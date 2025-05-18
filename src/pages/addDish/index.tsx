import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Input, Button, Picker } from '@tarojs/components'
import { addDishAPI } from '../../services/menuService'
import './index.scss'

export default function AddDish() {
  const [dishName, setDishName] = useState('')
  const [dishImage, setDishImage] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  
  // 获取路由参数和分类数据
  useEffect(() => {
    const router = Taro.getCurrentInstance().router
    if (router && router.params) {
      // 从路由参数获取分类数据
      if (router.params.categories) {
        setCategories(JSON.parse(decodeURIComponent(router.params.categories)))
      }
      // 从路由参数获取默认选中的分类
      if (router.params.categoryName) {
        setCategoryName(decodeURIComponent(router.params.categoryName))
      }
    }
  }, [])

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

  // 图片转 Base64
  const imageToBase64 = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      Taro.getFileSystemManager().readFile({
        filePath: filePath,
        encoding: 'base64',
        success: (res) => {
          resolve(res.data as string);
        },
        fail: (err) => {
          console.error('Failed to read image file to base64', err);
          reject(err);
        }
      });
    });
  };

  // 保存菜品信息
  const handleSave = async () => {
    if (!dishName.trim()) {
      Taro.showToast({ title: '请输入菜品名称', icon: 'none', duration: 2000 });
      return;
    }
    if (!dishImage) {
      Taro.showToast({ title: '请上传或生成菜品图片', icon: 'none', duration: 2000 });
      return;
    }
    // categoryName 默认为 '其他'
    const currentCategoryName = categoryName || '其他';

    try {
      Taro.showLoading({ title: '保存中...' });
      // 1. 图片转base64
      // TODO: 图片压缩到 640x640 逻辑应在此处或 imageToBase64 内部实现
      const base64Image = await imageToBase64(dishImage);

      // 2. 调用API
      // menusId 默认为 1
      const menuId = 1;
      await addDishAPI({
        menusId: menuId,
        name: dishName.trim(),
        image: base64Image,
        categoryName: currentCategoryName
      });

      Taro.hideLoading();
      Taro.showToast({
        title: '菜品添加成功',
        icon: 'success',
        duration: 2000
      });
      // 保存成功后返回上一页
      Taro.navigateBack();
    } catch (error) {
      Taro.hideLoading();
      console.error('Failed to save dish:', error);
      Taro.showToast({
        title: error.message || '菜品添加失败',
        icon: 'none',
        duration: 2000
      });
    }
  }

  return (
    <View className='add-dish'>
      <View className='add-dish__content'>
        <View className='add-dish__form-item'>
          <Text className='add-dish__label'>分类</Text>
          <Picker 
            mode='selector' 
            range={categories}
            onChange={(e) => setCategoryName(categories[e.detail.value])}
            value={categories.indexOf(categoryName)}
          >
            <View className='add-dish__picker'>
              {categoryName || '请选择分类'}
            </View>
          </Picker>
        </View>
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