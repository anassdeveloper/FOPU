const loginForm = document.querySelector('.form_login');
const formPost = document.querySelector('.create-post_form');
const formRegister = document.querySelector('.form_register');
const postBx = Array.from(document.querySelectorAll('.card__bx'));

console.log(postBx)

// 'https://fopu.onrender.com'--'https://fopu.onrender.com'
const local_url = 'http://localhost:3000';
const prod_url = 'https://fopu.onrender.com';

const showMsg = (type, message, emoji) => {
    let html;
    switch(type){
        case 'success':
            html =  `<b class='show-msg ${type}'>${message} ${emoji}</b>`;
            break;
        case 'error':
            html =`<b class='show-msg ${type}'>${message} ${emoji}</b>`;
            break;
        default : 
            html = `<b class='show-msg'>${message} ${emoji}</b>`
    }

    document.querySelector('body').insertAdjacentHTML('afterbegin', html);

    setTimeout(e => {
        document.querySelector('body')
        .removeChild(document.body.firstElementChild);
    }, 5000)
}

if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        fetch(`${prod_url}/auth/login`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                email: email,
                password: pass
            })
        }).then(res => res.json())
        .then(data => {
            if(data.status === 'success'){
                showMsg('success', 'You successfully login', '😘');

                return location.assign('/');
            }else if (data.status === 'fail'){
                showMsg('error', 'Please check your email or password', '😢')
            }
        })
        .catch(err => console.log(err));
    })
}

if(formPost){
    formPost.addEventListener('submit', async (e) => {
        try{
            e.preventDefault();
            const fm = new FormData(formPost);
            const user = JSON.parse(formPost.dataset.user);

            fm.append('userId', user._id);
            fm.append('userPhoto', user.photo);
            fm.append('username', user.name);

            

            const res = await fetch(`${prod_url}/api/v1/posts/create-new-post`, {
                method: "POST",
                body: fm
            });

            const data = await res.json();

            if(data.status === 'success') showMsg('success', 'Your post saved ', '👌')
            else alert('Somethin wroong');

        }catch(err){
          
        }
    })
}

if(document.getElementById('photo')){
    document.getElementById('photo').addEventListener('change', e => {
        document.querySelector('.form_label--photo').classList.add('saved');
        document.querySelector('.form_label--photo').innerHTML = `photo saved <i class="fa-solid fa-check"></i>`
    })
}

if(formRegister){
    formRegister.addEventListener('submit', async  e => {
         try{
            e.preventDefault();
            const fm = new FormData(formRegister);
            const res = await fetch(`${prod_url}/auth/newuser`, {
                method: "POST",
                body: fm
            });

            const result = await res.json();
           
            
            if(result.status === 'success') {
                showMsg('success', 'your account created ', '🔥')
                location.assign('/');
            }else{
                showMsg('error', 'Somthing wrong', '⛔');
            }

         }catch(err){
            showMsg('error', err.message, '⛔');
            alert('ERROR')
         }
    })
}


if(document.querySelector('.logout')){
   
    document.querySelector('.logout').addEventListener('click', async e => {
       
        const btn = e.target.closest('.logout').classList.value;
        
         if(btn.split(' ')[0] === 'logout'){
            const res = await fetch(`${prod_url}/auth/logout`);
            const result = await res.json();
            
            if(result.status === "success") {
                showMsg('sucess', 'Your logout successfully', '😒')
                location.assign('/');
            }
         }
    })
}


if(document.querySelector('.account_form--remove')){
    document.querySelector('.account_form--remove').addEventListener('click', e => {
        const btn = e.target.closest('.account_form--remove').classList.value;
        if(btn === 'account_form--remove'){
            document.querySelector('.account_form').style.display = 'none';
            document.querySelector('.account_form--password').style.display = 'none';
        }
    })
}

if(document.querySelector('.account_form--rm')){
    document.querySelector('.account_form--rm').addEventListener('click', e => {
        const btn = e.target.closest('.account_form--rm').classList.value;
        if(btn === 'account_form--rm'){
            document.querySelector('.account_form--password').style.display = 'none';
        }
    })
};

if(document.querySelector('.box_setting--icon')){
    document.querySelector('.box_setting--icon').addEventListener('click', e => {
        document.querySelector('.account_form').style.display = 'block';
    })
}

if(document.getElementById('photo_update')){
    document.getElementById('photo_update').addEventListener('change', e => {
        let img = e.currentTarget.previousElementSibling.children[0];
        let selectedFile = e.target.files[0];
        let reader = new FileReader();

        img.title = selectedFile.name;
        reader.onload = e => {
            img.src = e.target.result;
        }
        reader.readAsDataURL(selectedFile);
    })
}

if(document.querySelector('.account_form')){
    try{
        document.querySelector('.account_form').onsubmit = async e => {
            e.preventDefault();
            const fm = new FormData(document.querySelector('.account_form'));
            const res = await fetch(`${prod_url}/api/v1/users/${e.target.dataset.user}`, {
                method: 'PATCH',
                body: fm
            });
            const msg = await res.json();
            if(msg.status === 'success'){
                showMsg('success', 'your account updated', '👀')
            }else{
                showMsg('error', 'somthing wrong', '👀')
            }
            console.log(msg);
        }
    }catch(err){
        console.log(err);
    }
}


if(document.querySelector('.btn_edit')){
    document.querySelector('.btn_edit').addEventListener('click', e => {
        document.querySelector('.account_form--password').style.display = 'block';
    })
}


if(document.querySelector('.account_form--password')){
    document.querySelector('.account_form--password').addEventListener('submit', e => {
        e.preventDefault();
        const currentPassword = document.getElementById('current-pass').value;
        const newPassword = document.getElementById('new-pass').value;
        const confirmPassword = document.getElementById('confrim-pass').value;

        fetch(`${prod_url}/auth/update-password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmPassword
            })
        }).then(res => res.json()).then(result => {
            if(result.status === 'success') showMsg('success', result.message, "👀")
            else showMsg('error', 'current password incorrect', "🙄")
        }).catch(err => console.log)
    })
}


if(postBx){
    postBx.forEach(el => {
        el.addEventListener('click', e => {
          const post = JSON.parse(e.currentTarget.dataset.post);

          let html = `<div class='show__post--card'>
               <h3 class='show__post--title'>${post.title}</h3>
               <picture class='show__post--photo'>
                   <img class='show__post--image' src='${post.photo}'>
               </picutre>

          <div>`;
          document.querySelector('.show__post').classList.add('active');
          document.getElementById('show__post--content').insertAdjacentHTML('afterbegin', html);
        })
    });
}

if(document.querySelector('.account_form--rmpost')){

    document.querySelector('.account_form--rmpost').onclick = e => {
        
        const btn = e.target.closest('.account_form--rmpost');
        
        if(btn.classList.value === 'account_form--rmpost'){
            console.log(true);
            document.querySelector('.show__post').classList.remove('active');
            document.getElementById('show__post--content').removeChild(document.querySelector('.show__post--card'));
        }
    }
}