
import './App.css';
import Crypto from './components/Crypto';
import { useState} from 'react';

function App() {

  const [time,setTime] = useState(0);

  function ChangeTimer(){
    let newTime=time+1;
    setTime(newTime);
  }

  setInterval(ChangeTimer, 30000);

  return (
    <div className="App">
      <Crypto timer={time}/>
    </div>
  );
}

export default App;
