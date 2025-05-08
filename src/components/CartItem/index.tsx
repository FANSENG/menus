import { View, Text, Image } from '@tarojs/components'
import { FC } from 'react'
import './index.scss'

interface CartItemProps {
  id: string | number;
  name: string;
  image?: string;
  onRemoveClick?: (id: string | number) => void;
}

const CartItem: FC<CartItemProps> = ({ id, name, image, onRemoveClick }) => {
  const handleRemoveClick = () => {
    onRemoveClick && onRemoveClick(id)
  }

  return (
    <View className='cart-item'>
      <View className='cart-item__left'>
        <View className='cart-item__image-container'>
          {image ? (
            <Image className='cart-item__image' src={image} mode='aspectFill' />
          ) : (
            <View className='cart-item__image-placeholder' />
          )}
        </View>
        <Text className='cart-item__name'>{name}</Text>
      </View>
      <View className='cart-item__remove-btn' onClick={handleRemoveClick}>
        <Text>-</Text>
      </View>
    </View>
  )
}

export default CartItem