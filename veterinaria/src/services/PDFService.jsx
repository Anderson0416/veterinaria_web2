import jsPDF from 'jspdf';
import { getHistorialById } from './HistorialService';
import { getCitaById } from './CitaService';
// Intentar importar autoTable de diferentes maneras para asegurar compatibilidad
import autoTable from 'jspdf-autotable';

/**
 * Servicio para generar PDFs de historiales clínicos
 */
export const PDFService = {
    /**
     * Genera y descarga un PDF del historial clínico según el ID proporcionado
     * @param {number} historialId - ID del historial clínico
     * @returns {Promise<void>}
     */
    async generarPDFHistorial(historialId) {
        try {
            // Obtener los datos del historial
            const historial = await getHistorialById(historialId);
            
            if (!historial) {
                throw new Error('No se pudo obtener el historial clínico');
            }
            
            // Configurar el documento PDF
            const doc = new jsPDF();
            
            // Asegurarse de que autoTable esté disponible
            if (typeof doc.autoTable !== 'function' && typeof autoTable === 'function') {
                // Si no está disponible como método, pero sí como función importada
                autoTable(doc);
            }
            
            // Establecer fuente
            doc.setFont('helvetica', 'normal');
            
            // Agregar header con título y datos de la clínica
            this.agregarCabecera(doc);
            
            // Información de la mascota
            this.agregarInformacionMascota(doc, historial);
            
            // Información adicional
            this.agregarInformacionAdicional(doc, historial);
            
            // Datos de la consulta
            this.agregarDatosConsulta(doc, historial);
            
            // Observaciones
            this.agregarObservaciones(doc, historial);
            
            // Dieta y alimentación
            this.agregarDieta(doc, historial);
            
            // Pie de página
            this.agregarPiePagina(doc);
            
            // Guardar el PDF
            doc.save(`Historial_${historialId}_${historial.mascota.nombre}.pdf`);
            
            return true;
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            throw error;
        }
    },
    
    /**
     * Agrega la cabecera del documento
     * @param {jsPDF} doc - Documento PDF
     */
    agregarCabecera(doc) {
        // Título principal
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('CONSULTA VETERINARIA AGENDA PELUDA', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
        
        // Información de contacto
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Dirección: Av. las Águilas 123', doc.internal.pageSize.getWidth() - 15, 15, { align: 'right' });
        doc.text('Teléfono: 567-546-55', doc.internal.pageSize.getWidth() - 15, 20, { align: 'right' });
        
        // Línea divisoria
        doc.setLineWidth(0.5);
        doc.line(15, 25, doc.internal.pageSize.getWidth() - 15, 25);
    },
    
    /**
     * Agrega la sección de información de la mascota
     * @param {jsPDF} doc - Documento PDF
     * @param {Object} historial - Datos del historial clínico
     */
    agregarInformacionMascota(doc, historial) {
        // Título de sección
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Información de la Mascota', 15, 35);
        doc.setLineWidth(0.2);
        doc.line(15, 37, 80, 37);
        
        let y = 45;
        
        // Si autoTable está disponible
        if (typeof doc.autoTable === 'function') {
            doc.autoTable({
                startY: 40,
                head: [],
                body: [
                    [{ content: 'ID Mascota:', styles: { fontStyle: 'bold' } }, historial.mascota.id.toString()],
                    [{ content: 'Nombre Mascota:', styles: { fontStyle: 'bold' } }, historial.mascota.nombre],
                    [{ content: 'Especie:', styles: { fontStyle: 'bold' } }, historial.mascota.especie],
                    [{ content: 'Raza:', styles: { fontStyle: 'bold' } }, historial.mascota.raza],
                    [{ content: 'Edad:', styles: { fontStyle: 'bold' } }, `${historial.mascota.edad} años`],
                    [{ content: 'Vacunas Previas:', styles: { fontStyle: 'bold' } }, historial.anamnesis.vacunasPrevias || 'No registrado'],
                    [{ content: 'Vacunas y Desparasitación:', styles: { fontStyle: 'bold' } }, historial.anamnesis.vacunasPreviasDesparacitacion || 'No registrado']
                ],
                theme: 'grid',
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                },
                columnStyles: {
                    0: { cellWidth: 60 },
                },
                margin: { left: 15, right: 15 },
            });
            y = doc.lastAutoTable.finalY + 10;
        } else {
            // Alternativa si autoTable no está disponible
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('ID Mascota:', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(historial.mascota.id.toString(), 75, y);
            y += 8;
            
            doc.setFont('helvetica', 'bold');
            doc.text('Nombre Mascota:', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(historial.mascota.nombre, 75, y);
            y += 8;
            
            doc.setFont('helvetica', 'bold');
            doc.text('Especie:', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(historial.mascota.especie, 75, y);
            y += 8;
            
            doc.setFont('helvetica', 'bold');
            doc.text('Raza:', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(historial.mascota.raza, 75, y);
            y += 8;
            
            doc.setFont('helvetica', 'bold');
            doc.text('Edad:', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(`${historial.mascota.edad} años`, 75, y);
            y += 8;
            
            doc.setFont('helvetica', 'bold');
            doc.text('Vacunas Previas:', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(historial.anamnesis.vacunasPrevias || 'No registrado', 75, y);
            y += 8;
            
            doc.setFont('helvetica', 'bold');
            doc.text('Vacunas y Desparasitación:', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(historial.anamnesis.vacunasPreviasDesparacitacion || 'No registrado', 75, y);
            y += 15;
        }
        
        return y; // Retornar la posición Y final
    },
    
    /**
     * Agrega la sección de información adicional
     * @param {jsPDF} doc - Documento PDF
     * @param {Object} historial - Datos del historial clínico
     * @param {number} startY - Posición Y inicial para esta sección
     * @returns {number} - Posición Y final después de agregar la sección
     */
    agregarInformacionAdicional(doc, historial) {
        // Determinar posición Y inicial
        let finalY = typeof doc.lastAutoTable !== 'undefined' ? 
            doc.lastAutoTable.finalY + 10 : 
            doc.internal.pageSize.getHeight() / 2 - 40;
        
        // Título de sección
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Información Adicional', 15, finalY);
        doc.setLineWidth(0.2);
        doc.line(15, finalY + 2, 70, finalY + 2);
        
        let y = finalY + 10;
        
        // Si autoTable está disponible
        if (typeof doc.autoTable === 'function') {
            doc.autoTable({
                startY: finalY + 5,
                head: [],
                body: [
                    [{ content: 'Actividad Física:', styles: { fontStyle: 'bold' } }, historial.anamnesis.actividadFisica || 'No registrado'],
                    [{ content: 'Estado Reproductivo:', styles: { fontStyle: 'bold' } }, historial.anamnesis.estadoReproductivo || 'No registrado'],
                    [{ content: 'Tipo de Vivienda:', styles: { fontStyle: 'bold' } }, historial.anamnesis.tipoVivienda || 'No registrado']
                ],
                theme: 'grid',
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                },
                columnStyles: {
                    0: { cellWidth: 60 },
                },
                margin: { left: 15, right: 15 },
            });
            y = doc.lastAutoTable.finalY + 10;
        } else {
            // Alternativa si autoTable no está disponible
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('Actividad Física:', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(historial.anamnesis.actividadFisica || 'No registrado', 75, y);
            y += 8;
            
            doc.setFont('helvetica', 'bold');
            doc.text('Estado Reproductivo:', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(historial.anamnesis.estadoReproductivo || 'No registrado', 75, y);
            y += 8;
            
            doc.setFont('helvetica', 'bold');
            doc.text('Tipo de Vivienda:', 15, y);
            doc.setFont('helvetica', 'normal');
            doc.text(historial.anamnesis.tipoVivienda || 'No registrado', 75, y);
            y += 15;
        }
        
        return y; // Retornar la posición Y final
    },
    
    /**
     * Agrega la sección de datos de la consulta
     * @param {jsPDF} doc - Documento PDF
     * @param {Object} historial - Datos del historial clínico
     * @returns {number} - Posición Y final después de agregar la sección
     */
    agregarDatosConsulta(doc, historial) {
        // Determinar posición Y inicial
        let finalY = typeof doc.lastAutoTable !== 'undefined' ? 
            doc.lastAutoTable.finalY + 10 : 
            doc.internal.pageSize.getHeight() / 2;
        
        // Título de sección
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Datos de la Consulta', 15, finalY);
        doc.setLineWidth(0.2);
        doc.line(15, finalY + 2, 70, finalY + 2);
        
        let y = finalY + 10;
        
        // Si autoTable está disponible
        if (typeof doc.autoTable === 'function') {
            doc.autoTable({
                startY: finalY + 5,
                head: [['Peso', 'Motivo de Consulta', 'Síntomas']],
                body: [
                    [
                        historial.anamnesis.peso || 'No registrado',
                        historial.anamnesis.motivoConsulta || 'No registrado',
                        historial.anamnesis.sintomasMascota || 'No registrado'
                    ]
                ],
                theme: 'grid',
                styles: {
                    fontSize: 10,
                    cellPadding: 5,
                    halign: 'left',
                    valign: 'middle',
                    lineWidth: 0.5,
                },
                headStyles: {
                    fillColor: [220, 220, 220],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                },
                margin: { left: 15, right: 15 },
            });
            y = doc.lastAutoTable.finalY + 10;
        } else {
            // Alternativa si autoTable no está disponible
            // Encabezados
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            
            // Dibujar rectangulos para la tabla
            doc.setFillColor(220, 220, 220);
            doc.rect(15, y, 50, 8, 'F');
            doc.rect(65, y, 60, 8, 'F');
            doc.rect(125, y, 60, 8, 'F');
            
            doc.text('Peso', 20, y + 5);
            doc.text('Motivo de Consulta', 70, y + 5);
            doc.text('Síntomas', 130, y + 5);
            y += 8;
            
            // Datos
            doc.setFont('helvetica', 'normal');
            doc.rect(15, y, 50, 20, 'S');
            doc.rect(65, y, 60, 20, 'S');
            doc.rect(125, y, 60, 20, 'S');
            
            doc.text(historial.anamnesis.peso || 'No registrado', 20, y + 5);
            
            // Para textos más largos, dividir en líneas
            const motivoConsulta = historial.anamnesis.motivoConsulta || 'No registrado';
            const sintomasMascota = historial.anamnesis.sintomasMascota || 'No registrado';
            
            const splitMotivo = doc.splitTextToSize(motivoConsulta, 50);
            const splitSintomas = doc.splitTextToSize(sintomasMascota, 50);
            
            doc.text(splitMotivo, 70, y + 5);
            doc.text(splitSintomas, 130, y + 5);
            
            y += 25; // Espacio para contenido múltiples líneas
        }
        
        return y; // Retornar la posición Y final
    },
    
    /**
     * Agrega la sección de observaciones
     * @param {jsPDF} doc - Documento PDF
     * @param {Object} historial - Datos del historial clínico
     * @returns {number} - Posición Y final después de agregar la sección
     */
    agregarObservaciones(doc, historial) {
        // Determinar posición Y inicial
        let finalY = typeof doc.lastAutoTable !== 'undefined' ? 
            doc.lastAutoTable.finalY + 10 : 
            doc.internal.pageSize.getHeight() * 0.65;
        
        // Título de sección
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Observaciones Adicionales', 15, finalY);
        doc.setLineWidth(0.2);
        doc.line(15, finalY + 2, 80, finalY + 2);
        
        // Observaciones en formato de texto multilínea
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const observaciones = historial.anamnesis.observaciones || 'No hay observaciones registradas';
        const splitObservaciones = doc.splitTextToSize(observaciones, doc.internal.pageSize.getWidth() - 30);
        
        doc.text(splitObservaciones, 15, finalY + 10);
        
        // Estimar altura del texto
        const observacionesHeight = splitObservaciones.length * 5; // ~5 pts por línea
        
        return finalY + 10 + observacionesHeight; // Retornar la posición Y final
    },
    
    /**
     * Agrega la sección de dieta y alimentación
     * @param {jsPDF} doc - Documento PDF
     * @param {Object} historial - Datos del historial clínico
     */
    agregarDieta(doc, historial) {
        // Posición Y dinámica basada en el contenido anterior
        const finalY = typeof doc.lastAutoTable !== 'undefined' && doc.lastAutoTable.finalY > 200 ? 
            doc.lastAutoTable.finalY + 20 : 
            doc.internal.pageSize.getHeight() * 0.75;
        
        // Asegurarse de que hay suficiente espacio en la página, o añadir nueva
        if (finalY > doc.internal.pageSize.getHeight() - 30) {
            doc.addPage();
            finalY = 20; // Resetear Y en nueva página
        }
        
        // Título de sección
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Dieta y Alimentación', 15, finalY);
        doc.setLineWidth(0.2);
        doc.line(15, finalY + 2, 70, finalY + 2);
        
        // Dieta en formato de texto multilínea
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const dieta = historial.anamnesis.dieta || 'No hay información sobre dieta registrada';
        const splitDieta = doc.splitTextToSize(dieta, doc.internal.pageSize.getWidth() - 30);
        
        doc.text(splitDieta, 15, finalY + 10);
    },
    
    /**
     * Agrega el pie de página
     * @param {jsPDF} doc - Documento PDF
     */
    agregarPiePagina(doc) {
        // Posición para el pie de página
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Línea divisoria
        doc.setLineWidth(0.5);
        doc.line(15, pageHeight - 15, doc.internal.pageSize.getWidth() - 15, pageHeight - 15);
        
        // Texto del pie de página
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('© 2024 Clínica Veterinaria Agenda Peluda - Todos los derechos reservados', 
            doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
    },
    
    /**
     * Formatea la fecha y hora para mostrar en el PDF
     * @param {Array} fechaArray - Array con los datos de fecha [año, mes, día, hora, minuto]
     * @returns {string} - Fecha formateada
     */
    formatearFechaHora(fechaArray) {
        if (!fechaArray || fechaArray.length < 5) return 'Fecha no disponible';
        const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
        return fecha.toLocaleString();
    }
};

/**
 * Función para descargar un PDF de una consulta específica
 * @param {number} historialId - ID del historial a descargar
 */
export const descargarPDFConsulta = async (historialId) => {
    try {
        await PDFService.generarPDFHistorial(historialId);
        return true;
    } catch (error) {
        console.error('Error al descargar el PDF:', error);
        throw error;
    }
};

/**
 * Genera y descarga un PDF con la información de una cita según el ID proporcionado
 * @param {number} citaId - ID de la cita
 * @returns {Promise<boolean>} - true si se descargó correctamente
 */
export const generarPDFCita = async (citaId) => {
    try {
        // Obtener los datos de la cita usando el método existente
        const cita = await getCitaById(citaId);
        
        if (!cita) {
            throw new Error('No se pudo obtener la información de la cita');
        }
        
        // Configurar el documento PDF
        const doc = new jsPDF();
        
        // Asegurarse de que autoTable esté disponible
        if (typeof doc.autoTable !== 'function' && typeof autoTable === 'function') {
            // Si no está disponible como método, pero sí como función importada
            autoTable(doc);
        }
        
        // Establecer fuente
        doc.setFont('helvetica', 'normal');
        
        // Agregar header con título y datos de la clínica
        agregarCabeceraCita(doc);
        
        // Información general de la cita
        agregarInformacionCita(doc, cita);
        
        // Información de la mascota
        agregarInformacionMascotaCita(doc, cita);
        
        // Información del cliente
        agregarInformacionClienteCita(doc, cita);
        
        // Información del veterinario
        agregarInformacionVeterinarioCita(doc, cita);
        
        // Información de factura
        agregarInformacionFacturaCita(doc, cita);
        
        // Notas adicionales
        agregarNotasCita(doc, cita);
        
        // Pie de página
        agregarPiePaginaCita(doc);
        
        // Guardar el PDF
        doc.save(`Cita_${citaId}_${cita.mascota.nombre}.pdf`);
        
        return true;
    } catch (error) {
        console.error('Error al generar el PDF de la cita:', error);
        throw error;
    }
};

/**
 * Agrega la cabecera del documento para citas
 * @param {jsPDF} doc - Documento PDF
 */
const agregarCabeceraCita = (doc) => {
    // Título principal
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLE DE CITA VETERINARIA', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    // Información de contacto
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Dirección: Av. las Águilas 123', doc.internal.pageSize.getWidth() - 15, 15, { align: 'right' });
    doc.text('Teléfono: 567-546-55', doc.internal.pageSize.getWidth() - 15, 20, { align: 'right' });
    
    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.line(15, 25, doc.internal.pageSize.getWidth() - 15, 25);
};

/**
 * Agrega la información general de la cita
 * @param {jsPDF} doc - Documento PDF
 * @param {Object} cita - Datos de la cita
 */
const agregarInformacionCita = (doc, cita) => {
    // Título de sección
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Información General de la Cita', 15, 35);
    doc.setLineWidth(0.2);
    doc.line(15, 37, 100, 37);
    
    // Formatear fecha y hora de la cita
    const fechaFormateada = formatearFechaHora(cita.fecha);
    
    // Si autoTable está disponible
    if (typeof doc.autoTable === 'function') {
        doc.autoTable({
            startY: 40,
            head: [],
            body: [
                [{ content: 'ID Cita:', styles: { fontStyle: 'bold' } }, cita.id.toString()],
                [{ content: 'Fecha y Hora:', styles: { fontStyle: 'bold' } }, fechaFormateada],
                [{ content: 'Estado:', styles: { fontStyle: 'bold' } }, cita.estado],
                [{ content: 'Atendido:', styles: { fontStyle: 'bold' } }, cita.atendido ? 'Sí' : 'No']
            ],
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 60 },
            },
            margin: { left: 15, right: 15 },
        });
    } else {
        // Alternativa si autoTable no está disponible
        let y = 45;
        doc.setFontSize(10);
        
        doc.setFont('helvetica', 'bold');
        doc.text('ID Cita:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.id.toString(), 75, y);
        y += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha y Hora:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(fechaFormateada, 75, y);
        y += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Estado:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.estado, 75, y);
        y += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Atendido:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.atendido ? 'Sí' : 'No', 75, y);
    }
};

/**
 * Agrega la información de la mascota
 * @param {jsPDF} doc - Documento PDF
 * @param {Object} cita - Datos de la cita
 */
const agregarInformacionMascotaCita = (doc, cita) => {
    // Determinar posición Y inicial
    let finalY = typeof doc.lastAutoTable !== 'undefined' ? 
        doc.lastAutoTable.finalY + 10 : 
        80;
    
    // Título de sección
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Información de la Mascota', 15, finalY);
    doc.setLineWidth(0.2);
    doc.line(15, finalY + 2, 80, finalY + 2);
    
    // Si autoTable está disponible
    if (typeof doc.autoTable === 'function') {
        doc.autoTable({
            startY: finalY + 5,
            head: [],
            body: [
                [{ content: 'ID Mascota:', styles: { fontStyle: 'bold' } }, cita.mascota.id.toString()],
                [{ content: 'Nombre:', styles: { fontStyle: 'bold' } }, cita.mascota.nombre],
                [{ content: 'Especie:', styles: { fontStyle: 'bold' } }, cita.mascota.especie],
                [{ content: 'Raza:', styles: { fontStyle: 'bold' } }, cita.mascota.raza],
                [{ content: 'Edad:', styles: { fontStyle: 'bold' } }, `${cita.mascota.edad} años`]
            ],
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 60 },
            },
            margin: { left: 15, right: 15 },
        });
    } else {
        // Alternativa si autoTable no está disponible
        let y = finalY + 8;
        doc.setFontSize(10);
        
        doc.setFont('helvetica', 'bold');
        doc.text('ID Mascota:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.mascota.id.toString(), 75, y);
        y += 7;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.mascota.nombre, 75, y);
        y += 7;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Especie:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.mascota.especie, 75, y);
        y += 7;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Raza:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.mascota.raza, 75, y);
        y += 7;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Edad:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${cita.mascota.edad} años`, 75, y);
    }
};

/**
 * Agrega la información del cliente
 * @param {jsPDF} doc - Documento PDF
 * @param {Object} cita - Datos de la cita
 */
const agregarInformacionClienteCita = (doc, cita) => {
    // Determinar posición Y inicial
    let finalY = typeof doc.lastAutoTable !== 'undefined' ? 
        doc.lastAutoTable.finalY + 10 : 
        120;
    
    // Título de sección
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Información del Cliente', 15, finalY);
    doc.setLineWidth(0.2);
    doc.line(15, finalY + 2, 80, finalY + 2);
    
    // Si autoTable está disponible
    if (typeof doc.autoTable === 'function') {
        doc.autoTable({
            startY: finalY + 5,
            head: [],
            body: [
                [{ content: 'ID Cliente:', styles: { fontStyle: 'bold' } }, cita.cliente.id.toString()],
                [{ content: 'Nombre:', styles: { fontStyle: 'bold' } }, `${cita.cliente.nombre} ${cita.cliente.apellido}`],
                [{ content: 'Teléfono:', styles: { fontStyle: 'bold' } }, cita.cliente.telefono || 'No registrado']
            ],
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 60 },
            },
            margin: { left: 15, right: 15 },
        });
    } else {
        // Alternativa si autoTable no está disponible
        let y = finalY + 8;
        doc.setFontSize(10);
        
        doc.setFont('helvetica', 'bold');
        doc.text('ID Cliente:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.cliente.id.toString(), 75, y);
        y += 7;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${cita.cliente.nombre} ${cita.cliente.apellido}`, 75, y);
        y += 7;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Teléfono:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.cliente.telefono || 'No registrado', 75, y);
    }
};

/**
 * Agrega la información del veterinario
 * @param {jsPDF} doc - Documento PDF
 * @param {Object} cita - Datos de la cita
 */
const agregarInformacionVeterinarioCita = (doc, cita) => {
    // Determinar posición Y inicial
    let finalY = typeof doc.lastAutoTable !== 'undefined' ? 
        doc.lastAutoTable.finalY + 10 : 
        150;
    
    // Título de sección
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Información del Veterinario', 15, finalY);
    doc.setLineWidth(0.2);
    doc.line(15, finalY + 2, 90, finalY + 2);
    
    // Si autoTable está disponible
    if (typeof doc.autoTable === 'function') {
        doc.autoTable({
            startY: finalY + 5,
            head: [],
            body: [
                [{ content: 'ID Veterinario:', styles: { fontStyle: 'bold' } }, cita.veterinario.id.toString()],
                [{ content: 'Nombre:', styles: { fontStyle: 'bold' } }, `${cita.veterinario.nombre} ${cita.veterinario.apellido}`]
            ],
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 60 },
            },
            margin: { left: 15, right: 15 },
        });
    } else {
        // Alternativa si autoTable no está disponible
        let y = finalY + 8;
        doc.setFontSize(10);
        
        doc.setFont('helvetica', 'bold');
        doc.text('ID Veterinario:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.veterinario.id.toString(), 75, y);
        y += 7;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${cita.veterinario.nombre} ${cita.veterinario.apellido}`, 75, y);
    }
};

/**
 * Agrega la información de la factura
 * @param {jsPDF} doc - Documento PDF
 * @param {Object} cita - Datos de la cita
 */
const agregarInformacionFacturaCita = (doc, cita) => {
    // Determinar posición Y inicial
    let finalY = typeof doc.lastAutoTable !== 'undefined' ? 
        doc.lastAutoTable.finalY + 10 : 
        180;
    
    // Título de sección
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Información de Facturación', 15, finalY);
    doc.setLineWidth(0.2);
    doc.line(15, finalY + 2, 90, finalY + 2);
    
    // Formatear fecha de facturación
    const fechaFactura = formatearFechaHora(cita.factura.fecha);
    
    // Si autoTable está disponible
    if (typeof doc.autoTable === 'function') {
        doc.autoTable({
            startY: finalY + 5,
            head: [],
            body: [
                [{ content: 'ID Factura:', styles: { fontStyle: 'bold' } }, cita.factura.id.toString()],
                [{ content: 'Fecha de Facturación:', styles: { fontStyle: 'bold' } }, fechaFactura],
                [{ content: 'Total:', styles: { fontStyle: 'bold' } }, `$${cita.factura.total}`]
            ],
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 60 },
            },
            margin: { left: 15, right: 15 },
        });
    } else {
        // Alternativa si autoTable no está disponible
        let y = finalY + 8;
        doc.setFontSize(10);
        
        doc.setFont('helvetica', 'bold');
        doc.text('ID Factura:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(cita.factura.id.toString(), 75, y);
        y += 7;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha de Facturación:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(fechaFactura, 75, y);
        y += 7;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Total:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`$${cita.factura.total}`, 75, y);
    }
};

/**
 * Agrega las notas de la cita
 * @param {jsPDF} doc - Documento PDF
 * @param {Object} cita - Datos de la cita
 */
const agregarNotasCita = (doc, cita) => {
    // Determinar posición Y inicial
    let finalY = typeof doc.lastAutoTable !== 'undefined' ? 
        doc.lastAutoTable.finalY + 10 : 
        210;
    
    // Asegurarse de que hay espacio suficiente en la página actual
    if (finalY > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        finalY = 20; // Resetear Y en nueva página
    }
    
    // Título de sección
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Anotaciones', 15, finalY);
    doc.setLineWidth(0.2);
    doc.line(15, finalY + 2, 50, finalY + 2);
    
    // Contenido de notas
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const anotaciones = cita.anotaciones || 'Sin anotaciones';
    const splitAnotaciones = doc.splitTextToSize(anotaciones, doc.internal.pageSize.getWidth() - 30);
    
    doc.text(splitAnotaciones, 15, finalY + 10);
};

/**
 * Agrega el pie de página
 * @param {jsPDF} doc - Documento PDF
 */
const agregarPiePaginaCita = (doc) => {
    // Posición para el pie de página
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 15, doc.internal.pageSize.getWidth() - 15, pageHeight - 15);
    
    // Texto del pie de página
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('© 2024 Clínica Veterinaria Agenda Peluda - Todos los derechos reservados', 
        doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
    
    // Agregar número de página
    doc.text(`Página ${doc.internal.getNumberOfPages()}`, 
        doc.internal.pageSize.getWidth() - 20, pageHeight - 10);
};

/**
 * Formatea la fecha y hora para mostrar en el PDF
 * @param {Array} fechaArray - Array con los datos de fecha [año, mes, día, hora, minuto]
 * @returns {string} - Fecha formateada
 */
const formatearFechaHora = (fechaArray) => {
    if (!fechaArray || fechaArray.length < 5) return 'Fecha no disponible';
    const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
    return fecha.toLocaleString();
};

/**
 * Función para descargar un PDF de una cita específica
 * @param {number} citaId - ID de la cita a descargar
 * @returns {Promise<boolean>} - true si se descargó correctamente
 */
export const descargarPDFCita = async (citaId) => {
    try {
        await generarPDFCita(citaId);
        return true;
    } catch (error) {
        console.error('Error al descargar el PDF de la cita:', error);
        throw error;
    }
};