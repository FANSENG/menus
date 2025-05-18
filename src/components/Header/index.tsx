import { View, Text, Image } from '@tarojs/components'
import { FC } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

interface HeaderProps {
  menuName: string;
  menuImage?: string;
  onAddClick?: () => void;
}

const Header: FC<HeaderProps> = ({ menuName, menuImage, onAddClick }) => {
  return (
    <View className='menu-header'>
      <View className='menu-header__left'>
        <View className='menu-header__image-container' onClick={() => Taro.navigateTo({
          url: '/pages/menuEdit/index',
          success: function(res) {
            // 将当前菜单信息传递给菜单编辑页面
            res.eventChannel.emit('acceptMenuInfo', { menuName, menuImage })
          }
        })}
        >
          {menuImage ? (
            <Image className='menu-header__image' src={menuImage.replace(/`/g, '')} mode='aspectFill' />
          ) : (
            <View className='menu-header__image-placeholder' />
          )}
        </View>
        <Text className='menu-header__title'>{menuName}</Text>
      </View>
      <View className='menu-header__add-btn' onClick={onAddClick}>
        <Text>添加</Text>
      </View>
    </View>
  )
}

export default Header