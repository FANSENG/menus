import { FC, useState, useEffect } from 'react'
import { View, Text, Button, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { saveCategoriesAPI } from '../../services/menuService'
import './index.scss'

interface Category {
  id: string | number;
  name: string;
}

const CategoryManage: FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')

  // 初始化加载分类数据
  useEffect(() => {
    // 从上一页接收传递的分类数据
    const instance = Taro.getCurrentInstance()
    const eventChannel = instance?.page?.getOpenerEventChannel?.()
    if (eventChannel) {
      eventChannel.on('acceptCategories', (data) => {
        if (data && data.categories && data.categories.length > 0) {
          setCategories(data.categories)
        } else {
          // 如果没有接收到数据，则使用默认分类
          const defaultCategories: Category[] = [
            { id: '1', name: '炒菜' },
            { id: '2', name: '汤' },
            { id: '3', name: '主食' },
            { id: '4', name: '面食' },
            { id: '5', name: '火锅' },
            { id: '6', name: '粥' },
            { id: '7', name: '凉菜' },
            { id: '8', name: '其他' } // 特殊类别，不可删除
          ]
          setCategories(defaultCategories)
        }
      })
    }
  }, [])

  // 上移类别
  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newCategories = [...categories]
    const temp = newCategories[index]
    newCategories[index] = newCategories[index - 1]
    newCategories[index - 1] = temp
    setCategories(newCategories)
  }

  // 下移类别
  const handleMoveDown = (index: number) => {
    if (index === categories.length - 1) return
    const newCategories = [...categories]
    const temp = newCategories[index]
    newCategories[index] = newCategories[index + 1]
    newCategories[index + 1] = temp
    setCategories(newCategories)
  }

  // 删除类别
  const handleDelete = (index: number) => {
    // 检查是否为"其他"类别，不允许删除
    if (categories[index].name === '其他') {
      Taro.showToast({
        title: '"其他"类别不可删除',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    const newCategories = [...categories]
    newCategories.splice(index, 1)
    setCategories(newCategories)
  }

  // 添加新类别
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      Taro.showToast({
        title: '类别名称不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 检查是否已存在相同名称的类别
    if (categories.some(cat => cat.name === newCategory.trim())) {
      Taro.showToast({
        title: '该类别已存在',
        icon: 'none',
        duration: 2000
      })
      return
    }

    const newId = Date.now().toString() // 简单生成ID
    setCategories([...categories, { id: newId, name: newCategory.trim() }])
    setNewCategory('') // 清空输入框
  }

  // 保存所有类别
  const handleSave = async () => {
    const categoryNames = categories.map(cat => cat.name);
    // API_README: id当前默认传1，分类是一个string列表。要求必须有 其他 这个分类 (后端会自动添加“其他”)
    try {
      // TODO: Get current menu ID, defaulting to 1 for now as per requirement
      const menuId = 1;
      await saveCategoriesAPI(menuId, categoryNames);
      Taro.showToast({
        title: '分类保存成功',
        icon: 'success',
        duration: 2000
      });
      // 触发全局事件，通知主页刷新数据
      Taro.eventCenter.trigger('dishDataChanged');
      // 保存后返回上一页
      Taro.navigateBack();
    } catch (error) {
      console.error('Failed to save categories:', error);
      Taro.showToast({
        title: error.message || '分类保存失败',
        icon: 'none',
        duration: 2000
      });
    }
  }

  // 返回上一页
  const handleBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className='category-manage'>
      <View className='category-manage__header'>
        <View className='category-manage__back' onClick={handleBack}>
          <Text className='category-manage__back-icon'>←</Text>
        </View>
        <Text className='category-manage__title'>分类管理</Text>
        <View className='category-manage__placeholder'></View>
      </View>

      <View className='category-manage__content'>
        {categories.map((category, index) => (
          <View key={category.id} className='category-manage__item'>
            <View className='category-manage__item-name'>
              <Text>{category.name}</Text>
            </View>
            <View className='category-manage__item-actions'>
              <View 
                className='category-manage__action-btn' 
                onClick={() => handleMoveUp(index)}
              >
                <Text className='category-manage__action-icon'>↑</Text>
              </View>
              <View 
                className='category-manage__action-btn' 
                onClick={() => handleMoveDown(index)}
              >
                <Text className='category-manage__action-icon'>↓</Text>
              </View>
              <View 
                className={`category-manage__action-btn ${category.name === '其他' ? 'category-manage__action-btn--disabled' : ''}`} 
                onClick={() => handleDelete(index)}
              >
                <Text className='category-manage__action-icon'>🗑️</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className='category-manage__add'>
        <Input
          className='category-manage__add-input'
          value={newCategory}
          onInput={e => setNewCategory(e.detail.value)}
          placeholder='输入新类别名称'
        />
        <Button 
          className='category-manage__add-btn'
          onClick={handleAddCategory}
        >
          添加
        </Button>
      </View>

      <View className='category-manage__footer'>
        <Button 
          className={`category-manage__save-btn ${categories.length === 0 ? 'category-manage__save-btn--disabled' : ''}`}
          onClick={handleSave}
          disabled={categories.length === 0}
        >
          保存
        </Button>
      </View>
    </View>
  )
}

export default CategoryManage