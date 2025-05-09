import { View, Text, Image } from '@tarojs/components'
import { FC } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

interface DishItemProps {
  id: string | number;
  name: string;
  image?: string;
  onAddClick?: (id: string | number) => void;
}

const DishItem: FC<DishItemProps> = ({ id, name, image, onAddClick }) => {
  const handleAddClick = () => {
    onAddClick && onAddClick(id)
  }

  const handleImageClick = () => {
    // 跳转到菜品详情页面，并传递菜品信息
    Taro.navigateTo({
      url: `/pages/dishDetail/index`,
      success: function(res) {
        // 将完整的菜品信息传递给菜品详情页面
        res.eventChannel.emit('acceptDishInfo', {
          id,
          name,
          image: image || ''
        })
      }
    })
  }

  return (
    <View className='dish-item'>
      <View className='dish-item__image-container' onClick={handleImageClick}>
        {image ? (
          <Image className='dish-item__image' src={image} mode='aspectFill' />
        ) : (
          <View className='dish-item__image-placeholder' />
        )}
      </View>
      <View className='dish-item__content'>
        <Text className='dish-item__name'>{name}</Text>
      </View>
      <View className='dish-item__add-btn' onClick={handleAddClick}>
        <Text className='dish-item__add-icon'>+</Text>
      </View>
    </View>
  )
}

export default DishItem