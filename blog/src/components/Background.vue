<template>
    <div class="background-totle">
        <div style="left:50px;animation-delay:1s"></div>
        <div style="left:120px;animation-delay:4s"></div>
        <div style="left:200px;animation-delay:3s"></div>
        <div style="right:50px;animation-delay:1s"></div>
        <div style="right:120px;animation-delay:4s"></div>
        <div style="right:200px;animation-delay:3s"></div>
        <div style="left:300px;animation-delay:1s"></div>
        <div style="left:400px;animation-delay:5s"></div>
        <div style="left:500px;animation-delay:8s"></div>
        <div style="left:600px;animation-delay:10s"></div>
        <div style="right:300px;animation-delay:7s"></div>
        <div style="right:400px;animation-delay:4s"></div>
        <div style="right:500px;animation-delay:6s"></div>
        <div style="right:600px;animation-delay:3s"></div>
        <div style="left:50px;animation-delay:6s"></div>
        <div style="left:120px;animation-delay:8s"></div>
        <div style="left:200px;animation-delay:7s"></div>
        <div style="right:50px;animation-delay:6s"></div>
        <div style="right:120px;animation-delay:8s"></div>
        <div style="right:200px;animation-delay:7s"></div>
    </div>
</template>

<style lang="less" scoped>
@mainColor:rgb(250,87,87);
// @maincoloe:rgba(250,87,87, 0.2);
// @maincoloe1:rgb(250, 216, 216);
@mainColor2:rgb(198, 244, 255);

@keyframes bubbleCircle {
    0%{
        width: 60px;
        height: 60px;
        top: -60px;
        // left: 100px;
    }
    10%{
        width: 55px;
        height: 55px;
        top: 150px;
        // left: 105px;
    }
    20%{
        width: 50px;
        height: 50px;
        top: 280px;
        // left: 110px;
    }
    40%{
        width: 45px;
        height: 45px;
        top: 420px;
        // left: 112.5px;
    }
    60%{
        width: 40px;
        height: 40px;
        top: 530px;
        // left: 115px;
    }
    80%{
        width: 35px;
        height: 35px;
        top: 620px;
        // left: 120px;
    }
    99%{
        width: 30px;
        height: 30px;
        top: 800px;
        // left: 125px;
    }
    100%{
        width: 30px;
        height: 30px;
        bottom: -30px;
        // left: 125px;
    }
}
.background-totle{
    width: 100vw;
    height: 100vh;
    background-color: rgba(@mainColor, .2);
    position: fixed;
    top: 0;
    div{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        position: absolute;
        top: -50px;
        // left: 150px;
        background: linear-gradient(1deg,rgba(@mainColor2,.6),rgba(@mainColor2,.4),rgba(@mainColor2,.3));
        animation: bubbleCircle 10s linear infinite;
    }
    div:hover{
        animation-play-state: paused;
    }
}
</style>