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