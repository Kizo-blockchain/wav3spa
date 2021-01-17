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
import { Route, Switch, Redirect, Link } from "react-router-dom";

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


import {
  DAI_BALANCE,
  DEPLOY_FLASHLOAN,
  DEPLOY_FLASHLOAN_RETURNED,
  DEPLOY_FLASHLOAN_RECEIPT_RETURNED,
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
        <div className={ classes.connectHeading }>
          <Grid container style={{paddingTop:'10vh'}}>
          <Grid item xs={12} md={6}>
             <Typography  variant={'h5'}   style={{color:'white',textAlign:'justify',padding:'10px'}}>
           Mint

Current Cost: 0.374 ETH.
Current Buffer: 0.01 ETH.
NOTE: This code is *unaudited*. Caution is advised unless you want to take the risk.

Buffer?
Above and beyond Ethereum computation and storage costs (~0.0125 ETH at 50gwei), it currently costs: 0.374 ETH to mint a new psuedo-randomly, on-chain generated Neolastic.

However, a buffer of 0.01 ETH is added to the cost ensure that the transaction succeeds (because only one neolastic per price point can be minted). If there’s high demand (more than one mint transaction per block), a part of the buffer will be used to pay the mint cost at the time of confirmation. If no one else buys during the same block, you are refunded the entire 0.01 ETH buffer. If more than 10 buys occur in one block, the minting transaction can fail (too much demand for the pricing curve based on the time the transaction is issued and when it is mined/confirmed), but you will still be refunded.
Algorithmic Pricing Details
Any collector can pay to mint a randomly generated neolastic piece based on the hardcoded price formula (using a bonding curve). If there are more neolastics in existence, it becomes more expensive to mint the next neolastic. The price that a neolastic collector will receive upon burning their piece is based on how many neolastics currently exist. If there are more neolastics in circulation, then the floor price of your piece will be higher. 99.5% of each mint cost is stored in a communal reserve pool that acts as a buyer if any collector wants to burn their neolastic.

Collection Details:
Currently, there are 374 Neolastics in circulation.
The reserve pool is currently 69.774375 ETH.
Current Minting Cost 0.374 ETH.
Current Burning Reward 0.37213 ETH.
Total Ever Minted: 1200.
Total Ever Paid: 437.792 ETH.

Technicals
- Code is available here: https://github.com/simondlr/neolastics.
- The price curve is linear, starting at 0.001 ETH for a Neolastic piece. Each new piece increases the price by 0.001 ETH.
- 99.5% of the price is kept in the bonding curve reserve. 0.5% goes to the creator.
- There exists 6 colours, with white, black, red, blue, and yellow being equally likely (~20%).
- Green is rare (~1/256).
- The colours are chosen from the first 9 bytes of a psuedo-randomly generated 32 byte hash.
- A maximum of 10,077,696 (6^9) potential combinations can thus exist.
- Duplicates are possible with different hashes.
- Every neolastic is stored as its hash on Ethereum and can be auto-generated directly from the smart contract into an SVG blob. Thus, if this website goes away, you would always be able to own and view your neolastic.
- It uses the ERC721 NFT standard, and uses the ‘image_data’ field from OpenSea to enable the metadata to be more readily viewed by others (vs directly pulling it from Ethereum).
   </Typography>
   </Grid>
  <Grid item xs={12} md={6}>
             <Typography  variant={'h5'}   style={{color:'white',textAlign:'justify',padding:'10px'}}>
About The Project:
In November 2016, I proposed the idea of creating an autonomous artist that sells its own generative art using an early version of what would become bonding curves. A year later, I had a more concrete proposal in summoning an autonomous artist that tasked a crowd to curate a generator. In an attempt to compress these ideas into a simple MVP, I formulated a new version that directly tied newly minted pieces directly onto a bonding curve. Since then, NFTs, Generative Art, and Bonding Curves have increased in popularity and it’s time push ahead in these ideas. Thus, Neolastics seek to create a simple art project whereupon generative art is backed by a bonding curve economy. If successful, this could continue the aim of building a fully autonomous artist: eventually leading to one that even has its own ‘mind’.I’m a huge fan of Mondrian’s Neo-Plasticism art and it served as inspiration for the kind of generative art I wish to see. Hat tip to Clovers.Network for pushing the boundaries of a generative art + bonding curve economy.

If you own a Neolastic, you can join the Discord to chat with other collectors: https://discord.gg/M5b2MrK2FG. Verified by Collab.land.

About The Artist:
I’m a creator at heart. I have created games, writing, music, code, companies, and new economics. Solving the problems of the creator has always been important to me. In the past I co-founded Ujo Music, working with Grammy-winning artists such as Imogen Heap and RAC to launch the first music royalty projects using smart contracts. I’ve helped kickstart wholly new markets and economies. I helped to create the Ethereum ERC20 token standard and token bonding curves, technologies that’s currently facilitating economies worth several billion dollars of value. I enjoy creating new forms of art and experimenting with ways to empower the creative industry.

See my other art projects here: https://blog.simondlr.com/art.
Swing me a follow on Twitter! @simondlr.

        </Typography>

   </Grid>
     
       </Grid>

           <Grid container style={{paddingTop:'10vh'}} justify='center'>
      
          </Grid>
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