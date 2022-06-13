// Se inicializan las variables (objetos "RESERVAS" y "HABITACIONES" están en el archivo objetos.js)
let fechaLlegada, cantidadNoches, mes, totalEstadia, cotizacion, filtro, tipoCambio;
let pasajero = "";
let moneda = "USD";

// Definición de elementos del DOM
let contenedorHab = document.getElementById("habitaciones");
let cotizador = document.getElementById("cotizador");
let formularioCotizacion = document.getElementById("formulario");
let respuestaCotizacion=document.getElementById("respuestaCotizacion")
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

//////////////////////////
// OPCION 1: COTIZADOR //
/////////////////////////
function iniciarCotizador(){
    // Agrega una lista de habitaciones en forma de cards, con precios en ARS o USD  a elección
    calcularTarifasHabitaciones()

    // Genera dinámicamente el dropdown en el formulario de cotización para elegir la categoría de habitación
    insertarCategorias(habitaciones)

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
    let email = document.querySelector("#email").value;
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
        cotizacion = document.createElement("div");
        respuestaCotizacion.append(cotizacion);
        respuestaCotizacion.classList.add("whiteCard");
        cotizacion.innerHTML = `
                                <p class=>El total de tu estadia de ${cantidadNoches} ${noches} en categoría ${categoria} desde el ${checkIn.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} es de USD ${totalEstadia}.
                                Equivale a una tarifa de USD ${totalEstadia / cantidadNoches} por noche.</p>
                                <button class="btn btn-light" id="botonConvertir">Convertir a ARS</button>
                                `

        // Permite ver el importe en pesos argentinos
        let botonConvertir = document.querySelector("#botonConvertir")
        let bloquePrecio = document.getElementById("bloquePrecio")

        botonConvertir.onclick = () => {
            mostrarCotiPesos(totalEstadia, bloquePrecio)

            // Desplaza el bloque después del bloque cotización
            cotizacion.appendChild(bloquePrecio)
         };

        // Graba la cotización en un objeto provisorio "Reserva" y en storage para retomarla en la pantalla siguiente
        let reservaNueva = new Reserva (numeroReserva, pasajero, email, checkIn, cantidadNoches, categoria, "en curso", totalEstadia);
        localStorage.setItem("quote", JSON.stringify(reservaNueva));
    
        // Mostrar los botones confirmar // reset // volver al inicio
        botonesCotizacion.classList.toggle("oculto"); 
    
        // Al apretar el boton Reset, se borra los datos del formulario y se re-habilita el botón "submit"
        botonCotizacionReset.onclick = () => {
            reiniciarCotizador()
            // Pre-completa el nombre del pasajero y su email
            document.querySelector("#nombre").value = pasajero;
            document.querySelector("#email").value = email;
            botonCotizar.disabled = false;
        };
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

function reiniciarCotizador(){
    // Borra el elemento del HTML con la coti existente, si la hay
    cotizacion && cotizacion.remove();
    seccionCotizacion.innerHTML="";
    respuestaCotizacion.classList.remove("whiteCard");
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
                let id = reserva.numero;          
                let botonCancelar = document.getElementById(`botonCancelar${id}`);
                botonCancelar.classList.toggle("oculto");
                botonCancelar.onclick = () => {cancelar(reserva)}
            })
        }
        }
}

function cancelar(reserva){
    reserva.status="cancelada";
    console.table(reservas);
    Swal.fire({
        title: '¿Estás seguro de querer cancelar tu reserva?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonColor: "grey",
        confirmButtonText: 'Sí, cancelar'
      }).then((result) => {
        // Se solicita el email del usuario para confirmar su identidad antes de cancelar
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Para confirmar, ingresa el email asociado a tu reserva',
                html: '<input type="email" id="emailIngresado" class="swal2-input" placeholder="email">',
                confirmButtonText: 'Validar',
                preConfirm: () => {
                    let emailIngresado = Swal.getPopup().querySelector("#emailIngresado").value;
                    if(!emailIngresado){
                        Swal.showValidationMessage('Por favor ingresa la dirección de email que ingresaste en el momento de reservar')
                    }
                    return {emailIngresado: emailIngresado}
                }
            }).then((result) => {
                // Si el email es correcto, la reserva se cancela y se vuelve al inicio del cotizador
                if (result.value.emailIngresado == reserva.email){
                    Swal.fire({
                    title: 'Reserva cancelada!',
                    text: 'Tu reserva está cancelada. Esperamos recibirte en otra oportunidad',
                    icon: 'success',
                    footer: '<a href="reservas.html">Hacer una nueva reserva</a>'
                    })  
                    // Volver al inicio
                    respuestaConsulta.innerHTML=""; 
                    consultas.classList.toggle("oculto");
                    botonVolverInicio.classList.toggle("oculto");
                    habilitarSeccion(menuOperaciones);
                } 
                else{
                    Swal.fire({
                        title: 'El email no corresponde al que tenemos en sistema',
                        text: 'Tu reserva sigue activa. Para cancelarla, podés intentar nuevamente con otro email o llamarnos al 11 5280 6100',
                        icon: 'error'
                    })
                }
            })   
        }
      })
}

////////////////////////////////////////////////////////
// FUNCIONES PARA HABILITAR Y DESHABILITAR SECCIONES //
///////////////////////////////////////////////////////
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

function habilitarSeccion(seccion){
    seccion.style.opacity = 1;
    let bt = seccion.getElementsByTagName("button");
    for (const boton of bt){
        boton.disabled = false;
    }
}


//  CONVERSION MONEDA DESDE LA API DOLAR ARGENTINA
let APIurl = `https://api-dolar-argentina.herokuapp.com/api/dolaroficial`

// Convierte las tarifas en USD de la lista de habitaciones a ARS
function calcularTarifasHabitaciones(){
    fetch(APIurl)
        .then(response => response.json())
        .then(result => {
            tipoCambio = result.compra;
            console.log("Tipo de cambio ARS/USD " + tipoCambio);
            mostrarHabitaciones();        
        })
        .catch(error => console.log('error ', error))
}

function mostrarHabitaciones(){
    for (const hab of habitaciones){
        // Se crea la card para cada habitación
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
                                            <td >Tarifa Temporada Alta</td>
                                            <td id="tarifaAlta${hab.id}">USD ${hab.tarifaAlta}</td>
                                        
                                        </tr>
                                        <tr>
                                            <td>Tarifa Temporada Alta</td>
                                            <td id="tarifaBaja${hab.id}">USD ${hab.tarifaBaja}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
        `
        contenedorHab.append(card);
    }

    let moneda, tarifaAltaPesos, tarifaBajaPesos;
    let seleccion = document.querySelector("#selectMoneda");

    seleccion.onchange = (  ) => {
        moneda = seleccion.value;
        for (const hab of habitaciones){
            let filaTarifaAlta = document.getElementById(`tarifaAlta${hab.id}`);
            let filaTarifaBaja = document.getElementById(`tarifaBaja${hab.id}`);

            if (moneda == "ARS"){
                // Calcular los precios de las habitaciones en AR$
                // tarifaAltaPesos = (tipoCambio * hab.tarifaAlta).toFixed(2);

                tarifaAltaPesos = new Intl.NumberFormat("en-US", {style:"currency", currency:"ARS"}).format(hab.tarifaAlta*tipoCambio);
                tarifaBajaPesos = new Intl.NumberFormat("en-US", {style:"currency", currency:"ARS"}).format(hab.tarifaBaja*tipoCambio);

                filaTarifaAlta.innerText = tarifaAltaPesos;
                filaTarifaBaja.innerText = tarifaBajaPesos;
            }

            else if (moneda == "USD"){
                // Volver a mostrar los precios en USD en USD
                filaTarifaAlta.innerText = moneda + " " + hab.tarifaAlta;
                filaTarifaBaja.innerText = moneda + " " + hab.tarifaBaja;
            }
        }
        
    }
           
}

// Convierte una cotizacion de USD a ARS y la inserta en el bloque indicado
function mostrarCotiPesos(importeEnUSD, bloque){
    fetch(APIurl)
        .then(response => response.json())
        .then(result => {
            tipoCambio = result.compra;
            mostrarTarifaARS(importeEnUSD, tipoCambio, bloque);     
        })
        .catch(error => console.log('error ', error))
}

function mostrarTarifaARS(importeEnUSD, tipoCambio, bloque){
    let importeEnARS = new Intl.NumberFormat("en-US", {style:"currency", currency:"ARS"}).format(importeEnUSD*tipoCambio);
    let texto = `USD ${importeEnUSD} = ${importeEnARS} a tipo de cambio de hoy ${DateTime.now().toLocaleString()}`
    bloque.innerHTML = `<p class="small text-muted">${texto}</p>`;
}

