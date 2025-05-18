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
 * 保存分类列表到服务器
 * @param id 菜单ID
 * @param categoriesNameArray 分类名称列表
 */
export const saveCategoriesAPI = async (id: string | number, categoriesNameArray: string[]): Promise<any> => {
  // API_README: "其他" category auto-added by backend.
  try {
    const res = await Taro.request({
      url: `https://func.fs1n.site/menus/save-categories`,
      method: 'POST',
      data: {
        id: Number(id),
        categories: categoriesNameArray
      },
      dataType: 'json'
    });
    if (res.statusCode === 200 && res.data && res.data.success) {
      return res.data;
    } else {
      console.error('Failed to save categories:', res);
      throw new Error(res.data?.message || 'Failed to save categories');
    }
  } catch (error) {
    console.error('Error saving categories:', error);
    throw error;
  }
}

/**
 * 保存分类列表到本地 (旧逻辑)
 * @param categories 分类列表
 */
export const saveCategoriesLocal = (categories: Category[]): void => {
  Taro.setStorageSync(STORAGE_KEYS.CATEGORIES, categories)
}

/**
 * 分类相关函数
 */

/**
 * 添加菜品到服务器
 * @param dishInfo 包含菜品信息的对象
 * @param dishInfo.menusId 菜单ID
 * @param dishInfo.name 菜品名称
 * @param dishInfo.image Base64编码的图片字符串 (调用前需压缩至640x640)
 * @param dishInfo.categoryName 分类名称 (默认为 "其他")
 */
export const addDishAPI = async (dishInfo: {
  menusId: string | number;
  name: string;
  image: string; // Base64 encoded image string, frontend needs to compress to 640x640
  categoryName?: string;
}): Promise<any> => {
  // TODO: Implement image compression to 640x640 and base64 encoding before calling this function.
  const payload = {
    menusId: Number(dishInfo.menusId),
    name: dishInfo.name,
    image: dishInfo.image,
    categoryName: dishInfo.categoryName || '其他'
  };

  try {
    const res = await Taro.request({
      url: `https://func.fs1n.site/menus/add-dish`,
      method: 'POST',
      data: payload,
      dataType: 'json'
    });
    if (res.statusCode === 200 && res.data && res.data.success) {
      return res.data;
    } else {
      console.error('Failed to add dish:', res);
      throw new Error(res.data?.message || 'Failed to add dish');
    }
  } catch (error) {
    console.error('Error adding dish:', error);
    throw error;
  }
}

/**
 * 添加菜品到本地 (旧逻辑)
 */
export const addDishLocal = (dish: Dish): void => {
  const dishes = Taro.getStorageSync(STORAGE_KEYS.DISHES) || []
  dishes.push(dish)
  Taro.setStorageSync(STORAGE_KEYS.DISHES, dishes)
}

/**
 * 从服务器删除菜品
 * @param deleteInfo 包含删除菜品信息的对象
 * @param deleteInfo.menusId 菜单ID
 * @param deleteInfo.name 菜品名称
 */
export const deleteDishAPI = async (deleteInfo: {
  menusId: string | number;
  name: string;
}): Promise<any> => {
  const payload = {
    menusId: Number(deleteInfo.menusId),
    name: deleteInfo.name
  };

  try {
    const res = await Taro.request({
      url: `https://func.fs1n.site/menus/delete-dish`,
      method: 'POST',
      data: payload,
      dataType: 'json'
    });
    if (res.statusCode === 200 && res.data && res.data.success) {
      return res.data;
    } else {
      console.error('Failed to delete dish:', res);
      throw new Error(res.data?.message || 'Failed to delete dish');
    }
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw error;
  }
}