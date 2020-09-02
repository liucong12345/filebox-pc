<template>
	<a-dropdown v-if="address" @visibleChange="changex">
		<div class="box">
			<img class="avatar" src="~@/assets/avatar.png" />
			<span :class="textClass">{{ $t('header.topmenu.center') }}</span>
			<a-icon :type="iconType" :class="iconClass" />
		</div>
		<template v-slot:overlay>
			<div class="menu">
				<div class="menu-item" @click="handleAccount">
					{{ $t('header.topmenu.account') }}
				</div>
				<div class="divider" />
				<div class="menu-item" @click="handleShareList">
					我的分享
				</div>
				<div class="divider" />
				<div class="menu-item" @click="handleLogout">
					{{ $t('header.topmenu.logout') }}
				</div>
			</div>
		</template>
	</a-dropdown>
	<span v-else>
		<router-link to="/login">
			<div class="loginBtn">
				{{ $t('login') }}
			</div>
		</router-link>
	</span>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'AvatarDropdown',
	iconType: {},
	iconClass: {},
	textClass: {},
	data() {
		return {
			iconType: 'caret-down',
			iconClass: 'icon',
			textClass: 'contentperson',
			// create model
			visible: false,
			confirmLoading: false,
			mdl: null,
			// 查询参数
			queryParam: {}
		}
	},
	computed: {
		...mapState({
			address: (state) => state.user.address
		})
	},
	methods: {
		// handleCenter () {
		//   this.$router.push('/center')
		// },
		handleAccount() {
			this.$router.push('/userinfo')
		},
		handleShareList() {
			this.$router.push('/shareList')
		},
		handleLogout() {
			this.$store.dispatch('Logout').then(() => {
				this.$router.push('/home')
			})
		},
		changex: function (visible) {
			if (visible) {
				this.iconType = 'caret-up'
				this.iconClass = 'iconon'
				this.textClass = 'contentpersonon'
			} else {
				this.iconType = 'caret-down'
				this.iconClass = 'icon'
				this.textClass = 'contentperson'
			}
		}
	}
}
</script>

<style lang="less" scoped>
.box {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 14px;
	font-family: Microsoft YaHei, serif;
	font-weight: 400;
	margin-left: 50px;
	position: relative;

	.contentperson {
		font-weight: 400;
	}

	.contentpersonon {
		font-weight: 400;
		color: rgba(69, 135, 243, 1);
	}

	&:hover {
		cursor: pointer;
	}

	.avatar {
		height: 22px;
		margin-right: 10px;
	}

	.icon {
		font-size: 12px;
		margin-left: 6px;
	}

	.iconon {
		font-size: 12px;
		margin-left: 6px;
		color: rgba(69, 136, 243, 1);
	}
}

.menu {
	position: absolute;
	top: -15px;
	left: 15px;
	width: 98px;
	height: 120px;
	background: rgba(255, 255, 255, 1);
	box-shadow: 1px 5px 16px 0px rgba(0, 27, 64, 0.1);
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	.menu-item {
		width: 98px;
		height: 39px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		color: #666666;
		position: relative;

		&:hover {
			font-weight: bold;
			color: #333333;
			cursor: pointer;

			&:after {
				content: '';
				position: absolute;
				top: 2px;
				left: 0;
				height: 35px;
				width: 2px;
				background-color: #26c195;
			}
		}
	}

	.divider {
		width: 78px;
		height: 1px;
		border: 1px solid #e5e5e5;
	}
}

.loginBtn {
	display: inline-flex;
	width: 81px;
	height: 40px;
	background-color: #f1f7fd;
	color: #4587f3;
	font-size: 14px;
	font-weight: bold;
	border-radius: 4px;
	align-items: center;
	justify-content: center;

	&:hover {
		cursor: pointer;
		background-color: darken(#f1f7fd, 5%);
		color: darken(#4587f3, 5%);
	}
}
</style>
