var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var Link = window.ReactRouter.Link;

class salesDetails extends React.Component (){
    render() {
        <p>test</p>
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route component={salesDetails} path="/"></Route>
    </Router>,

document.getElementById('salesDetails'));