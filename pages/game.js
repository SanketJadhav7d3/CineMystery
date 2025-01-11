
'use client';

import { useState } from 'react';
import NavBar from '../components/navbar';
import Question from '../components/question';

export default function Page() {
  return (
    <div className='full-window-container flex-center'>
      <NavBar />
      <Question />
    </div>
  );
}

