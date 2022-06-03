// Se inicializan las variables (objetos "RESERVAS" y "HABITACIONES" están en el archivo objetos.js)
let fechaLlegada;
let cantidadNoches;
let mes;
let totalEstadia;
let pasajero = "";
let cotizacion;
let filtro;

// Definición de elementos del DOM
let contenedorHab = document.getElementById("habitaciones");
let cotizador = document.getElementById("cotizador");
let formularioCotizacion = document.getElementById("formulario");
let botonesCotizacion = document.getElementById("botones");
let botonCotizar = document.getElementById("botonCotizar");
let botonCotizacionReset = document.getElementById("botonReset");
let botonVolverInicio = document.getElementById("botonVolverInicio");
let consultas = document.getElementById("consultas");
let opcionesConsulta = document.getElementById("opcionesConsulta");
let opcionNombre = document.getElementById("opcionNombre");
let opcionId = document.getElementById("opcionId");
let respuestaConsulta = document.getElementById("respuestaConsulta");
let menuOperaciones = document.getElementById("menuOperaciones");

// Mide la altura de los elementos de la parte superior del sitio para el scroll
let alturaNav = document.getElementById("navbar").offsetHeight;
let alturaHeader=document.getElementById("headerReservas").offsetHeight;
let alturaMenu = menuOperaciones.offsetHeight;

// Opción 1 del menú : Cotizador
let opcion1 = document.getElementById("opcion1");
opcion1.addEventListener("click", () => deshabilitarSeccion(menuOperaciones));
opcion1.addEventListener("click", iniciarCotizador);

// Opción 2 del menú: Consultar reserva
let opcion2 = document.getElementById("opcion2");
opcion2.addEventListener("click", () => deshabilitarSeccion(menuOperaciones));
opcion2.addEventListener("click", (e) => consultarReserva(e, reservas));

// Agrega una lista de habitaciones en forma de cards
mostrarHabitaciones(habitaciones)

// Genera dinámicamente el dropdown para elegir la categoría de habitación
insertarCategorias(habitaciones)

// Funcion para insertar cards con las habitaciones
function mostrarHabitaciones(lista){
    for (const hab of lista){
        let card = document.createElement("div")
        card.className= "row gx-5 whiteCard align-items-center flex-lg-column col-lg-6 col-xl-4 mb-3";

        card.innerHTML = `<div class="col-md-5 col-lg-12 d-flex justify-content-center">
                            <img src="${hab.img}" class="img-fluid rounded-start" alt="Foto de una habitacion ${hab.categoria}">
                            </div>
                            <div class="col-md-7 col-lg-12">
                            <div class="card-body">
                                <h3 class="card-title titulo--xl text-uppercase">${hab.categoria}</h3>
                                <div class="card-text fw-light">
                                    <p>${hab.descripcion}</p>
                                </div>
                                <div class="card-footer datosReco">
                                    <table>
                                        <tr>
                                            <td>Tarifa Temporada Alta</td>
                                            <td>${hab.tarifaAlta}</td>
                                        </tr>
                                        <tr>
                                            <td>Tarifa Temporada Alta</td>
                                            <td>${hab.tarifaBaja}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
        `
        contenedorHab.append(card);
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
    // Aparece el cotizador y el boton para elegir otra operación
    cotizador.classList.toggle("oculto");
    botonVolverInicio.classList.toggle("oculto");

    // Se desplaza a la sección Cotizar
    window.scrollTo(0, alturaNav+alturaHeader+alturaMenu);

    // Al enviar el formulario, se cotiza la estadía con los datos ingresados
    formularioCotizacion.addEventListener("submit", cotizarEstadia);
}

// Funcion cotizar estadía - Asociada al evento SUBMIT en el formulario de cotización
function cotizarEstadia(e){
    // console.table(reservas);
    e.preventDefault();

    let pasajero = document.querySelector("#nombre").value;
    let numeroCategoria = document.querySelector("#menuCategoria").value;

    // Inicializa la variable Hoy con Luxon para tomar validar la fecha de check in. 
    // Se modifica para que tome las 0hs de hoy, para permitir reservas para hoy mismo
    const today = DateTime.now();
    let hoy = today.startOf('day');

    // Transforma el valor del campo check in en una instancia de Date Time
    let campoCheckIn = document.getElementById("fechaCheckIn");
    let checkIn = transformarEnFecha(campoCheckIn.value);

    // Validar fecha: No permitir fecha anterior a hoy
    if(checkIn  < hoy ){
        Swal.fire(
            'Fecha inválida',
            'Por favor, verifica que la fecha ingresada sea mayor o igual a hoy',
            'error'
          )
        campoCheckIn = document.getElementById("fechaCheckIn");
        checkIn = transformarEnFecha(campoCheckIn.value);
    }
        
    else{ 
        // Cálculo de la anticipación de reserva - Se podrá usar a futuro para calcular descuentos por reserva anticipada
        const Interval = luxon.Interval;
        let intervalo = Interval.fromDateTimes(hoy, checkIn);
        let anticipacionReserva = intervalo.length('days');

        botonCotizar.disabled=true;

        let mes = checkIn.month;
        let cantidadNoches = parseInt(document.querySelector("#cantNoches").value);
        let noches = "noche";
    
        // Agrega un s a "noche" si son más de 1 noche
        (cantidadNoches > 1) && (noches += "s");
        
        // Se guarda un nuevo objeto habitacionACotizar buscando la categoría elegida por el usuario en el array de habitaciones
        let habitacionACotizar = habitaciones[numeroCategoria];

        // Se guardan las variables categoria, tarifaBaja y tarifaAlta desestructurando el objeto habitacionACotizar
        let {categoria, tarifaBaja, tarifaAlta} = habitacionACotizar;
        
        // Cotiza la estadía y devuelve el total
        totalEstadia = temporadaBaja.includes(mes) ? (tarifaBaja * cantidadNoches) : (tarifaAlta * cantidadNoches);
        cotizacion = document.createElement("p");
        formulario.append(cotizacion);
        cotizacion.innerHTML = `El total de tu estadia de ${cantidadNoches} ${noches} en categoría ${categoria} desde el ${checkIn.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} es de ${totalEstadia}. \nEquivale a una tarifa de ${totalEstadia / cantidadNoches} por noche.`
    
        // Grabar la cotización en un objeto provisorio "Reserva" y en storage
        let reservaNueva = new Reserva (numeroReserva, pasajero, checkIn, cantidadNoches, categoria, "en curso", totalEstadia);
        localStorage.setItem("quote", JSON.stringify(reservaNueva));
    
        // Mostrar los botones confirmar // reset // volver al inicio
        botonesCotizacion.classList.toggle("oculto"); 
    
        // Al apretar el boton Reset, se borra los datos del formulario y se re-habilita el botón "submit"
        botonCotizacionReset.onclick = () => {
            reiniciarCotizador()
            // Pre-completa el nombre del pasajero
            document.querySelector("#nombre").value = pasajero;
            botonCotizar.disabled = false;
        };
    }
}

function reiniciarCotizador(){
    // Borra el elemento del HTML con la coti existente, si la hay
    cotizacion && cotizacion.remove();

    botonesCotizacion.classList.toggle("oculto");
    formulario.reset();
    botonCotizar.disabled=false;
}

/////////////////////////
// OPCION 2 : CONSULTAS//
/////////////////////////
function consultarReserva(e, reservas){
    e.preventDefault();
    botonVolverInicio.classList.toggle("oculto");
    consultas.classList.toggle("oculto");

    // Se desplaza a la sección Consulta
    window.scrollTo(0, alturaNav+alturaHeader+alturaMenu);

    // Mostrar campo nombre o campo número de reserva según la opcion elegida en el checkbox
    opcionNombre.onclick = () => {filtrarReservas(reservas, 1)};
    opcionId.onclick = () => {filtrarReservas(reservas, 2)};
};

function filtrarReservas(array, filtro){
    opcionesConsulta.classList.toggle("oculto");
    console.table(array);
    // Opción 1 : Buscar por nombre
    if (filtro == 1){
        let formNombre = document.getElementById("formNombre");
        formNombre.classList.toggle("oculto"); 
        formNombre.addEventListener("submit", (e) => {
            e.preventDefault();
            let nombreUsuario = document.querySelector("#nombreUsuario").value;
            let reservasFiltradas = array.filter((reserva) => reserva.pasajero == nombreUsuario);
            mostrarReservas(reservasFiltradas, "nombre");
        })
    }       
    // Opción 2 : Buscar por id
    else if (filtro == 2){
        let formNumero = document.getElementById("formNumero");
        formNumero.classList.toggle("oculto"); 
        formNumero.addEventListener("submit", (e) => {
            e.preventDefault();
            let id = document.querySelector("#idReserva").value;
            let reservasFiltradas = array.filter((reserva) => reserva.numero == id);
            mostrarReservas(reservasFiltradas, "numero");
        })
    }
}

function mostrarReservas(array, parametro){
    // Caso 1: El array de reservas filtradas está vacío
    if(array.length == 0){
        respuestaConsulta.innerHTML= `No hay reservas activas con este ${parametro}`;   
    }
    // Caso 2: Hay reservas con el filtro
    else{
        // Se verifica si las reservas encontradas están activas
        let reservasFiltradasActivas = array.filter(reserva => (reserva.status =="confirmada" || reserva.status =="en curso"));
        if (reservasFiltradasActivas.length == 0){
            respuestaConsulta.innerHTML= `La(s) reserva(s) que encontramos con este ${parametro } no está(n) activa(s)`;
        }
        else{
            respuestaConsulta.innerHTML= `Hay reserva(s) con este ${parametro} : \n`;
            reservasFiltradasActivas.forEach(reserva => {
                let impresionReserva = document.createElement("p")
                impresionReserva.innerHTML = renderizarReserva(reserva)
                respuestaConsulta.append(impresionReserva);
            })
        }
        }
}

// Function para hacer aparecer o desaparecer un elemento - Por ahora no se usa, BORRAR
function toggleDisplay(elemento){
    (elemento.style.display == "block" || elemento.style.display == "") ? elemento.style.display = "none" : elemento.style.display = "block"; 
}

// Function para pasar una sección a "DESHABILITADA" - Cambia la opacidad y deshabilita los botones
function deshabilitarSeccion(seccion){
    seccion.style.opacity = 0.5;
    let bt = seccion.getElementsByTagName("button");
    for (const boton of bt){
        boton.disabled = true;
    }
}