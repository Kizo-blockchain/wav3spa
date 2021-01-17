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





import UniswapLogo from '../../assets/uniswap.png'
import KyberLogo from '../../assets/KNC-logo.png'
import AaveLogo from '../../assets/aave.png'
import swal from '@sweetalert/with-react';
import GridListTile from '@material-ui/core/GridListTile';
import Grid from '@material-ui/core/Grid';
import configdev from "../../config/configdev.js";

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

class Flashloan extends Component {


	   constructor(props) {
   		 super()

       const account = store.getStore('account')

	    this.state = {
          yfrbbalance:0,
		      daibalance: 0,
          tokenAddress:null,
		      owner:null,
		    }

  		}

  		async withdraw(e){

  			e.preventDefault();


      if(this.state.yfrbbalance < 50){

        console.log("in component");
        console.log(this.state.yfrbbalance);

        swal({
          title: "Not enough YFRB Tokens",
          text: "In order to withdraw you need at least 50YFRB.",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        
      } else if (this.state.daibalance < 0 ){

           swal({
            title: "Not enough tokens",
            text: "you do not have enough to withdraw",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })

      } else {

          var daibalance = await store.withdrawfunds(this.props.id);

      }


 

    }

  			

      gettokenlogo(token){

       // console.log("get token : "+token)

        if(token == configdev.daitoken_adress){

          return DAILogo;

        } else if(token == configdev.usdt_token_address){

          return USDTLogo;

        }else {

          return USDCLogo;

        }

      }

   

	  async  componentWillMount  () {


	 	    var tokenadress = await store.TokenAddress(this.props.id);

	  	  var owner =  await store.getbotowner(this.props.id);
        var daibalance = await store.getbottdaibalance(this.props.id,tokenadress);

        console.log(daibalance)
        
        var yfrbbalance = await store.getyfrbbalance();
        

	     this.setState({daibalance:daibalance,yfrbbalance:yfrbbalance,tokenAddress:tokenadress})

	  }	

	  render() {

	  	const { classes, t,id } = this.props;
        const { daibalance,tokenAddress} = this.state

      

        return(<Card className={classes.flashloan} style={{width:'100%',height:'60px',margin:'20px'}}>
                <CardContent style={{padding:'10px',width:'100%',paddingTop:'5px'}} >
                 <Grid container spacing={2} style={{paddingTop:'15px'}}>

                <div style={{width:'100px'}}> 
                     <img   src={AaveLogo} style={{width:'25px',borderRadius: '5%',marginLeft:'10px'}}/>
                     <img   src={UniswapLogo} style={{width:'25px',borderRadius: '5%'}}/>
                     <img   src={KyberLogo} style={{width:'25px',borderRadius: '5%'}}/>
                 </div>
                <Typography style={{color:'white',marginBottom:'5px',paddingTop:'10px'}} variant={ 'h5'}  noWrap>
    
                  </Typography>
                    <Typography color="textSecondary" variant={ 'h5'} style={{color:'white',marginBottom:'5px',marginLeft:'10px',marginRight:'10px',paddingTop:'10px',fontFamily: '"Press Start 2P", cursive'}} noWrap>
                    {this.props.id}
                  </Typography>
                   <Typography style={{color:'white',width:'200px',textAlign:'right',marginRight:'10px',fontFamily: '"Press Start 2P", cursive'}} variant={ 'h5'}  noWrap>
                     {daibalance.toFixed(2)}<img   src={this.gettokenlogo(tokenAddress)} style={{width:'20px',borderRadius: '5%',marginLeft:'10px',paddingTop:'10px'}}/>
                  </Typography>

                  <Button style={{backgroundColor:'#EF11EF',marginLeft:'10px',marginBottom:'10px',fontFamily: '"Press Start 2P", cursive'}} size="small" onClick={e=> this.withdraw(e)}>Withdraw</Button>
         
                
                </Grid>
                 </CardContent>
              </Card>)
	  	

	  }




}



export default withStyles(styles)(Flashloan);