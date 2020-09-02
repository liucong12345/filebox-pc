<template>
  <a-card :bordered="false" id="upload_area">
    <div>
      <a-row>
        <a-col :span="17">
          <div style="max-height:300px;overflow:auto;background:#EEEEEE;">
            <a-config-provider>
              <template v-if="noFile" #renderEmpty>
                <div style="text-align: center;padding-top: 80px;">
                  <p
                    style="
font-size:14px;
font-family:Microsoft YaHei;
font-weight:400;
color:rgba(129,132,141,1);
line-height:24px;"
                  >{{ $t('uploadfile.table.nofile.message') }}</p>
                  <template v-if="uploadComplete">
                    <div
                      style="width:165px;height:70px;background:rgba(225,225,225,1);border-radius:4px; margin: 0 auto;text-align:center;line-height: 70px;margin-top: 30px;"
                    >
                      <img
                        src="~@/assets/upload_success.png"
                        style="width: 22px;margin-right: 10px;"
                      />
                      <span class="ant-alert-message">{{ $t('uploadfile.upload.complete.success') }}</span>
                    </div>
                  </template>
                </div>
              </template>

              <a-table
                ref="table"
                size="default"
                :rowKey="record => record.fileIdx"
                :columns="columns"
                :dataSource="dataSource"
                :alert="false"
                :rowSelection="null"
                :pagination="false"
                :loading="loadingData"
                style="background-color:white;"
              >
                <span slot="fileSize" slot-scope="text, record">{{ record.fileSize|formatFileSize }}</span>
                <span slot="uploadPercentage" slot-scope="text, record">
                  <!-- <div style="position:relative"> -->
                  <div class="ant-progress-inner">
                    <div
                      class="ant-progress-bg"
                      :style="{'width':record.uploadPercentage+'%','height':'14px;border-radius','border-radius':'100px','line-height':'11px'}"
                    >
                      <span title class style="color:#FFFFFF">{{ record.uploadPercentage }}%</span>
                    </div>
                  </div>
                  <!-- <a-progress :percent="Math.round((record.loaded * 100) / record.fileSize)" :showInfo="false" height="12px"/>
                  <span style="position: absolute;top: 0;left: 40%;">{{ Math.round((record.loaded * 100) / record.fileSize) }}</span>-->
                  <!-- </div> -->
                </span>
                <span slot="action" slot-scope="text, record" id="action_items">
                  <template>
                    <a @click="handleRemove(record)">
                      <img src="~@/assets/uplodate_delete.png" style="width: 7px;" />
                    </a>
                  </template>
                </span>
              </a-table>
            </a-config-provider>
          </div>
          <div>
            <a-config-provider v-if="showFooter">
              <a-table
                ref="table"
                size="default"
                :showHeader="false"
                :rowKey="record => record.fileHash"
                :columns="columns"
                :dataSource="footerDataSource"
                :alert="false"
                :rowSelection="null"
                :pagination="false"
                :loading="false"
                id="footer"
                style="margin-top: 15px;"
              >
                <span slot="fileSize" slot-scope="text, record">{{ record.fileSize|formatFileSize }}</span>
                <span slot="uploadPercentage" slot-scope="text, record">
                  <div class="ant-progress-inner">
                    <div
                      class="ant-progress-bg"
                      :style="{'width':record.uploadPercentage+'%','height':'14px;border-radius','border-radius':'100px','line-height':'11px'}"
                    >
                      <span title class style="color:#FFFFFF">{{ record.uploadPercentage }}%</span>
                    </div>
                  </div>
                </span>
                <span slot="action" slot-scope id="action_items">
                  <template>
                    <a @click="handleRemoveAll()">
                      <img src="~@/assets/uplodate_delete.png" style="width: 7px;" />
                    </a>
                  </template>
                </span>
              </a-table>
            </a-config-provider>
          </div>
          <!-- </div> -->

          <div style="text-align: center">
            <a-button
              :disabled="false"
              type="primary"
              icon="upload"
              style="width:100%;text-align: center;margin-top: 355px;margin-bottom: 40px;"
              id="upload_button"
              @click="handleSelect()"
            >{{ this.$t('uploadfile.table.upload.button') }}</a-button>
          </div>
        </a-col>
        <a-col :span="7" style="padding:50px 0px 0px 20px">
          <div class="drop_area">
            <div style="margin: 80px;text-align: center">
              <div class="drop_img">
                <img src="~@/assets/drop_logo.png" />
              </div>
              <div class="drop_text">{{ this.$t('uploadfile.droparea.message') }}</div>
            </div>
          </div>
          <div style="display:none">
            <input type="file" multiple @change="beforeUpload" id="handleSelect" />
          </div>
        </a-col>
      </a-row>
      <a-modal
        class="uploadfile-modal"
        :width="371"
        :visible="loginModalVisible"
        :footer="null"
        :closable="false"
        :destroyOnClose="true"
      >
        <div class="modal-title">{{ $t('uploadfile.modal.login.title') }}</div>
        <div class="modal-content">{{ modalContent }}</div>
        <div class="modal-button">
          <div
            class="button-item"
            @click="handleBuySpaceCancel"
          >{{ $t('uploadfile.modal.login.button.cancel') }}</div>
          <div
            class="button-item"
            style="color: rgb(38, 193, 149);"
            @click="handleBuySpaceOk"
          >{{ $t('uploadfile.modal.login.button.ok') }}</div>
        </div>
      </a-modal>
    </div>
  </a-card>
</template>
<script>
import { STable } from '@/components'
import SparkMD5 from 'spark-md5'
import { formatFileSize } from '@/utils/util'
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import { checkfile, checkpeer, getMyspace, mergepeer, uploadpeer, checkmd5 } from '@/api/uploadfile'

export default {
  name: 'UplodFile',
  components: {
    STable
  },
  data () {
    return {
      // create model
      visible: false,
      confirmLoading: false,
      noFile: true,
      mdl: null,
      // 查询参数
      dataSource: [],
      footerDataSource: [],
      queryParam: {},
      hasSpace: null,
      selectedRowKeys: [],
      selectedRows: [],
      uploadComplete: false,
      loginModalVisible: false,
      cannotUpload: false,
      showFooter: false,
      modalContent: '',
      timer: '',
      loadingData: false,
      beforeunload: ''
    }
  },
  computed: {
    ...mapState({
      dfs: (state) => state.uploadfiles.dfs
    }),
    columns: function () {
      if (this.dataSource.length > 0) {
        return [
          {
            title: this.$t('myfile.table.col.fileName'),
            dataIndex: 'fileName',
            width: '250px',
            ellipsis: true,
            align: 'left'
          },
          {
            title: this.$t('myfile.table.col.fileSize'),
            dataIndex: 'fileSize',
            scopedSlots: { customRender: 'fileSize' },
            width: '100px',
            align: 'left'
          },
          {
            title: this.$t('myfile.table.col.uploadPercentage'),
            dataIndex: 'uploadPercentage',
            scopedSlots: { customRender: 'uploadPercentage' },
            width: '190px',
            align: 'center'
          },
          {
            title: this.$t('myfile.table.col.action'),
            dataIndex: 'action',
            width: 'auto',
            scopedSlots: { customRender: 'action' },
            align: 'center'
          }
        ]
      } else {
        return [
          {
            title: this.$t('myfile.table.col.fileName'),
            dataIndex: 'fileName',
            width: '300px',
            align: 'left'
          },
          {
            title: this.$t('myfile.table.col.fileSize'),
            dataIndex: 'fileSize',
            scopedSlots: { customRender: 'fileSize' },
            width: '80px',
            align: 'left'
          },
          {
            title: this.$t('myfile.table.col.action'),
            dataIndex: 'action',
            width: 'auto',
            scopedSlots: { customRender: 'action' },
            align: 'center'
          }
        ]
      }
    }
  },
  mounted: function () {
    this.timer = setInterval(this.getUploadedStatus, 3000)
    // 删除表格底部线条
    const x = document.getElementsByClassName('ant-table-placeholder')
    if (x.length > 0) {
      x[0].style.borderBottom = 'none'
    }
    var html = document.querySelector('body')
    html.addEventListener('dragenter', this.onDrag, false)
    html.addEventListener('dragover', this.onDrag, false)
    html.addEventListener('drop', this.onDrag, false)
    var dropbox = document.querySelector('.drop_area')
    dropbox.addEventListener('dragenter', this.onDrag, false)
    dropbox.addEventListener('dragover', this.onDrag, false)
    dropbox.addEventListener('drop', this.onDrop, false)
    this.checkSpace()
    this.GetSpaceInfo()
    this.loading()
  },
  methods: {
    ...mapActions([
      'addUploadFile',
      'rmUploadFile',
      'UploadFileLoading',
      'updateFooterDataSource',
      'updateBeforeunload',
      'GetSpaceInfo',
      'rmAllUploadFile'
    ]),

    // 刷新事件处理
    beforeunloadHandler: function (e) {
      if (e) {
        e.returnValue = '关闭提示'
      }
      return '关闭提示'
    },
    // 上传按钮处理
    checkSpace2: async function () {
      var parameter = {}
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      var res = await getMyspace(requestParameters)
      if (res.data.netSpace === 0 && res.data.usedSpace !== 0) {
        this.modalContent = this.$t('uploadfile.modal.nospace.content')
        this.loginModalVisible = true
        return false
      } else if (res.data.netSpace === 0 && res.data.usedSpace === 0) {
        this.modalContent = this.$t('uploadfile.modal.login.content')
        this.loginModalVisible = true
        return false
      } else if (res.data.netSpace < res.data.usedSpace) {
        this.modalContent = this.$t('uploadfile.modal.noenoughspace.content')
        this.loginModalVisible = true
        return false
      } else if (res.data.netSpace === res.data.usedSpace) {
        this.modalContent = this.$t('uploadfile.modal.noenoughspace.content1')
        this.loginModalVisible = true
        return false
      }
      var needUploadSize = 0
      for (var i = 0; i < this.dfs.files.length; i++) {
        if (this.dfs.files[i].uploadPercentage === 100) {
          continue
        }
        needUploadSize = needUploadSize + this.dfs.files[i].fileObj.size
        if (res.data.usedSpace + needUploadSize > res.data.netSpace) {
          this.modalContent = this.$t('uploadfile.modal.noenoughspace.content1')
          this.loginModalVisible = true
          return false
        }
      }
      return true
    },

    // 待上传文件移除处理
    handleRemove: function (record) {
      record.statuscode = -3
      for (var i = 0; i < this.dfs.files.length; i++) {
        if (this.dfs.files[i].fileHash === record.fileHash) {
          this.dfs.files.splice(i, 1)
          this.footerDataSource[0].fileSize = this.footerDataSource[0].fileSize - record.fileSize
          let allLoaded = 0
          let allTotal = 0
          for (var k = 0; k < this.dfs.files.length; k++) {
            allLoaded = allLoaded + this.dfs.files[k].loaded
            allTotal = allTotal + this.dfs.files[k].fileSize
          }
          this.footerDataSource[0].loaded = allLoaded
          this.footerDataSource[0].uploadPercentage = Math.round((allLoaded * 100) / allTotal)
          if (this.footerDataSource[0].uploadPercentage >= 100) {
            this.footerDataSource[0].uploadPercentage = 99
          }
          this.updateFooterDataSource(this.footerDataSource[0])
          if (this.dfs.files.length > 0) {
            this.showFooter = true
            this.noFile = false
          } else {
            this.showFooter = false
            this.noFile = true
          }

          break
        }
      }
      this.dataSource = this.dfs.files
      var parameter = {}
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      return getMyspace(requestParameters).then((res) => {
        if (res.data.netSpace === 0 && res.data.usedSpace !== 0) {
          this.modalContent = this.$t('uploadfile.modal.nospace.content')
          this.loginModalVisible = true
        } else if (res.data.netSpace === 0 && res.data.usedSpace === 0) {
          this.modalContent = this.$t('uploadfile.modal.login.content')
          this.loginModalVisible = true
        } else if (res.data.netSpace < res.data.usedSpace) {
          this.modalContent = this.$t('uploadfile.modal.noenoughspace.content')
          this.loginModalVisible = true
        } else if (res.data.netSpace === res.data.usedSpace) {
          this.modalContent = this.$t('uploadfile.modal.noenoughspace.content1')
          this.loginModalVisible = true
        }
        var needUploadSize = 0
        for (var i = 0; i < this.dfs.files.length; i++) {
          if (this.dfs.files[i].uploadPercentage === 100) {
            continue
          }
          needUploadSize = needUploadSize + this.dfs.files[i].fileObj.size
          if (res.data.usedSpace + needUploadSize > res.data.netSpace) {
            this.cannotUpload = true
            return
          }
        }
        this.cannotUpload = false
      })
    },
    // 待上传文件全部移除处理
    handleRemoveAll: function () {
      for (const item of this.dfs.files) {
        item.statuscode = -3
      }
      this.dfs.files.splice(0, this.dfs.files.length)
      this.dataSource = this.dfs.files
      this.footerDataSource[0].fileSize = 0
      this.footerDataSource[0].loaded = 0
      this.footerDataSource[0].uploadPercentage = 0
      this.updateFooterDataSource(this.footerDataSource[0])
      this.showFooter = false
      this.noFile = true
      var parameter = {}
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      return getMyspace(requestParameters).then((res) => {
        if (res.data.netSpace === 0 && res.data.usedSpace !== 0) {
          this.modalContent = this.$t('uploadfile.modal.nospace.content')
          this.loginModalVisible = true
        } else if (res.data.netSpace === 0 && res.data.usedSpace === 0) {
          this.modalContent = this.$t('uploadfile.modal.login.content')
          this.loginModalVisible = true
        } else if (res.data.netSpace < res.data.usedSpace) {
          this.modalContent = this.$t('uploadfile.modal.noenoughspace.content')
          this.loginModalVisible = true
        } else if (res.data.netSpace === res.data.usedSpace) {
          this.modalContent = this.$t('uploadfile.modal.noenoughspace.content1')
          this.loginModalVisible = true
        }
        var needUploadSize = 0
        for (var i = 0; i < this.dfs.files.length; i++) {
          if (this.dfs.files[i].uploadPercentage === 100) {
            continue
          }
          needUploadSize = needUploadSize + this.dfs.files[i].fileObj.size
          if (res.data.usedSpace + needUploadSize > res.data.netSpace) {
            this.cannotUpload = true
            return
          }
        }
        this.cannotUpload = false
      })
    },
    onDrag: function (e) {
      e.stopPropagation()
      e.preventDefault()
    },
    onDrop: async function (e) {
      e.stopPropagation()
      e.preventDefault()
      const dt = e.dataTransfer
      const list = []
      var hasFile = false
      const files = dt.files
      this.loadingData = true
      const hashSpace2 = await this.checkSpace2()
      if (hashSpace2 === false) {
        this.rmAllUploadFile()
        this.loadingData = false
        return false
      }
      for (let i = 0; i < files.length; i++) {
        const spark = new SparkMD5()
        spark.append(files[i].name)
        spark.append(Date.now())
        const fileHash = spark.end()
        const item = {
          fileIdx: fileHash,
          fileHash: fileHash,
          fileName: files[i].name,
          fileSize: files[i].size,
          fileObj: files[i],
          fileDate: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
          loaded: 0,
          statuscode: -1,
          isChecked: false,
          uploadPercentage: 0,
          peers: []
        }
        const checkItem = {
          fileIdx: fileHash,
          fileHash: fileHash,
          fileName: files[i].name,
          fileSize: files[i].size,
          fileObj: files[i],
          fileDate: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
          loaded: 0,
          statuscode: -1,
          isChecked: false,
          uploadPercentage: 0,
          peers: []
        }
        const res = await this.checkFile(checkItem, 1024 * 1024)
        console.log(res.data.code)
        if (res.data.code === 0) {
          hasFile = true
          continue
        }
        if (res.data.code === 1) {
          item.statuscode = -2
          item.fileHash = res.data.fileHash
          item.uploadPercentage = 100
          this.GetSpaceInfo()
        }
        if (res.data.code === 2) {
          const hashSpace = await this.checkSpace2()
          if (hashSpace === false) {
            this.rmAllUploadFile()
            this.loadingData = false
            return false
          }
          this.modalContent = this.$t('uploadfile.modal.noenoughspace.content1')
          this.loginModalVisible = true
          this.loadingData = false
          this.rmAllUploadFile()
          return false
        }
        this.addUploadFile(item)
        list.push(item)
      }
      this.loadingData = false
      if (hasFile) {
        this.$info({
          title: this.$t('confirm.title'),
          content: this.$t('uploadfile.upload.hasFile.message')
        })
      }
      const hashSpace = await this.checkSpace2()
      if (hashSpace === false) {
        this.rmAllUploadFile()
        return false
      }

      this.footerDataSource[0].fileSize = 0
      for (const item of this.dataSource) {
        this.footerDataSource[0].fileSize = this.footerDataSource[0].fileSize + item.fileSize
      }
      // if (this.dataSource.length !== 0) {
      //   window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
      //   window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
      // }
      for (const item of list) {
        if (item.statuscode === -2) {
          item.statuscode = 0
          this.footerDataSource[0].loaded = this.footerDataSource[0].loaded + item.fileSize
          if (this.footerDataSource[0].fileSize === 0) {
            this.footerDataSource[0].uploadPercentage = 99
          } else {
            this.footerDataSource[0].uploadPercentage = Math.round(
              (this.footerDataSource[0].loaded * 100) / this.footerDataSource[0].fileSize
            )
          }
          if (this.footerDataSource[0].uploadPercentage >= 100) {
            this.footerDataSource[0].uploadPercentage = 99
          }
          continue
        }
        await this.chunkFile(item, 1024 * 1024)
      }
      return false
    },
    // 判断可用空间是否充足
    checkSpace: async function () {
      var parameter = {}
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      const res = await getMyspace(requestParameters)
        if (res.data.netSpace === 0 && res.data.usedSpace !== 0) {
          this.modalContent = this.$t('uploadfile.modal.nospace.content')
          this.loginModalVisible = true
          return false
        } else if (res.data.netSpace === 0 && res.data.usedSpace === 0) {
          this.modalContent = this.$t('uploadfile.modal.login.content')
          this.loginModalVisible = true
          return false
        } else if (res.data.netSpace < res.data.usedSpace) {
          this.modalContent = this.$t('uploadfile.modal.noenoughspace.content')
          this.loginModalVisible = true
          return false
        } else if (res.data.netSpace === res.data.usedSpace) {
          this.modalContent = this.$t('uploadfile.modal.noenoughspace.content1')
          this.loginModalVisible = true
          return false
        } else {
          return true
        }
    },
    // 模态框取消按钮处理
    handleBuySpaceCancel: function () {
      this.loginModalVisible = false
      this.cannotUpload = true
    },
    // 模态框确认按钮处理
    handleBuySpaceOk: function () {
      this.loginModalVisible = false
      this.$router.push('/buy')
    },
    handleSelect: async function () {
      const hashSpace2 = await this.checkSpace()
      if (hashSpace2 === false) {
        return
      }
      var btn = document.getElementById('handleSelect')
      btn.click()
    },
    beforeUpload: async function () {
      var dt = event.target
      const list = []
      var hasFile = false
      const files = dt.files
      this.loadingData = true
      const hashSpace2 = await this.checkSpace2()
      if (hashSpace2 === false) {
        this.rmAllUploadFile()
        this.loadingData = false
        return false
      }
      for (let i = 0; i < files.length; i++) {
        const spark = new SparkMD5()
        spark.append(files[i].name)
        spark.append(Date.now())
        const fileHash = spark.end()
        const item = {
          fileIdx: fileHash,
          fileHash: fileHash,
          fileName: files[i].name,
          fileSize: files[i].size,
          fileObj: files[i],
          fileDate: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
          loaded: 0,
          statuscode: -1,
          isChecked: false,
          uploadPercentage: 0,
          peers: []
        }
        const checkItem = {
          fileIdx: fileHash,
          fileHash: fileHash,
          fileName: files[i].name,
          fileSize: files[i].size,
          fileObj: files[i],
          fileDate: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
          loaded: 0,
          statuscode: -1,
          isChecked: false,
          uploadPercentage: 0,
          peers: []
        }
        const res = await this.checkFile(checkItem, 1024 * 1024)
        if (res.data.code === 0) {
          hasFile = true
          continue
        }
        if (res.data.code === 1) {
          item.statuscode = -2
          item.fileHash = res.data.fileHash
          item.uploadPercentage = 100
          this.GetSpaceInfo()
        }
        if (res.data.code === 2) {
          const hashSpace = await this.checkSpace2()
          if (hashSpace === false) {
            this.rmAllUploadFile()
            this.loadingData = false
            return false
          }
          this.modalContent = this.$t('uploadfile.modal.noenoughspace.content1')
          this.loginModalVisible = true
          this.loadingData = false
          return false
        }
        this.addUploadFile(item)
        list.push(item)
      }
      this.loadingData = false
      if (hasFile) {
        this.$info({
          title: this.$t('confirm.title'),
          content: this.$t('uploadfile.upload.hasFile.message')
        })
      }
      var hashSpace = await this.checkSpace2()
      if (hashSpace === false) {
        this.rmAllUploadFile()
        return
      }
      this.footerDataSource[0].fileSize = 0
      for (const item of this.dataSource) {
        this.footerDataSource[0].fileSize = this.footerDataSource[0].fileSize + item.fileSize
      }
      for (const item of list) {
        if (item.statuscode === -2) {
          item.statuscode = 0
          this.footerDataSource[0].loaded = this.footerDataSource[0].loaded + item.fileSize
          if (this.footerDataSource[0].fileSize === 0) {
            this.footerDataSource[0].uploadPercentage = 99
          } else {
            this.footerDataSource[0].uploadPercentage = Math.round(
              (this.footerDataSource[0].loaded * 100) / this.footerDataSource[0].fileSize
            )
          }
          if (this.footerDataSource[0].uploadPercentage >= 100) {
            this.footerDataSource[0].uploadPercentage = 99
          }
          continue
        }
        await this.chunkFile(item, 1024 * 1024)
      }
      return false
    },
    chunkFile: async function (item, chunkSize = 10) {
      const _this = this
      item.loaded = 0
      var file = item.fileObj
      // if (file.size === 0) {
      //   this.$info({
      //     title: this.$t('confirm.title'),
      //     content: this.$t('uploadfile.upload.emptyFile.content')
      //   })
      //   return
      // }

      var chunks = Math.ceil(file.size / chunkSize)
      var start = 0
      var end = 0
      const promise = (start, end, curindex) =>
        new Promise(function (resolve, reject) {
          var spark = new SparkMD5() // 创建md5对象（基于SparkMD5）
          var fileReader = new FileReader()
          fileReader.readAsBinaryString(file.slice(start, end))
          fileReader.onload = function (e) {
            spark.appendBinary(e.target.result)
            var md5 = spark.end()
            var hashItem = {
              index: curindex,
              length: end,
              hash: md5,
              status: false
            }
            const params = {
              hash: md5,
              data: ''
            }
            checkpeer(params)
              .then((res) => {
                if (res.data.code === 0) {
                  item.peers.push(hashItem)
                  hashItem.status = true
                  item.loaded = item.loaded + chunkSize
                  if (item.fileSize === 0) {
                    item.uploadPercentage = 99
                  } else {
                    item.uploadPercentage = Math.round((item.loaded * 100) / item.fileSize)
                  }
                  if (item.uploadPercentage >= 100) {
                    item.uploadPercentage = 99
                  }
                  _this.footerDataSource[0].loaded = _this.footerDataSource[0].loaded + chunkSize
                  if (_this.footerDataSource[0].fileSize === 0) {
                    _this.footerDataSource[0].uploadPercentage = 99
                  } else {
                    _this.footerDataSource[0].uploadPercentage = Math.round(
                      (_this.footerDataSource[0].loaded * 100) / _this.footerDataSource[0].fileSize
                    )
                  }
                  if (_this.footerDataSource[0].uploadPercentage >= 100) {
                    _this.footerDataSource[0].uploadPercentage = 99
                  }
                  resolve()
                } else {
                  const buffer = Buffer.from(e.target.result, 'binary')
                  params.data = buffer.toString('base64')
                  uploadpeer(params)
                    .then((res) => {
                      item.peers.push(hashItem)
                      hashItem.status = true
                      item.loaded = item.loaded + chunkSize
                      if (item.fileSize === 0) {
                        item.uploadPercentage = 99
                      } else {
                        item.uploadPercentage = Math.round((item.loaded * 100) / item.fileSize)
                      }
                      if (item.uploadPercentage >= 100) {
                        item.uploadPercentage = 99
                      }
                      _this.footerDataSource[0].loaded = _this.footerDataSource[0].loaded + chunkSize
                      if (_this.footerDataSource[0].fileSize === 0) {
                        _this.footerDataSource[0].uploadPercentage = 99
                      } else {
                        _this.footerDataSource[0].uploadPercentage = Math.round(
                          (_this.footerDataSource[0].loaded * 100) / _this.footerDataSource[0].fileSize
                        )
                      }
                      if (_this.footerDataSource[0].uploadPercentage >= 100) {
                        _this.footerDataSource[0].uploadPercentage = 99
                      }
                      resolve()
                    })
                    .catch((e) => reject(e))
                }
              })
              .catch((e) => reject(e))
          }
        })
      for (let curindex = 0; curindex < chunks; curindex++) {
        if (file.size - start <= chunkSize) {
          end = file.size
        } else {
          end = start + chunkSize
        }
        if (item.statuscode === -3) {
          return
        }
        while (true) {
          const { address } = this.$store.state.user
          // if already logout
          if (!address) {
            // clear state
            this.dfs.files.splice(0, this.dfs.files.length)
            return
          }
          try {
            await promise(start, end, curindex)
            break
          } catch {}
        }
        start = end
      }
      if (chunks === 0) {
        await promise(0, 0, 0)
      }
      var sortedPeers = item.peers.sort(function (a, b) {
        return a.index - b.index
      })
      var mergePeers = []
      var spark = new SparkMD5()
      for (let idx = 0; idx < sortedPeers.length; idx++) {
        mergePeers.push(sortedPeers[idx].hash)
        spark.append(sortedPeers[idx].hash)
      }
      var hexHash = spark.end()
      item.fileHash = hexHash
      const mergeParams = {
        mergeHash: mergePeers,
        fileName: file.name,
        fileSize: file.size,
        hash: hexHash,
        data: ''
      }
      while (true) {
        try {
          const res = await mergepeer(mergeParams)
          item.statuscode = res.data.code
          if (item.statuscode === 1) {
            item.uploadStatus = false
            item.status = false
            var aElements = document.getElementsByTagName('tr')
            for (var k = 0; k < aElements.length; k++) {
              if (aElements[k].getAttribute('data-row-key') === null) {
                continue
              }
              if (aElements[k].getAttribute('data-row-key') === item.fileHash) {
                aElements[k].style.backgroundColor = 'red'
                // break
              }
            }
            _this.$info({
              title: _this.$t('confirm.title'),
              content: _this.$t('uploadfile.upload.hasFile.message')
            })
          }
          break
        } catch {}
      }
    },
    checkFile: async function (item, chunkSize = 10) {
      item.loaded = 0
      var file = item.fileObj

      var chunks = Math.ceil(file.size / chunkSize)
      var start = 0
      var end = 0
      const promise = (start, end, curindex) =>
        new Promise(function (resolve, reject) {
          var spark = new SparkMD5() // 创建md5对象（基于SparkMD5）
          var fileReader = new FileReader()
          fileReader.readAsBinaryString(file.slice(start, end))
          fileReader.onload = function (e) {
            spark.appendBinary(e.target.result)
            var md5 = spark.end()
            var hashItem = {
              index: curindex,
              length: end,
              hash: md5,
              status: false
            }
            item.peers.push(hashItem)
            resolve()
          }
        })
      for (let curindex = 0; curindex < chunks; curindex++) {
        if (file.size - start <= chunkSize) {
          end = file.size
        } else {
          end = start + chunkSize
        }
        await promise(start, end, curindex)
        start = end
      }
      if (chunks === 0) {
        await promise(0, 0, 0)
      }
      var sortedPeers = item.peers.sort(function (a, b) {
        return a.index - b.index
      })
      var mergePeers = []
      var spark = new SparkMD5()
      for (let idx = 0; idx < sortedPeers.length; idx++) {
        mergePeers.push(sortedPeers[idx].hash)
        spark.append(sortedPeers[idx].hash)
      }
      const hexHash = spark.end()
      const params = {
        fileName: item.fileName,
        hash: hexHash,
        data: ''
      }
      const res = await checkmd5(params)
      return res
    },
    loading: function () {
      this.dataSource = this.dfs.files
      this.beforeunload = this.dfs.beforeunload
      if (this.dataSource.length > 0) {
        this.noFile = false
        this.showFooter = true
        this.footerDataSource[0] = this.dfs.footerDataSource
      } else {
        this.noFile = true
        this.showFooter = false
        var footerDataSource = {
          fileHash: 'footerHash',
          fileName: this.$t('uploadfile.table.total.filename'),
          fileSize: 0,
          loaded: 0,
          uploadPercentage: 0
        }
        this.footerDataSource[0] = footerDataSource
        this.updateFooterDataSource(footerDataSource)
        this.beforeunload = this.beforeunloadHandler
        this.updateBeforeunload(this.beforeunload)
      }
    },
    getUploadedStatus: async function () {
      var _this = this
      var uploadOk = true
      if (this.dfs.files.length === 0) {
        return
      }
      for (let j = 0; j < this.dfs.files.length; j++) {
        if (this.dfs.files[j].statuscode !== 0) {
          uploadOk = false
        }
      }
      // 所有文件都上传成功的场合
      if (uploadOk === true) {
        // this.dfs.files = []
        this.dfs.files.splice(0, this.dfs.files.length)
        this.dataSource = this.dfs.files
        this.uploadComplete = true
        setTimeout(function () {
          _this.uploadComplete = false
        }, 5000)
        this.showFooter = false
        this.noFile = true
        this.footerDataSource[0].fileSize = 0
        this.footerDataSource[0].loaded = 0
        this.updateFooterDataSource(this.footerDataSource[0])
      }
      for (let i = 0; i < this.dfs.files.length; i++) {
        const item = this.dfs.files[i]
        if (item.statuscode !== -2) {
          continue
        }
        const params = {
          fileName: item.fileName,
          hash: item.fileHash,
          data: ''
        }
        await checkfile(params).then((res) => {
          if (res.data.code === 0) {
            item.statuscode = 0
            item.fileHash = res.data.fileHash
            item.uploadPercentage = 100
            this.GetSpaceInfo()
          }
        })
      }
    }
  },
  filters: {
    // 格式化文件大小显示
    formatFileSize: function (fileSize) {
      if (fileSize != null && fileSize !== '') {
        return formatFileSize(fileSize)
      } else {
        return ''
      }
    }
  },
  watch: {
    dataSource: function () {
      this.$nextTick(function () {
        // 删除表格底部线条
        const x = document.getElementsByClassName('ant-table-placeholder')
        if (x.length > 0) {
          x[0].style.borderBottom = 'none'
        }
        if (this.dataSource.length > 0) {
          window.addEventListener('beforeunload', this.beforeunload)
          this.showFooter = true
        } else {
          window.removeEventListener('beforeunload', this.beforeunload)
          this.showFooter = false
        }
      })
    }
  },
  created () {
    // this.beforeunload = this.beforeunloadHandler
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  destroyed () {
    // window.removeEventListener('beforeunload', this.beforeunload)
  }
}
</script>

<style lang="less">
#upload_area .ant-table-thead > tr > th .ant-table-header-column {
  font-size: 16px;
  font-family: Microsoft YaHei;
  color: rgba(46, 50, 61, 1);
  line-height: 24px;
  font-weight: 400;
}

#upload_area .ant-progress-bg {
  height: 12px;
  background-color: #26c195;
}

#upload_area .ant-table-thead > tr > th {
  padding: 16px 0px;
  background-color: white;
  // padding-left: 54px;
}

#upload_area .ant-table-tbody > tr > td {
  padding: 1px 1px;
  border-bottom: none;
  // padding-left: 54px;
}

#upload_area #footer .ant-table-tbody > tr > td {
  padding: 16px 1px;
  border-bottom: none;
  border-top: 1px solid #e5e5e5;
  // padding-left: 54px;
}

#upload_area .ant-table-thead > tr > th:first-child {
  padding-left: 54px;
}

#upload_area #footer .ant-table-tbody > tr > td:first-child {
  padding-left: 54px;
}

#upload_area .ant-table-tbody > tr > td:first-child {
  padding-left: 54px;
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

.drop_area {
  width: 259px;
  height: 211px;
  border: 2px dashed rgba(187, 187, 187, 1);
  border-radius: 4px;
}

.drop_img {
}

.drop_text {
  width: 99px;
  height: 12px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 70px;
}

#upload_button {
  width: 635px;
  height: 44px;
  background: rgba(224, 246, 240, 1);
  border-radius: 4px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(38, 193, 149, 1);
  line-height: 24px;
  border: none;
}

@red: #ff0000;
.uploadfile-modal {
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
