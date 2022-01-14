let cmp1;
let cmp2;
let cmp3;

let cuerpoTabla;

window.onload = cargar;

function cargar(){

	//cargar el objeto para manejar la base de datos
	let objetodb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	let referenciabd = objetodb.open("ejemplo_bd",1);

	//referenciamos los elementos del DOM
	cmp1=document.getElementById("campo1");
	cmp2=document.getElementById("campo2");
	cmp3=document.getElementById("campo3");
	cuerpoTabla=document.getElementById("cuerpotabla");

	//el evento que se dispara si hay problemas al abrir la bd
	referenciabd.onerror = function(){
		console.log("error al abrir ejemplo_bd");
	}

	//evento que se dispara si se abre correcttamente
	referenciabd.onsuccess = function(){
		console.log("Se abrio ejemplo_bd");

		db = referenciabd.result;

		listar();
	}

	//evento que se dispara si la bd no existe o la version no coincide
	referenciabd.onupgradeneeded = function(evento){
		//se apunta a la base de datos nueva
		let dbnueva = evento.target.result;

		// creamos la tabla
		let tabla = dbnueva.createObjectStore('datos_tabla',{keyPath:'id',autoIncrement:true});

		//creamos los campos
		tabla.createIndex('campo1','campo1',{unique:false});
		tabla.createIndex('campo2','campo2',{unique:false});
		tabla.createIndex('campo3','campo3',{unique:false});

		console.log("BD configurada");
	}
}

function guardar(){
	//guardar la informacion en la BD local con indexBD

	//crear un objeto con los datos del formulario
	let nuevoElemento = {	campo1:cmp1.value,
							campo2:cmp2.value, 
							campo3:cmp3.value
						};

	//abrir una transaccion con la base de datos
	let transaccion = db.transaction(['datos_tabla'],'readwrite');

	//guardar la informacion en la base de datos
	let referenciaTabla = transaccion.objectStore('datos_tabla');

	let resultado = referenciaTabla.add(nuevoElemento);

	resultado.onsuccess = function(){
		cmp1.value = "";
		cmp2.value = "";
		cmp3.value = "";
		listar();
		console.log("datos introducidos");
	}

	resultado.oncomplete = function(){
		console.log ("operacion completada");
	}

	resultado.onerror = function(){
		console.log("error al introducir datos");
	}

}
function listar(){
	//obtiene todos los datos de la BD local
	//y lo inserta en la tabla

	//borramos los elementos del tbody
	let listaFilas = cuerpoTabla.childNodes;
	for (var i = listaFilas.length - 1; i >= 0; i--) {
		listaFilas[i].remove();
	}

	let tabla = db.transaction("datos_tabla").objectStore("datos_tabla");

	tabla.openCursor().onsuccess = function (evento) {
		//recuperamos el cursor
		let cursor = evento.target.result;

		if(cursor){

			//recuperar los valores
			let valCmp1 = cursor.value.campo1;
			let valCmp2 = cursor.value.campo2;
			let valCmp3 = cursor.value.campo3;
			let indice = cursor.value.id;

			//Crear la fila para la tabla
			let fila = document.createElement("tr");
			let celda1 = document.createElement("td");
			let celda2 = document.createElement("td");
			let celda3 = document.createElement("td");
			let celda4 = document.createElement("td");
			let boton = document.createElement("button");

			boton.setAttribute("onclick",'borrar('+indice+')');
			boton.textContent="Borrar";

			celda1.innerHTML = valCmp1;
			celda2.innerHTML = valCmp2;
			celda3.innerHTML = valCmp3;

			celda4.appendChild(boton);
			fila.appendChild(celda1);
			fila.appendChild(celda2);
			fila.appendChild(celda3);
			fila.appendChild(celda4);

			cuerpoTabla.appendChild(fila);


			//continua con la siguiente fila de la tabla
			// mejor dicho, continua con el siguiente objeto de la coleccion
			cursor.continue();

		}else{
			console.log("fin del listado");
		}
	}

}
function borrar(indice){
	//abrir una transaccion con la base de datos
	let transaccion = db.transaction(['datos_tabla'],'readwrite');

	//guardar la informacion en la base de datos
	let referenciaTabla = transaccion.objectStore('datos_tabla');

	let resultado = referenciaTabla.delete(indice);

	resultado.onsuccess = function(){
		console.log("elemento borrado")
	}

	listar();
}