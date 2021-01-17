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


import Deploy from '../components/deploy/deploy3.js'
import Loader from '../components/loader'
import Snackbar from '../components/snackbar'
import UnlockModal from '../components/unlock/unlockModal.jsx'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CopyIcon from '@material-ui/icons/FileCopy';
import Proposal from '../components/deploy/proposal'
import YfrbLogo from '../assets/logon.svg'
import DAILogo from '../assets/DAI-logo.png'
import ETHLogo from '../assets/ETH-icon.png'

import UniswapLogo from '../assets/uniswap.png'
import KyberLogo from '../assets/KNC-logo.png'
import AaveLogo from '../assets/aave.png'
import YFRBbal from '../assets/YFRB Balance.png'

import Store from "../stores";
import { colors } from '../theme'

import { Route, Switch, Redirect, Link } from "react-router-dom";

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Loans from '../components/deploy/flashloans.js'
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';

import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AppsIcon from '@material-ui/icons/Apps';
//import factory from './factory.js';
import swal from '@sweetalert/with-react';

import routes from './routes.js'
import logowav from '../assets/logowav.svg'
import {
  DAI_BALANCE,
  DEPLOY_FLASHLOAN,
  DEPLOY_FLASHLOAN_RETURNED,
  DEPLOY_FLASHLOAN_RECEIPT_RETURNED,
  ERROR
} from '../constants'


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor:'#1c1f25',
    width:'100%',
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
    backgroundColor:'#1c1f25',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor:'#1c1f25',
    padding: theme.spacing(3),
  },
}));

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [address,SetAdress] = React.useState('');
  const [daibalance, setDaiBalance] = React.useState(0);
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


     useEffect(() => {
 

         getdata();

       

    });
  

  const getdata = async ()=>{

      emitter.on(ERROR, errorReturned);
      emitter.on(DEPLOY_FLASHLOAN_RETURNED, deployFlashloanReturned);
      emitter.on(DEPLOY_FLASHLOAN_RECEIPT_RETURNED, deployFlashloanReceiptReturned);
      
       var daibalance = await store.getdaibalance();
       var flashloans =  await store.getdeployedflashloans()
       var yfrbbalance = await store.getyfrbbalance();

      var account = await store.getStore('account');

     setDaiBalance(daibalance);
     setFlashloans(flashloans);
     setYfrbbalance(yfrbbalance.toFixed() );

      
  
     SetAdress(account.address)

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

    const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/dapp") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

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
     
        <Card style={{padding:'10px',backgroundColor:'#fdffff'}}>
         <div style={{width:'100%',backgroundColor:'#fdffff'}}>
         </div>
       
             </Card>
    
      <Divider  style={{backgroundColor:'#F500FF'}}/>
      
      <List>
      <ListItem button >
            <ListItemIcon><AppsIcon style={{color:'white'}}/></ListItemIcon>
            <Link  to={{pathname: `/dapp/home` }}>
            <h4  style={{Style:'bold',color:'#b1adb5'}} >Home</h4>
            </Link>
          </ListItem>
            <Divider  style={{backgroundColor:'#b1adb5'}}/>
            <ListItem button >
            <ListItemIcon><AppsIcon style={{color:'white'}}/></ListItemIcon>
            <Link  to={{pathname: `/dapp/nfts` }}>
            <h4  style={{Style:'bold',color:'#b1adb5'}} >My NFTS</h4>
            </Link>
          </ListItem>

      </List>

      <List>

      </List>

    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed"  >
    

        <Toolbar style={{backgroundColor:'#000000'}} title={<img src={logowav}/>}>
           <Link   to={{pathname: `/dapp/home` }} >
          <img src={logowav} alt="logo" style={{width:'91.1px',height:'28.1px'}} />
          </Link>

    

        <div style={{textAlign:'right',width:'100%'}}>
        <Link   to={{pathname: `/dapp/howitworks` }} >
          <Button  style={{ fontFamily: 'Lato',color:'white'}}>How does it work?</Button>
          </Link>
            <Link to={{pathname: `/dapp/nfts` }}  >
            <Button  style={{ fontFamily: 'Lato',color:'white'}}>My Collection</Button>
            </Link>
         </div>

     
          <div style={{alignItems:'right',textAlign:'right',width:'50%'}}>
      
            {address && <Typography variant={ 'h4'} className={ classes.walletAddress } style={{color:'#f4f590'}} noWrap>Wallet : { address }</Typography>}
            
             {!address && <Button onClick={overlayClicked} style={{ width: '82px',
  height: '15px',
  fontFamily: 'Lato',
  fontSize: '12px',
  fontWeight: 'normal',
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.25',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#f4f590'}}>Connect wallet </Button>}
         <div style={{width:'100%'}}>
        
         </div>
         </div>  
        </Toolbar>

      </AppBar>
   
      <main className={classes.content} style={{backgroundColor:'#000000',width:'100%'}}>
          <Switch>
            {getRoutes(routes)}
            <Redirect from="*" to="/dapp/home" />
          </Switch>

      </main>
    </div>
  );
}



ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
