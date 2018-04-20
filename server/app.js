const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(function (req,res,next) {
	if (req.method=='OPOTIONS') {
		res.setHeader('Access-Control-Allow-Methods',"GET,POST,DELETE,PATCH");
		res.end();
	} else {
		next();
	}
});
let users=[
	{id: 1,name: '张三',email: 'zhangsan@126.com',website: "zhangsan.org"},
	{id: 2,name: '李四',email: 'lisi@126.com',website: "lisi.org"},
	{id: 3,name: '王五',email: 'wangwu@126.com',website: "wangwu.org"},
	{id: 4,name: '赵六',email: 'zhaoliu@126.com',website: "zhaoliu.org"},
	{id: 5,name: '陈七',email: 'chenqi@126.com',website: "chenqi.org"},
	{id: 6,name: '王八',email: 'wangba@126.com',website: "wangba.org"},
]
app.get('/users',function (req,res) {
	let {_page=1,_limit=3}=req.query;
	let start=(_page-1)*_limit;
	res.json({users:users.slice(start,start+_limit),total:users.length});
});

app.delete('/users/:id',function (req,res) {
	let id=req.params.id;
	users = users.filter(user => user.id!=id);
	res.json({});
});

app.listen(9000);