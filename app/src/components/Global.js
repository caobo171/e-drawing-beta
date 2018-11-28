import React from "react";
import { connect } from "react-redux";
import { setUsersOnline } from "../actions/userActions";
import { logOut } from "../actions/authActions";

class Global extends React.Component {
  state = {
    ischallenged: false,
    uid: null,
    user: null
  };
  componentDidMount() {
    
    if (window.socket) {
      window.socket.on('user-exist',()=>{
        alert('Another Loggined Your Account !');
        this.props.logOut();
        
      })
      window.socket.on("challenge", (uid, user) => {
        console.log("cao da nhan duoc challeng", user);
        this.setState({ ischallenged: true, uid: uid, user });
      });

      window.socket.on("get-users", data => {
        this.props.setUsersOnline(data);
      });

      window.socket.on("server-change-route", uid => {
        const urlParams = new URLSearchParams(window.location.search);
        const roomid = urlParams.get("roomid");
        if (!roomid) {
          this.props.history.push("/testplay?roomid=" + uid);
        }
      });
    }
  }

  handleAccept = () => {
    this.setState({ ischallenged: false });
    this.props.socket.emit("client-accept", this.state.uid);
    this.props.history.push("/testplay?roomid=" + this.state.uid);
  };

  handlerDecline = () => {
    this.setState({ ischallenged: false });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.ischallenged && (
          <div className="popup-simple notification-challenge">
            <div className="notification-challenge__avatar">
              <div className="notification-challenge__avatar--group">
                <img
                  className="card__avatar--img notification-challenge__avatar--group--img"
                  src={this.state.user.avatar}
                  alt="avatar"
                />
                <p className="notification-challenge__avatar--group--name">
                  {this.state.user.name}
                </p>
              </div>
              <p className="notification-challenge__avatar--content">
                is challenging you
              </p>

              <a
                href="#2"
                className="btn-teal"
                onClick={() => this.handleAccept()}
              >
                accept
              </a>
              <a
                href="#2"
                className="btn-blue"
                onClick={() => this.handlerDecline()}
              >
                decline
              </a>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUsersOnline: data => {
      dispatch(setUsersOnline(data));
    },
    logOut: () => {
      dispatch(logOut());
    }

  };
};

const mapStatetoProps = state => {
  return {
    socket: state.user.currentUser.socket
  };
};

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Global);
