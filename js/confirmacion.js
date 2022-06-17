// Definición de elementos del DOM
let quote = document.getElementById("reservaEnCurso");
let botonTransferencia = document.getElementById("transferencia");
let datosBancarios = document.getElementById("datosBancarios");
let tarjeta = document.getElementById("tarjeta");
let formularioTC = document.getElementById("formularioTC");

// Convierte la reserva en storage a un objeto 
let reservaEnCurso = JSON.parse(localStorage.getItem("quote"))
console.table(reservas)

// Al llegar a la página de confirmación, la reserva en curso se agrega al array de reservas
window.onload = () => {
    // Solo suma la rva si es la primera vez que se carga (evita que se sume múltiples veces si recargamos la página    )
    let id= reservaEnCurso.numero;
    let reservasFiltradas = reservas.filter((reserva) => reserva.numero == id);
    reservasFiltradas.length == 0 ? agregarReserva(reservaEnCurso) : console.log("Reserva ya ingresada");
    console.log("Nueva lista de reservas:")
    console.table(reservas)
} 

// INSERTA LA RESERVA DESDE LA COTIZACIÓN GUARDADA EN STORAGE
quote.innerHTML = renderizarReserva(reservaEnCurso)

/////////////////////////////////////////////
// PAGO OPCIÓN 1 : TRANSFERENCIA BANCARIA ///
/////////////////////////////////////////////

botonTransferencia.onclick = () => {
    // Oculta el formulario de TC si éstos están visibles
    (!formularioTC.classList.contains("d-none")) && formularioTC.classList.add("d-none")

    // MUESTRA DATOS DE LA CUENTA BANCARIA SI SE ELIGE "TRANSFERENCIA"
    mostrarDatosBancarios();

    reservas.push(reservaEnCurso);
}

async function mostrarDatosBancarios(){
    // Busca el tipo de cambio usando un API
    const response = await fetch (APIurl);
    const data = await response.json();
    tipoCambio = data.compra;
    console.log("Tipo de cambio ARS/USD " + tipoCambio);
    let importeFormateadoPesos = new Intl.NumberFormat().format(reservaEnCurso.totalEstadia * tipoCambio)
    let importeFormateadoUSD = new Intl.NumberFormat().format(reservaEnCurso.totalEstadia)

    // Muestra los datos bancarios y el importe a abonar en pesos
    datosBancarios.innerHTML = `
    <p class="my-3">Datos para realizar la transferencia: </p>
    <ul>
        <li>Cuenta corriente en pesos 1111-12033333</li>
        <li>Titular de la cuenta: Palo Santo S.A.</li>
        <li>CUIT: 30-12345677-8</li>
        <li>CBU: 200000300049506070211</li>
        <li>Número de reserva: <span id="campoNumeroReserva"></span></li>
        <li>Importe a transferir: USD ${importeFormateadoUSD} / <strong>AR$ ${importeFormateadoPesos}</strong></p>
    </ul>
    <p>Una vez realizada por favor enviarnos el comprobante por mail a <a mailto="info@palosantohotel.com">info@palosantohotel.com</a></p>

    
    <p class="my-5">¡Hasta pronto, ${reservaEnCurso.pasajero}!</p>`
    datosBancarios.classList.toggle("d-none");
    let campoNumeroReserva = document.getElementById("campoNumeroReserva"); 
    campoNumeroReserva.innerHTML = `${reservaEnCurso.numero}`;
}

/////////////////////////////////////////////
// PAGO OPCIÓN 2 : TARJETA DE CRÉDITO ///
/////////////////////////////////////////////

// MUESTRA FORMULARIO PARA INGRESAR DATOS SI SE ELIGE "TARJETA DE CRÉDITO"
tarjeta.onclick = () =>{
    // Oculta los datos bancarios si éstos están visibles
    (!datosBancarios.classList.contains("d-none")) && datosBancarios.classList.add("d-none")
    formularioTC.classList.toggle("d-none");
}
formularioTC.addEventListener("submit", validarFormTarjeta)


// Validación de los datos de tarjeta
function validarFormTarjeta(e){
    e.preventDefault();
    let titular = document.getElementById("nombreTitular").value;
    let numeroTC = document.getElementById("numeroTC").value;
    let vencimiento = document.getElementById("vencimiento").value;
    let cvv = document.getElementById("cvv").value;

        // VALIDACION DE DATOS
        if (!validarTexto(titular)){
            Swal.fire(
                'Nombre inválido',
                'Por favor, verifica que el nombre ingresado no contenga números',
                'error'
              )
            titular = document.querySelector("#nombreTitular").value;
        }

        else if(isNaN(numeroTC) || numeroTC.length < 14 || numeroTC.length >19){
            Swal.fire(
                'Número de tarjeta inválido',
                'Por favor, ingresa el número sin espacios ni caracteres especiales',
                'error'
              )
            numeroTC = document.querySelector("#numeroTC").value;
        }

        else if(!validarFechaVto(vencimiento)){
            Swal.fire(
                'Fecha de vencimiento inválida',
                'Por favor, chequea la fecha de vencimiento. El formato debería ser MM/AA',
                'error'
              )
            vencimiento = document.querySelector("#vencimiento").value;
        }

        else if(isNaN(cvv) || (cvv.length < 3) || (cvv.length > 4)){
            Swal.fire(
                'CVV inválido',
                'Chequea el CVV. Debería tener 3 o 4 números',
                'error'
              )
            cvv = document.querySelector("#cvv").value;
        }

        else{
            // Guarda los datos de tarjetas en el array de tarjetas
            let tarjeta = {
                idReserva : reservaEnCurso.numero,
                titular: titular,
                numeroTC : numeroTC,
                vencimiento: vencimiento,
                cvv: cvv
            }
            console.log(tarjeta);
            Tarjetas.push(tarjeta);
            console.table(Tarjetas)
            Swal.fire(
                'Felicitaciones',
                'Muchas gracias por tu reserva! Procesaremos tu pago a la brevedad. Recibirás un email con tu factura',
                'success'
              )
            formularioTC.reset();
            formularioTC.classList.toggle("d-none");
        }
    }

function validarFechaVto(numero){
    let mes = numero[0] + numero [1];
    let anio = numero [3] + numero [4]
    
    let mesActual = today.month;
    let anioActual = DateTime.fromISO(today).toFormat('yy')
    
    // Verificar que tenga 5 caracteres: 2 numeros de cada lado de una barra
        if(isNaN(mes) || isNaN(anio) || numero[2]!= "/" ){
            return false
        }

    // Verificar que el numero sea posterior a hoy
        else if(anio < anioActual || (anio == anioActual && mes < mesActual) ){
            return false
        }

    return true
}

// Agregar reserva al array de reservas
function agregarReserva(reserva){
    reservas.push(reserva);
    numeroReserva++;
    // Guarda el nuevo array de reservas en storage
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

