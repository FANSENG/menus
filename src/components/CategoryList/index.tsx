import { FC } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

interface Category {
  id: string | number;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  activeCategory: string | number;
  onCategoryClick: (categoryId: string | number) => void;
  onManageClick?: () => void;
}

const CategoryList: FC<CategoryListProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryClick,
  onManageClick 
}) => {
  // 处理分类管理点击事件
  const handleManageClick = () => {
    if (onManageClick) {
      onManageClick();
    } else {
      // 默认跳转到分类管理页面
      Taro.navigateTo({
        url: '/pages/categoryManage/index'
      });
    }
  };

  return (
    <View className='category-list'>
      <View className='category-list__items'>
        {categories.map(category => (
          <View 
            key={category.id} 
            className={`category-list__item ${activeCategory === category.id ? 'category-list__item--active' : ''}`}
            onClick={() => onCategoryClick(category.id)}
          >
            <Text className='category-list__item-text'>{category.name}</Text>
          </View>
        ))}
      </View>
      <View className='category-list__manage' onClick={handleManageClick}>
        <Text className='category-list__manage-text'>分类管理</Text>
      </View>
    </View>
  )
}

export default CategoryList