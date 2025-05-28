import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { pagarCita } from '../../services/CitaService';

export function VentanaPagoCita({ show, onHide, citaData }) {
    const handlePagar = async () => {
        try {
            if (citaData && citaData.id) {
                const success = await pagarCita(citaData.id);
                if (success) {
                    console.log('Cita pagada exitosamente');
                    onHide(); // Cerrar el modal
                    window.location.reload(); // Recargar la página
                } else {
                    console.error('Error al pagar cita');
                }
            }
        } catch (error) {
            console.error('Error al pagar cita:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Pago de Cita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {citaData && (
                    <>
                        <p>¿Está seguro de realizar el pago de la cita #{citaData.id}?</p>
                        <p>Detalles de la cita:</p>
                        <ul>
                            <li>Mascota: {citaData.mascota.nombre}</li>
                            <li>Cliente: {citaData.cliente.nombre} {citaData.cliente.apellido}</li>
                            <li>Veterinario: {citaData.veterinario.nombre} {citaData.veterinario.apellido}</li>
                            <li>Fecha: {new Date(citaData.fecha).toLocaleString()}</li>
                            <li>Total a pagar: ${citaData.factura.total}</li>
                        </ul>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="success" onClick={handlePagar}>
                    Confirmar Pago
                </Button>
            </Modal.Footer>
        </Modal>
    );
}