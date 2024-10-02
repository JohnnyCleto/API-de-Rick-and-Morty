document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.getElementById('image-container');
    const favoritesContainer = document.getElementById('favorites-container');
    const characterSelect = document.getElementById('character-select');
    const filterBtn = document.getElementById('filter-btn');
    const limparBtn = document.getElementById('limpar-btn');
    const favoritosBtn = document.getElementById('favoritos-btn');
    const limparFavoritosBtn = document.getElementById('limpar-favoritos-btn');
  
    let characters = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let page = 1;
  
    // Função para buscar todos os personagens paginados
    async function buscarPersonagens(pageNum = 1) {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${pageNum}`);
      const data = await response.json();
  
      if (data.results) {
        characters.push(...data.results); // Adiciona personagens ao array
        displayCharacters(characters); // Exibe os personagens
  
        // Preencher o select com todos os personagens
        data.results.forEach(item => {
          const option = document.createElement('option');
          option.value = item.name;
          option.textContent = item.name;
          characterSelect.appendChild(option);
        });
      }
    }
  
    // Função para buscar e exibir o personagem selecionado
    async function buscarPersonagemSelecionado(name) {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${name}`);
      const data = await response.json();
  
      if (data.results) {
        displayCharacters(data.results);
      } else {
        imageContainer.innerHTML = '<p>Nenhum personagem encontrado.</p>';
      }
    }
  
    // Função para exibir personagens
    function displayCharacters(images) {
      imageContainer.innerHTML = ''; // Limpa o container
      if (images.length > 0) {
        images.forEach(character => {
          const item = document.createElement('div');
          item.classList.add('image-item');
          item.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <button class="favorite-btn">❤️</button>
            <div class="details">Nome: ${character.name}<br>Status: ${character.status}<br>Espécie: ${character.species}</div>
          `;
  
          // Evento para adicionar aos favoritos
          item.querySelector('.favorite-btn').onclick = (event) => {
            event.stopPropagation(); // Impede que o clique dispare o evento do item
            addToFavorites(character);
            alert(`${character.name} foi adicionado aos favoritos!`);
          };
  
          // Evento para exibir detalhes
          item.onclick = () => alert(`Detalhes do personagem:\nNome: ${character.name}\nStatus: ${character.status}\nEspécie: ${character.species}`);
  
          imageContainer.appendChild(item);
        });
      } else {
        imageContainer.innerHTML = '<p>Nenhum personagem encontrado.</p>';
      }
    }
  
    // Adiciona personagem aos favoritos
    function addToFavorites(character) {
      if (!favorites.some(fav => fav.id === character.id)) {
        favorites.push(character);
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
    }
  
    // Exibe os favoritos quando o botão é clicado
    favoritosBtn.onclick = () => {
      if (favorites.length > 0) {
        favoritesContainer.innerHTML = favorites.map(fav => `<img src="${fav.image}" alt="${fav.name}" class="favorite">`).join('');
      } else {
        favoritesContainer.innerHTML = '<p>Nenhum favorito encontrado.</p>';
      }
    };
  
    // Limpa os favoritos
    limparFavoritosBtn.onclick = () => {
      favorites = [];
      localStorage.removeItem('favorites');
      favoritesContainer.innerHTML = '<p>Nenhum favorito encontrado.</p>'; // Limpa a exibição de favoritos
    };
  
    // Filtra os personagens baseado na seleção do select
    filterBtn.onclick = () => {
      const selectedName = characterSelect.value;
      if (selectedName) {
        buscarPersonagemSelecionado(selectedName);
      } else {
        imageContainer.innerHTML = ''; // Limpa o container
        displayCharacters(characters); // Exibe todos os personagens novamente
      }
    };
  
    // Limpa o filtro e o select
    limparBtn.onclick = () => {
      characterSelect.value = ''; // Limpa a seleção
      imageContainer.innerHTML = ''; // Limpa o container
      displayCharacters(characters); // Exibe todos os personagens
    };
  
    // Carrega todos os personagens ao carregar a página
    buscarPersonagens();
  
    // Evento de scroll para carregar mais personagens ao chegar perto do fim da página
    window.onscroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !characterSelect.value) {
        page++;
        buscarPersonagens(page); // Carrega mais personagens
      }
    };
  });
  