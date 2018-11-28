
import Central from "./centralprocess";
import createPie from "./pie";
export default function sketchTest(p) {
  var word = "";
  var time = 15;
  var socket = null;
  var levelUp = null;
  var roomId;

  var centralProcess;

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    word = props.text;
    time = props.time;
    levelUp = props.levelUp;
    socket = props.socket;
    roomId = props.roomId;
  };
  function setTable(top5, probs) {
    for (var i = 0; i < top5.length; i++) {
      try {
        let sym = document.getElementById("sym" + (i + 1));
        let prob = document.getElementById("prob" + (i + 1));
        sym.innerHTML = top5[i];
        prob.innerHTML = Math.round(probs[i] * 100);
      } catch (err) {}
    }
    createPie(".pieID.legend", ".pieID.pie");
  }

  let sendMouse = (pointer) => {
   
      socket.emit(
        "client-send-drawing",
        pointer.x,
        pointer.y,
        pointer.x+1,
        pointer.y+1,
        roomId
      );

  };
  p.setup = () => {
    centralProcess = new Central("canvas2", "status");

    centralProcess.mouseDrag = () => {
  
      console.log('cao coor',centralProcess.pointer);

      sendMouse(centralProcess.pointer);
    };

    centralProcess.mouseReleased = () => {
      try {
        const { probs, symbols } = centralProcess.predict();
        //console.log("cao", centralProcess.symbols);
        console.log("cao", symbols);
           console.log("cao word", word);
        const predictWord = symbols[0].replace(/\s/g, "");
        setTable(symbols, probs);
           
        if (predictWord === word.replace(/\s/g, "")) {
          centralProcess.erase();
          setTimeout(() => {
            p.background("white");
            console.log("long sketch level up");
            levelUp();
          }, 1000);
          //   speech.speak(`oh great! It is ${word.replace("_", " ")}`);
          //   handleLevelUp(true);
        } else {
          //speech.speak(`it's not ${predictWord.replace("_", " ")}`);
        }
      } catch (err) {
        console.log(err);
      }
    };
  };

    p.draw = () => {
      if(time===0){
        centralProcess.erase();
      };
    };
}
