import './App.css';
import AuthPage from './components/auth';
import Messenger from './components/messenger';
import {Routes, Route} from "react-router-dom"
import Context from './context/context';

function App() {
  return (
    <Context>
      <div className="App">
        <Routes>
          <Route path='/' element={<AuthPage/>}/>
          <Route path='/messenger' element={<Messenger/>}/>
        </Routes>
      </div>
    </Context>
  );
}

export default App;
