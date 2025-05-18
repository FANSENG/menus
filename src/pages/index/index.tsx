import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import Header from '../../components/Header'
import CategoryList from '../../components/CategoryList'
import DishList from '../../components/DishList'
import TabBar from '../../components/TabBar'
import { getCombineInfo, Category, Dish, Menu } from '../../services/menuService'
import './index.scss'

// 将Category接口转换为CategoryList组件需要的格式
const convertCategories = (categories: string[] | Category[]) => {
  // 处理字符串数组的情况
  if (categories.length > 0 && typeof categories[0] === 'string') {
    return (categories as string[]).map((categoryName) => ({
      id: categoryName, // 使用分类名称作为ID
      name: categoryName
    }))
  }
  // 处理对象数组的情况
  return (categories as Category[]).map((category) => ({
    id: category.name, // 使用分类名称作为ID
    name: category.name
  }))
}

// 将Dish接口转换为DishList组件需要的格式
const convertDishes = (dishes: Dish[], categoryName: string) => {
  return dishes
    .filter(dish => dish.categoryName === categoryName)
    .map((dish, index) => ({
      id: index + 1, // 使用索引作为临时ID
      name: dish.name,
      // 处理图片URL中可能包含的反引号
      image: dish.image ? dish.image.replace(/`/g, '') : ''
    }))
}

export default function Index () {
  // 状态定义
  const [menuInfo, setMenuInfo] = useState<Menu>({ id: 1, name: '家庭菜单', image: '' })
  const [categories, setCategories] = useState<{id: string | number; name: string}[]>([])
  const [dishes, setDishes] = useState<{id: string | number; name: string; image?: string}[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [allDishes, setAllDishes] = useState<Dish[]>([])
  
  // 加载数据的函数
  const loadData = async () => {
    try {
      // 调用getCombineInfo获取数据
      const info = await getCombineInfo(1);
      
      // 设置菜单信息
      setMenuInfo(info.menu);
      
      // 转换并设置分类列表
      const formattedCategories = convertCategories(info.categories);
      setCategories(formattedCategories);
      
      // 保存所有菜品数据
      setAllDishes(info.dishes);
      
      // 默认选择第一个分类或保持当前选中的分类
      const categoryToSelect = activeCategory || (formattedCategories.length > 0 ? formattedCategories[0].id : '');
      if (categoryToSelect) {
        setActiveCategory(categoryToSelect);
        
        // 根据选中的分类筛选菜品
        const selectedCategoryName = formattedCategories.find(c => c.id === categoryToSelect)?.name || categoryToSelect;
        const filteredDishes = convertDishes(info.dishes, selectedCategoryName);
        setDishes(filteredDishes);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      Taro.showToast({
        title: '加载数据失败',
        icon: 'none',
        duration: 2000
      });
    }
  };
  
  // 页面加载时获取数据
  useLoad(() => {
    loadData();
    
    // 监听菜品数据变化事件
    Taro.eventCenter.on('dishDataChanged', loadData);
    
    // 组件卸载时移除事件监听
    return () => {
      Taro.eventCenter.off('dishDataChanged', loadData);
    };
  })

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
    
    // 根据选中的分类筛选菜品
    const selectedCategoryName = categories.find(c => c.id === categoryId)?.name || ''
    if (selectedCategoryName) {
      const filteredDishes = convertDishes(allDishes, selectedCategoryName)
      setDishes(filteredDishes)
    } else {
      // 如果找不到分类名称，可能是因为categoryId本身就是分类名称（字符串数组的情况）
      const filteredDishes = convertDishes(allDishes, categoryId as string)
      setDishes(filteredDishes)
    }
  }

  const handleAddDish = (dishId: string | number) => {
    console.log('添加菜品', dishId)
    // 获取当前菜篮子中的菜品
    const cartItems = Taro.getStorageSync('cartItems') || []
    // 查找要添加的菜品
    const dishToAdd = dishes.find(dish => dish.id === dishId)
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
    // 传递当前选中的分类信息和所有分类数据到添加菜品页面
    const selectedCategoryName = categories.find(c => c.id === activeCategory)?.name || ''
    const categoriesNames = categories.map(c => c.name)
    Taro.navigateTo({
      url: `../addDish/index?categoryName=${encodeURIComponent(selectedCategoryName)}&categories=${encodeURIComponent(JSON.stringify(categoriesNames))}`
    })
  }

  const handleManageCategories = () => {
    console.log('管理分类')
    // 传递当前分类数据到分类管理页面
    Taro.navigateTo({
      url: '/pages/categoryManage/index',
      success: function(res) {
        // 将当前分类数据传递给打开的页面
        // 确保传递的是格式化后的分类数据，包含id和name属性
        res.eventChannel.emit('acceptCategories', { categories })
      }
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
        menuName={menuInfo.name} 
        menuImage={menuInfo.image}
        onAddClick={handleAddNewDish} 
      />
      <View className='menu-page__content'>
        <CategoryList 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
          onManageClick={handleManageCategories}
        />
        <DishList 
          dishes={dishes}
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
