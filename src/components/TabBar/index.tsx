import { View, Text } from '@tarojs/components'
import { FC } from 'react'
import './index.scss'

interface TabItem {
  key: string;
  title: string;
  icon?: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
}

const TabBar: FC<TabBarProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <View className='tab-bar'>
      {tabs.map(tab => (
        <View 
          key={tab.key} 
          className={`tab-bar__item ${activeTab === tab.key ? 'tab-bar__item--active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.icon && <View className={`tab-bar__icon tab-bar__icon--${tab.key}`} />}
          <Text className='tab-bar__text'>{tab.title}</Text>
        </View>
      ))}
    </View>
  )
}

export default TabBar