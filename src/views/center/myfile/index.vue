<template>
	<div class="my-file">
		<div class="table-page-search-wrapper">
			<a-form layout="inline">
				<a-row>
					<a-col span="15">
						<div class="table-operator-area">
							<span>{{ $t('myfile.label.actions') }}</span>
							<a-button type="primary" :disabled="!hasSelected" :loading="loading"
								@click="handleCheckSpace(()=>{handleDownload(null)})">下载
							</a-button>
							<a-button type="primary" :disabled="!hasSelected" :loading="loading"
								@click="handleCheckSpace(()=>{handleDelete(null)})">
								删除
							</a-button>
							<a-button type="primary" :disabled="!hasSelected" :loading="loading"
								@click="handleCheckSpace(()=>{handleShare(null)})">分享
							</a-button>
							<a-button type="primary" :disabled="!hasSelected" :loading="loading"
								@click="handleCheckSpace(()=>{handleMoveTo(null)})">移动到
							</a-button>
							<a-button type="primary" @click="handleCheckSpace(()=>{handleNewFolder(null)})">新建文件夹
							</a-button>
						</div>
					</a-col>
					<a-col span="8">
						<a-form-item label="" style="width: 300px;margin-left: auto;margin-right: 0">
							<a-input class="input1" v-model.trim="queryParam.fileName"
								:placeholder="$t('myfile.input.search.tip')"
								@pressEnter="handleCheckSpace(()=>{handleSearch()})">
								<a-icon @click="handleCheckSpace(()=>{handleSearch()})" slot="suffix" type="search" />
							</a-input>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<!-- 面包屑导航 -->
		<div class="breadStyle">
			<a-breadcrumb-item href="" separator=">">
				<span @click="goBack()">返回上一级</span>
			</a-breadcrumb-item>
			<a-breadcrumb-item href="" separator=">">
				<span @click="handleAllFiles('/')">全部文件</span>
			</a-breadcrumb-item>
			<a-breadcrumb separator=">" :routes="routes">
				<template slot="itemRender" slot-scope="{route, routes, }">
					<span v-if="routes.indexOf(route) === routes.length - 1">
						{{route.breadcrumbName}}
					</span>
					<span v-else @click="breadClick(routes,route.breadcrumbName)" class="point2">
						{{route.breadcrumbName}}
					</span>
				</template>

			</a-breadcrumb>
		</div>

		<a-table ref="table" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectARow }"
			:columns="columns" :data-source="dataSource" :loading="loadingTable" :pagination="false"
			:scroll="{ y: 600 }">
			<template slot="fileName" slot-scope="text, record">
				<div v-if="record.fileName == ''">
					<a-input size="small" v-model="file_name_value"
						@blur="e => handleBlur(e.target.value, record.key)" />
					<!-- style="width: 149px;" 
						<a v-show="isSureOrCancel == true" @click="handleCheckSpace(()=>{sureNewFiles(record)})"><img
							style="width:20px;" src="~@/assets/download.png"></a>
					<a v-show="isSureOrCancel == true" @click="handleCheckSpace(()=>{cancelNewFiles(record)})"><img
							style="width:20px;" src="~@/assets/delete.png"></a> -->
				</div>
				<div v-if="record.uuid == u_uid">
					<a-input size="small" v-model="file_rename_value"
						@blur="e => handleRenameBlur(e.target.value, record.key)" />
				</div>
				<div v-else>
					<span class="point overflow" @click="handleOneLine(record)"
						v-if="record.addrType == 0">{{record.fileName}}</span>
					<span v-else class="overflow">{{record.fileName}}</span>
				</div>
			</template>

			<img slot="pic" style="width:20px;heigh:20px" slot-scope="text" :src=text />

			<span slot="action" slot-scope="text, record" id="action_items">
				<template>
					<a @click="handleCheckSpace(()=>{handleDownload(record)})"><img src="~@/assets/download.png"></a>
					<a @click="handleCheckSpace(()=>{handleDelete(record)})"><img src="~@/assets/delete.png"></a>
					<a @click="handleCheckSpace(()=>{handleShare(record)})"><img src="~@/assets/share.png"></a>
					<a-dropdown :trigger="['click']">
						<a id="action_more"><span class="action-more-i">。</span><span
								class="action-more-i">。</span><span>。</span></a>
						<a-menu slot="overlay">
							<a-menu-item>
								<a style="font-size:12px;font-weight:400;color:rgba(38,193,149,1);"
									@click="handleCheckSpace(()=>{handleCopyIpfs(record)})">{{ $t('myfile.table.more.copyIpfs') }}</a>
							</a-menu-item>
							<a-menu-item>
								<a style="font-size:12px;font-weight:400;color:rgba(38,193,149,1);"
									@click="handleCheckSpace(()=>{handleCopyDownloadUrl(record)})">{{ $t('myfile.table.more.copyDownloadUrl') }}</a>
							</a-menu-item>
							<a-menu-item>
								<a style="font-size:12px;font-weight:400;color:rgba(38,193,149,1);"
									@click="handleCheckSpace(()=>{handleRename(record)})">重命名</a>
							</a-menu-item>
						</a-menu>
					</a-dropdown>
				</template>
			</span>

		</a-table>

		<!-- 弹窗 -->
		<a-modal class="myfile-modal" :width="371" :visible="visible" :footer="null" :closable="false"
			:destroyOnClose="true">
			<div class="modal-title">
				{{ messageBox.title }}
			</div>
			<div class="modal-content">
				{{ messageBox.message }}
			</div>
			<div class="modal-button">
				<div v-if="messageBox.showCancel" class="button-item" @click="messageBox.cancel()">
					{{ messageBox.cancelText }}
				</div>
				<div v-if="messageBox.showOk" class="button-item" :style="messageBox.okStyle" @click="messageBox.ok()">{{
          messageBox.okText }}
				</div>
			</div>
		</a-modal>

		<a-modal class="myfile-modal" :width="371" :visible="sharePopup" :footer="null" :closable="false"
			:destroyOnClose="true">
			<div class="modal-title"> {{ messageShareBox.title }}</div>

			<div class="step_one" v-if="isStep">
				<div class="div1">
					<span>{{messageShareBox.left1}}:</span>
					<a-select default-value="seven" style="width: 120px" @change="selectChange">
						<a-select-option value="seven">7天</a-select-option>
						<a-select-option value="forever">永久</a-select-option>
					</a-select>
				</div>
				<div class="div1">
					<span>{{messageShareBox.left2}}:</span>
					<!-- 密码保护 -->
					<a-checkbox @change="checkboxChange"></a-checkbox>
				</div>
			</div>
			<div class="step_two" v-else>
				<div class="div1">
					<span>分享链接:</span>
					<span>{{shareUrl}}</span>
				</div>
				<div class="div1" v-show="isShowPassword">
					<span class="red">访问密码:</span>
					<span>{{passwodValue}}</span>
				</div>
				<div class="div1">链接{{selectValidity == 'seven'?'7天':'永久'}}有效</div>
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
import moment from 'moment'

import {
	getMyFileList, getFileList, deleteFiles, shareFilesFn,
	createFiles, renameFiles, shareIsPassFn, cancelShare, treeListFn, copyMoveFiles
} from '@/api/myfile'
import { mapActions, mapState } from 'vuex'
import { formatFileSize3 } from '@/utils/util'
import { getFileExtension } from '@/utils/extension'
import axios from 'axios'
import create from 'ant-design-vue/es/icon/IconFont'

export default {
	name: 'MyFile',
	components: {

	},

	data() {
		return {
			routes: [],
			domain: location.href,

			isSureOrCancel: true,
			file_name_value: '新建文件夹',
			file_rename_value: '',//重命名的value
			u_uid: '',
			uuid_Move: '',
			sharePopup: false,//分享弹窗窗口
			selectValidity: 'seven',// 有效期
			checkboxValue: 'public',//密码保护
			isShowPassword: false,//是否显示密码
			passwodValue: '',//密码的值
			shareUrl: '',
			share_id: '',
			isStep: true,
			treePopup: false,
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

			dataSource: [],
			columns: [
				{
					title: '',
					dataIndex: 'picurl',
					width: 35,
					scopedSlots: { customRender: 'pic' }
				},
				{
					title: '文件名称',
					dataIndex: 'fileName',
					ellipsis: true,
					width: '200px',
					scopedSlots: { customRender: 'fileName' },
				},
				{
					title: '文件大小',
					dataIndex: 'fileSize',
					align: 'center',
					customRender: (text, row, index) => formatFileSize3(text, 0, true, false),
				},
				{
					title: '上传日期',
					dataIndex: 'updateTime',
					align: 'center',
					customRender: (text, row, index) => moment(text).format('YYYY-MM-DD HH:mm'),
					sorter: (a, b) => {
						return Date.parse(b.updateTime) - Date.parse(a.updateTime)
					},
					defaultSortOrder: 'ascend', //descend
				},
				{
					title: '操作', //操作
					dataIndex: 'action',
					width: '150px',
					align: 'center',
					scopedSlots: { customRender: 'action' },
				}

			],
			selectedRowKeys: [], // 选中此处可配置默认列，选择一行的key值
			loading: false, //按钮的loading
			loadingTable: true,
			temporary: 0, //临时变量
			temporary2: 0, //临时变量

			dest: '', //选中移动文件的目的地
			destAllData: [],
			parentMovePath: '',//指定文件移动到哪里去
			breadcrAnotherPath: '', //另一个路径,点击面包屑传给后台的路径
			address: this.$store.getters.address,
			visible: false,
			// 查询参数s
			queryParam: {},
			// 加载数据方法 必须为 Promise 对象
			loadData: parameter => {
				const params = {
					'fileInfos': [{
						'publicKey': this.address,
						'parentPath': '/',
						// 'fileName': '',
					}]
				}
				// getFileList(params)
				// 	.then(res => {
				// 		return res.data
				// 	})

				// const requestParameters = Object.assign({}, parameter, this.queryParam)
				// return getFileList(requestParameters) //
				// 	.then(res => {
				// 		// let idx = (parameter.pageNo - 1) * parameter.pageSize + 1
				// 		// res.data.data.forEach(val => {
				// 		// 	val.key = idx++
				// 		// })
				// 		return res.data
				// 	})
			},

			selectedRows: []
		}
	},
	computed: {
		// 控制按钮的灰和亮
		hasSelected() {
			return this.selectedRowKeys.length > 0;
		},

		...mapState({
			allSize: (state) => state.user.totalSize,
			useSize: (state) => state.user.currentSize,
			isBought: (state) => state.user.buyCnt > 0
		}),
		messageBox: function () {
			return {
				title: this.$t('confirm.title'),
				message: '',
				okText: this.$t('confirm.ok'),
				cancelText: this.$t('confirm.cancel'),
				showOk: true,
				showCancel: true,
				okStyle: { color: 'rgba(38,193,149,1)' },
				ok: () => {
				},
				cancel: () => {
				},
				a_ok: () => {
				},
				a_cancel: () => {
				},
			}
		},
		messageShareBox: function () {
			return {
				title: '分享文件',
				message: '',
				okText: this.$t('confirm.ok'),
				cancelText: this.$t('confirm.cancel'),
				showOk: true,
				showCancel: true,
				okStyle: { color: 'rgba(38,193,149,1)' },
				left1: '',
				left2: '',
				a_ok: () => {
				},
				a_cancel: () => {
				},
			}
		},
		pagination: function () {
			return {
				defaultCurrent: 1,
				defaultPageSize: 10,
				style: { textAlign: 'center', float: 'none' },
				showTotal: function (total) {
					return this.$t('pagination.info.total', [total])
				}
			}
		},


	},
	mounted() {
		this.GetSpaceInfo().then(() => {
			this.handleCheckSpace(() => {
				this.handleSearch()
			})
		})
	},
	methods: {
		...mapActions(['GetSpaceInfo']),

		// 执行空间检测
		handleCheckSpace(handle) {
			if (this.allSize > 0 && this.allSize >= this.useSize) {
				handle && handle()
				return
			}
			let msg = ''
			if (this.allSize === 0) {
				msg = this.isBought ? this.$t('nospace.confirm.message1') : this.$t('nospace.confirm.message3')
			} else if (this.allSize < this.useSize) {
				msg = this.$t('nospace.confirm.message2')
			}
			Object.assign(this.messageBox, {
				okText: this.$t('nospace.confirm.gobuy'),
				cancelText: this.$t('nospace.confirm.cancel'),
				message: msg,
				showCancel: true,
				// okStyle: { color: 'rgba(38,193,149,1)' },
				ok: () => {
					this.visible = false
					this.$router.push('/buy')
				},
				cancel: () => {
					this.visible = false
					handle && handle()
				}
			})
			this.visible = true
		},
		// 执行检索
		handleSearch() {
			// this.$refs.table.refresh()
		},
		// 执行下载
		handleDownload(record) {
			let files = []
			if (record) {
				files.push(record)
			} else {
				if (this.selectedRows.length === 0) {
					Object.assign(this.messageBox, {
						okText: this.$t('confirm.ok'),
						message: this.$t('myfile.download.noFile.message'),
						showCancel: false,
						// okStyle: {},
						ok: () => {
							this.visible = false
						}
					})
					this.visible = true
					return
				}
				files = this.selectedRows
			}
			files.forEach(val => {
				const link = document.createElement('a')
				link.style.display = 'none'
				link.href = 'http://192.168.1.140:8080/ipfs/' + val.fileHash + '/?fileName=' + val.fileName
				link.target = '_blank'
				link.setAttribute('download', val.fileName)// 文件名
				document.body.appendChild(link)
				console.log(link)
				link.click()
				document.body.removeChild(link) // 下载完成移除元素
			})
			this.$message.destroy()
			this.$message.info(this.$t('myfile.download.finish.message'))
		},
		// 执行删除
		handleDelete(record) {
			let params = {}
			if (record) {
				params = {
					'publicKey': this.address,
					'vids': record.uuid
				}
				// params.fileInfos.push({ 'fileHash': record.fileHash, 'fileName': record.fileName })
			} else {
				if (this.selectedRows.length === 0) {
					Object.assign(this.messageBox, {
						okText: this.$t('confirm.ok'),
						message: this.$t('myfile.delete.noFile.message'),
						showCancel: false,
						// okStyle: {},
						ok: () => {
							this.visible = false
						}
					})
					this.visible = true
					return
				}
				let newVids = '';
				this.selectedRows.forEach(val => {
					newVids += val.uuid + ','
				})
				params = {
					'publicKey': this.address,
					'vids': newVids,
				}
			}
			Object.assign(this.messageBox, {
				message: this.$t('myfile.confirm.delete.message'),
				okText: this.$t('confirm.ok'),
				cancelText: this.$t('confirm.cancel'),
				showCancel: true,
				// okStyle: {},
				ok: () => {
					this.visible = false
					deleteFiles(params)
						.then(res => {
							this.$message.destroy()
							this.$message.info(this.$t('myfile.delete.finish.message'))
							this.GetSpaceInfo()
							this.handleSearch()
							this.listFn();
						})
				},
				cancel: () => {
					this.visible = false
				}
			})
			this.visible = true
		},
		// 拷贝哈希码
		handleCopyIpfs(record) {
			this.$copyText(record.fileHash).then(function (e) {
				// OK
			}, function (e) {
				//
			})
		},
		// 拷贝下载链接
		handleCopyDownloadUrl(record) {
			this.$copyText(record.downloadUrl + '?filename=' + record.fileName).then(function (e) {
				// OK
			}, function (e) {
				//
			})
		},
		// 选择下拉框
		selectChange(value) {
			this.selectValidity = value;
		},
		// 多选框按钮
		checkboxChange(e) {
			if (e.target.checked === true) {
				this.isShowPassword = true;
				this.checkboxValue = 'private';

				console.log(e.target.checked)
				console.log(this.checkboxValue)
			} else {
				this.isShowPassword = false;
				this.checkboxValue = 'public'
				console.log(e.target.checked)
				console.log(this.checkboxValue)
			}
		},
		// 分享文件
		handleShare(record) {
			this.sharePopup = true;
			this.isShowPassword = false;
			this.isStep = true;
			let params1 = {}

			Object.assign(this.messageShareBox, {
				okText: '创建链接',
				cancelText: '取消',
				showCancel: true,
				left1: '密码保护',
				left2: '有效期',
				a_ok: () => {
					if (record) {
						params1 = {
							'expiration': this.selectValidity,
							'flag': this.checkboxValue,
							'publicKey': this.address,
							'vids': record.uuid
						}
					} else {
						let newVids = '';
						this.selectedRows.forEach(val => {
							newVids += val.uuid + ','
						})
						params1 = {
							'expiration': this.selectValidity,
							'flag': this.checkboxValue,
							'publicKey': this.address,
							'vids': newVids
						}
					}
					// 创建分享链接
					shareFilesFn(params1)
						.then(res => {
							if (res.respCode == 1) {
								this.share_id = res.respData;
								this.isStep = false;
								if (this.share_id.indexOf(',') != -1) {
									this.shareUrl = document.domain + ':' + window.location.port + '/sharePage?' + this.share_id.split(',')[0];
									this.passwodValue = this.share_id.split(',')[1];
								} else {
									this.shareUrl = document.domain + ':' + window.location.port + '/sharePage?' + this.share_id;
								}

								Object.assign(this.messageShareBox, {
									okText: '复制链接',
									a_ok: () => {
										var shareBtn = '';
										if (this.checkboxValue == 'private') {
											shareBtn = '链接：' + this.shareUrl + '  访问密码：' + this.passwodValue
										} else {
											shareBtn = '链接：' + this.shareUrl
										}
										this.$copyText(shareBtn).then(function (e) {
											// OK
										}, function (e) {
											//
										})
										this.sharePopup = false;
										this.checkboxValue = 'public';
									},
									a_cancel: () => {
										this.sharePopup = false;
										this.checkboxValue = 'public';
										// 取消分享链接
										const params = {
											'publicKey': this.address,
											'vids': record.uuid
										}
										cancelShare(params).then(res => {

										})
									}
								})
							}
						})
				},
				a_cancel: () => {
					this.sharePopup = false;
					this.checkboxValue = 'public';
				}
			})
		},
		onSelectARow(selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = selectedRows;

		},
		// 按钮的效果
		start() {
			this.loading = false;
			setTimeout(() => {
				this.loading = true;
				this.selectedRowKeys = [];
			}, 1000);
		},
		// 列表接口
		listFn() {
			this.allFilesListFn(this.address, '/')
		},

		breadClick(record, value) {
			console.log(record)
			let newArr = [];
			let num = 0;
			for (let i = 0; i < this.routes.length; i++) {
				if (this.routes[i].breadcrumbName == value) {
					num = i;
				}
			}
			for (let i = 0; i <= num; i++) {
				newArr.push({
					breadcrumbName: this.routes[i].breadcrumbName
				})
			}

			this.routes = newArr;
			this.breadcrAnotherPath = '';
			for (let i = 0; i < newArr.length; i++) {
				this.breadcrAnotherPath += '/' + newArr[i].breadcrumbName
			}
			console.log(this.breadcrAnotherPath)
			this.allFilesListFn(this.address, this.breadcrAnotherPath)

		},

		// 全部文件按钮
		handleAllFiles(path) {
			this.routes = [];
			this.temporary2 = 0;
			this.allFilesListFn(this.address, path)
		},
		// 返回上一级
		goBack() {
			this.routes.pop()
			let newPath = '';
			for (let i = 0; i < this.routes.length; i++) {
				newPath += '/' + this.routes[i].breadcrumbName
			}
			if (this.routes.length == 0) {
				newPath = '/';
				this.temporary2 = 0;
			}
			console.log(newPath)
			this.allFilesListFn(this.address, newPath)


		},
		// 列表接口
		allFilesListFn(key, path) {
			const params = {
				'publicKey': key,
				'parentPath': path,
			}
			getMyFileList(params)
				.then(res => {
					this.loadingTable = false;
					this.dataSource = res.respMap.data
					for (let i = 0; i < this.dataSource.length; i++) {
						this.dataSource[i].key = i
						this.dataSource[i].picurl = getFileExtension(this.dataSource[i].fileName.split('.')[1])
						if (this.dataSource[i].addrType == 0) {
							this.dataSource[i].picurl = getFileExtension('folder')
						}
					}
				})
		},
		// 点击一行数据(可以打开文件夹的)
		handleOneLine(record) {
			if (record.parentPath == '/') {
				// this.routes = [];
				this.routes.push({
					breadcrumbName: record.fileName,
				})
			} else {
				this.routes.push({
					breadcrumbName: record.fileName,
				})
			}
			console.log(this.routes)

			let newPath = '';
			if (this.temporary2 == 0) {
				this.temporary2++;
				newPath = record.parentPath + record.fileName
			} else {
				newPath = record.parentPath + '/' + record.fileName
			}
			this.allFilesListFn(this.address, newPath)
		},

		//新建文件夹 
		handleNewFolder(key) {
			this.dataSource.unshift({
				key: '0A',
				fileName: '',
				fileSize: 0,
				updateTime: new Date(),
			});
			if (this.dataSource[0].fileName == '') {
				console.log(this.dataSource[0])

			} else {
				console.log('45')
			}

		},

		handleBlur(value, key, num) {
			const params = {
				'publicKey': this.address,
				'dirName': value,
				'parentPath': '/',
			}
			createFiles(params)
				.then(res => {
					// if (res.respData === '200') {
					this.listFn()
					// }
				})
		},
		// 确认新建文件
		// sureNewFiles() {
		// 	this.handleBlur()
		// },
		// // 取消新建文件
		// cancelNewFiles() {

		// },
		// 重命名
		handleRename(record) {
			this.u_uid = record.uuid;
			this.file_rename_value = record.fileName;
		},
		// 重命名框失去焦点事件
		handleRenameBlur() {
			const params = {
				'publicKey': this.address,
				'vid': this.u_uid,
				'newName': this.file_rename_value,
			}
			renameFiles(params).then(res => {
				// if (res.respData === '200') {
				this.listFn()
				// }
			})
		},
		// 移动到的弹窗口
		onTreeSelect(selectedKeys, info) {
			this.destAllData = info.node.dataRef;
		},
		onCheck(checkedKeys, info) {
			console.log('onCheck', checkedKeys, info);
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
			// console.log(this.uuid_Move)


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
							this.listFn();
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

	},
	created() {
		this.listFn()
	}
}
</script>

<style lang="less" >
.my-file {
	font-family: Microsoft YaHei;
	padding: 50px 40px 20px;

	.table-operator-area {
		button {
			margin-left: 10px;
		}
	}
	.table-page-search-wrapper .ant-form-inline .ant-form-item {
		margin-bottom: 10px;
	}
	/* 输入框*/
	.input1 input {
		background: rgba(225, 225, 225, 0.5);
		border-radius: 4px;
		height: 30px;
		line-height: 30px;
		color: rgba(51, 51, 51, 1);
	}
	.input1 input::-moz-placeholder {
		font-weight: 400;
		color: rgba(194, 198, 210, 1);
	}
	.input1 input:-ms-input-placeholder {
		font-weight: 400;
		color: rgba(194, 198, 210, 1);
	}
	.input1 input::-webkit-input-placeholder {
		font-weight: 400;
		color: rgba(194, 198, 210, 1);
	}

	/* 选择框*/
	.ant-checkbox-inner {
		width: 12px;
		height: 12px;
		border: 1px solid rgba(187, 187, 187, 1);
	}
	.ant-checkbox-wrapper:hover .ant-checkbox-inner,
	.ant-checkbox:hover .ant-checkbox-inner,
	.ant-checkbox-input:focus + .ant-checkbox-inner {
		border-color: rgba(187, 187, 187, 1);
	}
	.ant-checkbox-checked .ant-checkbox-inner {
		background-color: #ffffff;
		border-color: rgba(187, 187, 187, 1);
	}
	.ant-checkbox-checked::after {
		border-color: rgba(187, 187, 187, 1);
	}
	.ant-checkbox-inner::after {
		width: 7px;
		height: 10px;
		top: 45%;
		left: 10%;
		border-bottom-color: rgba(38, 193, 149, 1);
		border-right-color: rgba(38, 193, 149, 1);
	}
	.ant-checkbox-indeterminate .ant-checkbox-inner::after {
		top: 50%;
		left: 50%;
		width: 8px;
		height: 8px;
		background: rgba(38, 193, 149, 0);
	}
	/* 表格*/
	.ant-table-column-title {
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}

	.ant-table-thead > tr > th {
		background: #ffffff;
	}

	.ant-table-thead > tr > th,
	.ant-table-tbody > tr > td {
		padding: 11px 16px;
	}

	#action_items img {
		width: 17px;
		margin-right: 8px;
	}

	#action_more span {
		color: #333333;
		font-size: 12px;
	}

	#action_more .action-more-i {
		margin-right: -6px;
	}

	th[class*='ant-table-row-cell-ellipsis'] {
		// text-align: center;
	}
	.point {
		cursor: pointer;
	}
	.point3 {
		margin: 0 8px;
	}
	.point2:hover {
		cursor: pointer;
		color: #26c195;
	}
	.breadStyle {
		display: flex;
	}
	a {
		color: #26c195;
	}
	.ant-table-tbody .ant-table-row .overflow {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
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
		font-size: 14px;
		font-weight: bold;
		color: rgba(46, 50, 61, 1);
		text-align: center;
		padding: 14px 15px 32px;
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
	.div1 {
		padding: 15px 23px 0px;
	}
	.div1 span:first-child {
		display: inline-block;
		width: 60px;
		margin-right: 15px;
	}
	.div1:nth-child(3) {
		padding-bottom: 20px;
	}
	.step_one {
		padding-bottom: 20px;
	}
	.ant-checkbox:hover::after {
		visibility: hidden;
	}
	.ant-tree {
		padding: 0 28px;
		height: 260px;
		overflow-y: scroll;
	}
}
</style>
