import React, { useState, useEffect } from 'react'
import TradeChart from './TradeChart'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Slider } from '@mui/material';
import {openLong, closeLong, openShort, closeShort} from '../utils/tezos'
import {getAccount} from '../utils/wallet';
import axios from 'axios';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: "30%",
	bgcolor: 'black',
	border: '2px solid #000',
	// boxShadow: 24,
	p: 4,
	'& > :not(style)': { m: 1, width: '25ch' },
	boxShadow: '0 0 0 1px white'
};

const Trade = (props) => {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [longOrShort, setLongOrShort] = useState('long')
	const {coinSelect, setCoinSelect} = props
	const [rangeValue, setRangeValue] = useState(1)
	const [isLong, setIsLong] = useState(false)
	const [baseValue, setBaseValue] = useState()
	const [longPositions, setLongPositions] = useState([]);
	const [shortPositions, setShortPositions] = useState([]);



	const getHistory = async () => {
		const address = await getAccount()
		if (address) {
			const history = await axios.get(`https://api.ghostnet.tzkt.io/v1/contracts/KT1CkJSoxa8Wm9fD2RSkfnpsEZch55jKB3Nj/storage`)
			setLongPositions(history.data.longPositions)
			setShortPositions(history.data.shortPositions)
			}

	}
	useEffect( ()=> {
		const interval = setInterval(() => {
			getHistory();
			}, 10000);
		return () => clearInterval(interval);
	},[]);

	const order_history_data = [
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
		{
		symbol : '02:00:05',
		quantity : 'LONG',
		execution_price : 'BTC',
		value : 169.234,
		role : 'Maker',
		fees_paid: 0.189,
		order_type : 'Limit',
		order_id : 8897877674,
		gas_fees : 0.1234,
		collateral : '+3245',
		time: '24 May 10:32:50 ',
		'p&l': '0.00 USDC',
		type: '1.60 USDC',
		bidding_price: 0.24234,
		estimated_fees: 0.345,
		status: 'Pending',
		locked_amount : 0.4,
		balance : 0.2,
		action : 'withdraw' 
		},
	]
	const onChangeRange = (e) => {
			setRangeValue(e.target.value)
		}


return (
	<div>
	<link rel="stylesheet" href="/styles/trade.css" />
	<div className="coin-name d-flex m-3">
		<div className="icon fs-2"><img src={`img/${coinSelect==='tezos'?'tz':coinSelect==='btc'?'btc':'eth'}.svg`} alt="" /></div>
		<div className="coin-name d-flex flex-column ms-2">
		<h4 className='mb-0 text-start'>{coinSelect==='tezos'?'XTZ-PREP':coinSelect==='btc'?'BTC-PREP':'ETH-PREP'}</h4>
		<h6 className='text-start'>{coinSelect==='tezos'?'Tezos':coinSelect==='btc'?'Bitcoin':'Ethereum'}</h6>
		</div>
	</div>

	<div className="trade-graph-enclosure">
		<div className="graph-infos d-flex text-start">
		<div className="graph-info">
			<div className="info-title">Market Price</div>
			<div className="info-values text-success">22679.762 vUSD</div>
		</div>
		<div className="graph-info">
			<div className="info-title">Index Price</div>
			<div className="info-values">21278.762 vUSD</div>
		</div>
		<div className="graph-info">
			<div className="info-title">Long funding rate</div>
			<div className="info-values text-danger">-0.2675%</div>
		</div>
		<div className="graph-info">
			<div className="info-title">Short funding rate</div>
			<div className="info-values text-success">0.0056%</div>
		</div>
		<div className="graph-info">
			<div className="info-title">Next funding</div>
			<div className="info-values">16:02</div>
		</div>
		</div>
		{/* <TradeChart/> */}
	</div>

	<div className="long-short-enclosure">
		<h5>By adding short position, you can earn 49.056% APR</h5>
		<div className="long-short-btns mt-4">
		<button className={`mx-3 btn btn-outline-white ${longOrShort==='long'?'bg-success':'btn-outline-success'} `} onClick={()=>{setLongOrShort('long')
		setIsLong(true)
		handleOpen()}} >Long</button>
		<button className={`mx-3 btn btn-outline-white ${longOrShort==='short'?'bg-danger':'btn-outline-danger'} `} onClick={()=>{setLongOrShort('short')
		setIsLong(false)
		handleOpen()}} >Short</button>
		</div>
	</div>

	<div className="history-enclosure text-white">
		<h4 className='text-start'>History</h4>
		<div class="list-group-item list-heading">
		<ul className="txn_elements txn-head p-3">
		<li className="txn_item list-group-item" >DIRECTION</li>
		<li className="txn_item list-group-item" >SYMBOL</li>
		<li className="txn_item list-group-item" >COLLATERAL</li>
		<li className="txn_item list-group-item" >POSITION SIZE</li>
		<li className="txn_item list-group-item" >ACTION</li>
		</ul>
		<ul class="historylist ">
			
		{
		longPositions.map((element) => {
			return (
				
				<>
					<li class="list-group-item">
					<ul className="txn_elements">
						<li className="txn_item list-group-item">LONG</li>
						<li className="txn_item list-group-item">XTZ</li>
						<li className="txn_item list-group-item">{element.value.token_amount / 1000000}</li>
						<li className="txn_item list-group-item">{element.value.vUSD_Amount / 1000000} XTZ</li>
						<li className="txn_item list-group-item"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
						<Button onClick={()=>{closeLong('XTZ')}}>CLOSE</Button></li>
					</ul>
					</li>
				</>
			)
			})}
		{
		shortPositions.map((element) => {
			return (
				<>
					<li class="list-group-item">
					<ul className="txn_elements">
					<li className="txn_item list-group-item">SHORT</li>
						<li className="txn_item list-group-item">XTZ</li>
						<li className="txn_item list-group-item">{element.value.token_amount / 1000000}</li>
						<li className="txn_item list-group-item">{element.value.vUSD_Amount / 1000000} XTZ</li>
						<li className="txn_item list-group-item"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
						<Button onClick={()=>{closeShort('XTZ')}}>CLOSE</Button></li>
					</ul>
					</li>
				</>
			)
			})}
		</ul>
		</div>

	</div>

	{isLong ? <Modal
		open={open}
		onClose={handleClose}
		aria-labelledby="modal-modal-title"
		aria-describedby="modal-modal-description"
	>
		<Box sx={style} component="form" noValidate autoComplete="off">
		<Typography id="modal-modal-title" variant="h4" component="h2" style={{width: '100%'}}>
			Long
		</Typography>
		<input value = {baseValue} id="outlined-basic" placeholder="vUSD Amount" variant="outlined" focused style={{width: '100%', color: 'white', backgroundColor: 'black', border:'1px solid white', borderRadius: '2%', padding: '10px', marginBottom:"20px"}} onChange = {(event)=>setBaseValue(parseInt(event.target.value))}/> <br/>
		Leverage <br/>
		<Slider
			aria-label="Temperature"
			defaultValue={1}
			// getAriaValueText={valuetext}
			// valueLabelDisplay="auto" 
			value={rangeValue}
			onChange={onChangeRange}
			color={'primary'}
			sx={{color:`grey`}}
			step={1}
			marks
			min={1}
			max={3}
			style={{width: '90%'}}/> {rangeValue} x <br/>
			<table style = {{width:"100%"}}>
			<tr style = {{width:"100%"}}>
				<td style = {{width:"70%"}}>Amount</td>
				<td style = {{width:"30%"}}>0 vUSD</td>
			</tr>
			<tr style = {{width:"100%"}}>
				<td style = {{width:"70%"}}>Commission</td>
				<td style = {{width:"30%"}}>0 vUSD</td>
			</tr>
			<tr style = {{width:"100%"}}>
				<td style = {{width:"70%"}}>Price impact</td>
				<td style = {{width:"30%"}}>0%</td>
			</tr>
			<tr style = {{width:"100%"}}>
				<td style = {{width:"70%"}}>Slippage tolerance</td>
				<td style = {{width:"30%"}}>2%</td>
			</tr>
			</table>
			<Button style={{align: 'center', width: '100%', marginTop:"20px"}}variant="contained" color="success"
				onClick={()=>{ console.log(baseValue , rangeValue , 'XTZ');
								openLong(baseValue , rangeValue , 'XTZ');
				}}>Go Long</Button>
		</Box>
	</Modal> : <Modal
		open={open}
		onClose={handleClose}
		aria-labelledby="modal-modal-title"
		aria-describedby="modal-modal-description"
	>
		<Box sx={style} component="form" noValidate autoComplete="off">
		<Typography id="modal-modal-title" variant="h4" component="h2" style={{width: '100%'}}>
			Short
		</Typography>
		<input id="outlined-basic" placeholder="vUSD Amount" variant="outlined" focused style={{width: '100%', color: 'white', backgroundColor: 'black', border:'1px solid white', borderRadius: '2%', padding: '10px', marginBottom:"20px"}} onChange = {(event)=>setBaseValue(parseInt(event.target.value))}/> <br/>
		Leverage <br/>
		<Slider
			aria-label="Temperature"
			defaultValue={1}
			// getAriaValueText={valuetext}
			// valueLabelDisplay="auto" 
			value={rangeValue}
			onChange={onChangeRange}
			color={'primary'}
			sx={{color:`grey`}}
			step={1}
			marks
			min={1}
			max={3}
			style={{width: '90%'}}/> {rangeValue} x <br/>
			<table style = {{width:"100%"}}>
			<tr style = {{width:"100%"}}>
				<td style = {{width:"70%"}}>Amount</td>
				<td style = {{width:"30%"}}>0 vUSD</td>
			</tr>
			<tr style = {{width:"100%"}}>
				<td style = {{width:"70%"}}>Commission</td>
				<td style = {{width:"30%"}}>0 vUSD</td>
			</tr>
			<tr style = {{width:"100%"}}>
				<td style = {{width:"70%"}}>Price impact</td>
				<td style = {{width:"30%"}}>0%</td>
			</tr>
			<tr style = {{width:"100%"}}>
				<td style = {{width:"70%"}}>Slippage tolerance</td>
				<td style = {{width:"30%"}}>2%</td>
			</tr>
			</table>
			<Button style={{align: 'center', width: '100%', marginTop:"20px"}}variant="contained" color="error"
				onClick={()=>{ console.log(baseValue , rangeValue , 'XTZ');
								openShort(baseValue , rangeValue , 'XTZ');}}
				>Go Short</Button>
		</Box>
	</Modal>}
	</div>
)
}

export default Trade
