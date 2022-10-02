// Récupération de la chaîne de requête dans l'Url :

const queryString_url = window.location.search;
console.log(queryString_url);// => renvoi la partie params avec le ?

// Pour extraire l'id :

const urlSearchParams = new URLSearchParams(queryString_url);
console.log(urlSearchParams);// renvoi les params sans le ?
const id = urlSearchParams.get("id"); // recuperer la valeur du param qui s'appelle id
console.log(id);

var urlProduct = "http://localhost:3000/api/products/" + id;

// Déclaration des fonctions :

function loadApi() {
    fetch(urlProduct)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((product) => {
            console.log(product);
            displayProduct(product);
        })
        .catch((error) => {
            console.log("erreur 404");
        });
}

// fonction d'affichage du produit de l'api

function displayProduct(element) {


    document.querySelector(".item__img").innerHTML = `<img src="${element.imageUrl}" alt="${element.altTxt}">`;
    document.getElementById("title").textContent = `${element.name}`;
    document.getElementById("price").appendChild(document.createTextNode(`${element.price}`));
    document.getElementById("description").textContent = `${element.description}`;


    var colors = document.getElementById('colors');
    element.colors.forEach(color => {
        option = document.createElement('option');
        text = document.createTextNode(color);
        option.appendChild(text);
        option.value = color;

        colors.appendChild(option);
    });

    document.getElementById("quantity").addEventListener('change', function (event) {
        event.stopPropagation();
        event.preventDefault();
        controleQuantite(this.value);
    });


    document.getElementById('addToCart').addEventListener('click', function (event) {
        event.stopPropagation();
        event.preventDefault();
        let validQte = controleQuantite(document.getElementById("quantity").value);
        let validColor = controleColor(document.getElementById("colors").value);

        if (validQte && validColor) {
            // Ajouter l'element au panier
            // initialiser un tableau 
            let table = getproductsArray();
            // inserer mon produit dans le tableau 
            let product = {
                id: id, // id du produit choisi
                color: document.getElementById("colors").value,// couleur selectionnée par le user
                quantite: parseInt(document.getElementById("quantity").value)// quantité specifiée par le user
            };
            addElement(product, table); // Ajouter l'element dans le panier 
            // envoyer le tableau dans mon localstorage 
            updateLocalStorage(table);
        }
    });
}
function addElement(product, table) {

    let elementExist = false;
    table.forEach(element => {
        // si l'element existe  on va incrementer la quantité
        if (element.id == product.id && element.color == product.color) {
            elementExist= true;
            let total = element.quantite + product.quantite;
            if (controleQuantite("" + total)) {
                element.quantite = total;              
            }
        }

    });
    // si l'element n'a pas été ajouté en terme de quantité ,  on va ajouter l'element dans le tableau
    if (!elementExist) {
        table.push(product);
    }
}

// Controle quantité et couleur :

function controleQuantite(quantite) {
    let qte = parseInt(quantite);
    if (qte > 100 || qte < 1) {
        alert("Veuillez saisir une quantite entre 1 et 100 !");
        return false;
    }
    return true;
}

function controleColor(color) {

    if (color.trim() == "") {
        alert("Veuillez choisir une couleur valide de la liste déroulante !");
        return false;
    }
    return true;
}


// Appel des fonctions
loadApi();


