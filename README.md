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

## 5. 添加界面，让用户列表展现出来
src\components\Users.css
```js
.normal{

}
.operation a{
    margin:0 .5em;
}
```

src\components\Users.js
```js
import {connect} from 'dva';
import {Table,Pagination,Popconfirm} from 'antd';
import styles from './Users.css';
import {PAGE_SIZE} from '../constants';
console.log(styles);
function Users({list:dataSource,total,page:current}){
  function handleDelete(id){
   console.warn(`TODO: ${id}`);
  }

  const columns = [
      {
          title:'Name',
          dataIndex:'name',
          key:'name',
          render:text=><a href="">{text}</a>
      },
      {
        title:'Email',
        dataIndex:'email',
        key:'email'
      },
      {
        title:'Website',
        dataIndex:'website',
        key:'website'
      },
      {
        title:'Operation',
        key:'operation',
        render:(text,{id})=>{
            <span className={styles.operation}>
                <a href="">编辑</a>
                <Popconfirm title="确定删除吗?" onConfirm={()=>handleDelete(id)}>
                    <a href="">删除</a>
                </Popconfirm>
            </span>
        }
      }
  ]
  return (
      <div className={styles.normal}>
        <div>
            <Table
              columns={columns}
              dataSource={dataSource}
              rowKey={record=>record.id}
              pagination={false}
            />
            <Pagination
              className="ant-table-pagination"
              total={total}
              current={current}
              pageSize={PAGE_SIZE}
            />
        </div>
      </div>
  )
}

function mapStateToProps(state){
  const {list,total,page} = state.users;
  return {
      list,
      total,
      page
  }
}
export default connect(mapStateToProps)(Users);
```

src\constants.js
```js
export const PAGE_SIZE = 3;
```

src\models\users.js
```js
import * as userService from '../services/users';
export default {
    namespace:'users',
    state:{
        list:[],
        total:null,
        page:null
    },
    reducers:{
        save(state,{payload:{data:list,total,page}}){
              return {...state,list,total,page};  
        }
    },
    effects:{
        *query({payload},{call,put}){
            console.log('query',payload);
            const {data,headers} = yield call(userService.query,{page:1});
            yield put({type:'save',payload:{data,total:parseInt(headers['x-total-count'],10),page:parseInt(1,10)}});
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

src\routes\UserPage.js
```js
import Users from '../components/Users';
export default () => {
    return (
      <div>
       <Users/>
      </div>
    )
  }
```

src\services\users.js
```js
import request from '../utils/request';

export function query({page=1}) {
  return request(`/users?_page=${page}&_limit=5`);
}

```


## 6.  添加 layout
