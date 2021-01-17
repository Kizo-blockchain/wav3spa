import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
} from '@material-ui/core';
import { colors } from '../../theme'

import UnlockModal from '../unlock/unlockModal.jsx'
import RefreshIcon from '@material-ui/icons/Refresh';
import Retrobg from '../../assets/sound-waves.png'
import YFRB from '../../assets/logon.svg'
import YFRBT from '../../assets/frbtagline.png'
import wav3 from '../../assets/wave3.svg'

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE,
  CONFIGURE_RETURNED
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

//  

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor:'#000000',
    backgroundPosition: 'center',
    backgroundSize:'cover',
    minWidth: '100vw',
    padding: '36px 24px'
  },
  connectHeading: {
    maxWidth: '300px',
    textAlign: 'center',
    color: colors.white
  },
  connectContainer: {
    padding: '20px'
  },
  actionButton: {
    color: colors.white,
    borderColor: '#6fe6f0'
  },
  notConnectedRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectedRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
  },
  address: {
    color: colors.white,
    width: '100%',
    paddingBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  balances: {
    color: colors.white,
    width: '100%',
    padding: '12px'
  },
  balanceContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  accountHeading: {
    paddingBottom: '6px'
  },
  icon: {
    cursor: 'pointer'
  },
  disclaimer: {
    width: '300px',
    height: '32px',
    margin: '2px 0 0 40px',
    padding: '9px 19px 8px',
    borderRadius: '2px',
    border: 'solid 1px #f4f590',
    backgroundColor: '#000000',
  },
  titre:{
    fontSize: 18,
   fontFamily: 'Press Start 2P',
   borderRadius: 10,
   color:'#8B3DF5'
  }
});

    const styleSpan = {
   
};

class Account extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')

    this.state = {
      loading: false,
      account: account,
      assets: store.getStore('assets'),
      modalOpen: false,
    }
  }
  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
  };

  connectionConnected = () => {
    // this.setState({ account: store.getStore('account') })
  };

  configureReturned = () => {
    // this.props.history.push('/')
  }

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account'), loading: false })
  }

  errorReturned = (error) => {
    //TODO: handle errors
  };



  render() {
    const { classes } = this.props;
    const {
      account,
      modalOpen,
    } = this.state

    return (
      <div className={ classes.root }>
        { this.renderNotConnected() }
        { modalOpen && this.renderModal() }
      </div>
    )
  };



  renderNotConnected = () => {
    const { classes } = this.props
    const { loading } = this.state

    return (
      <div className={ classes.notConnectedRoot }>
           <div className={ classes.connectHeading } style={{textAlign:'center'}}>

           </div>
           <img src={wav3}/>
           <div className={ classes.connectContainer }>    </div>

 
        <div className={ classes.connectContainer }>
          <Button
            className={ classes.disclaimer }

            variant="outlined"
            color="primary"
            onClick={ this.unlockClicked }
            disabled={ loading }
            >
            <Typography style={{color:'#f4f590'}}>Connect your wallet to continue</Typography>
          </Button>
        </div>
      </div>
    )
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  unlockClicked = () => {
    this.setState({ modalOpen: true, loading: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false, loading: false })
  }
}

export default withRouter(withStyles(styles)(Account));
