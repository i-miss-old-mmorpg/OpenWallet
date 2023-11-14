import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import AssetInfoCard from './components/AssetInfoCard';
import { fetchPrices, connectWebSocket } from './api.js';

function Info() {
	const [prices, setPrices] = useState(null);

	useEffect(() => {

		fetchPrices().then(data => setPrices(data)); // Restful for one-time data
		const cleanupWebSocket = connectWebSocket(setPrices); // WebSocket for updated data
		return cleanupWebSocket;

	}, []);

	return (
		<Container>
			<Col className='d-flex flex-column'>
				{prices && Object.entries(prices).map(([id, coin]) => (
					<Row key={id}>
						<AssetInfoCard coin={coin} />
					</Row>
				))}
			</Col>
		</Container>
	);
}

export default Info;