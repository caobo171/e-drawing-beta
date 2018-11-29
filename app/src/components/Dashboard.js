import React from "react";
import { connect } from "react-redux";
import { logOut } from "../actions/authActions";
import { Link } from "react-router-dom";

class Dashboard extends React.Component {
  render() {
    if (!this.props.auth) {
      this.props.history.push("/login");
    }
    const { currentUser, auth } = this.props;

    return (
      <React.Fragment>
        {currentUser.name && auth ? (
          <React.Fragment>
 <section className="dashboard" id="dashboard">
            <div className="row">
              <div className="col span-2-of-3" />
              <div className="col span-1-of-3">
                <ul className="nav">
                  <li className="nav__link">
                    <strong>{currentUser.name}</strong>
                  </li>
                  <li className="nav__avatar">
                    <img
                      className="nav__avatar--img"
                      src={currentUser.avatar}
                      alt="avatar"
                    />
                  </li>
                  <li
                    className="nav__link"
                    onClick={() => {
                      if (window.confirm("Are you sure ?")) {
                        this.props.logOut();
                      }
                    }}
                  >
                    LogOut
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col span-1-of-2">
                <div className="dashboard__symbol">
                  <img
                    className="dashboard__symbol--img"
                    src={require("../img/pencil_warrior-4-pts.png")}
                    alt=""
                  />
                </div>
                <div className="dashboard__list">
                  <div className="dashboard__list--icon">
                    <a
                      className="dashboard__list--icon--a"
                      href="#popup-sidebar-friend"
                    >
                      <i className="fas fa-user-friends" />
                      <div className="dashboard__list--caption">friends</div>
                    </a>
                  </div>
                  <div className="dashboard__list--icon">
                    <a href="#popup" className="dashboard__list--icon--a">
                      <i className="fas fa-edit" />
                      <div className="dashboard__list--caption">notes</div>
                    </a>
                  </div>
                  <div className="dashboard__list--icon">
                    <Link
                      to={`/profile/${currentUser.uid}`}
                      className="dashboard__list--icon--a"
                    >
                      <i className="fas fa-address-book" />
                      <div className="dashboard__list--caption">profile</div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col span-1-of-2">
                <div className="dashboard__nav">
                  <Link to="/ranking" className="dashboard__card">
                    <div className="dashboard__card--icon">
                      <i className="dashboard__card--icon--i fas fa-crown" />
                    </div>
                    <div className="dashboard__card--title">
                      <h3 className="heading-tertiary">The Rankings</h3>
                    </div>
                  </Link>
                  <Link to="/arena" className="dashboard__card">
                    <div className="dashboard__card--icon">
                      <i className="dashboard__card--icon--i fas fa-chess-rook" />
                    </div>
                    <div className="dashboard__card--title">
                      <h3 className="heading-tertiary">The Fighting Arena</h3>
                    </div>
                  </Link>
                  <Link to="/practice" className="dashboard__card">
                    <div className="dashboard__card--icon">
                      <i className="dashboard__card--icon--i fas fa-book" />
                    </div>
                    <div className="dashboard__card--title">
                      <h3 className="heading-tertiary">Practicing Place</h3>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <div className="note popup" id="popup">
              <ul className="popup__content note__content">
                <h2 className="heading-secondary note__title">Notes</h2>
                <a href="#" className="popup__close note__close">&times;</a>
                <li>
                  <em>You have <strong>15s</strong> each part of match to draw the image.</em>      
                </li>
                <li>
                  <em>
                  if your image is in <strong>3 tops</strong> of prediction. <br/>You're faster than your opponent, you're win.
                  </em>
              
                </li>
                <li>
                  <em>Keep practicing, you just need some line-drawing to win. <br/> Optimize your time !</em>
                </li>
              </ul>
          </div>
          </React.Fragment>
         
        ) : (
          <h1>Loading...</h1>
        )}
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return {
    currentUser: state.user.currentUser,
    auth: state.user.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logOut: () => {
      dispatch(logOut());
    }
  };
};

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Dashboard);
