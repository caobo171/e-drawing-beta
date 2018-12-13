module.exports = (io, socket) => {
  socket.on("client-send-word", (words, idRoom) => {
    socket.in(idRoom).emit("server-send-word", words);
    console.log('long',idRoom)
  });

  socket.on("client-send-drawing", (x, y, px, py, roomId) => {
    socket.in(roomId).emit("server-send-drawing", x, y, px, py);
  });

  socket.on("client-level-up", roomId => {
    console.log("levelup");
    socket.in(roomId).emit("server-level-up");
  });

  socket.on("tick", (roomId,time) => {
    socket.in(roomId).emit("tick",time);
  });

  socket.on("end", roomId => {
    socket.in(roomId).emit("end");
    
  });

  socket.on('out-game', roomId=>{
    socket.in(roomId).emit('out-game')
  })
};
