<template>
    <div>
        <div class="login" v-if="chooseRegister == false">
            <div class="login-style">
                <h1>MyBlog登录</h1>
                <input type="text" @keyup.enter="changeInput" v-model="userData.userID" placeholder="用户ID"><br>
                <input type="password" id="passKey" @keyup.enter="loginEvent(userData)" v-model="userData.userPassword" placeholder="密码"><br>
                <button @click="loginEvent(userData)">登录</button>
                <button @click="registerNew">注册</button>
            </div>
            <div class="failpassword-tip" v-if="failLogin == true">
                <p v-if="failPswd == true">密码错误，请重新输入密码！</p>
                <p v-if="failUser == true">无此账号，请注册！</p>
                <button @click=" inputPswdAgain">确认</button>
            </div>
        </div>
        <div class="login" v-if="chooseRegister == true">
            <div class="login-style">
                <h1>MyBlog注册</h1>
                <input type="text" @keyup.enter="rchangeInput" v-model="registerData.userName" placeholder="用户名"><br>
                <input type="password" id="onePassKey" @keyup.enter="rchangeInputAgain" v-model="registerData.userPassword" placeholder="输入密码"><br>
                <input type="password" id="againPassKey" @keyup.enter="registerEvent(registerData)" v-model="passwordAgain" placeholder="确认密码"><br>
                <button @click="registerEvent(registerData)">注册新账号</button>
                <button @click=" returnLogin">返回</button>
            </div>
            <div class="failpassword-tip" v-if="failRegister == true">
                <p>密码不一致，请重新输入密码！</p>
                <button @click=" rinputPswdAgain">确认</button>
            </div>
        </div>
    </div>
</template>

<script>
import socket from './socket'
export default {
    data () {
        return {
            userData:{
                userID:null,
                userPassword:null
            },
            registerData:{
                userName:null,
                userPassword:null
            },
            chooseRegister:false,
            passwordAgain:null,
            failLogin:false,
            failPswd:false,
            failUser:false,
            failRegister:false
        }
    },
    methods:{
        loginEvent:function (userData){
            if ((this.userData.userID != null) && (this.userData.userPassword != null)) {
                // this.$root.userMaster = userData;
                // localStorage.userOnline = JSON.stringify(userData);
                socket.emit('login',userData)
                // for (let index = 0; index < this.userlist.length; index++) {
                //     if(this.userlist[index].userID == userData.userID){
                //         this.$emit('loginData', this.userlist[index])
                //     }
                //     else{
                //         this.$emit('friendsData', this.userlist[index])
                //     }
                // }
            }
        },
        changeInput:function(){
            if(this.userData.userID != null){
                let passwordInput = document.getElementById('passKey')
                passwordInput.focus()
            }
        },
        inputPswdAgain:function(){
            this.failLogin=false
            if(this.failPswd==true){
                this.failPswd=false;
                let passwordInput = document.getElementById('passKey')
                passwordInput.focus()
            }else if(this.failUser==true){
                this.failUser=false
            }
            this.userData.userPassword = null
        },
        registerNew:function(){
            this.chooseRegister=true
        },
        registerEvent:function(registerData){
            if ((this.registerData.userName != null) && (this.registerData.userPassword != null) && (this.passwordAgain == this.registerData.userPassword)) {
                socket.emit('register',registerData)
            }
            else if ((this.registerData.userName != null) && (this.registerData.userPassword != null) && (this.passwordAgain != this.registerData.userPassword)){
                this.failRegister=true
            }
        },
        returnLogin:function(){
            this.chooseRegister=false
        },
        rchangeInput:function(){
            if(this.registerData.userName != null){
                let passwordInput = document.getElementById('onePassKey')
                passwordInput.focus()
            }
        },
        rchangeInputAgain:function(){
            if((this.registerData.userName != null) && (this.registerData.userPassword != null)){
                let passwordInput = document.getElementById('againPassKey')
                passwordInput.focus()
            }
        },
        rinputPswdAgain:function(){
            this.failRegister=false
            this.passwordAgain = null
            let passwordInput = document.getElementById('againPassKey')
            passwordInput.focus()
        }
    },
    mounted(){      
        socket.on('failLogin',()=>{
            this.failLogin=true
            this.failPswd=true
        }),
        socket.on('nouser',()=>{
            this.failLogin=true
            this.failUser=true
        })
    }
}
</script>

<style lang="less" scoped>
// @mainColor:#9999f1;
@mainColor2:aliceblue;
@mainColor:rgb(250,87,87);
@mainColor1:rgb(250, 159, 159);
@fontColor:rgb(230, 52, 52);
@fontColor1:rgb(124, 40, 40);
@buttonColor:rgb(245, 205, 205);
@mainSize:20px;
.login{
    width: 100vw;
    height: 100vh;
    background-color: rgba(@mainColor, .2);
    overflow: hidden;
    position: relative;
}
.login-style{
    width: 600px;
    height: 400px;
    margin: 150px auto;
    background-color: rgba(@mainColor,.6);
    text-align: center;
    overflow: hidden;
    border-radius: 20px;
    box-shadow: 5px 5px 10px rgba(@mainColor,.8);

    h1{
        font-weight: normal;
        text-align: center;
        font: @mainSize;
        margin: 60px 0 ;
    }

    input{
        width: 250px;
        height: 30px;
        margin-bottom: 10px;
        border-radius: 10px;
        background-color: @mainColor2;
        border: none;
        outline: none;
        padding: 1px 5px;
    }

    button{
        border: none;
        width: 70px;
        height: 30px;
        margin: 40px 50px;
        text-align: center;
        border-radius: 15px;
        outline: none;
        font: 0.5*@mainSize;
        background-color: @buttonColor;
    }
}
.failpassword-tip{
    width: 200px;
    height: 150px;
    position: absolute;
    left: 620px;
    top: 250px;
    border: black solid 1px;
    background-color: @mainColor2;
    p{
        height: 20px;
        width: 200px;
        text-align: center;
        line-height: 20px;
        margin-top: 50px;
    }
    button{
        height: 30px;
        width: 60px;
        margin: 30px 80px;
        text-align: center;
        outline: none;
    }
}
</style>