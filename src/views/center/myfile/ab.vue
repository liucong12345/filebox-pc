<template>
	<div class="my-file">
		<div class="table-page-search-wrapper">
			<a-form layout="inline">
				<a-row>
					<a-col span="15">
						<div class="table-operator-area">
							<span>{{ $t('myfile.label.actions') }}</span>
							<a-button type="primary" @click="handleCheckSpace(()=>{handleDownload(null)})">{{
                $t('myfile.button.download') }}
							</a-button>
							<a-button type="primary" @click="handleCheckSpace(()=>{handleDelete(null)})">
								{{ $t('myfile.button.del')}}</a-button>
							<a-button type="primary" @click="handleCheckSpace(()=>{handleShare(null)})">分享</a-button>
							<a-button type="primary" @click="handleCheckSpace(()=>{handleDelete(null)})">移动到</a-button>
							<a-button type="primary" @click="handleCheckSpace(()=>{handleNewFolder(null)})">新建文件夹
							</a-button>
						</div>
					</a-col>
					<a-col span="8">
						<a-form-item label="" style="width: 300px;margin-left: auto;margin-right: 0">
							<a-input v-model.trim="queryParam.fileName" :placeholder="$t('myfile.input.search.tip')"
								@pressEnter="handleCheckSpace(()=>{handleSearch()})">
								<a-icon @click="handleCheckSpace(()=>{handleSearch()})" slot="suffix" type="search" />
							</a-input>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<!-- showPagination="auto" :pagination="pagination" -->
		<s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false"
			:rowSelection="rowSelection" :showPagination="false" :pagination="pagination" :isInitWithCreate="false"
			:isChangePageClearSelection="true" :locale="{emptyText: $t('myfile.nodata')}">
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
						</a-menu>
					</a-dropdown>
				</template>
			</span>
		</s-table>
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
	</div>
</template>
<script>
import moment from 'moment'
import { STable } from '@/components'
import { getMyFileList, getFileList, deleteFiles, shareFilesFn, } from '@/api/myfile'
import { mapActions, mapState } from 'vuex'
import { formatFileSize3 } from '@/utils/util'
import axios from 'axios'

export default {
	name: 'MyFile',
	components: {
		STable
	},
	data() {
		return {
			address: this.$store.getters.address,
			visible: false,
			// 查询参数s
			queryParam: {},
			// 加载数据方法 必须为 Promise 对象
			loadData: parameter => {
				// const params = {
				// 	'fileInfos': [{
				// 		'publicKey': this.address, // (用戶ID,父路径,文件名)
				// 		'parentPath': '/',
				// 		// 'fileName': '',
				// 	}]
				// }
				// getFileList(params)
				// 	.then(res => {
				// 		return res.data
				// 	})

				const requestParameters = Object.assign({}, parameter, this.queryParam)
				return getFileList(requestParameters) //
					.then(res => {
						let idx = (parameter.pageNo - 1) * parameter.pageSize + 1
						res.data.data.forEach(val => {
							val.key = idx++
						})
						console.log(res.data)
						return res.data
					})
				// return getMyFileList(requestParameters) //
				// 	.then(res => {
				// 		console.log(res)
				// 		// let idx = (parameter.pageNo - 1) * parameter.pageSize + 1
				// 		// res.data.data.forEach(val => {
				// 		// 	val.key = idx++
				// 		// })
				// 		// console.log(res.data)
				// 		// return res.data
				// 	})
			},
			selectedRowKeys: [],
			selectedRows: []
		}
	},
	computed: {
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
				}
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
		columns: function () {
			return [
				{
					title: this.$t('myfile.table.col.fileName'), //标题
					dataIndex: 'fileName', //引号里面的是后台返回的key值
					ellipsis: true,
					width: '186px'
				},
				{
					title: this.$t('myfile.table.col.fileSize'), //文件大小
					dataIndex: 'fileSize',
					align: 'center',
					customRender: (text, row, index) => formatFileSize3(text, 0, true, false)
				},
				{
					title: this.$t('myfile.table.col.entryLoginDate'), //上传日期
					dataIndex: 'entryLoginDate',
					align: 'center',
					customRender: (text, row, index) => moment(text).format('YYYY-MM-DD HH:mm')
				},
				{
					title: this.$t('myfile.table.col.action'), //操作
					dataIndex: 'action',
					width: '150px',
					scopedSlots: { customRender: 'action' },
					align: 'center'
				}
			]
		},
		rowSelection() {
			return {
				selectedRowKeys: this.selectedRowKeys,
				onChange: this.onSelectChange
			}
		}
	},
	mounted() {
		this.GetSpaceInfo().then(() => {
			this.handleCheckSpace(() => {
				this.handleSearch()
			})
		})
		this.listFn()
	},
	methods: {
		...mapActions(['GetSpaceInfo']),
		// 获取列表数据
		listFn() {
			const params = {
				'fileInfos': [{
					'publicKey': this.address, // (用戶ID,父路径,文件名)
					'parentPath': '/',
					// 'fileName': '',
				}]
			}
			// getFileList(params)
			// 	.then(res => {
			// 		console.log(res)
			// 	})
		},
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
			this.$refs.table.refresh()
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
				link.href = val.downloadUrl + '?filename=' + val.fileName
				link.target = '_blank'
				link.setAttribute('download', val.fileName)// 文件名
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link) // 下载完成移除元素
			})
			this.$message.destroy()
			this.$message.info(this.$t('myfile.download.finish.message'))
		},
		// 执行删除
		handleDelete(record) {
			const params = { 'fileInfos': [] }
			if (record) {
				params.fileInfos.push({ 'fileHash': record.fileHash, 'fileName': record.fileName })
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
				this.selectedRows.forEach(val => {
					params.fileInfos.push({ 'fileHash': val.fileHash, 'fileName': val.fileName })
				})
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
						})
				},
				cancel: () => {
					this.visible = false
				}
			})
			this.visible = true
		},
		// 分享文件
		handleShare(record) {
			const params = { 'fileInfos': [] }
			if (record) {
				params.fileInfos.push({
					'expiration': record.fileHash, //过期时间 seven forever
					'flag': record.fileName,//public无提取码,private有提取码
					'publicKey': record.publicKey,//	用户ID
					'vids': record.fileName //uuids
				})
			} else {
				if (this.selectedRows.length === 0) {
					Object.assign(this.messageBox, {
						okText: '确定',
						message: '确定删除所选文件吗？',
						showCancel: false,
						// okStyle: {},
						ok: () => {
							this.visible = false
						}
					})
					this.visible = true
					return
				}
				this.selectedRows.forEach(val => {
					params.fileInfos.push({ 'fileHash': val.fileHash, 'fileName': val.fileName })
				})
			}
			Object.assign(this.messageBox, {
				message: '确定分享所选文件吗23？',
				okText: '确定',
				cancelText: '取消',
				showCancel: true,
				// okStyle: {},
				ok: () => {
					this.visible = false
					shareFilesFn(params)
						.then(res => {
							this.$message.destroy()
							this.$message.info(this.$t('myfile.delete.finish.message'))
							this.GetSpaceInfo()
							this.handleSearch()
						})
				},
				cancel: () => {
					this.visible = false
				}
			})
			this.visible = true
		},
		//新建文件夹 
		handleNewFolder() {

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
		// 行选择操作
		onSelectChange(selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys
			this.selectedRows = selectedRows
		}
	}
}
</script>

<style lang="less">
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
	.ant-input {
		background: rgba(225, 225, 225, 0.5);
		border-radius: 4px;
		height: 30px;
		line-height: 30px;
		color: rgba(51, 51, 51, 1);
	}
	.ant-input::-moz-placeholder {
		font-weight: 400;
		color: rgba(194, 198, 210, 1);
	}
	.ant-input:-ms-input-placeholder {
		font-weight: 400;
		color: rgba(194, 198, 210, 1);
	}
	.ant-input::-webkit-input-placeholder {
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
		text-align: center;
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
}
</style>
