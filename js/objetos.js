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
    constructor(numero, pasajero, checkin, noches, categoria, status, totalEstadia){
        this.numero = numero;
        this.pasajero = pasajero;
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

// Función que genera el html para renderizar reservas

function renderizarReserva(reserva){
    return tablaReserva =  
            `<table class ="table table-light table-hover my-5">
            <thead>
                <td>Reserva #</td>
                <td>Nombre</td>
                <td>Fecha de llegada</td>
                <td>Cantidad de noches</td>
                <td>Categoria</td>
                <td>Estado</td>
                <td>Valor total de la estadía</td>
            </thead>
            <tbody>
                <td>${reserva.numero}</td>
                <td>${reserva.pasajero}</td>
                <td>${reserva.checkin}</td>
                <td>${reserva.noches}</td>
                <td>${reserva.categoria}</td>
                <td>${reserva.status}</td>
                <td>${reserva.totalEstadia}</td>
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

const reserva1 = new Reserva(1, "Juan Perez", "01/06/2022", 3, "superior", "confirmada", 300);
const reserva2 = new Reserva(2, "Mariana Alonso", "05/07/2022", 4, "superior", "confirmada", 400);
const reserva3 = new Reserva(3, "Martin Gonzalez", "30/09/2022", 1, "standard", "confirmada", 90);
const reserva4 = new Reserva(4, "Leon Suarez", "03/03/2023", 2, "superior", "cancelada", 200);

//  Trae el array de reservas desde el storage o crea un array con las 4 reservas iniciales

let reservas = JSON.parse(localStorage.getItem("reservas")) || [reserva1, reserva2, reserva3, reserva4]

// Se inicializa numeroReserva según el largo del array reservas
let numeroReserva = reservas.length + 1; 