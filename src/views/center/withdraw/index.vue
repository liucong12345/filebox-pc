<template>
	<div :bordered="false">
		<table class="title-table">
			<tr>
				<td>
					<p style="margin-top: 10px;">
						<span class="sub-title">{{ $t('withdraw.title') }}</span>
					</p>
				</td>
				<td>
					<div style="text-align: right;">
						<a class="reward-back" @click="() => this.$router.back()">{{ $t('withdraw.back') }}</a>
					</div>
				</td>
			</tr>
		</table>
		<div class="content">
			<a-form-model ref="withdrawForm" :model="form">
				<a-row type="flex" align="middle" style="margin-bottom: 20px;color: #2E323D;">
					<a-col v-if="currentLang === 'zh-CN'" :span="4" class="label">
						<label>{{ $t("withdraw.availableNumber") }}</label>
					</a-col>
					<a-col v-else :span="6" class="label">
						<label>{{ $t("withdraw.availableNumber") }}</label>
					</a-col>
					<a-col class="availableNumber" :span="18">
						{{ availableNumber }} FN
					</a-col>
				</a-row>
				<a-form-model-item props="withdrawNumber" ref="withdrawNumber" :auto-link="false">
					<a-row style="color: #2E323D;">
						<a-col v-if="currentLang === 'zh-CN'" :span="4" class="label">
							<label>{{ $t("withdraw.withdrawNumber") }}</label>
						</a-col>
						<a-col v-else :span="6" class="label">
							<label>{{ $t("withdraw.withdrawNumber") }}</label>
						</a-col>
						<a-col class="withdrawNumber" :span="6">
							<a-input type="number" step="0.01" class="input-text" v-model="form.withdrawNumber"
								:placeholder="$t('withdraw.input.tip')" @change="handleInput" />
						</a-col>
						<a-col :span="12">
							<a class="all-text" @click="() => withdrawAllReward()">{{ $t('withdraw.withdrawAll') }}</a>
						</a-col>
					</a-row>
				</a-form-model-item>
				<a-form-model-item props="arrivalNumber" ref="arrivalNumber" :auto-link="false"
					style="margin-top: -15px">
					<a-row style="color: #2E323D;">
						<a-col v-if="currentLang === 'zh-CN'" :span="4" class="label">
							<label>{{ $t("withdraw.arrivalNumber") }}</label>
						</a-col>
						<a-col v-else :span="6" class="label">
							<label>{{ $t("withdraw.arrivalNumber") }}</label>
						</a-col>
						<a-col class="arrivalNumber" :span="18">
							{{ `${arrivalNumber} FN` }}
						</a-col>
					</a-row>
				</a-form-model-item>
			</a-form-model>
		</div>
		<div style="text-align: right">
			<a-button class="submit-button" @click="handleSubmit" type="primary">{{ $t("withdraw.withdrawButton") }}
			</a-button>
		</div>

		<div class="divider-line"></div>
		<div class="note-area">
			<p><span class="note-title">{{ $t("withdraw.info.title") }}</span></p>
			<p><span class="note-text">{{ $t("withdraw.info.address") }}{{ address }}</span></p>
			<p><span class="note-text">{{ $t("withdraw.info.count") }}{{ tax }}{{ $t("withdraw.info.text") }}</span></p>
		</div>
		<a-modal class="modal" :width="370" :visible="passwordModalVisible" :footer="null" :closable="false"
			:destroyOnClose="true">
			<div class="modalTitle">
				{{ $t('withdraw.modal.password.title') }}
			</div>
			<div class="modalContent">
				<a-input-password :placeholder="$t('myreward.modal.password.placeholder')" class="input-password"
					v-model="password" />
			</div>
			<div class="modalButton">
				<div class="cancel" @click="handlePasswordCancel">{{ $t('withdraw.modal.password.button.cancel') }}
				</div>
				<a-spin style="outline: none;border: none" v-if="onEnter" />
				<div v-else class="login" @click="handlePasswordEnter">{{ $t('withdraw.modal.password.button.enter') }}
				</div>
			</div>
		</a-modal>
	</div>

</template>

<script>
import { mapActions, mapState } from 'vuex'
import { withdrawReward, getTax } from '@/api/withdraw'
import bs58 from 'bs58'
import InputNumber from '@/components/InputNumber'
import { build } from '@/utils/keyStore'
export default {
	name: 'withdraw',
	components: {
		InputNumber
	},
	data() {
		return {
			tax: '0',
			availableNumber: '0',
			address: this.$store.getters.address,
			form: {
				withdrawNumber: '',
				arrivalNumber: '0'
			},
			onEnter: false,
			passwordModalVisible: false,
			password: ''
		}
	},
	mounted() {
		getTax().then(res => {
			this.tax = res.data.tax
			this.availableNumber = res.data.availableNumber.toFixed(2)
			console.log(res.data)
		})
	},
	computed: {
		...mapState({
			keystore: (state) => state.user.keystore,
			master: (state) => state.order.master,
			currentLang: (state) => state.app.lang
		}),
		arrivalNumber() {
			const { withdrawNumber } = this.form
			if (!withdrawNumber || withdrawNumber <= this.tax) {
				return 0
			}
			return parseFloat(withdrawNumber - this.tax).toFixed(2)
		}
	},
	methods: {
		...mapActions(['DoWithdraw']),
		handleInput() {
			if (parseFloat(this.form.withdrawNumber) > parseFloat(this.availableNumber)) {
				this.form.withdrawNumber = this.availableNumber
			}
			this.form.withdrawNumber = this.form.withdrawNumber.match(/^\d*(\.?\d{0,2})/g)[0]
		},
		withdrawAllReward() {
			this.form.withdrawNumber = this.availableNumber
		},
		handleSubmit() {
			const { withdrawNumber } = this.form
			if (withdrawNumber === '' || withdrawNumber === '0') {
				this.$message.error({ content: this.$t('withdraw.validate.withdrawNumber.space.error'), key: 'message' })
				return
			}
			if (parseFloat(withdrawNumber) > parseFloat(this.availableNumber)) {
				this.$message.error({ content: this.$t('withdraw.validate.withdrawNumber.size.error'), key: 'message' })
				return
			}
			if (withdrawNumber <= this.tax) {
				this.$message.error({ content: this.$t('withdraw.validate.withdrawNumber.number.error'), key: 'message' })
				return
			}
			this.passwordModalVisible = true
		},
		handlePasswordCancel() {
			this.passwordModalVisible = false
			this.password = ''
		},
		handlePasswordEnter() {
			this.onEnter = true
			const { keystore, password, form } = this
			if (!password) {
				this.$message.error({ content: this.$t('withdraw.validate.password.blank'), key: 'message' })
				this.onEnter = false
				return
			}
			const wallet = build({ keystore, password })
			if (!wallet) {
				this.$message.error({ content: this.$t('withdraw.validate.password.error'), key: 'message' })
				this.password = ''
				this.onEnter = false
				return
			}
			const hex = wallet.getAddress().toString('hex')
			const bytes = []
			for (let i = 0; i < hex.length; i++) {
				bytes.push(hex[i].charCodeAt(0))
			}
			const to = bs58.encode(bytes)
			const key = wallet.getPrivateKey().toString('hex')
			const { withdrawNumber } = form
			// const value = withdrawNumber
			if (to && withdrawNumber && key) {
				// const { DoWithdraw } = this
				// DoWithdraw(to, value)
				// const requestParameters = Object.assign({}, to, value)
				const params = {
					'to': [],
					'value': []
				}
				params.to = to
				params.value = withdrawNumber
				withdrawReward(params)
					.then(() => {
						this.$message.success({ content: this.$t('withdraw.cash.success'), key: 'message' })
							.then(() => {
								this.$router.back()
							})
					})
					.finally(() => {
						this.password = ''
						this.passwordModalVisible = false
						this.onEnter = false
					})
			}
		}
	}
}
</script>

<style lang="less" scoped>
.title-table {
	width: 100%;
	height: 66px;
	background-color: #f0f0f0;
}
.content {
	color: #2e323d;
	margin: 26px 50px 0 60px;
	font-size: 14px;
	max-width: 800px;
}
.reward-back {
	margin-right: 60px;
	font-size: 16px;
	font-weight: 400;
	color: rgba(38, 193, 149, 1);
	line-height: 26px;
}
.cancelButton {
	width: 50%;
	height: 50px;
	margin-top: 15px;
	color: #666666;
	border: none;
	font-size: 14px;
}
.loginButton {
	width: 50%;
	height: 50px;
	margin-top: 15px;
	color: #26c195;
	border: none;
	font-size: 14px;
}
.sub-content {
	margin-top: 20px;
}
.sub-title {
	padding: 30pt 60px;
	font-size: 18px;
	color: #000;
	font-weight: 700;
	line-height: 26px;
}
.input-text {
	border: 1px solid #97999e;
	border-radius: 2px;
	color: #2e323d;
}
.divider-line {
	position: relative;
	margin: 20px 0;
	width: 100%;
	height: 1px;
	background-color: #d4d4d4;
	text-align: center;
	color: rgba(101, 101, 101, 1);
}
.submit-button {
	width: 156px;
	height: 40px;
	background: rgba(38, 193, 149, 1);
	border-radius: 4px;
	border: none;
	margin-right: 60px;
}
.note-title {
	font-size: 16px;
	color: #2e323d;
	font-weight: bold;
}
.note-text {
	font-size: 14px;
	color: #2e323d;
}
.all-text {
	color: #26c195;
	margin-left: 5px;
	font-size: 12px;
}
.normal-text {
	font-size: 14px;
	color: #333333;
	margin: 40px;
}
.note-area {
	margin: 40px 0 0 60px;
	height: 100%;
}
.input-password {
	height: 44px;
	border-radius: 8px;
}
.modal {
	.modalTitle {
		text-align: center;
		font-size: 16px;
		font-weight: bold;
		margin-top: 5px;
	}

	.modalContent {
		text-align: center;
		font-size: 14px;
		margin-top: 18px;
		padding: 0 15px;
	}

	.modalButton {
		font-size: 16px;
		display: flex;
		margin: 0 -24px -24px -24px;

		div {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			padding: 10px;
			width: 50%;
			cursor: pointer;
			&.cancel {
				height: 50px;
				margin-top: 15px;
				color: #2e323d;
				border: none;
				font-size: 14px;

				&:hover {
					color: lighten(#2e323d, 10%);
				}
			}

			&.login {
				height: 50px;
				margin-top: 15px;
				color: #26c195;
				border: none;
				font-size: 14px;

				&:hover {
					color: lighten(#26c195, 10%);
				}
			}
		}
	}
}
</style>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	appearance: none;
	margin: 0;
}
input {
	-moz-appearance: textfield !important;
}
</style>
