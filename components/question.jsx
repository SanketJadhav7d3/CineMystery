
import { useState, useEffect, useRef } from 'react';
import '../styles/question.css';
import '../styles/loading-animation.css';
import Confitte from "react-confetti";
import movies from './movies';
import { RiSkipRightLine } from "react-icons/ri";


function OptionButton({ option, onOptionClick, optionState }) {
    var buttonState = 'custom-btn btn-16-' + optionState;

    return (
        <button
            onClick={onOptionClick}
            className={buttonState}
            disabled={optionState != 'white'}
        >
            {option}
        </button>
    )
}

function WinningAnimation() {
    return (
        <img src="/winning.gif" alt='Trophy' />
    )
}

function TryAgainAnimation() {
    return (
        <img src="/try-again.gif" alt='Try again' />
    )
}

export default function Question() {
    const [generation, setGeneration] = useState();
    const [correctAnswer, setCorrectAnswer] = useState();
    const [options, setOptions] = useState(Array(4).fill(undefined));
    const [isLoading, setIsLoading] = useState(false);
    const [showConfetti, setShowConfitee] = useState(false);
    const [isCorrect, setIsCorrent] = useState(null);

    // white - not choosen
    // green - correct
    // red - incorrect
    const [optionsState, setOptionsState] = useState(Array(4).fill('white'))

    function resetStates() {
        setOptionsState(Array(4).fill('white'));
        setIsCorrent(null);
    }

    const dialogRef = useRef(null);

    const showDialog = () => {
        if (!dialogRef.current) return;
        dialogRef.current.showModal();
    }

    const startConfetti = () => {
        setShowConfitee(true);
    }


    function handleOptionClick(option) {
        if (option === correctAnswer) {
            console.log('right answer')
            startConfetti();
        }
        // make the correct button green and rest red
        // find the index of the correct option
        const correctIndex = options.indexOf(correctAnswer);
        var optionsState_ = Array(4);
        for (var i = 0; i < 4; i++) {
            if (i == correctIndex) optionsState_[i] = 'green';
            else optionsState_[i] = 'red';
        }
        // console.log(options);
        // console.log(optionsState_);
        setOptionsState(optionsState_);

        setIsCorrent(option === correctAnswer)
        // show dialog
        showDialog();
    }

    const fetchQuestion = async () => {
        // stop showing confitee
        setShowConfitee(false);

        // reset states for new question
        resetStates();

        const randomIndex = Math.floor(Math.random() * 101); 

        setIsLoading(true);
        await fetch('/api/completion', {
            method: 'POST',
            body: JSON.stringify({
                prompt: "The movie name is " + movies[randomIndex],
            }),
        }).then(response => {
            response.json().then(json => {
                setGeneration(json);

                // options as a state array
                var options_ = json.options;

                // sort options
                options_.sort(() => Math.random() - 0.5);

                setOptions(options_);
                // correct answer as a state
                setCorrectAnswer(json.answer);
                // loading is false
                setIsLoading(false);
            });
        });
    }

    useEffect(() => {
        fetchQuestion();
    }, []);

    return (
        <div id='question-container'>

            <dialog ref={dialogRef}>
                <form action="/submit" method="dialog">
                    {isCorrect ? <WinningAnimation /> : <TryAgainAnimation />}
                    <button
                        className='custom-btn btn-16-white'
                        onClick={fetchQuestion}
                    >
                        Next Question
                    </button>
                </form>
            </dialog>

            {showConfetti && (
                <Confitte
                    style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
                />
            )}
            <div id='question'>
                {isLoading || !generation ? <div className='loader'></div> : generation.question}
            </div>

            <div id="options" className={isLoading || !generation ? 'grid-container-loading' : 'grid-container'}>
                {isLoading || !generation ?
                    <div className='loader-2'></div>
                    :
                    options.map((option, key) => (
                        <OptionButton key={key}
                            option={option}
                            onOptionClick={() => { handleOptionClick(option) }}
                            optionState={optionsState[key]}
                        />
                    ))
                }
            </div>


            <div id="stats-container">
                <div id="stats">
                    total questions solved correctly / total questions next question
                </div>
                <RiSkipRightLine size={50} className='gradient-icon' onClick={fetchQuestion}/>
            </div>
        </div>
    );
}