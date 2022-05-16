// Declaración de clases : Habitacion y Reserva
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

class Reserva {
    constructor(numero, pasajero, checkin, noches, categoria, totalEstadia){
        this.numero = numero;
        this.pasajero = pasajero;
        this.checkin = checkin;
        this.noches = noches;
        this.categoria = categoria;
        this.totalEstadia = totalEstadia;
        this.activa = true; // Función adicional a desarrollar: cancelar una reserva
    }
    // Método para imprimir la reserva por Alerta
    mostrarReserva(){
        alert(this.pasajero + ", tu reserva está confirmada con el número " + this.numero + ". Te esperamos el " + this.checkin); // Se puede agregar un condicional según si está o no vigente
    }
    // Método para cancelar la reserva
    cancelarReserva(){
        this.activa = false;
    }
}

// INICIALIZACIÓN DE VARIABLES

// Se cargan tres habitaciones de clase Habitacion en un array
const standard = new Habitacion("Standard", 110, 90);
const superior = new Habitacion("Superior", 110, 140);
const suite = new Habitacion("Suite", 150, 300);

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
let listaHabitaciones = "";
let fechaLlegada;
let cantidadNoches;
let mes;
let habitacionACotizar = {};
let totalEstadia;
let textoInicial = "Bienvenido a nuestro sistema de reservas online \n\nIngresa el número de opción deseada:\n\n 1. Cotizar una estadía\n 2. Consultar si tenés una reserva activa\n 3. Cancelar una reserva";


// Pedir al usuario la categoria y buscarla en el array de habitaciones - Retorna un objeto Habitación
function solicitarCategoria(){
    // Genera la lista de habitaciones
    let counter = 1;
    for (item of habitaciones){
        listaHabitaciones += counter + ". " + item["categoria"] + "\n"; 
        counter ++;
    }
    let numeroHabitacion;
    do{
        numeroHabitacion = parseInt(prompt("¿En qué categoría estás interesado? Ingresá el número: \n" + listaHabitaciones)); 
        habitacionACotizar = habitaciones[numeroHabitacion - 1];
    }while (habitacionACotizar == undefined);
    return habitacionACotizar;
}

// Obtener fechas de estadías
// Solicitar al usuario una fecha de llegada - Se extrae el mes
function solicitarFechas(){
    fechaLlegada = prompt("Muchas gracias. Ahora por favor indicanos desde cuando querés hospedarte, en formato DD/MM/AAAA");
    let mes = parseInt(fechaLlegada[3] + fechaLlegada[4]);
    
    while (fechaLlegada.length != 10 || isNaN(mes) || (mes > 13 || mes < 1)){
        fechaLlegada = prompt("Disculpas. No entiendo la fecha que ingresaste. Por favor, ingresar una fecha con el formato DD/MM/AAAA");
        mes = parseInt(fechaLlegada[3] + fechaLlegada[4]);
    };
    
    // Solicitar al usuario una cantidad de noches
    cantidadNoches = parseInt(prompt("¿Cuántas noches te gustaría quedarte con nosotros?"))
    
    // Agrega "s" a la palabra noche según la cantidad elegida
}

// Funcion cotizar estadía
function cotizarEstadia(categoria, fechaLlegada, cantidadNoches){
    // Cotiza la estadía y devuelve el total
    let noches = "noche";
    if (cantidadNoches > 1){
        noches += "s";
    }    
    if (temporadaBaja.includes(mes)){
        totalEstadia = categoria.tarifaBaja * cantidadNoches;
        alert ("El total de tu estadia de " + cantidadNoches + " " + noches + " en categoría " + categoria["categoria"] + " desde el " + fechaLlegada + " es de " +  totalEstadia + ". Equivale a una tarifa de " + categoria.tarifaBaja + " por noche.")
    } 
    else{
        totalEstadia = categoria.tarifaAlta * cantidadNoches;
        alert ("El total de tu estadia de " + cantidadNoches + " " + noches + "  en categoría " + categoria["categoria"] + " desde el " + fechaLlegada + " es de " + totalEstadia + ". Equivale a una tarifa de USD " + categoria.tarifaAlta + " por noche.")
    }
}

// Function Confirmar reserva
function confirmarReserva(categoria, noches, checkin, total){
    let confirmacion = prompt("Desea confirmar la reserva? S / N").toUpperCase();
    if (confirmacion == "S"){
        let pasajero = prompt("Ingresa tu nombre completo: ");
        let reservaNueva = new Reserva (numeroReserva, pasajero, checkin, noches, categoria, total);
        reservas.push(reservaNueva);
        reservaNueva.mostrarReserva()
        numeroReserva ++;
    }
    else{
        alert("Reserva abandonada. Esperamos recibirte en otra oportunidad");
    };
    console.table(reservas);
}

// Filtrar reservas por nombre de pasajero
function filtrarReservas(filtro){
    // Opción 1 : Buscar por nombre
    if (filtro == 1){
        let nombre = prompt("Ingresa tu nombre completo");
        let reservasFiltradas = reservas.filter((reserva) => reserva.pasajero == nombre);
        if(reservasFiltradas.length == 0){
            alert("No hay reservas activas con este nombre");
        }
        else{
            // Se verifica si las reservas encontradas están activas
            let reservasFiltradasActivas = reservasFiltradas.filter(reserva => reserva.activa);
            if (reservasFiltradasActivas.length == 0){
                alert("No hay reservas activas con este nombre");
                return false;
            }
            else{
                alert("Hay reserva(s) con este nombre : \n");
                reservasFiltradasActivas.forEach(reserva => {
                    alert(`Reserva # ${reserva.numero}\nFecha de llegada ${reserva.checkin}\nCantidad de noches: ${reserva.noches}\nCategoria:  ${reserva.categoria}\nValor total de la estadía:  ${reserva.totalEstadia}`)
                })
                console.table(reservasFiltradasActivas);
                return true;
            }
            }
        }
    else if (filtro == 2){
        let id = parseInt(prompt("Ingresa el número de reserva"));
        let reservasFiltradas = reservas.filter((reserva) => reserva.numero == id);
        if(reservasFiltradas.length == 0){
            alert("No hay reservas activas con este número");
        }
        else{
            // Se verifica si las reservas encontradas están activas
            let reservasFiltradasActivas = reservasFiltradas.filter(reserva => reserva.activa);
            if (reservasFiltradasActivas.length == 0){
                alert("No hay reservas activas con este nombre");
                return false;
            }
            else{
                alert("Hay reserva(s) con este nombre : \n");
                reservasFiltradasActivas.forEach(reserva => {
                    alert(`Reserva # ${reserva.numero}\nFecha de llegada ${reserva.checkin}\nCantidad de noches: ${reserva.noches}\nCategoria:  ${reserva.categoria}\nValor total de la estadía:  ${reserva.totalEstadia}`)
                })
                console.table(reservasFiltradasActivas);
                return true;
            }
        }
    }
}

// Función Cancelar Reserva por número de reserva -- AGREGAR CONDICIONAL SEGUN SI LA RESERVA ESTA ACTIVA
function cancelar(){
    let entrada = prompt("Para cancelar tu reserva, ingresa el número a continuación. Ingresa ESC para salir");
    if (entrada != "ESC"){
        let reservaEncontrada = reservas.find((reserva) => reserva.numero == entrada);
        if (reservaEncontrada){
            if (reservaEncontrada.activa){
                reservas[reservas.findIndex((reserva) => reserva.numero == entrada)].cancelarReserva();
                alert("Reserva Cancelada");
            }
            else{
                alert("Esta reserva ya se encontraba cancelada");
            }
            console.log("Reservas activas: ");
            console.table(reservas.filter((reserva) => reserva.activa));
            console.log("********************");
            console.log("Reservas canceladas: ");
            console.table(reservas.filter((reserva) => !reserva.activa));
            
        }
        else{
            entrada = prompt("No hay ninguna reserva con este número. Chequealo e ingresa el número a continuación. Ingresa ESC para salir");
        }
    }
}

// Funcion Seguir Cotizando - Consulta al usuario si desea continuar -- VER SI SE PUEDE MEJORAR CON UN BOOLEANO
function seguirCotizando(entrada){
    if(entrada != "N"){
        texto = "Ingresa el número de opción deseada\n 1. Cotizar una estadía\n 2. Consultar si tenés una reserva activa\n 3. Cancelar una reserva \n";
        iniciarCotizador(texto);
    }
    else{
        alert("Muchas gracias. Hasta pronto");
        return;
    }
}

// Function Validar Entrada
function validarEntrada(array, entrada, menu){
    while(array.indexOf(entrada) == -1){
        entrada = parseInt(prompt("No entendí la opción elegida." + menu));
    }
}

// Function Iniciar Cotizador
function iniciarCotizador(texto){
    let opcion = parseInt(prompt(texto));
    let opciones = [1, 2, 3];

    while (opciones.indexOf(opcion) == -1){
        textoError = "No entendí la opción elegida. Por favor ingresa el número de opción deseada\n 1. Cotizar una estadía\n 2. Consultar si tenés una reserva activa\n 3. Cancelar una reserva \n Ingresa ESC para salir";
        opcion = prompt(textoError);
        if (opcion == "ESC"){
            seguirCotizando("N");
            return;
        }
        else{
            opcion = parseInt(opcion);
        }
    }

    opcion = parseInt(opcion);
    // Opcion 1 : Cotiza una habitación: primero solicita la categoría, despues las fechas
    if (opcion == 1){
        solicitarCategoria();   
        solicitarFechas();
        cotizarEstadia(habitacionACotizar, fechaLlegada, cantidadNoches);
        // Confirma la reserva 
        confirmarReserva(habitacionACotizar["categoria"], cantidadNoches, fechaLlegada, totalEstadia);
        let entrada = (prompt("¿Deseas realizar otra operación? S/N")).toUpperCase();
        seguirCotizando(entrada);
    }

    // Opción 2: Muestras las reservas por nombre o por número de reserva
    else if (opcion == 2){      
        let menu =  "¿Querés ver si tenés una reserva activa? \n¿Cómo querés buscar tu reserva?\n 1. Por nombre completo\n 2. Por número de reserva \nIngresa 0 para volver al menú anterior";
        let criterio = parseInt(prompt(menu));
        
        opciones = [0, 1, 2];        

        while (opciones.indexOf(criterio) == -1){
            textoError = "No entendí la opción elegida" + menu;
            criterio = parseInt(prompt(textoError));
        }
        
        // Regresar al menu anterior
        if (criterio == 0){
            seguirCotizando("S");
        }
        
        else{
            filtrarReservas(criterio);
            let entrada = (prompt("¿Deseas realizar otra operación? S/N")).toUpperCase();
            seguirCotizando(entrada);
        }
    }

    // Opción 3: Permite cancelar una reserva
    else if (opcion ==3){
        let preFiltro = parseInt(prompt("Ingresa:\n1. Para buscar tu número de reserva en sistema,\n 2. Si ya conoces tu número de reserva \nIngresa 0 para volver al menú anterior"));
        opciones = [0, 1, 2];

        // Opcion inválida
        while (opciones.indexOf(preFiltro) == -1){
            textoError = "No entendí la opción elegida. Por favor ingresa el número de opción deseada\n 1. Para buscar tu número de reserva en sistema,\n 2. Si ya conoces tu número de reserva \nIngresa 0 para volver al menú anterior";
            preFiltro = parseInt(prompt(textoError));
        }
        
        // Regresar al menu anterior
        if (preFiltro == 0){
            seguirCotizando("S");
        }
        if(preFiltro == 2){
            cancelar()
        } 
        // Si el usuario no tiene su número de reserva, utiliza la función filtrarReservas para buscar la reserva por nombre. Permite cancelarla solamente si existe (filtrarReservas devuelve TRUE)
        else if(preFiltro == 1){
            if(filtrarReservas(preFiltro)){            
                cancelar();
            }
        } 
        let entrada = (prompt("¿Deseas realizar otra operación? S/N")).toUpperCase();
        seguirCotizando(entrada);       
    }   
}
// Invocación de funciones
//  Muestra por consola las tarifas de todas las habitaciones
for (const habitacion of habitaciones){
    console.log(habitacion.verTarifas());
}

iniciarCotizador(textoInicial);








