
const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages")
//Get username and room from url
const{username,room}=Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

console.log(username,room)

const socket = io();

//Join chatroom
socket.emit("joinRoom",{username,room})
//Message submit
socket.on("message", message => {
  console.log(message);
  outputMessage(message)

  //Scroll Down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});
//Message submit
chatForm.addEventListener("submit",  (e) => {
 e.preventDefault();
 //Get Messsage text
 const msg = e.target.elements.msg.value;

 //Emit a message to a Server
 socket.emit("chatMessage", msg);

 //clear Message
 e.target.elements.msg.value= '';
 e.target.elements.msg.focus();
});

//OutPut message to Dom
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}