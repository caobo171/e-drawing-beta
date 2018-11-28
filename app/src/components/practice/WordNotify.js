import React from "react";
export default class WordNotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exp: 0
    };
  }


  componentDidMount() {
    if (this.props.isEnd) {
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
                  this.props.history.push("/");
                }, 2000);
              }
            }
          );
        }, 30);
      }, 1000);
    }
  }
  renderStar() {
    switch (this.props.star) {
      case 1:
        return (
          <div className="notification-end__stars ">
            <i className="notification-end__star fas fa-star" />
            <i className="notification-end__star far fa-star" />
            <i className="notification-end__star far fa-star" />
          </div>
        );
      case 2:
        return (
          <div className="notification-end__stars ">
            <i className="notification-end__star fas fa-star" />
            <i className="notification-end__star fas fa-star" />
            <i className="notification-end__star far fa-star" />
          </div>
        );
      case 3:
        return (
          <div className="notification-end__stars ">
            <i className="notification-end__star fas fa-star" />
            <i className="notification-end__star fas fa-star" />
            <i className="notification-end__star fas fa-star" />
          </div>
        );
      case 0:
      default:
        return (
          <div className="notification-end__stars ">
            <i className="notification-end__star far fa-star" />
            <i className="notification-end__star far fa-star" />
            <i className="notification-end__star far fa-star" />
          </div>
        );
    }
  }

  render() {
    //console.log(this.props);
    return (
      <React.Fragment>
        {this.props.isEnd ? (
          <div className="popup-top notification">
            <div className="notification-end popup-top__content">
              <React.Fragment>
                {
                  this.renderStar()
                }
              </React.Fragment>
              <div className="notification-end__experience">
                +{this.state.exp}{" "}
              </div>
            </div>
          </div>
        ) : (
     
          <div className="popup-top notification">
            <div className="notification-word popup-top__content">
              <div className="notification-word__content">
                <p className="notification-word__content--note">
                  Draw {this.props.stage}/5 Words
                </p>
                <h1 className="heading-primary notification-word__content--word">
                  {this.props.word}
                </h1>
                <p className="notification-word__content--warning">
                  Under 15s and continue in
                  <span className="notification-word__content--warning--count-down">
                    {" "}
                    {this.props.time}{" "}
                  </span>{" "}
                  s
                </p>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
