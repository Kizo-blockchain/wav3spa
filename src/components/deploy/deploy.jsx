import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
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
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { withNamespaces } from 'react-i18next';

import Loader from '../loader'
import Snackbar from '../snackbar'
import UnlockModal from '../unlock/unlockModal.jsx'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CopyIcon from '@material-ui/icons/FileCopy';
import Proposal from './proposal'
import YfrbLogo from '../../assets/YFRB-logo.png'
import DAILogo from '../../assets/DAI-logo.png'
import ETHLogo from '../../assets/ETH-icon.png'

import UniswapLogo from '../../assets/uniswap.png'
import KyberLogo from '../../assets/KNC-logo.png'
import AaveLogo from '../../assets/aave.png'

import Store from "../../stores";
import { colors } from '../../theme'

import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Loans from './flashloans.js'
import Grid from '@material-ui/core/Grid';
//import factory from './factory.js';
import swal from '@sweetalert/with-react';


import {
  DAI_BALANCE,
  DEPLOY_FLASHLOAN,
  DEPLOY_FLASHLOAN_RETURNED,
  DEPLOY_FLASHLOAN_RECEIPT_RETURNED,
  ERROR
} from '../../constants'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

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
      backgroundColor: "#3234e0",
    },
    padding: '12px',
    backgroundColor: "#3234e0",
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
    background:'linear-gradient(#674eea, #3434e1);'
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

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Vote extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    

    // const proposals = store.getStore('proposals')
     const deployFlashloanStatus = store.getStore('deployFlashloanStatus')
     const deployFlashloanReceiptStatus = store.getStore('deployFlashloanReceiptStatus')

    this.state = {
      daibalance: 0,
      yfrbbalance:0,
      Loans:null,
      flashloans:[],
      deployedscadress:null,
      loading: false,
      account: account,
      value: 1,
      deployFlashloanStatus: deployFlashloanStatus,
      deployFlashloanReceiptStatus: deployFlashloanReceiptStatus
    }

  }

  async componentWillMount  () {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(DEPLOY_FLASHLOAN_RETURNED, this.deployFlashloanReturned);
    emitter.on(DEPLOY_FLASHLOAN_RECEIPT_RETURNED, this.deployFlashloanReceiptReturned );
    
     var daibalance = await store.getdaibalance();
  
     var yfrbbalance = await store.getyfrbbalance();

     console.log(Flashloan)

        var Flashloan = await store.getdeployedflashloans();

     this.setState({daibalance:daibalance ,yfrbbalance:yfrbbalance,flashloans:Flashloan})

     //this.renderLoans()
   //  dispatcher.dispatch({ type: DAI_BALANCE, content: {  } })
  }




  componentWillUnmount() {

    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(DEPLOY_FLASHLOAN_RETURNED, this.deployFlashloanReturned);
    emitter.removeListener(DEPLOY_FLASHLOAN_RECEIPT_RETURNED, this.deployFlashloanReceiptReturned);
    

  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  
  deployFlashloanReturned = (txHash) => {
    this.setState({
      deployFlashloanStatus: store.getStore('deployFlashloanStatus'),
      loading: false
    })
    this.showSnackbar(txHash, 'Hash')
    // this.renderMessage(txHash, 'Hash')
  };

  // renderMessage = () => {
  //   return (
  //     <div closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
  //   )
  // }




  deployFlashloanReceiptReturned = async (contractAddr) => {

      var Flashloan = await store.getdeployedflashloans();
 
    this.setState({
      deployFlashloanReceiptStatus: store.getStore('deployFlashloanReceiptStatus'),
      loading: false,
      deployedscadress:contractAddr,
      flashloans:Flashloan
    })

     this.showSnackbar(contractAddr, 'ContractAddress')
  };


  showHash = (txHash) => {
    this.showSnackbar(txHash, 'Hash')
  };

  showAddressCopiedSnack = () => {
    this.showSnackbar("Address Copied to Clipboard", 'Success')
  }

  showSnackbar = (message, type) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: message, snackbarType: type }
      that.setState(snackbarObj)
    })
  }

  renderLoans = async() => {

 var Flashloan = await store.getdeployedflashloans();
 
  try {

    this.setState({ Loans: Flashloan.map((loan)=>{

               return (<Loans id={loan} />);

             })});


  } catch (err) {
    console.log(err);
  }
}


  render() {
    const { classes, t } = this.props;
    const {
      value,
      account,
      loading,
      modalOpen,
      snackbarMessage,
      title,
      titleError,
      description,
      descriptionError,
      votingStatus,
      daibalance,
      yfrbbalance,
      deployedscadress,
      flashloans
    } = this.state

    var address = null;

    console.log(daibalance)

    if (account.address) {
      address = account.address.substring(0,9)+'...'+account.address.substring(account.address.length-5,account.address.length)
    }

    return (
      <div className={ classes.root }>

       <div className={ classes.intro }>
          <Grid container spacing={1} justify='center'>
           <Grid item xs={12} md={4}>
          <Card className={ classes.addressContainer } >
 
            <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
       
          </Card>
          </Grid>
           <Grid item xs={12} md={4}>

           <Card className={ classes.addressContainer } >
       
             <Typography variant={ 'h3'}  noWrap>{yfrbbalance+" YFRB"}</Typography>
             <img   src={YfrbLogo} style={{width:'30px',borderRadius: '5%'}}/>
          </Card>
          </Grid>
           <Grid item xs={12} md={4}>


           <Card className={ classes.addressContainer } >

           <Typography variant={ 'h3'}  noWrap>{daibalance+" DAI"}</Typography>
                 <img   src={DAILogo} style={{width:'30px',borderRadius: '5%'}}/>
          </Card>
          </Grid>



          </Grid>

          <div className={ classes.between }> 
          </div>
           <div>
           
      
          </div> 

        </div>
      

               
       
        <div className={ classes.intro }>
        

          {/* <ToggleButtonGroup value={value} onChange={this.handleTabChange} aria-label="version" exclusive size={ 'small' }>
            <ToggleButton value={0} aria-label="v1">
              <Typography variant={ 'h4' }>{t('Vote.Done')}</Typography>
            </ToggleButton>
            <ToggleButton value={1} aria-label="v2">
              <Typography variant={ 'h4' }>{t('Vote.Open')}</Typography>
            </ToggleButton>
          </ToggleButtonGroup> */}
          {/* <div className={ classes.between }>
          </div> */}
         
             <Grid container spacing={1} justify='center'>
               <Button
                className={ classes.stakeButton }
                variant="outlined"
               
                style={{height:'80px',width:'400px'}}
                onClick={ () => { this.onDeployFlashLoanSmartContract() } }
              >
                <Typography variant={ 'h4'}><strong>Deploy New Flashloan Smart Contract</strong></Typography>
              </Button> 
              </Grid>
       
        </div>
            <div className={ classes.intro }>
        

          {/* <ToggleButtonGroup value={value} onChange={this.handleTabChange} aria-label="version" exclusive size={ 'small' }>
            <ToggleButton value={0} aria-label="v1">
              <Typography variant={ 'h4' }>{t('Vote.Done')}</Typography>
            </ToggleButton>
            <ToggleButton value={1} aria-label="v2">
              <Typography variant={ 'h4' }>{t('Vote.Open')}</Typography>
            </ToggleButton>
          </ToggleButtonGroup> */}
          {/* <div className={ classes.between }>
          </div> */}
          <div className={ classes.proposalContainer }>


                {deployedscadress && <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
                 <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>{deployedscadress}</Typography>
                  </Card>}
            
    

            </div>
        </div>

        <Grid container spacing={1}>

             {flashloans && flashloans.map((loan)=>{

                 return (<Grid container xs={12} md={6} item><Loans id={loan}/></Grid>);
             })}

             </Grid>
       
         <div>

                  <div className={ classes.proposerAddressContainer }>
                    <Typography className={ classes.grey } variant={'h5'}>This page deploys Flashloan Smart Contract between Kyber and Uniswap.
Once this is deployed, copy the contract address and use it to interact using the Arbitrage Bot.</Typography>    
                  </div>
                  </div>
                  <br/>
                  <br/>
        {/* { this.renderProposals() } */}
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
        { modalOpen && this.renderModal() }
      </div>
    )
  }

  goToDashboard = () => {
    window.open('https://www.yfrb.finance/', "_blank")
  }

  handleTabChange = (event, newValue) => {
    this.setState({value:newValue})
  };

  startLoading = () => {
    this.setState({ loading: true })
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  copyAddressToClipboard = (event, address) => {
    event.stopPropagation();
    navigator.clipboard.writeText(address).then(() => {
      this.showAddressCopiedSnack();
    });
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onPropose = () => {
    this.props.history.push('propose')
  }

  // onRegister = () => {
  //   this.setState({ loading: true })
  //   dispatcher.dispatch({ type: REGISTER_VOTE, content: {  } })
  // }

    onDeployFlashLoanSmartContract = async () => {

      console.log(this.state.yfrbbalance);

      if(this.state.yfrbbalance < 50){

        swal({
          title: "Not enough YFRB Tokens",
          text: "In order to deploy your flashloans Arbitrage contract you need at least 50YFRB.",
          icon: "warning",
          dangerMode: true,
        })

      } else {

        
        

         this.setState({ loading: true })
          dispatcher.dispatch({ type: DEPLOY_FLASHLOAN, content: {  } })
          
      }
   

    // console.log("clicked")
    // const account = store.getStore('account');

    // await factory.methods.createFlashloan().send({
    //   from:account
    // });


  }

  
  // onDeployFlashLoanSmartContract = async () => {
  //   this.setState({ loading: true })

  //   // console.log("clicked")
  //   // const account = store.getStore('account');

  //   // await factory.methods.createFlashloan().send({
  //   //   from:account
  //   // });
  //   dispatcher.dispatch({ type: DEPLOY_FLASHLOAN, content: {  } })

  // }


  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }


  // renderContractAddress = () => {
  //   var {
  //     snackbarType,
  //     snackbarMessage
  //   } = this.state
  //   return <div type={ snackbarType } message={ snackbarMessage } />
  // };


  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

}

export default withNamespaces()(withRouter(withStyles(styles)(Vote)));