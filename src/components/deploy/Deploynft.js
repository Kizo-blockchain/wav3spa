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
import Wave from "@foobar404/wave"
import SVG from './SVG2.js'
import wav3 from '../../assets/wave3.svg'

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


function SoundMatrix() {
  // A nested array of objects is not performant, but is easier to understand
  // performance is not an issue at this stage anyway

  const [bpm,setbpm] = useState();
  const [instruments,SetInstruments] = useState([]);


   // Boolean to handle if music is played or not
  const [isPlaying, setIsPlaying] = useState(false);
  const [midi,Setmidi] = useState(false);
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
         

         generateNewMidi();

    }, []);



 
  
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


      const reloadpage = () =>{

            window.location.reload();

          //  generateNewMidi()
      }

  //const noteOffset = (Tone.Time('1m') / 16) * 6;
const generateNewMidi = async () => {

     
  
      
      const response = await fetch("https://v4v3.herokuapp.com/midi.json");
      const midiJson = await response.json();

      console.log(midiJson);
      
     Setmidi(midiJson)
     setPaterns(midiJson.patterns)


     generatenft(midiJson);

       console.log('paterns')

     console.log('ch :'+chArray[midiJson.patterns.ch])
     console.log('oh :'+ohArray[midiJson.patterns.oh])
     console.log('kick :'+kickArray[midiJson.patterns.kick])
     console.log('mar :'+marArray[midiJson.patterns.mar])
     console.log('snare :'+snareArray[midiJson.patterns.snare])




}


  const generatenft = async (midiJ) => {

 //  e.preventDefault()

   let music = [];
   let matrixjson = [];
   let hash;


   ipfs.addJSON(midiJ)
   .then(result => minttoken(result))
   .catch(error => console.log(error));


  }

  const minttoken = (result)=>{

    console.log(result);
       
       dispatcher.dispatch({ type: DEPLOY_NFT, content: {hash:result} })
          
  }



const nftcreated = (midi) =>  {

      
      console.log(midi.instruments_sources);

      SetChainstru(midi.instruments_sources.ch)

      SetKickInstru(midi.instruments_sources.kick)

      SetRandKick(midi.instruments.kick)
      
      SetmarInstru(midi.instruments_sources.mar);

      SetRandMar(midi.instruments.mar);
     
      SetsnareInstru(midi.instruments_sources.snare);
      //cymbales 
      
      SetcymInstru(midi.instruments_sources.cym);

      SetRandCym(midi.instruments.cym) 


      SetclapInstru(midi.instruments_sources.clap);
      console.log("clap"+midi.instruments_sources.clap)

      SetRandClap(midi.instruments.clap);
       console.log("rand clap"+midi.instruments.clap)

      SetRandCob(midi.instruments.cob);

      SetRandSnare(midi.instruments.snare);

      SetRandoh(midi.instruments.oh);

      SetRandch(midi.instruments.ch);




}

var chArray = [
    '--x---x---x---x-',
    'xxxxxxxxxxxxxxxx',
    '-x-xxxx-xx-xx-xx',
    '--x---x---x-xxxx',
    '--x-------x-----'
];

var ohArray = [
    '---x------x---',
    'x-----x-x---x---',
    'x-------x-------',
    'x---------------'
];




var clavArray = [
    '---x--xx---x--xx',
    '--------------xx',
    '--------x-------'
];


var marArray = [
    '--x---x---x---x-',
    '-x-x-x-x-x-x-x-x',
    '-x-x-x--xx--x-xx',
    '--x---x---x-xxxx',
    '--x-------x-----'
];


var clapArray = [
    '-----------x----',
    '--------------x-',
    '----x---x------x'
];



var snareArray = [
    '----x------x----',
    '------x-------x-',
    '---xx---x-----xx',
    '-----------x----',
    '--------------x-'
];


var kickArray = [
    'x---x---x---x--',
    'x---x---x---x--x',
    'x--x--x-------x-',
    'x--x---x--xx----',
    '---x--x-x---xxxx'
];



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
           
           //window.location.reload();
          
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




  const playstop =()=> {

     playmusicTest();

  }

    const stop =()=> {

      Tone.Transport.stop();
      Tone.Transport.dispose();

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

    <Card className="App" variant="outlined" style={{backgroundColor:'#000000',width:'40%'}}>
      <div className="note-wrapper" style={{backgroundColor:'#000000'}}>
         
     <div className="note-wrapper" style={{backGroundColor:'#000000'}}>
       <img style={{width:'300px',height:'300px'}} src={wav3}/>
      </div>


      </div>
      <div >
      <p style={{color:'#FFFFFF'}}> You transaction is being broadcasted to the Ethereum network, and can take a while before it’s approved and your awesome WAVE NFT is being generated and minted. Please wait...</p>

      </div>
      
      <div>

    
    
      </div>
     
  
   
    </Card>
  );
}


   // <button className="play-button" onClick={e => generatenft(e)}>
   //     Generate Sound Matrix NFT
   //      </button>

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