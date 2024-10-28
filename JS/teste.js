// Definindo a URL do endpoint com a user_content_key como parâmetro de consulta
const userContentKey = '-1_vHYTIGzA_4UEeV4O4H5dM6xQJbC6PsOk7sWngBIF7XdLRpI_7F3fwz4_WzlL9xJEeCmdi2z7IRIYLUwt0Xe5-Jx7soD_Om5_BxDlH2jW0nuo2oDemN9CCS2h10ox_nRPgeZU6HP8fH3Tnx3L6_C2xvqvtKfXW0O6PCLm9nM_ryfhECjZEnHSVN4wfeSzuga3kQ6WZsYYzEFc3LKWX6LP7oBC5WRUarswSRXJ2WehjZY6Zmxa2iA';
const endpointUrl = `https://script.google.com/macros/s/AKfycbyFKcQYIS865TzBzoJqKYC9tkAlZehX3PzVhYVD2wHB/dev?user_content_key=${encodeURIComponent(userContentKey)}`;

// Fazendo a requisição para o endpoint
fetch(endpointUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Pegando a URL da imagem da resposta
        const imageData = data.find(item => item.name === 'logooraculo.png');
        
        if (imageData) {
            const imageUrl = imageData.url.replace('/view?usp=drivesdk', '/preview');
            console.log('Logo URL:', imageUrl);

            // Exibindo a imagem no HTML (opcional)
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            document.body.appendChild(imgElement);
        } else {
            console.log('Imagem não encontrada.');
        }
    })
    .catch(error => {
        console.error('Houve um problema com a requisição:', error);
    });
