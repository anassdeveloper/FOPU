exports.login = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Login'
    });
}

exports.getSite = (req, res, next) => {
    res.status(200).render('base', {
        title: 'HOME'
    });
}

exports.me = (req, res, next) => {
    res.status(200).render('account', {
        title: 'Account'
    });
}