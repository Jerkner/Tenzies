import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti'
import Die from './Die'


export default function App() {
    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [rerolls, setRerolls] = useState(0)
    const [currentRecord, setCurrentRecord] = useState(localStorage.getItem('currentRecord') || '');

    useEffect(()=> {
        checkWin()
    }, [dice])

    function endGame() {
        setDice(allNewDice())
        setTenzies(false)
        setRerolls(0)
    }
    
    function newDie() {
        return {
            value: Math.floor(Math.random() * 6) + 1,
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
    return Array(10).fill(0).map(() => newDie());
}

    function rollDice() {
        if (tenzies) {
            endGame()
        } else {
            setRerolls(prevCount => prevCount +1)
            setDice(prevDice => prevDice.map(die => {
                return die.isHeld ? die : newDie()
            }))
        }
    }
    
    function holdDice(id) {
        if (!tenzies)
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ?
            {...die, isHeld: !die.isHeld} :
            die
        }))
    }
    
    function checkWin() {
        const hasFalse = dice.map(die => die.isHeld)
        const allHeld = !hasFalse.includes(false)

        const diceValues = dice.map(die => die.value)
        
        function allEqual(arr) {
            return new Set(arr).size === 1;
          }

          if (allHeld && allEqual(diceValues)) {
              setTenzies(true)
              updateRecord()
            }
        }
        
    function updateRecord() {
        if (rerolls < currentRecord || currentRecord === '') {
            setCurrentRecord(rerolls)
            localStorage.setItem("currentRecord", rerolls)
        }
    }
        
    const diceElements = dice.map(die => (
        <Die 
        value={die.value}
        isHeld={die.isHeld}
        key={die.id}
        handleClick={()=> holdDice(die.id)}
        disabled={tenzies} />
        ))
        
        return (
            <main>
            {tenzies && <Confetti />}

            <h1>Tenzies</h1>
            <h2>Roll until all dice are the same.<br />
                Click each die to freeze it at its current value between rolls.</h2>

            <div className="dice-container">{diceElements}</div>
        
            {tenzies ? (
                <button onClick={rollDice}>New Game</button>
                ) : (
                    <button onClick={rollDice}>Roll</button>
                    )}
            <div className="rerolls">
                <h4>Number of rolls:</h4>
                <h4>{rerolls}</h4>
            </div>

            <div className="currentRecord">
                <h4>Current record:</h4>
                <h4>{currentRecord}</h4>
            </div>

        </main>
  )
}