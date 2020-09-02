<template>
  <div class="about-content">
    <div style="width: 100%;height: 907px;position: relative;display: flex;">
      <img
        height="907px"
        style="width:100%;min-width: 1920px;height: 907px;z-index: 0;position: absolute;"
        src="~@/assets/about-back.png">
      <div style="z-index: 1;width: 1200px;margin: 0 auto;padding-top: 53px;padding-bottom: 100px">
        <div style="text-align: right;padding-right: 30px;cursor: pointer;color: #ffffff;font-size: 16px" @click="()=>{this.$router.push('/home')}">{{ $t('about.back') }}</div>
        <div class="top-line" style="margin: 263px auto auto auto;"></div>
        <div style="font-size: 36px;font-weight: bold;color: #ffffff;text-align: center;padding-top: 19px">{{ $t('about.title') }}</div>
        <div style="padding-top: 53px;display: flex;">
<!--          <div><img width="800px" height="auto" src="~@/assets/about-1.png"></div>-->
          <div style="font-size: 16px;width: 550px;height: 67px;color: #ffffff;margin: auto;">{{ $t('about.text.1') }}</div>
        </div>
      </div>
    </div>
    <div style="width: 100%;">
      <div class="top-line" style="margin: 61px auto auto auto;"></div>
      <div style="font-size: 36px;font-weight: bold;color: #162646;text-align: center;padding-top: 19px">{{ $t('about.join.title') }}</div>
      <div style="width: 1200px;margin: 0 auto;padding-bottom: 66px">
        <div style="padding-top: 55px;display: flex;">
          <div style="padding-left: 25px"><img width="638px" height="403px" src="~@/assets/about-join.png"></div>
          <div style="width: 100%;padding-left: 29px;padding-right: 20px;margin: auto;">
            <div style="width: 481px;font-size: 16px;color: #2E323D">{{ $t('about.text.2.1') }}</div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div style="margin-top: 10px;font-size: 16px;color: #2E323D">{{ $t('about.text.2.2') }}</div>
          </div>
        </div>
      </div>
<!--      <div style="padding: 49px 0 40px;">-->
<!--        <div class="text-copyright">-->
<!--          <span>Copyright  &copy;Filebox 2020</span>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'About'
  }
</script>

<style lang="less" scoped>
  .about-content {
    width: 100%;
    padding: 0;
    background-color: #FFFFFF;
    font-family: Microsoft YaHei;
  }
  .text-copyright {
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: rgba(178, 183, 198, 1);
  }
  .top-line {
    width: 72px;
    height: 4px;
    background: rgba(38, 193, 149, 1);
    border-radius: 2px;
  }
</style>
