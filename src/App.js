import { createContext, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { House, Wallet, CashCoin } from 'react-bootstrap-icons';
import Headroom from 'react-headroom';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Info from './Info';
import WalletManager from './WalletManager';
import Transaction from './Transaction';

// Maintaining wallet, private key, history data
export const WalletContext = createContext();

function App() {
	const [walletData, setWallet] = useState(null);
	return (
		<WalletContext.Provider value={{ walletData, setWallet }}>
			<Router>
				<div>
					<Headroom>
						<div style={{ display: 'flex', justifyContent: 'center', top: 0, width: '100%', minWidth: '18rem' }}>
							<div style={{ display: 'inline-block', width: '100%' }}>
								<Navbar style={{ width: '100%' }} bg="dark" variant="dark">
									<Navbar.Toggle aria-controls="basic-navbar-nav" />
									<Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
										<Nav>
											<Navbar.Brand as={Link} to="/home">ᴏᴘᴇɴ ᴡᴀʟʟᴇᴛ</Navbar.Brand>
											<Nav.Link as={Link} to="/home"><House /></Nav.Link>
											<Nav.Link as={Link} to="/wallet"><Wallet /></Nav.Link>
											<Nav.Link as={Link} to="/transaction"><CashCoin /></Nav.Link>
										</Nav>
									</Navbar.Collapse>
								</Navbar>
							</div>
						</div>
					</Headroom>
					<div style={{ marginTop: '1.5rem' }}>
						<Routes>
							<Route path="/home" element={<Info />} />
							<Route path="/wallet" element={<WalletManager />} />
							<Route path="/transaction" element={<Transaction />} />
							<Route path="*" element={<Info />} />
						</Routes>
					</div>
				</div>
			</Router>
		</WalletContext.Provider>
	);
}

export default App;