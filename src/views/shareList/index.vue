<template>
	<div class="my-file">
		<div class="table-page-search-wrapper">
			<a-form layout="inline">
				<div class="titleStyle">
					<p>我的分享</p>
				</div>
				<a-row>
					<a-col span="15">
						<div class="table-operator-area">
							<a-button type="primary" size="large" :disabled="!hasSelected" :loading="loading"
								@click="handleCancel(null)">取消分享
							</a-button>
						</div>
					</a-col>
				</a-row>
			</a-form>
		</div>

		<a-table ref="table" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectARow }"
			:columns="columns" :data-source="dataSource" :customRow="mouseenter_one">

			<img slot="lockPassword" style="width:10px;heigh:10px" slot-scope="text" :src=text />
			<img slot="pic" style="width:20px;heigh:20px" slot-scope="text" :src=text />

			<span slot="action" slot-scope="text, record" id="action_items" v-show="record.key == mouseKey">
				<template>
					<a class="a1" @click="handleOpenCopy(record)"><img style="width:17px;" title="复制分享链接" alt="复制分享链接"
							src="../../assets/icons/copy.png"></a>
					<a class="a1" @click="handleCancel(record)"><img style="width:17px;" title="取消分享" alt="取消分享"
							src="../../assets/icons/cha.png"></a>

				</template>
			</span>
			<!--  v-show="record.key == mouseKey" -->
			<div slot="shareUrl" slot-scope="text, record" class="shareStyle" v-show="record.id == mouseId">
				<template>
					分享链接：<a href="">{{url +'/'+ record.shareId}}</a>
					<span style="font-weight:bold;margin-left:10px"
						v-show="record.sharePassword != ''">提取码：{{record.sharePassword}}</span>
					<a-button style="margin-left:20px" @click="handleCopyShareUrl(record)">复制</a-button>
				</template>
			</div>
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

	</div>
</template>

<script>
import {
	shareMyListFn, cancelShare
} from '@/api/myfile'
import moment from 'moment'
import { formatFileSize3 } from '@/utils/util'
import { getFileExtension } from '@/utils/extension'
import create from 'ant-design-vue/es/icon/IconFont'

export default {
	data() {
		return {
			address: this.$store.getters.address,
			dataSource: [], //后台返回的数据
			loading: false, //按钮的loading
			loadingTable: true,
			mouseKey: 999 - 9,
			mouseId: 999 - 9,
			visible: false,
			url: document.domain,


			selectedRowKeys: [], // 选中此处可配置默认列，选择一行的key值
			columns: [
				{
					title: '',
					dataIndex: 'lockWhether',
					width: 30,
					scopedSlots: { customRender: 'lockPassword' }
				},
				{
					title: '', //标题
					dataIndex: 'picurl', //引号里面的是后台返回的key值
					width: 35,
					scopedSlots: { customRender: 'pic' }
				},
				{
					title: '分享文件', //标题
					dataIndex: 'theme', //引号里面的是后台返回的key值
					ellipsis: true,
					width: '200px',
					scopedSlots: { customRender: 'theme' },
				},
				{
					title: '', //标题
					dataIndex: 'shareUrl',
					width: '100px',
					scopedSlots: { customRender: 'shareUrl' },
				},
				{
					title: '操作',
					dataIndex: 'action',
					width: '200px',
					align: 'center',
					scopedSlots: { customRender: 'action' },
				},
				{
					title: '分享时间',
					dataIndex: 'createTime',
					align: 'center',
					customRender: (text, row, index) => moment(text).format('YYYY-MM-DD HH:mm'),
					// sorter: (a, b) => {
					// 	return Date.parse(b.updateTime) - Date.parse(a.updateTime)
					// },
					// defaultSortOrder: 'ascend', //descend
				},
				{
					title: '失效时间',
					dataIndex: 'expirationDays',
					align: 'center',
				},
				// {
				// 	title: '操作', //操作
				// 	dataIndex: 'action',
				// 	width: '150px',
				// 	align: 'center',
				// 	scopedSlots: { customRender: 'action' },
				// }

			],

		}
	},
	computed: {
		hasSelected() {
			return this.selectedRowKeys.length > 0;
		},
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
			}
		},
	},
	methods: {
		listFn() {
			const params = {
				page: '1',//第几页
				order: 'theme', //排序规则,传列表的字段名称
				publicKey: this.address,
				desc: '1', //是否降序，1
			}
			shareMyListFn(params).then(res => {
				// if (res.respCode == 1) {
				this.loadingTable = false;
				this.dataSource = res.respMap.data;
				for (let i = 0; i < this.dataSource.length; i++) {
					this.dataSource[i].key = i //要加一个key值，才不会报错
					//这是文件夹
					if (this.dataSource[i].theme.indexOf('.') != -1) {
						this.dataSource[i].picurl = getFileExtension(this.dataSource[i].theme.split('.')[1])
					} else {
						this.dataSource[i].picurl = getFileExtension('folder')
					}
					// 1是加密
					if (this.dataSource[i].lockWhether == 1) {
						this.dataSource[i].lockWhether = require('../../assets/icons/lock.png')
					} else {
						this.dataSource[i].lockWhether = '';
					}
					if (this.dataSource[i].expirationDays > 7) {
						this.dataSource[i].expirationDays = '永久有效'
					} else {
						this.dataSource[i].expirationDays = this.dataSource[i].expirationDays + '天后'
					}
				}
				// }

			})
		},
		onSelectARow(selectedRowKeys, selectedRows) {
			// console.log(selectedRowKeys);
			// console.log(selectedRows);
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = selectedRows; //选中的数据列表

		},
		// 打开复制按钮
		handleOpenCopy(record) {
			console.log(record)
			this.mouseId = record.id
			// this.mouseKey = record.key
		},
		// 复制链接按钮
		handleCopyShareUrl(record) {
			let shareBtn = '';
			if (record.sharePassword != '') {
				shareBtn = '链接：' + this.url + '/' + record.shareId + '  访问密码：' + record.sharePassword
			} else {
				shareBtn = '链接：' + this.url + '/' + record.shareId
			}
			this.$copyText(shareBtn).then(function (e) {

			}, function (e) {

			})
			this.$message.success('复制成功')
		},
		// 取消分享

		handleCancel(record) {
			this.visible = true
			let params = {}
			if (record) {
				params = {
					'publicKey': this.address,
					'vids': record.shareId,
				}
			} else {
				let newVids = '';
				this.selectedRows.forEach(val => {
					newVids += val.shareId + ','
				})
				params = {
					'publicKey': this.address,
					'vids': newVids,
				}
			}
			Object.assign(this.messageBox, {
				okText: '确定',
				cancelText: '取消',
				message: '取消后，分享将被删除，且无法再被查看，是否继续？',
				showCancel: true,
				ok: () => {
					cancelShare(params).then(res => {
						if (res.respCode == 1) {
							this.$message.success('取消外链分享成功', 2,)
							this.visible = false
							this.listFn();
							// this.selectedRowKeys.length = 0;//可以把勾去掉
						}
					}).catch(res => {
						this.$message.success(res.respMsg);
					})
				},
				cancel: () => {
					this.visible = false
				}
			})
		},
		// 鼠标移入的状态
		mouseenter_one(record, index) {
			return {
				on: {
					mouseenter: () => {
						this.mouseKey = record.key;
						this.onSelectARow();
						// console.log(record, index)
					},
					mouseleave: (event) => {
						this.mouseKey = 999 - 9;
						this.mouseId = 999 - 9;
					}
				}
			}
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
	width: 1200px;
	margin: 20px auto 0;
	padding: 0 130px;
	background: #fff;
	// padding: 50px 40px 20px;
	.titleStyle {
		color: #162646;
		font-size: 24px;
		text-align: center;
		padding: 40px 0 20px;
	}
	.titleStyle p {
		width: 100px;
		margin: 0 auto;
	}
	.titleStyle p::before {
		content: '';
		width: 72px;
		height: 4px;
		border-radius: 2px;
		background: #26c195;
		display: block;
		margin: 0 0 15px 14px;
	}
	.ant-table-wrapper {
		background: #fff;
	}
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
	.a1 {
		padding: 7px;
	}
	.ant-table-tbody .ant-table-row td {
		position: relative;
	}
	.ant-table-tbody .ant-table-row .shareStyle {
		position: absolute;
		left: -100px;
		bottom: -48px;
		width: 600px;
		height: 50px;
		line-height: 50px;
		background: #e6f7ff;
		// background: #e6f7ff;
		z-index: 999;
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
		width: 70%;
		margin: 0 auto;
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