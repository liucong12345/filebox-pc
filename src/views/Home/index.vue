<template>
  <div class="home-content">
    <div style="width: 100%">
      <div style="width: 1274px;margin: 0 auto;padding-bottom: 170px;padding-top: 200px;padding-left: 11px">
        <a-row>
          <a-col :span="12" style="max-width: 615px">
            <a-row>
              <a-col>
                <div class="text-1-1">{{ $t('home.text.1.1') }}</div>
                <div class="text-1-2">{{ $t('home.text.1.2') }}</div>
                <div class="text-1-3">{{ $t('home.text.1.3') }}</div>
              </a-col>
            </a-row>
            <a-row style="margin-top: 30px">
              <a-col>
                <a-button style="height: 44px;border-radius: 4px;padding: 0 30px" type="primary" @click="handleGotoBuy">{{ $t('home.button.buy') }}</a-button>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12" style="padding-left: 64px">
            <img width="583px" height="369px" src="~@/assets/index.png">
          </a-col>
        </a-row>
      </div>
    </div>
    <div style="background:rgba(240,246,254,1); padding: 110px 0 206px;width: 100%;">
      <div style="width: 1224px;margin: 0 auto;">
        <div class="top-line"></div>
        <div class="text-title">
          <span>{{ $t('home.text.2.1') }}</span>
        </div>
        <div style="margin-top: 52px;overflow: hidden;position: relative;">
          <div style="width: 305px;float: left">
            <div style="text-align: center;">
              <img class="text2-img" src="~@/assets/index-s.png">
              <div class="text2-title">{{ $t('home.text.2.2.1') }}</div>
              <div class="text2-content">{{ $t('home.text.2.2.2') }}</div>
            </div>
          </div>
          <div style="width: 232px;float: left;margin-top: 72px;margin-left: 93px;">
            <div style="text-align: center;">
              <img class="text2-img" src="~@/assets/index-dc.png">
              <div class="text2-title">{{ $t('home.text.2.3.1') }}</div>
              <div class="text2-content">{{ $t('home.text.2.3.2') }}</div>
            </div>
          </div>
          <div style="width: 232px;float: left;margin-left: 71px">
            <div style="text-align: center;">
              <img class="text2-img" src="~@/assets/index-safe.png">
              <div class="text2-title">{{ $t('home.text.2.4.1') }}</div>
              <div class="text2-content">{{ $t('home.text.2.4.2') }}</div>
            </div>
          </div>
          <div style="width: 232px;float: left;margin-top: 72px;margin-left: 59px">
            <div style="text-align: center;">
              <img class="text2-img" src="~@/assets/index-fn.png">
              <div class="text2-title">{{ $t('home.text.2.5.1') }}</div>
              <div class="text2-content" style="width: 200px">{{ $t('home.text.2.5.2') }}</div>
            </div>
          </div>
          <img class="c-line" style="top: 102px;left: 234px;" src="~@/assets/dash-cline2.png">
          <img class="c-line" style="top: 48px;left: 564px;" src="~@/assets/dash-cline1.png">
          <img class="c-line" style="top: 93px;left: 867px;" src="~@/assets/dash-cline2.png">
        </div>
      </div>
    </div>
    <div style="padding: 110px 0 50px;width: 100%">
      <div style="width: 1257px;margin: 0 auto;">
        <div class="top-line"></div>
        <div class="text-title">
          <span>{{ $t('home.text.3.1') }}</span>
        </div>
        <div style="padding-top: 48px;">
          <div style="width: 705px;margin: 0 0 0 auto;">
            <div class="text3-index-div">
              <img class="text3-img1" src="~@/assets/index-bg.png">
              <span class="text3-index">1</span>
            </div>
            <div style="text-align: center;margin-top: 25px"><span class="text3-txt">{{ $t('home.text.3.2') }}</span></div>
            <img v-if="currentLang === 'zh-CN'" width="705px" height="479px" src="~@/assets/step-1.png">
            <img v-else width="705px" height="479px" src="~@/assets/step-1_us.png">
          </div>
          <div style="width: 705px;margin-top: -30px">
            <div class="text3-index-div">
              <img class="text3-img1" src="~@/assets/index-bg.png">
              <span class="text3-index">2</span>
            </div>
            <div style="text-align: center;margin-top: 25px"><span class="text3-txt">{{ $t('home.text.3.3') }}</span></div>
            <img v-if="currentLang === 'zh-CN'" width="705px" height="480px" src="~@/assets/step-2.png">
            <img v-else width="705px" height="480px" src="~@/assets/step-2_us.png">
          </div>
          <div style="width: 705px;margin: 21px 27px 0 auto;">
            <div class="text3-index-div">
              <img class="text3-img1" src="~@/assets/index-bg.png">
              <span class="text3-index">3</span>
            </div>
            <div style="text-align: center;margin-top: 25px"><span class="text3-txt">{{ $t('home.text.3.4') }}</span></div>
            <img v-if="currentLang === 'zh-CN'"  width="705px" height="479px" src="~@/assets/step-3.png">
            <img v-else width="705px" height="479px" src="~@/assets/step-3_us.png">
          </div>
        </div>
      </div>
    </div>
    <div style="padding: 40px 0 22px;background-color: #EFF3F8;">
      <div class="home-footer">
        <div class="footer-col">
          <div class="footer-row-title">{{ $t('home.footer.1') }}</div>
          <div><span class="footer-link" @click="()=>{this.$router.push('/about')}">{{ $t('home.footer.1.1') }}</span></div>
          <div>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>contact@filebox.plus</span>
              </template>
              <span>{{ $t('home.footer.1.2') }}</span>
            </a-tooltip>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-row-title">{{ $t('home.footer.2') }}</div>
          <div><a target="_blank" href="http://filenet.io/page/index_EN.html">{{ $t('home.footer.2.1') }}</a></div>
          <div><a target="_blank" href="https://www.wormhs.com/">{{ $t('home.footer.2.2') }}</a></div>
        </div>
        <div class="footer-col">
          <div class="footer-row-title">{{ $t('home.footer.3') }}</div>
          <div><a target="_blank" href="https://twitter.com/FileboxGlobal">{{ $t('home.footer.3.1') }}</a></div>
          <div><a target="_blank" href="https://www.reddit.com/user/FileboxGlobal">{{ $t('home.footer.3.2') }}</a></div>
        </div>
        <div class="footer-col">
          <div class="footer-row-title">{{ $t('home.footer.4') }}</div>
          <div><span class="footer-link" @click="()=>{this.$router.push('/agreement')}">{{ $t('home.footer.4.1') }}</span></div>
          <div><span class="footer-link" @click="()=>{this.$router.push('/privacy')}">{{ $t('home.footer.4.2') }}</span></div>
        </div>
      </div>
      <div class="text-copyright">
        <span>Copyright  &copy;Filebox 2020</span>
      </div>
    </div>
    <a-modal
      class="buy-modal"
      :width="371"
      :visible="loginModalVisible"
      :footer="null"
      :closable="false"
      :destroyOnClose="true">
      <div class="modalTitle">
        {{ $t('home.modal.login.title') }}
      </div>
      <div class="modalContent">
        {{ $t('home.modal.login.content') }}
      </div>
      <div class="modalButton">
        <div class="cancel" @click="handleLoginCancel">{{ $t('home.modal.login.button.cancel') }}</div>
        <div class="login" @click="handleLoginLogin">{{ $t('home.modal.login.button.login') }}</div>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Home',
    data () {
      return {
        loginModalVisible: false
      }
    },
    computed: {
      ...mapState({
        address: (state) => state.user.address,
        currentLang: state => state.app.lang
      })
    },
    methods: {
      handleGotoBuy () {
        const { address } = this
        if (address) {
          this.$router.push('/buy')
        } else {
          this.loginModalVisible = true
        }
      },
      handleLoginCancel () {
        this.loginModalVisible = false
      },
      handleLoginLogin () {
        this.loginModalVisible = false
        this.$router.push('/buy')
      }
    }
  }
</script>

<style lang="less" scoped>
  @red: #ff0000;
  .home-content {
    width: 100%;
    min-width: 1274px;
    padding: 0;
    background-color: #FFFFFF;
    font-family: Microsoft YaHei;
  }

  .text-1-1 {
    font-size: 40px;
    font-family: Helvetica Neue LT Pro;
    font-weight: normal;
    color: rgba(22, 38, 70, 1);
    line-height: 40px;
  }

  .text-1-2 {
    font-size: 60px;
    font-family: FZLanTingHeiS-B-GB;
    font-weight: 400;
    color: rgba(22, 38, 70, 1);
    padding-top: 36px;
    line-height: 60px;
  }

  .text-1-3 {
    font-size: 16px;
    font-weight: 400;
    color: rgba(46, 50, 61, 1);
    line-height: 26px;
    padding-top: 57px;
  }

  .ant-card {
    color: #333333;
  }

  .top-line {
    margin: 0 auto;
    width: 72px;
    height: 4px;
    background: rgba(38, 193, 149, 1);
    border-radius: 2px;
  }

  .text-title {
    margin-top: 53px;
    font-size: 40px;
    font-weight: bold;
    color: rgba(22, 38, 70, 1);
    text-align: center;
  }

  .text2-img {
    width: 232px;
    height: 243px
  }

  .text2-title {
    margin-top: -100px;
    font-size: 26px;
    font-weight: 400;
    color: rgba(22, 38, 70, 1);
  }

  .text2-content {
    font-size: 16px;
    font-weight: 400;
    color: rgba(46, 50, 61, 1);
    line-height: 26px;
    margin: 0 auto;
  }

  /*.conn-space {*/
  /*  width: 4%;*/
  /*  height: 1px;*/
  /*  float: left;*/
  /*  min-width: 5px;*/
  /*}*/

  .c-line {
    position: absolute;
    width: 180px;
    height: 28px;
  }

  .text3-index-div {
    position: relative;
    width: 69px;
    height: 79px;
    margin: 0 auto;
  }

  .text3-img1 {
    position: absolute;
    width: 69px;
    height: 79px;
  }

  .text3-index {
    position: absolute;
    top: 15px;
    left: 23px;
    font-size: 34px;
    font-family: DIN;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }

  .text3-txt {
    font-size: 26px;
    font-weight: 400;
    color: rgba(22, 38, 70, 1);
  }

  .text-copyright {
    margin-top: 50px;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: rgba(178, 183, 198, 1);
  }
  .footer-col{
    padding-left: 20px;
    flex: 1;
  }
  .footer-row-title{
    font-size: 1.1em;
    font-weight: bold;
  }
  .home-footer{
    display: flex;
    width: 1200px;
    margin: 0 auto;
    padding-left: 200px;
    div {
      padding: 15px 0 0;
    }
    a{
      color:rgba(0, 0, 0, 0.65);
      &:hover{
        color: #1890ff;
      }
    }
  }
  .footer-link{
    cursor: pointer;
    &:hover{
      color:rgba(38, 193, 149, 1);
    }
  }

  .buy-modal {
    padding: 24px;

    .modalTitle {
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 24px;
    }

    .modalContent {
      text-align: center;
      padding-top: 15px;
      padding-bottom: 25px;
      font-size: 14px;
      font-weight: bold;
      color: rgba(46, 50, 61, 1);
      line-height: 24px;
    }

    .modalButton {
      display: flex;
      margin: 0 -24px -24px -24px;

      div {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        border: 1px solid #E5E5E5;
        width: 50%;
        cursor: pointer;

        &.cancel {
          font-size: 14px;
          color: #2E323D;

          &:hover {
            color: lighten(#2E323D, 10%);
          }
        }

        &.login {
          font-size: 14px;
          color: #26C195;

          &:hover {
            color: lighten(#26C195, 10%);
          }
        }
      }
    }
  }
</style>
