
import Terms from '../components/deploy/deploy5.js'
import Instructions from '../components/deploy/deploy6.js'
import Deploy from '../components/deploy/deploy3.js'
import Deploy2 from '../components/deploy/deploy4.js'
import Howto from '../components/deploy/deploy5.js'
import Stake from '../components/deploy/stake.js'
import Degen from '../components/deploy/DegenM.js'
import DegenN from '../components/deploy/DegenN.js'
import Mint from '../components/deploy/MintToken.js'

const routes = [
       {
         path: "/home",
         mini: "",
         invisible:true,
         component: Degen,
         layout: "/dapp"
       },{
         path: "/mint-nft",
         mini: "",
         invisible:true,
         component: Mint,
         layout: "/dapp"
       },
       {
         path: "/nfts",
         mini: "",
         invisible:true,
         component: DegenN,
         layout: "/dapp"
       },
       {
         path: "/howitworks",
         mini: "",
         invisible:true,
         component: Howto,
         layout: "/dapp"
       }

];

export default routes;
