import Taro from '@tarojs/taro';

const request_data = {
  // platform: 'wap',
  // rent_mode: 2,
};
const _window=window;



export default (options = {url:String, method:String, data:Object,mode:String,urltype:String}) => {
  return Taro.request({
    url:options.url,
    data: options.data,
    header: options.header?options.header:{
      'Content-Type': options.mode=="text"?'text/html; charset=UTF-8':'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin":"*"
    },
    method:options.method?options.method:"POST",
  }).then((res) => {
    return res;
  })
}

