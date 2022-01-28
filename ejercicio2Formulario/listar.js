let db;

window.onload = cargar;
function cargar(){
	

	let objdb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	let refBD = objdb.open("lista",1);

	refBD.onerror = function(){
		console.log("error al abrir");
	}

	refBD.onsuccess = function(){
		console.log("Se abrio correctamente");
		db = refBD.result;
		listar();
	}
}
function listar(){
	let tab = document.getElementById('listaRegistro');
	let lisFil = tab.childNodes;
	for (var i = lisFil.length - 1; i >= 0; i--) {
		lisFil[i].remove();
	}
	let tabla = db.transaction("datos_tabla").objectStore("datos_tabla");

	tabla.openCursor().onsuccess = function (evento) {
		let cursor = evento.target.result;

		if(cursor){

			let valCmp1 = cursor.value.nom;		
			let valCmp2 = cursor.value.fen;
			let valCmp3 = cursor.value.hen;
			let valCmp4 = cursor.value.des;
			let valCmp5 = cursor.value.con;

			let fila = document.createElement("tr");
			let celda1 = document.createElement("td");
			let celda2 = document.createElement("td");
			let celda3 = document.createElement("td");
			let celda4 = document.createElement("td");
			let celda5 = document.createElement("td");

			celda1.innerHTML = valCmp1;
			celda2.innerHTML = valCmp2;
			celda3.innerHTML = valCmp3;
			celda4.innerHTML = valCmp4;
			celda5.innerHTML = valCmp5;

			fila.appendChild(celda1);
			fila.appendChild(celda2);
			fila.appendChild(celda3);
			fila.appendChild(celda4);
			fila.appendChild(celda5);

			tab.appendChild(fila);

			cursor.continue();
		}else{
			console.log("fin del listado");
		}
	}

}