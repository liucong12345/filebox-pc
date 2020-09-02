<template>
	<div class="main">
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
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { build } from '@/utils/keyStore'
import bs58 from 'bs58'

export default {
	name: 'Login',
	data() {
		return {
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
									this.$router.push('/center')
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
		}
	}
}
</script>

<style lang="less" scoped>
.main {
	text-align: center;
	min-height: 100%;
	background-image: url('~@/assets/login-background.png');
	background-color: #072d41;
	padding: 185px 0;
}

.flex-box {
	align-items: stretch;
}

.card {
	display: inline-flex;
	flex-direction: row;
	width: 942px;
	height: 530px;

	.left {
		display: inline-block;
		width: 423px;
		background-color: #fff;
		height: 100%;
		position: relative;

		.logoDiv {
			position: absolute;
			top: 49px;
			left: 40px;
			text-align: left;

			.logo {
				width: 38px;
			}
		}

		.title {
			display: inline;
			position: absolute;
			top: 123px;
			left: 162px;
			color: #2e323d;
			font-size: 18px;
		}

		.content {
			position: absolute;
			top: 184px;
			left: 40px;
			text-align: left;
			line-height: 48px;
			color: #2e323d;
			font-size: 14px;
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
}
</style>
