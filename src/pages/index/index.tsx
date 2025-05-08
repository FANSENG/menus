import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import Header from '../../components/Header'
import CategoryList from '../../components/CategoryList'
import DishList from '../../components/DishList'
import TabBar from '../../components/TabBar'
import './index.scss'

// 模拟数据
const mockCategories = [
  { id: 'stir_fry', name: '炒菜' },
  { id: 'noodle', name: '面食' },
  { id: 'soup', name: '汤' },
  { id: 'hot_pot', name: '火锅' },
  { id: 'select_5', name: '选项 5' },
  { id: 'select_6', name: '选项 6' },
  { id: 'select_7', name: '选项 7' },
  { id: 'select_8', name: '选项 8' },
  { id: 'select_9', name: '选项 9' },
  { id: 'select_10', name: '选项 10' },
  { id: 'select_11', name: '选项 11' },
]

const mockDishes = [
  { id: 1, name: '辣椒炒肉', image: '' },
  { id: 2, name: '辣椒炒肉', image: '' },
  { id: 3, name: '辣椒炒肉', image: '' },
  { id: 4, name: '辣椒炒肉', image: '' },
  { id: 5, name: '辣椒炒肉', image: '' },
  { id: 6, name: '辣椒炒肉', image: '' },
  { id: 7, name: '辣椒炒肉', image: '' },
  { id: 8, name: '辣椒炒肉', image: '' },
]

export default function Index () {
  const [activeCategory, setActiveCategory] = useState<string | number>('stir_fry')
  
  useLoad(() => {
    console.log('Page loaded.')
  })

  const handleCategoryClick = (categoryId: string | number) => {
    setActiveCategory(categoryId)
  }

  const handleAddDish = (dishId: string | number) => {
    console.log('添加菜品', dishId)
    // 获取当前菜篮子中的菜品
    const cartItems = Taro.getStorageSync('cartItems') || []
    // 查找要添加的菜品
    const dishToAdd = mockDishes.find(dish => dish.id === dishId)
    if (dishToAdd) {
      // 检查是否已经在菜篮子中
      const isExist = cartItems.some(item => item.id === dishId)
      if (!isExist) {
        // 添加到菜篮子
        const newCartItems = [...cartItems, dishToAdd]
        Taro.setStorageSync('cartItems', newCartItems)
        Taro.showToast({
          title: '已添加到菜篮子',
          icon: 'success',
          duration: 2000
        })
      } else {
        Taro.showToast({
          title: '该菜品已在菜篮子中',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }

  const handleAddNewDish = () => {
    console.log('跳转到菜品添加页面')
    // 这里可以
    Taro.navigateTo({
      url: '../addDish/index'
    })
  }

  const handleManageCategories = () => {
    console.log('管理分类')
    Taro.navigateTo({
      url: '/pages/categoryManage/index'
    })
  }

  const [activeTab, setActiveTab] = useState('menu')

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    if (key === 'cart') {
      Taro.redirectTo({ url: '/pages/cart/index' })
    }
  }

  return (
    <View className='menu-page'>
      <Header 
        menuName='放学嗨家庭菜单' 
        onAddClick={handleAddNewDish} 
      />
      <View className='menu-page__content'>
        <CategoryList 
          categories={mockCategories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
          onManageClick={handleManageCategories}
        />
        <DishList 
          dishes={mockDishes}
          onAddClick={handleAddDish}
        />
      </View>
      <TabBar 
        tabs={[
          { key: 'menu', title: '菜单' },
          { key: 'cart', title: '菜篮子' }
        ]}
        activeTab={activeTab}
        onChange={handleTabChange}
      />
    </View>
  )
}
