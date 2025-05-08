import { View } from '@tarojs/components'
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
      {dishes.map(dish => (
        <DishItem
          key={dish.id}
          id={dish.id}
          name={dish.name}
          image={dish.image}
          onAddClick={onAddClick}
        />
      ))}
    </View>
  )
}

export default DishList