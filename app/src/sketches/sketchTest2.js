
import Central from './centralprocess';

export default function sketchTest2(p) {
  var x;
  var px;
  var y;
  var py;
  var centralProcess ;
  var time = 15;
  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    time = props.time
   
  };
  p.setup = () => {

    centralProcess = new Central('canvas3',null,"#ddd");
    window.socket.on(
      "server-send-drawing",
      (mousex, mousey, pmousex, pmousey) => {
        if (true) {
          try {
            px = x;
            py = y;
            x = mousex;
            y = mousey;
            p.stroke(0);
            //console.log('cao',x,y);
            centralProcess.drawCanvas(x,y,px,py);
            
          } catch (e) {}
        }
      }
    );

    window.socket.on("server-level-up", () => {
      centralProcess.erase();
    });
  };



  p.draw = () => {
    if(time===0){
      centralProcess.erase();
    };
  };
}
