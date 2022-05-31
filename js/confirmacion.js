// Convierte la reserva en storage a un objeto 
let reservaEnCurso = JSON.parse(localStorage.getItem("quote"))

// Al llegar a la página de confirmación, la reserva en curso se agrega al array de reservas
let pagina = document.body;

pagina.onload = agregarReserva(reservaEnCurso);

function agregarReserva(reserva){
    reservas.push(reserva);
    numeroReserva++;
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

console.table(reservas);

// Guarda el nuevo array de reservas en storage

let quote = document.getElementById("reservaEnCurso");
quote.innerHTML = renderizarReserva(reservaEnCurso)
// INSERTA LA RESERVA DESDE LA COTIZACIÓN GUARDADA EN STORAGE

// MUESTRA DATOS DE LA CUENTA BANCARIA SI SE ELIGE "TRANSFERENCIA"
let formasPago = document.getElementById("formasPago");
let datosBancarios = document.createElement("div");
datosBancarios.innerHTML = `
<p class="my-3">A continuación te mostramos los datos para realizar la transferencia. </p>
<p>Una vez realizada por favor enviarnos el comprobante por mail a <a mailto="info@palosantohotel.com">info@palosantohotel.com</a>, <strong>indicando el número de tu reserva (#${reservaEnCurso.numero}) para su mejor identificación</strong>. </p>
<ul>
<li>Cuenta corriente en pesos 1111-12033333</li>
<li>Titular de la cuenta: Palo Santo S.A.</li>
<li>CUIT: 30-12345677-8</li>
<li>CBU: 200000300049506070211</li>
</ul>
<p class="my-5">¡Hasta pronto, ${reservaEnCurso.pasajero}!</p>`

let botonTransferencia = document.getElementById("transferencia");
botonTransferencia.onclick = () => {
    formasPago.append(datosBancarios);
    reservas.push(reservaEnCurso);
}



