<template>
  <div id="app">
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <router-view class="page animated"></router-view>
    </transition>
  </div>
</template>

<script type="text/babel">
  import { mapGetters , mapActions } from 'vuex';
  export default {
    name: 'app',
    watch: {
      //监听路由变化
      $route(to,from){

      },
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      ...mapActions([
        'appInit'
      ])
    },
    created(){
      this.appInit();
    }

  }
</script>

<style lang="less">
  @import "./styles/app.less";
</style>
