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
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Route, Switch, Redirect, Link } from "react-router-dom";



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
import Loans from './soundsquare.js'
import DeploySoundMatrix from './Deploynft.js'
import SoundMatrix from './ScribbleSoundMatrix.js'
//import SoundMatrix from './soundmatrix.js'
import SoundMatrixD from './soundmatrixd.js'
//import SoundMatrix from './soundsquare.js'
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';

import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AppsIcon from '@material-ui/icons/Apps';
//import factory from './factory.js';
import swal from '@sweetalert/with-react';


import {
  DAI_BALANCE,
  DEPLOY_FLASHLOAN,
  DEPLOY_FLASHLOANUSDT,
  DEPLOY_FLASHLOANUSDC,
  DEPLOY_FLASHLOAN_RETURNED,
  DEPLOY_FLASHLOAN_RECEIPT_RETURNED,
  ERROR
} from '../../constants'

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

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
    backgroundColor:'#fdffff',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


function ResponsiveDrawer(props) {
//  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [address,SetAdress] = React.useState('');
  const [daibalance, setDaiBalance] = React.useState(0);
  const [yfrbbalance, setYfrbbalance] = React.useState(0);
  const [matrixs, setMatrixs] = React.useState([1,2,3]);
  const [deployedscadress, setDeployedscadress] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [account, setAccount] = React.useState(false);
  const [deployFlashloanStatus, setDeployFlashloanStatus] = React.useState(false);
  const [deployFlashloanReceiptStatus, setDeployFlashloanReceiptStatus] = React.useState(false);
  const [snackbarType, SetSnackbarType] = React.useState(null);
  const [snackbarMessage,SetsnackbarMessage] = React.useState(null);
  const [modalOpen,SetmodalOpen] = React.useState(null);
  const [nftdeployed,Setnftdeployed] = React.useState(null);



       
     useEffect(() => {
 

      getdata();

    }, []);
  

  const getdata = () =>{

           
      emitter.on(ERROR, errorReturned);
      emitter.on(DEPLOY_FLASHLOAN_RETURNED, deployNftReturned);
      emitter.on(DEPLOY_FLASHLOAN_RECEIPT_RETURNED, deployNftReceiptReturned);
      

  }





  const errorReturned = (error) => {
   
    setLoading(false)
  };

  const deployNftReturned = (txHash) => {

    setLoading(false);
   // setFlashloans(store.getStore('deployFlashloanStatus'))
     console.log(txHash);

    showSnackbar(txHash, 'Hash')
    // this.renderMessage(txHash, 'Hash')
  };

  const deployNftReceiptReturned = async (contractAddr) => {

    console.log(" nft receipt rerurned");
    console.log(contractAddr);

    getdata();

    setDeployFlashloanReceiptStatus(store.getStore('deployFlashloanReceiptStatus'));
    setLoading(false);
    setDeployedscadress(contractAddr);

    showSnackbar(contractAddr, 'ContractAddress')

     Setnftdeployed(true);

     swal({
          title: "W4v3 Nft contract created",
          text: "Your smart contract is deployed.",
          icon: "success"
        })

  };


 const  onDeployFlashLoanSmartContract = async () => {

      console.log(yfrbbalance);

      if(yfrbbalance < 50){

        swal({
          title: "Not enough YFRB Tokens",
          text: "In order to deploy your flashloans Arbitrage contract you need at least 50YFRB.",
          icon: "warning",
          dangerMode: true,
        })

      } else {

          setLoading(true)
          dispatcher.dispatch({ type: DEPLOY_FLASHLOAN, content: {  } })
          
      }
  

  }

   const  onDeployFlashLoanSmartContractUSDT = async () => {

      console.log(yfrbbalance);

      if(yfrbbalance < 50){

        swal({
          title: "Not enough YFRB Tokens",
          text: "In order to deploy your flashloans Arbitrage contract you need at least 50YFRB.",
          icon: "warning",
          dangerMode: true,
        })

      } else {

          setLoading(true)
          dispatcher.dispatch({ type: DEPLOY_FLASHLOANUSDT, content: {  } })
          
      }
  

  }


   const  onDeployFlashLoanSmartContractUSDC = async () => {

      console.log(yfrbbalance);

      if(yfrbbalance < 50){

        swal({
          title: "Not enough YFRB Tokens",
          text: "In order to deploy your flashloans Arbitrage contract you need at least 50YFRB.",
          icon: "warning",
          dangerMode: true,
        })

      } else {

          setLoading(true)
          dispatcher.dispatch({ type: DEPLOY_FLASHLOANUSDC, content: {  } })
          
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



  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    
          <Grid container style={{backgroundColor:'#000000',width:'100%'}}>
         


        <div style={{width:'100%',marginBottom:'20px',backgroundColor:'#00000'}}>
    
        </div>

             <br/><br/>
             {nftdeployed && <Grid container xs={12} md={12} item container
                   direction="row"
                   justify="center"
                   alignItems="center" ><SoundMatrix />
                </Grid>}
               {!nftdeployed && <Grid container xs={12} md={12} item container
                   direction="row"
                   justify="center"
                   alignItems="center" ><DeploySoundMatrix />
                </Grid>} 
            
           



             
       </Grid>
  );
}


//            <Grid container xs={12} md={12}   container direction="row" justify="center" alignItems="center"  style={{marginTop:'5vh',backgroundColor:'#00000'}}>
//            <div style={{ width: '400px',
//   height: '83px',
//   margin: '0 0 10px',
//   padding: '10px 10.3px 9px 18px',
//   boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
//   border: 'solid 1px #ffffff'
// }}>
// <Grid container >
// <Grid item>
// <h1 style={{ width: '35px',
//   height: '19px',
//   margin: '0 185.7px 10px 0',
//   fontFamily: 'Lato',
//   fontSize: '16px',
//   fontWeight: 'bold',
//   fontStretch: 'normal',
//   fontStyle: 'normal',
//   lineHeight: '1.19',
//   letterSpacing: 'normal',
//   textAlign: 'left',
//   color:' #ffffff'}}>
//   Mint
//   </h1>


//   <p style={{width: '153px',
//   height: '31px',
//   margin: '10px 31.7px 4px 6px',
//   fontFamily: 'Lato',
//   fontSize: '12px',
//   fontWeight: 'normal',
//   fontStretch: 'normal',
//   fontStyle: 'italic',
//   lineHeight: '1.25',
//   letterSpacing: 'normal',
//   textAlign: 'left',
//   color: '#ffffff'}}>Current Cost: 0.464 ETH.
// Current Buffer: 0.01 ETH.

// </p>
// </Grid>
            
// <Grid item>
// <Link  to={{pathname: `/dapp/mint-nft` }}>
// <div style={{ width: '70px',
//   height: '32px',
//   margin: '13px 0 0 31.7px',
//   padding: '9px 18px 8px 21px',
//   borderRadius: '2px',
//   backgroundColor: '#f4f590'}}>MINT</div>
// </Link>

// </Grid>

// </Grid>
//            </div>

//            </Grid>
     // {matrixs && matrixs.map(matrix =>{

     //         console.log(matrix)

     //         return ();
          
     //       })}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;