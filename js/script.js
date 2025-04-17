// Array global de livros
let livrosAMZ = [];

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

// Normaliza texto (título/autor) para busca
function normalizarTexto(texto) {
  return texto.toLowerCase().replace(/[^\w\s]/g, '');
}

// Preenche o dropdown com gêneros
function preencherDropdownGeneros() {
  const generoSelect = document.getElementById("genre-select");
  const todosGeneros = livrosAMZ.flatMap(livro => livro.genero);
  const freq = {};
  todosGeneros.forEach(g => {
    freq[g] = (freq[g] || 0) + 1;
  });
  const generosOrdenados = Object.keys(freq).sort((a, b) => a.localeCompare(b));
  generoSelect.innerHTML = '<option value="">Todos os gêneros</option>';
  generosOrdenados.forEach(genero => {
    const option = document.createElement('option');
    option.value = genero;
    option.textContent = `${genero} [${freq[genero]}]`;
    generoSelect.appendChild(option);
  });
}

// Renderiza os livros agrupados por gênero e ordenados alfabeticamente pelo título
function renderizarLivros() {
  const valorBusca = document.getElementById("search-bar").value;
  const buscaNormalizada = normalizarTexto(valorBusca);
  const generoSelecionado = document.getElementById("genre-select").value;
  const containerAMZ = document.getElementById("livros-container-amz");
  containerAMZ.innerHTML = "";

  // Filtra os livros com base na busca e no gênero selecionado
  const livrosFiltrados = livrosAMZ.filter(livro => {
    const tituloNormalizado = normalizarTexto(livro.titulo);
    const autorNormalizado = normalizarTexto(livro.autor);
    const combinaBusca =
      tituloNormalizado.includes(buscaNormalizada) ||
      autorNormalizado.includes(buscaNormalizada);
    const combinaGenero =
      !generoSelecionado || (Array.isArray(livro.genero) && livro.genero.includes(generoSelecionado));
    return combinaBusca && combinaGenero;
  });

  // Agrupa os livros por gênero
  const livrosPorGenero = {};
  livrosFiltrados.forEach(livro => {
    livro.genero.forEach(g => {
      if (!generoSelecionado || g === generoSelecionado) {
        if (!livrosPorGenero[g]) {
          livrosPorGenero[g] = [];
        }
        livrosPorGenero[g].push(livro);
      }
    });
  });

  // Ordena os gêneros alfabeticamente
  const generosOrdenados = Object.keys(livrosPorGenero).sort((a, b) => a.localeCompare(b));
  generosOrdenados.forEach(genero => {
    // Ordena os livros dentro do gênero em ordem alfabética pelo título
    livrosPorGenero[genero].sort((a, b) => a.titulo.localeCompare(b.titulo));
    
    const tituloGenero = document.createElement("h3");
    tituloGenero.textContent = genero;
    tituloGenero.classList.add("tema");
    containerAMZ.appendChild(tituloGenero);

    livrosPorGenero[genero].forEach(livro => {
      const botao = document.createElement("a");
      botao.classList.add("botao");
      botao.href = livro.link;
      botao.textContent = `${livro.titulo} - ${livro.autor} 💫`;
      botao.target = "_blank";
      containerAMZ.appendChild(botao);
    });
  });
}

// Inicializa tudo
async function init() {
  await carregarLivrosAMZ();
  preencherDropdownGeneros();
  renderizarLivros();
}

document.getElementById("search-bar").addEventListener("input", renderizarLivros);
document.getElementById("genre-select").addEventListener("change", renderizarLivros);

init();

// === POP-UP (mobile-only com animação) ===
window.addEventListener("load", () => {
  const popup = document.getElementById("popup-container");
  const isMobile = window.matchMedia("(max-width: 649px)").matches;

  if (popup && isMobile) {
    popup.classList.add("mostrar");
  }
});

const fecharPopup = document.getElementById("fechar-popup");
if (fecharPopup) {
  fecharPopup.addEventListener("click", () => {
    const popup = document.getElementById("popup-container");
    const content = popup.querySelector(".popup-content");

    content.classList.add("fechar");
    popup.style.pointerEvents = "none";

    setTimeout(() => {
      popup.classList.remove("mostrar");
      content.classList.remove("fechar");
    }, 400);
  });
}
