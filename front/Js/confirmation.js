
// Récupération de la chaîne de requête dans l'Url :

const queryString_url = window.location.search;
console.log(queryString_url);// => renvoi la partie params avec le ?

// Pour extraire l'orderId :

const urlSearchParams = new URLSearchParams(queryString_url);
console.log(urlSearchParams);// renvoi les params sans le ?
const orderId = urlSearchParams.get("orderId"); // recuperer la valeur du param qui s'appelle id


document.getElementById("orderId").textContent =  orderId;