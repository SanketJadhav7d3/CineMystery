
import Page from '../components/page';
import NavBar from '../components/navbar';
import '../styles/app.css';
import '../styles/font-style.css';
import '../styles/button.css';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Index() {

  const [playAnimation, setPlayAnimation] = useState(false);

  useEffect(() => {
    const animationPlayed = sessionStorage.getItem('animationPlayed');

    if (!animationPlayed) {
      setPlayAnimation(true);

      sessionStorage.setItem('animationPlayed', 'true');
    }
  }, []);

  const router = useRouter();

  function handleButtonClick() {
    router.push('/game')
  }

  return (
    <div className="full-window-container">
      <NavBar />
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            flex: 0.8,
            display: "flex",
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div className={`item-1 lobster-regular ${playAnimation ? 'text-flicker-in-glow' : 'glow-effect'}`}>C</div>
          <div className={`item-2 lobster-regular ${playAnimation ? 'text-flicker-in-glow' : 'glow-effect'}`}>in</div>
          <div className={`item-3 lobster-regular ${playAnimation ? 'text-flicker-in-glow' : 'glow-effect'}`}>e</div>
          <div className={`item-4 lobster-regular ${playAnimation ? 'text-flicker-in-glow' : 'glow-effect'}`}>My</div>
          <div className={`item-5 lobster-regular ${playAnimation ? 'text-flicker-in-glow' : 'glow-effect'}`}>st</div>
          <div className={`item-6 lobster-regular ${playAnimation ? 'text-flicker-in-glow' : 'glow-effect'}`}>er</div>
          <div className={`item-7 lobster-regular ${playAnimation ? 'text-flicker-in-glow' : 'glow-effect'}`}>y</div>

        </div>

        <button
          onClick={handleButtonClick}
          className={`glow-on-hover ${playAnimation ? 'slide-in-elliptic-top-fwd' : ''}`} type="button">
          Play
        </button>
      </div>
    </div>
  );
}