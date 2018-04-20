import * as userService from '../services/users';
import qs from 'qs';
export default {
    namespace:'users',
    state:{
        list:[],
        total:null,
        page: null
    },
    reducers:{
        save(state,{payload:{users:list,total,page}}){
              return {...state,list,total,page};  
        }
    },
    effects:{
        *query({payload:{page}},{call,put}){
            const data=yield call(userService.query,{page});
            yield put({type:'save',payload:{...data,page:parseInt(page,10)}});
        },
        *remove({ payload: id }, { call, put, select }) {
            yield call(userService.remove, id);
            const page = yield select(state => state.users.page);
            yield put({ type: 'query', payload: { page } });
        },
        *patch({ payload: { id, values } }, { call, put, select }) {
            yield call(userService.patch, id, values);
            const page = yield select(state => state.users.page);
            yield put({ type: 'fetch', payload: { page } });
        }
    },
    subscriptions:{
        setup({dispatch,history}){
            return history.listen(function ({pathname,search}) {
                console.log('listen',arguments);
                if (pathname==='/users') {
                    console.log(qs.parse(search.slice(1)));
                    dispatch({type:'query',payload:qs.parse(search.slice(1))});
                }
            });
        }
    }
}