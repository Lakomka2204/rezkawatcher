import axios from 'axios';
import {log} from 'console'

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json, text/html, */*; q=0.01',
  'Accept-Language': 'uk-UA,uk;q=0.8,en-US;q=0.5,en;q=0.3',
  'X-Requested-With': 'XMLHttpRequest',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'Access-Control-Allow-Origin': '*',
  DNT: '1',
};

export default function init() {
  axios.defaults.headers.common = HEADERS;
  axios.defaults.withCredentials=true;
  axios.defaults.validateStatus=(_) => true;
  // axios.interceptors.request.use(req => {
  //   log("AXRQ", req?.method, req?.url, req?.data);
  //   return req;
  // });
  // axios.interceptors.response.use(res => {
  //   log("AXRS",res.status,res.request.method,res.request.path)
  //   return res;
  // })
};
