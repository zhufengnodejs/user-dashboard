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