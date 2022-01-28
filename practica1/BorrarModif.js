let db;

let nom;
let fec;
let hor;
let des;
let con;
let formulario;
let tbody;

window.onload = cargar;

function cargar() {

	div=document.getElementById('div');
	nom=document.getElementById('nom');
	fec=document.getElementById('fec');
	des=document.getElementById('des');
	con=document.getElementById('con');
	tab=document.getElementById('tabla');
	formulario=document.getElementById('formulario');
	tbody = document.getElementById("tbody");

	let objetoBD=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	let referenciaBD = objetoBD.open("listado_entradas",1);

	referenciaBD.onerror=function(){

		alert("error al abrir en la base de datos");
	}
	referenciaBD.onsuccess = function(){

		console.log("Se abrió la BD correctamente");
		db = referenciaBD.result;	
    	listar();
	}

	referenciaBD.onupgradeneeded = function(even){

		let dbNueva = even.target.result;
		let tabla = dbNueva.createObjectStore('datos_tabla',{keyPath:'id',autoIncrement:true});

		tabla.createIndex('nom','nom',{unique:false});
		tabla.createIndex('fec','fec',{unique:false});
		tabla.createIndex('des','des',{unique:false});
		tabla.createIndex('hor','hor',{unique:false});
		tabla.createIndex('con','con',{unique:false});
		console.log("BD configurada");
	}	
}

function listar(){

	let lisFil = tbody.childNodes;
	let tabla = db.transaction("datos_tabla").objectStore("datos_tabla");

	for (var i = lisFil.length - 1; i >= 0; i--) {
		lisFil[i].remove();
	}

	tabla.openCursor().onsuccess = function(even) {
		
		let cursor = even.target.result;
		if(cursor){

			let valNom = cursor.value.nom;
			let valFec = cursor.value.fec;
			let valDes = cursor.value.des;
			let valHor = cursor.value.hor;
			let valCon = cursor.value.con;
			let indice = cursor.value.id;
			
			let fila = document.createElement("tr");

			let cnom = document.createElement("td");
			let cfec = document.createElement("td");
			let cdes = document.createElement("td");
			let chor = document.createElement("td");
			let ccon = document.createElement("td");
			
			fila.setAttribute('ondblclick','mostrar('+indice+')');
			
			cnom.innerText = valNom;
			cfec.innerText = valFec;
			cdes.innerText = valDes;
			chor.innerText = valHor;
			ccon.innerText = valCon;


			fila.appendChild(cnom);
			fila.appendChild(cfec);
			fila.appendChild(cdes);
			fila.appendChild(chor);
			fila.appendChild(ccon);

			tbody.appendChild(fila);

			cursor.continue();

		}else{
			console.log("Listado Completado!");
		}
	}
}
function mostrar(id){

	idAc = id;

	var transaction = db.transaction(["datos_tabla"]);
	var objectStore = transaction.objectStore("datos_tabla");
	var request = objectStore.get(parseInt(idAc));

	request.onerror = function(){
		Alert(request.error.name + "\n" + request.error.message);
	};

	request.onsuccess = function(){
		var resp = request.result;

		if(resp !== undefined){

			document.getElementById("nom").value=resp.nom;
			document.getElementById("fec").value=resp.fec;
			document.getElementById("des").value=resp.des;
			document.getElementById("hor").value=resp.hor;
			document.getElementById("con").value=resp.con;

			tbody.classList.add("d-none");
			formulario.classList.remove("d-none");		
		}
	};
}
function modificar() {

	var transaction = db.transaction(['datos_tabla'],'readwrite');
	var objectStore = transaction.objectStore('datos_tabla');
	var request = objectStore.get(parseInt(idAc));

	request.onerror = function(){
		Alert(request.error.name + "\n" + request.error.message);
	};


	request.onsuccess = function(){

		var resu = request.result;

		if(resu !== undefined){
			resu.nom = document.getElementById("nom").value;
			resu.fec = document.getElementById("fec").value;
			resu.des = document.getElementById("des").value;
			resu.hor = document.getElementById("hor").value;
			resu.con = document.getElementById("con").value;

			var resuModif = objectStore.put(resu);

			resuModif.onerror = function(){
				Alert(request.error.name + "\n" + request.error.message);
			};

			resuModif.onsuccess = function(){
				idAc=0;
				listar();
				tbody.classList.remove('d-none');
				formulario.classList.add('d-none');
			}
		}

	};
}
function borrar() {

	var transaction = db.transaction(['datos_tabla'],'readwrite');
	var objectStore = transaction.objectStore('datos_tabla');
	var request = objectStore.delete(parseInt(idAc));

	request.onerror = function(){
		Alert(request.error.name + "\n" + request.error.message);
	};

	request.onsuccess = function(){
		idAc=0;		
		listar();
		tbody.classList.remove('d-none');
		formulario.classList.add('d-none');
	};

}