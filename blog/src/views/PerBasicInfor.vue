<template>
    <div class="per-basic-infor-style">
        <BasicInfor :userinfor='userinfor' :systemHeader='systemHeader' ></BasicInfor>
    </div>
</template>

<script>
import BasicInfor from '../components/BasicInfor.vue'
export default {
    props:{
        userinfor:{
            type:Object
        },
        systemHeader:{
            type:Array,
            default:()=>[]
        }
    },
    components:{
        BasicInfor
    }
}
</script>

<style lang="less" scoped>
    
</style>