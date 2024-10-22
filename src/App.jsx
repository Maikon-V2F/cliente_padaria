import { Routes, Route } from 'react-router-dom';
import User from './Pages/User'; // Página de usuário
import Login from './Pages/Login'; // Página de login

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/user/:id" element={<User />} /> {/* Rota para a página de usuário */}
    </Routes>
  );
}

export default App;
