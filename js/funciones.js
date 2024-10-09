function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'reportcnx.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}



/******************************/
/*** FUNCIONES DE GENERALES ***/
/******************************/

//Oculta un div
function fn_ocultar(p_id)
{
    document.getElementById(p_id).style.visibility = "hidden";
}
//Muestra un div
function fn_mostrar(p_id)
{
    document.getElementById(p_id).style.visibility = "visible";
}
//Calcula la fecha del dia
function hoy()
{
    var fechaActual = new Date();

    dia = fechaActual.getDate();
    mes = fechaActual.getMonth() +1;
    anno = fechaActual.getFullYear();


    if (dia <10) dia = "0" + dia;
    if (mes <10) mes = "0" + mes;

    fechaHoy = dia + "/" + mes + "/" + anno;

    return fechaHoy;
}

//Marca una caja de chequeo
function fn_checked(p_id, p_value, p_isSector = null)
{
    if (p_isSector) {

    }

    if (document.getElementById(p_id).value === p_value) {
        document.getElementById(p_id).value = "";
        document.getElementById(p_id).checked= false;
    }else{
        document.getElementById(p_id).checked= true;
        document.getElementById(p_id).value = p_value;
    }

}
