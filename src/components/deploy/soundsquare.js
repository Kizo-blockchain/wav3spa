import React, { Component } from "react";
import { makeStyles,withStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
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

import Store from "../../stores";
import { colors } from '../../theme'

import YfrbLogo from '../../assets/YFRB-logo.png'
import DAILogo from '../../assets/DAI-logo.png'
import ETHLogo from '../../assets/ETH-icon.png'
import USDTLogo from '../../assets/USDT-logo.png'
import USDCLogo from '../../assets/USDC-logo.png'

// Import sounds
import am2 from './am2.mp3'
import bm2 from './bm2.mp3'
import dm2 from './dm2.mp3'
import em2 from './em2.mp3'

import * as Tone from 'tone'


import UniswapLogo from '../../assets/uniswap.png'
import KyberLogo from '../../assets/KNC-logo.png'
import AaveLogo from '../../assets/aave.png'
import swal from '@sweetalert/with-react';
import GridListTile from '@material-ui/core/GridListTile';
import Grid from '@material-ui/core/Grid';
import configdev from "../../config/configdev.js";
//import SoundSquare from "./square.js";

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store



const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  between: {
    width: '40px'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '32px'
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  actionButton: {
    '&:hover': {
      color:'#fff',
      backgroundColor: "#4f8eea",
    },
    padding: '12px',
    backgroundColor: "#4f8eea",
    borderRadius: '1rem',
    border: '1px solid #4f8eea',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '5px solid '+colors.borderBlue,
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  flashloan:{
    background:'linear-gradient(#674eea, #3434e1);'
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  proposalContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  field: {
    minWidth: '100%',
    paddingBottom: '20px'
  },
  fieldTitle: {
    paddingLeft: '20px'
  },
  titleInput: {
    borderRadius: '25px'
  },
  headingName: {
    paddingTop: '5px',
    flex: 2,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: 'auto',
    }
  },
  heading: {
    display: 'none',
    paddingTop: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: '5px',
      display: 'block'
    }
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap'
    }
  },
  assetIcon: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '40px',
      width: '40px',
      marginRight: '24px',
    }
  },
  grey: {
    color: colors.darkGray
  },
  expansionPanel: {
    maxWidth: 'calc(100vw - 24px)',
    width: '100%'
  },
  stakeTitle: {
    width: '100%',
    color: colors.darkGray,
  },
  claimContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    margin: '20px',
    background: colors.white,
    width: '100%'
  },
  stakeButton: {
    minWidth: '300px',
    color:'#fff',
    backgroundColor:'#2F80ED'
  },
  proposerAddressContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& > svg': {
      visibility: 'hidden',
    },
    '&:hover > svg': {
      visibility: 'visible'
    }
  }
})

/**
 * Houses row => sound mapping
 */
const sounds = {
  1: dm2,
  2: em2,
  3: am2,
  4: bm2,
  5: dm2,
  6: em2,
  7: am2,
  8: bm2,
  9: bm2,
  10:bm2,
}

// const notes = {
//   1: "C4",
//   2: "D4",
//   3: "E4",
//   4: "F4",
//   5: "G4",
//   6: "A4",
//   7: "B4",
//   8: "C4",
//   9: "D4",
//   10:"E4",
//   11:"F4",
//   12:"G4",
// }

const notes = {
  1: "B",
  2: "A#",
  3: "A",
  4: "G#",
  5: "G",
  6: "F#",
  7: "E",
  8: "D#",
  9: "D",
  10:"C#",
  11:"C#",
  12:"C",
}


/**
 * Builds state based on height x width
 */


/**
 * Stateless component for rendering
 * SoundSquares
 */
const SoundSquare = props => {
 
  let sqrClass = 'btn btn-secondary'
  let sqrStyle = {
    width: '25px',
    height: '25px',
    margin: '2px'
  }


  // Adjust the color as needed
  if (props.active) {
    sqrClass = 'btn btn-info'
  } else if (props.current) {
    sqrClass = 'btn btn-warning'
  }


 
  // Check if a sound should play
  if (props.active && props.current){

 //   playSound(props.note,props.key)

  }



  
  // Return the stylized div
    return (
      <div 
        className={sqrClass} 
        style={sqrStyle}
        id={props.key}
        beat={props.beat}
        key={props.key}
        onClick={props.handleClick}
      />
    )
  }




/**
 * Main component for the sound matrix
 */
class SoundMatrix extends Component {
  constructor(props) {
    super(props)
    const initialRowCount = 12
    const initialRowLength = 12

    this.loop = null
    this.state = {
      rowCount: initialRowCount,
      rowLength: initialRowLength,
      matrixsound:[],
      beat: 0,
      playing: false,
      speed: 175,
      matrix: [],
      key:"",
    }
 //   this.playSound = this.playSound.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.togglePlaying = this.togglePlaying.bind(this)
  }



  /**
   * Handle SoundSquare clicks
   * to adjust active state
   */
  handleClick(e) {


    console.log("handleclick")
    console.log( e.target.id)
    // Find the matrix and square id
    const matrix = this.state.matrix
    const id = e.target.id

    console.log(matrix[id].note)

    // Update the square state
    matrix[id].active = !matrix[id].active
    this.setState({ matrix })

   // console.log(matrix);
  }

  buildMatrixState = (rowCount, rowLength) => {
  const totalSquares = rowCount * rowLength
  const matrixState = {}

  console.log("############## sound matrix ##############")
  // Calculate details for each square
  for (let key = 1; key <= totalSquares; key++) {
    // Calculate beat and row details
    const calcBeat = key % rowLength
    const calcRow = Math.floor(key / rowLength)
    const row = (calcBeat === 0 ? calcRow : calcRow + 1)

    var random_boolean = Math.random() < 0.1;
    // Build the squareDetails
    const squareDetails = {
      active: random_boolean,
      beat: (calcBeat === 0 ? 1 : (rowLength - calcBeat) + 1),
      sound: new Audio(sounds[row]),
      note:notes[row]
    }

    console.log(notes[row]+""+key)

    if(random_boolean){

       this.setState(prevState => ({
        matrixsound: [...prevState.matrixsound, {key:key,note:notes[row],beat:(calcBeat === 0 ? 1 : (rowLength - calcBeat) + 1)}]
      }))

    }
    // Add the square to the matrixState object
    matrixState[key] = squareDetails
  }

  return matrixState
}

  createGround(width, height){
      var result = [];
      for (var i = 0 ; i < width; i++) {
          result[i] = [];
          for (var j = 0; j < height; j++) {
              result[i][j] = (Math.random() * 5 | 0) + 6;
          }
      }
      return result;
  }


  /**
   * Handles the click of the play
   * button. When enabled, an
   * interval is created to
   * continually increment beat
   */
     togglePlayingTone() {
    // Toggle the playing state
     const playing = !this.state.playing
    this.setState({ playing })


    // const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    // const now = Tone.now();

      if (playing) {
         const chunked = this.state.matrix;

        for(let i = 0; i < chunked.length; i++) {
          
           for(let j = 0; j < chunked[i].length; j++) {
             
              console.log(chunked[i][j]);
           }
        }

      }
    }



  
    
    // if (playing) {
    //   // Set an interval that loops the beat

   
    //   // this.loop = setInterval(() => {
    //   //   // Restart the beat if we reach rowLength
    //   //   if (this.state.beat >= this.state.rowLength) {
    //   //     this.setState({ beat: 1 })
    //   //   } else {
    //   //     // Increment the beat
    //   //     const newBeat = this.state.beat + 1
    //   //     this.setState({ beat: newBeat })
    //   //   }
    //   // // Set interval speed
    //   // }, this.state.speed)

    // } else {
    //   // Clear loop and reset beat
    //   clearInterval(this.loop)
    //   this.setState({ beat: 0 })
    // }

///loop



  togglePlaying() {
    // Toggle the playing state
    const playing = !this.state.playing
    this.setState({ playing })

    const matrix = this.state.matrix;


    const synth = new Tone.PolySynth().toDestination();

    const now = Tone.now();

    if (playing) {

                 // Set an interval that loops the beat
      this.loop = setInterval(() => {
        // Restart the beat if we reach rowLength
        if (this.state.beat >= this.state.rowLength) {

          this.setState({ beat: 1 })


        } else {
          // Increment the beat
          const newBeat = this.state.beat + 1

           console.log("beat"+newBeat)
            
           
            this.colum(newBeat);

          this.setState({ beat: newBeat })
        }
      // Set interval speed
      }, this.state.speed)


  

    } else {
      // Clear loop and reset beat
      clearInterval(this.loop)
      this.setState({ beat: 0 })
    }
  }

  colum =(col)=>{

    switch (col) {
       case 1:
        this.playcolumn(144)
        break;
      case 2:
        this.playcolumn(142)
        break;
      case 3:
        this.playcolumn(141)
      case 4:
       this.playcolumn(140)
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
           case 5:
       this.playcolumn(139)
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
           case 6:
       this.playcolumn(138)
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
           case 7:
       this.playcolumn(137)
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
           case 8:
        this.playcolumn(136)
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
              case 9:
        this.playcolumn(135)
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
              case 10:
        this.playcolumn(133)
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
              case 11:
        this.playcolumn(132)
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
        case 12:
        this.playcolumn(131)
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        console.log(`Sorry, we are out of ${col}.`);
    }



  }



  playcolumn = (number) =>{
     
    this.play(number - 12);
    this.play(number - 24);
    this.play(number - 32);
    this.play(number - 44);
    this.play(number - 56);
    this.play(number - 68);
    this.play(number - 80);
    this.play(number - 92);
    this.play(number - 116);
    this.play(number - 128);
    this.play(number - 140);

  }

   play = (id) => {

  
        const matrix = this.state.matrix;
         const synth = new Tone.PolySynth().toDestination();
         const now = Tone.now();
    
        if(matrix[id]){
          if(matrix[id].active){
           console.log("active")
   
           console.log(matrix[id].note)

           synth.triggerAttackRelease(matrix[id].note,0.175, now)
           
         }

        }
         

   }


  /**
   * Recursive function to build rows 
   * based on provided count
   */
  rowBuilder(rowCount, rowLength, rows = []) {
    if (rowCount > 0) {
      // Find the largest squareKey
      const squareKey = rowCount * rowLength

      // Add a row of squares
      rows.push(this.squareBuilder(squareKey, rowCount, rowLength))

      // Loop the rowBuilder by rowCount
      return this.rowBuilder(rowCount - 1, rowLength, rows)
    }

    // Return all the rows
    return rows
  }

  /**
   * Recursive function to build squares
   * based on provided count
   */
  squareBuilder(squareKey, rowCount, rowLength, row = []) {
    if (rowLength > 0) {
      // Find the square by key
      const square = this.state.matrix[squareKey]

      // Add a new square to the row
      row.push(SoundSquare({
        key: squareKey,
        active: square.active,
        handleClick: this.handleClick,
        playSound:this.playSound,
        beat: square.beat,
        current: (square.beat === this.state.beat ? true : false),
        sound: square.sound,
        note:square.note
      }))

      // Loop the squareBuidler by rowLength
      return this.squareBuilder(squareKey - 1, rowCount, rowLength - 1, row)
    }

    // Return the row with a unique row key
    return (<div key={'row-' + rowCount}>{row}</div>)
  }


 async  componentWillMount  () {


 this.setState({rowCount: 12,
      rowLength: 12,
      beat: 0,
      playing: false,
      speed: 175,
      matrix: this.buildMatrixState(12, 16)})

    }  

  /**
   * Builds the visual output
   */
  render() {
    return (
      <div className="text-center mt-5">
      
        {this.rowBuilder(this.state.rowCount, this.state.rowLength)}
          <button
          className="btn btn-primary my-2"
          style={{marginRight:'10px'}}
          onClick={this.togglePlaying}
        >
          {this.state.playing ? 'Stop Playing' : 'Start Playing'}
        </button>
            <button
          className="btn btn-secondary my-2"
          onClick={this.togglePlayingTone}
        >
          {this.state.playing ? 'Stop Playing' : 'Start Playing'}
        </button>
      </div>
    )
  }
}


export default withStyles(styles)(SoundMatrix);