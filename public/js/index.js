const loginForm = document.querySelector('.form_login');
const formPost = document.querySelector('.create-post_form');

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

            console.log(data);

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