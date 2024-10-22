import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "./Styles/Login.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import logo from "../assets/logo.png";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuração Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function Login() {
  const [handleInput, setHandleInput] = useState("");
  const [handleInput2, setHandleInput2] = useState("");
  const navigate = useNavigate(); // Inicializa o useNavigate

  async function handleLogin() {
    const name = handleInput;
    const password = handleInput2;

    const q = query(collection(db, "users"), where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();

      if (userData.password === password) {
        navigate(`/user/${querySnapshot.docs[0].id}`); // Redireciona para a página do usuário com o ID
      } else {
        alert("Senha ou senha  incorretos.");
      }
    } else {
      alert("Usuário ou senha  incorretos.");
    }
  }

  return (
    <div className="container">
      <img className="logo" src={logo} alt="logo" />
      <h2 style={{ marginTop: "0" }}>Entre:</h2>

      <TextField
        id="outlined-basic"
        label="Nome"
        variant="outlined"
        type="text"
        value={handleInput}
        onChange={(e) => setHandleInput(e.target.value)}
        style={{ marginBottom: "2em" }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white", // Cor da borda
            },
            "&:hover fieldset": {
              borderColor: "white", // Cor da borda ao passar o mouse
            },
            "&.Mui-focused fieldset": {
              borderColor: "white", // Cor da borda quando focado
            },
          },
          "& .MuiInputBase-input": {
            color: "white", // Cor do texto
          },
        }}
        InputLabelProps={{
          style: {
            color: "white", // Cor do rótulo
          },
        }}
      />
      <TextField
        id="outlined-basic"
        label="Senha"
        variant="outlined"
        type="password"
        value={handleInput2}
        onChange={(e) => setHandleInput2(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white", // Cor da borda
            },
            "&:hover fieldset": {
              borderColor: "white", // Cor da borda ao passar o mouse
            },
            "&.Mui-focused fieldset": {
              borderColor: "white", // Cor da borda quando focado
            },
          },
          "& .MuiInputBase-input": {
            color: "white", // Cor do texto
          },
        }}
        InputLabelProps={{
          style: {
            color: "white", // Cor do rótulo
          },
        }}
      />

      <Button
        style={{ marginTop: "2em" }}
        variant="contained"
        onClick={() => handleLogin()}
      >
        Entrar
      </Button>
    </div>
  );
}

export default Login;
