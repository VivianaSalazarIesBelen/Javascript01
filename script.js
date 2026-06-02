// Variables para recordar la comunidad seleccionada y el orden de la lista
let comunidadActual = null;
let ordenSeleccionado = 'nombre';

// Cuando la página web se carga por completo
document.addEventListener("DOMContentLoaded", () => {
    ordenar();
    document.getElementById("btn-guardar").disabled = true; // Desactiva el botón al arrancar
    configurarBoton(); // Prepara los eventos del formulario

    // Si el usuario cambia el selector de orden (Nombre / Población)
    document.getElementById('ordenar').addEventListener('change', (e) => {
        ordenSeleccionado = e.target.value; // Guarda la nueva opción
        ordenar();
    });
});

// Ordena los datos de las comunidades
function ordenar() {
    let listaOrdenada = [...ccaa]; // Hace una copia de los datos para no romper los originales

    listaOrdenada.sort((a, b) => {
        if (ordenSeleccionado === 'nombre') {
            return a.nombre.localeCompare(b.nombre);
        } else {
            return b.poblacion_total - a.poblacion_total; // De mayor a menor población
        }
    });

    pintarLista(listaOrdenada); // Pasa los datos ordenados a la pantalla
}

// Genera los botones de la lista en el HTML
function pintarLista(lista) {
    const contenedor = document.getElementById("lista-comunidades");

    // Convierte cada comunidad en un botón HTML
    contenedor.innerHTML = lista.map(c => `
        <button type="button"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center boton-ccaa"
                id="btn-${c.nombre.replace(/\s+/g, '')}" 
                onclick="seleccionarComunidad('${c.nombre}')">

            <span>${c.nombre}</span>
            <span class="badge bg-secondary rounded-pill">${c.poblacion_total.toLocaleString()}</span>

        </button>
    `).join(""); // Junta todos los botones en un solo bloque de texto
}

// Se ejecuta al hacer clic en una comunidad autónoma
window.seleccionarComunidad = function(nombreComunidad) {
    document.querySelectorAll(".boton-ccaa")
        .forEach(btn => btn.classList.remove("active"));

    const encontrada = ccaa.find(c => c.nombre === nombreComunidad); // Busca la comunidad en los datos
    if (!encontrada) return;

    comunidadActual = encontrada; // Guarda la comunidad elegida globalmente

    // Busca el botón clicado por su ID y lo pinta
    const idBoton = `btn-${nombreComunidad.replace(/\s+/g, '')}`;
    const botonPresionado = document.getElementById(idBoton);
    if (botonPresionado) botonPresionado.classList.add("active");


    document.getElementById("f-comunidad").value = encontrada.nombre;
    document.getElementById("f-capital").value = encontrada.capital;

    const inputPresidente = document.getElementById("f-presidente");
    inputPresidente.value = encontrada.presidente;
    inputPresidente.readOnly = false; // Permite escribir en el campo del presidente

    // Crea el texto de las provincias en formato lista, si existen
    const provinciasTexto = encontrada.provincias.length > 0
        ? encontrada.provincias
            .map(p => `• ${p.nombre} (${p.poblacion.toLocaleString()} hab.)`)
            .join("\n")
        : "Sin provincias registradas.";

    document.getElementById("f-provincia").value = provinciasTexto; // Muestra las provincias

    validarBoton(); // Activa el botón de guardar si el input tiene texto
};

// Configura el botón de guardar y el input del presidente
function configurarBoton() {
    const btn = document.getElementById("btn-guardar");
    const input = document.getElementById("f-presidente");

    input.addEventListener("input", validarBoton); // Valida el botón cada vez que escribes/borras

    // Al hacer clic en Guardar Cambios
    btn.addEventListener("click", () => {
        const nuevoPresi = input.value.trim(); // Quita espacios vacíos

        if (nuevoPresi === "") {
            mostrarMensaje("El presidente no puede estar vacío", "red");
            return;
        }

        if (comunidadActual) {
            comunidadActual.presidente = nuevoPresi;
            mostrarMensaje(`Presidente de ${comunidadActual.nombre} actualizado`, "green");
        } else {
            alert("Selecciona una comunidad primero");
        }
    });
}

// Activa o desactiva el botón de guardar según si el input está vacío o no
function validarBoton() {
    const input = document.getElementById("f-presidente");
    const btn = document.getElementById("btn-guardar");
    btn.disabled = input.value.trim() === "";
}


function mostrarMensaje(texto, color) {
    let msg = document.getElementById("mensaje-estado");

    if (!msg) { // Si no existe el contenedor de mensajes, lo crea en el HTML
        msg = document.createElement("div");
        msg.id = "mensaje-estado";
        msg.style.marginTop = "10px";
        msg.style.fontWeight = "bold";
        document.querySelector(".card.p-4").appendChild(msg);
    }

    msg.textContent = texto;
    msg.style.color = color;

    setTimeout(() => { msg.textContent = ""; }, 4000);
}