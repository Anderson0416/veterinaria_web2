import { useState } from 'react';
import {  Accordion, Card, Form, InputGroup, Row, Col, Badge, Tabs, Tab,Button } from 'react-bootstrap';

import {CliCard} from '../common/VetanaEdit';
import { MascotasModal } from '../common/MascotaModal';
import {VentanaCliCommit} from '../common/VentanaCommit';

import { getAllClientes } from '../../services/ClienteService';
import DelIcon from '../../assets/images/DelIcon.png';
import EditIcon from '../../assets/images/EditIcon.png';


export function ConsultarCli() {
    const [modalShowEdit, setModalShowEdit] = useState(false);
    const [modalShowEli, setModalShowEli] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [activeKey, setActiveKey] = useState('');
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [showMascotas, setShowMascotas] = useState(false);
    const [selectedClienteId, setSelectedClienteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClientes, setFilteredClientes] = useState([]);

    const handleAccordionSelect = async (eventKey) => {
        setActiveKey(eventKey);
        
        if (eventKey === "0" && clientes.length === 0) {
            try {
                const data = await getAllClientes();
                setClientes(data || []);
                setFilteredClientes(data || []);
            } catch (error) {
                console.error('Error al cargar clientes:', error);
            }
        }
    };

    const handleEditClick = (cliente) => {
        setSelectedCliente(cliente);
        setModalShowEdit(true);
    };

    const handleEliClick = (cliente) => {
        setSelectedCliente(cliente);
        setModalShowEli(true);
    };
    
    const handleVerMascotasClick = (cliente) => {
        setSelectedClienteId(cliente.id);
        setShowMascotas(true);
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);
        
        if (searchValue === '') {
            setFilteredClientes(clientes);
        } else {
            const filtered = clientes.filter(cliente => 
                cliente.id.toString().includes(searchValue) ||
                cliente.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                cliente.apellido.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredClientes(filtered);
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
                        <i className="fas fa-users me-2"></i>
                        <span className="fw-bold">Gestión de Clientes</span>
                    </Accordion.Header>
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
                    <Accordion.Body className="bg-light">
                        {/* Barra de búsqueda mejorada */}
                        <div className="mb-4">
                            <InputGroup className="shadow-sm">
                                <InputGroup.Text className="bg-white border-end-0">
                                    <i className="fas fa-search text-primary"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Buscar por nombre, apellido o ID..."
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
                                            setFilteredClientes(clientes);
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                )}
                            </InputGroup>
                        </div>

                        {filteredClientes.length > 0 ? (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {filteredClientes.map((cliente) => (
                                    <Col key={cliente.id}>
                                        <Card className="h-100 shadow-sm border-0 rounded-3 position-relative">
                                            {/* Header con gradiente */}
                                            <Card.Header className="bg-gradient  p-3" 
                                                style={{ background: 'linear-gradient(45deg, #4a6bbd, #60a3bc)' }} >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h5 className="m-0 fw-bold ">{`${cliente.nombre} ${cliente.apellido}`}</h5>
                                                    <Badge bg="info" pill>
                                                        ID: {cliente.id}
                                                    </Badge>
                                                </div>
                                            </Card.Header>
                                            
                                            <Card.Body className="pb-2">
                                                {/* Sistema de pestañas para la información */}
                                                <Tabs defaultActiveKey="personal" className="mb-3 small">
                                                    <Tab eventKey="personal" title={<span><i className="fas fa-user me-1"></i> Datos Personales</span>}>
                                                        <div className="p-2">
                                                            <div className="row g-2">
                                                                <div className="col-12">
                                                                    <div className="d-flex align-items-center mb-3">
                                                                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                                                                            <i className="fas fa-id-card text-primary"></i>
                                                                        </div>
                                                                        <div>
                                                                            <small className="text-muted">Identificación</small>
                                                                            <h6 className="m-0 fw-bold">{cliente.id} ({cliente.tipo_id})</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="border rounded p-2 h-100">
                                                                        <small className="text-muted d-block">Sexo</small>
                                                                        <span>{cliente.sexo}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="border rounded p-2 h-100">
                                                                        <small className="text-muted d-block">Fecha de Nacimiento</small>
                                                                        <span>{new Date(cliente.fechaNacimiento).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="contacto" title={<span><i className="fas fa-address-book me-1"></i> Contacto</span>}>
                                                        <div className="p-2">
                                                            <div className="row g-2">
                                                                <div className="col-12">
                                                                    <div className="d-flex align-items-center mb-3">
                                                                        <div className="bg-info bg-opacity-10 rounded-circle p-2 me-2">
                                                                            <i className="fas fa-phone-alt text-info"></i>
                                                                        </div>
                                                                        <div>
                                                                            <small className="text-muted">Teléfono</small>
                                                                            <h6 className="m-0 fw-bold">{cliente.telefono}</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                                                                            <i className="fas fa-envelope text-success"></i>
                                                                        </div>
                                                                        <div>
                                                                            <small className="text-muted">Email</small>
                                                                            <h6 className="m-0 fw-bold">{cliente.email}</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="mascotas" title={<span><i className="fas fa-paw me-1"></i> Mascotas</span>}>
                                                        <div className="p-3 text-center">
                                                            <div className="mb-3">
                                                                <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-block">
                                                                    <i className="fas fa-paw fa-2x text-warning"></i>
                                                                </div>
                                                            </div>
                                                            <h6 className="mb-3">Ver detalles de las mascotas registradas</h6>
                                                            <Button
                                                                variant="warning"
                                                                size="sm"
                                                                onClick={() => handleVerMascotasClick(cliente)}
                                                                className="w-100"
                                                            >
                                                                <i className="fas fa-paw me-1"></i> Ver Mascotas
                                                            </Button>
                                                        </div>
                                                    </Tab>
                                                </Tabs>
                                            </Card.Body>
                                            
                                            <Card.Footer className="bg-white border-0 pt-0">
                                                <div className="d-flex justify-content-between">
                                                    <Button 
                                                        variant="primary" 
                                                        size="sm"
                                                        onClick={() => handleEditClick(cliente)}
                                                    >
                                                        <img src={EditIcon} alt="Eliminar" className="icon" />
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => handleEliClick(cliente)}
                                                    >
                                                        <img src={DelIcon} alt="Eliminar" className="icon" />
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
                                    <i className="fas fa-user-slash fa-3x text-muted"></i>
                                </div>
                                <h5 className="text-muted">
                                    {searchTerm 
                                        ? 'No se encontraron clientes con esos criterios'
                                        : 'No hay clientes registrados en el sistema'
                                    }
                                </h5>
                                <p className="text-muted">
                                    {searchTerm 
                                        ? 'Intente con otro término de búsqueda'
                                        : 'Los clientes registrados aparecerán aquí'
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
            <CliCard
                show={modalShowEdit && selectedCliente !== null}
                onHide={() => {
                    setModalShowEdit(false);
                    setSelectedCliente(null);
                }}
                userData={selectedCliente}
            />
            
            <VentanaCliCommit
                show={modalShowEli && selectedCliente !== null}
                onHide={() => {
                    setModalShowEli(false);
                    setSelectedCliente(null);
                }}
                userData={selectedCliente}
            />
            
            <MascotasModal
                show={showMascotas && selectedClienteId !== null}
                onHide={() => {
                    setShowMascotas(false);
                    setSelectedClienteId(null);
                }}
                clienteId={selectedClienteId}
            />
        </>
    );
}
export default ConsultarCli;