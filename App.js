import React from "react";
import Questions from "./Questions";

export default function App() {
  const [gameState, setGameState] = React.useState("start");
  const [triviaData, setTriviaData] = React.useState();
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('')
  
  const handleDifficultyChange = (e) =>{
      setSelectedDifficulty(e.target.value)
  }
  
  const handleCategoryChange = (e) =>{
      setSelectedCategory(e.target.value)
  }

  React.useEffect(() => {
    fetch(`https://opentdb.com/api.php?amount=5&category=${selectedCategory}&difficulty=${selectedDifficulty}`)
      .then((res) => res.json())
      .then((data) => {
          
          let fetchedTriviaData = data.results.map((entry) => ({
                    question: entry.question,
                    correct_answer: entry.correct_answer,
                    incorrect_answers: entry.incorrect_answers,
          }))
          setTriviaData(fetchedTriviaData);
            
        });    
  }, [gameState, selectedCategory, selectedDifficulty]);


  return (
      <>
      
        {
            gameState === "start" ?
            (
                <div className="start-menu">
                    <h1>Quizzical</h1>
                    <div className="difficulty-dropdown-container">
                        <label className="start-menu-labels" htmlFor="difficulty-dropdown">Select a difficulty: </label>
                        <select className="diff-dropdown-box" id="difficulty-dropdown" value={selectedDifficulty} onChange={handleDifficultyChange} name="difficulty-dropdown">
                            <option value="easy">Easy </option>
                            <option value="medium">Medium </option>
                            <option value="hard">Hard </option>
                        </select>
                        <label className="start-menu-labels" htmlFor="category-dropdown">Select a Category: </label>
                        <select className="category-dropdown-box" id="category-dropdown" value={selectedCategory} onChange={handleCategoryChange} name="category-dropdown">
                            <option value="9">General Knowledge </option>
                            <option value="11">Film </option>
                            <option value="12">Music </option>
                            <option value="17">Science </option>
                            <option value="21">Sports </option>
                            <option value="22">Geography </option>
                            <option value="23">History </option>
                            <option value="25">Art </option>
                        </select>
                    </div>
                    <button onClick={()=>setGameState("inGame")}>Start Quiz</button>
                </div>
            ) 
            : gameState === "inGame" && 
            (
                <div className="in-game-screen">
                    <Questions setGameState={setGameState} currentGameState={gameState} triviaData={triviaData}/>
                </div>
            )  
        }
      </>
  )
}
