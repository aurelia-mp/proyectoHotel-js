// Se inicializan las variables (objetos "RESERVAS" y "HABITACIONES" están en el archivo objetos.js)
let fechaLlegada, cantidadNoches, mes, totalEstadia, cotizacion, filtro, tipoCambio;
let pasajero = "";
let moneda = "USD";


// Definición de elementos del DOM
let contenedorHab = document.getElementById("habitaciones");
let respuestaCotizacion=document.getElementById("respuestaCotizacion");
let botonesCotizacion = document.getElementById("botones");
let botonCotizar = document.getElementById("botonCotizar");
let botonVolverInicio = document.getElementById("botonVolverInicio");
let consultas = document.getElementById("consultas");
let respuestaConsulta = document.getElementById("respuestaConsulta");
let menuOperaciones = document.getElementById("menuOperaciones");
let campoCheckIn = document.getElementById("fechaCheckIn");
let campoCheckOut = document.getElementById("fechaCheckOut");

// Mide la altura de los elementos de la parte superior del sitio para el scroll
let alturaNav = document.getElementById("navbar").offsetHeight;
let alturaHeader=document.getElementById("headerReservas").offsetHeight;
let alturaMenu = menuOperaciones.offsetHeight;

// Se crea una lista de habitaciones en forma de cards, con precios en ARS o USD  a elección
calcularTarifasHabitaciones();

// Genera dinámicamente el dropdown en el formulario de cotización para elegir la categoría de habitación
insertarCategorias(habitaciones);

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
    let cotizador = document.getElementById("cotizador");
    let formularioCotizacion = document.getElementById("formulario");

    // Aparece el cotizador y el boton para elegir otra operación
    cotizador.classList.toggle("oculto");
    botonVolverInicio.classList.toggle("oculto");
    botonesCotizacion.classList.toggle("d-none");

    // Se desplaza a la sección Cotizar
    window.scrollTo(0, alturaNav+alturaHeader+alturaMenu);

    // Al enviar el formulario, se cotiza la estadía con los datos ingresados
    formularioCotizacion.addEventListener("submit", cotizarEstadia);
}

// En el formulario, posiciona la fecha de check out automáticamente después del check in
function setMinCheckOut() {
    campoCheckOut.setAttribute("min", campoCheckIn.value);
}

// Funcion cotizar estadía - Asociada al evento SUBMIT en el formulario de cotización
function cotizarEstadia(e){
    console.table(reservas);
    e.preventDefault();

    let pasajero = document.querySelector("#nombre").value;

    let email = document.querySelector("#email").value;
    let numeroCategoria = document.querySelector("#menuCategoria").value;

    // Se utiliza Luxon para tomar validar la fecha de check in. 
    // Se modifica la instancia today para que tome las 0hs de hoy, para permitir reservas para hoy mismo
    let hoy = today.startOf('day');

    // Transforma el valor del campo check in en una instancia de Date Time
    let checkIn = transformarEnFecha(campoCheckIn.value);
    let checkOut = transformarEnFecha(campoCheckOut.value);

    const Interval = luxon.Interval;

    // Cálculo de la anticipación de reserva
    let intervalo = Interval.fromDateTimes(hoy, checkIn);
    let anticipacionReserva = intervalo.length('days');
    
    let mes = checkIn.month;
    let intervaloNoches = Interval.fromDateTimes(checkIn, checkOut);
    let cantidadNoches = intervaloNoches.length('days');


    // VALIDACIONES DEL FORMULARIO
    // Validar fecha check in: No permitir fecha anterior a hoy
    if(checkIn  < hoy ){
        Swal.fire(
            'Fecha de llegada inválida',
            'Por favor, verifica que la fecha ingresada sea mayor o igual a hoy',
            'error'
          );
        campoCheckIn = document.getElementById("fechaCheckIn");
        checkIn = transformarEnFecha(campoCheckIn.value);
    }
    
    // Validar que el campo nombre no tenga números
    else if (!validarTexto(pasajero)){
        Swal.fire(
            'Nombre inválido',
            'Por favor, verifica que el nombre ingresado no contenga números',
            'error'
          );
        pasajero = document.querySelector("#nombre").value;
    }

    // Validar que se haya elegido una categoría del dropdown
    else if (isNaN(numeroCategoria)){
        Swal.fire(
            'Elegí una categoría de habitación',
            'Por favor, elegí una categoría del menú desplegable',
            'error'
          );
        numeroCategoria = document.querySelector("#menuCategoria").value;
    }

    // Validar que la cantidad de noches no es superior al máximo de noches (definido en Objetos)
    else if(cantidadNoches > MaximoNoches){
        Swal.fire({
            icon: 'error',
            title: 'Cantidad de noches inválida',
            html: `Lamentablemente, no aceptamos estadías de más de ${MaximoNoches} noches`
            })
        cantidadNoches = document.querySelector("#cantidadNoches").value;
    }

    else if(anticipacionReserva > MaximoAnticipacion){
        Swal.fire({
            icon: 'error',
            title: 'Fechas de estadía inválidas',
            html: `Lamentablemente, no aceptamos reservas más de ${MaximoAnticipacion} días antes de la llegada`
            });
        anticipacionReserva = document.querySelector("#anticipacionReserva").value;
    }
    // TERMINAN LAS VALIDACIONES 

    else{ 
        botonCotizar.disabled=true;

        // Agrega un s a "noche" si son más de 1 noche
        let noches = "noche";
        (cantidadNoches > 1) && (noches += "s");
        
        // Se guarda un nuevo objeto habitacionACotizar buscando la categoría elegida por el usuario en el array de habitaciones
        let habitacionACotizar = habitaciones[numeroCategoria];
        let categoria = habitacionACotizar.categoria;
        
        // Cotiza la estadía y devuelve el total
        let tarifasCalculadas = calcularEstadia(habitacionACotizar, mes, cantidadNoches, anticipacionReserva);
        let totalEstadiaDescuento = tarifasCalculadas[1];
        let nombrePromo = (tarifasCalculadas[2] || "No aplican promociones");

        cotizacion = document.createElement("div");
        respuestaCotizacion.append(cotizacion);
        cotizacion.innerHTML = ` <table class="table table-stripped"> 
                                    <thead>
                                        <tr>
                                            <td>Check in</td>
                                            <td>Check out</td>
                                            <td>Noches</td>
                                            <td>Tarifa por noche (USD)</td>
                                            <td>Total Estadía (USD)</td>
                                            <td>Promoción aplicada</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>${checkIn.toLocaleString(DateTime.DATE_SHORT)}</td>
                                            <td>${checkOut.toLocaleString(DateTime.DATE_SHORT)}</td>
                                            <td>${cantidadNoches}</td>
                                            <td>${totalEstadiaDescuento / cantidadNoches}</td>
                                            <td>${totalEstadiaDescuento}</td>
                                            <td>${nombrePromo}</td>
                                            <td><button class="btn btn-light" id="botonConvertir">Convertir a ARS</button></td>
                                        </tr>
                                    </tbody>
                                </table>`;
        

        // Permite ver el importe en pesos argentinos
        let botonConvertir = document.querySelector("#botonConvertir");
        let bloquePrecio = document.getElementById("bloquePrecio");

        botonConvertir.onclick = () => {
            mostrarCotiPesos(totalEstadiaDescuento, bloquePrecio);

            // Desplaza el bloque después del bloque cotización
            cotizacion.appendChild(bloquePrecio);
         };

        // Graba la cotización en un objeto provisorio "Reserva" y en storage para retomarla en la pantalla siguiente
        let reservaNueva = new Reserva (numeroReserva, pasajero, email, checkIn, cantidadNoches, categoria, "en curso", totalEstadiaDescuento);
        localStorage.setItem("quote", JSON.stringify(reservaNueva));
    
        // Mostrar los botones confirmar // reset // volver al inicio
        botonesCotizacion.classList.toggle("d-none");

        // Al apretar el boton Reset, se borra los datos del formulario y se re-habilita el botón "submit"
        let botonCotizacionReset = document.getElementById("botonReset");
        botonCotizacionReset.onclick = () => {
            reiniciarCotizador();
            // Pre-completa el nombre del pasajero y su email
            document.querySelector("#nombre").value = pasajero;
            document.querySelector("#email").value = email;
            botonCotizar.disabled = false;
        };
    }
}

function  calcularEstadia(habitacionACotizar, mes, cantidadNoches, anticipacionReserva){
    // Se guardan las variables tarifaBaja y tarifaAlta desestructurando el obj habitacionACotizar
    let {tarifaBaja, tarifaAlta} = habitacionACotizar;

    console.log("Todas las Promos")
    Promos.forEach (promo => {
        console.table(promo);
    })

    console.log("----------------------------------");
    console.log("Cantidad de noches: " + cantidadNoches);
    console.log("Anticipación de Reserva: " + anticipacionReserva);

    // Filtramos el array promos para obtener solo las promos aplicables   
    let promosAplicables = Promos.filter((promo) => promo.minNoches < cantidadNoches && promo.maxNoches > cantidadNoches && promo.minAnticipacion < anticipacionReserva && promo.maxAnticipacion > anticipacionReserva);
    let nombrePromoAplicada,totalConDescuento, totalRack;

    console.log("Promos Aplicables")
    promosAplicables.forEach(promo =>
        console.table(promo));

    if (promosAplicables.length > 0){
        // Ordena el array de promos aplicables por orden descendiente de descuento
        promosAplicables.sort((a,b) =>{
            return b.descuento - a.descuento;
        })
        let descuento = promosAplicables[0].descuento;
        nombrePromoAplicada = promosAplicables[0].nombre;
        console.log("Descuento a aplicar : " + descuento);


        if (temporadaAlta.includes(mes)){
            totalRack = tarifaAlta * cantidadNoches;
            totalConDescuento = tarifaAlta * (1 - (descuento / 100)) * cantidadNoches;
        }

        else{
            totalRack = tarifaBaja * cantidadNoches;
            totalConDescuento = tarifaBaja * (1 - (descuento /100)) * cantidadNoches;
        }
    }

    else{
        nombrePromoAplicada = "";
        if (temporadaAlta.includes(mes)){
            totalRack = tarifaAlta * cantidadNoches;
            totalConDescuento = totalRack;
        }

        else{
            totalRack = tarifaBaja * cantidadNoches;
            totalConDescuento = totalRack;
        }
    }

    // La función retorna el total de la estadia con descuento y el nombre de la promoción aplicada
    return [totalRack, totalConDescuento, nombrePromoAplicada];
}

// Function insertarCategorias para el dropdown del formulario de cotizacion
function insertarCategorias(lista){
    let menu = document.getElementById("menuCategoria");
    let counter = 0;

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
    respuestaCotizacion.classList.remove("whiteCard");
    botonesCotizacion.classList.toggle("d-none");
    formulario.reset();
    botonCotizar.disabled=false;
}


//  CONVERSION MONEDA DESDE LA API DOLAR ARGENTINA
// Convierte las tarifas en USD de la lista de habitaciones a ARS
function calcularTarifasHabitaciones(){
    fetch(APIurl)
        .then(response => response.json())
        .then(result => {
            tipoCambio = result.compra;
            console.log("Tipo de cambio ARS/USD " + tipoCambio);
            mostrarHabitaciones();        
        })
        .catch(error => console.log('error ', error));
}

function mostrarHabitaciones(){
    for (const hab of habitaciones){
        // Se crea la card para cada habitación
        let card = document.createElement("div");

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
                                            <td >Tarifa Rack Temporada Alta</td>
                                            <td id="tarifaAlta${hab.id}">USD ${hab.tarifaAlta}</td>
                                        
                                        </tr>
                                        <tr>
                                            <td>Tarifa Rack Temporada Alta</td>
                                            <td id="tarifaBaja${hab.id}">USD ${hab.tarifaBaja}</td>
                                        </tr>
                                    </tr>
                                    </table>
                                    
                                </div>
                            </div>
                        </div>`;
        contenedorHab.append(card);
    }

    let moneda, tarifaAltaPesos, tarifaBajaPesos;
    let seleccion = document.querySelector("#selectMoneda");

    seleccion.onchange = () => {
        moneda = seleccion.value;
        for (const hab of habitaciones){
            let filaTarifaAlta = document.getElementById(`tarifaAlta${hab.id}`);
            let filaTarifaBaja = document.getElementById(`tarifaBaja${hab.id}`);

            if (moneda == "ARS"){
                // Calcular los precios de las habitaciones en AR$

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
           
    // Agrega Sweet Alert con tabla de promociones
    let divPromociones = document.createElement("div");
    divPromociones.innerHTML = `<p class="text-muted small">Tarifas RACK - Consultá aquí las <span class="link-primary" id="btnPromos">promociones</span> por reserva anticipada o estadías prolongadas</p>`
    contenedorHab.append(divPromociones);
    let botonPromos = document.getElementById("btnPromos");
    botonPromos.onclick = () => {
        Swal.fire({
            icon: 'info',
            title: 'Promociones vigentes',
            html:  crearHTMLPromos(),
            footer: 'Se aplicará automáticamente la mejor promoción disponible'
        });
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
        .catch(error => console.log('error ', error));
}

function mostrarTarifaARS(importeEnUSD, tipoCambio, bloque){
    let importeEnARS = new Intl.NumberFormat("en-US", {style:"currency", currency:"ARS"}).format(importeEnUSD*tipoCambio);
    let texto = `USD ${importeEnUSD} = ${importeEnARS} a tipo de cambio oficial de hoy ${DateTime.now().toLocaleString()}`;
    bloque.innerHTML = `<p class="small fs-5 text-muted">${texto}</p>`;
}

// Función para renderizar la tabla de promociones
function crearHTMLPromos(){
    tablaPromos = `<table class="my-5 table table-primary table-striped fs-5">
                    <thead>
                        <tr>
                            <td>Nombre</td>
                            <td>Descuento</td>
                        </tr>
                    </thead>
                    <tbody>`;
    Promos.forEach(promo => {
        tablaPromos += `
                    <tr>
                        <td>${promo.nombre}</td>
                        <td>${promo.descuento}%</td>
                    </tr> `;
    }); 
    tablaPromos += "</tbody></table>";
    return tablaPromos;
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
    let opcionNombre = document.getElementById("opcionNombre");
    let opcionId = document.getElementById("opcionId");

    opcionNombre.onclick = () => {filtrarReservas(reservas, 1)};
    opcionId.onclick = () => {filtrarReservas(reservas, 2)};
};

function filtrarReservas(array, filtro){
    let opcionesConsulta = document.getElementById("opcionesConsulta");
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
                let impresionReserva = document.createElement("p");
                impresionReserva.innerHTML = renderizarReserva(reserva);
                respuestaConsulta.append(impresionReserva);
                let id = reserva.numero;          
                let botonCancelar = document.getElementById(`botonCancelar${id}`);
                botonCancelar.classList.toggle("oculto");
                console.dir(JSON.stringify(reserva));
                botonCancelar.onclick = () => {cancelar(reserva)};
            })
        }
        }
}

function cancelar(reserva){
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
                // Si el email es correcto, la reserva se cancela, se guarda el array actualizado el el storage y se vuelve al inicio del cotizador
                if (result.value.emailIngresado == reserva.email){
                    reserva.status="cancelada";
                    localStorage.setItem("reservas", JSON.stringify(reservas));
                    Swal.fire({
                    title: 'Reserva cancelada!',
                    text: 'Tu reserva está cancelada. Esperamos recibirte en otra oportunidad',
                    icon: 'success'
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
                        text: 'Tu reserva sigue activa. Para cancelarla, podés intentar nuevamente con otro email o llamarnos al 11 2345 6789',
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

