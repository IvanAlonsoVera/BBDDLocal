let db;

let cmp1;
let cmp2;
let cmp3;

let cuerpoTabla;

let tablaDiv;
let formularioDiv;

let idActivo=0;

window.onload = cargar;

function cargar() {

	tablaDiv=document.getElementById("tabla");
	formularioDiv=document.getElementById("formulario");

	//cargar el objeto para manejar la base de datos local
	let objetoBD = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	let referenciaBD = objetoBD.open("ejemplo_bd",1);

	//referenciamos los elementos input del DOM
	cmp1=document.getElementById("campo1");
	cmp2=document.getElementById("campo2");
	cmp3=document.getElementById("campo3");

	//referencia al tbody de la tabla
	cuerpoTabla = document.getElementById("cuerpoTabla");

	//evento que se dispara si hay problemas al abrir la bd
	referenciaBD.onerror = function(){
		console.log("Error al abrir ejemplo_bd");
	}


	//evento que se dispara si se abre correctamente
	referenciaBD.onsuccess = function(){
		console.log("Se abrió la BD correctamente");

		db = referenciaBD.result;	

    	listar();
	}

	//evento que se dispara si la bd no existe o la version no coincide.
	referenciaBD.onupgradeneeded = function(evento){
		//Se apunta a la base de datos nueva
		let dbNueva = evento.target.result;

		//creamos la tabla
		let tabla = dbNueva.createObjectStore('datos_tabla',{keyPath:'id',autoIncrement:true});

		//creamos los campos de la tabla 
		tabla.createIndex('campo1','campo1',{unique:false});
		tabla.createIndex('campo2','campo2',{unique:false});
		tabla.createIndex('campo3','campo3',{unique:false});

		console.log("BD configurada");
	}


}

function listar(){

	//borrar los elementos de tbody
	let listaFilas = cuerpoTabla.childNodes;
	for (var i = listaFilas.length - 1; i >= 0; i--) {
		listaFilas[i].remove();
	}


	//Obtiene todos los datos de la BD local
	//y lo inserta en el cuerpo de la tabla.
	let tabla = db.transaction("datos_tabla").objectStore("datos_tabla");

	tabla.openCursor().onsuccess = function(evento) {
		
		//recuperamos el cursor
		let cursor = evento.target.result;

		if(cursor){

			//recuperar los valores
			let valCmp1 = cursor.value.campo1;
			let valCmp2 = cursor.value.campo2;
			let valCmp3 = cursor.value.campo3;
			let indice = cursor.value.id;

			//crear la fila para la tabla
			let fila = document.createElement("tr");

			let celda1 = document.createElement("td");
			let celda2 = document.createElement("td");
			let celda3 = document.createElement("td");
			
			fila.setAttribute('ondblclick','mostrar('+indice+')');
			

			celda1.innerText = valCmp1;
			celda2.innerText = valCmp2;
			celda3.innerText = valCmp3;


			fila.appendChild(celda1);
			fila.appendChild(celda2);
			fila.appendChild(celda3);


			cuerpoTabla.appendChild(fila);

			//continua con la siguiente fila de la tabla
			//mejor dicho, continua con el siguiente objeto de la colección.
			cursor.continue();

		}else{
			console.log("fin del listado");
		}
	}
}

function mostrar(id){

	idActivo = id;

	var transaction = db.transaction(["datos_tabla"]);
	var objectStore = transaction.objectStore("datos_tabla");

	//pregunta a la base de datos por una fila con PK sea id
	var request = objectStore.get(parseInt(id));

	request.onerror = function(){
		Alert(request.error.name + "\n" + request.error.message);
	};


	request.onsuccess = function(){
		var resultado = request.result;

		if(resultado !== undefined){

			document.getElementById("campo1").value=resultado.campo1;
			document.getElementById("campo2").value=resultado.campo2;
			document.getElementById("campo3").value=resultado.campo3;

			tablaDiv.classList.add("d-none");
			formularioDiv.classList.remove("d-none");		
		}
	};


}

function modificar() {

	var transaction = db.transaction(['datos_tabla'],'readwrite');
	var objectStore = transaction.objectStore('datos_tabla');

	var request = objectStore.get(parseInt(idActivo));

	request.onerror = function(){
		Alert(request.error.name + "\n" + request.error.message);
	};


	request.onsuccess = function(){

		var resultado = request.result;

		if(resultado !== undefined){
			resultado.campo1 = document.getElementById("campo1").value;
			resultado.campo2 = document.getElementById("campo2").value;
			resultado.campo3 = document.getElementById("campo3").value;

			var resultadoModif = objectStore.put(resultado);

			resultadoModif.onerror = function(){
				Alert(request.error.name + "\n" + request.error.message);
			};

			resultadoModif.onsuccess = function(){
				idActivo=0;
				listar();
				tablaDiv.classList.remove('d-none');
				formularioDiv.classList.add('d-none');
			}

		}


	};
	
}

function borrar() {

	var transaction = db.transaction(['datos_tabla'],'readwrite');
	var objectStore = transaction.objectStore('datos_tabla');

	var request = objectStore.delete(parseInt(idActivo));

	request.onerror = function(){
		Alert(request.error.name + "\n" + request.error.message);
	};

	request.onsuccess = function(){
		idActivo=0;		
		listar();
		tablaDiv.classList.remove('d-none');
		formularioDiv.classList.add('d-none');
	};

}