# 家庭菜单小程序

## 项目介绍

这是一个基于Taro框架开发的微信小程序，用于管理家庭菜单。用户可以创建和管理菜品分类、添加和编辑菜品、将菜品添加到菜篮子中，方便家庭日常做饭选择。

## 功能特点

- 菜单管理：创建和编辑家庭菜单
- 分类管理：添加、删除、排序菜品分类
- 菜品管理：添加、删除、查看菜品详情
- 菜篮子功能：将菜品添加到菜篮子，方便购买食材
- AI图片生成：支持AI生成菜品图片（预留功能）

## 业务逻辑实现说明

项目的业务逻辑已经封装在 `src/services/menuService.ts` 文件中，包含以下几个主要模块：

### 1. 菜单信息管理

- `getMenuInfo`：获取菜单信息
- `saveMenuInfo`：保存菜单信息

### 2. 分类管理

- `getCategories`：获取所有分类
- `saveCategories`：保存分类列表
- `addCategory`：添加分类
- `deleteCategory`：删除分类
- `updateCategoryOrder`：更新分类顺序

### 3. 菜品管理

- `getDishes`：获取所有菜品
- `getDishesByCategory`：根据分类获取菜品
- `getDishDetail`：获取菜品详情
- `saveDishes`：保存菜品列表
- `addDish`：添加菜品
- `deleteDish`：删除菜品

### 4. 菜篮子管理

- `getCartItems`：获取菜篮子中的菜品
- `saveCartItems`：保存菜篮子
- `addToCart`：添加菜品到菜篮子
- `removeFromCart`：从菜篮子中移除菜品
- `clearCart`：清空菜篮子

### 5. 图片处理

- `chooseLocalImage`：选择本地图片
- `generateAIImage`：生成AI图片

### 6. 应用初始化

- `initAppData`：初始化应用数据

## 如何实现业务逻辑

要完成小程序的所有业务逻辑，需要按照以下步骤进行：

1. 在各个页面中引入需要的服务函数：

```typescript
import { getCategories, addCategory, deleteCategory, showSuccess } from '../../services'
```

2. 在页面的生命周期函数中初始化数据：

```typescript
useEffect(() => {
  const categories = getCategories()
  setCategories(categories)
}, [])
```

3. 在事件处理函数中调用相应的服务函数：

```typescript
const handleAddCategory = () => {
  const result = validateCategoryName(newCategory)
  if (!result.valid) {
    showError(result.message)
    return
  }
  
  const updatedCategories = addCategory({ name: newCategory })
  setCategories(updatedCategories)
  setNewCategory('')
  showSuccess('添加成功')
}
```

4. 完成每个服务函数中标记的 TODO 逻辑：

所有服务函数中都有 `// TODO 逻辑补充` 注释，需要根据注释中的说明完成具体的业务逻辑实现。

## 数据存储

小程序使用 Taro 的本地存储 API 来保存数据，主要包括以下几个存储键：

- `categories`：分类列表
- `dishes`：菜品列表
- `cartItems`：菜篮子中的菜品
- `menuInfo`：菜单信息

## 工具函数

项目还提供了一些辅助工具函数：

### UI工具函数 (`src/utils/uiUtils.ts`)

- `showSuccess`：显示成功提示
- `showError`：显示错误提示
- `showLoading`：显示加载提示
- `hideLoading`：隐藏加载提示
- `showConfirm`：显示确认对话框

### 验证工具函数 (`src/utils/validationUtils.ts`)

- `isEmpty`：验证字符串是否为空
- `isLengthValid`：验证字符串长度是否在指定范围内
- `validateDishName`：验证菜品名称
- `validateCategoryName`：验证分类名称
- `validateMenuName`：验证菜单名称

## 开发建议

1. 先完成 `menuService.ts` 中的所有 TODO 逻辑
2. 在各个页面中引入并使用相应的服务函数
3. 使用工具函数处理UI交互和数据验证
4. 测试各个功能模块，确保功能正常

## 注意事项

- 所有数据都保存在本地存储中，没有后端服务
- AI图片生成功能需要接入实际的AI服务才能使用
- 确保在应用启动时调用 `initAppData` 函数初始化数据