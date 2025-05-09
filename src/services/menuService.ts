/**
 * 菜单应用业务逻辑服务
 * 包含所有菜单应用需要的业务逻辑函数
 */
import Taro from '@tarojs/taro'

// 定义数据接口
export interface Category {
  name: string;
}

export interface Dish {
  name: string;
  image?: string;
  categoryName: string;
}

export interface Menu {
  id: string | number;
  name: string;
  image?: string;
}

export interface CombineInfo{
  menu:Menu;
  categories:Category[];
  dishes:Dish[];
}

// 存储键名常量
const STORAGE_KEYS = {
  CATEGORIES: 'categories',
  DISHES: 'dishes',
  CART_ITEMS: 'cartItems',
  MENU_INFO: 'menuInfo'
}
/**
 * 聚合信息获取
*/

export const getCombineInfo = async (id: string | number): Promise<CombineInfo> => {
  try {
    const res = await Taro.request<CombineInfo>({
      url: `https://func.fs1n.site/menus/combine-info/${id}`,
      method: 'GET',
      dataType: 'json'
    });
    if (res.statusCode === 200 && res.data) {
      return res.data;
    } else {
      // 可以根据实际需求处理错误，例如抛出错误或返回默认值
      console.error('Failed to fetch combine info:', res);
      throw new Error('Failed to fetch combine info');
    }
  } catch (error) {
    console.error('Error fetching combine info:', error);
    throw error;
  }
}

/**
 * 菜单信息相关函数
*/

/**
 * 保存菜单信息
 * @param menu 菜单信息
 */
export const saveMenuInfo = (menu: Menu): void => {
  // TODO 逻辑补充
  // 1. 验证菜单信息
  // 2. 保存到本地存储
  Taro.setStorageSync(STORAGE_KEYS.MENU_INFO, menu)
}

/**
 * 分类相关函数
 */

/**
 * 获取所有分类
 * @param id 菜单ID
 * @returns 分类列表
 */
export const getCategories = async (id: string | number): Promise<Category[]> => {
  try {
    const combineInfo = await getCombineInfo(id);
    return combineInfo.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // 或者根据需求返回一个空数组或默认值
  }
}

/**
 * 保存分类列表
 * @param categories 分类列表
 */
export const saveCategories = (categories: Category[]): void => {
  // TODO 逻辑补充
  // 1. 验证分类列表
  // 2. 保存到本地存储
  Taro.setStorageSync(STORAGE_KEYS.CATEGORIES, categories)
}

/**
 * 分类相关函数
 */

export const addDish = (dish: Dish): void => {
  // TODO 逻辑补充
  // 1. 验证菜品信息
  // 2. 获取当前菜品列表
  // 3. 将新菜品添加到列表中
  // 4. 保存到本地存储
  const dishes = Taro.getStorageSync(STORAGE_KEYS.DISHES) || []
  dishes.push(dish)
}