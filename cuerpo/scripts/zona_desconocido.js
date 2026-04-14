// ============================================================
// SCRIPT ZONA DESCONOCIDO - Maneja 3 tablas de documentos
// La zona es "desconocido" y emite los 3 eventos juntos
// ============================================================

// TABLA 1: NUEVOS DOCUMENTOS REGISTRADOS
socket.on('lista documentos', (msg, zone) => {
    if (zone !== 'desconocido') return;
    
    document.getElementById("tabla-1-titulo").textContent = "Nuevos Documentos";
    document.getElementById("tabla-1-descripcion").textContent = "Nuevos documentos programados para ser trabajados";
    document.getElementById("tablero-maestro-control-inicio").innerHTML = "";

    // Crear cabecera
    let thead = document.createElement('thead');
    thead.className = "bg-gray-50 border-b border-gray-200";
    thead.innerHTML = `
        <tr>
            <th class="px-4 py-3 text-left text-gray-700 font-semibold">Documento</th>
            <th class="px-4 py-3 text-left text-gray-700 font-semibold">Despacho</th>
            <th class="px-4 py-3 text-left text-gray-700 font-semibold">Cliente</th>
            <th class="px-4 py-3 text-left text-gray-700 font-semibold">Acción</th>
        </tr>
    `;
    document.getElementById("tablero-maestro-control-inicio").appendChild(thead);

    let tbody = document.createElement('tbody');
    tbody.className = "divide-y divide-gray-200";

    for (let documento in msg) {
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50 transition";

        const cell1 = document.createElement('td');
        cell1.className = "px-4 py-3 font-mono text-indigo-600 cursor-pointer";
        cell1.textContent = msg[documento][0];
        cell1.addEventListener("click", () => factura_informacion(msg[documento][0]));

        const cell2 = document.createElement('td');
        cell2.className = "px-4 py-3";
        cell2.textContent = msg[documento][1];

        const cell3 = document.createElement('td');
        cell3.className = "px-4 py-3";
        cell3.textContent = msg[documento][2];

        const cell4 = document.createElement('td');
        cell4.className = "px-4 py-3";
        const button = document.createElement('button');
        button.className = "bg-blue-500 rounded-md px-4 py-2 text-white text-sm font-mono hover:bg-blue-600 transition";
        button.textContent = "Imprimir";
        button.addEventListener("click", () => estado_cambiado_impreso(msg[documento][0], zone));
        cell4.appendChild(button);

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        tbody.appendChild(row);
    }

    document.getElementById("tablero-maestro-control-inicio").appendChild(tbody);
});

// TABLA 2: DOCUMENTOS IMPRESOS
socket.on('impresos', (impresos, zone) => {
    if (zone !== 'desconocido') return;
    
    document.getElementById("tabla-2-titulo").textContent = "Documentos Impresos";
    document.getElementById("tabla-2-descripcion").textContent = "Documentos impresos y listos para su trabajo";
    document.getElementById("tablero-maestro-control-medio").innerHTML = "";

    // Crear cabecera
    let thead = document.createElement('thead');
    thead.className = "bg-gray-50 border-b border-gray-200";
    thead.innerHTML = `
        <tr>
            <th class="px-4 py-3 text-left text-gray-700 font-semibold">Documento</th>
            <th class="px-4 py-3 text-left text-gray-700 font-semibold">Cantidad</th>
            <th class="px-4 py-3 text-left text-gray-700 font-semibold">Acción</th>
        </tr>
    `;
    document.getElementById("tablero-maestro-control-medio").appendChild(thead);

    let tbody = document.createElement('tbody');
    tbody.className = "divide-y divide-gray-200";

    for (let documento in impresos) {
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50 transition";

        const cell1 = document.createElement('td');
        cell1.className = "px-4 py-3 font-mono text-indigo-600 cursor-pointer";
        cell1.textContent = impresos[documento][0];
        cell1.addEventListener("click", () => factura_informacion(impresos[documento][0]));

        const cell2 = document.createElement('td');
        cell2.className = "px-4 py-3";
        cell2.textContent = impresos[documento][2];

        const cell3 = document.createElement('td');
        cell3.className = "px-4 py-3";
        const button = document.createElement('button');
        button.className = "bg-amber-500 rounded-md px-4 py-2 text-white text-sm font-mono hover:bg-amber-600 transition";
        button.textContent = "Picking";
        button.addEventListener("click", () => estado_cambiado_piking(impresos[documento][0], impresos[documento][3], zone));
        cell3.appendChild(button);

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        tbody.appendChild(row);
    }

    document.getElementById("tablero-maestro-control-medio").appendChild(tbody);
});

// TABLA 3: DOCUMENTOS PICKING
socket.on('lista picking', (pikings, zone) => {
    if (zone !== 'desconocido') return;
    
    document.getElementById("tabla-3-titulo").textContent = "Documentos Picking";
    document.getElementById("tabla-3-descripcion").textContent = "Documentos para pikar/confirmar y mandar a su checking";
    document.getElementById("tablero-maestro-control-fin").innerHTML = "";

    // Crear cabecera
    let thead = document.createElement('thead');
    thead.className = "bg-gray-50 border-b border-gray-200";
    thead.innerHTML = `
        <tr>
            <th class="px-4 py-3 text-left text-gray-700 font-semibold">Documento</th>
            <th class="px-4 py-3 text-left text-gray-700 font-semibold">Cantidad</th>
            <th class="px-4 py-3 text-left text-gray-700 font-semibold">Estado</th>
        </tr>
    `;
    document.getElementById("tablero-maestro-control-fin").appendChild(thead);

    let tbody = document.createElement('tbody');
    tbody.className = "divide-y divide-gray-200";

    for (let documento in pikings) {
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50 transition";

        const cell1 = document.createElement('td');
        cell1.className = "px-4 py-3 font-mono text-indigo-600 cursor-pointer";
        cell1.textContent = pikings[documento][0];
        cell1.addEventListener("click", () => factura_informacion(pikings[documento][0]));

        const cell2 = document.createElement('td');
        cell2.className = "px-4 py-3";
        cell2.textContent = pikings[documento][5];

        const cell3 = document.createElement('td');
        cell3.className = "px-4 py-3";
        const button = document.createElement('button');

        // Lógica de estado - SI EL DOCUMENTO TIENE SOLO 1 ZONA
        if (pikings[documento][2] == 1) {
            if (pikings[documento][3] == 1) {
                button.className = "bg-amber-500 rounded-md px-4 py-2 text-white text-sm font-mono w-full";
                button.textContent = "ESPERANDO CHECKING";
                button.disabled = true;
            } else {
                button.className = "bg-green-500 rounded-md px-4 py-2 text-white text-sm font-mono hover:bg-green-600 transition";
                button.textContent = "CONFIRMAR PICKING";
                button.addEventListener("click", () => estado_cambio_confirmado(pikings[documento][0], pikings[documento][2], zone));
            }
        }
        // SI EL DOCUMENTO TIENE VARIAS ZONAS
        else {
            if (pikings[documento][3] == 0) {
                button.className = "bg-green-500 rounded-md px-4 py-2 text-white text-sm font-mono hover:bg-green-600 transition";
                button.textContent = "CONFIRMAR PICKING";
                button.addEventListener("click", () => estado_cambio_confirmado(pikings[documento][0], pikings[documento][2], zone));
            } else if (pikings[documento][3] == 1) {
                button.className = "bg-amber-500 rounded-md px-4 py-2 text-white text-sm font-mono w-full";
                button.disabled = true;
                if (pikings[documento][4] < pikings[documento][2]) {
                    button.textContent = "ESPERANDO OTRAS ZONAS";
                } else {
                    button.textContent = "ESPERANDO CHECKING";
                }
            }
        }

        cell3.appendChild(button);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        tbody.appendChild(row);
    }

    document.getElementById("tablero-maestro-control-fin").appendChild(tbody);
});

// ============================================================
// FUNCIONES DE ACCIÓN
// ============================================================

function estado_cambiado_impreso(documento, zona) {
    let user = window.prompt(`¿Quién va a imprimir la factura ${documento}?`, "número de trabajador");
    if (user === null || user === '') {
        alert("Valor no aceptable, vuelve a intentarlo");
    } else {
        socket.emit('estado impreso', documento, zona, user);
    }
}

function estado_cambiado_piking(ndoc, cantidad, zone) {
    let user = window.prompt(`¿Quién va a comenzar el picking de ${ndoc}?`, "número de trabajador");
    if (user === null || user === '') {
        alert("Valor no aceptable, vuelve a intentarlo");
    } else {
        socket.emit('estado pick', ndoc, cantidad, zone, user);
    }
}

function estado_cambio_confirmado(documento, cantidad, zona) {
    socket.emit('estado confirmado', documento, cantidad, zona);
}

function estado_cambio_checking(documento, zonas, despacho, identificador_maestro) {
    let user = window.prompt(`¿Quién va a confirmar el checking de ${documento}?`, "número de trabajador");
    if (user === null || user === '') {
        alert("Valor no aceptable, vuelve a intentarlo");
    } else {
        socket.emit('estado checking', documento, zonas, despacho, user, identificador_maestro);
    }
}
