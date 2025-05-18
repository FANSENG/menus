import { View, Text } from '@tarojs/components'
import { FC } from 'react'
import DishItem from '../DishItem'
import './index.scss'

interface Dish {
  id: string | number;
  name: string;
  image?: string;
}

interface DishListProps {
  dishes: Dish[];
  onAddClick?: (id: string | number) => void;
}

const DishList: FC<DishListProps> = ({ dishes, onAddClick }) => {
  return (
    <View className='dish-list'>
      {dishes.length > 0 ? (
        dishes.map(dish => (
          <DishItem
            key={dish.id}
            id={dish.id}
            name={dish.name}
            image={dish.image}
            onAddClick={onAddClick}
          />
        ))
      ) : (
        <View className='dish-list__empty'>
          <Text className='dish-list__empty-text'>该分类下暂时没有菜品哟~</Text>
        </View>
      )}
    </View>
  )
}

export default DishList