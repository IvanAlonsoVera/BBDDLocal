window.onload = cargar;
function cargar(){
	let objDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	let refBD = objDB.open("lista",1);

	nom = document.getElementById('nom');
	fen = document.getElementById('fen');
	hen = document.getElementById('hen');
	des = document.getElementById('des');
	con = document.getElementById('con');

	refBD.onerror = function(){
		console.log("error al abrir");
	}

	refBD.onsuccess = function(){
		console.log("Se abrio correctamente");
		db = refBD.result;
	}

	refBD.onupgradeneeded = function(evento){
		let dbnew = evento.target.result;
		let tabla = dbnew.createObjectStore('datos_tabla',{keyPath:'id',autoIncrement:true});
		tabla.createIndex('nom','nom',{unique:false});
		tabla.createIndex('fen','fen',{unique:false});
		tabla.createIndex('hen','hen',{unique:false});
		tabla.createIndex('des','des',{unique:false});
		tabla.createIndex('con','con',{unique:false});
		console.log("BD configurada");
	}
}
function guardar(){
	let nEle = {	nom:nom.value,
					fen:fen.value, 
					hen:hen.value,
					des:des.value,
					con:con.value,
						};
	let trans = db.transaction(['datos_tabla'],'readwrite');
	let refTabla = trans.objectStore('datos_tabla');
	let res = refTabla.add(nEle);
	res.onsuccess = function(){
		nom.value = "";
		fen.value = "";
		hen.value = "";
		des.value = "";
		con.value = "";
		console.log("datos introducidos");
	}
	res.oncomplete = function(){
		console.log("operacion completada");
	}
	res.onerror = function(){
		console.log("ocurrio un error");
	}
}
