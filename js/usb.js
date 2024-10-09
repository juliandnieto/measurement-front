function reloadUsbData() {

    backendRequest = $.ajax({
        method: "GET",
        url: "https://e10a34d8-df4e-472d-8424-c1cc68695f2d.mock.pstmn.io/drives",
        contentType: "application/json",
    });

    let select = document.getElementById("usbselect");

    backendRequest.done(function (data) {

        while (select.options.length > 0) {
            select.remove(0);
        }

        data.forEach(function (item) {
            let opcion = document.createElement("option");
            opcion.text = item.mountpoint;
            opcion.value = item.mountpoint;

            select.add(opcion);
        });

    });
}

function exportData(measureType, detailName) {
    fecha1Value = document.getElementById("date1").value
    fecha1 = fecha1Value.toString().replace("T", " ");

    fecha2Value = document.getElementById("date2").value
    fecha2 = fecha2Value.toString().replace("T", " ");

    let select = document.getElementById("usbselect");
    let selected = select.value;
    
    detail = detailName === null ? null : document.getElementById(detailName).value;

    backendRequest = $.ajax({
        method: "POST",
        url: "https://e10a34d8-df4e-472d-8424-c1cc68695f2d.mock.pstmn.io/measurement/export",
        data: JSON.stringify({
            measure_type: measureType,
            start_date: fecha1,
            end_date: fecha2,
            mountpoint: selected,
            detail: detail
        }),
        contentType: "application/json",
    });

    backendRequest.done(function (data) {
        alert('Reporte generado');
    });
}
