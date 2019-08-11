let Router = window.ReactRouter.Router;
let Route = window.ReactRouter.Route;
let hashHistory = window.ReactRouter.hashHistory;
let Link = window.ReactRouter.Link;

class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.state = {
            email:'',
            password:''
        };
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
    handleEmailChange(e){
      this.setState({email:e.target.value})
    }
    handlePasswordChange(e){
      this.setState({password:e.target.value})
    }

    render() {
        return (
        <div className="row">
            <div className="col-lg-5 col-md-7 col-sm-9 col-11 mx-auto">
                <div className="text-center justify-content-center align-items-center">
                    <span className="tslogo">TopSe<span className="tslogoGreen">1<span className="tslogoInv">1</span></span>er</span>
                    <p></p>
                </div>
                <div className="grid">
                    <div className="grid-body">
                        <div className="row">
                            <div className="col-lg-7 col-md-8 col-sm-9 col-12 mx-auto form-wrapper">
                                <form className="form-signin">
                                    <div className="form-group input-rounded">
                                        <label for="inputEmail" className="sr-only">Email address</label>
                                        <input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="Email" required autofocus />
                                    </div>
                                    <div className="form-group input-rounded">
                                        <label for="inputPassword" className="sr-only">Password</label>
                                        <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control form-group input-rounded" placeholder="Пароль" required />
                                    </div>
                                    <button className="btn btn-primary btn-block" onClick={this.signIn} type="button">Войти</button>
                                    <div className="signup-link">
                                        <p><Link to="/signup">{'Зарегистрироваться'}</Link></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer tsfooter">
                    <p>&copy; 2019 TopSe11er.ru</p>
                </div>
            </div>
        </div>
        )
    }
}

class Signup extends React.Component{
    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this);
        this.handleNameChange         = this.handleNameChange.bind(this);
        this.handleEmailChange        = this.handleEmailChange.bind(this);
        this.handlePasswordChange     = this.handlePasswordChange.bind(this);
        this.handleOzonClientIdChange = this.handleOzonClientIdChange.bind(this);
        this.handleOzonApiKeyChange   = this.handleOzonApiKeyChange.bind(this);
        this.handleWbUserNameChange   = this.handleWbUserNameChange.bind(this);
        this.handleWbPasswordChange   = this.handleWbPasswordChange.bind(this);
        this.state = {
            name:'',
            email:'',
            password:'',
            ozonClientId:'',
            ozonApiKey:'',
            wbUserName:'',
            wbPassword:''
        };
    }
    handleNameChange(e){
        this.setState({name:e.target.value})
    }
    handleEmailChange(e){
        this.setState({email:e.target.value})
    }
    handlePasswordChange(e){
        this.setState({password:e.target.value})
    }
    handleOzonClientIdChange(e){
        this.setState({ozonClientId:e.target.value})
    }
    handleOzonApiKeyChange(e){
        this.setState({ozonApiKey:e.target.value})
    }
    handleWbUserNameChange(e){
        this.setState({wbUserName:e.target.value})
    }
    handleWbPasswordChange(e){
        this.setState({wbPassword:e.target.value})
    }
  signUp(){
    axios.post('/signup', {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
        ozonClientId:this.state.ozonClientId,
        ozonApiKey:this.state.ozonApiKey,
        wbUserName:this.state.wbUserName,
        wbPassword:this.state.wbPassword
    })
    .then(function (response) {
      if(response.data == 'Success'){
        window.location.assign('./home');
      }
      else{
        alert(response.data);      
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
      return (
        <div>
            <div className="row">
                <div className="col-lg-5 col-md-7 col-sm-9 col-11 mx-auto">
                    <div className="text-center justify-content-center align-items-center">
                        <span className="tslogo">TopSe<span className="tslogoGreen">1<span className="tslogoInv">1</span></span>er</span>
                        <p></p>
                    </div>
                    <div className="grid">
                        <div className="grid-body">
                            <div className="row">
                                <div className="col-lg-7 col-md-8 col-sm-9 col-12 mx-auto form-wrapper">
                                <form className="form-signin">
                                    <p></p>
                                    <div className="form-group input-rounded">
                                        <label for="inputName" className="sr-only">Name</label>
                                        <input type="name" onChange={this.handleNameChange} id="inputName" className="form-control" placeholder="Имя пользователя" required autofocus />
                                    </div>
                                    <div className="form-group input-rounded">
                                        <label for="inputEmail" className="sr-only">Email address</label>
                                        <input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="Email" required autofocus />
                                    </div>
                                    <div className="form-group input-rounded">
                                        <label for="inputPassword" className="sr-only">Password</label>
                                        <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Пароль" required />
                                    </div>
                                    <div className="form-group input-rounded">
                                        <label htmlFor="inputOzonClientId" className="sr-only">Password</label>
                                        <input type="text" onChange={this.handleOzonClientIdChange} id="inputOzonClientId"
                                               className="form-control form-group input-rounded" placeholder="Ozon Client Id"
                                               required/>
                                    </div>
                                    <div className="form-group input-rounded">
                                        <label htmlFor="inputOzonApiKey" className="sr-only">Password</label>
                                        <input type="text" onChange={this.handleOzonApiKeyChange} id="inputOzonApiKey"
                                               className="form-control form-group input-rounded" placeholder="Ozon API-KEY"
                                               required/>
                                    </div>
                                    <div className="form-group input-rounded">
                                        <label htmlFor="inputWbUserName" className="sr-only">Password</label>
                                        <input type="text" onChange={this.handleWbUserNameChange} id="inputWbUserName"
                                               className="form-control form-group input-rounded" placeholder="Пользователь WB"
                                               required/>
                                    </div>
                                    <div className="form-group input-rounded">
                                        <label htmlFor="inputWbPassword" className="sr-only">Password</label>
                                        <input type="text" onChange={this.handleWbPasswordChange} id="inputWbPassword"
                                               className="form-control form-group input-rounded" placeholder="Пароль WB"
                                               required/>
                                    </div>
                                    <button className="btn btn-primary btn-block" onClick={this.signUp} type="button">Зарегистрироваться</button>
                                    <p></p>
                                    <div className="signup-link">
                                        <p><Link to="/">{'Войти'}</Link></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="footer tsfooter">
                        <p>&copy; 2019 TopSe11er.ru</p>
                    </div>
                </div>
            </div>
        </div>
</div>
        
      )
  }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route component={Signin} path="/"></Route>
        <Route component={Signup} path="/signup"></Route>
    </Router>,
document.getElementById('app'));
