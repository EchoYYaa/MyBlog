<template>
    <div>
        <FriendsCom :userinfor='userinfor' :friendsRequestList='friendsRequestList' :friendslist="friendslist"></FriendsCom>
    </div>
</template>

<script>
import FriendsCom from '../components/FriendsCom.vue' 
export default {
    props:{
        userinfor:{
            type:Object
        },
        friendslist:{
            type:Array,
            default:()=>[]
        },
        friendsRequestList:{
            type:Array,
            default:()=>[]
        }
    },
    data () {
        return{
            
        }
    },
    components:{
        FriendsCom
    }
}
</script>