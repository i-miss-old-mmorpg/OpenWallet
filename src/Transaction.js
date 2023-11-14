import { Card, Row, Col, Button, Container, Form, Table } from 'react-bootstrap';
import { useContext, useState, useEffect, createRef } from 'react';
import moment from 'moment'
import { ethers } from 'ethers';
import { WalletContext } from './App.js';
import { getTransactionHistory } from './api.js';


function Transaction() {
	const { walletData, setWallet } = useContext(WalletContext);
	const [proccessedCount, setProccessed] = useState(0);
	const [transactionData, setTransactionData] = useState(null);
	let inputRefAddress = createRef();
	let inputRefETH = createRef();

	useEffect(() => {
		if (walletData === null) {
			return;
		}
		getTransactionHistory(walletData.address).then(data => setTransactionData(data)); // Get transaction history

	}, [proccessedCount]);


	async function doTransaction() {

		var url = 'https://sepolia.infura.io/v3/* Enter you api key here *';
		var provider = new ethers.JsonRpcProvider(url);

		// Creating a signing account from a private key
		const signer = new ethers.Wallet(walletData.privateKey, provider);

		// Creating and sending the transaction object
		const tx = await signer.sendTransaction({
			to: inputRefAddress.current.value,
			value: ethers.parseUnits(inputRefETH.current.value, 'ether'),
		});

		console.log('Mining transaction...');
		console.log(tx.hash);

		// Waiting for the transaction to be mined
		const receipt = await tx.wait();

		// The transaction is now on chain!
		console.log(`Mined in block ${receipt.blockNumber}`);

		setProccessed((count) => count + 1);
	}

	// If walletData exists, display the transaction UI.
	return (
		walletData === null ? (
			<div>
				{ /* Display nothing */}
			</div>
		) : (
			<Container>
				<Col className='d-flex flex-column'>
					<Row>
						<Card style={{ backgroundColor: '#232D3F', minWidth: '18rem', color: '#DDE6ED' }} className='w-100'>
							<Card.Body>
								<Card.Title>Balance</Card.Title>
								<Card.Text>
									<h1 className='mb-2'>{walletData.currentBalance} ETH</h1>
									<Form.Control
										type='text'
										placeholder="Enter recipient's wallet address"
										autoComplete='off'
										ref={inputRefAddress}
									/>
									<Form.Control
										className='mt-2'
										type='text'
										placeholder='Enter ETH'
										autoComplete='off'
										ref={inputRefETH}
									/>
									<Button
										className='w-100 mt-3'
										onClick={async () => {
											try {
												await doTransaction();
											} catch (error) {
												console.error(error);
											}
										}}>Send</Button>
								</Card.Text>
							</Card.Body>
						</Card>
					</Row>
					<Row>
						<Card style={{ backgroundColor: '#232D3F', minWidth: '18rem', color: '#DDE6ED' }} className='w-100 mt-3'>
							<Card.Body>
								<Card.Title>Transaction</Card.Title>
								<Card.Text>
									<div className="table-responsive">
										<Table striped bordered hover variant='dark' className='mt-3'>
											<thead>
												<tr>
													<th>From</th>
													<th>To</th>
													<th>Age</th>
													<th>Value</th>
												</tr>
											</thead>
											<tbody>
												{transactionData && typeof transactionData === 'object' && Object.values({ ...transactionData }).reverse().map((item) => (
													<tr key={item.hash}>
														<td>{item.from.substring(0, 5) + "..."}</td>
														<td>{item.to.substring(0, 5) + "..."}</td>
														<td>{moment.unix(item.timeStamp).fromNow()}</td>
														<td>{ethers.formatEther(item.value)} ETH</td>
													</tr>
												))}
											</tbody>
										</Table>
									</div>
								</Card.Text>
							</Card.Body>
						</Card>
					</Row>
				</Col>
			</Container>
		)
	);
}

export default Transaction;