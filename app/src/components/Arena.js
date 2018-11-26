import React from "react";
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

class Arena extends React.Component {


  handleClick = (user)=>{
    console.log('long ấy user',user);
    if(this.props.socket){
      this.props.socket.emit("challenge",user.uid,user.socketid)
    }
  }
  render() {
    if(!this.props.auth){
      this.props.history.push('/');
    }
    console.log('long check usersssss', this.props.usersOnline);
    return (
      <section className="arena">
        <Link to="/" style={{position:"absolute", top:"10px", left:"50px", textDecoration:"none", borderRadius:"10px"}} className="btn">Dashboard</Link>
        <div className="col span-2-of-8">
          <div className="arena__sidebar">
            <div className="arena__sidebar--change-page">
              <i className="fas fa-angle-double-left arena__sidebar--change-page--icon" />
              Page
              <i className="fas fa-angle-double-right arena__sidebar--change-page--icon" />
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
            
            <div className="card" key={user.uid}>
              <div className="card__avatar">
                <img
                  className="card__avatar--img"
                  src={require("../img/person1.png")}
                  alt="avatar"
                />
              </div>
              <div className="card__name">Vipmath171</div>
              <div className="card__btn btn">
                <div className="card__btn--icon" onClick={()=>this.handleClick(user)}>Challenge</div>
              </div>
            </div>

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
    socket : state.user.currentUser.socket,
    auth : state.user.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Arena);

