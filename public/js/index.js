const loginForm = document.querySelector('.form_login');
const formPost = document.querySelector('.create-post_form');
const formRegister = document.querySelector('.form_register');

const local_url = 'http://localhost:3000';
const prod_url = 'https://fopu.onrender.com';

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
                alert('You successfully login');
                return location.assign('/');
            }else if (data.status === 'fail'){
                alert(data.message);
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

            if(data.status === 'sucess') alert('SUCESS SAVED')
            else alert('Somethin wroong');

        }catch(err){
          
        }
    })
}

if(document.getElementById('photo')){
    document.getElementById('photo').addEventListener('change', e => {
        document.querySelector('.form_label').classList.add('saved');
        document.querySelector('.form_label').innerHTML = `photo saved <i class="fa-solid fa-check"></i>`
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
            console.log(result);
            
            if(result.status === 'success') location.reload(true);

         }catch(err){
            console.log(err);
            alert('ERROR')
         }
    })
}


if(document.querySelector('.logout_box')){
    document.querySelector('.logout_box').addEventListener('click', async e => {
        const btn = e.target.closest('.logout_box').classList.value;
         if(btn === 'logout_box'){
            const res = await fetch(`${prod_url}/auth/logout`);
            const result = await res.json();
            if(result.status === "success") {
                location.assign('/');
            }
         }
    })
}