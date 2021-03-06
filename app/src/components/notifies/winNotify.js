import React from "react";
export default class WinNotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exp: 0
    };
  }

  componentDidMount() {
      setTimeout(() => {
        let timer = setInterval(() => {
          this.setState(
            state => {
              return { exp: state.exp + 1 };
            },
            () => {
              if (this.state.exp >= this.props.exp) {
                clearInterval(timer);
                setTimeout(() => {
                  //this.props.history.push("/arena");
                  window.location = window.location.origin
                }, 2000);
              }
            }
          );
        }, 10);
      }, 1000);
  }
  render() {
    return (
      <div className="popup-toward notification">
        <div className="notification-win popup-toward__content">
          <i className="fas fa-thumbs-up notification-win__icon" />
          <h1 className="notification-win__heading heading-primary">
            Win<span className="notification-win__heading--quote">!</span>
          </h1>
          <div className="notification__content">
            <div className="notification__content--item">
              <i className="fas fa-coins notification__content--item--i" />
              <p className="notification__content--item--p">+{this.state.exp}</p>
            </div>
            <div className="notification__content--item">
              <i className="fas fa-star notification__content--item--i" />
              <p className="notification__content--item--p">3</p>
            </div>
            <div className="notification__content--item">
              <i className="fas fa-hourglass-start notification__content--item--i" />
              <p className="notification__content--item--p">30s</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
