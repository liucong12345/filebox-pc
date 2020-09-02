<template>
  <div class="main">
    <div class="card">
      <div class="title">
        <div class="line1">
          <a class="detail" @click="() => openRule()">{{ $t('buy.message.detail') }}</a>
          <a class="back" @click="() => goBack()">{{ $t('login.back') }}</a>
        </div>
        <div class="line2">
          <div class="line"/>
        </div>
        <div class="line3">
          <span class="title" v-if="totalSize">
            {{ $t('buy.title.expansion') }}
            <span class="size" v-if="totalSize">
              {{ `${$t('buy.title.message.prefix')}${formatTotalSize}${$t('buy.title.message.suffix')}` }}
            </span>
          </span>
          <span class="title" v-else>
            {{ $t('buy.title.buy') }}
          </span>
        </div>
      </div>
      <div class="content">
        <a-form-model ref="orderForm" :model="form">
          <a-form-model-item props="space" ref="space" :auto-link="false">
            <div class="row">
              <div class="label">
                <label class="spaceL">{{ $t('buy.item.space') }}</label>
                <span
                  class="spaceS">({{ `${$t('buy.message.price')}${master.unitFNCoin}FN/${master.unitSpace}G` }})</span>
              </div>
              <InputNumber
                :min="0"
                :unit="master.unitSpace"
                v-model="form.space"
                @blur="() => {$refs.space.onFieldBlur()}"
                @change="() => {$refs.space.onFieldChange()}"
              />
              <span class="unit">G</span>
            </div>
          </a-form-model-item>
          <div class="message">
          </div>
          <a-form-model-item props="time" ref="time" :auto-link="false">
            <div class="row">
              <div class="label">
                <label>{{ $t('buy.item.time') }}</label>
              </div>
              <div>
                <a-select
                  size="large"
                  v-if="master.timePercentageList"
                  v-model="form.time"
                  @blur="() => {$refs.time.onFieldBlur()}"
                  @change="() => {$refs.time.onFieldChange()}"
                >
                  <img style="height: 12px" slot="suffixIcon" src="~@/assets/icons/down.png"/>
                  <a-select-option v-for="item in master.timePercentageList" :key="item.time">
                    {{ `${item.time}${item.time > 1 ? $t('buy.item.time.unit') : $t('buy.item.time.unit-single')}` }}
                  </a-select-option>
                </a-select>
                <a-spin v-else/>
              </div>
            </div>
          </a-form-model-item>
          <div class="row item">
            <div class="label">
              <label>{{ $t('buy.item.percentage') }}</label>
            </div>
            <div>
              {{ `${percentage}% (${reward || 0} FN)` }}
            </div>
          </div>
          <div class="row item">
            <div class="label">
              <label>{{ $t('buy.item.price') }}</label>
            </div>
            <div class="price">
              {{ `${price} FN` }}
            </div>
          </div>
        </a-form-model>
        <a-row class="btn">
          <a-button
            class="submit"
            type="primary"
            @click="handleSubmit">
            {{ totalSize ? $t('buy.submit2') : $t('buy.submit') }}
          </a-button>
        </a-row>
      </div>
    </div>
    <a-modal
      class="passwordModal"
      :width="371"
      :visible="passwordModalVisible"
      :footer="null"
      :closable="false"
      :destroyOnClose="true">
      <div class="modalContent">
        <label>{{ $t('buy.modal.password.content') }}</label>
        <a-input-password :placeholder="$t('buy.modal.password.placeholder')" v-model="password"/>
      </div>
      <div class="modalButton">
        <div class="cancel" @click="handlePasswordCancel">{{ $t('buy.modal.password.button.cancel') }}</div>
        <a-spin v-if="onEnter"/>
        <div v-else class="login" @click="handlePasswordEnter">{{ $t('buy.modal.password.button.enter') }}</div>
      </div>
    </a-modal>
    <a-modal
      class="ruleModal"
      :width="683"
      :visible="ruleModalVisiable"
      :footer="null"
      :closable="false"
      :destroyOnClose="true"
    >
      <div class="modalTitle">
        {{ $t('buy.rule.detail.title') }}
        <span class="close" @click="() => closeRule()">
          &times;
        </span>
      </div>
      <div class="modalContent">
        <p>
          <label class="label">{{ $t('buy.rule.detail.item.1') }}</label>
          {{ $t('buy.rule.detail.content.1') }}
        </p>
        <p>
          <label class="label">{{ $t('buy.rule.detail.item.2') }}</label>
          {{ $t('buy.rule.detail.content.2') }}
        </p>
        <p>
          <label class="label">{{ $t('buy.rule.detail.item.3') }}</label>
          {{ $t('buy.rule.detail.content.3') }}
        </p>
        <p>
          <label class="label">{{ $t('buy.rule.detail.item.4') }}</label>
          {{ $t('buy.rule.detail.content.4') }}
        </p>
        <p>
          <label class="label">{{ $t('buy.rule.detail.item.5') }}</label>
        </p>
        <p>
          {{ $t('buy.rule.detail.content.5.1') }}
        </p>
        <p>
          {{ $t('buy.rule.detail.content.5.2') }}
        </p>
        <p>
          {{ $t('buy.rule.detail.content.5.3') }}
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import bs58 from 'bs58'
  import { build, signIn } from '@/utils/keyStore'
  import InputNumber from '@/components/InputNumber'
  import { formatFileSize } from '@/utils/util'

  export default {
    name: 'Buy',
    components: {
      InputNumber
    },
    data () {
      return {
        form: {
          space: 0,
          time: undefined
        },
        onEnter: false,
        passwordModalVisible: false,
        ruleModalVisiable: false,
        password: ''
      }
    },
    computed: {
      ...mapState({
        keystore: (state) => state.user.keystore,
        master: (state) => state.order.master,
        totalSize: (state) => state.user.totalSize
      }),
      formatTotalSize () {
        const { totalSize } = this
        return totalSize ? formatFileSize(totalSize, 2, false, true) : 0
      },
      percentage () {
        const { master } = this
        const { time } = this.form
        if (master && time) {
          const { timePercentageList } = master
          if (timePercentageList) {
            for (let i = 0; i < timePercentageList.length; i++) {
              const timePercentage = timePercentageList[i]
              const { time: tTime, percentage: tPercentage } = timePercentage
              if (tTime && tPercentage) {
                if (time === tTime) {
                  return tPercentage
                }
              }
            }
          }
        }
        return 0
      },
      price () {
        const { master } = this
        if (master) {
          const { unitFNCoin, unitSpace } = master
          if (unitFNCoin && unitSpace) {
            const { space } = this.form
            return parseFloat((space * unitFNCoin / unitSpace).toFixed(5))
          }
        }
        return 0
      },
      reward () {
        const { price, percentage } = this
        return parseFloat((price * percentage / 100).toFixed(5))
      }
    },
    methods: {
      ...mapActions(['GetOrderMaster', 'GetSpaceInfo', 'BuySpace']),
      handleSubmit () {
        const { space, time } = this.form
        if (!space) {
          this.$message.error({ content: this.$t('buy.validate.space.error'), key: 'message' })
          return
        }
        if (space > 1024 * 1024) {
          this.$message.error({ content: this.$t('buy.validate.space.max'), key: 'message' })
          return
        }
        if (!time) {
          this.$message.error({ content: this.$t('buy.validate.time.error'), key: 'message' })
          return
        }
        this.passwordModalVisible = true
      },
      handlePasswordCancel () {
        this.password = ''
        this.passwordModalVisible = false
      },
      handlePasswordEnter () {
        this.onEnter = true
        const { keystore, master, price, password, form } = this
        const { address: to } = master
        if (!password) {
          this.$message.error({ content: this.$t('buy.validate.password.blank'), key: 'message' })
          this.onEnter = false
          return
        }
        const wallet = build({ keystore, password })
        if (!wallet) {
          this.$message.error({ content: this.$t('buy.validate.password.error'), key: 'message' })
          this.password = ''
          this.onEnter = false
          return
        }
        const hex = wallet.getAddress().toString('hex')
        const bytes = []
        for (let i = 0; i < hex.length; i++) {
          bytes.push(hex[i].charCodeAt(0))
        }
        const from = bs58.encode(bytes)
        const key = wallet.getPrivateKey().toString('hex')
        if (from && to && price && key) {
          const signResult = signIn({ from, to, price, key })
          if (signResult) {
            const { BuySpace } = this
            const { space, time } = form
            BuySpace({ ...signResult, price, space, time })
              .then(() => {
                this.$message.success({ content: this.$t('buy.order.success'), key: 'message' })
                  .then(() => {
                    this.$router.push('/center/myorder')
                  })
              })
              .finally(() => {
                this.password = ''
                this.passwordModalVisible = false
                this.onEnter = false
              })
          }
        }
      },
      goBack () {
        this.$router.push('/center')
      },
      openRule () {
        this.ruleModalVisiable = true
      },
      closeRule () {
        this.ruleModalVisiable = false
      }
    },
    mounted () {
      const { GetOrderMaster, GetSpaceInfo } = this
      GetOrderMaster()
        .then(() => {
          const { master } = this
          if (master.timePercentageList.some(i => {
            return i.time === 12
          })) {
            this.form.time = 12
          }
        })
      GetSpaceInfo()
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #fff;
    text-align: center;
    padding: 37px 0 0 0;

    .card {
      display: inline-block;
      background-color: #fff;
      box-shadow: -5px 0 30px 0 rgba(220, 227, 238, 0.5);
      width: 1200px;
      height: 635px;

      .title {
        .line1 {
          padding: 57px 50px 0 50px;
          text-align: left;

          .detail {
            text-decoration: underline;
          }

          .back {
            float: right;
          }

          a {
            font-size: 16px;
            color: #26C195;

            &:hover {
              color: lighten(#26C195, 10%);
            }
          }
        }

        .line2 {
          text-align: center;

          .line {
            display: inline-block;
            width: 72px;
            height: 4px;
            background-color: #26C195;
            border-radius: 2px;
          }
        }

        .line3 {
          color: #152646;
          font-size: 25px;
          font-weight: bold;
          padding-top: 15px;

          .title {
            position: relative;
          }

          .size {
            position: absolute;
            left: 100%;
            bottom: 0;
            white-space: nowrap;
            color: #999999;
            font-size: 14px;
            font-weight: normal;
          }
        }
      }

      .content {
        margin: 39px auto;
        width: 454px;
        font-size: 16px;
        position: relative;

        .message {
          text-align: left;
          margin-bottom: 15px;
        }

        .select {
          width: 248px;
          height: 56px;
        }

        .unit {
          position: absolute;
          top: 8px;
          left: 245px;
        }

        .row {
          display: flex;
          width: 100%;
          flex-direction: row;
          align-items: center;
        }

        .label {
          text-align: left;
          width: 206px;
          position: relative;

          label {
            color: #2D323D;
            font-size: 16px;
            display: block;
          }

          .spaceL {
            position: absolute;
            top: -15px;
            line-height: 15px;
            width: 200px;
          }

          span {
            color: #999999;
            font-size: 14px;
          }

          .spaceS {
            position: absolute;
            top: 10px;
            line-height: 13px;
            width: 200px;
          }
        }

        .itemCol {
          overflow: visible;
        }

        .item {
          text-align: left;
          margin-bottom: 20px;
          font-size: 16px;

          .price {
            font-size: 18px;
            color: #26C195;
          }
        }

        .btn {
          width: 100%;
          position: absolute;
          top: 330px;
          text-align: center;

          .submit {
            background-color: #26C195;
            width: 100%;
            height: 40px;
            border: none;
            border-radius: 4px;

            &:hover {
              background-color: lighten(#26C195, 10%);
            }
          }
        }
      }
    }
  }

  .passwordModal {
    .modalTitle {
      text-align: center;
      font-size: 18px;
    }

    .modalContent {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 25px;

      label {
        display: inline-block;
        margin-top: 5px;
        margin-bottom: 15px;
      }
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
          color: #000;

          &:hover {
            color: lighten(#000000, 10%)
          }
        }

        &.login {
          color: #26C195;

          &:hover {
            color: lighten(#26C195, 10%);
          }
        }
      }
    }
  }

  .ruleModal {
    .modalTitle {
      position: relative;
      text-align: center;
      padding: 10px 0;
      margin: -24px -24px 0 -24px;
      background-color: #26C195;
      color: #fff;
      font-size: 16px;
      font-weight: bold;

      .close {
        position: absolute;
        top: 5px;
        right: 15px;
        font-size: 20px;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .modalContent {
      text-align: left;
      font-size: 14px;
      margin-top: 25px;
      margin-bottom: 25px;

      .label {
        font-weight: bold;
      }
    }
  }
</style>
