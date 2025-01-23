const user_item = Array.from(document.querySelectorAll('.user_navbar--item'));

if(user_item){
    user_item.forEach(item => {
        item.addEventListener('click', e => {
            if(e.currentTarget.classList.contains('user_navbar--active')){
                console.log('woooork');
                return -1;
            }


            user_item
            .forEach(el => el.classList.remove('user_navbar--active'));
            e.currentTarget.classList.add('user_navbar--active');

        })
    })
}