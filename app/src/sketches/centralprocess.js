import AI from "./aiService";
import * as tf from "@tensorflow/tfjs";
import createPie from "./pie";
import Speech from "./speechService";

var word, timer, handleLevelUp;
var $ = window.$;
var fabric = window.fabric;
var imgData;
var speech = new Speech();
// var model;
// var canvas;
var symbols = [];
//var canvas;
// var coords = [];
//var mousePressed = false;

export default class Central {
  constructor(idCanvas, idStatus = null) {
    this.idStatus = idStatus;
    this.idCanvas = idCanvas;
    // this.symbols = [];
    this.model = null;
    this.canvas = null;
    this.mousePressed = false;
    this.coords = [];
    this.imgData = null;
    this.pointer = {};

    // this.draw = this.draw.bind(this);
    // this.mouseReleased = this.mouseReleased.bind(this);
    // this.mouseDrag = this.mouseDrag.bind(this);
    this.canvas = window._canvas = new fabric.Canvas(this.idCanvas);
    this.canvas.backgroundColor = "#ffffff";
    this.canvas.isDrawingMode = 0;
    this.canvas.freeDrawingBrush.color = "black";
    this.canvas.freeDrawingBrush.width = 10;
    this.canvas.renderAll();
    this.canvas.on("mouse:up", (e)=> {
        this.mouseReleased();
        this.mousePressed = false;
          //   try {
          //     getFrame();
          //   } catch (err) {
          //     console.log(err);
          //   }
    });  
    this.canvas.on("mouse:down", (e)=> {
        this.mousePressed = true;
    });
    this.canvas.on("mouse:move", (e)=> {
        this.draw(e);
        this.mouseDrag();
    })

    //prepare the drawing canvas
    // $(function() {
    //   try {
        
     
       
    //   } catch (err) {
    //     console.log("cao", err);
    //   }
    // });
    this.loadModel();
  }

  mouseReleased() {}

  mouseDrag() {}

  // khi socket nhận x, y thì gọi hàm này
  draw(event) {
    var pointer = this.canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;

    this.pointer = pointer;
    if (posX >= 0 && posY >= 0 && this.mousePressed) {
      this.coords.push(pointer);
    }
  }

  async loadModel() {
    this.model = await tf.loadModel("model_2/model.json");
    //warm up
    this.model.predict(tf.zeros([1, 28, 28, 1]));
    this.allowDrawing();
    await this.loadDict();
  }

  allowDrawing() {
    this.canvas.isDrawingMode = 1;
    if (this.idStatus) {
      document.getElementById(this.idStatus).innerHTML = "Loaded";
    }
  }

  //load the class names
  async loadDict() {
    await $.ajax({
      url: "model_2/class_names.txt",
      dataType: "text"
    }).done(this.success);
  }

  //load the class names
  success(data) {
    let lst = data.split(/\n/);
   
    symbols = [];
    for (var i = 0; i < lst.length - 1; i++) {
      let symbol = lst[i];
      symbols[i] = symbol;
    }
  }

  /*
   *   PREDICT
   * */
  predict() {

    if (this.coords.length >= 2) {
      //get the minimum bounding box
      const mbb = this.getMinBox();
      const dpi = window.devicePixelRatio;
      this.imgData = this.canvas.contextContainer.getImageData(
        mbb.min.x * dpi,
        mbb.min.y * dpi,
        (mbb.max.x - mbb.min.x) * dpi,
        (mbb.max.y - mbb.min.y) * dpi
      );
      //get the predictions, top 5
      const pred = this.model.predict(this.preprocess(this.imgData)).dataSync();
      const indices = this.findIndicesOfMax(pred, 5);
      const probs = this.findTopValues(pred, 5);
      const symbolsPredict = this.getSymbols(indices);
      
  
      return { probs, symbols: symbolsPredict };
    }
  }

  preprocess(imgData) {
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

  getMinBox() {
    let minX = 0;
    let minY = 0;
    let maxX = 300;
    let maxY = 300;

    var coorX = this.coords.map(function(p) {
      return p.x;
    });
    var coorY = this.coords.map(function(p) {
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

  findIndicesOfMax(inp, count) {
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
  findTopValues(inp, count) {
    var outp = [];
    let indices = this.findIndicesOfMax(inp, count);
    // show 5 greatest scores
    for (var i = 0; i < indices.length; i++) {
      outp[i] = inp[indices[i]];
    }
    return outp;
  }
  //get the latex symbols by indices
  getSymbols(indices) {
    let outp = [];
    for (var i = 0; i < indices.length; i++) outp[i] = symbols[indices[i]];
    return outp;
  }

  erase() {
    this.canvas.clear();
    this.canvas.backgroundColor = "#ffffff";
    this.coords = [];
  }
}
