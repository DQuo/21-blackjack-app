import React, { useEffect, useState } from 'react';
import { ChakraProvider, Box, Grid, theme, Button, Image, Center, Flex, GridItem, Heading } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

const cardValue = (value) => {
  switch (value) {
    case '2':
      return 2;
    case '3':
      return 3;
    case '4':
      return 4;
    case '5':
      return 5;
    case '6':
      return 6;
    case '7':
      return 7;
    case '8':
      return 8;
    case '9': 
      return 9;
    case '10': 
      return 10;
    case 'JACK': 
      return 10;
    case 'QUEEN': 
      return 10;
    case 'KING': 
      return 10;
    case 'ACE': 
      return 11;
    default:
      return;
  }
}

function App() {
  const [deck, setDeck] = useState(null);

  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);

  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const [stay, setStay] = useState(false);

  const [isGameOver, setIsGameOver] = useState({ bool: false, msg: '', color: '' });

  const [newGame, setNewGame] = useState(false);


  // When app loads

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/');
        const data = await response.json();
        console.log(data);
        setDeck(data);
      } 
      catch (error) {
        console.log(error);
      }
    }
    fetchDeck();
  }, []);

  // Everytime component renders get the scores and check for a winner;

  useEffect(() => {
    console.log('useEffect')
    if (!isGameOver.bool) {
      getComputerScore();
      getPlayerScore();
      checkForWinner();
    }
  });

  useEffect(() => {
    setIsGameOver({ bool: false, msg: '', color: '' });
    setStay(false);
    setNewGame(false);
    console.log('new game useffect')
  }, [newGame]);


  const checkForWinner = async () => {
    if (playerScore === 21 && computerScore === 21) {
      setIsGameOver({ bool: true, msg: 'Draw!', color: 'orange.300'});
    }
    else if (playerScore === 21 || computerScore > 21) {
      setIsGameOver({ bool: true, msg: 'You win!', color: 'green.300'});
    }
    else if (computerScore === 21 || playerScore > 21) {
      setIsGameOver({ bool: true, msg: 'You lose!', color: 'red.300'});
    }

    if (stay) {
      if (playerScore > computerScore && playerScore <= 21) {
        setIsGameOver({ bool: true, msg: 'You win', color: 'green.300' });
        
      } 
      else if (playerScore < computerScore && computerScore <= 21) {
        setIsGameOver({ bool: true, msg: 'You Lose', color: 'red.300'})
      }
      else if (playerScore === computerScore) {
        setIsGameOver({ bool: true, msg: 'Draw', color: 'orange.300'})
      }
    }
    return;
  };



  // Draw Cards

  const drawCards = async (numberOfCards) => {
    try {
      const res = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${numberOfCards}`); 
      const data = await res.json();
      return data;
    } 
    catch (error) {
      console.log(error);
    }
  };


  // Shuffle Deck

  const shuffleDeck = async () => {
    try {
      const res = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`); 
      const data = await res.json();
      console.log(data);
      setDeck(data);
    } 
    catch (error) {
      console.log(error);
    }
  };


  // Start Game

  const startGame = async () => {
    setNewGame(true);
    await shuffleDeck();
    const playerCards = await drawCards(2);
    const computerCards = await drawCards(2);
    setPlayerHand([playerCards.cards[0], playerCards.cards[1]]);
    setComputerHand([computerCards.cards[0], computerCards.cards[1]]);
    const score1 = cardValue(playerCards.cards[0].value) + cardValue(playerCards.cards[1].value);
    const score2 = cardValue(computerCards.cards[0].value) + cardValue(computerCards.cards[1].value);
    setPlayerScore(score1);
    setComputerScore(score2);
    setIsGameOver({bool: false});

    if (score1 === 21 && score2 === 21) {
      setIsGameOver({ bool: true, msg: 'Draw!', color: 'orange.300'});
    }
    else if (score1 === 21) {
      setIsGameOver({ bool: true, msg: 'You win!', color: 'green.300'});
    }
    else if (score2 === 21) {
      setIsGameOver({ bool: true, msg: 'You lose!', color: 'red.300'});
    }
  }


  // When player hits

  const handleHit = async () => {
    const card1 = await drawCards(1);
    const card2 = await drawCards(1);
    setPlayerHand((cards) => [...cards, card1.cards[0]]);

    if (computerScore < 17) {
      setComputerHand((cards) => [...cards, card2.cards[0]]);
    }
  };


  // When player stays

  const handleStay = async () => {
    if (computerScore < 17) {
      const card = await drawCards(1);
      setComputerHand((cards) => [...cards, card.cards[0]], () => {});
      
    } 
    setStay(true);
  }


  // Get Computer Score

  const getComputerScore = async () => {
    if (computerHand.length !== 0) {
      const computerPointsArr = computerHand.map((card) => cardValue(card.value) );
      const computerPoints = computerPointsArr.reduce((acc, current) => acc + current);
      setComputerScore(computerPoints);
    }
    else {
      setComputerScore(0);
    }
  };

  // Get Player Score

  const getPlayerScore = async () => {
    if (playerHand.length !== 0) {
      const playerPointsArr = playerHand.map((card) =>  cardValue(card.value) );
      const playerPoints = playerPointsArr.reduce((acc, current) => acc + current);
      setPlayerScore(playerPoints);
    }
    else {
      setPlayerScore(0);
    }
  };


  // Return View

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" h='100vh'>
        <ColorModeSwitcher justifySelf="flex-end" />
        <Grid p={3} gap={3} templateColumns='1fr 1fr' templateRows='1fr 1fr 1fr' bgColor='green.800'>
          <Flex>
            <Button colorScheme='cyan' mr={1} onClick={startGame} flex={1}>New Game</Button>
          </Flex>
          <Flex>
            <Button colorScheme='cyan' mr={1} onClick={handleHit} flex={1}>Hit</Button>
            <Button colorScheme='cyan' mr={1} onClick={handleStay} flex={1}>Stay</Button>
          </Flex>
          { isGameOver.bool ? (
            <GridItem colSpan={2} h='100px'>
                <Heading color={isGameOver.color}>
                  {isGameOver.msg}
                </Heading>
            </GridItem>
          ): (
            <GridItem colSpan={2}></GridItem>
          )}
          <Flex wrap='wrap' justify='center'>
            { playerHand.length > 0 && playerHand.map((card, idx) => {
              return (
                <Image key={idx} src={card.image} h='200px' w='150px' mr={4}/>
              )
            })}
          </Flex>
          <Flex wrap='wrap' justify='center'>
            { computerHand.length > 0 && computerHand.map((card, idx) => {
              return (
                <Image key={idx} src={card.image} h='200px' w='150px' mr={4}/>
              )
            })}
          </Flex>
          <Center>{playerScore}</Center>
          <Center>{computerScore}</Center>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
