import { useEffect, useReducer } from 'react';
import Card from 'react-bootstrap/Card';

// Stock market colors
const colorUp = '#008170';
const colorDown = '#f44336';
const colorNeutral = '#232D3F';

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'SET_COLOR_AND_PREV_PRICE':
      return {
        backgroundColor: action.backgroundColor,
        prevPrice: action.prevPrice
      };
    default:
      return state;
  }
}

function AssetInfoCard({ coin }) {
  const [state, dispatch] = useReducer(reducer, {
    backgroundColor: colorNeutral,
    prevPrice: undefined
  });
  let timer = null;

  useEffect(() => {
    const currentPrice = Number(parseFloat(coin.priceUsd));
    const previousPrice = Number(parseFloat(state.prevPrice));

    // Always clear the previous timer if it exists
    if (timer !== null) {
      clearTimeout(timer);
    }

    if (state.prevPrice !== undefined && currentPrice !== previousPrice) {
      const newColor = currentPrice > previousPrice ? colorUp : colorDown;
      dispatch({
        type: 'SET_COLOR_AND_PREV_PRICE',
        backgroundColor: newColor,
        prevPrice: currentPrice
      });

      timer = setTimeout(() => {
        dispatch({
          type: 'SET_COLOR_AND_PREV_PRICE',
          backgroundColor: colorNeutral,
          prevPrice: currentPrice
        });
      }, 1000);
    } else {
      dispatch({
        type: 'SET_COLOR_AND_PREV_PRICE',
        prevPrice: currentPrice,
        backgroundColor: state.backgroundColor
      });
      timer = setTimeout(() => {
        dispatch({
          type: 'SET_COLOR_AND_PREV_PRICE',
          backgroundColor: colorNeutral,
          prevPrice: currentPrice
        });
      }, 1000);
    }

    // Clear the timer when the component unmounts
    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [coin.priceUsd, state.prevPrice]);

  return (
    <Card style={{ backgroundColor: state.backgroundColor, minWidth: '18rem', color: '#DDE6ED' }} className='w-100'>
      <Card.Body>
        <Card.Title>{coin.name} ({coin.symbol})</Card.Title>
        <Card.Text>
          ${Number(coin.priceUsd).toFixed(2)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default AssetInfoCard;




