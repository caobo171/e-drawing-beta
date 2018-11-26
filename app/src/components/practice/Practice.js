import React, { Component } from "react";
import { connect } from "react-redux";
import P5Wrapper from "react-p5-wrapper";
import sketchPractice from "../../sketches/sketchPractice";
import AI from "../../sketches/aiService";
import WordNotify from "./WordNotify";

class Practice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      start: false,
      wordList:[],
      time: 5,
      prediction: [],
      isNotify: true
    };
    this.handleLevelUp = this.handleLevelUp.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.tick = this.tick.bind(this);
    this.timer = "";
    this.handlePredict = this.handlePredict.bind(this);
    this.renderWord = this.renderWord.bind(this);
    let wordList
    this.renderWord().then((data)=>{
      console.log('cao data',data);
      this.setState({wordList:data})
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
    if (prediction.length >= 5) {
      clearInterval(this.timer);
      this.setState({ isNotify: true });
      setTimeout(() => {
        this.props.history.push("/");
      }, 5000);
    } else {
      this.setState({ prediction, time: 5, isNotify: true }, () => {
        console.log("cao", this.state.prediction);
      });
    }
  }
  handleStart() {
    console.log("click");
    this.setState({ start: true }, () => {
      this.timer = setInterval(() => {
        if (this.state.time > 0) {
          this.tick();
        } else if (this.state.isNotify) {
          this.setState({ time: 15, isNotify: false });
        }
      }, 1000);
    });
  }

  async renderWord() {
    const ai = new AI();

    let data = await ai.readFile();
    await ai.success(data);
    const id = Math.floor(Math.random() * 344); //ti le ko deu lam thi phai
    let wordList = this.getRandom(ai.classNames, 5);
    console.log("cao wordList", wordList);
    // this.setState({ wordList: ai.classNames[id] }, () =>
    //   console.log(this.state.wordList)
    // );
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
              <section className="match">
                <div className="board" id="sketchPractice">
                  <div className="board__avatar--right">
                    <div className="board__avatar--name--right">
                      {user.name}
                    </div>
                    <img
                      className="board__avatar--img"
                      src={user.avatar}
                      alt="avatar"
                    />
                  </div>
                  <div className="board__dashboard" />
                  <P5Wrapper
                    timer={this.state.time}
                    sketch={sketchPractice}
                    word={this.state.wordList[this.state.prediction.length]}
                    handleLevelUp={val => this.handleLevelUp(val)}
                  />
                  <canvas
                    id="canvas1"
                    width="520%"
                    height="530%"
                    className="canvas"
                    style={{ border: "1px , solid white", marginTop: "-78px" }}
                  />
                </div>
                <div className="match__score" id="status">
                  Loading...
                </div>
                <div className="match__timer">
                  <i className="match__timer--clock far fa-clock" />
                  <div className="match__timer--number">
                    + {this.state.time}
                  </div>
                </div>
                <div className="board">
                  <div className="board__avatar--right">
                    <div className="board__avatar--name--left">
                      <h2>
                        <strong>Result</strong>
                      </h2>
                    </div>
                  </div>
                  <div className="board__dashboard" id="chart_prediction">
                    <section style={{ marginTop: "130px", marginLeft: "5rem" }}>
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
              </section>
            ) : (
              <WordNotify
                time={this.state.time}
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
  return {};
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
