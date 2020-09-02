<template>
  <div class="box">
    <div class="item">
      <select-lang/>
    </div>
    <avatar-dropdown/>
  </div>
</template>

<script>
  import AvatarDropdown from './AvatarDropdown'
  import SelectLang from '@/components/SelectLang'

  export default {
    name: 'RightContent',
    components: {
      AvatarDropdown,
      SelectLang
    }
  }
</script>

<style lang="less" scoped>
  .box {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    .item {
      margin-right: 15px;
    }
  }
</style>
