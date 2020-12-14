<template>
  <div class="home">
    <AllBlog :userinfor='userinfor' :totleblogData='totleblogData' :myblogData='myblogData' msg="Welcome to Your Blog"/>
  </div>
</template>

<script>
// @ is an alias to /src
import AllBlog from '@/components/AllBlog.vue'

export default {
  name: 'Home',
  props:{
    userinfor:{
      type:Object
    },
    myblogData:{
      type:Array,
      default:()=>[]
    },
    totleblogData:{
      type:Array,
      default:()=>[]
    }
  },
  components: {
    AllBlog
  }
}
</script>

<style lang="less" scoped>
.home{
  width: 800px;
  min-height: 766px;
}
</style>
