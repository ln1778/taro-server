
import Taro from "@tarojs/taro";


  export const pxTransform = (num)=> {
   return Taro.pxTransform(num,375);
  }

  // 获取Session
export function getSession(key) {
  return sessionStorage.getItem(key)
}
// 删除Session
export function delSession(key) {
  return sessionStorage.removeItem(key);
}

// 添加本地存储
export function addStorage(key, value) {
  Taro.setStorageSync(key, value)
}
// 获取本地存储
export function getStorage(key) {
  return Taro.getStorageSync(key)
}
// 删除本地存储指定的值
export function deloneStorage(key) {
 Taro.removeStorageSync(key);
}
// 删除本地存储指定的值
export function delallStorage() {
  Taro.clearStorageSync();
 }