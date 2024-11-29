import Header from './components/Header'
import Sidebar from './components/Sidebar';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css'

function App() {
  return (
    <div className="app">
      <Header />
      <Sidebar/>
    </div>
  );
}

export default App
