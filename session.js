const user = require('./user');
let validated = false;
let session;
let username;
let tsUser = '';
let error = 'Этот текст никогда не должен появляться. Вопросы к модулю session';

module.exports = {
    validated: validated,
    error: error,
    username: username,
    validate: function (req) {
        session = req.session;
        if (session) {
            const user_name=req.body.email;
            const password=req.body.password;
            const tsUser = user_name;
            console.log('validating ' + session.username);
            user.validateSignIn(user_name,password,function(result){
                if(result){
                    session.username = user_name;
                    console.log(Date.now() + ' авторизация: ' + user_name);
                    validated = true;
                    return true;
                }
                else{
                    error = 'Не верный логин или пароль';
                    return false;
                }
            });
        } else {
            error = 'Не указан логин';
            return false;
        }
    },
    tsUser:tsUser
};