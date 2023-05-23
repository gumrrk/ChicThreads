let cartCount = 0
let cartValue = 0

const reload = document.querySelector("#brand");
reload.addEventListener("click", function () {

    location.reload();
});

function checkCart() {
    const cartEmpty = document.querySelector("#cart-empty");
    const cartList = document.querySelector("#cart-list")
    if (cartCount == 0) {
        cartEmpty.style.display = 'flex';
        cartList.style.display = 'none';
    } else if (cartCount != 0) {
        cartEmpty.style.display = 'none';
        cartList.style.display = 'flex';
    }
}

function clearArray() {
    const lista = document.getElementById('ul-cards');
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
}

function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchValue = searchInput.value.toLowerCase();
    const filteredData = data.filter((product) => {
        return product.nameItem.toLowerCase().includes(searchValue);
    });
    if (searchValue === '') {
        clearArray()
        renderProductCards(data);
    } else {
        clearArray()
        renderProductCards(filteredData);
    }
}

function createInput() {
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            handleSearch();
        }
    });
  
    const searchBtn = document.querySelector('.search-button');
    searchBtn.addEventListener('click', handleSearch);

    searchBtn.addEventListener('mousedown', () => {
        searchBtn.style.backgroundColor = '#37268C';
        searchBtn.style.border = '2px solid #2e245e';
    });
    searchBtn.addEventListener('mouseup', () => {
        searchBtn.style.backgroundColor = '#2e245e';
        searchBtn.style.border = 'none';
    });
}

function createHeaderButtons() {
    const ulHeader = document.querySelector(`#header-menu`);
    const tags = [];
    const button = document.createElement('button');
    button.textContent = 'Todos';
    button.classList.add('header-button')
    ulHeader.appendChild(button);
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        for (let j = 0; j < item.tag.length; j++) {
            const tag = item.tag[j];
            if (!tags.includes(tag)) {
                tags.push(tag);
                const button = document.createElement('button');
                button.textContent = tag;
                button.classList.add('header-button')
                ulHeader.appendChild(button);
            }
            
            const headerButtons = document.querySelectorAll('.header-button');
            headerButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const category = button.textContent;

                    const filteredData = category === 'Todos'
                        ? data
                        : data.filter(item => item.tag.includes(category));
                    clearArray();
                    renderProductCards(filteredData);
                });
            });
        }
    }
}

function findProduct(id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            return data[i];
        }
    }
}

function renderProductCards(array) {
    let listProducts = document.querySelector('#ul-cards')
    for (let i = 0; i < array.length; i++) {
        let element = array[i];

        let li = document.createElement('li')

        let div = document.createElement('div');
        div.classList.add('div-card')

        let div1 = document.createElement('div');
        div1.classList.add('div-card-top')
        let img = document.createElement('img');

        let div2 = document.createElement('div');
        div2.classList.add('div-card-bottom')
        let small = document.createElement('small');
        let h2 = document.createElement('h2');
        let p = document.createElement('p');
        let h3 = document.createElement('h3');
        let button = document.createElement('button');

        li.id = `id_${element.id}`;
        img.src = element.img;
        small.innerHTML = `${element.tag}`;
        h2.innerHTML = `${element.nameItem}`;
        p.innerHTML = `${element.description}`;
        h3.innerHTML = `R$ ${element.value.toFixed(2)}`;
        button.innerHTML = `${element.addCart}`
        button.id = `p_${element.id}`
       
        button.addEventListener('click', function (e) {
            let idElement = e.target.id;
            let id = +idElement.substring(2);
            let product = findProduct(id);

            let elementCart = createCartCard(product);

            document.querySelector('#cart-list').appendChild(elementCart);

            cartCount++;
            document.querySelector('#total-amount').innerHTML = `${cartCount}`

            let price = +(h3.textContent.substring(3))
            cartValue += price;
            document.querySelector('#total-price').innerHTML = `R$ ${cartValue.toFixed(2)}`

            checkCart()
        })

        
        div2.append(small, h2, p, h3, button)
        div1.appendChild(img)
        div.append(div1, div2)
        li.appendChild(div)
        listProducts.appendChild(li)
    }
}

function createCartCard(element) {
    let li = document.createElement('li');
    let div = document.createElement('div')
    let div1 = document.createElement('div')
    let img = document.createElement('img')
    let div2 = document.createElement('div')
    let h2 = document.createElement('h2')
    let h3 = document.createElement('h3')
    let button = document.createElement('button')

    li.id = `l_${element.id}`;
    div.classList.add('div-cart')
    div1.classList.add('div-cart-left')
    div2.classList.add('div-cart-right')
    img.src = element.img;
    h2.innerHTML = `${element.nameItem}`;
    h3.innerHTML = `R$ ${element.value.toFixed(2)}`;
    button.innerHTML = `Remover produto`
    button.id = `r_${element.id}`
    
    div2.append(h2, h3, button)
    div1.appendChild(img)
    div.append(div1, div2)
    li.appendChild(div)
  
    button.addEventListener('click', function (event) {
        let listPath = event.composedPath();
        listPath[3].remove();
        cartCount--;
        document.querySelector('#total-amount').innerHTML = `${cartCount}`;
        let price = +(h3.textContent.substring(3));
        cartValue -= price;

        if (Math.abs(cartValue) < 1e-10) {
            cartValue = 0;
        }
        document.querySelector('#total-price').innerHTML = `R$ ${cartValue.toFixed(2)}`
        checkCart()
    })
  
    return li;
}

const removebutton = document.querySelector('#remove-cart-button');
removebutton.addEventListener('click', function () {
    if (cartCount == 0) {
        alert('O carrinho está vazio.')
    }
    else if (confirm('Deseja mesmo limpar o carrinho?')) {
        let lista = document.getElementById('cart-list');
        lista.innerHTML = '<ul id="cart-list"></ul>';
        cartCount = 0;
        document.querySelector('#total-amount').innerHTML = `${cartCount}`;
        cartValue = 0;
        document.querySelector('#total-price').innerHTML = `R$ ${cartValue.toFixed(2)}`;
        checkCart()
    }
})

function checkout() {
    const buyButton = document.querySelector('#buy-button');
    buyButton.addEventListener('click', function () {
        if (cartCount == 0) {
            alert('O carrinho está vazio.')
        } else if (confirm(`Deseja finalizar sua compra no valor de R$ ${cartValue.toFixed(2)}?`)) {
            alert('Obrigado pela sua compra!')
            let lista = document.getElementById('cart-list');
            lista.innerHTML = '<ul id="cart-list"></ul>';
            cartCount = 0;
            document.querySelector('#total-amount').innerHTML = `${cartCount}`;
            cartValue = 0;
            document.querySelector('#total-price').innerHTML = `R$ ${cartValue.toFixed(2)}`;
            checkCart();
            renderProductCards(data);
        }
    });
}

function toggleTheme() {
    const themeStyle = document.getElementById("theme-style");
    if (themeStyle.getAttribute("href") === "./style/style.css") {
        themeStyle.setAttribute("href", "./style/dark-theme.css");
        document.getElementById("dark-button").innerHTML = "☀️";
    } else {
        themeStyle.setAttribute("href", "./style/style.css");
        document.getElementById("dark-button").innerHTML = "🌙";
    }
}

checkout();
createInput();
createHeaderButtons();
renderProductCards(data);