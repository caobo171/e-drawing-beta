import AI from "./aiService";
import * as tf from "@tensorflow/tfjs";
import createPie from "./pie";
import Speech from "./speechService";
import Central from "./centralprocess";

export default function sketchPracticeBeta(p) {
  var word, timer, handleLevelUp;

  var centralProcess;
  var speech = new Speech();
  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    word = props.text;
    timer = props.timer;
    word = props.word;
    handleLevelUp = props.handleLevelUp;
    if (timer === 0) {
      centralProcess.erase();
      handleLevelUp(false);
      speech.speak("poor you ");
    }
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

  p.setup = () => {
    centralProcess = new Central("canvas1", "status");
    // setTimeout(()=>{
    //     console.log('cao success',centralProcess.symbols);
    // },3000)

    centralProcess.mouseReleased = () => {
      try {
        const { probs, symbols } = centralProcess.predict();

        window.word = symbols;

        //prediction = prediction.replace(/\s/g,'');///bỏ khoảng trắng regular expression
        const predictWord = symbols[0].replace(/\s/g, "");
        //    console.log("cao", symbols);
        //    console.log("cao word", word);
        if (predictWord == word) {
          centralProcess.erase();
          speech.speak(`oh great! It is ${word}`);
          handleLevelUp(true);
        } else {
          speech.speak(`it's not ${predictWord}`);
        }
        //set the table
        setTable(symbols, probs);
      } catch (err) {
        console.log(err);
      }
    };
  };
}
