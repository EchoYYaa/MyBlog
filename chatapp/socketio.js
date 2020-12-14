let socketio = {}
let sqlQuery = require('./module/lcMysql')

function getRandomID(){
    var originalData = []
    var randomData = '0123456789'
    for(let i=0;i<8;i++){
        originalData[i]=randomData.substr(Math.floor(Math.random()*0x10),1)
    }
    let oriData = originalData.join('')
    return oriData
}

function getSocket(server){
    socketio.io = require('socket.io')(server)
    let io = socketio.io
    io.on('connection',function(socket){
        console.log(socket.id+"建立连接");

        socket.on('login',async function(data){
            let sqlStr1 = 'select * from userinfor where isonline = ? and userID = ? and userPassword = ?'
            let result1 = await sqlQuery(sqlStr1,['true',data.userID,data.userPassword])
            if(result1.length>0){
                socket.to(result1[0].socketID).emit('logout',{content:"异地登陆，您将被强制退出！"})
            }
            let sqlStr = 'select * from userinfor where userID = ?'
            let result = await sqlQuery(sqlStr,[data.userID])
            if(result.length == 0){
                socket.emit('nouser',{
                    state:'failes',
                    content:'无此账号！'
                })
            }
            else {
                if(data.userPassword == result[0].userPassword){
                    let sqlStr2 = "update userinfor set socketID=?,isonline=? where userID=? and userPassword=?"
                    let result2 = await sqlQuery(sqlStr2,[socket.id,'true',data.userID,data.userPassword])
                    let sqlStr3 = 'select * from userinfor where userID=?'
                    let result3 = await sqlQuery(sqlStr3,[data.userID])
                    //总的
                    // socket.emit('login',result3[0])
                    let sqlStr4 = 'select * from '+result3[0].friendsList
                    let result4 = await sqlQuery(sqlStr4)
                    // socket.emit('friendsList',result4)
                    // let sqlStr6 = 'select * from '+result3[0].friendsList+ ' where isfriend=?'
                    // let result6 = await sqlQuery(sqlStr6,["false"])
                    // socket.emit('friendsListRequest',result6)
                    let sqlStr5 = 'select * from chatcontent where receiveUser = ? and isreceive = ?'
                    let result5 = await sqlQuery(sqlStr5,[data.userID,"false"])
                    socket.emit('noreadMsg',result5)
                    let sqlStr7 = 'select * from systemTotleHeader'
                    let result7 = await sqlQuery(sqlStr7)
                    // socket.emit('systemTotleHeader',result7)
                    let sqlStr8 = 'select * from userblog where userID=?'
                    let result8 = await sqlQuery(sqlStr8,[result3[0].userID])
                    //传输个人blog数据
                    let friendsblogarr = []
                    for (let index = 0; index < result4.length; index++) {
                        if(result4[index].isfriend == 'true'){
                            let sqlStr9 = 'select * from userblog where userID=?'
                            let result9 = await sqlQuery(sqlStr9,[result4[index].userID])
                            if(result9.length > 0){
                                friendsblogarr = friendsblogarr.concat(result9)
                            }
                        }
                    }
                    //传输好友blog数据
                    //合并所有数据一起传输
                    socket.emit('login',result3[0],result4,result7,result8,friendsblogarr)
                }
                else{
                    socket.emit('failLogin',{
                        state:'failed',
                        content:'密码错误！'
                    })
                }
            }
        })
        socket.on('register',async function(data){
            let randomID = getRandomID()
            // let sqlStr1 = 'select * from userinfor where userID=?'
            // let result1 = await sqlQuery(sqlStr1,[randomID])
            // while(result1.length != 0){
            //     randomID = getRandomID()
            //     sqlStr1 = 'select * from userinfor where userID=?'
            //     result1 = await sqlQuery(sqlStr1,[randomID])
            // }
            data.userID = randomID;
            data.friendsList = randomID + 'friendsList'
            let sqlStr2 = 'create table '+data.friendsList+' (userID int primary key,userName varchar(255),userHeader varchar(255),friendsList varchar(255),isfriend varchar(255),yorm varchar(255),oppositewait varchar(255))'
            let result2 = await sqlQuery(sqlStr2)
            data.userHeader = 'https://bpic.588ku.com//original_origin_min_pic/19/10/04/d38d86a8dc7b4cc9cc009220c07f0aee.jpg'
            let sqlStr = 'insert into userinfor (userID,userName,userPassword,socketID,isonline,friendsList,userHeader) values (?,?,?,?,?,?,?)'
            let arr = [data.userID,data.userName,data.userPassword,socket.id,'true',data.friendsList,data.userHeader]
            let result =await sqlQuery(sqlStr,arr)
            // let sqlStr1 = 'select * from userinfor where socketID=?'
            // let result1 = await sqlQuery(sqlStr1,[data.userName])
            socket.emit('register',data)
        })

        socket.on('searchBlog',async function(data){
            let arr = []
            let sqlStr = 'select * from userblog'
            let result = await sqlQuery(sqlStr)
            if(result.length >0){
                for (let index = 0; index < result.length; index++) {
                    if(result[index].blogTitle.indexOf(data) != -1){
                        arr.push(result[index])
                    }
                }
            }
            if(arr.length > 0){
                socket.emit('searchBlogR',arr)
            }
            else{
                socket.emit('nosearchBlogR')
            }
        })

        socket.on('sendMsg',async function(msg){
            let sqlStr3 = "select * from userinfor where userID=? and isonline=?"
            let result3 = await sqlQuery(sqlStr3,[msg.receiveUser.userID,'true'])
            if(result3.length>0){
                socket.to(result3[0].socketID).emit('receiveMsg',msg)
                let sqlStr5 = 'insert into chatcontent (sendUser,receiveUser,chatContent,chatTime,isreceive) values (?,?,?,?,?)'
                let arr = [msg.sendUser.userID,msg.receiveUser.userID,msg.chatContent,msg.chatTime,"true"]
                sqlQuery(sqlStr5,arr)
            }
            else{
                let sqlStr6 = 'insert into chatcontent (sendUser,receiveUser,chatContent,chatTime,isreceive) values (?,?,?,?,?)'
                let arr1 = [msg.sendUser.userID,msg.receiveUser.userID,msg.chatContent,msg.chatTime,"false"]
                sqlQuery(sqlStr6,arr1)
            }
        })
        socket.on('hasreadMsg',async function(data){
            let sqlStr7 = "update chatcontent set isreceive=? where receiveUser=? and isreceive=?"
            let result7 = await sqlQuery(sqlStr7,['true',data,'false'])
        })
        socket.on('searchFriendName',async function(data){
            let sqlStr8 = "select * from userinfor where userName=?"
            let result8 = await sqlQuery(sqlStr8,[data])
            if(result8.length > 0){
                socket.emit('hasSearchedFriendsName',result8)
            }
            else{
                socket.emit('noSearchedFriendsName',{
                    state:'failed',
                    content:"未知用户"
                })
            }
        })
        socket.on('searchFriendID',async function(data){
            let sqlStr9 = "select * from userinfor where userID=?"
            let result9 = await sqlQuery(sqlStr9,[data])
            if(result9.length > 0){
                socket.emit('hasSearchedFriendsID',result9)
            }
            else{
                socket.emit('noSearchedFriendsID',{
                    state:'failed',
                    content:"未知用户"
                })
            }
        })
        socket.on('addNewFriend',async function(data1,data2){
            let sqlStr15 = 'insert into '+data1.friendsList+' (userID,userName,userHeader,isfriend,friendsList,yorm) values (?,?,?,?,?,?)'
            let result15 = await sqlQuery(sqlStr15,[data2.userID,data2.userName,data2.userHeader,"false",data2.friendsList,"m"])
            let sqlStr16 = 'select * from userinfor where userID=?'
            let result16 = await sqlQuery(sqlStr16,[data2.userID])
            let sqlStr17 = 'insert into '+result16[0].friendsList+' (userID,userName,userHeader,isfriend,friendsList,yorm) values (?,?,?,?,?,?)'
            let result17 = await sqlQuery(sqlStr17,[data1.userID,data1.userName,data1.userHeader,"false",data1.friendsList,"y"])
            if((result16.length > 0) && (result16[0].isonline == 'true') ){
                socket.to(data2.socketID).emit('friendsRequest',data1)   
            }
            // socket.emit('addNewFriend',{
            //     state:'ok',
            //     content:'完成！'
            // })
        })
        socket.on('agreeFriendRequest',async function(data1,data2){
            let sqlStr16 = 'update '+data1.friendsList+' set isfriend=? where userID=?'
            let result16 = await sqlQuery(sqlStr16,["true",data2.userID])
            let sqlStr17 = 'update '+data2.friendsList+' set isfriend=? where userID=?'
            let result17 = await sqlQuery(sqlStr17,["true",data1.userID])
            let sqlStr19 = 'select * from userblog where userID=?'
            let result19 = await sqlQuery(sqlStr19,[data2.userID])
            if(result19.length > 0){
                socket.emit('newFriendBlog',result19)
            }
            let sqlStr18 = 'select * from userinfor where userID=? and isonline=?'
            let result18 = await sqlQuery(sqlStr18,[data2.userID,"true"])
            if(result18.length > 0){
                socket.to(result18[0].socketID).emit('returnAgreeFriendRequest',data1)
                let sqlStr20 = 'select * from userblog where userID=?'
                let result20 = await sqlQuery(sqlStr20,[data1.userID])
                if(result20.length > 0){
                    socket.to(result18[0].socketID).emit('returnNewFriendBlog',result20)
                }
            }
        })
        socket.on('disagreeFriendRequest',async function(data1,data2){
            let sqlStr16 = 'delete from '+data1.friendsList+' where userID=?'
            let result16 = await sqlQuery(sqlStr16,[data2.userID])
            let sqlStr17 = 'delete from '+data2.friendsList+' where userID=?'
            let result17 = await sqlQuery(sqlStr17,[data1.userID])
            let sqlStr18 = 'select * from userinfor where userID=? and isonline=?'
            let result18 = await sqlQuery(sqlStr18,[data2.userID,"true"])
            if(result18.length > 0){
                socket.to(result18[0].socketID).emit('returnDisagreeFriendRequest',data1)
            }
        })
        
        socket.on('deleteFriend',async function(data1,data2){
            let sqlStr11 = "delete from "+data1.friendsList+" where userID = ?"
            let result11 = await sqlQuery(sqlStr11,[data2])
            socket.emit('deleteFriendBlog',data2)
            let sqlStr12 = 'select * from userinfor where userID=?'
            let result12 = await sqlQuery(sqlStr12,[data2])
            let sqlStr14 = "delete from "+result12[0].friendsList+" where userID = ?"
            let result14 = await sqlQuery(sqlStr14,[data1.userID])
            socket.to(result12[0].socketID).emit('beenDelete',data1.userID)
            socket.emit('deleteFriendSuccess',{
                content:'删除成功！'
            })
        })
        socket.on('modifyHeader',async function(data1,data2){
            let sqlStr18 = 'update userinfor set userHeader=? where userID=?'
            let result18 = await sqlQuery(sqlStr18,[data2,data1.userID])
            let sqlStr19 = 'select * from '+data1.friendsList+' where userID=?'
            let result19 = await sqlQuery(sqlStr19,[data1.userID])
            if(result19.length > 0){
                for (let index = 0; index < result19.length; index++) {
                    let sqlStr20 = 'update '+result19[index].friendsList+ ' set userHeader=? where userID=?'
                    let result20 = sqlQuery(sqlStr20,[data2,data1.userID])
                }
            }
            socket.emit('modifyHeader',{
                state:'ok',
                content:'修改头像成功！'
            })
        })
        socket.on('publishBlog',async function(data,data1,data2){
            let sqlStr20 = 'insert into userblog (userID,userName,blogTitle,blogContent,blogLocalTime,ispublish,blogTime) values (?,?,?,?,?,?,?)'
            let result20 = await sqlQuery(sqlStr20,[data1.userID,data1.userName,data1.blogTitle,data1.blogContent,data1.blogLocalTime,"true",data2])
            let sqlStr21 = 'select * from '+data.friendsList+' where isfriend=?'
            let result21 = await sqlQuery(sqlStr21,["true"])
            if(result21.length > 0){
                for (let index = 0; index < result21.length; index++) {
                    let sqlStr22 = 'select * from userinfor where userID=? and isonline=?'
                    let result22 = await sqlQuery(sqlStr22,[result21[index].userID,"true"])
                    if(result22.length > 0){
                        socket.to(result22[0].socketID).emit('friendPublishNewBlog',data1,data2)
                    }
                }
            }
            socket.emit('publishBlog',{
                state:'ok',
                content:'发布成功！'
            })
        })
        socket.on('disconnect',async function(){
            let sqlStr4 = "update userinfor set socketID=?,isonline=? where socketID =?"
            let result4 = await sqlQuery(sqlStr4,[null,null,socket.id])
        })
        socket.on('mustdisconnect',async function(){
            let sqlStr10 = "update userinfor set socketID=?,isonline=? where socketID =?"
            let result10 = await sqlQuery(sqlStr10,[null,null,socket.id])
        })
    })
}
socketio.getSocket = getSocket;
module.exports = socketio;


