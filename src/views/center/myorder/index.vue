<template>
  <a-card class="myorder" :bordered="false">
    <s-table
      ref="table"
      size="default"
      :rowKey="(record) => record.orderNo"
      :columns="columns"
      :data="loadData"
      :alert="false"
      showPagination="auto"
      :pageNum="currentPageNo"
      :pagination="pagination"
      :locale="{emptyText: emptyStr}"
      class="stable"
    >
      <span slot="action" slot-scope="text, record" id="action_items">
        <template>
          <!-- <a href="/center/myorder/detail" color="green" >{{ $t('myorder.table.more.detail') }}</a> -->
          <a @click="handleDetail(record)" style="color: #26C195;">{{ $t('myorder.table.more.detail') }}</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>
<script>
  import moment from 'moment'
  import { STable } from '@/components'
  import { getPledgeList, getPledgeConfrim } from '@/api/manage'
  import { formatFileSize2 } from '@/utils/util'
  import { mapActions, mapState } from 'vuex'
  export default {
    name: 'MyOrder',
    statusitems: {},
    components: {
      STable
    },
    data () {
      return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,
        updateInfoEvent: null,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          this.setPageNo(parameter.pageNo)
          return getPledgeList(requestParameters)
            .then(res => {
              return res.data
            })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    computed: {
      ...mapState({
        currentPageNo: (state) => state.pledge.master.currentPage
      }),
      statusitems: function () {
        return {
          0: this.$t('myorder.status.0'),
          1: this.$t('myorder.status.1'),
          2: this.$t('myorder.status.2')
        }
      },
      emptyStr: function () {
        return this.$t('myorder.table.emptytext')
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
            title: this.$t('myorder.table.col.orderId'),
            dataIndex: 'orderNo',
            align: 'center'
          },
          {
            title: this.$t('myorder.table.col.createTime'),
            dataIndex: 'createTime',
            align: 'center',
            customRender: (text, row, index) => {
              return moment(text).format('YYYY-MM-DD HH:mm')
            }
          },
          {
            title: this.$t('myorder.table.col.space'),
            dataIndex: 'spaceSize',
            align: 'center',
            customRender: (text, row, index) => {
              return formatFileSize2(text, 2, false, true)
            }
          },
          {
            title: this.$t('myorder.table.col.pledgeFnAmount'),
            dataIndex: 'pledgeFnAmount',
            align: 'center',
            customRender: (text, row, index) => {
              return text + this.$t('myorder.pledgeFnAmount.unit')
            }
          },
          {
            title: this.$t('myorder.table.col.pledgePeriod'),
            dataIndex: 'pledgePeriod',
            align: 'center',
            customRender: (text, row, index) => {
              return text + this.$t('myorder.pledgePeriod.unit')
            }
          },
          {
            title: this.$t('myorder.table.col.status'),
            dataIndex: 'status',
            align: 'center',
            customRender: (text, row, index) => {
              return this.statusitems[text]
            }
          },
          {
            title: this.$t('myorder.table.col.action'),
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            align: 'center'
          }
        ]
      },
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      ...mapActions(['setPageNo']),
      gettingPledgeInfo (flag) {
        clearTimeout(this.updateInfoEvent)
        this.updateInfoEvent = null
        const requestParameters = Object.assign({}, this.queryParam)
        getPledgeConfrim(requestParameters)
          .then(res => {
            if (res.data.buyConfirmingCnt > 0) {
              // 存在未确认定时确认
              this.updateInfoEvent = setTimeout(() => { this.gettingPledgeInfo(true) }, 10000)
            } else {
              if (flag) {
                this.$refs.table.refresh()
              }
              clearTimeout(this.updateInfoEvent)
              this.updateInfoEvent = null
            }
          })
      },
      handleSearch () {
        this.$refs.table.refresh()
      },
      handleDetail (record) {
        this.$router.push({
          path: '/center/myorder/detail',
          query: { orderNo: record.orderNo }
        })
      },
      handleCancel () {
        this.visible = false

        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      }
    },
    beforeDestroy () {
      clearTimeout(this.updateInfoEvent)
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/center/myorder/detail') {
        next()
      } else {
        this.setPageNo(1)
        next()
      }
    },
    mounted () {
      this.gettingPledgeInfo(false)
    }
  }
</script>

<style lang="less">
  .myorder{
    #action_items img{
      width: 17px;
      margin-right: 8px;
    }
    #action_more span{
      color: #333333;
      font-size: 12px;
    }
    #action_more .action-more-i{
      margin-right: -6px;
    }
    .stable{
      font-family:Microsoft YaHei;
      font-size:14px;
      width:934px;
    }
    .ant-table-thead > tr > th{
      height:35px;
      background:rgba(229,229,229,1);
    }
    .ant-table-thead > tr > th{
      height:35px;
      background:rgba(229,229,229,1);
    }
    .ant-table-thead > tr > th{
      padding: 6px 16px;
    }
    .ant-table-tbody > tr > td{
      padding: 9px 16px;
    }
  }
</style>
