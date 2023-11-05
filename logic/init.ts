import axios from "axios";
export function check() : boolean {
  return axios.defaults.withCredentials || false;
} 
export function init() {
  axios.interceptors.request.use((req) => {
    console.log("AXRQ", req.headers['Cookie'], req?.method, req?.url, req?.data);
    return req;
  });
  const HEADERS = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded",
    'Accept': "text/html, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "DNT":1,
    "Sec-Fetch-Site": "same-origin",
  };
  axios.defaults.headers.common = HEADERS;
  axios.defaults.withCredentials = true;
  // axios.defaults.headers.common["Cookie"] =
  //   "PHPSESSID=ihkarnkiq75j9icgu2a977ghpg; path=/; domain=.rezka.ag; HttpOnly";
}
