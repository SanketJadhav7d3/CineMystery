

import NavBar from '../components/navbar';
import '../styles/app.css';
import '../styles/font-style.css';

export default function Index() {
    return (
        <div className="full-window-container">
            <NavBar />
            <div style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }} className='lobster-small'>
                Just read the quirky movie description and pick the right answer.<br />
                More fun and exciting updates are coming soon!
            </div>
        </div>
    );
}