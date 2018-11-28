

export default class Speech {
    constructor(){

        this.synth = window.speechSynthesis;
    //    // var utterThis = new SpeechSynthesisUtterance(`I'm speaking`);
    //     //synth.speak(utterThis);
    //     setInterval(()=>{
    //         synth.speak(utterThis);
    //     },3000);
    }

    speak(statement,important=false){
        if(this.synth.speaking && !important)return
        let utterThis = new SpeechSynthesisUtterance(statement);
        this.synth.speak(utterThis);
    }
}