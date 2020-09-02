<template>
  <div class="hash-search">
    <div style="text-align: center;"><span class="hs-title">{{ $t('hashsearch.title') }}</span></div>
    <div class="table-page-search-wrapper" style="margin-top: 20px">
      <a-form-model
        ref="hashSearchForm"
        :model="form"
        :rules="rules"
        layout="inline">
        <a-row>
          <a-col span="24">
            <a-form-model-item label="" ref="fileHash" prop="fileHash">
              <a-input
                v-model.trim="form.fileHash"
                :placeholder="$t('hashsearch.input.search.tip')"
                @pressEnter="handleCheckSpace(()=>{handleSearch()})">
                <a-icon slot="suffix" type="search" @click="handleCheckSpace(()=>{handleSearch()})"/>
              </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <a-table
      ref="table"
      style="margin-top: 14px"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading">
      <span slot="action" slot-scope="text, record" id="action_items">
        <template>
          <a @click="handleCheckSpace(()=>{handleDownload(record)})"><img src="~@/assets/download.png"></a>
          <a-dropdown :trigger="['hover']">
            <a style="margin-left: 8px;"><img
              src="~@/assets/copy.png"></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a
                  style="font-size:12px;font-weight:400;color:rgba(38,193,149,1);"
                  @click="handleCheckSpace(()=>{handleCopyIpfs(record)})">{{ $t('myfile.table.more.copyIpfs') }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </a-table>
    <a-modal
      class="hashsearch-modal"
      :width="371"
      :visible="visible"
      :footer="null"
      :closable="false"
      :destroyOnClose="true">
      <div class="modal-title">
        {{ messageBox.title }}
      </div>
      <div class="modal-content">
        {{ messageBox.message }}
      </div>
      <div class="modal-button">
        <div v-if="messageBox.showCancel" class="button-item" @click="messageBox.cancel()">{{ messageBox.cancelText }}
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
  import { getFileForHash } from '@/api/myfile'
  import { mapActions, mapState } from 'vuex'
  import { formatFileSize } from '@/utils/util'

  export default {
    name: 'HashSearch',
    data () {
      return {
        visible: false,
        dataSource: [],
        form: { fileHash: '' },
        loading: false
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
      rules () {
        return {
          fileHash: [
            { required: true, message: this.$t('hashsearch.validate.filehash.blank'), trigger: 'blur' }
          ]
        }
      },
      columns () {
        return [
          {
            title: this.$t('myfile.table.col.fileName'),
            dataIndex: 'fileName',
            ellipsis: true,
            width: '186px'
          },
          {
            title: this.$t('myfile.table.col.fileSize'),
            dataIndex: 'fileSize',
            align: 'center',
            customRender: (text, row, index) => formatFileSize(text, 0, true, false)
          },
          {
            title: this.$t('myfile.table.col.entryLoginDate'),
            dataIndex: 'entryLoginDate',
            align: 'center',
            customRender: (text, row, index) => moment(text).format('YYYY-MM-DD HH:mm')
          },
          {
            title: this.$t('myfile.table.col.action'),
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' },
            align: 'center'
          }
        ]
      }
    },
    mounted () {
      this.GetSpaceInfo().then(() => {
        this.handleCheckSpace()
      })
    },
    methods: {
      ...mapActions(['GetSpaceInfo']),
      // 执行空间检测
      handleCheckSpace (handle) {
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
      // 加载数据
      loadData (showInfo) {
        this.loading = true
        const requestParameters = Object.assign({}, this.form)
        getFileForHash(requestParameters)
          .then(res => {
            if (res.resultCode === '0' && res.data.data.length === 0) {
              Object.assign(this.messageBox, {
                message: this.$t('hashsearch.noFile.message'),
                okText: this.$t('confirm.ok'),
                showCancel: false,
                // okStyle: {},
                ok: () => {
                  this.visible = false
                }
              })
              this.visible = true
            }
            let idx = 1
            res.data.data.forEach(val => {
              val.key = idx++
            })
            this.dataSource = res.data.data
            this.loading = false
          })
      },
      // 执行检索
      handleSearch () {
        this.$refs.hashSearchForm.validate(valid => {
          if (valid) {
            this.loadData()
          } else {
            return false
          }
        })
      },
      // 执行下载
      handleDownload (record) {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = record.downloadUrl + '?filename=' + record.fileName
        link.target = '_blank'
        link.setAttribute('download', record.fileName)// 文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        this.$message.info(this.$t('myfile.download.finish.message'))
      },
      // 拷贝哈希码
      handleCopyIpfs (record) {
        this.$copyText(record.fileHash).then(function (e) {
          // OK
        }, function (e) {
          //
        })
      }
    }
  }
</script>

<style lang="less">
  .hash-search {
    font-family: Microsoft YaHei;
    width: 100%;
    padding: 51px 90px 0px;

    .ant-input {
      border:1px solid rgba(38,193,149,1);
      border-radius:4px;
      height: 40px;
      line-height: 40px;
    }
    .ant-input:hover {
      border-color: rgba(38,193,149,1);
    }
    .ant-input:focus {
      border-color: rgba(38,193,149,1);
      -webkit-box-shadow: 0 0 0 2px rgba(38,193,149, 0.2);
      box-shadow: 0 0 0 2px rgba(38,193,149, 0.2);
    }
    .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
      border-color: rgba(38,193,149,1);
    }
    .ant-input::-moz-placeholder {
      font-weight:400;
      color:rgba(194,198,210,1);
    }
    .ant-input:-ms-input-placeholder {
      font-weight:400;
      color:rgba(194,198,210,1);
    }
    .ant-input::-webkit-input-placeholder {
      font-weight:400;
      color:rgba(194,198,210,1);
    }

    .ant-table-column-title {
      font-weight: 400;
      color: rgba(46, 50, 61, 1);
    }

    .ant-table-thead > tr {
      border-radius: 4px;
    }

    .ant-table-thead > tr > th {
      background: #F0F0F0;
    }

    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
      padding: 11px 16px;
      border-bottom: 0;
    }

    .hs-title {
      font-size: 24px;
      font-weight: bold;
      color: rgba(22, 38, 70, 1);
      line-height: 24px;
    }

    #action_items img {
      width: 17px;
    }

    th[class*="ant-table-row-cell-ellipsis"] {
      text-align: center;
    }
  }

  .hashsearch-modal {
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
