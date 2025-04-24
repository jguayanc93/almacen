// const {config,Connection,Request,TYPES} = require('./conexion/cadena')
const {obtenerpromesa_usuario,obtenerpromesa_usuario_consulta} = require('./documentos_receptor')////REEMPLAZADO POR ENTRADA DE USUARIOS

const evento_restringidos=['estado impreso','estado pick','estado checking','despacho check','despacho embalar'];

async function autenticador(evento,args,next){
    if(evento_restringidos.includes(evento)){
        let argumento =await traer_parametro(evento,args)
        await autenticador_consulta(argumento,next);
    }
    else{ next(); }
}

async function traer_parametro(evento,args){
    if(evento==='estado impreso'){ return args[2]}
    if(evento==='estado pick'){ return args[3]}
    if(evento==='estado checking'){ return args[3]}
    if(evento==='ventanilla'){ return args[0]}
    if(evento==='despacho check'){return args[2]}
    if(evento==='despacho embalar'){ return args[2]}
}

async function autenticador_consulta(argumento,next){
    try{
        const cnn=await obtenerpromesa_usuario();
        const query=await obtenerpromesa_usuario_consulta(cnn,argumento)
        if(query!==false) next();
        else{
            console.log("no existe este usuario")
        }
    }
    catch(err){console.log(err)}
}

module.exports={autenticador}