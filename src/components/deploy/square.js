import React, { Component } from "react";
import * as Tone from 'tone';

class  SoundSquare extends Component {
  // Set class/sizing
  render() {
  

  let sqrClass = 'btn btn-secondary'
  let sqrStyle = {
    width: '25px',
    height: '25px',
    margin: '2px'
  }



  // Adjust the color as needed
  if (this.props.active) {
    sqrClass = 'btn btn-info'
  } else if (this.props.current) {
    sqrClass = 'btn btn-warning'
  }

 
  // Check if a sound should play
  if (this.props.active && this.props.current){

    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();

    const note = this.props.note;
     console.log(note)

    synth.triggerAttack(note, now)
    synth.triggerRelease(now + 1)


  }
  
  // Return the stylized div
    return (
      <div 
        className={sqrClass} 
        style={sqrStyle}
        id={this.props.key}
        beat={this.props.beat}
        key={this.props.key}
        onClick={e=> this.props.handleClick}
      />
    )
  }
}

export default (SoundSquare);