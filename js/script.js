// Array global de livros
let livrosAMZ = [];

// Carrega livros da Amazon
async function carregarLivrosAMZ() {
  try {
    // Ajuste o caminho do seu JSON se estiver em outro lugar
    const response = await fetch('../livros/livros_amz.json');
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    
    livrosAMZ = await response.json();
  } catch (error) {
    console.error("Erro ao carregar os livros AMZ:", error);
  }
}

// Normaliza texto (título/autor) para busca
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .replace(/[^\w\s]/g, '');
}

// Preenche o dropdown com gêneros em ordem alfabética + contagem de livros
function preencherDropdownGeneros() {
  const generoSelect = document.getElementById("genre-select");

  // 1. Coleta todos os gêneros (achatando arrays de cada livro)
  const todosGeneros = livrosAMZ.flatMap(livro => livro.genero);

  // 2. Cria um mapa de frequências. Ex.: { "Dark Romance": 2, "Mafia": 1, ... }
  const freq = {};
  todosGeneros.forEach(g => {
    freq[g] = (freq[g] || 0) + 1;
  });

  // 3. Ordena os gêneros em ordem alfabética
  const generosOrdenados = Object.keys(freq).sort((a, b) => a.localeCompare(b));

  // 4. (Opcional) Zera o dropdown e insere "Todos os gêneros"
  generoSelect.innerHTML = '<option value="">Todos os gêneros</option>';

  // 5. Cria <option> para cada gênero com o nome + quantidade
  generosOrdenados.forEach(genero => {
    const option = document.createElement('option');
    // O value deve ser só o nome do gênero
    option.value = genero;
    // O texto mostra nome + contagem, ex.: "Dark Romance (3)"
    option.textContent = `${genero} [${freq[genero]}]`;
    generoSelect.appendChild(option);
  });
}

// Renderiza (filtra) livros de acordo com a busca e o gênero selecionado
function renderizarLivros() {
  const valorBusca = document.getElementById("search-bar").value;
  const buscaNormalizada = normalizarTexto(valorBusca);

  const generoSelecionado = document.getElementById("genre-select").value;
  const containerAMZ = document.getElementById("livros-container-amz");

  // Limpa antes de exibir
  containerAMZ.innerHTML = "";

  // Filtro principal
  const livrosFiltrados = livrosAMZ.filter(livro => {
    // Normaliza título e autor
    const tituloNormalizado = normalizarTexto(livro.titulo);
    const autorNormalizado = normalizarTexto(livro.autor);

    // Verifica se corresponde à busca
    const combinaBusca =
      tituloNormalizado.includes(buscaNormalizada) ||
      autorNormalizado.includes(buscaNormalizada);

    // Se nenhum gênero estiver selecionado, mostra todos;
    // senão, verifica se o array de gêneros do livro inclui o gênero selecionado
    const combinaGenero =
      !generoSelecionado || (Array.isArray(livro.genero) && livro.genero.includes(generoSelecionado));

    return combinaBusca && combinaGenero;
  });

  // Cria um link/botão para cada livro filtrado
  livrosFiltrados.forEach(livro => {
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
  await carregarLivrosAMZ();
  preencherDropdownGeneros(); 
  renderizarLivros();
}

// Escuta mudanças no campo de busca e no dropdown
document.getElementById("search-bar").addEventListener("input", renderizarLivros);
document.getElementById("genre-select").addEventListener("change", renderizarLivros);

// Quando carrega o script, chama init()
init();
