const path = require("path")
const http = require("http")
const express = require("express");
const socketio = require("socket.io");
const { isStringObject } = require("util/types");
const formatMessage = require("./utils/messages")
const {userJoin, getCurrentUser, userLeave,getRoomUsers}= require("./utils/user")

const app = express();
const server = http.createServer(app);
const io = socketio(server);



//set Static Folder 
app.use(express.static(path.join(__dirname, "public")));
const botName = "Admin"
//Run when A client Connect
io.on("connection",socket =>{
    socket.on("joinRoom",({username, room}) => {
   const user = userJoin(socket.id,username, room)
        socket.join(user.room);
        //Welcome Current User
        socket.emit("message",formatMessage(botName,"Welcome to chat "))

        //  BroadCast When a user Connects
        socket.broadcast.to(user.room).emit("message", 
        formatMessage(botName,`${user.username} Joined the Chat`)
        );
    
    });
    // console.log("New Web Connection....");

  
 
    //Listen for chatMessage
    socket.on("chatMessage" ,(msg) => {
        const user = getCurrentUser(socket.id)
    io.to(user.room).emit("message",formatMessage(user.username, msg))
    });
       //Runs when Client Disconnect
       socket.on("disconnect",() => {

        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message",formatMessage(botName,`${user.username} left the chat`));
        }
    
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));