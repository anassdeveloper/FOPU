// import { io } from 'socket.io-client';
const formChat = document.querySelector('.chat_form');
const sectionMessages = document.querySelector('.section_content--messages');
const chat = document.getElementById('input_message');
const messageWrite = document.querySelector('.message_write');
var socket = io(prod_url);
let statusCode;

window.onload = e => {
    if(sectionMessages){
        sectionMessages.scrollTop = sectionMessages.scrollHeight;
    }
}


if(chat){
   chat.addEventListener('keyup', e => {
    if(e.key === 'Backspace') {
        messageWrite.textContent = '';
        socket.emit('stop_write', '');
        return -1;
    }
    sectionMessages.scrollTop = sectionMessages.scrollHeight;
    let username = e.currentTarget.parentElement.dataset.username;
    socket.emit('write', `${username} write now !`);
        // if(e.key === 'Backspace') 
        //     document.querySelector('.message_write').style.display = 'none';
        // else {
        //     if(document.querySelector('.message_write'))
        //         document.querySelector('.message_write').style.display = 'block';
        //     sectionMessages.scrollTop = sectionMessages.scrollHeight;
        //     let username = e.currentTarget.parentElement.dataset.username;
        //     socket.emit('write', `${username} write now !`);
        // }
    })
}



socket.on('connect', async (data) => {
    // document.querySelector('.account_header--connect').textContent = 'online';
     if(document.querySelector('.header_info')){
        
         const id = JSON.parse(document.querySelector('.header_info').dataset.userid);
         
         try{
                 const res = await fetch(`${prod_url}/auth/connect/${id.id}`);
                 const data = await res.json();
                 console.log(data);
         }catch(err){
                 console.log(err)
         }
     }
    
});



socket.on('message', message =>{ 
    showMessage(message);
    sectionMessages.scrollTop = sectionMessages.scrollHeight;
});

socket.on('write', name => {
    
    messageWrite.textContent = name;
    // if(document.querySelector('.message_write')) return -1;

    // let p = document.createElement('p');
    
    // p.classList.add('message_write');
    // p.textContent = name;
    // sectionMessages.insertAdjacentElement('beforeend', p);
})
socket.on('stop', (txt) => {
   messageWrite.textContent = txt
})

if(formChat){
    formChat.addEventListener('submit',  e => {
        e.preventDefault();
        messageWrite.textContent = '';
        let user = JSON.parse(e.target.dataset.user);
        statusCode = user.id;
        let msg = e.target.elements.input_message.value;
        socket.emit('chatMsg', JSON.stringify({...user, msg}));
        sendMsgToDb(user, msg);
        e.target.elements.message.value = '';
        e.target.elements.message.focus();
    });
}


function showMessage(message){

    let info = JSON.parse(message);
    
    let div = document.createElement('div');
    

    if(statusCode === info.id){
        div.setAttribute('class', ['message message_self']);
        div.innerHTML = `
    <div class="message_text">
        <p class="message_txt">${info.msg}</p>
    </div>
    `;
    }else{
        div.setAttribute('class', 'message');
        div.innerHTML = `
    <picture class='message_photo'>
       <img class='message_img' src='${info.photo}' />
    </picture>
    <div class="message_text">
        <p class='message_name'>${info.name}</p>
        <p class="message_txt">${info.msg}</p>
    </div>
    `;
    }
    // let p = document.createElement('p');
    // p.className = 'message';
    // p.innerText = message;
    // div.insertAdjacentElement('afterbegin', p);
    sectionMessages
    .insertAdjacentElement('beforeend', div);
}



async function sendMsgToDb(user, message){
   try{ 
      if(!message) return alert('dont send emty message');
      const res = await fetch(`${prod_url}/messages/create-message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: user.id,
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