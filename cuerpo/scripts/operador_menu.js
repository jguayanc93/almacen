////////aUN EN PRUEBA EL MOSTRADOR DEL MENU
document.getElementById("operador-v").addEventListener("click",acomodar_menu_opciones_operador)
document.getElementById("operador-ap").addEventListener("click",acomodar_menu_opciones_operador)
document.getElementById("operador-am").addEventListener("click",acomodar_menu_opciones_operador)
document.getElementById("operador-d").addEventListener("click",acomodar_menu_opciones_operador)

function acomodar_menu_opciones_operador(ev){
    // botar su click
    console.log(ev.target.text);
    document.getElementById("operador-opciones").innerHTML="";
    // acomodarlo a una columna el texto de ayuda guia
    let menu_mensaje=document.getElementById("mensaje-opcion");
    menu_mensaje.classList.replace("col-span-2","col-span-1");

    // mostrar el texto de opciones disponibles
    let menu_opciones_operador=document.getElementById("operador-opciones")
    menu_opciones_operador.classList.remove("hidden");
    activar_menu_opciones_operador();
}

function activar_menu_opciones_operador(){

    let menu_operador=document.getElementById("operador-opciones");
    menu_operador.className="col-span-1 h-dvh w-2/3 bg-gray-800 text-gray-400 pt-4 pl-5 pr-5 font-sans text-base not-italic font-medium tracking-wide";

    let lista_opciones=document.createElement("ul");
    lista_opciones.className="w-full flex flex-col gap-y-8 pt-16";
    let opcion1=document.createElement("li");
    opcion1.className="rounded-md px-3 py-2 hover:bg-gray-600 hover:text-white";
    opcion1.textContent="OPERADOR";
    opcion1.addEventListener("mouseover",indicar_mensaje_sobre_opcion)
    let opcion2=document.createElement("li");
    opcion2.className="rounded-md px-3 py-2 hover:bg-gray-600 hover:text-white";
    opcion2.textContent="ZONA 1";
    opcion2.addEventListener("mouseover",indicar_mensaje_sobre_opcion)
    let opcion3=document.createElement("li");
    opcion3.className="rounded-md px-3 py-2 hover:bg-gray-600 hover:text-white";
    opcion3.textContent="ZONA 2";
    opcion3.addEventListener("mouseover",indicar_mensaje_sobre_opcion)
    let opcion4=document.createElement("li");
    opcion4.className="rounded-md px-3 py-2 hover:bg-gray-600 hover:text-white";
    opcion4.textContent="ZONA 3";
    opcion4.addEventListener("mouseover",indicar_mensaje_sobre_opcion)
    let opcion5=document.createElement("li");
    opcion5.className="rounded-md px-3 py-2 hover:bg-gray-600 hover:text-white";
    opcion5.textContent="DESCONOCIDO";
    opcion5.addEventListener("mouseover",indicar_mensaje_sobre_opcion)
    opcion5.addEventListener("mouseleave",indicar_mensaje_por_defecto)

    lista_opciones.appendChild(opcion1);
    lista_opciones.appendChild(opcion2);
    lista_opciones.appendChild(opcion3);
    lista_opciones.appendChild(opcion4);
    lista_opciones.appendChild(opcion5);

    menu_operador.appendChild(lista_opciones);
}
function indicar_mensaje_por_defecto(){
    document.getElementById("mensaje-opcion").textContent="Demo de almacen para acceder a sus respectivos cargos puede entrar a su cargo para comensar,Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore sunt, maiores ea quos odit minus, saepe quam cumque adipisci optio modi laboriosam facere? Culpa officiis dolores, perferendis quidem cupiditate eaque.";
}

function indicar_mensaje_sobre_opcion(ev){
    // console.log(ev.target.textContent)
    switch (ev.target.textContent) {
        case "OPERADOR":
            document.getElementById("mensaje-opcion").textContent="muestra la tabla de control para los documentos del operario ventanilla";
            break;

        case "ZONA 1":
            document.getElementById("mensaje-opcion").textContent="muestra los documentos para la zona 1";
            break;

        case "ZONA 2":
            document.getElementById("mensaje-opcion").textContent="muestra los documentos para la zona 2";
            break;

        case "ZONA 3":
            document.getElementById("mensaje-opcion").textContent="muestra los documentos para la zona 3";
            break;

        case "DESCONOCIDO":
            document.getElementById("mensaje-opcion").textContent="muestra los documentos para la zona no asignada";
            break;
    
        default:
            break;
    }
}