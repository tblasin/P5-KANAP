

// récupérer le localstorage dans un tableau 
let tableauLocalStorage = getproductsArray();
let tableauArticles =[];

collectArticle();

// parcourir le tableau 
function collectArticle(){
   
  let compteur =0;
    tableauLocalStorage.forEach(element => {

      
        // appeler fetch par id: chercher les details du produit dans l'api
        fetch(`http://localhost:3000/api/products/${element.id}`)
        .then((res) => res.json())
        .then((product) => {
            const selectedProduct = {
                ...product,
                quantite: element.quantite,
                color: element.color
            }
            tableauArticles.push(selectedProduct);
             // remplir l'interface.
             compteur++;
             if(compteur === tableauLocalStorage.length ) {
              displayProduct();
             }
               
        });       
    })        
}

//Récupération des produits par leurs id sur l'API
function displayProduct(){

  for (i = 0 ; i < tableauArticles.length ; i++) {
   
    document.querySelector("#cart__items").innerHTML += 
    
      `<article class="cart__item" data-id="${tableauArticles[i]._id}" data-color="${tableauArticles[i].color}">
      <div class="cart__item__img">
        <img src="${tableauArticles[i].imageUrl}" alt="${tableauArticles[i].altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${tableauArticles[i].name}</h2>
          <p>couleur : ${tableauArticles[i].color}</p>
          <p>${tableauArticles[i].price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : ${tableauArticles[i].price * tableauArticles[i].quantite} €</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${tableauArticles[i].quantite}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
 
  }

  calculTotaux();
  changeQuantity();
  removeFromTableauArticles();
}

  // Modification de la quantité d'un article du panier avec l'input
  function changeQuantity(){
    let changeQuantity = document.querySelectorAll(".itemQuantity");
        changeQuantity.forEach((element) => {
            // On écoute l'element lorsqu'il y a un changement
            element.addEventListener("change", (event) => {
                event.preventDefault();

                let article = element.closest(".cart__item");
                console.log(article);
                
                let id = article.dataset.id;
                let color = article.dataset.color;
                console.log("id:"+id +" | color:"+color);
                
                let newQuantity = parseInt(element.value);
                console.log("newQuantity: "+ newQuantity);
              
              // voir ou tester la saisie d'une bonne quantité ( entre 1 et 100 )
              if (newQuantity == null || newQuantity < 1 || newQuantity > 100){
                //si c'est pas valide : on affiche une alerte 
                alert("Veuillez renseigner une quantité comprise entre 1 et 100")
              }
              else {
                // quantité bonne : donc il faut mettre à jour la quantité dans le total et dans le localStorage 
                editQuantite(id, color, newQuantity);
              }
            });          
        });  
  };

  // Methode find qui cherche un element dans un tableau par un critere et qui renvoi sa position 
  function editQuantite(id, color, newQte){
    
    let foundProductIntableauArticles = tableauArticles.find(p => p._id == id && p.color == color);
    let foundProductIntableauLocalStorage = tableauLocalStorage.find(p => p.id == id && p.color == color);
    // si c'est valide => proceder à la modification de la quantité dans le localStorage 
    if (foundProductIntableauArticles != undefined && foundProductIntableauLocalStorage != undefined){
      foundProductIntableauArticles.quantite = newQte;
      foundProductIntableauLocalStorage.quantite = newQte;
    // modifier la quantité de l'element de cette position
    }
    updateLocalStorage(tableauLocalStorage);
    calculTotaux();
  }

  // Mettre à jour les totaux ( quantité & price )
  function calculTotaux(){
   
    let totQte = 0;
    let totalPrice = 0;
    for(let product of tableauArticles){
      totQte += product.quantite;
      totalPrice += product.quantite * product.price;
    }
    
    // Mettre les totaux calculés sur le html 
    document.getElementById("totalQuantity").textContent=totQte;
    document.getElementById("totalPrice").textContent=totalPrice;

  }
  
  // Fonction pour supprimer les produits du panier 
  function removeFromTableauArticles() {
    
    // Cibler les boutons supprimer
    let deleteBtn = document.querySelectorAll(".deleteItem");
       console.log(deleteBtn);
       if (deleteBtn.length != 0){
        for (let i=0;i<deleteBtn.length;i++){
    
          // Pour chaque bouton, au click
              deleteBtn[i].addEventListener('click', event => {
                event.preventDefault();

                let article = deleteBtn[i].closest(".cart__item");
                let productToDelete = article.dataset.id;
                let productToDeleteColor = article.dataset.color;

              // Méthode filter pour conserver les elements à garder et supprimer les elements "clickés/supprimer"
              let foundProductIntableauArticles = tableauArticles.find(p => p._id == productToDelete && p.color == productToDeleteColor);
              let foundProductIntableauLocalStorage = tableauLocalStorage.find(p => p.id == productToDelete && p.color == productToDeleteColor);
              // Si c'est valide => procéder à la suppression de la quantité dans le localStorage 
              if (foundProductIntableauArticles != undefined && foundProductIntableauLocalStorage != undefined){
                tableauArticles.splice([tableauArticles.indexOf(foundProductIntableauArticles)], 1);
                tableauLocalStorage.splice([tableauLocalStorage.indexOf(foundProductIntableauLocalStorage)], 1);
                
              }
              updateLocalStorage(tableauLocalStorage);
              calculTotaux();

               //cible et supprime le produit/element dans le DOM
               event.target.closest('article').remove();
               alert("ce produit a été supprimé de votre panier !");
            });
        }
      };
    
  }


  // Formulaire de validation
  // Déclaration des regex 
  let textRegex = new RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ-' ]+$");
  let addressRegex = new RegExp("^[A-Za-z0-9À-ÖØ-öø-ÿ-,' ]+$");
  let emailRegex = new RegExp("^[A-Za-z0-9'._-]+[@]{1}[A-Za-z0-9._-]+[.]{1}[a-z]{2,10}$");
  let alertMessageTextFalse = "Ce champ ne peut contenir que des lettres";
  let alertMessageAddressFalse = "Veuillez renseigner votre adresse selon le format '2 rue de cet exemple'.";
  let alertMessageEmailFalse = "Le format de ce champ est 'exemple@domaine.fr'.";

  // Fonction pour tester l'input et renvoyer le resultat
  function validInput(input, regex, alertMessageFalse) {
    let testInput = regex.test(input.value);
    let p = input.nextElementSibling;
    if (testInput) {
      p.textContent = "Champ valide.";
      p.style.color = "#95FFCB";
      return true;
    } else {
      p.textContent = alertMessageFalse;
      p.style.color = "#da3b1c";
      return false;
    }
  }
  
  // Validation du prénom
  let firstName = document.getElementById("firstName");
  let inputFirstName = firstName.addEventListener("change", function () {
  validInput(firstName, textRegex, alertMessageTextFalse);
  });

  // Validation du nom de famille
  let lastName = document.getElementById("lastName");
  let inputlastName = lastName.addEventListener("change", function () {
    validInput(lastName, textRegex, alertMessageTextFalse);
  });

  // Validation de l'adresse
  let address = document.getElementById("address");
  let inputAddress = address.addEventListener("change", function () {
    validInput(address, addressRegex, alertMessageAddressFalse);
  });

  // Validation de la ville
  let city = document.getElementById("city");
  let inputCity = city.addEventListener("change", function () {
    validInput(city, textRegex, alertMessageTextFalse);
  });

  // Validation de l'email
  let email = document.getElementById("email");
  let inputEmail = email.addEventListener("change", function () {
    validInput(email, emailRegex, alertMessageEmailFalse);
  });

  // Fonction d'envoi des données vers l'API
  function send(contact, products) {
    fetch(`http://localhost:3000/api/products/order`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact: contact, products: products }),
    })
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (json) {
        // Récupération de orderId à insérer dans l'URL
        orderNumber = json.orderId;
        localStorage.clear();
        window.location.href = `./confirmation.html?orderId=${orderNumber}`;
      })
      .catch((err) =>
        alert(
          "Votre commande a échouée. Nous vous invitons à essayer une nouvelle fois."
        )
      );
  }


// On écoute l'event du bouton COMMANDER
    let submitBtn = document.getElementById("order");
    let submitForm = submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (
        validInput(firstName, textRegex, alertMessageTextFalse) &&
        validInput(lastName, textRegex, alertMessageTextFalse) &&
        validInput(address, addressRegex, alertMessageAddressFalse) &&
        validInput(city, textRegex, alertMessageTextFalse) &&
        validInput(email, emailRegex, alertMessageEmailFalse) &&
        tableauLocalStorage.length > 0
      ) {

// Si le formulaire est validé
// Création d'un tableau qui va contenir les id du localStorage
    const products = [];

        let contact = {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value,
        };
        tableauLocalStorage.forEach(element => {
          products.push(element.id);
        });
        send(contact, products);
        
      }

      else{
        alert("Veuillez verifier les champs !");
      }
    });

