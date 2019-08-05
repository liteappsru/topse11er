var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var Link = window.ReactRouter.Link;

const TABLE_COLUMNS = [
    {
        label: 'Name',
        sort: 'default',
    },{
        label: 'ID',
        sort: 'default',
    },{
        label: 'Count',
        sort: 'default',
    }
];

const SortableHeader = (props) => {
    return(
        <thead>
        <tr>
            {TABLE_COLUMNS.map((element, index) =>
                <th key={index}>{element.label}</th>
            )}
        </tr>
        </thead>
    )
}

const SortableBody = ({data}) => {
    return(
        <tbody>
        {/*{data.map((element, index) =>*/}
        {/*    <tr key={index}>*/}
        {/*        {element.map((item, i) =>*/}
        {/*            <td key={i}>{item}</td>*/}
        {/*        )}*/}
        {/*    </tr>*/}
        {/*)}*/}
        </tbody>
    )
}

class salesDetails extends React.Component {
    static propTypes = {
        data: React.PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            column: TABLE_COLUMNS,
        }
    }

    componentWillMount() {
        const { data } = this.props;
        this.setState({ data })
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps;
        this.setState({ data })
    }

    render() {
        return (
            <table className=''>
                <SortableHeader columns={this.state.columns} />
                <SortableBody data={this.state.data} />
            </table>
        );
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route component={salesDetails} path="/"></Route>
    </Router>,
document.getElementById('salesDetails'));