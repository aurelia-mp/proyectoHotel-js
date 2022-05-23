/* Versión reducida del cotizador, solo pude trabajar en la primera opción: Cotizar una estadía.
 Se dejan las opciones "Consultar" y "Cancelar reserva" para una próxima entrega */

 class Habitacion {
    constructor(categoria, tarifaBaja, tarifaAlta, img){
        this.categoria = categoria;
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
const standard = new Habitacion("Standard", 90, 100, "../assets/standard.jpg");
const superior = new Habitacion("Superior", 110, 140, "../assets/superior.jpg");
const suite = new Habitacion("Suite", 150, 300, "../assets/suite.jpg");

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

// Para probar la función filtrarReservas, se pasa la reserva 4 a inactiva
reserva4.cancelarReserva();
    
// Se inicializa numeroReserva en 5 para la próxima reserva del array
let numeroReserva = 5; 

// Se inicializan el resto de las variables
let fechaLlegada;
let cantidadNoches;
let mes;
let habitacionACotizar = {};
let totalEstadia;
let textoInicial = "Bienvenido/a a nuestro sistema de reservas online \n\nIngresa el número de opción deseada:\n\n 1. Cotizar una estadía\n 2. Consultar si tenés una reserva activa\n 3. Cancelar una reserva";
let pasajero = "";
let cotizacion;

// Funcion para insertar cards con las habitaciones
function mostrarHabitaciones(lista){
    let contenedor = document.getElementById("habitaciones")

    for (const habitacion of habitaciones){
        let card = document.createElement("div")
        card.className= "row gx-5 whiteCard align-items-center flex-lg-column col-lg-6 col-xl-4 mb-3";

        card.innerHTML = `<div class="col-md-5 col-lg-12 d-flex justify-content-center">
                            <img src="${habitacion.img}" class="img-fluid rounded-start" alt="Foto de una habitacion ${habitacion.categoria}">
                            </div>
                            <div class="col-md-7 col-lg-12">
                            <div class="card-body">
                                <h3 class="card-title titulo--xl text-uppercase">${habitacion.categoria}</h3>
                                <div class="card-text fw-light">
                                    <p>${habitacion.categoria}</p>
                                </div>
                                <div class="card-footer datosReco">
                                    <table>
                                        <tr>
                                            <td>Tarifa Temporada Alta</td>
                                            <td>${habitacion.tarifaAlta}</td>
                                        </tr>
                                        <tr>
                                            <td>Tarifa Temporada Alta</td>
                                            <td>${habitacion.tarifaBaja}</td>
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

// Funcion cotizar estadía - Asociada al evento SUBMIT en el formulario de cotización
function cotizarEstadia(e){
    e.preventDefault();

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

    //AGREGAR UNA VALIDACION PARA QUE EL USUARIO NO PUEDA INGRESAR UNA CANTIDAD DE NOCHES NULA O NEGATIVA
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

    // Mostrar los botones confirmar y reset
    let botones = document.getElementById("botones");
    let botonConfirmar = document.getElementById("botonConfirmar");
    let botonReset = document.getElementById("botonReset");

    botones.classList.toggle("oculto"); 

    botonConfirmar.onclick = () => {confirmarReserva(reservaNueva, pasajero)}

    botonReset.onclick = () => {borrarTodo()};
}

function borrarTodo(){
    cotizacion.remove();
    botones.classList.toggle("oculto");
    formulario.reset();
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
    let principal = document.getElementById("principalReservar")
    principal.append(seccionReservas);
    
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


// Function para hacer aparecer o desaparecer un elemento
function toggleDisplay(elemento){
    if (elemento.style.display == "block" || elemento.style.display == ""){
        elemento.style.display = "none";
    }
    else{
        elemento.style.display = "block";
    }
}


// Agrega una lista de habitaciones en forma de cards
mostrarHabitaciones(habitaciones)

// Genera dinámicamente el dropdown para elegir la categoría de habitación
insertarCategorias(habitaciones)

// Al enviar el formulario, se cotiza la estadía con los datos ingresados
let divCotizacion = document.getElementById("divCotizacion");
let formulario = document.getElementById("formulario");
formulario.addEventListener("submit", cotizarEstadia);