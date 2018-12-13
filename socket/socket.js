module.exports = function (io) {
  var userOnline = [];
  handleDisConnect = (socketid,socket=null) => {
    if(socket){
      const user = userOnline.find(e => {
        return e.socketid === socketid 
      })
      if(user && socket){
        socket.in(user.uid).emit('out-game')
        console.log('out-game',user.uid)
      }
  
    }
   
    userOnline = userOnline.filter(e => {
      //console.log(e.socketid == socketid)
      if(e.sockeid === socketid){
        console.log('out-game',e.uid)
        socket.in(e.uid).emit('out-game')
      }
      return e.socketid != socketid;
    });
    
    //console.log(userOnline);
  };
  io.on("connection", socket => {
    console.log("co nguoi ket noi" + socket.id);

    //socket.join("test-room");
    socket.on("ok", () => {
      //console.log("ok", socket.id);
    }); //chua co chuc nang tao room nen cho dai vo room nay
    require("./challenge.js")(io, socket, userOnline);
    require("./play.js")(io, socket);
    socket.on("login-user", data => {
      // console.log("@@@@@@");
      // console.log(data);
      // console.log("--------------");
      // console.log(userOnline);
      if (
        !userOnline.find(e => {
          return e.socketid === data.socketid || e.uid === data.uid;
        })
      ) {
        userOnline.push(data);
        //console.log(userOnline.length);
      } else {
        if (
          !userOnline.find(e => {
            return e.socketid === data.socketid && e.uid === data.uid;
          })
        ) {
          let user = userOnline.find(e => {
            return e.uid === data.uid
          })
          //console.log(userOnline.length);
          if (user) {
            //console.log('user awn', user);
            handleDisConnect(user.socketid);
            socket.to(user.socketid).emit("user-exist");
            userOnline.push(data);
          }
        }
      }

      io.sockets.emit("get-users", userOnline);
    });

    socket.on('get-users-online', () => {
      socket.emit('get-users', userOnline);
    })

    socket.on("logout-user", data => {
      handleDisConnect(data.socketid);
      //console.log('logout', userOnline);
      io.sockets.emit("get-users", userOnline);

    });

    socket.on("disconnect", () => {
      handleDisConnect(socket.id,socket);
      //console.log('disconnect', userOnline);
      io.sockets.emit("get-users", userOnline);
      
      //console.log('outgame', io.sockets.adapter.sids[socket.id])
    });
  });
};