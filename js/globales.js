// OBJETOS Y FUNCIONES QUE SE UTILIZAN EN AMBOS HTML

class Habitacion {
    constructor(id, categoria, descripcion, tarifaBaja, tarifaAlta, img){
        this.id = id;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.tarifaBaja = tarifaBaja;
        this.tarifaAlta = tarifaAlta;
        this.img = img;
    }
}

class Reserva {
    constructor(numero, pasajero, email, checkin, noches, categoria, status, totalEstadia){
        this.numero = numero;
        this.pasajero = pasajero;
        this.email = email;
        this.checkin = checkin;
        this.noches = noches;
        this.categoria = categoria;
        this.totalEstadia = totalEstadia;
        this.status = status;
    }
    // Método para cancelar la reserva
    cancelarReserva(){
        this.status = "cancelada";
    }
}

const Promos = [
    {
        id : 1,
        nombre: "Estadía Prolongada - Cuatro noches o más",
        tipo : "longStay",
        descuento : 15,
        minNoches : 4,
        maxNoches : 45,
        minAnticipacion : 0,
        maxAnticipacion : 365
    },
    {
        id : 2,
        nombre: "Reserva anticipada - más de 21 días",
        tipo : "earlyBooking",
        descuento : 10,
        minNoches : 0,
        maxNoches : 45,
        minAnticipacion : 21,
        maxAnticipacion : 365
    },
    {
        id : 3,
        nombre: "Reserva anticipada - más de 60 días",
        tipo : "earlyBooking",
        descuento : 20,
        minNoches : 0,
        maxNoches : 45,
        minAnticipacion : 60,
        maxAnticipacion : 365
    }
]

// Definicion de restriciciones
const MaximoNoches = 30;
const MaximoAnticipacion = 500;

// Array inicial de tarjetas
const Tarjetas = [];

// URL API para conversión de moneda
const APIurl = `https://api-dolar-argentina.herokuapp.com/api/dolaroficial`;

// Luxon - Inicialización de DateTime y creación de una instancia "today"
const DateTime = luxon.DateTime;
const today = DateTime.now();

// Function para transformar un string en una fecha
function transformarEnFecha(string){
    return DateTime.fromISO(string)
}
// Función que genera el html para renderizar reservas

function renderizarReserva(reserva){
    // Transforma la fecha en un check in
    reserva.checkin = transformarEnFecha(reserva.checkin);
    let importeFormateado = new Intl.NumberFormat().format(reserva.totalEstadia);
    return tablaReserva =  
            `<table class ="table table-light table-hover my-5">
            <thead>
                <td>Reserva #</td>
                <td>Nombre</td>
                <td>Fecha de llegada</td>
                <td>Cantidad de noches</td>
                <td>Categoria</td>
                <td>Estado</td>
                <td>Total estadía</td>
                <td></td>
            </thead>
            <tbody>
                <td>${reserva.numero}</td>
                <td>${reserva.pasajero}</td>
                <td>${reserva.checkin.toLocaleString()}</td>
                <td>${reserva.noches}</td>
                <td>${reserva.categoria}</td>
                <td>${reserva.status}</td>
                <td>USD ${importeFormateado}</td>
                <td><button type="button" class="btn btn-danger oculto" id="botonCancelar${reserva.numero}">Cancelar</button></td>
            </tbody> 
        </table>`;
}

// INICIALIZACIÓN DE VARIABLES

// Se cargan tres habitaciones de clase Habitacion en un array
const standard = new Habitacion(1, "Standard", "Habitación doble matrimonial, con vistas a la ciudad", 90, 100, "../assets/standard.jpg");
const superior = new Habitacion(2, "Superior", "Habitación ubicada en los pisos superiores, con vistas al jardín", 110, 140, "../assets/superior.jpg");
const suite = new Habitacion(3, "Suite", "Suite de dos ambientes con terraza y jacuzzi", 150, 300, "../assets/suite.jpg");

const habitaciones = [];

habitaciones.push(standard, superior, suite);

// Se definien las temporadas como arrays con números de meses
let temporadaBaja = [5,6,7,8,9];
let temporadaAlta = [1,2,3,4,10,11,12];

// Se cargan 4 reservas de clase Reserva en un array inicial

const reserva1 = new Reserva(1, "Juan Perez", "jp@gmail.com", "2022-06-01", 3, "superior", "confirmada", 300);
const reserva2 = new Reserva(2, "Mariana Alonso", "malonso@hotmail.com", "2022-07-05", 4, "superior", "confirmada", 400);
const reserva3 = new Reserva(3, "Martin Gonzalez", "mg@yahoo.com.ar", "2022-09-30", 1, "standard", "confirmada", 90);
const reserva4 = new Reserva(4, "Leon Suarez", "ls111@gmail.com", "2023-03-03", 2, "superior", "cancelada", 200);

//  Trae el array de reservas desde el storage o crea un array con las 4 reservas iniciales

let reservas = JSON.parse(localStorage.getItem("reservas")) || [reserva1, reserva2, reserva3, reserva4]

// Se inicializa numeroReserva según el largo del array reservas
let numeroReserva = reservas.length + 1; 


// Función para validar que un string no contenga números
function validarTexto(texto){
    for (let i = 0; i<texto.length;i++){
        if (!isNaN(texto[i]) && texto[i] != " "){
            return false;
        }
    }   
    return true;
}