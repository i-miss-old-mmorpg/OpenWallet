import { Card, Row, Col, Button, Container, Form } from 'react-bootstrap';
import { useContext, useState, useEffect, createRef } from 'react';
import styled from "styled-components";
import QRCode from 'qrcode.react';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { createWalletAddress, getBalance } from './api.js';
import { Wallet } from 'ethers';
import { WalletContext } from './App.js';

const StyledAddressButton = styled(Button)`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	width: 200px;
	display: inline-block;
`;

const StyledCloseButton = styled(Button)`
	position: absolute;
	top: 0;
	right: 0;
`;

function WalletManager() {
	const { walletData, setWallet } = useContext(WalletContext);
	const [isCopied, setCopied] = useState(false);
	let inputRef = createRef();

	// Generate a new wallet address
	const generateNewWalletAddress = () => {
		const ethersWallet = createWalletAddress();
		const localWalletData = {
			address: ethersWallet.address,
			privateKey: ethersWallet.privateKey,
		  };
		localStorage.setItem('localWalletData', JSON.stringify(localWalletData));

		// Getting current balance from api
		getBalance(ethersWallet).then(newData => {
			setWallet(newData);
		}).catch(error => {
			console.error("Error getting wallet balance: ", error);
		});
	}

	// Import an existing wallet address
	const importWalletAddress = () => {
		let walletPrivateKey = inputRef.current.value;
		const ethersWallet = new Wallet(walletPrivateKey);
		const localWalletData = {
			address: ethersWallet.address,
			privateKey: ethersWallet.privateKey,
		  };
		localStorage.setItem('localWalletData', JSON.stringify(localWalletData));

		// Getting current balance from api
		getBalance(ethersWallet).then(newData => {
			setWallet(newData);
		}).catch(error => {
			console.error("Error getting wallet balance: ", error);
		});
	};

	useEffect(() => {
		if (walletData !== null) {
			return;
		}

		let localWalletData = localStorage.getItem('localWalletData');
		if (localWalletData === null) {
			return;
		} else {
			try {
				let data = JSON.parse(localWalletData);
				const ethersWallet = new Wallet(data.privateKey);
				
				// Getting current balance from api
				getBalance(ethersWallet).then(newData => {
					setWallet(newData);
				}).catch(error => {
					console.error("Error getting wallet balance: ", error);
				});
			} catch (error) {
				console.error("Error parsing wallet address: ", error);
			}
		}
	}, []);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setCopied(false);
		}, 3000);

		return () => clearTimeout(timeout);
	}, [isCopied]);

	// If walletData exists, display the wallet information.
	return (
		walletData === null ? (
			<div>
				<Container>
					<Col className='d-flex flex-column'>
						<Row>
							<Button onClick={generateNewWalletAddress}>Create a new wallet</Button>
						</Row>
						<Row className='mt-2'>
							<Form.Control
								type='password'
								placeholder='Enter wallet private key'
								autoComplete='off'
								ref={inputRef}
							/>
							<Button onClick={importWalletAddress}>Import or recover wallet</Button>
						</Row>
					</Col>
				</Container>
			</div>
		) : (
			<Container>
				<Col className='d-flex flex-column'>
					<Row>
						<Card style={{ backgroundColor: '#232D3F', minWidth: '18rem', color: '#DDE6ED' }} className='w-100'>
							<StyledCloseButton onClick={() => {
								localStorage.removeItem('localWalletData');
								setWallet(null);
							}}>
								X
							</StyledCloseButton>
							<Card.Body>
								<Card.Title>Balance</Card.Title>
								<Card.Text>
									<h1 className='mb-2'>{walletData.currentBalance} ETH</h1>
									<CopyToClipboard text={walletData.address} onCopy={() => setCopied(true)}>
										<StyledAddressButton>
											{isCopied ? 'Copied!' : walletData.address}
										</StyledAddressButton>
									</CopyToClipboard>
									<div className='mt-3'><QRCode value={walletData.address} /></div>
								</Card.Text>
							</Card.Body>
						</Card>
					</Row>
				</Col>
			</Container>
		)
	);
}

export default WalletManager;