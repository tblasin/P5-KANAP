var url = "http://localhost:3000/api/products";

// Déclaration des fonctions
function loadApi() {
    fetch(url)
        .then((res) => {
            console.log(res);

            if (res.ok) {
                return res.json();
            }
        })
        .then((products) => {
            console.log(products);

            // afficher les produits dans la page html
            displayProducts(products);
        })
        .catch((error) => {
            console.log(error);
            alert("veuillez contacter l'administrateur du site !!");
        });      
}

function displayProducts(listProducts){
let html ="";
listProducts.forEach(element => {
    html+= `<a href="./product.html?id=${element._id}">
    <article>
      <img src="${element.imageUrl}" alt="${element.altTxt}">
      <h3 class="productName">${element.name}</h3>
      <p class="productDescription">${element.description}</p>
    </article>
  </a> `; 
});
    document.getElementById("items").innerHTML= html;
}

// Appel des fonctions
loadApi();


