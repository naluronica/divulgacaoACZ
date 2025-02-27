// Variáveis globais para armazenar os livros
let livrosWTT = [];
let livrosAMZ = [];

// Carrega livros do Wattpad
async function carregarLivrosWTT() {
  try {
    const response = await fetch('../livros/livros_wtt.json');
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    
    livrosWTT = await response.json();
  } catch (error) {
    console.error("Erro ao carregar os livros WTT:", error);
  }
}

// Carrega livros da Amazon
async function carregarLivrosAMZ() {
  try {
    const response = await fetch('../livros/livros_amz.json'); 
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    
    livrosAMZ = await response.json();
  } catch (error) {
    console.error("Erro ao carregar os livros AMZ:", error);
  }
}

// Função para normalizar: remove pontuação e converte para minúsculo
function normalizarTexto(texto) {
  // remove qualquer caractere que não seja letra, número ou espaço
  // e converte para minúsculo.
  return texto
    .toLowerCase()
    .replace(/[^\w\s]/g, ''); // remove pontuação e símbolos
}

// Renderiza os livros com base no que for digitado
function renderizarLivros() {
  const valorBusca = document.getElementById("search-bar").value;
  
  // Normaliza o termo buscado
  const buscaNormalizada = normalizarTexto(valorBusca);

  const containerWTT = document.getElementById("livros-container-wtt");
  const containerAMZ = document.getElementById("livros-container-amz");

  // Limpa o conteúdo atual
  containerWTT.innerHTML = "";
  containerAMZ.innerHTML = "";

  // Filtra e cria links para cada livro do Wattpad
  livrosWTT
    .filter(livro => {
      const tituloNormalizado = normalizarTexto(livro.titulo);
      const autorNormalizado = normalizarTexto(livro.autor);

      return (
        tituloNormalizado.includes(buscaNormalizada) ||
        autorNormalizado.includes(buscaNormalizada)
      );
    })
    .forEach(livro => {
      const botao = document.createElement("a");
      botao.classList.add("botao");
      botao.href = livro.link;
      botao.textContent = `${livro.titulo} - ${livro.autor} 🌷`;
      botao.target = "_blank";
      containerWTT.appendChild(botao);
    });

  // Filtra e cria links para cada livro da Amazon
  livrosAMZ
    .filter(livro => {
      const tituloNormalizado = normalizarTexto(livro.titulo);
      const autorNormalizado = normalizarTexto(livro.autor);

      return (
        tituloNormalizado.includes(buscaNormalizada) ||
        autorNormalizado.includes(buscaNormalizada)
      );
    })
    .forEach(livro => {
      const botao = document.createElement("a");
      botao.classList.add("botao");
      botao.href = livro.link;
      botao.textContent = `${livro.titulo} - ${livro.autor} 🌟`;
      botao.target = "_blank";
      containerAMZ.appendChild(botao);
    });
}

// Inicializa tudo
async function init() {
  await carregarLivrosWTT();
  await carregarLivrosAMZ();
  renderizarLivros();
}

// Adiciona o listener ao campo de busca
document.getElementById("search-bar").addEventListener("input", renderizarLivros);

// Quando o script carregar, chama init
init();
