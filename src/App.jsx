import { languages } from "./languages";
import React from "react";
import { getFarewellText } from "./farewell messages";
import {clsx} from "clsx";
import { words } from "./words";
import Confetti from "react-confetti"

export function App(){
  const maxWrong = 8;
  const [displayMsg,setDisplayMsg] = React.useState("");

  let letters = null;


  const [clickedArray,setClickedArray] = React.useState([]);


  const [word,setWord] = React.useState(words[Math.floor(Math.random()*words.length)]);
  const wordArr = [...word];

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const [alphabetsArray,setAlphabetArray] = React.useState([...alphabet].map((alphabet)=>{
    return {
      value: alphabet,
      clicked: false,
      correct: wordArr.includes(alphabet)? true:false
    }
  }));
  

  letters = wordArr.map((letter,index) => <span className="letter" key={index}>{searchLetter(letter)}</span> );

  

  React.useEffect(()=>{
    if(clickedArray.length !==0 ){
      setAlphabetArray(prevArray => 
        prevArray.map((obj)=>{
          return clickedArray.includes(obj.value)?{
            ...obj,
            clicked:true
          }:obj}
        )
      )
    }
  },[clickedArray])

  function searchLetter(letter){
    let displayedLetter ="";
    alphabetsArray.forEach((alphabet)=>{
      if(alphabet.value === letter && alphabet.correct && alphabet.clicked){
        displayedLetter = letter.toUpperCase();
        console.log(displayedLetter)
      }
    })
    return displayedLetter
  }

  function countWrongLetters(){
    let count = 0
    clickedArray.forEach((letter)=>{
      wordArr.includes(letter)? count = count:count++
    })
    return count
  }

  const wrongGuessCount = countWrongLetters();

  const languageElements = languages.map(({name,backgroundColor,color},index)=>{
    return (
      <div key={name} className="lang-box"  style = {{backgroundColor: backgroundColor, color:color,opacity: wrongGuessCount > index? "0.1":"1"}}>
        {name}
      </div>
    )
  })

  const gameOver = wrongGuessCount >= maxWrong ? true:false;

  const isGameWon = wordArr.every(letter => clickedArray.includes(letter))

  const gameFinish = gameOver||isGameWon

  function gameStatus(){
    if(!gameFinish){
      return null
    }

    if(isGameWon){
      return (
        <>
          <h1>You win!</h1>
          <h3>Well done! 🎉</h3>
        </>
      )
    }else{
      return(
        <>
          <h1>You Lose</h1>
          <h3>Ja bsdk</h3>
        </>
      )
    }

  }

  const gameStatusClass = clsx( "status-section",{
      isWon: isGameWon,
      lost: gameOver,
      purple: wrongGuessCount>0 && !gameFinish
    }
  )

  

  React.useEffect(()=>{
    const lastLanguageLost = wrongGuessCount>0 ? languages[wrongGuessCount -1 ].name : null
    setDisplayMsg(()=>{
      return wrongGuessCount>=1? getFarewellText(lastLanguageLost):""
    });
    
  },[wrongGuessCount])

  function buttonClicked(letter){
    if(gameFinish){
      return
    }
    setClickedArray(prevArray=>
      prevArray.includes(letter)? prevArray : [...prevArray,letter]
    )
  }

  const alpahbetElements = alphabetsArray.map(alphabet=><button key={alphabet.value} className={`alphabet ${alphabet.clicked? alphabet.correct?"On":"Off" :"none"}`} disabled={alphabet.clicked || gameFinish} aria-disabled={gameFinish} aria-label={alphabet.value} onClick={()=>buttonClicked(alphabet.value)}>{alphabet.value.toUpperCase()}</button>)

  function newGame(){
    const newWord = words[Math.floor(Math.random() * words.length)];
    const newWordArr = [...newWord]

    setWord(newWord);
    setClickedArray([])
    setAlphabetArray([...alphabet].map((alphabet)=>{
      return {
        value:alphabet,
        clicked:false,
        correct: newWordArr.includes(alphabet)? true:false
      }
    }))
  }

  
  const allLetters = wordArr.map(word => <span className="letter">{word.toUpperCase()}</span>)
  
  

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000}/>}
      <header>
        <h1>Assembly:Endgame</h1>
        <h5>Guess the word in under 8 attempts to keep the<br/> programming world safe from Assembly!</h5>
      </header>
      <section className={gameStatusClass} aria-live="polite" role="status">
        {!gameFinish && wrongGuessCount>0 ? <h1>{displayMsg}</h1>:null}
        {gameStatus()}
      </section>
      <section className="language-container">
        {languageElements}
      </section>
      <section className="letter-container">
        {gameFinish?allLetters:letters}
      </section>
      <section className="keyboard">
        {alpahbetElements}
      </section>
      {gameFinish && <section className="new-game-button">
        <button onClick={newGame}>New Game</button>
      </section>}
    </main>
  )
}
