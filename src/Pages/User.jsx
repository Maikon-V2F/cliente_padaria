import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Button, Modal, Box } from "@mui/material";
import { db } from "../firebaseConfig"; // Importe a instância do Firestore

function User() {
  const { id } = useParams(); // Obtém o ID do usuário da URL
  const [userData, setUserData] = useState(null); // Estado para armazenar os dados do usuário
  const [totalValue, setTotalValue] = useState(0); // Estado para armazenar o valor total das compras

  // setando modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "fixed", // Use fixed para que o modal fique fixo na tela
    top: 0,
    left: 0,
    width: "100vw", // Largura total da tela
    height: "100vh", // Altura total da tela
    bgcolor: "rgb(34, 104, 186)",
    border: "none", // Remover borda
    boxShadow: "none", // Remover sombra
    display: "flex", // Usar flexbox para centralizar o conteúdo
    flexDirection: "column", // Direção das colunas
    alignItems: "center", // Centralizar horizontalmente
    justifyContent: "center", // Centralizar verticalmente
    overflowY: "auto", // **Alterado:** Permite rolagem vertical
    color: "white", // Cor do texto
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", id); // Obtém a referência do documento do usuário
        const docSnap = await getDoc(docRef); // Obtém os dados do documento

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data); // Armazena os dados do usuário

          // Calcula o valor total das compras
          const purchasesTotal = data.purchase.reduce((acc, purchase) => {
            return acc + parseFloat(purchase.price || 0); // Soma os preços das compras
          }, 0);

          const creditsTotal = data.credits.reduce((acc, credit) => {
            return acc + parseFloat(credit.price || 0); // Soma os créditos
          }, 0);

          setTotalValue(purchasesTotal + creditsTotal); // Calcula o total
        } else {
          console.log("Usuário não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData(); // Chama a função para buscar os dados
  }, [id]);

  const formatCurrency = (value) => {
    // Garantir que o valor seja um número antes de formatar
    if (typeof value === "number" || typeof value === "string") {
      const numberValue = parseFloat(value);
      return isNaN(numberValue)
        ? "R$ 0.00"
        : `R$ ${(numberValue / 100).toFixed(2)}`;
    }
    return "R$ 0.00"; // Retornar um valor padrão se não for um número
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div
            style={{
              marginTop: "10em",
              marginBottom: "2em",
              textAlign: "center",
            }}
          >
            <Button variant="contained" onClick={handleClose}>
              Voltar
            </Button>
            <h2>Detalhes:</h2>

            {/* Exibindo os créditos */}
            {userData && userData.credits && userData.credits.length > 0 ? (
              <div>
                {userData.credits.map((credit, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "16px",
                      backgroundColor: "black",
                      width: "15em",
                      borderRadius: "10px",
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      color: "green",
                    }}
                  >
                    <p>Crédito: {formatCurrency(credit.price)}</p>
                    <p>Data: {credit.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p></p>
            )}

            {/* Verifica se há compras registradas e exibe os dados */}
            {userData && userData.purchase && userData.purchase.length > 0 ? (
              userData.purchase.map((purchase, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "16px",
                    backgroundColor: "black",
                    width: "15em",
                    borderRadius: "10px",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <p>Valor: {formatCurrency(purchase.price)}</p>
                  <p>Data: {purchase.date}</p>
                </div>
              ))
            ) : (
              <p>Nenhuma compra registrada.</p>
            )}
          </div>
        </Box>
      </Modal>

      {userData ? (
        <>
          <h1>{userData.name}</h1> {/* Nome do usuário */}
          <h3>Valor total das compras:</h3>
          <h3>{formatCurrency(totalValue || 0)}</h3>
          {/* Formatação com 2 casas decimais */}
        </>
      ) : (
        <h3>Carregando...</h3> // Exibe mensagem enquanto os dados estão sendo carregados
      )}

      <Button variant="contained" onClick={handleOpen}>
        Detalhes
      </Button>
    </div>
  );
}

export default User;
