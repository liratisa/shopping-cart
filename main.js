//armazena uma lista com cada link de cada produto
const carts = document.querySelectorAll(".add-cart");

//cria um objeto com as informações de cada produto: nome, tag, preço e se já está no carrinho
const products = [
  {
    name: "Blusa branca",
    tag: "blusa",
    price: 30,
    inCart: 0,
  },
  {
    name: "Fone de ouvido",
    tag: "fone-de-ouvido",
    price: 120,
    inCart: 0,
  },
  {
    name: "Garrafa preta",
    tag: "garrafa-preta",
    price: 55,
    inCart: 0,
  },
  {
    name: "Tênis branco",
    tag: "tenis-branco",
    price: 180,
    inCart: 0,
  },
  {
    name: "Touca preta",
    tag: "touca-preta",
    price: 25,
    inCart: 0,
  },
];

// como a variável carts retorna um array-like, o loop for vai iterar sobre cada index (ou cada produto) e, toda vez que for clicado, vai chamar a função cartNumbers
for (let i = 0; i < carts.length; i++) {
  carts[i].addEventListener("click", () => {
    cartNumbers(products[i]);
    totalCost(products[i]);
  });
}

// verifica se o localStorage possui algum valor. se tiver, atualiza o span ao lado do carrinho
function onLoadCartNumbers() {
  const productNumbers = parseInt(localStorage.getItem("cartNumbers")); //numero de produtos que estao no localStorage

  if (productNumbers) {
    document.querySelector(".cart span").textContent = productNumbers; //adiciona
  }
}

// primeiro, armazena a quantidade de vezes que o link foi clicado
// obs: no primeiro clique, retorna NaN
// depois, checa se productNumbers é true
// se for, vai setar uma chave no localStorage chamada cartNumbers
// em seguida, vai pegar o número armazenado em productNumbers e adicionar 1 (e isso é add à variável cartNumbers)
// se não, como no caso do primeiro clique, add 1 na variável cartNumbers
// além disso, tb adiciona o valor no span ao lado do carrinho na nav (nas duas condicionais)
// por último, chama a função setItems
function cartNumbers(product) {
  const productNumbers = parseInt(localStorage.getItem("cartNumbers"));

  if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart span").textContent = productNumbers + 1; //adiciona
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart span").textContent = 1;
  }

  setItems(product);
}

// cria uma variável do localStorage que armazena as informações do produto clicado (em json)
// depois, transforma esse json em um obj javascript
// verifica se essas informações são diferente de null. isso significa que não foi o primeiro produto clicado
// se forem, faz mais uma verificação. dessa vez, verifica se a tag é undefined. se sim, 'puxa' o cartItems com o primeiro produto escolhido e add as infos dos demais produtos
// se for igual a null, add +1 no inCart
function setItems(product) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems); //transforma em um obj javascript

  if (cartItems != null) {
    if (cartItems[product.tag] == undefined) {
      //add +1
      cartItems = {
        ...cartItems,
        [product.tag]: product,
      };
    }
    cartItems[product.tag].inCart += 1; //add +1 se for diferente de null
  } else {
    //clicando pela primeira vez; cartItems == null
    product.inCart = 1;

    cartItems = {
      [product.tag]: product, //nome do negocio vai ser o msm da tag
    };
  }

  // cria a key productsInCart no localStorage em formato json
  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

//função para calcular o preço total da compra
// verifica se o preço total é diferente de null, ou seja, a partir da segunda vez
// se for, vai pegar o valor anterior da primeira compra (product.price) e add o cartCost
function totalCost(product) {
  let cartCost = localStorage.getItem("totalCost");

  if (cartCost != null) {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost + product.price);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem("productsInCart");
  let cartCost = parseInt(localStorage.getItem("totalCost"));
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".products");
  let costContainer = document.querySelector(".shipping-area");
  let shippingValue = 15;

  if (cartItems && productContainer) {
    productContainer.innerHTML = "";
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
      
      <div class="product-grid">   
      <div>
      <img src="img/${item.tag}.jpg">   
      <p>${item.name}</p>
      </div>   
      
      <div class="price">R$${item.price},00</div>
      
      <div class="in-cart">${item.inCart}</div>
      
      <div class="total">R$${item.inCart * item.price},00</div>      
      </div>      
      `;

      costContainer.innerHTML = `
      <div>
      
      <p><span>Valor da compra:</span> R$${cartCost},00</p>
      <p><span class="shipping">Frete fixo:</span> R$${shippingValue},00</p> 
      </div>  
      
      <p><span>Valor final:</span> R$${shippingValue + cartCost},00</p>

      <button class="btn">Pagar agora</button>
    `;
    });
  }
}

//vai executar a função toda vez que a pag for recarregada
onLoadCartNumbers();
displayCart();
