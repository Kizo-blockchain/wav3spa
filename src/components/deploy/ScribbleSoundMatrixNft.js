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

import SVG from './SVG.js'

import { DEPLOY_NFT } from '../../constants';
import Wave from "@foobar404/wave"

const dispatcher = Store.dispatcher

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const MidiConvert = require("midiconvert");

const scribble = require('scribbletune');
var MidiPlayer = require('midi-player-js');

//var chwave = "../../assets/Hits/[CH]/E808_CH-01.wav";
// Function which creates a 5x8 grid,
// with our chosen notes on the vertical axis


// Our chosen octave for our five notes. Try changing this for higher or lower notes
const CHOSEN_OCTAVE = "4";

function Generate(){
  const grid = [];
  for (let i = 0; i < 16; i++) {
    let column = [
    { note: "B", isActive: Math.random() < 0.1 },
      { note: "A#", isActive: Math.random() < 0.05 },
      { note: "A", isActive: Math.random() < 0.1 },
      { note: "G#", isActive: Math.random() < 0.05 },
      { note: "G", isActive: Math.random() < 0.1 },
      { note: "F#", isActive: Math.random() < 0.05 },
      { note: "F", isActive: Math.random() < 0.1 },
      { note: "E", isActive: Math.random() < 0.1 },
      { note: "D#", isActive: Math.random() < 0.05 },
      { note: "D", isActive: Math.random() < 0.1 },
      { note: "C#", isActive: Math.random() < 0.05 },
      { note: "C", isActive: Math.random() < 0.1 }
    ];
    grid.push(column);
  }

  return grid;
}


function SoundMatrix(props) {
  // A nested array of objects is not performant, but is easier to understand
  // performance is not an issue at this stage anyway

  const [grid, setGrid] = useState(Generate);
  const [patterns,setPaterns] = useState(false);
  const [randch,SetRandch]= useState(false);
  const [randoh,SetRandoh]= useState(false);
  const [randclav,SetRanClav] = useState(false);
  const [randmar,SetRandMar] = useState(false);
  const [randsym,SetRandCym] = useState(false);
  const [randclap,SetRandClap] = useState(false);
  const [randcob, SetRandCob] = useState(false);
  const [randsnare, SetRandSnare] = useState(false);
  const [randomKick,SetRandKick]= useState(false);

  //bloolean to handle if instrument is played 


  const [chainstru,SetChainstru] = useState(false);
  const [kickinstru,SetKickInstru] = useState(false);
  const [marinstru,SetmarInstru] = useState(false);
  const [snareinstru,SetsnareInstru] = useState(false);
  const [cyminstru,SetcymInstru] = useState(false);
  const [clapinstru,SetclapInstru] = useState(false);

 // let [wave] = useState(new Wave());


   useEffect(() => {
 
         generateNewMidi(props.matrix);

    }, [props.matrix]);



  const  GenerateGrid =  () => {
  const grid = [];
  for (let i = 0; i < 16; i++) {
  let column = [
      { note: "B", isActive: Math.random() < 0.1 },
      { note: "A#", isActive: Math.random() < 0.05 },
      { note: "A", isActive: Math.random() < 0.1 },
      { note: "G#", isActive: Math.random() < 0.05 },
      { note: "G", isActive: Math.random() < 0.1 },
      { note: "F#", isActive: Math.random() < 0.05 },
      { note: "F", isActive: Math.random() < 0.1 },
      { note: "E", isActive: Math.random() < 0.1 },
      { note: "D#", isActive: Math.random() < 0.05 },
      { note: "D", isActive: Math.random() < 0.1 },
      { note: "C#", isActive: Math.random() < 0.05 },
      { note: "C", isActive: Math.random() < 0.1 }
    ];
    grid.push(column);
  }
  setGrid(grid);

  console.log(grid)

  return grid;
}

  // let column = [
  //     { note: "B", isbass:false,isnare:false,isoh:false },
  //     { note: "A#", isbass:false,isnare:false,isoh:false },
  //     { note: "A", isbass:false,isnare:false,isoh:false },
  //     { note: "G#", isbass:false,isnare:false,isoh:false },
  //     { note: "G", isbass:false,isnare:false,isoh:false },
  //     { note: "F#", isbass:false,isnare:false,isoh:false },
  //     { note: "F", isbass:false,isnare:false,isoh:false },
  //     { note: "E", isbass:false,isnare:false,isoh:false },
  //     { note: "D#", isbass:false,isnare:false,isoh:false },
  //     { note: "D", isbass:false,isnare:false,isoh:false },
  //     { note: "C#", isbass:false,isnare:false,isoh:false },
  //     { note: "C", isbass:false,isnare:false,isoh:false }
  //   ];



  // Boolean to handle if music is played or not
  const [isPlaying, setIsPlaying] = useState(false);
  const [midi,Setmidi] = useState(null);

  //let [wave] = useState(new Wave());

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


        var charray = [
          "https://v4v3.herokuapp.com/ch/CH1.wav",
          "https://v4v3.herokuapp.com/ch/CH2.wav",
          "https://v4v3.herokuapp.com/ch/CH3.wav",

      ];



       var kickarray = [
          "https://v4v3.herokuapp.com/kick1.wav",
          "https://v4v3.herokuapp.com/kick2.wav",
          "https://v4v3.herokuapp.com/kick3.wav",
          "https://v4v3.herokuapp.com/kickq.wav",
          "https://v4v3.herokuapp.com/kick5.wav",

      ];


        var mararray = [
          "https://v4v3.herokuapp.com/MAR1.wav",
          "https://v4v3.herokuapp.com/MAR2.wav"

      ];



      var snarearray = [
          "https://v4v3.herokuapp.com/Snare1.wav",
          "https://v4v3.herokuapp.com/Snare2.wav",
          "https://v4v3.herokuapp.com/Snare3.wav",
          "https://v4v3.herokuapp.com/Snare4.wav"
      ];

        var cymearray = [
          "https://v4v3.herokuapp.com/CYM1.wav",
          "https://v4v3.herokuapp.com/CYM2.wav"
      ];


        var clapearray = [
          "https://v4v3.herokuapp.com/clap1.wav",
          "https://v4v3.herokuapp.com/clap2.wav",
          "https://v4v3.herokuapp.com/clap3.wav",
      ];


  //const noteOffset = (Tone.Time('1m') / 16) * 6;
const generateNewMidi = async (matrixhash) => {

     // console.log("matrixhash")
     // console.log(matrixhash)
      // setGrid(props.matrix)
      ipfs.catJSON(matrixhash)
      //.then(result => console.log(result))
      .then(result => Setmidi(result))
      .then(result => nftcreated())
      .catch(error => console.log(error));

      
     

}


const nftcreated = () =>  {

      
      var randomCh = Math.floor(Math.random()*charray.length);

    //  SetChainstru(midi.)

      var randomKick = Math.floor(Math.random()*kickarray.length);

      SetKickInstru(randomKick)

      SetRandKick(Math.random() < 0.9)

      
      var randomMar = Math.floor(Math.random()*mararray.length);

      SetmarInstru(randomMar);

      SetRandMar(Math.random() < 0.25);

     
      var randomCh = Math.floor(Math.random()*charray.length);

      SetChainstru(randomCh);

      var randomSn = Math.floor(Math.random()*snarearray.length);

      SetsnareInstru(randomSn);
      //cymbales 
  
      var randomCym = Math.floor(Math.random()*cymearray.length);

      SetcymInstru(randomCym);

      SetRandCym(Math.random() < 0.1) 


      var randomClap = Math.floor(Math.random()*clapearray.length);

      SetclapInstru(randomClap);

      SetRandClap(Math.random() < 0.3);

      SetRandCob(Math.random() < 0.05);

      SetRandSnare(Math.random() < 0.8);

      SetRandoh(Math.random() < 0.4);

      SetRandch(Math.random() < 0.6);




}




  const playmusicTest =  async ()=>{



    console.log(patterns);


      //   var bpmarray = [
      //     85,115
      // ];
      // var randomBpm = Math.floor(Math.random()*bpmarray.length);
        //Tone.Transport.dispose();


       const midi_ch = MidiConvert.fromJSON(midi.ch);

       const midi_kick = MidiConvert.fromJSON(midi.kick);

       const midi_mar = MidiConvert.fromJSON(midi.mar);

       const midi_oh = MidiConvert.fromJSON(midi.oh);

       const midi_snare = MidiConvert.fromJSON(midi.snare);

       const midi_clav = MidiConvert.fromJSON(midi.clav);

       const midi_cym = MidiConvert.fromJSON(midi.cyb);

       const midi_cob = MidiConvert.fromJSON(midi.cob);


      var audios = new Tone.Buffers({
          "ch" :charray[chainstru],
          "kick":kickarray[kickinstru],
          "mar":mararray[marinstru],
          "snare":snarearray[snareinstru],
          "oh":charray[chainstru],
          "clap":clapearray[clapinstru],
          "clav":'https://v4v3.herokuapp.com/clav.wav',
          "cym":cymearray[cyminstru],
          "cob":'https://v4v3.herokuapp.com/CB2.wav'
           //cym
           //cob
        }, async function(){



       const samplerClap = new Tone.Sampler({
          urls: {
            "C4": audios.get("clap")
          },

         // release: 1,
         // baseUrl: "https://v4v3.herokuapp.com/ch/",
         //  baseUrl: "https://scribbletune.com/sounds/",
        }).toDestination();



        const samplerCob = new Tone.Sampler({
          urls: {
            "C4": audios.get("cob")
          },

         // release: 1,
         // baseUrl: "https://v4v3.herokuapp.com/ch/",
         //  baseUrl: "https://scribbletune.com/sounds/",
        }).toDestination();

      const samplerCym = new Tone.Sampler({
          urls: {
            "C4": audios.get("cym")
          },

         // release: 1,
         // baseUrl: "https://v4v3.herokuapp.com/ch/",
         //  baseUrl: "https://scribbletune.com/sounds/",
        }).toDestination();


       const samplerClav = new Tone.Sampler({
          urls: {
            "C4": audios.get("clav")
          },

         // release: 1,
         // baseUrl: "https://v4v3.herokuapp.com/ch/",
         //  baseUrl: "https://scribbletune.com/sounds/",
        }).toDestination();


      const samplerMar = new Tone.Sampler({
          urls: {
            "C4": audios.get("mar")
          },

         // release: 1,
         // baseUrl: "https://v4v3.herokuapp.com/ch/",
         //  baseUrl: "https://scribbletune.com/sounds/",
        }).toDestination();


      const samplersnare = new Tone.Sampler({
          urls: {
            "c4": audios.get("snare")
          },
         // release: 1,

        }).toDestination();



          const sampleroh = new Tone.Sampler({
          urls: {
            "c4": audios.get("oh")
          },
         // release: 1,

        }).toDestination();





          const samplerch = new Tone.Sampler({
          urls: {
            "c4": audios.get("ch")
          },
         // release: 1,

        }).toDestination();


          const samplerkick = new Tone.Sampler({
          urls: {
            "c4": audios.get("kick")
          },
         // release: 1,

        }).toDestination();

       console.log(midi.mar.tracks[0].notes);

         await Tone.start();

       const CymPart = new Tone.Part((time, event) => {

         console.log("cym"+event)

          samplerCym.triggerAttackRelease(
            event.name,
            event.duration,
            time,
            event.velocity
          );

        }, midi.cyb.tracks[0].notes)

   

    const ClapPart = new Tone.Part((time, event) => {

         console.log(event)

          samplerClap.triggerAttackRelease(
            event.name,
            event.duration,
            time,
            event.velocity
          );
          
        }, midi.clap.tracks[0].notes)

    
        const CobPart = new Tone.Part((time, event) => {

         console.log(event)

          samplerCob.triggerAttackRelease(
            event.name,
            event.duration,
            time,
            event.velocity
          );
          
        }, midi.cob.tracks[0].notes)



    const MarPart = new Tone.Part((time, event) => {

         console.log(event)

          samplerMar.triggerAttackRelease(
            event.name,
            event.duration,
            time,
            event.velocity
          );
          
        }, midi.mar.tracks[0].notes)

   
  
     const SnarePart = new Tone.Part((time, event) => {

         console.log(event)
          samplersnare.triggerAttackRelease(
            event.name,
            event.duration,
            time,
            event.velocity
          );
          
        }, midi.snare.tracks[0].notes)

  

      const OhPart = new Tone.Part((time, event) => {

         console.log(event)
          sampleroh.triggerAttackRelease(
            event.name,
            event.duration,
            time,
            event.velocity
          );
          
        }, midi.oh.tracks[0].notes)

  

      const ChPart = new Tone.Part((time, event) => {

         console.log(event)
          samplerch.triggerAttackRelease(
            event.name,
            event.duration,
            time,
            event.velocity
          );
          
        }, midi.ch.tracks[0].notes)

     

       const KickPart = new Tone.Part((time, event) => {

         console.log(event)
          samplerkick.triggerAttackRelease(
            event.name,
            event.duration,
            time,
            event.velocity
          );
          
        }, midi.kick.tracks[0].notes)

       

        

          if (isPlaying) {
            // Turn of our player if music is currently playing
            setIsPlaying(false);
            console.log("stoped")

          
           await Tone.Transport.stop();

           await KickPart.stop();
           await  KickPart.clear();
           await  KickPart.dispose();

       
            await  ChPart.stop();
            await  ChPart.clear();
            await  ChPart.dispose();

            await  OhPart.stop();
            await  OhPart.clear();
            await  OhPart.dispose();

            await  SnarePart.stop();
            await  SnarePart.clear();
            await  SnarePart.dispose();

            await  MarPart.stop();
            await  MarPart.clear();
            await  MarPart.dispose();

           await  ClapPart.stop();
           await  ClapPart.clear();
           await  ClapPart.dispose();

          await  CymPart.stop();
          await  CymPart.clear();
          await  CymPart.dispose();

          console.log("cleared")
            window.location.reload();
            return;
          }

          setIsPlaying(true);

          if(randsnare){
            //  console.log(midi.snare.tracks[0].notes)
             SnarePart.start(0);

           }

         if(randsym){

            await CymPart.start(0);  

             }

         if(randclap){

           await ClapPart.start(0);

          }


       if(randcob){

        await  CobPart.start(0);

         }

          if(randmar){
        await  MarPart.start(0);

       }

       if(randomKick){

       await  KickPart.start(0)//

       }

         if(randch){

       await   ChPart.start(0);

      }

          if(randoh){

       await  OhPart.start(0);

      }

        Tone.Transport.bpm.value = 375;
          // Toggles playback of our musical masterpiece
 
       await Tone.Transport.start();

     //  await Tone.Transport.stop();
       
  



 
     });
  
    

     // Tone.Transport.bpm.value = bpmarray[randomBpm];
   
   
  }



  const generatenft = async (e) => {

   e.preventDefault()

   let music = [];
   let matrixjson = [];
   let hash;


   ipfs.addJSON(midi)
   .then(result => getresult(result))
   .catch(error => console.log(error));


  }

  const getresult = (result)=>{

    console.log(result);


       
       dispatcher.dispatch({ type: DEPLOY_NFT, content: {hash:result} })
          

  }

  const NoteButton = ({ note,isActive, isbass,isnare,isoh, ...rest }) => {
      const classes = isActive ? "note note--active" : "note";

      // if(isActive){
      //       if(isbass){

      //   console.log("is bass")

      // }else if (isnare){
      //    console.log("is snare")

      // }else if(isoh){
      //   console.log("is oh")

      // }else{

      //   console.log("inactive")

      // }
      // } else{

      //    console.log("inactive")

      // }
    

      return (
        <button className={classes} {...rest}>
        </button>
      );
    };



  return (
    <Card className="App" variant="outlined" style={{backgroundColor:'#1c1f25'}}>
      <div className="note-wrapper" style={{backGroundColor:'#1c1f25'}}>
       {midi && <SVG instrument={midi.instruments} sources={midi.instruments_sources}  />}
      </div>
      <div style={{ display: 'flex',justifyContent: 'space-between',left:0}}>
      <button className="play-button" onClick={() => playmusicTest()}>
        {isPlaying ? "Stop" : "Play"}
      </button>
     </div>
    </Card>
  );
}



        //  {grid && grid.map((column, columnIndex) => (
        //   <div
        //     className={classNames("note-column", {
        //       "note-column--active": currentColumn === columnIndex
        //     })}
        //     key={columnIndex + "column"}
        //   >
        //     {column.map(({ note, isActive }, noteIndex) => (
        //       <NoteButton
        //         note={note}
        //         isActive={isActive}
        //         onClick={() => handleNoteClick(columnIndex, noteIndex)}
        //         key={note + columnIndex}
        //       />
        //     ))}
        //   </div>
        // ))}


export default SoundMatrix;
