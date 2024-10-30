/*
    Oque é preciso ?
    - Pegar o valor do input quando o botão for clicado
    - ir ao servidor e trazer os produtos
    - colocar produtos na tela
    - criar grafico de preços
*/ 

const searchForm = document.querySelector('.search-form');
const productList = document.querySelector('.list-prod');
const priceChart = document.querySelector('.price-chart');

let myChart = '';

searchForm.addEventListener('submit', async function(event){
    event.preventDefault();//previne o comportamento padrão do form de reiniar a pagina
    const inputValue = event.target[0].value;

    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`);
    const products = (await data.json()).results.slice(0,30);
    displayItens(products);
    updatePriceChart(products);
})

function displayItens(products){
    //usar div auxiliar 
    console.log(products);
    productList.innerHTML = products.map( product => `
            <div class="product-card">
                <img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="product-price">Preço: ${product.price.toLocaleString('pt-br' , {style: "currency", currency: "BRL"})}</p>
                <p class="product-store">Vendedor: ${product.seller.nickname}</p>
            </div>
        `).join('');
}

function updatePriceChart(products){
    const  ctx = priceChart.getContext('2d');

    if(myChart){
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(product => product.title.substring(0,20) + '...'),
            datasets: [{
                label: 'Preço (R$)',
                data: products.map(product => product.price),
                backgroundColor: products.map(() => 'rgba(109, 215, 100, 0.55)'),
                borderColor: products.map(() => 'rgba(109, 215, 100, 1)'),
                borderWidth: 1
            }]
        },
        options: {
            reponsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value){
                            return value.toLocaleString('pt-br' , {style: "currency", currency: "BRL"});
                        }
                    },
                },
            },
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Comparador de Preços',
                        font: {
                            size: 18,
                        }
                   }
            },
        },
    });
}