/**
 * INTERFAZ DE BÚSQUEDA DE CLIENTES PARA CREAR RUTA
 * Sistema con autocompletado y sugerencias dinámicas
 * Usa eventos socket.io para comunicación con el backend
 */

// Objeto para almacenar el estado de la búsqueda de clientes
const searchClienteState = {
    inputElement: null,
    suggestionsContainer: null,
    selectedClient: null,
    timerTimeout: null,
    MAX_SUGGESTIONS: 5,
    MIN_CHARS: 3
};

/**
 * Función principal para cargar la interfaz de búsqueda de clientes
 * Se llama desde el menú "Crear Ruta"
 */
function loadBuscarClienteRuta() {
    const mainContent = document.querySelector('.main-content > .p-8');
    
    mainContent.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Crear Nueva Ruta</h2>
                <p class="text-gray-600">Ingresa el nombre del cliente para asignarle una ruta de entrega</p>
            </div>

            <!-- Contenedor principal de búsqueda -->
            <div class="space-y-4">
                <!-- Input de búsqueda -->
                <div class="relative">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Cliente <span class="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="input-buscar-cliente"
                        placeholder="Escribe el nombre del cliente (mín. 3 caracteres)..."
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    
                    <!-- Contenedor de sugerencias -->
                    <div 
                        id="sugerencias-container" 
                        class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto hidden z-10"
                    >
                        <ul id="sugerencias-lista" class="divide-y divide-gray-200">
                            <!-- Las sugerencias se cargarán dinámicamente aquí -->
                        </ul>
                    </div>
                    
                    <!-- Mensaje de información -->
                    <p id="info-message" class="mt-2 text-sm text-gray-500">
                        Escribe al menos 3 caracteres para ver sugerencias
                    </p>
                </div>

                <!-- Cliente seleccionado (Mostrar después de seleccionar) -->
                <div id="cliente-seleccionado" class="hidden bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <p class="text-sm text-gray-600">Cliente seleccionado:</p>
                    <p id="cliente-nombre" class="text-lg font-bold text-indigo-600"></p>
                    <button 
                        id="btn-cambiar-cliente" 
                        type="button"
                        class="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Cambiar cliente
                    </button>
                </div>

                <!-- Botones de acción -->
                <div id="acciones-buttons" class="flex gap-3 pt-4">
                    <button 
                        id="btn-confirmar-cliente"
                        type="button"
                        class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled
                    >
                        Confirmar y Continuar
                    </button>
                    <button 
                        id="btn-cancelar-cliente"
                        type="button"
                        class="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;

    // Inicializar los event listeners
    initSearchClienteFunctionality();
}

/**
 * Inicializa toda la funcionalidad de búsqueda de clientes
 */
function initSearchClienteFunctionality() {
    searchClienteState.inputElement = document.getElementById('input-buscar-cliente');
    searchClienteState.suggestionsContainer = document.getElementById('sugerencias-container');
    
    const suggestionsList = document.getElementById('sugerencias-lista');
    const clienteSeleccionadoDiv = document.getElementById('cliente-seleccionado');
    const btnCambiarCliente = document.getElementById('btn-cambiar-cliente');
    const btnConfirmar = document.getElementById('btn-confirmar-cliente');
    const btnCancelar = document.getElementById('btn-cancelar-cliente');
    const infoMessage = document.getElementById('info-message');

    // Event listener para el input - búsqueda con debounce
    searchClienteState.inputElement.addEventListener('input', (e) => {
        const searchValue = e.target.value.trim();
        
        // Limpiar timeout anterior
        if (searchClienteState.timerTimeout) {
            clearTimeout(searchClienteState.timerTimeout);
        }

        // Ocultar sugerencias si está vacío
        if (searchValue.length === 0) {
            searchClienteState.suggestionsContainer.classList.add('hidden');
            infoMessage.textContent = 'Escribe al menos 3 caracteres para ver sugerencias';
            return;
        }

        // Mostrar mensaje si no alcanza el mínimo
        if (searchValue.length < searchClienteState.MIN_CHARS) {
            searchClienteState.suggestionsContainer.classList.add('hidden');
            infoMessage.textContent = `Faltan ${searchClienteState.MIN_CHARS - searchValue.length} caracteres para buscar`;
            return;
        }

        // Debounce de 300ms antes de buscar
        infoMessage.textContent = 'Buscando clientes...';
        searchClienteState.timerTimeout = setTimeout(() => {
            buscarClientes(searchValue);
        }, 300);
    });

    // Event listener para cambiar cliente
    btnCambiarCliente.addEventListener('click', () => {
        searchClienteState.selectedClient = null;
        searchClienteState.inputElement.value = '';
        searchClienteState.inputElement.focus();
        clienteSeleccionadoDiv.classList.add('hidden');
        btnConfirmar.disabled = true;
        infoMessage.textContent = 'Escribe al menos 3 caracteres para ver sugerencias';
        searchClienteState.suggestionsContainer.classList.add('hidden');
    });

    // Event listener para cancelar
    btnCancelar.addEventListener('click', () => {
        // Volver al menú principal o limpiar la vista
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            welcomeMessage.classList.remove('hidden');
        }
        const mainContent = document.querySelector('.main-content > .p-8');
        mainContent.innerHTML = '';
    });

    // Event listener para confirmar cliente
    btnConfirmar.addEventListener('click', () => {
        if (searchClienteState.selectedClient) {
            confirmarClienteSeleccionado(searchClienteState.selectedClient);
        }
    });

    // Cerrar sugerencias al hacer click fuera
    document.addEventListener('click', (e) => {
        if (e.target !== searchClienteState.inputElement && 
            e.target !== searchClienteState.suggestionsContainer &&
            !searchClienteState.suggestionsContainer.contains(e.target)) {
            searchClienteState.suggestionsContainer.classList.add('hidden');
        }
    });
}

/**
 * Función para buscar clientes
 * Emite evento socket.io para que el backend busque los clientes
 * @param {string} searchTerm - Término de búsqueda ingresado por el usuario
 */
function buscarClientes(searchTerm) {
    console.log('Buscando clientes con término:', searchTerm);
    
    // EVENTO SOCKET.IO PARA BACKEND
    // El backend debe retornar un array de clientes que coincidan
    // Estructura esperada: [{ id: '123', nombre: 'Cliente 1', ciudad: 'Bogotá' }, ...]
    socket.emit('buscar_clientes', { termino: searchTerm }, (respuesta) => {
        if (respuesta && respuesta.clientes) {
            mostrarSugerencias(respuesta.clientes);
        } else {
            mostrarSugerenciasVacio();
        }
    });
    
    // Alternativa si usas socket.on (sin callback):
    // socket.emit('buscar_clientes', { termino: searchTerm });
}

/**
 * Socket.io listener para recibir sugerencias de clientes (alternativa sin callback)
 * Descomenta si prefieres esta forma en lugar de usar callbacks
 */
// socket.on('respuesta_buscar_clientes', (data) => {
//     if (data && data.clientes && data.clientes.length > 0) {
//         mostrarSugerencias(data.clientes);
//     } else {
//         mostrarSugerenciasVacio();
//     }
// });

/**
 * Muestra las sugerencias de clientes en el contenedor
 * Limita a 5 sugerencias máximo
 * @param {Array} clientes - Array de clientes a mostrar
 */
function mostrarSugerencias(clientes) {
    const suggestionsList = document.getElementById('sugerencias-lista');
    const infoMessage = document.getElementById('info-message');
    
    // Limpiar lista anterior
    suggestionsList.innerHTML = '';

    // Limitar a 5 sugerencias
    const sugerenciasLimitadas = clientes.slice(0, searchClienteState.MAX_SUGGESTIONS);

    if (sugerenciasLimitadas.length === 0) {
        mostrarSugerenciasVacio();
        return;
    }

    // Crear items de sugerencias
    sugerenciasLimitadas.forEach((cliente, index) => {
        const li = document.createElement('li');
        li.className = 'px-4 py-3 hover:bg-indigo-50 cursor-pointer transition flex justify-between items-center';
        
        // Información del cliente
        const info = document.createElement('div');
        info.innerHTML = `
            <p class="font-medium text-gray-800">${cliente.nombre || cliente.name || 'Sin nombre'}</p>
            <p class="text-sm text-gray-500">${cliente.ciudad || cliente.city || 'Ciudad no especificada'}</p>
        `;
        
        li.appendChild(info);
        
        // Event listener para seleccionar
        li.addEventListener('click', () => {
            seleccionarCliente(cliente);
        });

        suggestionsList.appendChild(li);
    });

    // Mostrar contenedor
    searchClienteState.suggestionsContainer.classList.remove('hidden');
    infoMessage.textContent = `Se encontraron ${sugerenciasLimitadas.length} cliente(s)`;

    // Si solo hay una sugerencia, mostrar eso
    if (sugerenciasLimitadas.length === 1) {
        infoMessage.textContent = '1 cliente encontrado';
    }
}

/**
 * Muestra mensaje cuando no hay sugerencias
 */
function mostrarSugerenciasVacio() {
    const suggestionsList = document.getElementById('sugerencias-lista');
    const infoMessage = document.getElementById('info-message');
    
    suggestionsList.innerHTML = '';
    
    const li = document.createElement('li');
    li.className = 'px-4 py-4 text-center text-gray-500';
    li.textContent = 'No se encontraron clientes con ese nombre';
    
    suggestionsList.appendChild(li);
    searchClienteState.suggestionsContainer.classList.remove('hidden');
    infoMessage.textContent = 'No se encontraron resultados';
}

/**
 * Selecciona un cliente de la lista de sugerencias
 * @param {Object} cliente - Objeto cliente seleccionado
 */
function seleccionarCliente(cliente) {
    searchClienteState.selectedClient = cliente;
    
    // Actualizar input
    searchClienteState.inputElement.value = cliente.nombre || cliente.name || '';
    
    // Ocultar sugerencias
    searchClienteState.suggestionsContainer.classList.add('hidden');
    
    // Mostrar cliente seleccionado
    const clienteSeleccionadoDiv = document.getElementById('cliente-seleccionado');
    const clienteNombre = document.getElementById('cliente-nombre');
    const btnConfirmar = document.getElementById('btn-confirmar-cliente');
    
    clienteNombre.textContent = cliente.nombre || cliente.name || 'Sin nombre';
    clienteSeleccionadoDiv.classList.remove('hidden');
    
    // Habilitar botón de confirmar
    btnConfirmar.disabled = false;
}

/**
 * Confirma la selección del cliente y emite evento socket.io
 * @param {Object} cliente - Cliente confirmado
 */
function confirmarClienteSeleccionado(cliente) {
    console.log('Cliente confirmado:', cliente);
    
    // EVENTO SOCKET.IO PARA BACKEND
    // El backend debe procesar la confirmación del cliente y continuar con la creación de ruta
    socket.emit('cliente_confirmado_ruta', { cliente: cliente }, (respuesta) => {
        if (respuesta && respuesta.exito) {
            console.log('Cliente confirmado exitosamente');
            // El backend decidirá qué hacer después (mostrar destinos, etc)
        } else {
            alert('Error al confirmar el cliente. Intenta de nuevo.');
        }
    });
    
    // Alternativa sin callback:
    // socket.emit('cliente_confirmado_ruta', { cliente: cliente });
}
//         }

//         fila.appendChild(cliente);
//         fila.appendChild(dirprincipal);
//         cuerpo.appendChild(fila);

//         cuerpo.appendChild(fila);
//         rowIndex++;
//     }
//     document.getElementById("tablero-maestro-control-inicio").appendChild(cuerpo);
// })