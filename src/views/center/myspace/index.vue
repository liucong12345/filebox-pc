<template>
  <div class="myspace">
    <div class="content1">
      <a-row style="height: 40px;">
        <a-col>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <div class="headerlineclass"></div>
        </a-col>
      </a-row>
      <a-row style="height: 20px;"><a-col></a-col></a-row>
      <a-row >
        <a-col style="text-align: center;">
          <span class="headerclass">{{ this.$t('myspace.space1.header') }}</span>
        </a-col>
      </a-row>
      <a-row style="padding-top: 29px">
        <a-col class="code-box-demo">
          <span>{{ this.$t('myspace.space1.used') }} {{ this.currentSize|formatFileSize }}/{{
            this.totalSize|formatFileSize
              }}({{ percent.toFixed(2) }}%)</span>
        </a-col>
      </a-row>
      <a-row>
        <a-col style="margin-left: 268px;"><a-progress
          :percent="isSpaceOver?100:percent"
          :showInfo="false"
          :strokeColor="isSpaceOver?'#FF0000':'#26C195'"
          class="progress"/>
        </a-col>
      </a-row>
      <a-row style="height: 20px;"><a-col></a-col></a-row>
      <a-row>
        <a-col>
          <div style="text-align: right;margin-right: 41px">
            <span v-if="this.totalSize != 0"><a-button type="primary" @click="handleGotoBuy" class="button">{{ $t('myspace.space1.button1') }}</a-button></span>
            <span v-else><a-button
              type="primary"
              @click="handleGotoBuy"
              class="button">{{ $t('myspace.space1.button2') }}</a-button></span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div style="background-color: #f0f2f5;height: 19px"></div>
    <div class="content2">
      <a-row style="height: 40px;">
        <a-col>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <div class="headerlineclass"></div>
        </a-col>
      </a-row>
      <a-row style="height: 20px;"><a-col></a-col></a-row>
      <a-row >
        <a-col style="text-align: center;">
          <span class="headerclass">{{ this.$t('myspace.space2.header') }}</span>
        </a-col>
      </a-row>

      <a-row style="height: 19px;"><a-col></a-col></a-row>
      <a-row ><a-col>
        <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :pageSize="6"
        showPagination="auto"
        :pagination="pagination"
        :locale="{emptyText: emptyStr}"
        class="stable"
      >
      </s-table></a-col></a-row>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import { STable } from '@/components'
  import { getMyspaceInfo } from '@/api/manage'
  import { formatFileSize } from '@/utils/util'
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
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return getMyspaceInfo(requestParameters)
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
        currentSize: (state) => state.user.currentSize,
        totalSize: (state) => state.user.totalSize,
        isSpaceOver: (state) => state.user.currentSize > state.user.totalSize
      }),
      percent: function () {
        if (isNaN(this.currentSize) || isNaN(this.totalSize)) {
          return 0
        }

        if (this.totalSize <= 0) {
          return 0
        }

        if (this.currentSize > this.totalSize) {
          return 100
        }
        return Math.round(this.currentSize / this.totalSize * 100)
      },
      emptyStr: function () {
        return this.$t('myspace.space2.table.emptytext')
      },
      pagination: function () {
        return {
          defaultCurrent: 1,
          defaultPageSize: 6,
          style: { textAlign: 'center', float: 'none' },
          showTotal: function (total) {
            return this.$t('pagination.info.total', [total])
          }
        }
      },
      columns: function () {
        return [
          {
            key: 1,
            title: this.$t('myspace.space2.table.title.space'),
            dataIndex: 'spaceSize',
            align: 'right',
            className: 'rowclass1',
            customRender: (text, record) => {
              return formatFileSize(text, 2, false, true)
            }
          },
          {
            key: 2,
            title: this.$t('myspace.space2.table.title.totime'),
            align: 'left',
            className: 'rowclass2',
            customRender: (text, record) => {
              return this.totimeCalculate(record.createTime, record.pledgePeriod)
            }
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
      ...mapActions(['GetSpaceInfo']),
      handleGotoBuy () {
        this.$router.push('/buy')
      },
      handleSearch () {
        this.$refs.table.refresh()
      },
      handleDetail (record) {
        const files = []
        if (record) {
          files.push({ 'orderId': record.orderId })
        }
      },
      handleCancel () {
        this.visible = false

        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      handleSub (record) {
        if (record.status !== 0) {
          this.$message.info(`${record.no} 订阅成功`)
        } else {
          this.$message.error(`${record.no} 订阅失败，规则已关闭`)
        }
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      },
      totimeCalculate (createTime, pledgePeriod) {
        return moment(createTime).add(pledgePeriod, 'months').format('YYYY-MM-DD HH:mm')
      }
    },
    filters: {
      formatFileSize: function (fileSize) {
        if (fileSize != null && fileSize !== '') {
          return formatFileSize(fileSize, 2, false, true)
        } else {
          return ''
        }
      }
    },
    mounted () {
      const { GetSpaceInfo } = this
      GetSpaceInfo()
    }
  }
</script>

<style lang="less">
  .myspace{
    .stable {
      width:643px;
      height:44px;
      margin: 0 auto;
      font-family:Microsoft YaHei;
    }
    .ant-table-thead > tr {
      border-radius:4px;
    }
    .ant-table-thead > tr > th{
      background: #F0F0F0;
    }
    /*.ant-table-thead > tr > th{*/
    /*  padding: 11px 16px;*/
    /*  border-bottom: 0;*/
    /*}*/
    th.rowclass1,
    td.rowclass1 {
      padding-top: 11px;
      padding-right: 71px;
      width: 50%;
    }
    th.rowclass2,
    td.rowclass2 {
      padding-top: 11px;
      padding-left: 71px;
      width: 50%;
    }
    .content1 {
      width: 1014px;
      height: 232px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;

      #a-row{
        margin: 0 auto;
      }
    }

    .content2 {
      width:1014px;
      min-height:540px;
      background:rgba(255,255,255,1);
      border-radius:4px;

      #a-row{
        margin: 0 auto;
      }
    }

    .headerclass {
      width: 144px;
      height: 24px;
      font-size: 24px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(46, 50, 61, 1);
      line-height: 24px;
      margin: 0 auto;
    }

    .headerlineclass {
      width: 72px;
      height: 4px;
      background: rgba(38, 193, 149, 1);
      border-radius: 2px;
      margin: 0 auto;
    }

    .code-box-demo {
      height: 13px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(46, 50, 61, 1);
      line-height: 24px;
      margin-left: 266px;
    }

    .button {
      width: 156px;
      height: 40px;
      background: rgba(38, 193, 149, 1);
      border-radius: 4px;
    }

    .progress {
      width: 490px;
      height: 12px;
      border-radius: 6px;
      margin: 0 auto;
    }
  }
</style>
