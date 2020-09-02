<template>
  <div style="width: 100%">
    <div class="info-content">
      <div class="info-img"></div>
      <div style="text-align: right;margin-top: 58px;">
        <a class="info-back" @click="() => this.$router.push('/center')">{{ $t('userinfo.back') }}</a>
      </div>
      <div style="text-align: center;">
        <span class="info-title" >{{ $t('userinfo.title') }}</span>
      </div>
      <div style="margin-top: 90px">
        <img class="info-icon" src="~@/assets/user-icon.png">
        <div class="info-text" >
          <div >{{ $t('userinfo.label.address') }}<span style="font-weight: bold">{{ address }}</span></div>
          <div >{{ $t('userinfo.label.balance') }}<span style="font-weight: bold">{{ balance }}&nbspFN</span></div>
        </div>
      </div>
      <div style="margin-top: 130px">
        <div style="position: relative;width: 120px;margin: 0 auto">
          <img class="qrcode-bg" src="~@/assets/qrcode-bg.png">
          <div id="qrcode" ref="qrcode"></div>
        </div>
        <div class="info-qrcode">{{ $t('userinfo.label.qrcode') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
    import QRCode from 'qrcodejs2'
    import { getUserInfo } from '@/api/userinfo'

    export default {
        name: 'UserInfo',
        data () {
            return {
                address: this.$store.getters.address,
                balance: '0'
            }
        },
        mounted () {
            getUserInfo().then(res => {
                if (res.resultCode === '0') {
                    this.balance = (Number(res.data.balance) / 1000000000).toFixed(2)
                } else {
                    this.$message.error(this.$t('userinfo.fail.message'))
                }
            })
            this.creatQrCode()
        },
        methods: {
            creatQrCode () {
                // eslint-disable-next-line no-new
                new QRCode('qrcode', {
                    text: this.address,
                    width: 109,
                    height: 109,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                })
            }
        }
    }
</script>

<style lang="less" scoped>
  .info-content{
    position: relative;
    margin: 38px auto auto auto;
    height:635px;
    width: 1200px;
    background:rgba(255,255,255,1);
    box-shadow:-5px 0px 30px 0px rgba(220,228,238,0.5);
    font-family:Microsoft YaHei;
  }
  .info-img{
    position: relative;
    margin: 0 auto;
    top: 60px;
    width:72px;
    height:4px;
    background:rgba(38,193,149,1);
    border-radius:2px;
  }
  .info-back{
    margin-right: 60px;
    font-size:16px;
    font-weight:400;
    color:rgba(38,193,149,1);
    line-height:26px;
  }
  .info-title{
    font-size:25px;
    font-weight:bold;
    color:rgba(22,38,70,1);
    line-height:24px;
  }
  .info-icon{
    width: 65px;
    height: 65px;
    margin-left: 290px;
    float: left;
  }
  .info-text{
    white-space:pre-wrap;
    word-wrap:break-word;
    position: relative;
    overflow:hidden;
    left: 10px;
    font-size:14px;
    font-weight:400;
    color:rgba(46,50,61,1);
    line-height:35px;
  }
  #qrcode{
    position: absolute;
    top: 6px;
    left: 6px;
  }
  .qrcode-bg{
    position: absolute;
    width: 120px;
    height: 120px;
    top: 0px;
    left: 0px;
  }
  .info-qrcode{
    position: relative;
    top: 120px;
    font-size:14px;
    font-weight:400;
    color:rgba(46,50,61,1);
    line-height:28px;
    text-align: center;
  }
</style>
