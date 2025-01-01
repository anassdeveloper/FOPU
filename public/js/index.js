const loginForm = document.querySelector('.form_login');
const formPost = document.querySelector('.create-post_form');

if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        fetch('http://localhost:3000/auth/login', {
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

            

            const res = await fetch('http://localhost:3000/api/v1/posts/create-new-post', {
                method: "POST",
                body: fm
            });

            const data = await res.json();

            console.log(data);

        }catch(err){
          
        }
    })
}