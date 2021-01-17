import React,{useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme,withStyles } from '@material-ui/core/styles';

import ShowChartIcon from '@material-ui/icons/ShowChart';
import {
  Box,
  Button,
  Card,
  TextField,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core';


import Loader from '../loader'
import Snackbar from '../snackbar'
import UnlockModal from '../unlock/unlockModal.jsx'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CopyIcon from '@material-ui/icons/FileCopy';
import Proposal from './proposal'
import YfrbLogo from '../../assets/logon.svg'
import DAILogo from '../../assets/DAI-logo.png'
import ETHLogo from '../../assets/ETH-icon.png'

import UniswapLogo from '../../assets/uniswap.png'
import KyberLogo from '../../assets/KNC-logo.png'
import AaveLogo from '../../assets/aave.png'
import YFRBbal from '../../assets/YFRB Balance.png'

import Store from "../../stores";
import { colors } from '../../theme'


import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Loans from './flashloans.js'
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';

import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AppsIcon from '@material-ui/icons/Apps';

//import factory from './factory.js';
import swal from '@sweetalert/with-react';
import Swal2 from 'sweetalert2';

import {
  DAI_BALANCE,
  DEPLOY_FLASHLOAN,
  DEPLOY_FLASHLOANUSDT,
  DEPLOY_FLASHLOANUSDC,
  DEPLOY_FLASHLOAN_RETURNED,
  DEPLOY_FLASHLOAN_RECEIPT_RETURNED,
  STAKE_YFRB,
  UNSTAKE_YFRB,
  APPROVE_YFRB,
  ERROR
} from '../../constants'


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  actionButton: {
    color: colors.white,
    borderColor: '#F500FF'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    backgroundColor:'#373d4f',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const ValidationTextField = withStyles({
  root: {
     backgroundColor:'#F500FF',
    '& input:valid + fieldset': {
      borderColor: '#F500FF',
      borderWidth: 2,
    },
    '& input:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 2,
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 6,
      padding: '4px !important', // override inline-style
    },
  },
 
})(TextField);

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [address,SetAdress] = React.useState('');
  const [rewardbalance, setRewardBalance] = React.useState(0);
  const [yfrbbalance, setYfrbbalance] = React.useState(0);
  const [flashloans, setFlashloans] = React.useState([]);
  const [deployedscadress, setDeployedscadress] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [account, setAccount] = React.useState(false);
  const [deployFlashloanStatus, setDeployFlashloanStatus] = React.useState(false);
  const [deployFlashloanReceiptStatus, setDeployFlashloanReceiptStatus] = React.useState(false);
  const [snackbarType, SetSnackbarType] = React.useState(null);
  const [snackbarMessage,SetsnackbarMessage] = React.useState(null);
  const [modalOpen,SetmodalOpen] =React.useState(null);
  const [stakeamount,SetStakeAmount] =React.useState(null);
  const [lpbalance,SetLPbalance] =React.useState(null);



     useEffect(() => {
 

         getdata();

       

    });
  

  const getdata = async ()=>{

      emitter.on(ERROR, errorReturned);
      emitter.on(DEPLOY_FLASHLOAN_RETURNED, deployFlashloanReturned);
      emitter.on(DEPLOY_FLASHLOAN_RECEIPT_RETURNED, deployFlashloanReceiptReturned);
      
       var getlpbalance = await store.geLPtyfrbbalance();
       var getEarned =  await store.getEarned()
       var yfrbbalance = await store.getyfrbbalance();

      var account = await store.getStore('account');

    //  console.log(PoolWeight);
     // console.log(getEarned);

      setRewardBalance(getEarned.toFixed(8));
     // setFlashloans(flashloans);
      setYfrbbalance(yfrbbalance.toFixed(8) );

      SetLPbalance(getlpbalance.toFixed(8));
  
     // SetAdress(account.address)

  }


  const errorReturned = (error) => {
   
    setLoading(false)
  };

  const deployFlashloanReturned = (txHash) => {

    setLoading(false);
    setFlashloans(store.getStore('deployFlashloanStatus'))
 
    showSnackbar(txHash, 'Hash')
    // this.renderMessage(txHash, 'Hash')
  };

  const deployFlashloanReceiptReturned = async (contractAddr) => {

    console.log("receipt rerurned");

    getdata();

    setDeployFlashloanReceiptStatus(store.getStore('deployFlashloanReceiptStatus'));
    setLoading(false);
    setDeployedscadress(contractAddr);

    showSnackbar(contractAddr, 'ContractAddress')


     swal({
          title: "Smart contract created",
          text: "Your smart contract is deployed. You can start running your bot",
          icon: "success"
        })

  };


  const handleChange = (event) => {

    event.preventDefault();

    console.log(event.target.value)
    SetStakeAmount(event.target.value);

  }


 const  ApproveTransfert = async () => {

      console.log(yfrbbalance);

        setLoading(true)
          dispatcher.dispatch({ type: APPROVE_YFRB, content: { asset:"",amount:stakeamount  } })
          

      // if(yfrbbalance < 50){

      //   swal({
      //     title: "Not enough YFRB Tokens",
      //     text: "In order to stake you need at least 50YFRB.",
      //     icon: "warning",
      //     dangerMode: true,
      //   })

      // } else {

        
      // }
  

  }

   const  Stake = async () => {

      console.log(yfrbbalance);

     if(stakeamount == 0 || stakeamount == null){

        swal({
          title: "Farming amount not set",
          text: "You need to set a farming amount.",
          icon: "warning",
          dangerMode: true,
        })

      } else {

          setLoading(true)
          dispatcher.dispatch({ type: STAKE_YFRB, content: { asset:"",amount:stakeamount } })
          
      }
  

  }

  const withemergencydraw = async () => {

  
   

          Swal2.fire({
            title: 'Conifrm Unstake',
            text: 'Clicking "Confirm" will forfeit all rewards accrued',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, withdraw it!',
            cancelButtonText: 'No, keep it'
          }).then((result) => {
            if (result.value) {
             
              emwith()

            // For more information about handling dismissals please visit
            // https://sweetalert2.github.io/#handling-dismissals
            } else if (result.dismiss === Swal2.DismissReason.cancel) {
              Swal2.fire(
                'Cancelled',
                'You are not withdrawing yet',
                'error'
              )
            }
          })

  }


  const emwith = async () =>{


         setLoading(true)
        let ewithdraw = await  store.withemergencydraw();

        console.log(ewithdraw)


  }


   const  Withdraw = async () => {

      console.log(yfrbbalance);



  
           
       if(rewardbalance < 1){

        swal({
          title: "Claimable amount is low",
          text: "In order to claim, you must have 1 YFRB reward.",
          icon: "warning",
          dangerMode: true,
        })

      } else {

         setLoading(true)
          dispatcher.dispatch({ type: UNSTAKE_YFRB, content: {asset:"",amount:rewardbalance} })
         
         
      }
  

  }

   const showAddressCopiedSnack = () => {
    showSnackbar("Address Copied to Clipboard", 'Success')
  }

  const  copyAddressToClipboard = (event, address) => {
    event.stopPropagation();
    navigator.clipboard.writeText(address).then(() => {
      showAddressCopiedSnack();
    });
  }




  const  showHash = (txHash) => {
     
     showSnackbar(txHash, 'Hash');
  };




  const showSnackbar = (message, type) => {
    //this.setState({ snackbarMessage: null, snackbarType: null, loading: false })

   // const that = this
    // setTimeout(() => {
    //   const snackbarObj = { snackbarMessage: message, snackbarType: type }
    //   that.setState(snackbarObj)
    // })e


  }

  const renderModal = () => {
    return (
      <UnlockModal closeModal={ closeModal } modalOpen={ modalOpen } />
    )
  }

  const renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state

    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  const overlayClicked = () => {
   // this.setState({ modalOpen: true })
   console.log("overlay clicked")
    SetmodalOpen(true)
  }

  const closeModal = () => {
    
    SetmodalOpen(true)
  }



  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
        <Card style={{padding:'10px',backgroundColor:'#373d4f'}}>
         <div style={{width:'100%'}}>
          <img src={YFRBbal} style={{width:'60%'}}/> :
           <Typography variant={ 'h3'} className={ classes.walletAddress }  style={{color:'#ee15ef',width:'40%'}} noWrap> {yfrbbalance}
             
         <img   src={YfrbLogo} style={{width:'25px',borderRadius: '5%'}}/>

             </Typography>
         </div>
       
             </Card>
    
      <Divider  style={{backgroundColor:'#F500FF'}}/>
      
      <List>
      <a href="https://www.yfrb.finance/" target='_blank' style={{color:'white',textDecoration: 'none'}}>
      <ListItem button >
            <ListItemIcon><AppsIcon style={{color:'white'}}/></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          </a>
                <Divider  style={{backgroundColor:'#F500FF'}}/>
        {[ 'Flashloan Arbitrage', 'Staking (coming soon)'].map((text, index) => (
          <ListItem button key={text} style={{color:'white'}}>
            <ListItemIcon>{index % 2 === 0 ? <ShowChartIcon style={{color:'white'}} /> : <AccountBalanceIcon style={{color:'white'}}/>}</ListItemIcon>
            <ListItemText primary={text} />
           <Divider  style={{backgroundColor:'#F500FF'}}/>
          </ListItem>

        ))}
      </List>
            <Divider  style={{backgroundColor:'#F500FF'}}/>

      <List>
        <ListItem button style={{color:'white'}}>
           
            <ListItemText primary="TERMS"/>
          </ListItem>
        <ListItem style={{textAlign:'center',alignItems:'center',paddingLeft:'80px'}} >
            <a href="https://t.me/yfrb_finance" target="_blank" style={{color:'black'}}>
           <TelegramIcon style={{color:'white'}}/>
            </a>
             <a href="https://discord.gg/fb5F323" target="_blank" style={{color:'black'}}>
           <img src="https://discord.com/assets/28174a34e77bb5e5310ced9f95cb480b.png" style={{width:'20px'}} />
             </a>
             <a href="https://twitter.com/yfrbfinance" target="_blank" style={{color:'black',color:'white'}}>
           <TwitterIcon />
            </a>
          </ListItem>
      </List>

    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    
          <Grid container style={{paddingTop:'5vh'}}>
             <Typography paragraph style={{color:'white'}}>

        </Typography>


      <Card style={{backgroundColor:'#252035'}} class="nes-container with-title  is-dark is-centered">
          <h2  style={{Style:'bold',color:'white',fontFamily: '"Press Start 2P", cursive'}} >YFRB Staking</h2>
            <div class="nes-container with-title is-dark is-centered">
  <p class="title">Information</p>
    <p style={{color:'white',fontFamily: '"Press Start 2P", cursive',textAlign:'left'}} class="nes-text is-primary">Farm - Farm YFRB Token by supplying YFRB-USDC Uniswap LP token<br/><br/>
Claim - Claim accrued YFRB Rewards and withdraw Uniswap LP tokens, Need minimum 1 YFRB Balance to Claim.<br/><br/>
Unstake - Withdraw LP Token. Forfeit all accrued YFRB reward</p>
</div>
        <Grid container style={{paddingTop:'2vh'}} justify='center'>
       
      <Card variant="outlined" style={{backgroundColor:'#252035',width:'50vh',height:'60vh',textAlign:'center'}} justify='center'  class="nes-container with-title is-dark is-centered">
         <h3  style={{Style:'bold',color:'#F500FF',fontFamily: '"Press Start 2P", cursive'}} >YFRB -USDC</h3>
      <CardContent>
      <img src="https://www.nicepng.com/png/full/192-1926443_augmented-reality-game-space-invaders-clip-art.png" style={{width:'15vh',height:'15vh'}}/>
       <br/><br/>
       <h3  style={{Style:'bold',color:'#F500FF',fontFamily: '"Press Start 2P", cursive'}} >LP token balance:</h3>
       <h3  style={{Style:'bold',color:'#F500FF',fontFamily: '"Press Start 2P", cursive'}} >{lpbalance}</h3>

        </CardContent>

      <CardActions style={{textAlign:'center',alignItems:'center'}} justify='center'>
            <button type="button" class="nes-btn is-primary"
         style={{backgroundColor:'#f507ff',fontFamily: '"Press Start 2P", cursive'}} className={ classes.actionButton }  onClick={ApproveTransfert}>Approve</button>
           <button type="button" class="nes-btn is-primary"
         style={{backgroundColor:'#f507ff',fontFamily: '"Press Start 2P", cursive'}} className={ classes.actionButton } onClick={Stake}>Farm</button>
        
    
      </CardActions>

 
        <CardActions style={{textAlign:'center',alignItems:'center'}} justify='center'>

           <input type="text" id="dark_field" class="nes-input is-dark" placeholder="0.0" value={stakeamount} onChange={handleChange}/>
        
      </CardActions>


    </Card>
        <Card variant="outlined" style={{backgroundColor:'#252035',width:'50vh',height:'60vh',textAlign:'center'}} justify='center'  class="nes-container with-title is-dark is-centered">
      <CardContent>
       <i class="nes-icon trophy is-large"></i>
         <h3  style={{Style:'bold',color:'#F500FF',fontFamily: '"Press Start 2P", cursive'}} > Pending yfrb:<br/>{rewardbalance}</h3>
        </CardContent>

  
       <CardActions style={{textAlign:'center',alignItems:'center'}} justify='center'>

       <button type="button" class="nes-btn is-primary"
         style={{backgroundColor:'#f507ff',fontFamily: '"Press Start 2P", cursive' }}  onClick={Withdraw} >Claim</button>
      <button type="button" class="nes-btn is-primary"
         style={{backgroundColor:'#f507ff',fontFamily: '"Press Start 2P", cursive'}}  onClick={withemergencydraw} >Un-Stake</button>
      
      </CardActions>




    </Card>
     

    </Grid>
   <a href='https://app.uniswap.org/#/add/0x5d1b1019d0afa5e6cc047b9e78081d44cc579fc4/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' target='_blank'>
     <button type="button" class="nes-btn is-primary"
         style={{backgroundColor:'#f507ff',fontFamily: '"Press Start 2P", cursive', marginLeft:'15vh'}}   >Obtain YFRB LP tokens</button>
      </a>
   
    </Card>


       </Grid>
  );
}

/*

*/

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;