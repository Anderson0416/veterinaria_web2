import { useState } from 'react';
import {  Accordion, Card, Form, InputGroup, Row, Col, Badge, Tabs, Tab,Button } from 'react-bootstrap';

import { VentanaCitCommit} from '../common/VentanaCommit';

import { getAllCitas } from '../../services/CitaService';

import { ConsultasModal } from '../common/ConsultasModal';
import { VentanaPagoCita } from '../common/VentanaPago';
import { descargarPDFCita } from '../../services/PDFService';

import PayIcon from '../../assets/images/PayIcon.png';
import DelIcon from '../../assets/images/DelIcon.png';
import ConsIcon from '../../assets/images/ConsIcon.png';
import PrintIcon from '../../assets/images/PrintIcon.png';


export function ConsultarCit() {
    const [modalShowEli, setModalShowEli] = useState(false);
    const [citas, setCitas] = useState([]);
    const [activeKey, setActiveKey] = useState('');
    const [selectedCita, setSelectedCita] = useState(null);
    const [showConsultasModal, setShowConsultasModal] = useState(false);
    const [selectedFacturaId, setSelectedFacturaId] = useState(null);
    const [showPagoModal, setShowPagoModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCitas, setFilteredCitas] = useState([]);

    const handleAccordionSelect = async (eventKey) => {
        setActiveKey(eventKey);
        
        if (eventKey === "0" && citas.length === 0) {
            try {
                const data = await getAllCitas();
                console.log('Todas las citas:', data);
                setCitas(data || []);
                setFilteredCitas(data || []);
            } catch (error) {
                console.error('Error al cargar citas:', error);
            }
        }
    };

    const handleEliClick = (cita) => {
        setSelectedCita(cita);
        setModalShowEli(true);
    };

    const handleVerConsultasClick = (cita) => {
        setSelectedFacturaId(cita.factura.id);
        setShowConsultasModal(true);
    };

    const handlePagarClick = (cita) => {
        setSelectedCita(cita);
        setShowPagoModal(true);
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);
        
        if (searchValue === '') {
            setFilteredCitas(citas);
        } else {
            const filtered = citas.filter(cita => 
                cita.cliente.id.toString().includes(searchValue)
            );
            setFilteredCitas(filtered);
        }
    };
    const handleDescargarPDF = async (SelCitaId) => {
    try {
        await descargarPDFCita(SelCitaId);
    } catch (error) {
        console.error('Error al descargar el PDF:', error);
        alert('Error al descargar el PDF. Por favor, intente nuevamente.');
    }
};
    const formatearFecha = (fechaArray) => {
        if (!fechaArray || fechaArray.length < 3) return 'Fecha no disponible';
        const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2]);
        return fecha.toLocaleDateString();
    };

    const formatearFechaHora = (fechaArray) => {
        if (!fechaArray || fechaArray.length < 5) return 'Fecha no disponible';
        const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
        return fecha.toLocaleString();
    };

    // Función para obtener el color de badge según el estado
    const getBadgeVariant = (estado) => {
        switch(estado) {
            case 'Pagado': return 'success';
            case 'Pendiente': return 'warning';
            case 'Cancelado': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <>
            <Accordion 
                activeKey={activeKey}
                onSelect={handleAccordionSelect}
                className="transparent-accordion"
            >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <i className="fas fa-calendar-check me-2"></i>
                        <span className="fw-bold">Gestión de Citas</span>
                    </Accordion.Header>
                    <Accordion.Body className="bg-light">
                        {/* Estilos para los iconos en los botones */}
                        <style jsx>{`
                            .icon {
                                width: 24px;
                                height: 24px;
                                display: inline-block;
                                vertical-align: middle;
                            }
                            button.btn-sm {
                                padding: 0.25rem 0.5rem;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        `}</style>
                        {/* Barra de búsqueda mejorada */}
                        <div className="mb-4">
                            <InputGroup className="shadow-sm">
                                <InputGroup.Text className="bg-white border-end-0">
                                    <i className="fas fa-search text-primary"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Buscar por ID de cliente..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    type="input"
                                    className="border-start-0"
                                />
                                {searchTerm && (
                                    <Button 
                                        variant="outline-secondary"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilteredCitas(citas);
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                )}
                            </InputGroup>
                        </div>

                        {filteredCitas.length > 0 ? (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {filteredCitas.map((cita) => (
                                    <Col key={cita.id}>
                                        <Card className="h-100 shadow-sm border-0 rounded-3 position-relative">
                                            {/* Header con gradiente */}
                                            <Card.Header className="bg-gradient p-3" 
                                                style={{ background: 'linear-gradient(45deg, #4a6bbd, #60a3bc)' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h5 className="m-0 fw-bold">Cita #{cita.id}</h5>
                                                    <Badge bg={getBadgeVariant(cita.estado)} pill>
                                                        {cita.estado}
                                                    </Badge>
                                                </div>
                                            </Card.Header>
                                            
                                            <Card.Body className="pb-2">
                                                {/* Sección de Fecha y Estado */}
                                                <div className="mb-3 pb-3 border-bottom">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <div className="bg-light rounded-circle p-2 me-2">
                                                            <i className="far fa-calendar-alt text-primary"></i>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted d-block">Fecha y Hora</small>
                                                            <span className="fw-semibold">{formatearFechaHora(cita.fecha)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-light rounded-circle p-2 me-2">
                                                            <i className="fas fa-check-circle text-primary"></i>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted d-block">Atendido</small>
                                                            <span className="fw-semibold">{cita.atendido ? 'Sí' : 'No'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Sistema de pestañas para la información */}
                                                <Tabs defaultActiveKey="mascota" className="mb-3 small">
                                                    <Tab eventKey="mascota" title={<span><i className="fas fa-paw me-1"></i> Mascota</span>}>
                                                        <div className="p-2">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                                                                    <i className="fas fa-paw text-primary"></i>
                                                                </div>
                                                                <div>
                                                                    <small className="text-muted">Nombre</small>
                                                                    <h6 className="m-0 fw-bold">{cita.mascota.nombre}</h6>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="row g-2 mt-2">
                                                                <div className="col-6">
                                                                    <div className="border rounded p-2 h-100">
                                                                        <small className="text-muted d-block">Especie</small>
                                                                        <span>{cita.mascota.especie}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="border rounded p-2 h-100">
                                                                        <small className="text-muted d-block">Raza</small>
                                                                        <span>{cita.mascota.raza}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="border rounded p-2">
                                                                        <small className="text-muted d-block">Edad</small>
                                                                        <span>{cita.mascota.edad} años</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="cliente" title={<span><i className="fas fa-user me-1"></i> Cliente</span>}>
                                                        <div className="p-2">
                                                            <div className="d-flex align-items-center mb-3">
                                                                <div className="bg-info bg-opacity-10 rounded-circle p-2 me-2">
                                                                    <i className="fas fa-user text-info"></i>
                                                                </div>
                                                                <div>
                                                                    <small className="text-muted">Nombre Completo</small>
                                                                    <h6 className="m-0 fw-bold">{`${cita.cliente.nombre} ${cita.cliente.apellido}`}</h6>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="row g-2">
                                                                <div className="col-6">
                                                                    <div className="border rounded p-2">
                                                                        <small className="text-muted d-block">ID Cliente</small>
                                                                        <span className="fw-semibold">{cita.cliente.id}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="border rounded p-2">
                                                                        <small className="text-muted d-block">Teléfono</small>
                                                                        <span>{cita.cliente.telefono}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="vet" title={<span><i className="fas fa-user-md me-1"></i> Veterinario</span>}>
                                                        <div className="p-2">
                                                            <div className="d-flex align-items-center mb-3">
                                                                <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                                                                    <i className="fas fa-user-md text-success"></i>
                                                                </div>
                                                                <div>
                                                                    <small className="text-muted">Nombre Completo</small>
                                                                    <h6 className="m-0 fw-bold">{`${cita.veterinario.nombre} ${cita.veterinario.apellido}`}</h6>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="border rounded p-2">
                                                                <small className="text-muted d-block">ID Veterinario</small>
                                                                <span className="fw-semibold">{cita.veterinario.id}</span>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="factura" title={<span><i className="fas fa-file-invoice-dollar me-1"></i> Factura</span>}>
                                                        <div className="p-2">
                                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                                <div>
                                                                    <small className="text-muted">ID Factura</small>
                                                                    <h6 className="m-0 fw-bold">#{cita.factura.id}</h6>
                                                                </div>
                                                                <div className="text-end">
                                                                    <small className="text-muted d-block">Total</small>
                                                                    <h5 className="m-0 text-success fw-bold">${cita.factura.total}</h5>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="border rounded p-2">
                                                                <small className="text-muted d-block">Fecha de Facturación</small>
                                                                <span>{formatearFechaHora(cita.factura.fecha)}</span>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="notas" title={<span><i className="fas fa-sticky-note me-1"></i> Notas</span>}>
                                                        <div className="p-3 bg-light rounded">
                                                            {cita.anotaciones ? (
                                                                <p className="mb-0">{cita.anotaciones}</p>
                                                            ) : (
                                                                <p className="text-muted mb-0 fst-italic">Sin anotaciones</p>
                                                            )}
                                                        </div>
                                                    </Tab>
                                                </Tabs>
                                            </Card.Body>
                                            
                                            <Card.Footer className="bg-white border-0 pt-0">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        {cita.estado !== 'Pagado' && (
                                                            <Button 
                                                                variant="success" 
                                                                size="sm"
                                                                onClick={() => handlePagarClick(cita)}
                                                                className="me-2"
                                                                title="Pagar"
                                                            >
                                                                <img src={PayIcon} alt="Pagar" className="icon" />
                                                            </Button>
                                                        )}
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleEliClick(cita)}
                                                            title="Eliminar"
                                                        >
                                                            <img src={DelIcon} alt="Eliminar" className="icon" />
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="info"
                                                        size="sm"
                                                        onClick={() => handleVerConsultasClick(cita)}
                                                        className="text-white"
                                                        title="Ver Consultas"
                                                    >
                                                        <img src={ConsIcon} alt="Ver Consultas" className="icon" />
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleDescargarPDF(cita.id)}
                                                        title="Imprimir"
                                                    >
                                                        <img src={PrintIcon} alt="Imprimir" className="icon" />
                                                    </Button>
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className="text-center p-5 bg-white rounded shadow-sm">
                                <div className="mb-3">
                                    <i className="fas fa-calendar-times fa-3x text-muted"></i>
                                </div>
                                <h5 className="text-muted">
                                    {searchTerm 
                                        ? 'No se encontraron citas para este cliente'
                                        : 'No hay citas programadas en el sistema'
                                    }
                                </h5>
                                <p className="text-muted">
                                    {searchTerm 
                                        ? 'Intente con un ID de cliente diferente'
                                        : 'Las citas registradas aparecerán aquí'
                                    }
                                </p>
                            </div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
                        {/* Agregar estilos personalizados para el acordeón transparente */}
            <style jsx>{`
                /* Personalizaciones para el acordeón transparente */
                .transparent-accordion .accordion-body {
                    background-color: transparent !important;
                }
                
                /* Hacer que el header también sea transparente */
                .transparent-accordion .accordion-header {
                    background-color: transparent !important;
                }
                
                .transparent-accordion .accordion-header button {
                    background-color: transparent !important;
                   
                }
                
                .transparent-accordion .accordion-button:not(.collapsed) {
                    background-color: transparent !important;
                    box-shadow: none !important;
                }
                
                .transparent-accordion .accordion-button:focus {
                    box-shadow: none !important;
                   
                }
                
                /* Todo el acordeón transparente */
                .transparent-accordion .accordion-item {
                    background-color: transparent !important;
                    
                }
            `}</style>
            {/* Mantener los modales */}
            <VentanaCitCommit
                show={modalShowEli && selectedCita !== null}
                onHide={() => {
                    setModalShowEli(false);
                    setSelectedCita(null);
                }}
                citaData={selectedCita}
            />
            
            <ConsultasModal
                show={showConsultasModal && selectedFacturaId !== null}
                onHide={() => {
                    setShowConsultasModal(false);
                    setSelectedFacturaId(null);
                }}
                facturaId={selectedFacturaId}
            />
            <VentanaPagoCita
                show={showPagoModal && selectedCita !== null}
                onHide={() => {
                    setShowPagoModal(false);
                    setSelectedCita(null);
                }}
                citaData={selectedCita}
            />
        </>
    );
}
export default ConsultarCit;