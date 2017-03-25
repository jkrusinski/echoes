class Profile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      allEntries: [],
      watching: [],
      currentUser: props.target ? props.target : props.user.username,
      isLoggedInUser: !props.target,
      isFollowing: props.user.followers.includes(props.target)
    };

    this.getEntries = this.getEntries.bind(this);
    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      currentUser: newProps.target ? newProps.target : newProps.user.username,
      isLoggedInUser: !newProps.target,
      isFollowing: newProps.user.followers.includes(newProps.target)
    }, this.getEntries);
  }

  componentDidMount() {
    this.getEntries();
  }

  getEntries() {

    $.ajax({
      method: 'GET',
      url: '/querydb/?username=' + this.state.currentUser,
      success: (data) => {
        this.setState({
          allEntries: data
        });
      }
    });

    $.ajax({
      method: 'GET',
      url: '/api/follower/' + this.state.currentUser,
      success: (data) => {
        this.setState({
          watching: data
        });
      }
    });
  }

  follow() {
    var target = this.props.target;

    $.ajax({
      method: 'POST',
      url: '/api/follower/',
      data: {
        follower: target
      },
      success: () => {
        console.log('Follower Added');
        this.props.addFollower(target);
      }
    });
  }

  unfollow() {
    var target = this.props.target;
    $.ajax({
      method: 'POST',
      url: '/api/follower/' + target,
      success: () => {
        console.log('Follower Removed');
        this.props.removeFollower(target);
      }
    });
  }

  render () {
    return (
      <div className="container">
        <h1>{this.state.isLoggedInUser ? 'Your' : this.state.currentUser + '\'s'} Profile</h1>

        {this.state.isFollowing && !this.state.isLoggedInUser ? (
          <button onClick={this.unfollow}>Unfollow</button>
        ) : (null) }

        {!this.state.isFollowing && !this.state.isLoggedInUser ? (
          <button onClick={this.follow}>Follow</button>
        ) : (null) }

        <div className="row">
          <div className='col-md-8'>
            <h2 className="profile-header">Impressions:</h2>
            <table className="table-responsive table">
              <UserProfileList allEntries={this.state.allEntries} />
            </table>
          </div>
          <div className='col-md-4'>
            <h2 className="profile-header">Following:</h2>
            <table className="table-responsive table">
              <WatcherList allWatcher={this.state.watching} />
            </table>
          </div>
        </div>
      </div>
    );
  }
}
