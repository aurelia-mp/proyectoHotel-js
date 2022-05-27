 class Habitacion {
    constructor(categoria, descripcion, tarifaBaja, tarifaAlta, img){
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.tarifaBaja = tarifaBaja;
        this.tarifaAlta = tarifaAlta;
        this.img = img;
    }
    // Método para ver las tarifas de la habitacion
    verTarifas(){
       return "Tarifas de la habitación " + this.categoria + ": \n" + "Temporada Baja: " + this.tarifaBaja + "\n" + "Temporada Alta: " + this.tarifaAlta; 
    }
}

class Reserva {
    constructor(numero, pasajero, checkin, noches, categoria, totalEstadia){
        this.numero = numero;
        this.pasajero = pasajero;
        this.checkin = checkin;
        this.noches = noches;
        this.categoria = categoria;
        this.totalEstadia = totalEstadia;
        this.activa = true;
    }
    // Método para imprimir la reserva por pantalla
    mostrarReserva(){
        let confirmacion = document.createElement("p")
        confirmacion.innerHTML = `${this.pasajero}, tu reserva está confirmada con el número ${this.numero}. Te esperamos el ${this.checkin}`;
        divCotizacion.append(confirmacion);
    }
    // Método para cancelar la reserva
    cancelarReserva(){
        this.activa = false;
    }
}

// INICIALIZACIÓN DE VARIABLES

// Se cargan tres habitaciones de clase Habitacion en un array
const standard = new Habitacion("Standard", "Habitación doble matrimonial, con vistas a la ciudad", 90, 100, "../assets/standard.jpg");
const superior = new Habitacion("Superior", "Habitación ubicada en los pisos superiores, con vistas al jardín", 110, 140, "../assets/superior.jpg");
const suite = new Habitacion("Suite", "Suite de dos ambientes con terraza y jacuzzi", 150, 300, "../assets/suite.jpg");

const habitaciones = [];

habitaciones.push(standard, superior, suite);

// Se definien las temporadas como arrays con números de meses
let temporadaBaja = [5,6,7,8,9];
let temporadaAlta = [1,2,3,10,11,12];

// Se cargan 4 reservas de clase Reserva en un array inicial
let reservas = [];

const reserva1 = new Reserva(1, "Juan Perez", "01/06/2022", 3, "superior", 300);
const reserva2 = new Reserva(2, "Mariana Alonso", "05/07/2022", 4, "superior", 400);
const reserva3 = new Reserva(3, "Martin Gonzalez", "30/09/2022", 1, "standard", 90);
const reserva4 = new Reserva(4, "Leon Suarez", "03/03/2023", 2, "superior", 200);

reservas.push(reserva1, reserva2, reserva3, reserva4);

// Se pasa la reserva 4 a inactiva
reserva4.cancelarReserva();
    
// Se inicializa numeroReserva en 5 para la próxima reserva del array
let numeroReserva = 5; 

// Se inicializan el resto de las variables
let fechaLlegada;
let cantidadNoches;
let mes;
let habitacionACotizar = {};
let totalEstadia;
let pasajero = "";
let cotizacion;
let filtro;

// Definición de elementos del DOM

// Menú Operaciones: Parte superior donde se muestran las dos opciones: Cotizador o Consultar Reserva
let menuOperaciones = document.getElementById("menuOperaciones");

// Opción 1 del menú : Cotizador
let opcion1 = document.getElementById("opcion1");
opcion1.addEventListener("click", () => deshabilitarSeccion(menuOperaciones));
opcion1.addEventListener("click", iniciarCotizador);

// Opción 2 del menú: Consultar reserva
let opcion2 = document.getElementById("opcion2");
opcion2.addEventListener("click", () => deshabilitarSeccion(menuOperaciones));
opcion2.addEventListener("click", (e) => consultarReserva(e, reservas));

// Boton Elegir otra Operación - Aparece al final de las secciones para volver a menú inicial
let botonVolverInicio = document.getElementById("botonVolverInicio");


// Funcion para insertar cards con las habitaciones
function mostrarHabitaciones(lista){
    let contenedor = document.getElementById("habitaciones")

    for (const elemento of lista){
        let card = document.createElement("div")
        card.className= "row gx-5 whiteCard align-items-center flex-lg-column col-lg-6 col-xl-4 mb-3";

        card.innerHTML = `<div class="col-md-5 col-lg-12 d-flex justify-content-center">
                            <img src="${elemento.img}" class="img-fluid rounded-start" alt="Foto de una habitacion ${elemento.categoria}">
                            </div>
                            <div class="col-md-7 col-lg-12">
                            <div class="card-body">
                                <h3 class="card-title titulo--xl text-uppercase">${elemento.categoria}</h3>
                                <div class="card-text fw-light">
                                    <p>${elemento.descripcion}</p>
                                </div>
                                <div class="card-footer datosReco">
                                    <table>
                                        <tr>
                                            <td>Tarifa Temporada Alta</td>
                                            <td>${elemento.tarifaAlta}</td>
                                        </tr>
                                        <tr>
                                            <td>Tarifa Temporada Alta</td>
                                            <td>${elemento.tarifaBaja}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
        `
        contenedor.append(card);
    }
}

// Function insertarCategorias para el dropdown del formulario de cotizacion
function insertarCategorias(lista){
    let menu = document.getElementById("menuCategoria");
    let counter = 0

    for (const habitacion of lista){
        let opcion = document.createElement("option")
        opcion.value= counter;
        opcion.innerText=`${habitacion.categoria}`;
        counter++;
        menu.append(opcion);
    }
}

//////////////////////////
// OPCION 1: COTIZADOR //
/////////////////////////
function iniciarCotizador(){
    let cotizador = document.getElementById("cotizador");
    cotizador.classList.toggle("oculto");

    // Al apretar el botón "Elegir otra operación", se oculta la sección cotizador y se vuelve a habilitar el menú inicial
    botonVolverInicio.classList.toggle("oculto");

    // Al enviar el formulario, se cotiza la estadía con los datos ingresados
    let formulario = document.getElementById("formulario");
    formulario.addEventListener("submit", cotizarEstadia);
}


// Funcion cotizar estadía - Asociada al evento SUBMIT en el formulario de cotización
function cotizarEstadia(e){
    e.preventDefault();

    let botonCotizar = document.getElementById("botonCotizar");
    botonCotizar.disabled=true;

    let pasajero = document.querySelector("#nombre").value;
    let numeroCategoria = document.querySelector("#menuCategoria").value;
    let fechaLlegada = document.querySelector("#fechaCheckIn").value;    
    let mes = parseInt(fechaLlegada[5] + fechaLlegada[6]);
    let cantidadNoches = parseInt(document.querySelector("#cantNoches").value);
    let noches = "noche";

    if (cantidadNoches > 1){
        noches += "s";
    }       

    categoria = habitaciones[numeroCategoria];

    cotizacion = document.createElement("p");
    formulario.append(cotizacion);

    // Cotiza la estadía y devuelve el total
    if (temporadaBaja.includes(mes)){
        totalEstadia = categoria.tarifaBaja * cantidadNoches;
        cotizacion.innerHTML = `El total de tu estadia de ${cantidadNoches} ${noches} en categoría ${categoria["categoria"]} desde el ${fechaLlegada} es de ${totalEstadia}. \nEquivale a una tarifa de ${categoria.tarifaBaja} por noche.`
    } 
    else{
        totalEstadia = categoria.tarifaAlta * cantidadNoches;
        cotizacion.innerHTML = `El total de tu estadia de ${cantidadNoches} ${noches} en categoría ${categoria["categoria"]} desde el ${fechaLlegada} es de ${totalEstadia}. \nEquivale a una tarifa de ${categoria.tarifaAlta} por noche.`
    }

    // Grabar la cotización en un objeto provisorio "Reserva"
    let reservaNueva = new Reserva (numeroReserva, pasajero, fechaLlegada, cantidadNoches, categoria["categoria"], totalEstadia);

    // Mostrar los botones confirmar // reset // Volver al inicio
    let botones = document.getElementById("botones");
    let botonConfirmar = document.getElementById("botonConfirmar");
    let botonReset = document.getElementById("botonReset");

    botones.classList.toggle("oculto"); 

    // Al apretar el boton confirmar, se carga la reserva nueva
    botonConfirmar.onclick = () => {confirmarReserva(reservaNueva, pasajero)}

    // Al apretar el boton Reset, se borra los datos del formulario y se re-habilita el botón "submit"
    botonReset.onclick = () => {
        reiniciarCotizador()
        botonCotizar.disabled = false;
    };
}

 // Function Confirmar reserva
 function confirmarReserva(reserva, pasajero){    
    toggleDisplay(botones);
    toggleDisplay(formulario);
    reservas.push(reserva);
    reserva.mostrarReserva()
    numeroReserva ++;

    // Mostrar la reserva nueva en el HTML
    displayReservaHTML(reserva);

    // Insertar nombre pasajero en el saludo final
    let saludo = document.getElementById("saludo");
    saludo.classList.toggle("oculto")

    let nombrePax = document.getElementById("nombrePasajero");
    nombrePax.innerText= `${pasajero} `;
    nombrePax.setAttribute('style', 'font-weight: 800;')

    console.table(reservas);
}

function displayReservaHTML(reserva){
    let seccionReservas = document.createElement("section");
    seccionReservas.innerHTML="<h2>Tu nueva reserva:</h2>"
    seccionReservas.id="reserva";
    let cotizador = document.getElementById("cotizador")
    cotizador.append(seccionReservas);
    
    let tablaReservaNueva = document.createElement("table");
    let tablaReservaNuevaHead =document.createElement("thead");
    let tablaReservaNuevaBody = document.createElement("tbody");
    
    seccionReservas.append(tablaReservaNueva);
    tablaReservaNueva.className ="table table-light table-hover"
    tablaReservaNueva.append(tablaReservaNuevaHead);
    tablaReservaNueva.append(tablaReservaNuevaBody);
    
    tablaReservaNuevaHead.innerHTML = `<tr>
                                        <td>#</td>
                                        <td>Nombre</td>
                                        <td>Check in</td>
                                        <td>Noches</td>
                                        <td>Categoría</td>
                                        <td>Tarifa</td>
                                        <td>Total Estadía</td>
                                    </tr>`;
    
    
    let row = document.createElement("tr");
    row.innerHTML = `<td>${reserva.numero}</td>
                    <td>${reserva.pasajero}</td>
                    <td>${reserva.checkin}</td>
                    <td>${reserva.noches}</td>
                    <td>${reserva.categoria}</td>
                    <td>${reserva.totalEstadia / reserva.noches}</td>
                    <td>${reserva.totalEstadia}</td>`;
    
    tablaReservaNuevaBody.append(row);
}


function volverAlInicio(seccionActual){
    if (seccionActual == "cotizador"){
        cotizacion.remove();
        botones.classList.toggle("oculto");
        formulario.reset();
    }
    else if(seccionActual == "consultas"){
        respuesta.remove();
        formNumero.reset();
        formNombre.reset();
        consultas.classList.toggle("oculto");
    }
}

function reiniciarCotizador(){
    if(cotizacion){
        cotizacion.remove();
    }
    botones.classList.toggle("oculto");
    formulario.reset();
    botonCotizar.disabled=false;
}

/////////////////////////
// OPCION 2 : CONSULTAS//
/////////////////////////
function consultarReserva(e, reservas){
    e.preventDefault();
    botonVolverInicio.classList.toggle("oculto");
    let consultas = document.getElementById("consultas");
    consultas.classList.toggle("oculto");

    // Mostrar campo nombre o campo número de reserva según la opcion elegida en el checkbox
    let opcionNombre = document.getElementById("opcionNombre");
    let opcionId = document.getElementById("opcionId");
    opcionNombre.onclick = () => {filtrarReservas(reservas, 1)};
    opcionId.onclick = () => {filtrarReservas(reservas, 2)};
};

function filtrarReservas(array, filtro){
    opcionesConsulta.classList.toggle("oculto");

    // Opción 1 : Buscar por nombre
    if (filtro == 1){
        let formNombre = document.getElementById("formNombre");
        formNombre.classList.toggle("oculto"); 
        formNombre.addEventListener("submit", (e) => {
            e.preventDefault();
            let nombreUsuario = document.querySelector("#nombreUsuario").value;
            let reservasFiltradas = array.filter((reserva) => reserva.pasajero == nombreUsuario);
            mostrarReservas(reservasFiltradas, "nombre", formNombre);
        })
    }       
    
    else if (filtro == 2){
        let formNumero = document.getElementById("formNumero");
        formNumero.classList.toggle("oculto"); 
        formNumero.addEventListener("submit", (e) => {
            e.preventDefault();
            let id = document.querySelector("#idReserva").value;
            let reservasFiltradas = array.filter((reserva) => reserva.numero == id);
            mostrarReservas(reservasFiltradas, "numero", formNumero);
        })
    }
}

function mostrarReservas(array, parametro, seccion){
    let respuesta = document.getElementById("respuestaConsulta")

    // Caso 1: El array de reservas filtradas está vacío
    if(array.length == 0){
        // Si no es la primera consulta, en vez de crearse un nuevo elemento, se pisa el element existente
           respuesta.innerHTML= `No hay reservas activas con este ${parametro}`;   
    }
    // Caso 2: Hay reservas con el filtro
    else{
        // Se verifica si las reservas encontradas están activas
        let reservasFiltradasActivas = array.filter(reserva => reserva.activa);
        if (reservasFiltradasActivas.length == 0){
            respuesta.innerHTML= `La(s) reserva(s) que encontramos con este ${parametro } no está(n) activa(s)`;
            // return false;
        }
        else{
            respuesta.innerHTML= `Hay reserva(s) con este ${parametro} : \n`;
            reservasFiltradasActivas.forEach(reserva => {
                let impresionReserva = document.createElement("p")
                impresionReserva.innerHTML = `Reserva # ${reserva.numero}\nFecha de llegada ${reserva.checkin}\nCantidad de noches: ${reserva.noches}\nCategoria:  ${reserva.categoria}\nValor total de la estadía:  ${reserva.totalEstadia}`;
                respuesta.append(impresionReserva);
            })
            // return true;
        }
        }
}


// Function para hacer aparecer o desaparecer un elemento 
function toggleDisplay(elemento){
    if (elemento.style.display == "block" || elemento.style.display == ""){
        elemento.style.display = "none";
    }
    else{
        elemento.style.display = "block";
    }
}

// Function para pasar una sección a "DESHABILITADA" - Cambia la opacidad y deshabilita los botones
function deshabilitarSeccion(seccion){
    seccion.style.opacity = 0.5;
    let bt = seccion.getElementsByTagName("button");
    for (const boton of bt){
        boton.disabled = true;
    }
}

function habilitarSeccion(seccion){
    seccion.style.opacity = 1;
    let bt = seccion.getElementsByTagName("button");
    for (const boton of bt){
        boton.disabled = false;
    }
}

// Agrega una lista de habitaciones en forma de cards
mostrarHabitaciones(habitaciones)

// Genera dinámicamente el dropdown para elegir la categoría de habitación
insertarCategorias(habitaciones)












