import { View, Text, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { FC, useEffect, useState } from 'react'
import './index.scss'

interface DishDetail {
  id: string | number;
  name: string;
  image?: string;
}

const DishDetailPage: FC = () => {
  const router = useRouter()
  const [dish, setDish] = useState<DishDetail | null>(null)

  useEffect(() => {
    const { id, name, image } = router.params
    if (id) {
      setDish({
        id,
        name: name || '',
        image: image || ''
      })
    }
  }, [router.params])

  const handleDelete = () => {
    if (!dish) return
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除 ${dish.name} 吗？`,
      success: function (res) {
        if (res.confirm) {
          // 这里可以添加删除菜品的逻辑
          console.log('删除菜品', dish.id)
          Taro.navigateBack()
        }
      }
    })
  }

  const handleAddToCart = () => {
    if (!dish) return
    // 获取当前菜篮子中的菜品
    const cartItems = Taro.getStorageSync('cartItems') || []
    // 添加菜品到菜篮子
    cartItems.push(dish)
    Taro.setStorageSync('cartItems', cartItems)
    Taro.showToast({
      title: '已添加到菜篮子',
      icon: 'success',
      duration: 2000
    })
  }

  if (!dish) {
    return <View className='dish-detail'>加载中...</View>
  }

  return (
    <View className='dish-detail'>
      <View className='dish-detail__image-container'>
        {dish.image ? (
          <Image className='dish-detail__image' src={dish.image} mode='aspectFill' />
        ) : (
          <View className='dish-detail__image-placeholder' />
        )}
      </View>
      <View className='dish-detail__content'>
        <Text className='dish-detail__name'>{dish.name}</Text>
      </View>
      <View className='dish-detail__actions'>
        <View className='dish-detail__delete-btn' onClick={handleDelete}>
          删除
        </View>
        <View className='dish-detail__add-btn' onClick={handleAddToCart}>
          加入菜篮子
        </View>
      </View>
    </View>
  )
}

export default DishDetailPage