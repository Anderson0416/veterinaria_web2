import { useState } from 'react';
import {  Accordion, Card, Form, InputGroup, Row, Col, Badge,Button } from 'react-bootstrap';

import {ConsCard} from '../common/VetanaEdit';
import {VentanaConsCommit} from '../common/VentanaCommit';

import { getAllConsultas } from '../../services/ConsultaService';
import DelIcon from '../../assets/images/DelIcon.png';
import EditIcon from '../../assets/images/EditIcon.png';

export function ConsultarCons() {
    const [modalShowEdit, setModalShowEdit] = useState(false);
    const [modalShowEli, setModalShowEli] = useState(false);
    const [consultas, setConsultas] = useState([]);
    const [activeKey, setActiveKey] = useState('');
    const [selectedConsulta, setSelectedConsulta] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredConsultas, setFilteredConsultas] = useState([]);

    const handleAccordionSelect = async (eventKey) => {
        setActiveKey(eventKey);
        
        if (eventKey === "0" && consultas.length === 0) {
            try {
                const data = await getAllConsultas();
                setConsultas(data || []);
                setFilteredConsultas(data || []); // Inicializar datos filtrados
            } catch (error) {
                console.error('Error al cargar consultas:', error);
            }
        }
    };

    const handleEditClick = (consulta) => {
        setSelectedConsulta(consulta);
        setModalShowEdit(true);
    };

    const handleEliClick = (consulta) => {
        setSelectedConsulta(consulta);
        setModalShowEli(true);
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);
        
        if (!searchValue.trim()) {
            setFilteredConsultas(consultas);
        } else {
            const filtered = consultas.filter(consulta => 
                consulta.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                consulta.descripcion.toLowerCase().includes(searchValue.toLowerCase()) ||
                consulta.precio.toString().includes(searchValue)
            );
            setFilteredConsultas(filtered);
        }
    };

    // Generar un color de gradiente basado en el precio
    const getPriceGradient = (precio) => {
        // Precios menores tienen tonos azules, mayores tienen tonos morados/violetas
        if (precio < 50) {
            return 'linear-gradient(45deg, #4facfe, #00f2fe)'; // Azul claro
        } else if (precio < 100) {
            return 'linear-gradient(45deg, #4a78e6, #60a3f0)'; // Azul medio
        } else if (precio < 150) {
            return 'linear-gradient(45deg, #7367f0, #9e95f5)'; // Púrpura
        } else {
            return 'linear-gradient(45deg, #8e2de2, #4a00e0)'; // Morado intenso
        }
    };

    // Función para generar un icono basado en el nombre de la consulta
    const getConsultaIcon = (nombre) => {
        const nombreLower = nombre.toLowerCase();
        
        if (nombreLower.includes('vacuna') || nombreLower.includes('inmuniza')) {
            return 'fas fa-syringe';
        } else if (nombreLower.includes('rutina') || nombreLower.includes('general')) {
            return 'fas fa-stethoscope';
        } else if (nombreLower.includes('emergen') || nombreLower.includes('urgen')) {
            return 'fas fa-ambulance';
        } else if (nombreLower.includes('cirug') || nombreLower.includes('operac')) {
            return 'fas fa-user-md';
        } else if (nombreLower.includes('radio') || nombreLower.includes('imagen') || nombreLower.includes('rayos')) {
            return 'fas fa-x-ray';
        } else if (nombreLower.includes('dental') || nombreLower.includes('dientes')) {
            return 'fas fa-tooth';
        } else if (nombreLower.includes('nutri') || nombreLower.includes('aliment')) {
            return 'fas fa-apple-alt';
        } else {
            return 'fas fa-heartbeat'; // Icono por defecto
        }
    };

    return (
        <>
            <Accordion 
                activeKey={activeKey}
                onSelect={handleAccordionSelect}
                className="transparent-accordion" // Agregamos una clase para personalizar el acordeón
            >
                <Accordion.Item eventKey="0">
                    <Accordion.Header className="bg-transparent">
                        <i className="fas fa-clipboard-list me-2"></i>
                        <span className="fw-bold">Gestión de Servicios Veterinarios</span>
                    </Accordion.Header>
                    <Accordion.Body className="bg-transparent"> {/* Cambiamos bg-light por bg-transparent */}
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
                                    <i className="fas fa-search text-purple"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Buscar por nombre, descripción o precio..."
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
                                            setFilteredConsultas(consultas);
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                )}
                            </InputGroup>
                        </div>

                        {filteredConsultas.length > 0 ? (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {filteredConsultas.map((consulta) => {
                                    const consultaIcon = getConsultaIcon(consulta.nombre);
                                    return (
                                        <Col key={consulta.id}>
                                            <Card className="h-100 shadow-sm border-0 rounded-3 position-relative">
                                                {/* Header con gradiente basado en precio */}
                                                <Card.Header className="bg-gradient p-3" 
                                                    style={{ background: getPriceGradient(consulta.precio) }} >
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h5 className="m-0 fw-bold ">{consulta.nombre}</h5>
                                                        <Badge bg="light" text="dark" pill className="fw-bold">
                                                            ${consulta.precio}
                                                        </Badge>
                                                    </div>
                                                </Card.Header>
                                                
                                                {/* Icono de la consulta */}
                                                <div className="text-center position-relative" style={{ marginTop: "-30px" }}>
                                                    <div 
                                                        className="rounded-circle border border-3 border-white d-flex align-items-center justify-content-center mx-auto"
                                                        style={{ 
                                                            width: "60px", 
                                                            height: "60px", 
                                                            backgroundColor: "#f8f9fa",
                                                            background: getPriceGradient(consulta.precio),
                                                            opacity: 0.9
                                                        }}
                                                    >
                                                        <i className={`${consultaIcon} fa-lg text-white`}></i>
                                                    </div>
                                                </div>
                                                
                                                <Card.Body className="p-4">
                                                    <div className="mb-3">
                                                        <h6 className="text-muted mb-1 small text-uppercase">Descripción del servicio</h6>
                                                        <p className="mb-0">{consulta.descripcion}</p>
                                                    </div>
                                                    
                                                    <div className="row g-2 mb-3">
                                                        <div className="col-12">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                                                                    <i className="fas fa-tag text-primary"></i>
                                                                </div>
                                                                <div>
                                                                    <small className="text-muted">Precio del Servicio</small>
                                                                    <h5 className="m-0 fw-bold">${consulta.precio.toFixed(2)}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="row g-2">
                                                        <div className="col-12">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                                                                    <i className="fas fa-info-circle text-success"></i>
                                                                </div>
                                                                <div>
                                                                    <small className="text-muted">ID del Servicio</small>
                                                                    <h6 className="m-0 fw-bold">#{consulta.id}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                                
                                                <Card.Footer className="bg-white border-0 pt-0">
                                                    <div className="d-flex justify-content-between">
                                                        <Button 
                                                            variant="primary" 
                                                            size="sm"
                                                            onClick={() => handleEditClick(consulta)}
                                                            className="d-flex align-items-center"
                                                        >
                                                           <img src={EditIcon} alt="Editar" className="icon" />
                                                        </Button>
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleEliClick(consulta)}
                                                            className="d-flex align-items-center"
                                                        >
                                                            <img src={DelIcon} alt="Eliminar" className="icon" />
                                                        </Button>
                                                    </div>
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        ) : (
                            <div className="text-center p-5 bg-white rounded shadow-sm">
                                <div className="mb-3">
                                    <i className="fas fa-clipboard-medical fa-3x text-muted"></i>
                                </div>
                                <h5 className="text-muted">
                                    {searchTerm 
                                        ? 'No se encontraron servicios con esos criterios'
                                        : 'No hay servicios veterinarios registrados en el sistema'
                                    }
                                </h5>
                                <p className="text-muted">
                                    {searchTerm 
                                        ? 'Intente con otro término de búsqueda'
                                        : 'Los servicios registrados aparecerán aquí'
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
            <ConsCard
                show={modalShowEdit && selectedConsulta !== null}
                onHide={() => {
                    setModalShowEdit(false);
                    setSelectedConsulta(null);
                }}
                consultaData={selectedConsulta}
            />
            
            <VentanaConsCommit
                show={modalShowEli && selectedConsulta !== null}
                onHide={() => {
                    setModalShowEli(false);
                    setSelectedConsulta(null);
                }}
                consultaData={selectedConsulta}
            />
        </>
    );
}
export default ConsultarCons;