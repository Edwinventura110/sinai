// Función para mostrar una alerta personalizada
function showCustomAlert() {
    document.getElementById("custom-alert").style.display = "block";
}

function closeAlert() {
    document.getElementById("custom-alert").style.display = "none";
}

// Función para mostrar una alerta de éxito
function showSuccessAlert() {
    const successAlert = document.createElement("div");
    successAlert.id = "success-alert";
    successAlert.style.position = "fixed";
    successAlert.style.top = "50%";
    successAlert.style.left = "50%";
    successAlert.style.transform = "translate(-50%, -50%)";
    successAlert.style.backgroundColor = "#dff0d8";
    successAlert.style.color = "#3c763d";
    successAlert.style.padding = "20px";
    successAlert.style.border = "1px solid #d6e9c6";
    successAlert.style.borderRadius = "5px";
    successAlert.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
    successAlert.style.zIndex = "9999";
    successAlert.textContent = "Requerimiento enviado con éxito";
    
    document.body.appendChild(successAlert);
    
    setTimeout(() => {
        successAlert.remove();
    }, 9000); // 
}

// Función para confirmar y enviar el requerimiento
async function confirmRequerimiento() {
    closeAlert();

    // Obtén los valores de los campos del formulario
    var dia = document.getElementById('dia').value;
    var hora = document.getElementById('hora').value;
    var supervisor = document.getElementById('supervisor').value;
    var linea = document.getElementById('linea').value;
    var cajasPaqs = Array.from(document.querySelectorAll("#cajas-container .form-group input[name='cajas_paq']"))
                          .map(input => input.value);
    var cajasDescs = Array.from(document.querySelectorAll("#cajas-container .form-group input[name='cajas_desc']"))
                           .map(input => input.value);
    var bobinasUni = Array.from(document.querySelectorAll("#bobina-container .form-group input[name='bobina_uni']"))
                          .map(input => input.value);
    var bobinasDescs = Array.from(document.querySelectorAll("#bobina-container .form-group input[name='bobina_desc']"))
                           .map(input => input.value);
    var bobinasPesos = Array.from(document.querySelectorAll("#bobina-container .form-group input[name='bobina_peso']"))
                            .map(input => input.value);
    var otrosCants = Array.from(document.querySelectorAll("#otros-container .form-group input[name='otros_cant']"))
                          .map(input => input.value);
    var otrosDescs = Array.from(document.querySelectorAll("#otros-container .form-group input[name='otros_desc']"))
                           .map(input => input.value);

    // Obtener el correlativo del localStorage
    var correlativo = parseInt(localStorage.getItem('pdfCorrelativo')) || 0;
    correlativo += 1;
    localStorage.setItem('pdfCorrelativo', correlativo);

    // Construir los parámetros para el correo
    const templateParams = {
        dia: dia,
        hora: hora,
        supervisor: supervisor,
        linea: linea,
        cajas_paq: cajasPaqs.join(', '),
        cajas_desc: cajasDescs.join(', '),
        bobina_uni: bobinasUni.join(', '),
        bobina_desc: bobinasDescs.join(', '),
        bobina_peso: bobinasPesos.join(', '),
        otros_cant: otrosCants.join(', '),
        otros_desc: otrosDescs.join(', '),
        message: `Adjunto encontrará el PDF del requerimiento con correlativo ${correlativo}.`
    };

    // Enviar el correo usando emailjs
    emailjs.send('service_bliaiey', 'template_3i2e4ih', templateParams, 'Z19AGyi2zEck-Ssxx')
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            showSuccessAlert(); // Mostrar la alerta de éxito
        }, (error) => {
            console.log('FAILED...', error);
        });

    // Crear el PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Definir el contenido del PDF
    const rows = [];

    // Encabezado
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(255, 188, 71);
    doc.rect(10, 10, 190, 20, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(`Requerimiento de Material de Empaque - Correlativo: ${correlativo}`, 105, 22, { align: "center" });

    // Datos generales
    rows.push(["Día", dia]);
    rows.push(["Hora", hora]);
    rows.push(["Supervisor", supervisor]);
    rows.push(["Línea", linea]);

    // Añadir cajas a la tabla
    if (cajasPaqs.length > 0) {
        rows.push(["Cajas", ""]);
        cajasPaqs.forEach((cajasPaq, index) => {
            rows.push([`PAQ ${index + 1}`, cajasPaq]);
            rows.push([`Descripción ${index + 1}`, cajasDescs[index]]);
        });
    }

    // Añadir bobinas a la tabla
    if (bobinasUni.length > 0) {
        rows.push(["Bobinas", ""]);
        bobinasUni.forEach((bobinaUni, index) => {
            rows.push([`UNI ${index + 1}`, bobinaUni]);
            rows.push([`Descripción ${index + 1}`, bobinasDescs[index]]);
            rows.push([`Peso/Kilos ${index + 1}`, bobinasPesos[index]]);
        });
    }

    // Añadir otros elementos a la tabla
    if (otrosCants.length > 0) {
        rows.push(["Otros", ""]);
        otrosCants.forEach((otrosCant, index) => {
            rows.push([`CANT ${index + 1}`, otrosCant]);
            rows.push([`Descripción ${index + 1}`, otrosDescs[index]]);
        });
    }

    // Crear la tabla en el PDF
    doc.autoTable({
        startY: 35,
        head: [['Campo', 'Valor']],
        body: rows,
        styles: {
            halign: 'center',
            fontSize: 10,
            textColor: [0, 0, 0],
            lineColor: [44, 62, 80],
            lineWidth: 0.25,
        },
        headStyles: {
            fillColor: [205, 167, 57],
            textColor: [255, 255, 255],
            fontSize: 12,
            fontStyle: 'bold',
            halign: 'center',
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [44, 62, 80],
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.25,
        theme: 'grid',
        didParseCell: function (data) {
            if (data.row.raw[0].content === "Cajas" || data.row.raw[0].content === "Bobinas" || data.row.raw[0].content === "Otros") {
                data.cell.styles.fillColor = [255, 188, 71];
            }
        }
    });


}

// Asigna la función a los botones
document.getElementById("procesar-btn").onclick = showCustomAlert;
document.getElementById("alert-confirm").onclick = confirmRequerimiento;
document.getElementById("alert-cancel").onclick = closeAlert;

function agregarCaja() {
    const container = document.getElementById("cajas-container");
    const index = container.childElementCount + 1;
    const div = document.createElement("div");
    div.className = "form-group";
    div.id = `caja-${index}`;
    div.innerHTML = `
        <label for="cajas_paq">PAQ:</label>
        <input type="text" id="cajas_paq" name="cajas_paq" required>
        <label for="cajas_desc">Descripción:</label>
        <input type="text" id="cajas_desc" name="cajas_desc" required>
    `;
    container.appendChild(div);
}

function agregarBobina() {
    const container = document.getElementById("bobina-container");
    const index = container.childElementCount + 1;
    const div = document.createElement("div");
    div.className = "form-group";
    div.id = `bobina-${index}`;
    div.innerHTML = `
        <label for="bobina_uni">UNI:</label>
        <input type="text" id="bobina_uni" name="bobina_uni" required>
        <label for="bobina_desc">Descripción:</label>
        <input type="text" id="bobina_desc" name="bobina_desc" required>
        <label for="bobina_peso">Peso/Kilos:</label>
        <input type="number" id="bobina_peso" name="bobina_peso" required>
    `;
    container.appendChild(div);
}

function agregarOtros() {
    const container = document.getElementById("otros-container");
    const index = container.childElementCount + 1;
    const div = document.createElement("div");
    div.className = "form-group";
    div.id = `otros-${index}`;
    div.innerHTML = `
        <label for="otros_cant">CANT:</label>
        <input type="text" id="otros_cant" name="otros_cant" required>
        <label for="otros_desc">Descripción:</label>
        <input type="text" id="otros_desc" name="otros_desc" required>
    `;
    container.appendChild(div);
}

function resetFormulario() {
    document.getElementById("requerimiento-form").reset();
    document.getElementById("cajas-container").innerHTML = '';
    document.getElementById("bobina-container").innerHTML = '';
    document.getElementById("otros-container").innerHTML = '';
}
























