// VIEW
function pintarTabla(tableBody) {
    $("#tabla").html('<table class="table table-striped table-hover">' +
        '<thead>' +
        '<tr class="table-dark">' +
        '<th scope="col">#</th>' +
        '<th scope="col">Fecha</th>' +
        '<th scope="col">Valor</th>' +
        '<th scope="col">Tipo</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' + tableBody + '</tbody>' +
        '</table>');
}

function pintarGrafico(pointsObject, title) {
    var _widthGraph = document.getElementById("graph").clientWidth;

    var colors = ["#FF6347", "#00CED1", "#FFD700", "#800080", "#32CD32"]
    var data = []
    var idx = 0


    for (let key in pointsObject) {
        data.push({
            type: "line",
            name: key,
            lineColor: colors[idx],
            lineThickness: 3,
            dataPoints: pointsObject[key].datapoints
        })
        idx++
    }

    var options = {
        //width: _widthGraph,
        //theme: "light2",
        exportEnabled: true,
        interactivityEnabled: true,
        animationEnabled: true,
        showInLegend: true,
        title: { text: title },
        axisY: {
            gridColor: "white"
        },
        axisX: {
            gridColor: "white",
            valueFormatString: "YYYY-MM-DD HH:mm",
            labelFontSize: 10,
        },
        toolTip: {
            shared: true
        },
        data: data
    };
    $("#graph").CanvasJSChart(options);
}

function agregarDatosAlGrafico(newDataPoints) {
    var grafico = $("#graph").CanvasJSChart();
    grafico.options.data[0].dataPoints = grafico.options.data[0].dataPoints.concat(newDataPoints);
    grafico.render();
}

// BACKEND
function cargarDatos(data) {

    backendRequest = $.ajax({
        method: "GET",
        url: "https://e10a34d8-df4e-472d-8424-c1cc68695f2d.mock.pstmn.io/measurement",
        data: data,
        contentType: "application/json",
    });

    var tableBody = '';

    backendRequest.done(function (data) {
        var datos = data.result;
        for (i in datos) {
            cuenta = eval(i) + 1;

            tableBody += '<tr>' +
                '<th scope="row">' + cuenta + '</th>' +
                '<td>' + datos[i].created_at + '</td>' +
                '<td>' + datos[i].value + '</td>' +
                '<td>' + datos[i].detail + '</td>' +
                '</tr>';
        }
        pintarTabla(tableBody);

        var dataTypes = {};

        datos.forEach(function (e) {
            key = e.type ?? 'data'
            if (!dataTypes[key]) {
                dataTypes[key] = { datapoints: [] };
            }
            dataTypes[key].datapoints.push({ y: e.value, x: new Date(e.createdAt) });
        });

        pintarGrafico(dataTypes, "Graphic");

    });

}

function loadDashboardData() {

    backendRequest = $.ajax({
        method: "GET",
        url: "https://e10a34d8-df4e-472d-8424-c1cc68695f2d.mock.pstmn.io/getDashboardInfo",
        contentType: "application/json",
    });

    backendRequest.done(function (data) {
        document.getElementById("pdSpan").innerText = data.pressureC.toFixed(2);
        document.getElementById("piSpan").innerText = data.pressureD.toFixed(2);
        document.getElementById("tiSpan").innerText = data.temperatureC.toFixed(2);
        document.getElementById("tmSpan").innerText = data.tempercatureM.toFixed(2);
        document.getElementById("vxSpan").innerText = data.vibrationX.toFixed(2);
        document.getElementById("vySpan").innerText = data.vibrationZ.toFixed(2);
        document.getElementById("fcSpan").innerText = data.fc.toFixed(2);
        document.getElementById("vdcSpan").innerText = data.vdC.toFixed(2);
    });

}

// UTILS 
const subMinutesToDate = (date, n) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - n);
    return d;
};

const subHoursToDate = (date, n) => {
    const d = new Date(date);
    d.setHours(d.getHours() - n);
    return d;
};

function handleSearch(measureType, detailName) {
    fecha1Value = document.getElementById("date1").value
    fecha1 = fecha1Value.toString().replace("T", " ");

    fecha2Value = document.getElementById("date2").value
    fecha2 = fecha2Value.toString().replace("T", " ");

    document.getElementById("selectedRange").innerHTML = fecha1 + " - " + fecha2;

    data = {
        measure_type: measureType,
        start_date: formatearFecha(new Date(fecha1Value)),
        end_date: formatearFecha(new Date(fecha2Value)),
        detail: detail
    }

    cargarDatos(data);
}

function formatearFecha(fecha) {
    var año = fecha.getFullYear();
    var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var dia = ('0' + fecha.getDate()).slice(-2);
    var hora = ('0' + fecha.getHours()).slice(-2);
    var minutos = ('0' + fecha.getMinutes()).slice(-2);
    var segundos = ('0' + fecha.getSeconds()).slice(-2);

    fecha_formateada = año + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos + ':' + segundos;
    return fecha_formateada;
}

// HTML
function cargarContenido(url, identifier, callback) {

    var request = $.ajax({
        method: "GET",
        url: url
    });

    request.done(function (content) {
        $(identifier).html(content);

        if (typeof callback === 'function') {
            callback();
        }
    });

    request.fail(function (jqXHR, textStatus) {
        $(identifier).html("Request failed: " + textStatus);
    });
}

// Response
function getValue(name, data) {
    const result = data.find(d => d.name === name);
    return result ? result.value : null;
}

// HANDLERS
function manejarRelativeButton(interval, intervalType, measure_type, detailName) {

    endDate = new Date();
    var startDate = null;

    if (intervalType === 'M') {
        startDate = subMinutesToDate(endDate, interval);
    } else {
        startDate = subHoursToDate(endDate, interval);
    }

    detail = detailName === null ? null : document.getElementById(detailName).value;

    data = {
        measure_type: measure_type,
        start_date: formatearFecha(startDate),
        end_date: formatearFecha(endDate),
        detail: detail
    }

    cargarDatos(data)
}
