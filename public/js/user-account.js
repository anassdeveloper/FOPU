const user_item = Array.from(document.querySelectorAll('.user_navbar--item'));

if(user_item){
    user_item.forEach(item => {
        item.addEventListener('click', e => {
            let txt = e.currentTarget.id
            
            // if(String(txt) === 'hot') return console.log('Maybe later ...');

            if(e.currentTarget.classList.contains('user_navbar--active')){
                return -1;
            }
            user_item
            .forEach(el => el.classList.remove('user_navbar--active'));
            e.currentTarget.classList.add('user_navbar--active');

            Array.from(document.querySelectorAll('.grid'))
            .forEach(el => el.classList.remove('user_active'));

            document.querySelector(`.user_content--${txt}`).classList.add('user_active')

        })
    })
}


if(document.querySelector('.user_header--btn')){
    document.querySelector('.user_header--btn')
    .addEventListener('click', e => {
        let user = JSON.parse(e.currentTarget.dataset.user_profil);

        fetch(`http://localhost:3000/api/v1/users/invitasion/${user.currentUser}?name=${user.username}&id=${user.userId}`)
        .then(res => res.json())
        .then(message => console.log(message))
    })
}