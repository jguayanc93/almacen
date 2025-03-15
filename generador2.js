const fs = require('fs');
const pdf = require('html-pdf');

const htmltopdf=fs.readFileSync('test.html','utf8');

const options={
    format:"A4",
    orientation:"portrait",
    type:"pdf"
}
// pdf.create(htmltopdf,options).toBuffer
// pdf.create(htmltopdf,options).toStream
pdf.create(htmltopdf,options).toFile("prueba.pdf",(err,res)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("PDF creado correctamente")
    }
});