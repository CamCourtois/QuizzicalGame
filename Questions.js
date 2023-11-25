import React, { useEffect, useState } from "react";

export default function Questions(props) {
    const [formData, setFormData] = useState([]);
    const [checkAnswersClicked, setCheckAnswersClicked] = useState(false);
    const [showCheckButton, setShowCheckButton] = useState(true);
    const [correctCount, setCorrectCount] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);

    let renderedQuestionHtml;

    function decodeHTMLEntities(html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent;
    }

    function insertRandomly(array, elementToInsert) {
        const randomIndex = Math.floor(Math.random() * array.length);
        array.splice(randomIndex, 0, elementToInsert);

        const decodedArray = array.map((item) => decodeHTMLEntities(item));

        return decodedArray;
    }

    useEffect(()=>{
        const updatedFormData = props.triviaData.map((question, index) => {
            return {
                question: decodeHTMLEntities(question.question),
                correct_answer: decodeHTMLEntities(question.correct_answer),
                answers: insertRandomly(
                question.incorrect_answers,
                question.correct_answer
                ),
                question_id: index,
                selected_answer: ""
            }
        })
        setFormData(updatedFormData)

    }, [props.triviaData])

    //handle a answer selection
    function handleChange(event, questionId) {
        // console.log("clicked");
        const {name, value, type, checked} = event.target
        // console.log("name: "+name)
        // console.log("value: "+value)
        // console.log("id: "+questionId)
        formData.forEach(item =>{
            if(item.question_id === questionId){
                // console.log(item)
                setFormData((prevData) =>
                    prevData.map((item) =>
                    item.question_id === questionId
                        ? { ...item, selected_answer: type === "checkbox" ? checked : value }
                        : item
                    )
                )
                   
            }
        })
    }
    
    function checkAnswers(){
        setCheckAnswersClicked(true)
        setIsDisabled(true)
        
        let numCorrect = 0;
        formData.map(data => {
            if(data.selected_answer === data.correct_answer){
                setCorrectCount(prevCount => prevCount + 1)
            }
        })
        
        setShowCheckButton(false);
    }
    
    function toggleAnswerButtonClass(data, answer) {
        
        if(checkAnswersClicked){
            if(data.selected_answer === answer && data.selected_answer === data.correct_answer){
                return "correct"
            }
            else if(answer === data.correct_answer){
                return "correct"
            }
            
            if(data.selected_answer === answer && data.selected_answer !== data.correct_answer){
                return "incorrect"
            }
            
            if(!data.selected_answer && !data.correct_answer){
                return "other-answers"
            }
           
            
        }
        else if(data.selected_answer === answer){
            return "checked"
        }
    
        return ""
        
    }


    //render questions from provided trivia data
    function renderQuestionMenu() {
        return formData.map((data, index) => (
        <div key={index} className="question-block">
            <h2 className="trivia-question">{data.question}</h2>

            <form className="question-form">
            {data.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="button-radio">
                <input
                    type="radio"
                    id={`${data.question_id}_${answerIndex}`}
                    value={answer}
                    name={data.question}
                    checked={formData[index].selected_answer === answer}
                    onChange={(event) => handleChange(event, data.question_id)}
                    disabled={isDisabled}
                />
                <label
                    className={toggleAnswerButtonClass(data, answer)}
                    htmlFor={`${data.question_id}_${answerIndex}`}
                >
                    {answer}
                </label>
                </div>
            ))}
            </form>
        </div>
        ));
  }
  
  function resetGame(){
      setShowCheckButton(true)
      props.setGameState("start")
  }


    return !props.triviaData ? (
        <h1 className="loading-text">Loading ... </h1>
    ) : (
        <div className="questions-container">
        {renderQuestionMenu()}
            {showCheckButton ? 
                (
                    <>
                    <button className="check-answers-button" onClick={checkAnswers}>
                        Check Answers
                    </button>
                    </>
                ) : (
                    <div className="play-again-container">
                    <p>You scored {correctCount} / 5 correct answers</p>
                    <button className="play-again-button" onClick={resetGame}>
                        Play Again
                    </button>
                    </div>
                )
            }
        </div>
    );
}
