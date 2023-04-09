import { useState, useEffect, useReducer } from 'react';
import axios,* as defaultAxios from 'axios';
import {getStorage,deloneStorage} from "./commont";
import { initialResponse, responseReducer, actions } from './reducers';
import Taro from '@tarojs/taro';
import Request from "./axios";
/**
 * Params
 * @param  {AxiosInstance} axios - (optional) The custom axios instance
 * @param  {string} url - The request URL
 * @param  {('GET'|'POST'|'PUT'|'DELETE'|'HEAD'|'OPTIONS'|'PATCH')} method - The request method
 * @param  {object} [options={}] - (optional) The config options of Axios.js (https://goo.gl/UPLqaK)
 * @param  {object|string} trigger - (optional) The conditions for AUTO RUN, refer the concepts of [conditions](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) of useEffect, but ONLY support string and plain object. If the value is a constant, it'll trigger ONLY once at the begining
 * @param  {function} [forceDispatchEffect=() => true] - (optional) Trigger filter function, only AUTO RUN when get `true`, leave it unset unless you don't want AUTU RUN by all updates of trigger
 * @param  {function} [customHandler=(error, response) => {}] - (optional) Custom handler callback, NOTE: `error` and `response` will be set to `null` before request
 */

/**
 * Returns
 * @param  {object} response - The response of Axios.js (https://goo.gl/dJ6QcV)
 * @param  {object} error - HTTP error
 * @param  {boolean} loading - The loading status
 * @param  {function} reFetch - MANUAL RUN trigger function for making a request manually
 */

const { CancelToken,isCancel } = defaultAxios;
const _Object=Object;

export default ({
  url,
  method = 'post',
  data = {},
  trigger,
  filter,
  forceDispatchEffect,
  customHandler,
} = {}) => {
  const [results, dispatch] = useReducer(responseReducer, initialResponse);
  const [innerTrigger, setInnerTrigger] = useState(0);

  let outerTrigger = trigger;
  try {
    outerTrigger = JSON.stringify(trigger);
  } catch (err) {
    //
  }
  const dispatchEffect = forceDispatchEffect || filter || (() => true);

  const handler= (error, response,data) => {
    if (customHandler) {
      customHandler(error,data,response);
    }
  };
  let config={};
  const token=getStorage('token');
  const source = CancelToken.source();
  if (token) {
    config = {
      headers: { Authorization: token,"Access-Control-Allow-Origin":"*"},
      cancelToken: source.token
    } //添加请求头
  }
  if(method&&method=="file"){
     config.headers={
        Authorization: token,
        'Content-Type': 'multipart/form-data',
        Accept: '*/*',
    };
  }
  useEffect(() => {
    if (!url || !dispatchEffect()) return;
    // ONLY trigger by query
    if(outerTrigger&&!innerTrigger){
         return ;
    }
  
    handler(null, null);
    dispatch({ type: actions.init });
    
    let newurl=url;
   if(/^http|https/.test(url)){
    newurl=url;
   }else{
     if(window.config){
      newurl=window.config.indexurl+url;
     }
   }
    Request({newurl,method,data,header:config.headers})
      .then(response => {
        if(response.data&&response.data.errcode&&response.data.errcode==1002){
            deloneStorage("token");
        }else{
          if(response.data){
            handler(null,response, response.data);
            dispatch({ type: actions.success, payload: response});
          }else{
            Taro.showToast({
                'title': '服务器数据为空'
              });
          }
        }
      })
      .catch(error => {
        handler(error, null);
        if (!isCancel(error)) {
          dispatch({ type: actions.fail, payload: error });
        }
      });

    return () => {
      source.cancel();
    };
  }, [innerTrigger, outerTrigger]);

  return {
    ...results,
    // @deprecated
    query: () => {
      setInnerTrigger(+new Date());
    },
    reFetch: () => {
      setInnerTrigger(+new Date());
    },
  };
};


