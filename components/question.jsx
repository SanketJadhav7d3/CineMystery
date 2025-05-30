
import { useState, useEffect, useRef } from 'react';
import '../styles/question.css';
import '../styles/loading-animation.css';
import '../styles/dropup.css';
import '../styles/toggle.css';
import Confitte from "react-confetti";
import { RiSkipRightLine } from "react-icons/ri";
import { FiVolumeX, FiVolume2 } from "react-icons/fi";
import React from 'react';
import moviesData from './movies.json';


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

    const [totalQuestions, setTotalQuestions] = useState(0);
    const [totalCorrectQuestions, setTotalCorrectQuestions] = useState(0);

    const [movie, setMovie] = useState({});

    const [isMusic, setMusic] = useState(true);

    const toggleMusic = () => {
        setMusic(!isMusic);
    }


    // white - not choosen
    // green - correct
    // red - incorrect
    const [optionsState, setOptionsState] = useState(Array(4).fill('white'))

    function MoviePoster({ posterPath }) {
        const path = "https://image.tmdb.org/t/p/original/" + movie.poster_path;
        return (
            <img src={path} alt={path} height={300} width={300} />
        )
    }

    function resetStates() {
        setOptionsState(Array(4).fill('white'));
        setIsCorrent(null);
    }

    const dialogRef = useRef(null);

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      // Handler to block the Esc key
      const handleCancel = (event) => {
        event.preventDefault();
      };

      dialog.addEventListener('cancel', handleCancel);
      return () => {
        dialog.removeEventListener('cancel', handleCancel);
      };
    }, []);


    const showDialog = (correct) => {
        if (!dialogRef.current) return;
        dialogRef.current.showModal();
    }

    const startConfetti = () => {
        setShowConfitee(true);
    }

    function handleOptionClick(option) {

        // play sound
        if (option === correctAnswer) {
            startConfetti();
            // increment the correct question count 
            setTotalCorrectQuestions(totalCorrectQuestions + 1);
        }

        var audio = null; 

        var filePath = null;
        if (option === correctAnswer) {
            filePath = '/button-click-3.mp3'
        } else {
            filePath = '/wrong-answer.mp3'
        }

        // play only if enabled
        if (isMusic) {
            audio = new Audio(filePath);
            audio.play();
        }

        // make the correct button green and rest red
        // find the index of the correct option
        const correctIndex = options.indexOf(correctAnswer);
        var optionsState_ = Array(4);
        for (var i = 0; i < 4; i++) {
            if (i == correctIndex) optionsState_[i] = 'green';
            else optionsState_[i] = 'red';
        }

        // update total questions solved 
        setTotalQuestions(totalQuestions + 1);

        setOptionsState(optionsState_);

        setIsCorrent(option === correctAnswer)
    
        // show dialog
        showDialog(option === correctAnswer);
    }

    const fetchQuestion = async () => {
        // stop showing confitee
        setShowConfitee(false);

        // reset states for new question
        resetStates();

        // select a random index 
        const randomIndex = Math.floor(Math.random() * moviesData.length); 

        setIsLoading(true);
        await fetch('/api/completion', {
            method: 'POST',
            body: JSON.stringify({
                prompt: "The movie name is " + moviesData[randomIndex].title,
            }),
        }).then(response => {
            response.json().then(json => {
                setGeneration(json);

                // set movie as a state
                setMovie(moviesData[randomIndex]);

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

    // update session storage whenever the state count changes
    useEffect(() => {
        sessionStorage.setItem('totalCorrectQuestionSolved', totalCorrectQuestions);
    }, [totalCorrectQuestions]);

    // same as above
    useEffect(() => {
        sessionStorage.setItem('totalQuestionSolved', totalQuestions);
        const questionSolved = sessionStorage.getItem('totalQuestionSolved');

        console.log("total");

    }, [totalQuestions]);

    useEffect(() => {
        const questionSolved = sessionStorage.getItem('totalQuestionSolved');
        setTotalQuestions(questionSolved ? parseInt(questionSolved) : 0);

        const correctQuestions = sessionStorage.getItem('totalCorrectQuestionSolved');
        setTotalCorrectQuestions(correctQuestions ? parseInt(correctQuestions) : 0);

        console.log("once");

        console.log(moviesData);

        fetchQuestion();
    }, []);

    return (
        <div id='question-container'>

            <dialog ref={dialogRef} className={isCorrect ? 'dialog-green' : 'dialog-red'}>
                <form action="/submit" method="dialog">
                    <MoviePoster />
                    { movie.overview }
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
                    {totalCorrectQuestions} / {totalQuestions}
                </div>

                <label class="toggle-container">
                    <input type="checkbox" checked={isMusic} onChange={toggleMusic}/>
                    <span className="slider">
                        {isMusic ? <FiVolume2 color='#000' /> : <FiVolumeX />}
                    </span>
                </label>

                <RiSkipRightLine size={50} className='gradient-icon pointer' onClick={fetchQuestion}/>
            </div>
        </div>
    );
}
