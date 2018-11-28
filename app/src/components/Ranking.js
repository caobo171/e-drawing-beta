import React, { Component } from "react";
import { connect } from "react-redux";
import { getUsers } from "./../actions/userActions";
import { Link } from "react-router-dom";
import { levelProcess } from './../sketches/levelprocess';
class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0
    };
    this.props.getUsers();
  }
  render() {
    const { users, user } = this.props;
    console.log("cao currentUser", user);
    let rank = 5;
    let usersShow = [];
    if (user) {
      users.forEach((e, i) => {
        if (e.uid === user.uid) {
          rank = i;
        }
        if ((i >= this.state.page * 5) && i < (this.state.page * 5 + 5)) {
          usersShow.push(e);
        }
      });
    }

    console.log("cao users", users);
    return (
      <section className="ranking">
        <Link to="/" style={{position:"absolute", top:"10px", left:"50px", textDecoration:"none", borderRadius:"10px"}} className="btn">Dashboard</Link>
        <div className="row">
          <div className="col span-1-of-8" />
          <div className=" col span-4-of-8">
            <div className="ranking__dashboard">
              <h2 className="ranking__dashboard--title heading-primary">
                Rank
                <i className="fas fa-trophy ranking__dashboard--title--icon" />
              </h2>
              <ul className="table">
                <li className="table__title">
                  <i className=" fas fa-crown table__title--icon" />
                  <i className="fas fa-users table__title--icon" />
                  <i className="fas fa-coins table__title--icon" />
                  <i className="fas fa-award table__title--icon" />
                </li>
                {/* ----------------- List Item ------------------- */}
               
                  {usersShow.map((user,i) => (
                    <li className="table__item" key={user.uid}>
                      <h4 className="table__item--rank">#{this.state.page*5 + i+1}</h4>
                      <Link
                        className="table__item__link"
                        to={`/profile/${user.uid}`}
                      >
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="table__item__link--img"
                        />
                        <p className="table__item__link--name">{user.name}</p>
                      </Link>
                      <div className="table__item--score">{user.exp}</div>
                      <div className="table__item--award">{levelProcess(user.exp)}</div>
                    </li>
                  ))}
            
                {/* ---------------------  List Item End ---------------------*/}
              </ul>
              <div className="table--change-page">
                <i
                  onClick={() => {
                    if (this.state.page > 0) {
                      this.setState(state => {
                        return { page: state.page - 1 };
                      });
                    }
                  }}
                  className="fas fa-angle-double-left table--change-page--icon"
                />
                Page
                <i
                  onClick={() =>
                    this.setState(state => {
                      return { page: state.page + 1 };
                    })
                  }
                  className="fas fa-angle-double-right table--change-page--icon"
                />
              </div>
            </div>
          </div>
          <div className="col span-3-of-8">
            <div className="ranking__owner">
              <h1 className="ranking__owner--rank heading-primary">
                #{rank + 1}
              </h1>
            </div>
            <img
              src={require("../img/pencil_warrior-3-pts.png")}
              alt=""
              className="ranking__picture"
            />
          </div>
        </div>
      </section>
    );
  }
}

const mapStatetoProps = state => {
  return {
    //auth:state.user.auth
    user: state.user.currentUser,
    users: state.user.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUsers: () => dispatch(getUsers())
  };
};
export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Ranking);
