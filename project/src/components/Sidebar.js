import React, { useState } from 'react'

const Sidebar = (props) => {
    const {coinSelect, setCoinSelect} = props
  return (
    <div className='sidebar px-3 py-5'>
        <link rel="stylesheet" href="/styles/sidebar.css" />
      <div className="coins">
        <div className={`${coinSelect === 'tezos'? 'sidebar-sel': '' } coin my-3 d-flex text-start`} onClick={()=>{setCoinSelect('tezos')}} >
            <div className='mx-2'><img src="/img/tz.svg" style={{width:'20px'}} alt="" /></div>
            <div>Tezos <br />XTZ</div>
            <div className='me-2 ms-auto text-end'>1.60 USDC</div>
        </div>
        <div className={`${coinSelect === 'btc'? 'sidebar-sel': '' } coin my-3 d-flex text-start`} onClick={()=>{setCoinSelect('btc')}} >
            <div className='mx-2'><img src="img/btc.svg" style={{width:'20px'}} alt="" /></div>
            <div>Bitcoin <br />BTC</div>
            <div className='me-2 ms-auto text-end'>22679.76 USDC</div>
        </div>
        <div className={`${coinSelect === 'eth'? 'sidebar-sel': '' } coin my-3 d-flex text-start`} onClick={()=>{setCoinSelect('eth')}} >
            <div className='mx-2'><img src="img/eth.svg" style={{width:'20px'}} alt="" /></div>
            <div>Ethereum<br />ETH</div>
            <div className='me-2 ms-auto text-end'>1595.85 USDC</div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
