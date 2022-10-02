// mettre à jours les produits dans le local storage :

function updateLocalStorage ( productsArray ){

    let value = JSON.stringify (productsArray);
    localStorage.setItem("products", value);
}

// Renvoyer le tableau des produits ajoutés

function getproductsArray(){

    if(localStorage.getItem("products")){
        let value = localStorage.getItem("products");
        return JSON.parse(value);
    
    }else{
        return [];
    }
}