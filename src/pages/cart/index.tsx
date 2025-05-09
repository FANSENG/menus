import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import TabBar from '../../components/TabBar'
import CartItem from '../../components/CartItem'
import { getCombineInfo } from '../../services/menuService'
import './index.scss'

interface CartItem {
  id: string | number;
  name: string;
  image?: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [activeTab, setActiveTab] = useState('cart')

  useLoad(() => {
    // 获取当前菜单信息并设置导航栏标题
    getCombineInfo(0).then(info => {
      const menuName = info.menu.name || '菜篮子'
      Taro.setNavigationBarTitle({
        title: menuName
      })
    })
    
    // 从缓存中获取购物车数据
    const cartData = Taro.getStorageSync('cartItems') || []
    setCartItems(cartData)
  })

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    if (key === 'menu') {
      Taro.redirectTo({ url: '/pages/index/index' })
    }
  }

  const handleRemoveItem = (id: string | number) => {
    const newCartItems = cartItems.filter(item => item.id !== id)
    setCartItems(newCartItems)
    // 更新缓存
    Taro.setStorageSync('cartItems', newCartItems)
  }

  return (
    <View className='cart-page'>
      <View className='cart-page__header'>
        <Text className='cart-page__title'>菜篮子</Text>
      </View>
      <View className='cart-page__content'>
        {cartItems.length > 0 ? (
          <View className='cart-list'>
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                onRemoveClick={handleRemoveItem}
              />
            ))}
          </View>
        ) : (
          <View className='cart-empty'>
            <Text className='cart-empty__text'>菜篮子空空如也</Text>
          </View>
        )}
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