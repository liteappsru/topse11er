var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var Link = window.ReactRouter.Link;

class salesDetails extends React.Component {
    render() {
        return (
            Axios.post('/orders', {})
                .then(function (response) {
                    console.log(response);
                    if(response.data == 'Success'){
                        //window.location.assign('./home');
                    }
                    else{
                        alert(response.data);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        );
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route component={salesDetails} path="/"></Route>
    </Router>,
document.getElementById('salesDetails'));