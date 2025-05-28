
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {CardGroup, Card } from 'react-bootstrap';
import { getMascotasByClienteId } from '../../services/MascotaService';

export function MascotasModal(props) {
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    if (props.clienteId) {
      getMascotasByClienteId(props.clienteId)
        .then(data => {
          if (data) {
            setMascotas(data);
          }
        })
        .catch(error => {
          console.error('Error al obtener las mascotas:', error);
        });
    }
  }, [props.clienteId]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Mascotas del Cliente
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mascotas.length > 0 ? (
          <CardGroup>
            {mascotas.map((mascota) => (
              <Card key={mascota.id} style={{ minWidth: '18rem', maxWidth: '25rem', margin: '10px' }}>
                <Card.Body>
                  <Card.Title>{mascota.nombre}</Card.Title>
                  <Card.Text>
                    <p><strong>Especie:</strong> {mascota.especie}</p>
                    <p><strong>Raza:</strong> {mascota.raza}</p>
                    <p><strong>Sexo:</strong> {mascota.sexo}</p>
                    <p><strong>Edad:</strong> {mascota.edad} años</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </CardGroup>
        ) : (
          <div className="text-center p-4">
            <h5>Este cliente no tiene mascotas registradas</h5>
            <p className="text-muted">
              Para registrar una mascota, use la opción "Registrar Mascota" en el menú principal
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="secondary">Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}