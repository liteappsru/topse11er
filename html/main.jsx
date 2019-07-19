var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var Link = window.ReactRouter.Link;

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
            <div className="grid">
              <div className="grid-body">
                <div className="row">
                  <div className="col-lg-7 col-md-8 col-sm-9 col-12 mx-auto form-wrapper">
                      <form className="form-signin">
                        <h2 className="form-signin-heading">Вход</h2>
                          <div className="form-group input-rounded">
                            <label for="inputEmail" className="sr-only">Email address</label>
                            <input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="Email" required autofocus />
                          </div>
                          <div className="form-group input-rounded">
                            <label for="inputPassword" className="sr-only">Password</label>
                            <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control form-group input-rounded" placeholder="Пароль" required />
                          </div>

                        <button className="btn btn-primary btn-block" onClick={this.signIn} type="button">Войти</button>
                      </form>
                      <div>
                        <Link to="/signup">{'Регистрация'}</Link>
                      </div>
                    </div>
                  </div>
                </div>
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
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.state = {
      name:'',
      email:'',
      password:''
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
  signUp(){
    axios.post('/signup', {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    })
    .then(function (response) {
      console.log(response);
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
                <div className="grid">
                  <div className="grid-body">
                    <div className="row">
                      <div className="col-lg-7 col-md-8 col-sm-9 col-12 mx-auto form-wrapper">
                      <form className="form-signin">
                        <h2 className="form-signin-heading">Регистрация</h2>
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

                        <button className="btn btn-primary btn-block" onClick={this.signUp} type="button">Зарегистрироваться</button>
                      </form>
                      <div>
                        <Link to="/">{'Войти'}</Link>
                      </div>
                    </div>
                  </div>
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