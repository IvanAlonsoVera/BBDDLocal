function envio(){
	let clave = document.getElementById('clave').value;
	let valor = document.getElementById('valor').value;

	localStorage.setItem(clave,valor);
}
function borrar(){
	localStorage.clear();
}
function listar(){
	let ul = document.createElement("ul");
	let d1 = document.getElementById("d1");

	while (d1.firstChild){
		d1.removeChild(d1.firstChild);
	}

	for (var i = 0; i < localStorage.length; i++) {
		let cl = localStorage.key(i);
		let va = localStorage.getItem(localStorage.key(i));

		let c1 = document.createElement("li");

		c1.innerHTML = cl +" "+ va;

		ul.appendChild(c1);
		d1.appendChild(ul);

	}
}