import './App.css';
import Main from './component/Main';
import Header from './component/Header';
import Sidebar from './component/Sidebar';


function App() {
  return (
    <div className="App">
      <Sidebar />
      <Header />
      <Main />
    </div>
  );
}

export default App;
