import {connect} from 'dva';
import {Table,Pagination,Popconfirm} from 'antd';
import styles from './Users.css';
import {PAGE_SIZE} from '../constants';
import {routerRedux} from 'dva/router';
function Users({dispatch,list:dataSource,total,page:current}){
  function handleDelete(id){
    dispatch({
      type: 'users/remove',
      payload: id,
    });
  }

  function handlePageChange(page){
    dispatch(routerRedux.push({
      path:'/users',
      query:{page}
    }));
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
        render:(text,{id})=>(
            <span className={styles.operation}>
                <a href="">编辑</a>
                <Popconfirm title="确定删除吗?" onConfirm={()=>handleDelete(id)}>
                    <a href="">删除</a>
                </Popconfirm>
            </span>
        )
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
              onChange={handlePageChange}
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