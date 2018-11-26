import AI from "./aiService";
import * as tf from "@tensorflow/tfjs";
import createPie from "./pie";
import Speech from './speechService';

export default function sketchTest(p) {
  var word, timer, handleLevelUp;
  var $ = window.$;
  var fabric = window.fabric;
  var imgData;
  var speech = new Speech();
  var model;
  var canvas;
  var symbols = [{}];
  var canvas;
  var coords = [];
  var mousePressed = false;
  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    word = props.text;
    timer = props.timer;
    word = props.word
    handleLevelUp = props.handleLevelUp;
    if (timer === 0) {
      erase();
      handleLevelUp(false);
      speech.speak('poor you ')
    }
  };

  

  //set the table with predictions
  function setTable(top5, probs) {
    for (var i = 0; i < top5.length; i++) {
      let sym = document.getElementById("sym" + (i + 1));
      let prob = document.getElementById("prob" + (i + 1));
      sym.innerHTML = top5[i];
      prob.innerHTML = Math.round(probs[i] * 100);
    }
    createPie(".pieID.legend", ".pieID.pie");
  }

  //prepare the drawing canvas
  $(function() {
    try {
      canvas = window._canvas = new fabric.Canvas("canvas1");
      canvas.backgroundColor = "#ffffff";
      canvas.isDrawingMode = 0;
      canvas.freeDrawingBrush.color = "black";
      canvas.freeDrawingBrush.width = 10;
      canvas.renderAll();
      canvas.on("mouse:up", function(e) {
        try {
          getFrame();
        } catch (err) {
          console.log(err);
        }

        mousePressed = false;
      });
      canvas.on("mouse:down", function(e) {
        mousePressed = true;
      });
      canvas.on("mouse:move", function(e) {
        recordCoor(e);
      });
    } catch (err) {
      console.log("cao", err);
    }
  });

  //record the current drawing coordinates
  function recordCoor(event) {
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;

    if (posX >= 0 && posY >= 0 && mousePressed) {
      coords.push(pointer);
    }
  }

  //get the best bounding box by trimming around the trimming
  function getMinBox() {
    let minX = 0;
    let minY = 0;
    let maxX = 300;
    let maxY = 300;

    var coorX = coords.map(function(p) {
      return p.x;
    });
    var coorY = coords.map(function(p) {
      return p.y;
    });

    var min_coords = {
      x: Math.min.apply(null, coorX),
      y: Math.min.apply(null, coorY)
    };
    var max_coords = {
      x: Math.max.apply(null, coorX),
      y: Math.max.apply(null, coorY)
    };
    return {
      min: min_coords,
      max: max_coords
    };
  }

  //get the current frame of the canvas
  function getFrame() {
    //make sure we have at least two recorded coordinates
    if (coords.length >= 2) {
      //get the minimum bounding box
      const mbb = getMinBox();
      const dpi = window.devicePixelRatio;
      imgData = canvas.contextContainer.getImageData(
        mbb.min.x * dpi,
        mbb.min.y * dpi,
        (mbb.max.x - mbb.min.x) * dpi,
        (mbb.max.y - mbb.min.y) * dpi
      );
      //get the predictions, top 5
      const pred = model.predict(preprocess(imgData)).dataSync();
      const indices = findIndicesOfMax(pred, 5);
      const probs = findTopValues(pred, 5);
      const symbols = getSymbols(indices);
      
      window.word = symbols;
      //prediction = prediction.replace(/\s/g,'');///bỏ khoảng trắng regular expression
      const predictWord = symbols[0].replace(/\s/g, "");
      console.log("cao", symbols);
      console.log("cao word", word);
      if (predictWord == word) {
        erase();
        speech.speak(`oh great! It is ${word}`)
        handleLevelUp(true);
      }else{
        speech.speak(`it's not ${predictWord}`)
      }
      //set the table
      setTable(symbols, probs);
    }
  }
  //get the latex symbols by indices
  function getSymbols(indices) {
    var outp = [];
    for (var i = 0; i < indices.length; i++) outp[i] = symbols[indices[i]];
    return outp;
  }

  //load the class names
  async function loadDict() {
    await $.ajax({
      url: "model_2/class_names.txt",
      dataType: "text"
    }).done(success);
  }

  //load the class names
  function success(data) {
    let lst = data.split(/\n/);
    symbols = [];
    for (var i = 0; i < lst.length - 1; i++) {
      let symbol = lst[i];
      symbols[i] = symbol;
    }
  }

  //get indices of the top probs
  function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
      outp.push(i); // add index to output array
      if (outp.length > count) {
        outp.sort(function(a, b) {
          return inp[b] - inp[a];
        }); // descending sort the output array
        outp.pop(); // remove the last index (index of smallest element in output array)
      }
    }
    return outp;
  }

  //find the top 5 predictions
  function findTopValues(inp, count) {
    var outp = [];
    let indices = findIndicesOfMax(inp, count);
    // show 5 greatest scores
    for (var i = 0; i < indices.length; i++) outp[i] = inp[indices[i]];
    return outp;
  }

  //preprocess the data
  function preprocess(imgData) {
    return tf.tidy(() => {
      const tensor = tf.fromPixels(imgData).toFloat();
      const offset = tf.scalar(255.0);
      // Normalize the image
      const normalized = tf.scalar(1.0).sub(tensor.div(offset));
      const resized = tf.image.resizeBilinear(normalized, [28, 28]);
      const sliced = resized.slice([0, 0, 1], [28, 28, 1]);
      const batched = sliced.expandDims(0);
      return batched;
    });
  }

  //load the model
  async function loadModel() {
    model = await tf.loadModel("model_2/model.json");
    //warm up
    model.predict(tf.zeros([1, 28, 28, 1]));
    allowDrawing();
    await loadDict();
  }

  //allow drawing on canvas
  function allowDrawing() {
    canvas.isDrawingMode = 1;
    document.getElementById("status").innerHTML = "Loaded";
  }
  function erase() {
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    coords = [];
  }

  try{loadModel();}catch(err){
    console.log('cao',err);
  }
}
