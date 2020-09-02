<template>
  <div :bordered="false" style="margin: 0px -24px 0px -24px;background-color: #F0F6FE">
    <div class="info-content">
    <a-form :form="form">
      <div class="title-content">
        <img style="margin: 26px 0 26px 30px; float: left" src="~@/assets/totalReward.png">
        <div class="title-total">
          <span class="total-text">{{ $t("myreward.totalReward") }}</span>
          <div style="overflow:hidden;">
            <span class="total-number">
              {{ dataResult.totalReward }}
            </span>
            <span class="fn-text"> FN</span>
          </div>
        </div>
        <div class="title-withdraw">
          <div v-if="currentLang === 'zh-CN'" style="padding-left: 65px;display: table-cell; vertical: bottom; line-height: 24px">
            <span class="withdraw-number-text" style="float: left">{{ $t("myreward.availableNumber") }}</span>
            <a-form-item class="withdraw-number">
              {{ dataResult.availableNumber }}
            </a-form-item>
            <span class="fn-total"> FN</span>
          </div>
          <div v-else style="padding-left: 95px;display: table-cell; vertical: bottom; line-height: 24px">
            <span class="withdraw-number-text" style="float: left">{{ $t("myreward.availableNumber") }}</span>
            <a-form-item class="withdraw-number">
              {{ dataResult.availableNumber }}
            </a-form-item>
            <span class="fn-total"> FN</span>
          </div>
          <div style="float: right">
            <div>
              <img class="toWithdraw-pic" src="~@/assets/toWithdraw.png">
            </div>
            <img v-if="currentLang === 'zh-CN'" class="withdraw-pic" src="~@/assets/withdraw.png"/>
            <img v-else class="withdraw-pic-en" src="~@/assets/withdraw.png"/>
            <span v-if="currentLang === 'zh-CN'" @click="toWithdraw" class="withdraw-button">{{ $t("myreward.withdrawButton") }}</span>
            <span v-else @click="toWithdraw" class="withdraw-button-en">{{ $t("myreward.withdrawButton") }}</span>
          </div>
        </div>
      </div>
      <div style="margin: 0 30px;">
      <table class="sub-content">
        <tr>
          <td style="width: 48%;">
            <div class="normal-content">
              <img class="released-pic" src="~@/assets/released.png">
              <div class="normal-text">
                <span class="number-text">{{ $t("myreward.releasedNumber") }}</span>
                <div>
                  <span class="normal-number">
                    {{ dataResult.releasedNumber }} FN
                  </span>
                </div>
              </div>
            </div>
          </td>
          <td style="width: 4%;"/>
          <td style="width: 48%;">
            <div class="normal-content">
              <img class="toRelease-pic" alt="Vue logo" src="~@/assets/toRelease.png">
              <div class="normal-text">
                <span class="number-text">{{ $t("myreward.toReleaseNumber") }}</span>
                <div>
                  <span class="normal-number">
                    {{ dataResult.toReleaseNumber }} FN
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
      </div>
    </a-form>
    </div>
    <div class="table-content">
    <div class="table-title">
      <span style="margin-top: 50px">{{ $t("myreward.withdrawRecord") }}</span>
    </div>
    <!-- 表格区域 -->
    <s-table
      ref="table"
      :pageSize="5"
      :rowKey="(record) => record.orderID"
      :columns="columns"
      :data="loadData"
      :alert="false"
      showPagination="auto"
      :pagination="pagination"
      :locale="{emptyText: emptyStr}"
      style="margin: 10px 30px 0 30px; width: -webkit-fill-available;"
    >
    </s-table>
    </div>

  </div>
</template>

<script>

    import moment from 'moment'
    import { STable } from '@/components'
    import { getWithdrawList } from '@/api/manage'
    import { mapState } from 'vuex'

    export default {
        name: 'MyReward',
        components: {
            STable
        },
        data () {
            return {
                dataResult: {},
                form: this.$form.createForm(this),
                visible: true,
                confirmLoading: true,
                mdl: null,
                // 查询参数
                queryParam: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const requestParameters = Object.assign({}, parameter, this.queryParam)
                    return getWithdrawList(requestParameters)
                        .then(res => {
                            this.dataResult = res.data
                            return res.data
                        })
                },
                selectedRowKeys: [],
                selectedRows: []
            }
        },
        methods: {
            toWithdraw () {
                this.$router.push({
                    path: '/center/withdraw'
                })
            }
        },
        computed: {
            ...mapState({
                currentLang: state => state.app.lang
            }),
            emptyStr: function () {
                return this.$t('myreward.table.emptytext')
            },
            pagination: function () {
                return {
                    defaultCurrent: 1,
                    defaultPageSize: 2,
                    showSizeChanger: true,
                    style: { textAlign: 'center', float: 'none' },
                    showTotal: function (total) {
                        return this.$t('pagination.info.total', [total])
                    }
                }
            },
            columns: function () {
                return [
                    {
                        title: this.$t('myreward.table.col.withdrawTime'),
                        dataIndex: 'withdrawTime',
                        align: 'center',
                        customRender: (text, row, index) => {
                            return moment(text).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    {
                        title: this.$t('myreward.table.col.orderID'),
                        dataIndex: 'orderID',
                        align: 'center'
                    },
                    {
                        title: this.$t('myreward.table.col.withdrawAmount'),
                        dataIndex: 'withdrawAmount',
                        align: 'center'
                    },
                    {
                        title: this.$t('myreward.table.col.status'),
                        dataIndex: 'status',
                        align: 'center',
                        customRender: (text, row, index) => {
                            if (text === '0') {
                                return this.$t('myreward.status.0')
                            } else {
                                return this.$t('myreward.status.1')
                            }
                        }
                    }
                ]
            }
        }
    }
</script>

<style lang="less" scoped>
  .info-content {
    background:rgba(255,255,255,1);
    box-shadow:1px 5px 16px 0px rgba(0,27,64,0.1);
    border-radius:4px;
    min-width: 600px;
    padding: 30px 30px 20px 30px;
  }
  .table-content {
    background:rgba(255,255,255,1);
    border-radius:4px;
    margin-top: 20px;
    padding: 0 30px 0 30px;
  }
  .title-content {
    background:linear-gradient(90deg,rgba(38,193,149,1) 0%,rgba(38,193,149,0.7) 100%);
    height:113px;
    border-radius:4px;
    color: #ffffff;
    margin: 0px 30px 15px 30px;
  }
  .title-total {
    font-size:16px;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
    float: left;
    margin: 26px 8px;
  }
  .title-withdraw {
    float: right;
    margin: 14px 0px;
  }
  .normal-text {
    font-family:Microsoft YaHei;
    line-height:25px;
    float: left;
    margin-top: 16px;
    margin-left: 5px;
  }
  .total-text {
    font-size: 16px;
    color: #ffffff;
  }
  .total-number {
    line-height: 38px;
    font-size: 38px;
    color: #ffffff;
    font-weight: bold;
    padding: 0;
    width: auto;
    resize: none;
    border: none;
    overflow: hidden;
    background-color: transparent;
    float: left;
  }
  .withdraw-number {
    float: left;
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    margin-top: -2px;
  }
  .withdraw-number-text {
    line-height: 14px;
    color: #ffffff;
    margin-top: 15px;
  }
  .normal-number {
    line-height: 16px;
    font-size: 16px;
    color: #162646;
    padding: 0;
    width: auto;
    resize: none;
    border: none;
    overflow: hidden;
    background-color: transparent;
    float: left;
  }
  .fn-text {
    float: left;
    margin-left: 2px;
    font-size: 16px;
    font-weight: bold;
    margin-top: 16px;
  }
  .normal-content {
    height:81px;
    border:1px solid rgba(225,225,225,1);
    border-radius:4px;
  }
  .sub-content {
    width: 100%
  }
  .table-title {
    color: #000;
    font-size: 25px;
    text-align: center;
    padding-top: 50px;
    font-weight:bold;
    color:rgba(22,38,70,1);
    line-height:24px;
  }
  .number-text {
    font-size: 12px;
    font-size: 12px;
    color: #81848D;
  }
  .ant-input:focus {
    box-shadow: none;
  }
  .toWithdraw-pic {
    margin: -24px -7px 0 0;
    float: right;
  }
  .withdraw-pic {
    width: 19px;
    height: 19px;
    margin: -39px 123px 0 0;
    float: right;
  }
  .withdraw-pic-en {
    width: 19px;
    height: 19px;
    margin: -39px 138px 0 0;
    float: right;
  }
  .withdraw-button {
    margin: -42px 32px 0 0 ;
    float: right;
    font-size: 16px;
    cursor: pointer;
  }
  .withdraw-button-en {
    margin: -42px 26px 0 0 ;
    float: right;
    font-size: 16px;
    cursor: pointer;
  }
  .released-pic {
    margin: 24px 0 24px 31px;
    float: left;
  }
  .fn-total {
    float: left;
    font-size: 14px;
    margin-top: 10px;
    margin-left: 2px
  }
  .toRelease-pic {
    margin: 24px 0 24px 31px;
    float: left;
  }
</style>
