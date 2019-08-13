let Router = window.ReactRouter.Router;
let Route = window.ReactRouter.Route;
let hashHistory = window.ReactRouter.hashHistory;
let Link = window.ReactRouter.Link;

class Signin extends React.Component {
    constructor(props) {
        super(props);
    }
    signIn(){
        axios.post('/signin', {
            email: this.state.email,
            password: this.state.password
        })
        .then(function (response) {
            if(response.data == 'Success'){
                window.location.assign('./home')
            }
            else {
                alert(response.data);
                //window.location.assign('./')
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <div>test</div>
        )
    }
}

ReactDOM.render(
    Signin.render(),
    document.getElementById('user'));
