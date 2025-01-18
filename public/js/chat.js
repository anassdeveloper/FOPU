// import { io } from 'socket.io-client';
const formChat = document.querySelector('.chat_form');
const sectionMessages = document.querySelector('.section_content--messages');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    showMessage('You are connected')
});

socket.on('message', message =>{ 
    showMessage(message);
    sectionMessages.scrollTop = sectionMessages.scrollHeight;
});

if(formChat){
    formChat.addEventListener('submit',  e => {
        e.preventDefault();
        let user = JSON.parse(e.target.dataset.user);
        let msg = e.target.elements.input_message.value;
        socket.emit('chatMsg', msg);
        sendMsgToDb(user, msg);
        e.target.elements.message.value = '';
        e.target.elements.message.focus();
    });
}


function showMessage(message){
    let div = document.createElement('div');
    div.setAttribute('class', 'message');

    div.innerHTML = `
    <picture class="message_photo ">
       <img src='https://wonderfulengineering.com/wp-content/uploads/2014/10/image-wallpaper-15-610x457.jpg' class='message_img' />
    </picture>
    <div class="message_text">
        <p class='message_name'>Admin</p>
        <p class="message_txt">${message}</p>
    </div>
    `;
    // let p = document.createElement('p');
    // p.className = 'message';
    // p.innerText = message;
    // div.insertAdjacentElement('afterbegin', p);
    sectionMessages
    .insertAdjacentElement('beforeend', div);
}



async function sendMsgToDb(user, message){
   try{ 

      const res = await fetch('http://localhost:3000/messages/create-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: user._id,
            name: user.name,
            photo: user.photo,
            message,
        })
      });

      const result = await res.json();

      console.log(result);

   }catch(err){
      console.log(err);

   }
}