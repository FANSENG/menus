import { View, Text, Image, Button } from '@tarojs/components'
import { FC } from 'react'
import Taro from '@tarojs/taro'
import { deleteDishAPI } from '../../services/menuService'
import './index.scss'

interface DishItemProps {
  menusId?: string | number; // Added for delete functionality, assuming it's passed down or globally available
  id: string | number;
  name: string;
  image?: string;
  onAddClick?: (id: string | number) => void;
}

const DishItem: FC<DishItemProps> = ({ menusId, id, name, image, onAddClick }) => {
  const handleDeleteClick = async () => {
    // API_README: menusId (integer, required), name (string, required)
    // User Requirement: 必须传入菜品名和菜单ID (menusId 默认为 1)
    const currentMenuId = menusId || 1; // Default to 1 if not provided
    try {
      await Taro.showModal({
        title: '确认删除',
        content: `确定要删除菜品 "${name}" 吗？`,
        success: async function (res) {
          if (res.confirm) {
            Taro.showLoading({ title: '删除中...' });
            await deleteDishAPI({ menusId: currentMenuId, name });
            Taro.hideLoading();
            Taro.showToast({
              title: '菜品删除成功',
              icon: 'success',
              duration: 1500
            });
            // TODO: Notify parent component to refresh the dish list
            // This could be done via a callback prop, e.g., onDeleteSuccess(id)
            // For now, we'll just log it.
            console.log(`Dish ${name} deleted successfully.`);
            // Potentially, navigate back or refresh data
            // Example: Taro.eventCenter.trigger('dishDeleted', id);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    } catch (error) {
      Taro.hideLoading();
      console.error('Failed to delete dish:', error);
      Taro.showToast({
        title: error.message || '菜品删除失败',
        icon: 'none',
        duration: 2000
      });
    }
  };

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
          <Image className='dish-item__image' src={image.replace(/`/g, '')} mode='aspectFill' />
        ) : (
          <View className='dish-item__image-placeholder' />
        )}
      </View>
      <View className='dish-item__content'>
        <Text className='dish-item__name'>{name}</Text>
      </View>
      <View className='dish-item__actions'>
        <View className='dish-item__add-btn' onClick={handleAddClick}>
          <Text className='dish-item__add-icon'>+</Text>
        </View>
        {/* Delete Button - consider styling and placement */}
        <Button size='mini' type='warn' className='dish-item__delete-btn' onClick={handleDeleteClick}>删除</Button>
      </View>
    </View>
  )
}

export default DishItem