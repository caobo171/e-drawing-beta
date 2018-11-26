import React from "react";
export default class WordNotify extends React.Component {
  
  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        {this.props.isEnd ? 
           ( 
            <div className="popup-top notification">
              <div className="notification-end popup-top__content">
                <div className="notification-end__stars ">
                   <i className="notification-end__star fas fa-star"></i>
                   <i className="notification-end__star fas fa-star"></i>
                   <i className="notification-end__star far fa-star"></i>
                </div>   
                <div className="notification-end__experience">+200 </div>        
              </div>
            </div>
              // <div className="popup-top notification">
          //     <div className="notification-end popup-top__content">
          //       <div className="notification-end__stars ">
          //          <i className="notification-end__star fas fa-star"></i>
          //          <i className="notification-end__star fas fa-star"></i>
          //          <i className="notification-end__star fas fa-star"></i>
          //       </div>   
          //       <div className="notification-end__experience">+200 </div>        
          //     </div>
          //   </div>
           ) : (
            <div className="popup-top notification">
            <div className="notification-word popup-top__content">
              <div className="notification-word__content">
                <p className="notification-word__content--note">Draw 1/5 Words</p>
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
         
        
           )
        }
      </React.Fragment>
    );
  }
}
