class Habitacion {
    constructor(categoria, descripcion, tarifaBaja, tarifaAlta, img){
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

// Inicialización de DateTime para utilizar luxon
const DateTime = luxon.DateTime;

// Function para transformar un string en una fecha
function transformarEnFecha(string){
    return DateTime.fromISO(string)
}
// Función que genera el html para renderizar reservas

function renderizarReserva(reserva){
    // Transforma la fecha en un check in
    reserva.checkin = transformarEnFecha(reserva.checkin);
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
                <td>${reserva.totalEstadia}</td>
                <td><button type="button" class="btn btn-danger oculto" id="botonCancelar${reserva.numero}">Cancelar</button></td>
            </tbody> 
        </table>`;
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

const reserva1 = new Reserva(1, "Juan Perez", "jp@gmail.com", "2022-06-01", 3, "superior", "confirmada", 300);
const reserva2 = new Reserva(2, "Mariana Alonso", "malonso@hotmail.com", "2022-07-05", 4, "superior", "confirmada", 400);
const reserva3 = new Reserva(3, "Martin Gonzalez", "mg@yahoo.com.ar", "2022-09-30", 1, "standard", "confirmada", 90);
const reserva4 = new Reserva(4, "Leon Suarez", "ls111@gmail.com", "2023-03-03", 2, "superior", "cancelada", 200);

//  Trae el array de reservas desde el storage o crea un array con las 4 reservas iniciales

let reservas = JSON.parse(localStorage.getItem("reservas")) || [reserva1, reserva2, reserva3, reserva4]

// Se inicializa numeroReserva según el largo del array reservas
let numeroReserva = reservas.length + 1; 