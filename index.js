const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// app.use(express.static('app/src'));
// const path = require('path');

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'app', 'src', 'index.js'));
// });
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('app/build'));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'build','index.html'));
    })
}

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

require('./socket/socket')(io);