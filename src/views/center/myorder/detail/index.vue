<template>
  <div>
    <table class="title-table">
      <tr>
        <td>
            <span class="sub-title">{{ $t('myorder.detail.header') }}</span>
        </td>
        <td><div style="text-align: right;">
          <a class="order-back" @click="() => this.$router.push('/center/myorder')">{{ $t('myorder.back') }}</a>
        </div></td>
      </tr>
    </table>
    <div>
      <a-row class="arowclass" >
        <a-col :span="12">
          {{ result[0] }}:
        </a-col>
        <a-col :span="12" >
          {{ datarlt.orderNo }}
        </a-col>
      </a-row>
      <a-row class="arowclass">
        <a-col :span="12">
          {{ result[1] }}:
        </a-col>
        <a-col :span="12" >
          {{ this.statusitems[datarlt.status] }}
        </a-col>
      </a-row>
      <a-row class="arowclass">
        <a-col :span="12">
          {{ result[2] }}:
        </a-col>
        <a-col :span="12" >
          {{ this.moment(datarlt.createTime) }}
        </a-col>
      </a-row>
      <a-row class="arowclass">
        <a-col :span="12">
          {{ result[3] }}:
        </a-col>
        <a-col :span="12" >
          {{ formatFileSize( datarlt.spaceSize ) }}
        </a-col>
      </a-row>
      <a-row class="arowclass">
        <a-col :span="12">
          {{ result[4] }}:
        </a-col>
        <a-col :span="12" >
          {{ datarlt.pledgeFnAmount }}{{ this.$t('myorder.pledgeFnAmount.unit') }}
        </a-col>
      </a-row>
      <a-row class="arowclass">
        <a-col :span="12">
          {{ result[5] }}:
        </a-col>
        <a-col :span="12" >
          {{ datarlt.pledgePeriod }}{{ this.$t('myorder.pledgePeriod.unit') }}
        </a-col>
      </a-row>
      <a-row class="arowclass">
        <a-col :span="12">
          {{ result[6] }}:
        </a-col>
        <a-col :span="12" >
          {{ this.totimeCalculate(datarlt.createTime,datarlt.pledgePeriod) }}
        </a-col>
      </a-row>
      <a-row class="arowclass">
        <a-col :span="12">
          {{ result[7] }}:
        </a-col>
        <a-col :span="12" >
          {{ datarlt.rewardPercent }}%（{{ this.rewardCalculate(datarlt.rewardPercent ,datarlt.pledgeFnAmount ) }}{{ this.$t('myorder.pledgeFnAmount.unit') }}）
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import { getPledgeDetail } from '@/api/manage'
  import { formatFileSize2 } from '@/utils/util'
  import { mapActions } from 'vuex'

  export default {
    name: 'OrderDetail',
      statusitems: {},
    data () {
      return {
          datarlt: {},
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 查询参数
        queryParam: {}
      }
    },
    computed: {
      statusitems: function () {
        return {
          0: this.$t('myorder.status.0'),
          1: this.$t('myorder.status.1'),
          2: this.$t('myorder.status.2')
        }
      },
        result: function () {
            return [
                this.$t('myorder.table.col.orderId'),
                this.$t('myorder.table.col.status'),
                this.$t('myorder.table.col.createTime'),
                this.$t('myorder.table.col.space'),
                this.$t('myorder.table.col.pledgeFnAmount'),
                this.$t('myorder.table.col.pledgePeriod'),
                this.$t('myorder.detail.totime'),
                this.$t('myorder.detail.rewardAmount')
            ]
        }
    },
      mounted () {
          getPledgeDetail(this.$route.query)
              .then(res => {
                  this.datarlt = res.data.data[0]
              })
      },
    methods: {
      ...mapActions(['setPageNo']),
      handleCancel () {
        this.visible = false

        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      },
      moment (text) {
          return moment(text).format('YYYY-MM-DD HH:mm')
      },
      rewardCalculate (rewardPercent, pledgeFnAmount) { // 保留小数点后两位
        var rlt1 = rewardPercent * pledgeFnAmount / 100
        return rlt1.toFixed(2)
      },
      totimeCalculate (createTime, pledgePeriod) {
          return moment(createTime).add(pledgePeriod, 'months').format('YYYY-MM-DD HH:mm')
      },
      formatFileSize: function (fileSize) {
          if (fileSize != null && fileSize !== '') {
              return formatFileSize2(fileSize, 2, false, true)
          } else {
              return ''
          }
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path !== '/center/myorder') {
        this.setPageNo(1)
        next()
      } else {
        next()
      }
    }
  }
</script>

<style lang="less" scoped>
  .title-table {
    width: 100%;
    height: 66px;
    background-color: #F0F0F0;
  }
  .sub-title {
    width:72px;
    height:18px;
    font-size:18px;
    font-family:Microsoft YaHei;
    font-weight:bold;
    color:rgba(46,50,61,1);
    line-height:24px;
    margin-left: 59px;
  }
  .order-back{
    width:58px;
    height:15px;
    font-size:16px;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(38,193,149,1);
    line-height:26px;
    margin-right: 60px;
  }
  .arowclass{
    margin-left: 59px;
    width:500px;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(46,50,61,1);
    line-height:37px;
  }
</style>
