import React, { useState,useEffect } from "react";
import "./style.css";
import * as Tone from "tone";
import classNames from "classnames";
import Store from "../../stores";
import {
  Typography,
  Box,
  Button,
  Card,
  TextField,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core';

import { DEPLOY_NFT } from '../../constants';
const dispatcher = Store.dispatcher

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// Function which creates a 5x8 grid,
// with our chosen notes on the vertical axis


// Our chosen octave for our five notes. Try changing this for higher or lower notes
const CHOSEN_OCTAVE = "4";

function Generate(){
  const grid = [];
  for (let i = 0; i < 16; i++) {
    let column = [
      { note: "B4", isActive: Math.random() < 0.1 },
      { note: "A#4", isActive: Math.random() < 0.05 },
      { note: "A4", isActive: Math.random() < 0.1 },
      { note: "G#4", isActive: Math.random() < 0.05 },
      { note: "G4", isActive: Math.random() < 0.1 },
      { note: "F#4", isActive: Math.random() < 0.05 },
      { note: "F4", isActive: Math.random() < 0.1 },
      { note: "E4", isActive: Math.random() < 0.1 },
      { note: "D#4", isActive: Math.random() < 0.05 },
      { note: "D4", isActive: Math.random() < 0.1 },
      { note: "C#4", isActive: Math.random() < 0.05 },
      { note: "C4", isActive: Math.random() < 0.1 }
    ];
    grid.push(column);
  }

  return grid;
}


function SoundMatrix(props) {
  // A nested array of objects is not performant, but is easier to understand
  // performance is not an issue at this stage anyway

  //console.log(props.matrix);

  const [matrixhash,SetMatrixHash] = useState({...props.matrix});
  const [grid, setGrid] = useState([]);
  const [music,setMusic] = useState(null);


   useEffect(() => {
 
         getdata(props.matrix);

    }, [props.matrix]);



  const getdata = async (matrixhash)=>{


     // setGrid(props.matrix)
      ipfs.catJSON(matrixhash)
      //.then(result => console.log(result))
      .then(result => setGrid(result))
      .catch(error => console.log(error));


  }




const findsetactive = (music)=> {

  let matrix = music;

  let column = [
      { note: "B", isActive: false },
      { note: "A#", isActive: false},
      { note: "A", isActive: false },
      { note: "G#", isActive: false },
      { note: "G", isActive: false },
      { note: "F#", isActive: false },
      { note: "F", isActive: false },
      { note: "E", isActive: false },
      { note: "D#", isActive: false },
      { note: "D", isActive: false },
      { note: "C#", isActive: false },
      { note: "C", isActive: false}
    ];


  if(music.length>0){

     let notes = music.map((note)=> {
       return column.findIndex((obj => obj.note == note.replace('4', '')));
     })

     Object.keys(notes).forEach(key => {
      column[key].isActive = true
    });


   return column;

  } else {

    return column;

  }



 // grid.push(column);


}


function pushToArray(arr, obj) {
    const index = arr.findIndex((e) => e.id === obj.id);

    if (index === -1) {
        arr.push(obj);
    } else {
        arr[index] = obj;
    }
}

  // Boolean to handle if music is played or not
  const [isPlaying, setIsPlaying] = useState(false);

  // Used to visualize which column is making sound
  const [currentColumn, setCurrentColumn] = useState(null);

  const options = {
      oscillator: {
        type: 'triangle',
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    };

  const filteroptions = {
      frequency: 1500,
      rolloff: -24,
    };

  const noteOffset = (Tone.Time('1m') / 16) * 6;



  // Updates our Grid's state
  // Written to be intelligble, not performant
  function handleNoteClick(clickedColumn, clickedNote) {
    // Shallow copy of our grid with updated isActive
    let updatedGrid = grid.map((column, columnIndex) =>
      column.map((cell, cellIndex) => {
        let cellCopy = cell;

        // Flip isActive for the clicked note-cell in our grid
        if (columnIndex === clickedColumn && cellIndex === clickedNote) {
          cellCopy.isActive = !cell.isActive;
        }

        return cellCopy;
      })
    );

    //Updates the grid with the new note toggled
    setGrid(updatedGrid);
  }

  const PlayMusic = async () => {
    // Variable for storing our note in a appropriate format for our synth
    let music = [];
   // let musicjson = [];

    grid.map((column) => {
      let columnNotes = [];
      column.map(
        (shouldPlay) =>
          //If isActive, push the given note, with our chosen octave
          shouldPlay.isActive &&
          columnNotes.push(shouldPlay.note + CHOSEN_OCTAVE)
      );
      music.push(columnNotes);
     // music.push({notes:columnNotes});
    });

    console.log(grid)
    // Starts our Tone context
    await Tone.start();

   const filter = new Tone.Filter(filteroptions).toDestination();
  //Notice the new PolySynth in use here, to support multiple notes at once
  // const synth = new Tone.PolySynth(options).connect(filter);
   const synth = new Tone.PolySynth().toDestination();
    // Tone.Sequence()
    //@param callback
    //@param "events" to send with callback
    //@param subdivision  to engage callback
    const Sequencer = new Tone.Sequence(
      (time, column) => {
        // Highlight column with styling
        setCurrentColumn(column);

        //Sends the active note to our PolySynth
        console.log("should play"+music[column])
        synth.triggerAttackRelease(music[column], "6n", time);
      },
      [0, 1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16],
     "6n"
    );



    if (isPlaying) {
      // Turn of our player if music is currently playing
      setIsPlaying(false);
      setCurrentColumn(null);

      await Tone.Transport.stop();
      await Sequencer.stop();
      await Sequencer.clear();
      await Sequencer.dispose();

      return;
    }
    setIsPlaying(true);
    // Toggles playback of our musical masterpiece
    await Sequencer.start(0);
    await Tone.Transport.start();
  };

  const generatenft = async (e) => {

   e.preventDefault()

   let music = [];
   let matrixjson = [];
   let hash;

   let generate = await  grid.map((column,index) => {
      let columnNotes = [];
      column.map(
        (shouldPlay) =>
          //If isActive, push the given note, with our chosen octave
          shouldPlay.isActive &&
          columnNotes.push(shouldPlay.note + CHOSEN_OCTAVE)
      );
      music.push(columnNotes);
    //  matrixjson.push({col:index,notes:columnNotes})
    });

  

  }

  const getresult = (result)=>{

    console.log(result);


       
       dispatcher.dispatch({ type: DEPLOY_NFT, content: {hash:result} })
          

  }

  const NoteButton = ({ note, isActive, ...rest }) => {
      const classes = isActive ? "note note--active" : "note";


      return (
        <button className={classes} {...rest}>
        </button>
      );
    };


  return (
    <Card className="App" variant="outlined">
      <div className="note-wrapper">
      

        {grid && grid.map((column, columnIndex) => (
          <div
            className={classNames("note-column", {
              "note-column--active": currentColumn === columnIndex
            })}
            key={columnIndex + "column"}
          >
            {column.map(({ note, isActive }, noteIndex) => (
              <NoteButton
                note={note}
                isActive={isActive}
                onClick={() => handleNoteClick(columnIndex, noteIndex)}
                key={note + columnIndex}
              />
            ))}
          </div>
        ))}
      </div>
  
      <button className="play-button" onClick={() => PlayMusic()}>
        {isPlaying ? "Stop" : "Play"}
      </button>

    </Card>
  );
}




export default SoundMatrix;

// const NoteButton = ({ note, isActive, ...rest }) => {
// //  const classes = isActive ? "note note--active" : "note";
//   let sqrClass = 'btn btn-secondary'
//   let sqrStyle = {
//     width: '25px',
//     height: '25px',
//     margin: '2px'
//   }


//   // Adjust the color as needed
//   if (isActive) {
//     sqrClass = 'btn btn-info'
//   } else  { //if (props.current)
//     sqrClass = 'btn btn-warning'
//   }



//   return (
//     <button className={sqrClass} {...rest}>
//       {note}
//     </button>
//   );
// };
