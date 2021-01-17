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


import { DEPLOY_NFT,BURN_NFT } from '../../constants';
import Wave from "@foobar404/wave"
import SVG from './SVG3.js'

import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';

import { Route, Switch, Redirect, Link } from "react-router-dom";

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

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


function SoundMatrix(props) {
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


  const [chainstru,SetChainstru] = useState(0);
  const [kickinstru,SetKickInstru] = useState(0);
  const [marinstru,SetmarInstru] = useState(0);
  const [snareinstru,SetsnareInstru] = useState(0);
  const [cyminstru,SetcymInstru] = useState(0);
  const [clapinstru,SetclapInstru] = useState(0);

 // let [wave] = useState(new Wave());

  const [currentsupply,SetCurrentSupply] = React.useState(null);
  const [mint_price,SetMintPrice]  = React.useState(null);
  const [pricetoburn,Setpricetoburn] = React.useState(null);
  const [reserve_cut,Setreserve_cut] = React.useState(null);


   useEffect(() => {
         

         generateNewMidi(props.matrix);

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
const generateNewMidi = async (matrixhash) => {

     
   // console.log("hash"+matrixhash)
      
      // const response = await fetch("https://v4v3.herokuapp.com/midi.json");
      // const midiJson = await response.json();


      const response = await ipfs.catJSON(matrixhash)
      await Setmidi(response);

      console.log(response);
      
     await setPaterns(response.patterns)

     var wave3data = await store.getWave3Data();

     SetCurrentSupply(wave3data.currentsupply)
     SetMintPrice(wave3data.mint_price);
     Setpricetoburn(wave3data.pricetoburn)
     Setreserve_cut(wave3data.reserve_cut)



     //generatenft(midiJson);

       console.log('paterns')

     // console.log('ch :'+chArray[midiJson.patterns.ch])
     // console.log('oh :'+ohArray[midiJson.patterns.oh])
     // console.log('kick :'+kickArray[midiJson.patterns.kick])
     // console.log('mar :'+marArray[midiJson.patterns.mar])
     // console.log('snare :'+snareArray[midiJson.patterns.snare])


    await nftcreated(response)

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



       console.log("midi convert passed")

       console.log("ch"+charray[chainstru])
       console.log("kick"+kickarray[kickinstru])
       console.log("mar"+mararray[marinstru])
       console.log("snare"+snarearray[snareinstru])
       console.log("clap"+clapearray[clapinstru])
       console.log("cym"+cymearray[cyminstru])

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

            console.log("buffer  passed")

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

            await Tone.Transport.dispose();

          console.log("cleared")
         //   window.location.reload();
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


const burnnft = ()=> {

       console.log(props.matrixid);
       
       dispatcher.dispatch({ type: BURN_NFT, content: {tokenid:props.matrixid} })
          


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
<Card style={{  width: '100%',
  height: '400px',
  margin: '21.9px 60px 39.1px 20px',
  padding: '30px 20px 18px 30px',
  backgroundColor: '#333333'}}>
  <Grid container>
      <Grid item xs={12} md={3} style={{
  margin: '0 50px 20px 0',
  padding: '9.3px 9.3px 10.1px 9.3px',
}}>
     <SVG  instrument={midi.instruments} sources={midi.instruments_sources} bpm={bpm}/>

<Button style={{ width: '70px',
  height: '32px',
  margin: '13px 0 0 31.7px',
  color:'#000000',
  padding: '9px 18px 8px 21px',
  borderRadius: '2px',
  backgroundColor: '#f4f590'}} onClick={() => playstop()}>
        {isPlaying ? "Stop" : "Play"}</Button>


      </Grid>
          <Grid item xs={12} md={3} style={{
  margin: '0 50px 20px 0',
  padding: '9.3px 9.3px 10.1px 9.3px',
}}>
     <h3 style={{
  fontFamily:'Lato' ,
  fontSize: '16px',
  fontWeight: 'bold',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Featuring</h3>

  {midi && midi.instruments.ch && <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Closed Hat</p>}

  {midi && midi.instruments.kick &&   <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Kick </p>}
  {midi && midi.instruments.kick &&     <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Open Hat </p>}
  {midi && midi.instruments.snare && <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Snare</p>}

  {midi && midi.instruments.mar && <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Maracas</p>}

  {midi && midi.instruments.clap && <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Clap</p>}

 {midi && midi.instruments.cym && <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Cymbal</p>}

   {midi && midi.instruments.cob && <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Cow Bel</p>}


      </Grid>
      <br/> <br/>
                <Grid item xs={12} md={4} style={{
  margin: '10 50px 20px 0',
  padding: '9.3px 9.3px 10.1px 9.3px',
}}>
     <h3 style={{
  fontFamily:'Lato' ,
  fontSize: '16px',
  fontWeight: 'bold',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>NFT Data</h3>

  <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>IPFS Hash</p>
   <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>{props.matrix}</p>
    <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Track </p>
     <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>HH 00</p>
       <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Artist</p>
         <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Homan</p>

       <p style={{ margin: '0 93.4px 0 0',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.19',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Drop 0</p>
<br/><br/>
<Grid container style={{width:'90%',textAlign:'right',boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
              border: 'solid 1px #ffffff',height:'65px'}}>

            

<Grid item >



  <p style={{width: '153px',
  height: '31px',
  margin: '10px 31.7px 4px 6px',
  fontFamily: 'Lato',
  fontSize: '12px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'italic',
  lineHeight: '1.25',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#ffffff'}}>Current Brun Cost: {pricetoburn}.<br/>
Current Buffer: {reserve_cut} ETH.

</p>



</Grid>
<Grid item style={{textAlign: 'right'}}>
<Button style={{ width: '70px',
  height: '32px',
  margin: '13px 0 0 31.7px',
  color:'#000000',
  padding: '9px 18px 8px 21px',
  borderRadius: '2px',
  backgroundColor: '#f4f590'}} onClick={() => burnnft()} >BURN</Button>

</Grid>

</Grid>
      </Grid>

  </Grid>
          </Card>
  );
}



export default SoundMatrix;
