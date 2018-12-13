module.exports=(io,socket ,userOnline)=>{
    socket.on('challenge',(uid,user,socketid)=>{    //uid va socketid cua nguoi 2
        console.log('onchallenge',user);
        console.log('check join',uid)
        socket.join(uid);
        socket.to(socketid).emit('challenge',uid,user);
    })

    socket.on("client-accept",(uid)=>{
        socket.join(uid);
        console.log('check join',uid)
        var room = io.sockets.adapter.rooms[uid];
        for(c in room.sockets){
            socket.to(c).emit("server-change-route",uid);
            socket.to(c).emit("server-set-owner",true);
            socket.emit("server-set-guess",false);
        }
    })
}