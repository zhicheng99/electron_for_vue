import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'tiktok',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '张某某'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1),
		num: Mock.Random.guid(), 
		positionNum:Mock.Random.guid(),
		startTime:Mock.Random.date(),
		endTime:Mock.Random.date(),
		during:Mock.Random.guid(),
		price:Mock.Random.guid(),
		payWay: Mock.Random.integer(0, 1),
		isPay: Mock.Random.integer(0, 1)
  }));
}

 



export { LoginUsers, Users };
