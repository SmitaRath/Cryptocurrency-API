
import './App.css';
import Crypto from './components/Crypto';

function App() {

 

  setInterval(ChangeTimer, 30000);

  return (
    <div className="App">
      <Crypto/>
    </div>
  );
}

export default App;
