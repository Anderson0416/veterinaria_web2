import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CardGroup, Card } from 'react-bootstrap';
import { getConsultasByFacturaId } from '../../services/ConsultaService';

export function ConsultasModal(props) {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    if (props.facturaId) {
      getConsultasByFacturaId(props.facturaId)
        .then(data => {
          if (data) {
            setConsultas(data);
          }
        })
        .catch(error => {
          console.error('Error al obtener las consultas:', error);
        });
    }
  }, [props.facturaId]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Consultas de la Factura #{props.facturaId}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {consultas.length > 0 ? (
          <CardGroup>
            {consultas.map((consulta) => (
              <Card key={consulta.id} style={{ minWidth: '18rem', maxWidth: '25rem', margin: '10px' }}>
                <Card.Body>
                  <Card.Title>{consulta.nombre}</Card.Title>
                  <Card.Text>
                    <p><strong>Descripción:</strong> {consulta.descripcion}</p>
                    <p><strong>Precio:</strong> ${consulta.precio}</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </CardGroup>
        ) : (
          <div className="text-center p-4">
            <h5>No hay consultas registradas para esta factura</h5>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="secondary">Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}