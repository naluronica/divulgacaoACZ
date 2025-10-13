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

// Renderiza os livros agrupados por autor (padrão), com filtro por gênero
function renderizarLivros() {
  const valorBusca = document.getElementById("search-bar").value;
  const buscaNormalizada = normalizarTexto(valorBusca);
  const generoSelecionado = document.getElementById("genre-select").value;
  const containerAMZ = document.getElementById("livros-container-amz");
  containerAMZ.innerHTML = "";

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

  // Agrupa os livros por autor
  const livrosPorAutor = {};
  livrosFiltrados.forEach(livro => {
    const autor = livro.autor;
    if (!livrosPorAutor[autor]) {
      livrosPorAutor[autor] = [];
    }
    livrosPorAutor[autor].push(livro);
  });

  const autoresOrdenados = Object.keys(livrosPorAutor).sort((a, b) => a.localeCompare(b));
  autoresOrdenados.forEach(autor => {
    const tituloAutor = document.createElement("h3");
    tituloAutor.textContent = autor;
    tituloAutor.classList.add("tema");
    containerAMZ.appendChild(tituloAutor);

    livrosPorAutor[autor].sort((a, b) => a.titulo.localeCompare(b.titulo)).forEach(livro => {
      const botao = document.createElement("a");
      botao.classList.add("botao");
      botao.href = livro.link;
      botao.textContent = `${livro.titulo}`;
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
  popup?.classList.add("mostrar");
});

document.getElementById("fechar-popup")?.addEventListener("click", () => {
  const popup = document.getElementById("popup-container");
  const content = popup.querySelector(".popup-content");

  content.classList.add("fechar");
  popup.style.pointerEvents = "none";

  setTimeout(() => {
    popup.classList.remove("mostrar");
    content.classList.remove("fechar");
  }, 400);
});