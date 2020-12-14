const { log } = require('debug');

let socketio = {}

function getSocket(server){
    socketio.io = require('socket.io')(server);
    
    let io = socketio.io;
    io.on('connection',function(socket){
        //此处的socket是当前某个浏览器与服务器的连接对象
        socket.broadcast.emit('newUser',{
            id:socket.id,
            content:"新用户加入"
        });
        socket.emit('news',{hello:'world'});
        socket.on('my other event', function(data){
            console.log(data)
        });
        socket.on('sendUser',function(data){
            // socket.emit('transferMes',{abc:'abcdefg'});
            socket.to(data.to).emit('sendClient',{
                from:data.from,
                content:data.content
            });
        })
    
        socket.on('addRoom',function(data){
            console.log(data);
            let roomObj = socket.join(data.room)
           // console.log(roomObj);
        })
    
        socket.on('sendMsgRoom',function(data){
            console.log(data);
            socket.to(data.room).emit('commonroom',data)
        })
    });

    let qq = io.of('/qq');
    qq.on('connection',function(){
        qq.emit('news',{content:"qq端连接了"})
    })

    let wx = io.of('/wx');
    wx.on('connection',function(){
        wx.emit('news',{content:'wx端连接了'})
    })

}

socketio.getSocket = getSocket;

module.exports = socketio;
