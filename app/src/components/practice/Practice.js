import React, { Component } from "react";
import { connect } from "react-redux";
import P5Wrapper from "react-p5-wrapper";
import sketchPracticeBeta from "../../sketches/sketchPracticeBeta";
import Central from "../../sketches/centralprocess";
import WordNotify from "./WordNotify";
import { upExpByID } from "../../actions/userActions";

class Practice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      start: false,
      wordList: [],
      time: 6,
      prediction: [],
      isEnd: false,
      star: 0,
      exp: 0,
      // Comment true to go back normally
      isNotify: true
    };
    this.handleLevelUp = this.handleLevelUp.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.tick = this.tick.bind(this);
    this.timer = "";
    this.handlePredict = this.handlePredict.bind(this);
    this.renderWord = this.renderWord.bind(this);
    this.renderWord().then(data => {
      console.log("cao data", data);
      this.setState({ wordList: data });
    });
  }

  tick() {
    this.setState(state => {
      return { time: state.time - 1 };
    });
  }
  handleLevelUp(value) {
    console.log("cao cao");
    let prediction = this.state.prediction;
    prediction.push(value);
    // cho su li ket thuc
    //
    if (prediction.length >= 5) {
      clearInterval(this.timer);
      const {exp,starNumber} = this.processStartAndExp(prediction);

      this.setState({ isNotify: true, isEnd: true,exp,star:starNumber }, () => {
        console.log("cao uid", this.props.user.uid);
        this.props.upExpByID(this.props.user.uid, exp,starNumber);
      });
    } else {
      this.setState({ prediction, time: 5, isNotify: true }, () => {
        console.log("cao", this.state.prediction);
      });
    }
  }
  handleStart() {
    this.setState({ start: true }, () => {
      this.timer = setInterval(() => {
        if (this.state.time > 0) {
          // COmment dong nay de dung
          this.tick();
        } else if (this.state.isNotify) {
          this.setState({ time: 15, isNotify: false });
        }
      }, 1000);
    });
  }

  async renderWord() {
    const central = new Central();
    window.central = central;

    let data = await central.readFile();
    await central.successClassNames(data);
    let wordList = this.getRandom(central.symbols, 5);
    return wordList;
  }

  getRandom(arr, n) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  processStartAndExp(arr) {
    let score = 0;
    let starNumber = 0;
    let exp = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        score += 1;
      }
    }
    switch (score) {
      case 1:
      case 2:
        starNumber = 1;
        break;
      case 3:
      case 4:
        starNumber = 2;
        break;
      case 5:
        starNumber = 3;
        break;
      default:
        starNumber = 0;
        break;
    }
    switch (starNumber) {
      case 1:
        exp = 100;
        break;
      case 2:
        exp = 200;
        break;
      case 3:
        exp = 500;
        break;
      default:
        exp = 0;
        break;
    }
    return {exp,starNumber}
  }

  handlePredict(prediction) {
    this.setState({ prediction: prediction });
  }

  render() {
    const { user } = this.props;

    //console.log("cao", this.state.wordList[this.state.prediction.length]);
    return (
      <React.Fragment>
        {this.state.start ? (
          <div>
            {!this.state.isNotify ? (
              <section className="practice">
                <div className="practice__board" id="sketchPractice">
                  <div className="practice__board--avatar">
                    <div className="practice__board--avatar--name">
                      {user.name}
                    </div>
                    <img
                      className="practice__board--avatar--img"
                      src={user.avatar}
                      alt="avatar"
                    />
                  </div>
                  <div className="practice__board--dashboard" />
                  <P5Wrapper
                    timer={this.state.time}
                    sketch={sketchPracticeBeta}
                    word={this.state.wordList[this.state.prediction.length]}
                    handleLevelUp={val => this.handleLevelUp(val)}
                  />
                  <canvas
                    id="canvas1"
                    // width="520%"
                    // height="530%"
                    className="practice__canvas"
                    style={{
                      border: "1px , solid white",
                      position: "absolute"
                    }}
                  />
                </div>
                <div className="practice__dashboard">
                  <div className="practice__timer">
                    <div className="practice__timer--status" id="status">
                      Loading...
                    </div>
                    <i className="practice__timer--clock far fa-clock" />
                    <div className="practice__timer--number">
                      {this.state.time} s
                    </div>
                  </div>
                  <div className="practice__result">
                    <div className="practice__result--title">
                      <h2>Result</h2>
                    </div>
                    <div
                      className="practice__chart-prediction"
                      id="chart_prediction"
                    >
                      <section className="practice__chart">
                        <div className="pieID pie" />
                        <ul className="pieID legend">
                          <li>
                            <em id="sym1" />
                            <span id="prob1" />
                          </li>
                          <li>
                            <em id="sym2" />
                            <span id="prob2" />
                          </li>
                          <li>
                            <em id="sym3" />
                            <span id="prob3" />
                          </li>
                          <li>
                            <em id="sym4" />
                            <span id="prob4" />
                          </li>
                          <li>
                            <em id="sym5" />
                            <span id="prob5" />
                          </li>
                        </ul>
                      </section>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <WordNotify
                history={this.props.history}
                isEnd={this.state.isEnd}
                exp={this.state.exp}
                star={this.state.star}
                time={this.state.time}
                stage = {this.state.prediction.length}
                word={this.state.wordList[this.state.prediction.length]}
              />
            )}
          </div>
        ) : (
          <Start handleStart={this.handleStart} />
        )}
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return {
    user: state.user.currentUser,
    auth: state.user.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    upExpByID: (userID, expAdd,starAdd) => {
      dispatch(upExpByID(userID, expAdd,starAdd));
    }
  };
};

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Practice);

class Start extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div
        className=" notification"
        style={{
          height: "100vh",
          width: "100%",
          position: "fixed",
          top: "0",
          left: "0",
          backgroundColor: "rgba(255, 51, 0, 0.8)",
          zIndex: 90,
          opacity: 1
        }}
      >
        <div
          className="notification-word "
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "hidden",
            opacity: 1
          }}
        >
          <div className="notification-word__content">
            <p className="notification-word__content--note">You have 15s</p>
            <h1 className="heading-primary notification-word__content--word">
              <a
                
                onClick={() => this.props.handleStart()}
                style={{ cursor: "pointer" }}
              >
                Start !
              </a>
            </h1>
            <p className="notification-word__content--warning">
              You have to draw each required word
              <span className="notification-word__content--warning--count-down" />
            </p>
          </div>
        </div>
      </div>
    );
  }
}
