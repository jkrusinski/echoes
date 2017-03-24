class SearchUser extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userSearch: '',
      results: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value }, this.search);
  }

  search() {
    if (this.state.userSearch) {

      var query = $.param({ search: this.state.userSearch });

      $.ajax({
        method: 'GET',
        url: '/api/users/?' + query,
        success: (data) => {
          this.setState({
            results: data
          });
        }
      });
    } else {
      this.setState({ results: [] });
    }
  }

  render() {
    return (
      <div>
        <input type="text"
          name="userSearch"
          className="user-search-input"
          value={this.state.userSearch}
          onChange={this.handleInputChange} />

        <div className="search-results">
          {this.state.results.map((result) => (
            <div className="result" key={result.id}>
              <Link to={'/profile/' + result.username}>
                <h1>{result.user} - {result.username}</h1>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
