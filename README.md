## 1. 生成项目
```js
npm i dva-cli -g
dva new user-dashboard
cd user-dashboard
```

## 2. 配置代理，能通过 RESTFul 的方式访问 
```js
"proxy": {
  "/api": {
    "target": "http://jsonplaceholder.typicode.com/",
    "changeOrigin": true,
    "pathRewrite": { "^/api" : "" }
  }
}
```

## 3. 配置 users 路由
user-dashboard\src\router.js
```diff
+ import UserPage from './routes/UserPage';
    function RouterConfig({ history }) {
    return (
        <Router history={history}>
        <Switch>
            <Route path="/" exact component={IndexPage} />
+            <Route path="/users" exact component={UserPage} />
        </Switch>
        </Router>
    );
    }

```

user-dashboard\src\routes\UserPage.js
```diff
+ export default () => {
+    return (
+      <div>
+        Users Page
+      </div>
+    )
+  }
```

> http://localhost:8000/users

## 4. 构造 users model 和 service
src\models\users.js
```js
import * as userService from '../services/users';
export default {
    namespace:'users',
    state:{
        list:[],
        total:null
    },
    reducers:{
        save(state,{payload:{data:list,total}}){
              return {...state,list,total};  
        }
    },
    effect:{
        *query({payload:{page}},{call,put}){
            const {data,headers} = yield call(userService.query,{page});
            yield put({type:'save',payload:{data,total:headers['x-total-count']}});
        }
    },
    subscriptions:{
        setup({dispatch,history}){
            return history.listen(({pathname,query})=>{
                if(pathname == '/users'){
                    dispatch({type:'query',payload:query});
                }
            });
        }
    }
}
```

src\services\users.js
```js
import request from '../utils/request';

export function query({page=1}) {
  return request(`/api/users/_page=${page}&_limit=5`);
}
```

src\utils\request.js
```js
export default async function request(url, options) {
  const response = await fetch(url,options);
  checkStatus(response);
  const data = await response.json();
  const ret = {
    data,
    headers:{}
  }
  if(response.headers.get('x-total-count')){
    ret.headers['x-total-count'] = response.headers.get('x-total-count')
  }
  return ret;
}
```