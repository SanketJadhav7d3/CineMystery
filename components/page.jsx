
'use client';

import '../styles/page.css';
import { useChat } from 'ai/react';
import { MemoizedMarkdown } from './memoized-markdown';
import { FaAngleDoubleUp } from "react-icons/fa";

function UserChat({ chat }) {
    return (
        <div className='chat user-chat'>
            {chat}
        </div>
    )
}

function AIChat({ id, chat }) {
    return (
        <div className='chat ai-chat'>
            <MemoizedMarkdown id={id} content={chat} />
        </div>
    )
}

export default function InputBox() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat();

    return (
        <div id="page-container">
            <div id="chat-container">
                {
                    messages.map(message => (
                        <div
                            key={message.id}
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {message.role === "user" ? <UserChat chat={message.content} /> : <AIChat id={message.id} chat={message.content} />}
                        </div>
                    ))
                }
            </div>

            <form id='form-container' onSubmit={handleSubmit}>
                <textarea
                    type="text"
                    placeholder='Start typing here...'
                    onChange={handleInputChange}
                />
                <button type="submit">
                    <FaAngleDoubleUp size={30}/>
                </button>
            </form>
        </div>
    )
}