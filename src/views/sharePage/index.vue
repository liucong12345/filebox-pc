<template>
	<div class="wrapper">
		<div class="innerBox" v-if="isSuccess">
			<ul>
				<li>
					<div>
						<img src="~@/assets/icons/file2.png"><span>{{data.fileName}}</span>
						<p>{{data.createTime}}     </p>
					</div>
					<div>
						<a-button type="primary" size="large">下载 </a-button>
						<a-button type="primary" size="large" @click="saveTo">保存到云盘</a-button>
					</div>
				</li>
			</ul>
			<div class="tips">
				<div>
					<img src="~@/assets/icons/file2.png">
					<p>文件大小：{{fileSize}}</p>
				</div>
			</div>
		</div>
		<a-modal class="myfile-modal" :visible="loginPopup" :footer="null" :closable="false" :destroyOnClose="true">
			<div class="right" style="height:600px">
				<a class="back" @click="() => goBack()">{{ $t('login.back') }}</a>
				<div>
					<span class="loginTitleSpan">{{ $t('login') }}</span>
					<!-- 如果需要为包装组件实例维护一个 ref，可以使用wrappedComponentRef。 -->
					<a-form-model ref="loginForm" :model="form" :rules="rules">
						<label id="keystoreLabel" class="label">{{ $t('login.keystore') }}</label>
						<a-form-model-item prop="keystore" class="keystoreItem">
							<a-textarea :placeholder="$t('login.keystore.placeholder')" :style="textareaStyle"
								v-model="form.keystore" />
						</a-form-model-item>
						<label id="passwordLabel" class="label">{{ $t('login.keystorepassword') }}</label>
						<a-form-model-item prop="password" class="passwordItem">
							<a-input-password @keyup.enter="handleSubmit" class="keystorepassword"
								:placeholder="$t('login.keystorepassword.placeholder')" :style="inputStyle"
								v-model="form.password" />
						</a-form-model-item>
					</a-form-model>
				</div>
				<div class="button">
					<a-button size="large" class="submit" :loading="onlogin" @click="handleSubmit">
						<span style="width: 72px;margin-left: 0 !important;">{{ $t('login.submit') }}</span>
					</a-button>
				</div>
				<div class="agreement">
					<span>{{ logininfo[0] }}<router-link class="link" to="/agreement">{{ logininfo[1] }}</router-link>
						{{ logininfo[2] }}<router-link class="link" to="/privacy">{{ logininfo[3] }}</router-link>
						{{ logininfo[4] }}</span>
				</div>
			</div>
		</a-modal>

		<a-modal class="myfile-modal" :width="371" :visible="visible" :footer="null" :closable="false"
			:destroyOnClose="true">
			<div class="modal-title">
				{{ messageShareBox.title }}
			</div>
			<div class="modal-content">
				<a-input type="password" placeholder="密码" v-model="lockPassword"></a-input>
				<p>{{ messageShareBox.message }}</p>
			</div>
			<div class="modal-button">
				<div v-if="messageShareBox.showCancel" class="button-item" @click="messageShareBox.a_cancel()">
					{{ messageShareBox.cancelText }}
				</div>
				<div v-if="messageShareBox.showOk" class="button-item" :style="messageShareBox.okStyle"
					@click="messageShareBox.a_ok()">{{
          messageShareBox.okText }}
				</div>
			</div>
		</a-modal>

		<a-modal class="myfile-modal" :width="450" :visible="treePopup" :footer="null" :closable="false"
			:destroyOnClose="true">
			<div class="modal-title">
				{{ messageShareBox.title }}
			</div>
			<a-tree :load-data="onLoadData" :tree-data="treeData" show-icon @select="onTreeSelect">
				<!-- <a-icon slot="smile" type="smile-o" /> -->
				<img src="~@/assets/icons/folder.png" slot="smile" style="width:18px;height:16px;">
				<template slot="custom" slot-scope="{ selected }">
					<a-icon :type="selected ? 'frown' : 'frown-o'" />
				</template>
			</a-tree>
			<div class="modal-button">
				<div v-if="messageShareBox.showCancel" class="button-item" @click="messageShareBox.a_cancel()">
					{{ messageShareBox.cancelText }}
				</div>
				<div v-if="messageShareBox.showOk" class="button-item" :style="messageShareBox.okStyle"
					@click="messageShareBox.a_ok()">{{
          messageShareBox.okText }}
				</div>
			</div>
		</a-modal>

	</div>
</template>
<script>
import {
	shareIsPassFn, shareInPage, verifyklock, getvinfo, getMyFileList, treeListFn, copyMoveFiles
} from '@/api/myfile'
import { formatFileSize3 } from '@/utils/util'
import { mapActions } from 'vuex'
import { build } from '@/utils/keyStore'
import bs58 from 'bs58'

export default {
	data() {
		return {
			address: this.$store.getters.address,
			visible: true,
			Lock: '',
			lockPassword: '',
			data: '',
			fileSize: '',
			isSuccess: false,
			loginPopup: false,
			shareId: '',

			treePopup: false,
			uuid_Move: '',
			dest: '', //选中移动文件的目的地
			selectedRows: [],
			temporary: 0, //临时变量
			treeData: [
				{
					title: 'Expand to load',
					key: '0',

				},
				{
					title: '可iiii',
					key: '0s',
				},
				{ title: 'Expand to load', key: '1', isLeaf: true },
				{ title: 'Tree Node', key: '2', isLeaf: true },
			],


			form: {
				keystore: '',
				password: ''
			},
			onlogin: false,
			textareaStyle: {
				resize: 'none',
				width: '440px',
				height: '105px',
				padding: '21px 10px'
			},
			inputStyle: {
				width: '440px',
				height: '44px'
			}
		}
	},
	computed: {
		messageShareBox: function () {
			return {
				title: '请输入访问密码',
				message: '*密码区分大小写',
				okText: this.$t('confirm.ok'),
				cancelText: this.$t('confirm.cancel'),
				showOk: true,
				showCancel: true,
				okStyle: { color: 'rgba(38,193,149,1)' },
				a_ok: () => {
				},
				a_cancel: () => {
				},
			}
		},

		logininfo() {
			return this.$t('login.logininfo').split(',')
		},
		rules() {
			return {
				keystore: [
					{ required: true, message: this.$t('login.validate.keystore.blank'), trigger: 'blur' }
				],
				password: [
					{ required: true, message: this.$t('login.validate.password.blank'), trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		...mapActions(['Login']),
		handleSubmit() {
			this.$refs.loginForm.validate(async valid => {
				if (valid) {
					this.onlogin = true
					let { keystore } = this.form
					keystore = keystore.replace('Crypto', 'crypto')
					const { password } = this.form
					const { Login } = this
					const result = await build({ keystore, password })
					if (!result) {
						this.$message.error({ content: this.$t('login.validate.keystore.error'), key: 'password' })
						this.onlogin = false
					} else {
						const hex = result.getAddress().toString('hex')
						const bytes = []
						for (let i = 0; i < hex.length; i++) {
							bytes.push(hex[i].charCodeAt(0))
						}
						const address = bs58.encode(bytes)
						Login({ address, keystore })
							.then(() => {
								if (this.$router.currentRoute.query.redirect) {
									this.$router.push(this.$router.currentRoute.query.redirect)
								} else {
									this.loginPopup = false;
									this.step()
								}
							})
							.finally(() => {
								this.onlogin = false
							})
					}
				}
			})
		},
		goBack() {
			this.$router.push('/')
		},
		saveTo() {
			if (this.address == '') {
				this.loginPopup = true;
			} else {
				this.handleMoveTo()
			}
		},
		saveToFn() {
			const params = {
				dest: '',
				lockPassword: this.lockPassword,
				publicKey: this.address,
				shareId: this.shareId,
			}
			shareInPage(params).then(res => {

			})
		},
		onSelectARow(selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = selectedRows;
		},
		// 移动到的弹窗口
		onTreeSelect(selectedKeys, info) {
			this.destAllData = info.node.dataRef;
		},
		// 移动到
		handleMoveTo() {
			const params = {
				'publicKey': this.address,
				'parentPath': '/',
				'fileName': '',
			}
			treeListFn(params).then(res => {
				this.treePopup = true;
				this.treeData = res.respMap.data
				for (let i = 0; i < this.treeData.length; i++) {
					this.treeData[i].title = this.treeData[i].fileName
					this.treeData[i].key = i
					this.treeData[i].slots = { icon: 'smile' }
					if (this.treeData[i].dir_empty == 0) {
						this.treeData[i].isLeaf = true
					}
				}
			})

			this.uuid_Move = '';
			for (let i = 0; i < this.selectedRows.length; i++) {
				this.uuid_Move = this.uuid_Move + this.selectedRows[i].uuid + ','
			}
			console.log(this.uuid_Move)


			Object.assign(this.messageShareBox, {
				title: '保存到云盘',
				a_ok: () => {
					if (this.destAllData.dir_empty == 0) {
						if (this.destAllData.parentPath == '/') {
							this.dest = this.destAllData.parentPath + this.destAllData.fileName
							console.log(this.dest)
						} else {
							this.dest = this.destAllData.parentPath + '/' + this.destAllData.fileName
							console.log(this.dest)
						}
					} else {
						this.dest = this.destAllData.parentPath + '/' + this.destAllData.fileName
						console.log(this.dest)
					}
					const params1 = {
						'publicKey': this.address,
						'vids': this.uuid_Move,
						'dest': this.dest, //目的地
						'opera': 'moveOK',
					}
					// 移动到接口
					copyMoveFiles(params1)
						.then(res => {
							this.treePopup = false;
						})
				},
				a_cancel: () => {
					this.treePopup = false;
				}
			})
		},
		onLoadData(treeNode) {
			console.log(treeNode)
			return new Promise(resolve => {
				if (treeNode.dataRef.children) {
					resolve();
					return;
				}
				let request = {};
				if (this.temporary == 0) {
					this.temporary++;
					request = {
						'publicKey': this.address,
						'parentPath': treeNode.dataRef.parentPath + treeNode.dataRef.fileName,
					}
					console.log(request)
				} else {
					request = {
						'publicKey': this.address,
						'parentPath': treeNode.dataRef.parentPath + '/' + treeNode.dataRef.fileName,
					}
					console.log(request)
				}
				treeListFn(request).then(res => {
					treeNode.dataRef.children = res.respMap.data
					for (let i = 0; i < treeNode.dataRef.children.length; i++) {
						treeNode.dataRef.children[i].title = treeNode.dataRef.children[i].fileName
						treeNode.dataRef.children[i].key = `${treeNode.eventKey}-` + i
						treeNode.dataRef.children[i].slots = { icon: 'smile' }
						if (treeNode.dataRef.children[i].dir_empty == 0) {
							treeNode.dataRef.children[i].isLeaf = true;
						}
					}
					console.log(treeNode.dataRef.children)
				})

				setTimeout(() => {
					this.treeData = [...this.treeData];
					resolve();
				}, 1000);
			});
		},


		step() {
			this.shareId = '';
			if (location.href.indexOf('?')) {
				this.shareId = location.href.split('?')[1];
			}

			shareIsPassFn({ shareId: this.shareId }).then(res => {
				if (res.respCode == 1) {
					this.Lock = res.respData;
					Object.assign(this.messageShareBox, {
						title: '请输入访问密码',
						message: '*密码区分大小写 ',
						// showCancel: true,
						showOk: true,
						showCancel: true,
						a_ok: () => {
							verifyklock({ lockPassword: this.lockPassword, shareId: this.shareId }).then(res => { //有验证码,对了之后再请求列表
								if (res.respCode == 1) {
									getvinfo({ lockPassword: this.lockPassword, shareId: this.shareId }).then(res => {
										if (res.respCode == 1) {
											if (res.respMap.data[0].addrType == 1) { //1是文件，0是文件夹
												this.data = res.respMap.data[0]
												this.fileSize = formatFileSize3(this.data.fileSize, 0, true, false)
												this.isSuccess = true;
												this.visible = false
												return
											} else if (res.respMap.data[0].addrType == 0) {
												const params = {
													'publicKey': this.address,
													'parentPath': res.respMap.data[0].parentPath + res.respMap.data[0].fileName,
												}
												getMyFileList(params).then(res => {
													this.data = res.respMap.data[0]
													this.fileSize = formatFileSize3(this.data.fileSize, 0, true, false)
													this.isSuccess = true;
													this.visible = false
												})
											}


										} else {
											this.$message.error('提取码错误')
											this.visible = true
										}
									})
								} else {
									this.$message.error('提取码错误')
									this.visible = true
								}
							})
						},
						a_cancel: () => {
							this.visible = false
						}
					})
				}
			})
		},





	},
	created() {
		this.step();
	}
}
</script>
<style lang="less" >
.wrapper {
	width: 900px;
	height: 100vh;
	margin: 20px auto;
	border: 15px solid #fff;
	.innerBox {
		ul {
			padding: 0;
			li {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 100px;
				background: #fff;
				margin-bottom: 10px;
				div:first-child {
					img {
						width: 22px;
					}
					span {
						font-size: 16px;
						font-weight: bold;
						margin-left: 16px;
					}
					p {
						margin-left: 38px;
					}
				}
				div:last-child {
					.ant-btn {
						margin-left: 20px;
					}
					.ant-btn:first-child {
						span {
							padding: 0 10px;
						}
					}
				}
			}
		}
		.tips {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 600px;
			text-align: center;
			div {
				width: 150px;
				img {
					width: 45px;
					margin-bottom: 10px;
				}
			}
		}
	}
}
.right {
	flex-grow: 1;
	background-color: #f0f6fe;
	height: 100%;
	position: relative;

	.loginTitleSpan {
		position: absolute;
		top: 49px;
		left: 39px;
		color: #26c195;
		font-size: 25px;
	}

	.back {
		position: absolute;
		top: 59px;
		left: 434px;
		color: #26c195;
		font-size: 14px;

		&:hover {
			color: lighten(#26c195, 10%);
		}
	}

	#keystoreLabel {
		position: absolute;
		top: 124px;
		left: 40px;
		margin: 0;
		font-size: 16px;
		font-weight: bold;
		color: #2e323d;
	}

	.keystoreItem {
		position: absolute;
		top: 152px;
		left: 39px;
		text-align: left;
	}

	#passwordLabel {
		position: absolute;
		top: 280px;
		left: 40px;
		margin: 0;
		font-size: 16px;
		font-weight: bold;
		color: #2e323d;
	}

	.passwordItem {
		position: absolute;
		top: 312px;
		left: 39px;
		text-align: left;
	}

	.button {
		position: absolute;
		top: 390px;
		margin: 0;
		width: 100%;
		text-align: center;

		.submit {
			color: #fff;
			background-color: #26c195;
			width: 112px;
			height: 44px;
			border: none;
			border-radius: 4px;

			&:hover {
				background-color: lighten(#26c195, 10%);
			}
		}
	}

	.agreement {
		position: absolute;
		top: 468px;
		left: 40px;
		text-align: left;
		font-size: 12px;
		color: #acafbb;

		.link {
			color: #26c195;
			text-decoration: underline;
			margin: 0 2px;

			&:hover {
				color: lighten(#26c195, 10%);
			}
		}
	}
}
.myfile-modal {
	font-family: Microsoft YaHei;

	.ant-modal-body {
		padding: 0;
	}

	.modal-title {
		font-size: 16px;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
		text-align: center;
		padding-top: 29px;
	}

	.modal-content {
		input {
			width: 100%;
			margin-bottom: 5px;
		}
		font-size: 14px;
		color: #c2c6d2;
		width: 70%;
		margin: 0 auto;
		padding: 18px 15px 10px;
	}

	.modal-button {
		font-size: 14px;
		font-weight: 400;
		color: rgba(46, 50, 61, 1);
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top: 1px solid rgba(229, 229, 229, 1);
	}

	.button-item {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		flex-direction: column;
		flex: 1;
		text-align: center;
		padding: 20px 0;
		cursor: pointer;
		border-left: 1px solid rgba(229, 229, 229, 1);

		&:first-child {
			border-left: 0;
		}
	}
}
</style>