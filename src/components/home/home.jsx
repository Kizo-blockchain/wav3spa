import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'
import Link from '@material-ui/core/Link';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import DetailsIcon from '@material-ui/icons/Details';

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    }
  },
  card: {
    flex: '1',
    height: '25vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    borderRadius: '0px',
    transition: 'background-color 0.2s linear',
    [theme.breakpoints.up('sm')]: {
      height: '100vh',
      minWidth: '20%',
      minHeight: '50vh',
    }
  },
  earn: {
    backgroundColor: colors.gray,
    '&:hover': {
      backgroundColor: colors.darkBlue,
      '& .title': {
        color: colors.white
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.darkBlue
    },
    '& .icon': {
      color: colors.darkBlue
    }
  },
  zap: {
    backgroundColor: colors.gray,
    '&:hover': {
      backgroundColor: colors.red,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.red,
      display: 'block'
    },
    '& .soon': {
      color: colors.blue,
      display: 'none'
    },
    '& .icon': {
      color: colors.red
    },
  },
  apr: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.lightBlack,
      '& .title': {
        color: colors.white
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.lightBlack
    },
    '& .icon': {
      color: colors.lightBlack
    },
  },
  cover: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.compoundGreen,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.compoundGreen,
    },
    '& .icon': {
      color: colors.compoundGreen
    },
  },
  pool: {
    backgroundColor: colors.gray,
    '&:hover': {
      backgroundColor: colors.green,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.green,
    },
    '& .icon': {
      color: colors.green
    },
  },
  balancer: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.purple,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.purple,
    },
    '& .icon': {
      color: colors.purple
    },
  },
  title: {
    padding: '24px',
    paddingBottom: '0px',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '24px'
    }
  },
  icon: {
    fontSize: '60px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '100px',
    }
  },
  link: {
    textDecoration: 'none'
  }
});

class Home extends Component {

  constructor(props) {
    super()

    this.state = {
    }
  }

  render() {
    const { classes, t, location } = this.props;

    return (
      <div className={ classes.root }>
         <Card className={ `${classes.card} ${classes.zap}` } onClick={ () => { this.nav(location.pathname+'deploy') } }>
          <WbIncandescentIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Deploy Flashloan</Typography>
        </Card>
       
        <Card className={ `${classes.card} ${classes.pool}`} onClick={()=>{window.location.href="https://www.yfrb.finance/"}}>
          <AttachMoneyIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Run Arbitrage (Instructions) </Typography>
        </Card>

        {/* When ready with Staking change below onlick code back to Line#201 */}
        {/* <Card className={ `${classes.card} ${classes.earn}` } onClick={ () => { this.nav(location.pathname+'staking') } }> */}
        <Card className={ `${classes.card} ${classes.earn}` } onClick={ () => {  } }>
          <DetailsIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Stake (coming Soon)</Typography>
        </Card>


        {/*<Card className={ `${classes.card} ${classes.zap}` } onClick={ () => { this.nav(location.pathname+'propose') } }>
          <WbIncandescentIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Propose</Typography>
        </Card>*/}

      
        {/* <Card className={ `${classes.card} ${classes.zap}`} onClick={()=>{window.location.href="https://gov.yfii.finance"}}>
          <HowToVoteIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Vote</Typography>
        </Card> */}
        {/*<Card className={ `${classes.card} ${classes.pool}` } onClick={ () => { this.nav(location.pathname+'claim') }}>
          <AttachMoneyIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>claim</Typography>
        </Card>*/}
      </div>
    )
  };

  nav = (screen) => {
    this.props.history.push(screen)
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Home)));
