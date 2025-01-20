// import { io } from 'socket.io-client';
const formChat = document.querySelector('.chat_form');
const sectionMessages = document.querySelector('.section_content--messages');
const chat = document.getElementById('input_message');
const messageWrite = document.querySelector('.message_write');
const socket = io(prod_url);


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


socket.on('connect', () => {
    // showMessage('You are connected')
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
        let msg = e.target.elements.input_message.value;
        socket.emit('chatMsg', JSON.stringify({...user, msg}));
        sendMsgToDb(user, msg);
        e.target.elements.message.value = '';
        e.target.elements.message.focus();
    });
}


function showMessage(message){
    if(!message) return 0;

    let info = JSON.parse(message);
    let div = document.createElement('div');
    div.setAttribute('class', ['message message_self']);

    div.innerHTML = `
    <div class="message_text">
        <p class="message_txt">${info.msg}</p>
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