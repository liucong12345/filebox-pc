<template>
	<div>
		<!-- 1、添加一个页面的路由还没搞定
  2、先要npm i --save ant-design-vue
  再在main.js里面引入，就不会包未注册组件了
  树的目录是用ant直接可以用
 -->
		<!-- <a-tree-select
    style="width: 300px"
    :treeData="treeData"
    :value="value"
    v-model="title"
	@change="onChange"
    treeCheckable
    :showCheckedStrategy="SHOW_PARENT"
    searchPlaceholder='Please select'
  />
<a-tree-select
    v-model="title"
    style="width: 20%"
    :tree-data="treeData"
    tree-checkable
    :show-checked-strategy="SHOW_PARENT"
    placeholder="请点击展开"
	@check="onSelect"	
/> -->
		<button @click="buttonFn">确认选中了</button>
	</div>
	<!-- 
	1、tree-checkable 加这个是树的样式形状
	2、search-placeholder="Please select" 这个没测试出什么意思
	3、placeholder="请点击展开"
	4、画横线的写法tree-checkable与驼峰式写法一样的treeCheckable，没区别
	5、@select="onSelect" 选中复选框时执行的事件
	6、@change="onChange" 是有变化的时候都会执行change事件，而select
	是复选框的事件
-->

	<!-- <div class="main">
    <div class="card">
      <div class="left">
        <div class="logoDiv">
          <router-link to="/">
            <img src="~@/assets/logo.png" class="logo" alt="logo">
          </router-link>
        </div>
        <h2 class="title">{{ $t('login.left.header') }}</h2>
        <p v-html="$t('login.left.content')" class="content"></p>
      </div>
      <div class="right">
        <a class="back" @click="() => goBack()">{{ $t('login.back') }}</a>
        <div>
          <span class="loginTitleSpan">{{ $t('login') }}</span>
          <a-form-model ref="loginForm" :model="form" :rules="rules">
            <label id="keystoreLabel" class="label">{{ $t('login.keystore') }}</label>
            <a-form-model-item prop="keystore" class="keystoreItem">
              <a-textarea
                :placeholder="$t('login.keystore.placeholder')"
                :style="textareaStyle"
                v-model="form.keystore"
              />
            </a-form-model-item>
            <label id="passwordLabel" class="label">{{ $t('login.keystorepassword') }}</label>
            <a-form-model-item prop="password" class="passwordItem">
              <a-input-password
                @keyup.enter="handleSubmit"
                class="keystorepassword"
                :placeholder="$t('login.keystorepassword.placeholder')"
                :style="inputStyle"
                v-model="form.password"
              />
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="button">
          <a-button
            size="large"
            class="submit"
            :loading="onlogin"
            @click="handleSubmit">
            <span style="width: 72px;margin-left: 0 !important;">{{ $t('login.submit') }}</span>
          </a-button>
        </div>
        <div class="agreement">
          <span>{{ logininfo[0] }}<router-link class="link" to="/agreement">{{ logininfo[1] }}</router-link>{{ logininfo[2] }}<router-link
            class="link"
            to="/privacy">{{ logininfo[3] }}</router-link>{{ logininfo[4] }}</span>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import { TreeSelect } from 'ant-design-vue';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
export default {
	data() {
		return {
			value: [], //默认选中一个值
			title: [],
			treeData: [],
			shuArray: [],
			SHOW_PARENT,
			token: 'fjjjf'
		};
	},

	methods: {
		buttonFn() {
			console.log(this.title)
		},
		// onChange事件要接收一个value值
		onChange(isValue) {
			console.log('onChange ', isValue)
		},
		onSelect(selectedKeys, info) {
			console.log(selectedKeys) //选中的value值
			console.log(info); //所有属性
			console.log(info.eventKey) //选中的key值
			// console.log(info.value) //选中的value值
			console.log(info.title) //这个可以直接打印自己想要的参数，title可以是任何自定义的参数
		},
		a() {
			this.shuArray = [
				{
					one: '中国',
					value: '中国的value值',
					key: '中国的key值',
					children: [
						{
							title: '深圳',
							value: '深圳的value', //默认选中一个值，这个title是Child Node1
							key: '深圳的key', //数据的value和key值都要是唯一的，有一个不是唯一数据会报错
						},
						{
							title: 'Child Node2',
							value: '0-0-2',
							key: '0-0-2',
						},
					],
				},
				{
					one: '美国',
					value: '美国的value值',
					key: '美国的key值',
					children: [
						{
							title: '深圳',
							value: '美国-深圳的value',
							key: '美国-深圳的key',
						},
						{
							title: 'Child Node4',
							value: '0-1-1',
							key: '0-1-1',
							disabled: true,
						},
						{
							title: 'Child Node5',
							value: '0-1-2',
							key: '0-1-2',
						},

					],
				},
				{
					one: '法国',
					value: '法国的value',
					key: '0-3',
					children: [
						{
							title: 'Child Node3',
							value: '0-3-1',
							key: '0-3-1',
							children: [{
								title: '法国的国家',
								value: '0-3-33',
								key: '0-3-33',
							}, {
								title: 'Child Node3-4',
								value: '0-3-44',
								key: '0-3-44',
							}]
						},
					],
				},
			];
			// for(let i=0; i<this.shuArray.length; i++){
			// 	for(let j=0; j<this.shuArray[i].son.length; j++){
			// 		this.treeData.push(
			// 			{
			// 				title:this.shuArray[i].one,
			// 				value:this.shuArray[i].value,
			// 				key:this.shuArray[i].key,
			// 				children:this.shuArray[i].son[j]
			// 			}
			// 		)
			// 	}
			// }
			// console.log(this.treeData) //这个数据拿到太晚了，页面会报错的
			// console.log(88) //这个数据拿到太晚了，页面会报错的
			// 1、写到这里，我不知道后面还有没有son子级了。所以要用递归
			// 2、之前与后台商量的是，通过点击去请求接口是否有子级。（这个也不行，
			// 得在这一级就告诉我是否有子级，我根据一个参数判断是否是有子级，我显示尖尖的三角形出来）
			// 3、我还得给每一个添加点击事件，太难了
			// 4、自己用js写一个树目录出来，层级无控制的
		},
		toTree(data) {
			// 删除 所有 children,以防止多次调用
			// data.forEach(function (item) {
			//     delete item.children;
			// });

			// 将数据存储为 以 id 为 KEY 的 map 索引数据列
			var map = {};
			data.forEach(function (item) {
				console.log(item)
				map[item.key] = item;
			});
			//console.log(map);
			var val = [];
			data.forEach(function (item) {
				// 以当前遍历项，的pid,去map对象中找到索引的id
				var parent = map[item.value];
				console.log(parent)
				// 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
				if (parent) {
					(parent.children || (parent.children = [])).push(item);
				} else {
					//如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
					val.push(item);
				}
			});
			console.log(val)
			return val;
		}




	},
	created() {
		this.a();
		this.toTree(this.shuArray)
		cookies.setItem('token', this.token, 1000)
		cookies.getItem('token')

	}
};



  // import { mapActions } from 'vuex'
  // import { build } from '@/utils/keyStore'
  // import bs58 from 'bs58'

  // export default {
  //   name: 'Login',
  //   data () {
  //     return {
  //       form: {
  //         keystore: '',
  //         password: ''
  //       },
  //       onlogin: false,
  //       textareaStyle: {
  //         resize: 'none',
  //         width: '440px',
  //         height: '105px',
  //         padding: '21px 10px'
  //       },
  //       inputStyle: {
  //         width: '440px',
  //         height: '44px'
  //       }
  //     }
  //   },
  //   computed: {
  //     logininfo () {
  //       return this.$t('login.logininfo').split(',')
  //     },
  //     rules () {
  //       return {
  //         keystore: [
  //           { required: true, message: this.$t('login.validate.keystore.blank'), trigger: 'blur' }
  //         ],
  //         password: [
  //           { required: true, message: this.$t('login.validate.password.blank'), trigger: 'blur' }
  //         ]
  //       }
  //     }
  //   },
  //   methods: {
  //     ...mapActions(['Login']),
  //     handleSubmit () {
  //       this.$refs.loginForm.validate(async valid => {
  //         if (valid) {
  //           this.onlogin = true
  //           let { keystore } = this.form
  //           keystore = keystore.replace('Crypto', 'crypto')
  //           const { password } = this.form
  //           const { Login } = this
  //           const result = await build({ keystore, password })
  //           if (!result) {
  //             this.$message.error({ content: this.$t('login.validate.keystore.error'), key: 'password' })
  //             this.onlogin = false
  //           } else {
  //             const hex = result.getAddress().toString('hex')
  //             const bytes = []
  //             for (let i = 0; i < hex.length; i++) {
  //               bytes.push(hex[i].charCodeAt(0))
  //             }
  //             const address = bs58.encode(bytes)
  //             Login({ address, keystore })
  //               .then(() => {
  //                 if (this.$router.currentRoute.query.redirect) {
  //                   this.$router.push(this.$router.currentRoute.query.redirect)
  //                 } else {
  //                   this.$router.push('/center')
  //                 }
  //               })
  //               .finally(() => {
  //                 this.onlogin = false
  //               })
  //           }
  //         }
  //       })
  //     },
  //     goBack () {
  //       this.$router.push('/')
  //     }
  //   }
  // }
</script>

<style lang="less" scoped>
// .main {
//   text-align: center;
//   min-height: 100%;
//   background-image: url("~@/assets/login-background.png");
//   background-color: #072d41;
//   padding: 185px 0;
// }

// .flex-box {
//   align-items: stretch;
// }

// .card {
//   display: inline-flex;
//   flex-direction: row;
//   width: 942px;
//   height: 530px;

//   .left {
//     display: inline-block;
//     width: 423px;
//     background-color: #fff;
//     height: 100%;
//     position: relative;

//     .logoDiv {
//       position: absolute;
//       top: 49px;
//       left: 40px;
//       text-align: left;

//       .logo {
//         width: 38px;
//       }
//     }

//     .title {
//       display: inline;
//       position: absolute;
//       top: 123px;
//       left: 162px;
//       color: #2E323D;
//       font-size: 18px;
//     }

//     .content {
//       position: absolute;
//       top: 184px;
//       left: 40px;
//       text-align: left;
//       line-height: 48px;
//       color: #2E323D;
//       font-size: 14px;
//     }
//   }

//   .right {
//     flex-grow: 1;
//     background-color: #f0f6fe;
//     height: 100%;
//     position: relative;

//     .loginTitleSpan {
//       position: absolute;
//       top: 49px;
//       left: 39px;
//       color: #26C195;
//       font-size: 25px;
//     }

//     .back {
//       position: absolute;
//       top: 59px;
//       left: 434px;
//       color: #26C195;
//       font-size: 14px;

//       &:hover {
//         color: lighten(#26C195, 10%);
//       }
//     }

//     #keystoreLabel {
//       position: absolute;
//       top: 124px;
//       left: 40px;
//       margin: 0;
//       font-size: 16px;
//       font-weight: bold;
//       color: #2E323D;
//     }

//     .keystoreItem {
//       position: absolute;
//       top: 152px;
//       left: 39px;
//       text-align: left;
//     }

//     #passwordLabel {
//       position: absolute;
//       top: 280px;
//       left: 40px;
//       margin: 0;
//       font-size: 16px;
//       font-weight: bold;
//       color: #2E323D;
//     }

//     .passwordItem {
//       position: absolute;
//       top: 312px;
//       left: 39px;
//       text-align: left;
//     }

//     .button {
//       position: absolute;
//       top: 390px;
//       margin: 0;
//       width: 100%;
//       text-align: center;

//       .submit {
//         color: #fff;
//         background-color: #26C195;
//         width: 112px;
//         height: 44px;
//         border: none;
//         border-radius: 4px;

//         &:hover {
//           background-color: lighten(#26C195, 10%);
//         }
//       }
//     }

//     .agreement {
//       position: absolute;
//       top: 468px;
//       left: 40px;
//       text-align: left;
//       font-size: 12px;
//       color: #ACAFBB;

//       .link {
//         color: #26C195;
//         text-decoration: underline;
//         margin: 0 2px;

//         &:hover {
//           color: lighten(#26C195, 10%);
//         }
//       }
//     }
//   }
// }
</style>
