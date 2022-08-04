import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Stake from './components/Stake'
import Trade from './components/Trade'

const Main = () => {
    const [tradeOrStake, setTradeOrStake] = useState('stake')
    const [coinSelect, setCoinSelect] = useState('tezos');
  return (
    <div className='d-flex'>
        <link rel="stylesheet" href="/styles/main.css" />
      <Sidebar coinSelect = {coinSelect} setCoinSelect={setCoinSelect}/>
      <div className="main-section">
        <div className="nav-tab d-flex w-100 ">
            <div className={`${tradeOrStake === 'trade'?'tabs-sel':''} tabs`} onClick={()=>{setTradeOrStake('trade')}}>Trade</div>
            <div className={`${tradeOrStake === 'stake'?'tabs-sel':''} tabs`} onClick={()=>{setTradeOrStake('stake')}}>Stake</div>
            <button className="ms-auto custom_btn">Connect Wallet</button>
        </div>
        {
            tradeOrStake === 'trade'? <Trade  coinSelect = {coinSelect} setCoinSelect={setCoinSelect} />: <Stake/>
        }
      </div>
    </div>
  )
}

export default Main
