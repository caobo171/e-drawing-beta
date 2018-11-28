import * as tf from "@tensorflow/tfjs";




var fabric = window.fabric;

export default class Central {
  constructor(idCanvas, idStatus = null,color="#ffffff") {
    this.classPath = __dirname + "model_2/class_names.txt";
    this.idStatus = idStatus;
    this.idCanvas = idCanvas;
    this.classNames = [];
    this.symbols = [];
    this.model = null;
    this.canvas = null;
    this.mousePressed = false;
    this.coords = [];
    this.imgData = null;
    this.pointer = {};
    console.log("cao", fabric);
    //try{
    this.canvas = window._canvas = new fabric.Canvas(this.idCanvas);
    this.canvas.backgroundColor = color;
    this.canvas.isDrawingMode = 0;
    this.canvas.freeDrawingBrush.color = "black";
    this.canvas.freeDrawingBrush.width = 10;
    this.canvas.renderAll();

    this.canvas.on("mouse:up", e => {
      this.mouseReleased();
      this.mousePressed = false;
    });
    this.canvas.on("mouse:down", e => {
      this.mousePressed = true;
    });
    this.canvas.on("mouse:move", e => {
      this.draw(e);
      if (this.mousePressed === true) {
        this.mouseDrag();
      }
    });
    // }catch(err){

    // }
    this.loadModel();
  }

  readFile = () => {
    return new Promise((resolve, reject) => {
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", this.classPath, false);
      //console.log('long', this.classPath);
      rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200 || rawFile.status === 0) {
            //console.log("long",rawFile.responseText)
            resolve(rawFile.responseText);
          }
        }
      };
      rawFile.send(null);
    });
  };

  successClassNames(data) {
    //console.log(data);
    const lst = data.split(/\n/);
    for (var i = 0; i < lst.length - 1; i++) {
      let symbol = lst[i];
      this.symbols[i] = symbol;
    }
  }

  drawCanvas(x,y,px,py){
    var circle = new fabric.Circle({
      radius: 8, fill: 'orange', left: x, top: y
    });
    var circle2 = new fabric.Circle({
      radius:8 , fill:'orange',left:(x+px)/2,top:(y+py)/2
    })
    //console.log('cao',x,y);
    this.canvas.add(circle,circle2);
  }

  mouseReleased() {}

  mouseDrag() {}

  // khi socket nhận x, y thì gọi hàm này
  draw(event) {
    var pointer = this.canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;

    if (posX >= 0 && posY >= 0 && this.mousePressed) {
      this.coords.push(pointer);
      this.pointer = pointer;
    }
  }

  async loadModel() {
    this.model = await tf.loadModel("model_2/model.json");
    //warm up
    try{
    this.model.predict(tf.zeros([1, 28, 28, 1]));
    }catch(err){
      console.log(err);
    }
    console.log("cao loaded model");
    this.allowDrawing();
    await this.readFile().then(data => this.successClassNames(data));
  }

  allowDrawing() {
    this.canvas.isDrawingMode = 1;

    if (this.idStatus) {
      try{
      document.getElementById(this.idStatus).innerHTML = "Loaded";
      } catch(err){
        console.log(err);
      }
    }
  }

  //load the class names
  // async loadDict() {
  //   await $.ajax({
  //     url: "model_2/class_names.txt",
  //     dataType: "text"
  //   }).done(this.success);
  // }

  //load the class names
  success(data) {
    let lst = data.split(/\n/);

    this.symbols = [];
    for (var i = 0; i < lst.length - 1; i++) {
      let symbol = lst[i];
      this.symbols[i] = symbol;
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
      //console.log('cao check',indices,probs,symbolsPredict)

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
    for (var i = 0; i < indices.length; i++) outp[i] = this.symbols[indices[i]];
    return outp;
  }

  erase() {
    this.canvas.clear();
    this.canvas.backgroundColor = "#ffffff";
    this.coords = [];
  }
}
