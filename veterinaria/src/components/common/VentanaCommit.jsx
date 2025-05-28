import { deleteUser } from '../../services/UsuarioService';
import { deleteConsulta } from '../../services/ConsultaService';
import { deleteCliente } from '../../services/ClienteService';
import { deleteMascota } from '../../services/MascotaService';
import { deleteCita } from '../../services/CitaService';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function VentanaUserCommit({ show, onHide, userData }) {
    const handleDelete = async () => {
        try {
            if (userData && userData.id) {
                const success = await deleteUser(userData.id);
                if (success) {
                    console.log('Usuario eliminado exitosamente');
                    // Aquí podrías agregar una notificación de éxito
                    onHide(); // Cerrar el modal
                    window.location.reload(); // Recargar la página para actualizar la lista
                } else {
                    console.error('Error al eliminar usuario');
                    // Aquí podrías agregar una notificación de error
                }
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            // Aquí podrías agregar una notificación de error
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {userData && (
                    <>
                        ¿Estás seguro de eliminar a {userData.nombre} {userData.apellido}?
                        <p className="text-danger mt-2">Esta acción no se puede deshacer.</p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export function VentanaConsCommit({ show, onHide, consultaData }) {
    const handleDelete = async () => {
        try {
            if (consultaData && consultaData.id) {
                const success = await deleteConsulta(consultaData.id);
                if (success) {
                    console.log('Consulta eliminada exitosamente');
                    onHide(); // Cerrar el modal
                    window.location.reload(); // Recargar la página
                } else {
                    console.error('Error al eliminar consulta');
                }
            }
        } catch (error) {
            console.error('Error al eliminar consulta:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Consulta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {consultaData && (
                    <>
                        ¿Estás seguro de eliminar la consulta "{consultaData.nombre}"?
                        <p className="text-danger mt-2">Esta acción no se puede deshacer.</p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export function VentanaCliCommit({ show, onHide, userData }) {
    const handleDelete = async () => {
        try {
            if (userData && userData.id) {
                const success = await deleteCliente(userData.id);
                if (success) {
                    console.log('Cliente eliminado exitosamente');
                    onHide(); // Cerrar el modal
                    window.location.reload(); // Recargar la página
                } else {
                    console.error('Error al eliminar cliente');
                }
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {userData && (
                    <>
                        ¿Estás seguro de eliminar al cliente {userData.nombre} {userData.apellido}?
                        <p className="text-danger mt-2">Esta acción no se puede deshacer.</p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export function VentanaMascCommit({ show, onHide, mascotaData }) {
    const handleDelete = async () => {
        try {
            if (mascotaData && mascotaData.id) {
                const success = await deleteMascota(mascotaData.id);
                if (success) {
                    console.log('Mascota eliminada exitosamente');
                    onHide(); // Cerrar el modal
                    window.location.reload(); // Recargar la página
                } else {
                    console.error('Error al eliminar mascota');
                }
            }
        } catch (error) {
            console.error('Error al eliminar mascota:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Mascota</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {mascotaData && (
                    <>
                        ¿Estás seguro de eliminar a la mascota {mascotaData.nombre}?
                        <p className="text-danger mt-2">Esta acción no se puede deshacer.</p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export function VentanaCitCommit({ show, onHide, citaData }) {
    const handleDelete = async () => {
        try {
            if (citaData && citaData.id) {
                const success = await deleteCita(citaData.id);
                if (success) {
                    console.log('Cita eliminada exitosamente');
                    onHide(); // Cerrar el modal
                    window.location.reload(); // Recargar la página
                } else {
                    console.error('Error al eliminar cita');
                }
            }
        } catch (error) {
            console.error('Error al eliminar cita:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Cita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {citaData && (
                    <>
                        <p>¿Estás seguro de eliminar la cita #{citaData.id}?</p>
                        <p>Detalles de la cita:</p>
                        <ul>
                            <li>Mascota: {citaData.mascota.nombre}</li>
                            <li>Cliente: {citaData.cliente.nombre} {citaData.cliente.apellido}</li>
                            <li>Veterinario: {citaData.veterinario.nombre} {citaData.veterinario.apellido}</li>
                            <li>Fecha: {new Date(citaData.fecha).toLocaleString()}</li>
                        </ul>
                        <p className="text-danger mt-2">Esta acción no se puede deshacer.</p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}