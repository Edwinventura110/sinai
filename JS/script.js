function processRequerimiento() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const userConfirmed = confirm("¿Está seguro de procesar el requerimiento?");

    if (userConfirmed) {
        const procesarBtn = document.getElementById("procesar-btn");
        procesarBtn.disabled = true;

        const correlativo = localStorage.getItem('pdfCorrelativo') || 0;
        const dia = document.getElementById("dia").value;
        const hora = document.getElementById("hora").value;
        const supervisor = document.getElementById("supervisor").value;
        const linea = document.getElementById("linea").value;

        const rows = [];

        // Encabezado
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(255, 188, 71);
        doc.rect(10, 10, 190, 20, 'F');
        doc.setTextColor(0, 0, 0);
        doc.text(`Requerimiento de Material de Empaque - Correlativo: ${correlativo}`, 105, 22, { align: "center" });

        // Datos Generales
        rows.push(["Día", dia]);
        rows.push(["Hora", hora]);
        rows.push(["Supervisor", supervisor]);
        rows.push(["Línea", linea]);

        // Obtener las cajas
        const cajas = document.querySelectorAll("#cajas-container .form-group");
        if (cajas.length > 0) {
            rows.push([{ content: "Cajas", colSpan: 2, styles: { fillColor: [255, 188, 71] } }]);
            cajas.forEach((caja, index) => {
                const cajasPaq = caja.querySelector('input[name="cajas_paq"]').value;
                const cajasDesc = caja.querySelector('input[name="cajas_desc"]').value;
                rows.push([`PAQ ${index + 1}`, cajasPaq]);
                rows.push([`Descripción ${index + 1}`, cajasDesc]);
            });
        }

        // Obtener las bobinas
        const bobinas = document.querySelectorAll("#bobina-container .form-group");
        if (bobinas.length > 0) {
            rows.push([{ content: "Bobinas", colSpan: 2, styles: { fillColor: [255, 188, 71] } }]);
            bobinas.forEach((bobina, index) => {
                const bobinaUni = bobina.querySelector('input[name="bobina_uni"]').value;
                const bobinaDesc = bobina.querySelector('input[name="bobina_desc"]').value;
                const bobinaPeso = bobina.querySelector('input[name="bobina_peso"]').value;
                rows.push([`UNI ${index + 1}`, bobinaUni]);
                rows.push([`Descripción ${index + 1}`, bobinaDesc]);
                rows.push([`Peso/Kilos ${index + 1}`, bobinaPeso]);
            });
        }

        // Obtener los otros
        const otros = document.querySelectorAll("#otros-container .form-group");
        if (otros.length > 0) {
            rows.push([{ content: "Otros", colSpan: 2, styles: { fillColor: [255, 188, 71] } }]);
            otros.forEach((otro, index) => {
                const otrosCant = otro.querySelector('input[name="otros_cant"]').value;
                const otrosDesc = otro.querySelector('input[name="otros_desc"]').value;
                rows.push([`CANT ${index + 1}`, otrosCant]);
                rows.push([`Descripción ${index + 1}`, otrosDesc]);
            });
        }

        doc.setFontSize(10);

        doc.autoTable({
            startY: 35,
            head: [['Campo', 'Valor']],
            body: rows,
            styles: {
                halign: 'center',
                fontSize: 10,
                textColor: [0, 0, 0],
                lineColor: [44, 62, 80],
                lineWidth: 0.25, // Reduce el grosor de las líneas de la tabla
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
            tableLineWidth: 0.25, // Reduce el grosor de las líneas de la tabla
            theme: 'grid',
            didParseCell: function (data) {
                if (data.row.raw[0].content === "Cajas" || data.row.raw[0].content === "Bobinas" || data.row.raw[0].content === "Otros") {
                    data.cell.styles.fillColor = [255, 188, 71];
                }
            }
        });

        const pdfPath = `requerimiento_material_empaque_${correlativo}.pdf`;
        doc.save(pdfPath);

        const nextCorrelativo = parseInt(correlativo) + 1;
        localStorage.setItem('pdfCorrelativo', nextCorrelativo.toString());

        const email = 'edwinventura110@gmail.com';
        const subject = encodeURIComponent('Requerimiento de Material de Empaque');
        const body = encodeURIComponent(`Adjunto encontrará el PDF del requerimiento con correlativo ${correlativo}.`);
        const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;

        alert('Requerimiento procesado y PDF generado.');
    }
}

// Función para limpiar el formulario
function resetFormulario() {
    document.getElementById("requerimiento-form").reset();
    document.getElementById("procesar-btn").disabled = false; // Volver a habilitar el botón
}

// Función para agregar una nueva caja
function agregarCaja() {
    const container = document.getElementById("cajas-container");
    const newIndex = container.childElementCount + 1;
    const newCaja = document.createElement("div");
    newCaja.className = "form-group";
    newCaja.innerHTML = `
        <label for="cajas_paq_${newIndex}">PAQ:</label>
        <input type="text" id="cajas_paq_${newIndex}" name="cajas_paq" required>
        <label for="cajas_desc_${newIndex}">Descripción:</label>
        <input type="text" id="cajas_desc_${newIndex}" name="cajas_desc" required>
    `;
    container.appendChild(newCaja);
}

// Función para agregar una nueva bobina
function agregarBobina() {
    const container = document.getElementById("bobina-container");
    const newIndex = container.childElementCount + 1;
    const newBobina = document.createElement("div");
    newBobina.className = "form-group";
    newBobina.innerHTML = `
        <label for="bobina_uni_${newIndex}">UNI:</label>
        <input type="text" id="bobina_uni_${newIndex}" name="bobina_uni" required>
        <label for="bobina_desc_${newIndex}">Descripción:</label>
        <input type="text" id="bobina_desc_${newIndex}" name="bobina_desc" required>
        <label for="bobina_peso_${newIndex}">Peso/Kilos:</label>
        <input type="number" id="bobina_peso_${newIndex}" name="bobina_peso" required>
    `;
    container.appendChild(newBobina);
}

// Función para agregar un nuevo "Otro"
function agregarOtros() {
    const container = document.getElementById("otros-container");
    const newIndex = container.childElementCount + 1;
    const newOtro = document.createElement("div");
    newOtro.className = "form-group";
    newOtro.innerHTML = `
        <label for="otros_cant_${newIndex}">CANT:</label>
        <input type="text" id="otros_cant_${newIndex}" name="otros_cant" required>
        <label for="otros_desc_${newIndex}">Descripción:</label>
        <input type="text" id="otros_desc_${newIndex}" name="otros_desc" required>
    `;
    container.appendChild(newOtro);
}























