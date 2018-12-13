import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {limitName} from './helpers/brief';


class Arena extends React.Component {
  constructor(props){
    super(props);
    window.socket.emit('get-users-online');
  }
  handleClick = user => {
    
    // window.user = this.props.currentUser;
    const {currentUser} = this.props;
    const userEmit = {avatar:currentUser.avatar,name:currentUser.name};
    window.user = userEmit;
    if (this.props.currentUser) {
      window.socket.emit("challenge",currentUser.uid,
      userEmit
       ,user.socketid);
    }
  };
  render() {
    if (!this.props.auth) {
      this.props.history.push("/");
    }
    return (
      <section className="arena">
        <Link
          to="/"
          style={{
            position: "absolute",
            top: "10px",
            left: "50px",
            textDecoration: "none",
            borderRadius: "10px"
          }}
          className="btn"
        >
          Dashboard
        </Link>
        <div className="col span-2-of-8">
          <div className="arena__sidebar">
            <div className="arena__sidebar--change-page">
              <i className="fas fa-angle-double-left arena__sidebar--change-page--icon" />
              Page
              <i className="fas fa-angle-double-right arena__sidebar--change-page--icon" />
            </div>
            <div className="arena__sidebar--avatar">
                <img className="arena__sidebar--avatar--img" src={this.props.currentUser.avatar}></img>
            </div>
            <img
              className="arena__sidebar--img"
              src={require("../img/pencil_warrior-2-pts.png")}
              alt=""
            />
          </div>
        </div>
        <div className="col span-5-of-8 arena__place">
          {this.props.usersOnline.map(user => (
            <React.Fragment  key={user.uid}>
              {user.uid !== this.props.currentUser.uid && (
                <div className="card">
                  <div
                    className="card__avatar"
                    onClick={() => {
                      this.props.history.push(`/profile/${user.uid}`);
                    }}
                  >
                    <img
                      className="card__avatar--img"
                      src={user.avatar}
                      alt="avatar"
                    />
                  </div>
                  <div className="card__name">{limitName(user.name)}</div>
                  <div className="card__btn btn">
                    <div
                      className="card__btn--icon"
                      onClick={() => this.handleClick(user)}
                    >
                      Challenge
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="col span-1-of-8" />
      </section>
    );
  }
}

const mapStatetoProps = state => {
  return {
    usersOnline: state.user.usersOnline,
    currentUser: state.user.currentUser,
    auth: state.user.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Arena);
