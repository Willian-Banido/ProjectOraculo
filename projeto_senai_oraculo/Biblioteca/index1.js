async function fetchBooks() {
    try {
        const response = await fetch("https://api.github.com/repos/Vinis-San/books/contents");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const bookListContainer = document.getElementById('bookList');
        bookListContainer.innerHTML = ""; // Limpa o conteúdo anterior

        data.forEach(folder => {
            if (folder.type === "dir") {
                const folderCard = document.createElement("div");
                folderCard.classList.add("ag-courses_item");
        
                // Link que envolve todo o card
                const folderLink = document.createElement("a");
                folderLink.href = "#"; // Coloque a URL ou lógica para abrir a pasta aqui
                folderLink.classList.add("ag-courses-item_link");
                
                // Adiciona o nome da pasta como conteúdo do link
                folderLink.textContent = folder.name;
        
                folderCard.appendChild(folderLink);
                bookListContainer.appendChild(folderCard);
        
                // Adiciona o evento de clique no link
                folderLink.addEventListener("click", function() {
                    showBooks(folder.path); // Chama a função showBooks
                });
            }
        });
    } catch (error) {
        console.error("Erro ao carregar pastas:", error);
    }
}

// Função para mostrar livros da pasta selecionada
async function showBooks(folderPath) {
    console.log(`Acessando a pasta: ${folderPath}`);
    try {
        const response = await fetch(`https://api.github.com/repos/Vinis-San/books/contents/${folderPath}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const modal = document.getElementById("modal");
        const bookListModal = document.getElementById("book-list-modal");
        const modalTitle = document.getElementById("modal-title");

        modalTitle.textContent = `${folderPath.split('/').pop()}`;
        bookListModal.innerHTML = ""; // Limpa o conteúdo anterior

        data.forEach(book => {
            if (book.type === "file" && book.name.endsWith('.pdf')) {
                const listItem = document.createElement("li");
                const bookNameWithoutExtension = book.name.replace('.pdf', '');

                listItem.innerHTML = `
                <h3>${bookNameWithoutExtension}</h3>
                <button class="download-btn" onclick="window.open('${book.download_url}', '_blank')">
                    <span class="text">Download</span>
                    <div class="svg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-download" viewBox="0 0 16 16"> 
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path> 
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path> 
                        </svg>
                    </div>
                </button>
                `;
                bookListModal.appendChild(listItem);
            }
        });

        modal.style.display = "block"; // Abre o modal
        filterBooks(); // Chama a função de filtro após adicionar os livros
    } catch (error) {
        console.error("Erro ao carregar livros:", error);
    }
}

// Fecha o modal
document.querySelector(".close-button").onclick = function() {
    document.getElementById("modal").style.display = "none"; // Fecha o modal
}

// Troca entre modo claro e escuro
document.getElementById("theme-switch").addEventListener("change", function() {
    document.body.classList.toggle("dark-mode");
});

// Adiciona o evento de input ao campo de busca
document.getElementById('searchInput').addEventListener('input', filterBooks);

// Carrega as pastas ao iniciar
fetchBooks();

// Função para filtrar as pastas de acordo com o texto de busca
function filterBooks() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const folders = document.querySelectorAll(".ag-courses_item");

    folders.forEach(folder => {
        const folderName = folder.textContent.toLowerCase();
        if (folderName.includes(searchTerm)) {
            folder.style.display = "block"; // Exibe se corresponder à busca
        } else {
            folder.style.display = "none"; // Oculta se não corresponder
        }
    });
}

// Adiciona o evento de input ao campo de busca
document.getElementById('searchInput').addEventListener('input', filterBooks);

// Carrega as pastas ao iniciar
fetchBooks();
