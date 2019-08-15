let Router = window.ReactRouter.Router;
let Route = window.ReactRouter.Route;
let hashHistory = window.ReactRouter.hashHistory;
let Link = window.ReactRouter.Link;

class Square extends React.Component {
    render() {
        return (
            <div className="col-md-3 col-sm-6 col-6 equel-grid">
                <div className="grid">
                    <div className="grid-body text-gray">
                        <p className="text-black">Сегодня</p>
                        <div className="d-flex justify-content-between">
                            <p value={this.state.value}>30%</p>
                            <p>+06.2%</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={i} />;
    }

    render() {
        return (
            <div className="row" id="commonPanels">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(2)}
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Board />,
    document.getElementById('commonPanels'));