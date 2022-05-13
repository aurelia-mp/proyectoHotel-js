// Se definien las temporadas como arrays con números de meses
let temporadaBaja = [5,6,7,8,9];
let temporadaAlta = [1,2,3,10,11,12];

// Se declara la clase Habitación y se cargan tres habitaciones en un array
class Habitacion {
    constructor(categoria, tarifaBaja, tarifaAlta){
        this.categoria = categoria;
        this.tarifaBaja = tarifaBaja;
        this.tarifaAlta = tarifaAlta;
    }
    // Método para ver las tarifas de la habitacion
    verTarifas(){
       return "Tarifas de la habitación " + this.categoria + ": \n" + "Temporada Baja: " + this.tarifaBaja + "\n" + "Temporada Alta: " + this.tarifaAlta; 
    }
}

const standard = new Habitacion("standard", 110, 90);
const superior = new Habitacion("superior", 110, 140);
const suite = new Habitacion("suite", 150, 300);

const habitaciones = [];

habitaciones.push(standard, superior, suite);

console.log(habitaciones);

//  Muestra por consola las tarifas de todas las habitaciones
for (const habitacion of habitaciones){
    console.log(habitacion.verTarifas());
}

// Function para armar la lista de habitaciones
let listaHabitaciones = ""
function listarHabitaciones(){
    for (item of habitaciones){
        listaHabitaciones += "- " + item["categoria"] + "\n"; 
    }
    return listaHabitaciones;
}

// Pedir al usuario la categoria y buscarla en el array de habitaciones
let habitacionACotizar = {};

function solicitarCategoria(){
    let categoria = prompt("¿En qué categoría estás interesado? : \n" + listarHabitaciones()).toLowerCase(); 
    habitacionACotizar = habitaciones.find(habitacion => habitacion.categoria == categoria);
    while (habitacionACotizar == undefined){
        solicitarCategoria();
    }
    return habitacionACotizar;
}

solicitarCategoria();


// Obtener fechas de estadías
// Solicitar al usuario una fecha de llegada - Se extrae el mes
let fechaLlegada = prompt("Muchas gracias. Ahora por favor indicanos desde cuando querés hospedarte, en formato DD/MM/AAAA");
let mes = parseInt(fechaLlegada[3] + fechaLlegada[4]);
console.log(mes);
while (fechaLlegada.length != 10 || isNaN(mes) || (mes > 13 || mes < 1)){
    fechaLlegada = prompt("Disculpas. No entiendo la fecha que ingresaste. Por favor, ingresar una fecha con el formato DD/MM/AAAA");
};

// Solicitar al usuario una cantidad de noches
let cantidadNoches = parseInt(prompt("¿Cuántas noches te gustaría quedarte con nosotros?"))

// Agrega "s" a la palabra noche según la cantidad elegida
let noches = "noche";
if (cantidadNoches > 1){
    noches += "s";
}

// Funcion cotizar estadía
function cotizarEstadia(categoria, fechaLlegada, cantidadNoches){
    // Cotiza la estadía y devuelve el total
    if (temporadaBaja.includes(mes)){
        alert ("El total de tu estadia de " + cantidadNoches + " " + noches + " en categoría " + categoria["categoria"] + " desde el " + fechaLlegada + " es de " +  (categoria.tarifaBaja * cantidadNoches) + ". Equivale a una tarifa de " + categoria.tarifaBaja + " por noche.")
    } 
    else{
        alert ("El total de tu estadia de " + cantidadNoches + " " + noches + "  en categoría " + categoria["categoria"] + " desde el " + fechaLlegada + " es de " + (categoria.tarifaAlta * cantidadNoches) + ". Equivale a una tarifa de USD " + categoria.tarifaAlta + " por noche.")
    }
}

cotizarEstadia(habitacionACotizar, fechaLlegada, cantidadNoches);

// Se guardan las reservas en un array
let reservas = []
let numeroReserva = 1; // En el futuro se podrá usar para que cada reserva tengo su ID

class Reserva {
    constructor(numero, pasajero, fecha, noches, categoria){
        this.numero = numero;
        this.pasajero = pasajero;
        this.fecha = fecha;
        this.noches = noches;
        this.categoria = categoria;
        this.activa = "si"; // Función adicional a desarrollar: cancelar una reserva
    }
    mostrarReserva(){
        alert(this.pasajero + ", tu reserva está confirmada con el número " + this.numero + ". Te esperamos el " + this.fecha); // Se puede agregar un condicional según si está o no vigente
    }
    cancelarReserva(){
        this.activa = "no";
    }
}

// Confirmar reserva
let confirmacion = prompt("Desea confirmar la reserva? S / N");

if (confirmacion == "S"){
    let pasajero = prompt("Ingresa tu nombre completo: ");
    confirmarReserva(pasajero,cantidadNoches);
}
else{
    alert("Reserva abandonada. Esperamos recibirte en otra oportunidad");
};

function confirmarReserva(pasajero,cantidadNoches){
    let reservaNueva = new Reserva (numeroReserva, pasajero, fechaLlegada, cantidadNoches, habitacionACotizar['categoria']);
    reservas.push(reservaNueva);
    reservaNueva.mostrarReserva()
    numeroReserva ++;
}

console.log(reservas);