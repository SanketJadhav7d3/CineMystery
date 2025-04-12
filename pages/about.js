

import Page from '../components/page';
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

        Just a personal project.

      </div>
    </div>
  );
}