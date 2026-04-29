/////////EXTRACCION DE ZONAS SEGUN ALMACEN EVENTOS DISCRIMINATORIOS
document.getElementById("ventanilla").addEventListener("click",(e)=>{
    e.preventDefault();
    pasando_a_ventanilla();
    loadMenuItem('ventanilla');
})

document.getElementById('tabla-1-filtro').addEventListener('input', BuscarDocumento);

function BuscarDocumento(event) {
    const documento = event.target.value;
    if(documento === '') {
        // Si el campo de búsqueda está vacío, puedes optar por mostrar todos los registros o limpiar la tabla
        // emitir_eventos('filtrar documento', documento, 'G');
        console.log('Campo de búsqueda vacío, mostrando todos los registros');
    }
    else {
        if(documento.length < 12 || documento.length > 12) {
            alert('Por favor, ingrese un documento válido para la búsqueda.');
            return;
        }
        else {
            console.log("el evento que se va a emitir es: ",nombre_ev_actual);
            console.log("el valor que se va a emitir es: ",valor_ev_actual);
            if(nombre_ev_actual==="ventanilla"){
                emitir_eventos('filtrar maestro',0 , documento);
            }
            else if(nombre_ev_actual === "almacen principal") {
                emitir_eventos('filtrar maestro',1 , documento);
            }
            else if(nombre_ev_actual === "almacen mym") {
                emitir_eventos('filtrar maestro',8 , documento);
            }
            else if(nombre_ev_actual === "cambio zona") {
                emitir_eventos('filtrar zona',valor_ev_actual , documento);
            }
        }        
    }
}

function pasando_a_ventanilla(){
    document.getElementById("distribucion").innerHTML="";
    emitir_eventos('ventanilla',0,'G')
}

// Función auxiliar para togglear accordion
function toggleAccordion(accordionContentId, buttonId) {
    const content = document.getElementById(accordionContentId);
    const button = document.getElementById(buttonId);
    const icon = button ? button.querySelector('.accordion-icon') : null;
    if (!content) return;
    
    const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
    
    if (isOpen) {
        content.style.maxHeight = '0px';
        if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(90deg)';
    }
}

////////ALMACEN PRINCIPAL
document.getElementById("almprincipal").addEventListener("click",(e)=>{
    e.preventDefault();
    toggleAccordion('almprincipal-opc', 'almprincipal');
})

document.getElementById("alm1").addEventListener("click",(e)=>{
    e.preventDefault();
    ///aqui tendremos que ver la manera de mantener el evento para todos y para sus segmentos
    // emitir_eventos('almacen principal',1)
    emitir_eventos('almacen principal',1,'G');
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('almacen-principal');
})

document.getElementById("alm1-L").addEventListener("click",(e)=>{
    e.preventDefault();
    ///aqui tendremos que ver la manera de mantener el evento para todos y para sus segmentos
    // emitir_eventos('almacen principal',1)
    emitir_eventos('almacen principal',1,'L');
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('almacen-principal');
})

document.getElementById("alm1-P").addEventListener("click",(e)=>{
    e.preventDefault();
    ///aqui tendremos que ver la manera de mantener el evento para todos y para sus segmentos
    // emitir_eventos('almacen principal',1)
    emitir_eventos('almacen principal',1,'P');
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('almacen-principal');
})

///////EMISORES DE ZONAS
document.getElementById("Z1").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('cambio zona','Z1','G');
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('zona-1');
})
document.getElementById("Z2").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('cambio zona','Z2','G');
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('zona-2');
})
document.getElementById("Z3").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('cambio zona','Z3','G');
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('zona-3');
})
document.getElementById("desconocido").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('cambio zona','desconocido','G');
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('zona-desconocido');
})

////////////ALMACEN MYM
document.getElementById("almmym").addEventListener("click",(e)=>{
    e.preventDefault();
    toggleAccordion('almmym-opc', 'almmym');
})

document.getElementById("alm8").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('almacen mym',8,'G');
    toggleAccordion('almmym-opc', 'almmym');
    loadMenuItem('zona-unica');
})

document.getElementById("alm8-L").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('almacen mym',8,'L');
    toggleAccordion('almmym-opc', 'almmym');
    loadMenuItem('zona-unica');
})

document.getElementById("alm8-P").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('almacen mym',8,'P');
    toggleAccordion('almmym-opc', 'almmym');
    loadMenuItem('zona-unica');
})

//////DESPACHO
// El acordeón de Despacho es manejado automáticamente por el script en index.html

// document.getElementById("despachop").addEventListener("click",(e)=>{
//     e.preventDefault();
//     emitir_eventos('despacho',1);
//     toggleAccordion('despacho-opc', 'despacho');
//     loadMenuItem('despacho-principal');
// })

// document.getElementById("despachom").addEventListener("click",(e)=>{
//     e.preventDefault();
//     emitir_eventos('despacho',8);
//     toggleAccordion('despacho-opc', 'despacho');
//     loadMenuItem('despacho-mym');
// })
///////////version nueva de segmentacion de despacho segun salida
document.getElementById("despachop-l").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('despacho',1,'L');
    toggleAccordion('despacho-opc', 'despacho');
    loadMenuItem('despacho-principal');
})

document.getElementById("despachop-p").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('despacho',1,'P');
    toggleAccordion('despacho-opc', 'despacho');
    loadMenuItem('despacho-principal');
})

document.getElementById("despachom-l").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('despacho',8,'L');
    toggleAccordion('despacho-opc', 'despacho');
    loadMenuItem('despacho-mym');
})

document.getElementById("despachom-p").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('despacho',8,'P');
    toggleAccordion('despacho-opc', 'despacho');
    loadMenuItem('despacho-mym');
})

/////ACCIONES PARA MOSTRAR EL CONTENEDOR FLOTANTE DE INFORMACION DETALLADA
const flotanteCerrar = document.getElementById("flotante-cerrar");
if (flotanteCerrar) {
    flotanteCerrar.addEventListener('click',()=>{
        document.getElementById("flotante-superior").classList.add("hidden");
    });
}