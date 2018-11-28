import React, { Component } from "react";
import { connect } from "react-redux";
import P5Wrapper from "react-p5-wrapper";
import sketchTest2 from "../sketches/sketchTest2";
import sketchTestBeta from "../sketches/sketchTestBeta";
import WordNotify from "./notifies/wordNotify";
import WinNotify from "./notifies/winNotify";
import LoseNotify from "./notifies/loseNotify";
import DrawNotify from "./notifies/drawNotify";
import Central from "../sketches/centralprocess";
import { upExpByID, upDateWinGameByID } from "./../actions/userActions";

class TestBeta extends Component {
  constructor(props) {
    super(props);

    const urlParams = new URLSearchParams(window.location.search);
    this.roomid = urlParams.get("roomid");
    this.levelUp = this.leveUp.bind(this);
    this.renderWords = this.renderWords.bind(this);
    //this.handleAfter5s  = this.handleAfter5s.bind(this);
    this.renderNotify = this.renderNotify.bind(this);
    this.timer = null;
    this.state = {
      isOwner: null,
      myScore: 0,
      yourScore: 0,
      words: [],
      time: 20,
      level: 1,
      render: 1,
      exp: 0
    };
  }

  getRandom = (len, n) => {
    let result = new Array(n);
    let taken = new Array(len);
    while (n--) {
      let x = Math.floor(Math.random() * (len - 1));
      result[n] = x in taken ? taken[x] : x;
      taken[x] = --len in taken ? taken(len) : len;
    }
    return result;
  };

  renderWords() {
    console.log("cao á đù ");
    var central = new Central();
    central.readFile().then(data => {
      central.success(data);
      //   console.log('cao',data);
      let ids = this.getRandom(central.symbols.length, 5); //ti le ko deu lam thi phai
      let words = [];
      for (var i = 0; i < 5; i++) {
        words[i] = central.symbols[ids[i]];
      }
      this.setState({ words: words });
    });
  }

  handleTimeOut = () => {
    if (this.state.level <= 5) {
      this.setState(
        { level: this.state.level + 1, time: 20, render: 1 },
        () => {
          this.checkEndGame();
        }
      );
    }
  };

  checkEndGame = () => {
    if (this.state.level > 5) {
      console.log("End game! ");
      clearInterval(this.timer);

      if (this.state.myScore > this.state.yourScore) {
        this.setState({ render: 2, exp: 700 });
        this.props.upExpByID(this.props.user.uid, 700);
        this.props.upDateWinGameByID(this.props.user.uid, 1);
      } else if (this.state.myScore === this.state.yourScore) {
        this.setState({ render: 3, exp: 50 });
        this.props.upExpByID(this.props.user.uid, 50);
        this.props.upDateWinGameByID(this.props.user.uid, 0);
      } else {
        this.setState({ render: 4, exp: -200 });
        this.props.upExpByID(this.props.user.uid, -200);
        this.props.upDateWinGameByID(this.props.user.uid, -1);
      }
      console.log("long", this.state.render);
    }
  };

  leveUp = () => {
    console.log("long trying", this.state.level);
    window.socket.emit("client-level-up", this.roomid);
    if (this.state.level <= 5) {
      this.setState(
        state => ({
          myScore: state.myScore + 1,
          level: state.level + 1,
          time: 20,
          render: 1
        }),
        () => this.checkEndGame()
      );
    }
  };

  tick = () => {
    this.timer = setInterval(() => {
      // dem thoi gian de doi chu moi voi ca xoa canvas
      if (this.state.time > 0) {
        this.setState({ time: this.state.time - 1 });
      } else {
        this.handleTimeOut();
      }
      if (this.state.time === 15) {
        this.setState({ render: 0 });
      }
    }, 1000);
  };

  componentWillMount() {
    window.socket.on("server-set-owner", async isOwner => {
      await this.renderWords();
      console.log("long", this.state.words);
      window.socket.emit("client-send-word", this.state.words, this.roomid);
      this.setState({ isOwner });
      console.log("long", isOwner);
    });
    window.socket.on("server-set-guess", async isOwner => {
      await window.socket.on("server-send-word", words => {
        this.setState({ words });
      });
      this.setState({ isOwner });
      console.log("long", isOwner);
    });
    this.tick();
  }

  componentDidMount() {
    window.socket.on("server-level-up", () => {
      console.log("long level up");
      if (this.state.level <= 5) {
        this.setState(
          state => {
            return {
              yourScore: state.yourScore + 1,
              level: state.level + 1,
              time: 20,
              render: 1
            };
          },
          () => {
            this.checkEndGame();
          }
        );
      }
    });
  }

  componentWillUnmount() {
    clearInterval();
  }

  renderNotify() {
    switch (this.state.render) {
      case 1:
        return (
          <WordNotify
            word={this.state.words[this.state.level - 1]}
            time={this.state.time - 15}
            level={this.state.level}
          />
        );
      case 2:
        return <WinNotify exp={this.state.exp} history={this.props.history} />;
      case 3:
        return <DrawNotify exp={this.state.exp} history={this.props.history} />;
      case 4:
        return <LoseNotify exp={this.state.exp} history={this.props.history} />;
      default:
        return null;
    }
  }

  // {if (this.props.socket.id == id.)}
  render() {
    // console.log(this.props.auth.uid);
    const { user } = this.props;
    return (
      <div>
        <section className="practice">
          <div className="practice__board match__board--left" id="sketchPractice">
            <div className="practice__board--avatar match--avatar">
              <div className="practice__board--avatar--name">{user.name}</div>
              <img
                className="practice__board--avatar--img"
                src={user.avatar}
                alt="avatar"
              />
            </div>
            <div id="sketch1" className="practice__board--dashboard">
              <P5Wrapper
                socket={this.props.user.socket}
                roomId={this.roomid}
                text={this.state.words[this.state.level - 1]}
                time={this.state.time}
                levelUp={this.levelUp}
                sketch={sketchTestBeta}
              />
            </div>
            <canvas
              id="canvas2"
              width="520%"
              height="530%"
              className="practice__canvas match__canvas"
              style={{ border: "1px , solid white", position: "absolute" }}
            />
          </div>
          <div className="match__score" id="status" />
          <div className="match__score">
            {/* <div className="pieID pie" /> */}
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
          </div>
          <div className="match__timer">
          <h3>{this.state.time}s</h3>
          <h3>{this.state.myScore} : {this.state.yourScore}</h3>
          </div>
          <div className="practice__board match__board--right" id="sketchPractice">
            <div className="practice__board--avatar match--avatar">
              <div className="practice__board--avatar--name">Opponent</div>
              <img
                className="practice__board--avatar--img"
                src={require("../img/person2.png")}
                alt="avatar"
              />
            </div>
            <div id="sketch2" className="practice__board--dashboard">
              <P5Wrapper
                socket={this.props.user.socket}
                roomId={this.roomid}
                time={this.state.time}
                sketch={sketchTest2}
              />
            </div>
            <canvas
              id="canvas3"
              width="520%"
              height="530%"
              className="practice__canvas match__canvas"
              style={{ border: "1px , solid white", position: "absolute" }}
            />
          </div>
        </section>
        <React.Fragment>
          {this.state.isOwner != null ? this.renderNotify() : null}
        </React.Fragment>
      </div>
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
    upExpByID: (userID, expAdd) => {
      dispatch(upExpByID(userID, expAdd));
    },
    upDateWinGameByID: (userID, win) => {
      dispatch(upDateWinGameByID(userID, win));
    }
  };
};
export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(TestBeta);
