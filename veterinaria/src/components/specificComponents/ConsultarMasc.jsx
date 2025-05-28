import { useState } from 'react';
import {  Accordion, Card, Form, InputGroup, Row, Col, Badge, Tabs, Tab,Button } from 'react-bootstrap';

import {MascCard} from '../common/VetanaEdit';

import {VentanaMascCommit} from '../common/VentanaCommit';

import { getAllMascotas } from '../../services/MascotaService';
import DelIcon from '../../assets/images/DelIcon.png';
import EditIcon from '../../assets/images/EditIcon.png';


export function ConsultarMasc() {
    const [modalShowEdit, setModalShowEdit] = useState(false);
    const [modalShowEli, setModalShowEli] = useState(false);
    const [mascotas, setMascotas] = useState([]);
    const [activeKey, setActiveKey] = useState('');
    const [selectedMascota, setSelectedMascota] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMascotas, setFilteredMascotas] = useState([]);

    const handleAccordionSelect = async (eventKey) => {
        setActiveKey(eventKey);
        
        if (eventKey === "0" && mascotas.length === 0) {
            try {
                const data = await getAllMascotas();
                setMascotas(data || []);
                setFilteredMascotas(data || []);
            } catch (error) {
                console.error('Error al cargar mascotas:', error);
            }
        }
    };

    const handleEditClick = (mascota) => {
        setSelectedMascota(mascota);
        setModalShowEdit(true);
    };

    const handleEliClick = (mascota) => {
        setSelectedMascota(mascota);
        setModalShowEli(true);
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);
        
        if (!searchValue.trim()) {
            setFilteredMascotas(mascotas);
        } else {
            const filtered = mascotas.filter(mascota => 
                mascota.id.toString().includes(searchValue) ||
                mascota.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                mascota.especie.toLowerCase().includes(searchValue.toLowerCase()) ||
                mascota.raza.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredMascotas(filtered);
        }
    };

    // Función para determinar el color de fondo según la especie
    const getSpeciesGradient = (especie) => {
        switch(especie.toLowerCase()) {
            case 'perro':
                return 'linear-gradient(45deg, #f5a623, #f8c471)';
            case 'gato':
                return 'linear-gradient(45deg, #8e44ad, #9b59b6)';
            case 'ave':
                return 'linear-gradient(45deg, #27ae60, #2ecc71)';
            case 'reptil':
                return 'linear-gradient(45deg, #16a085, #1abc9c)';
            case 'pez':
                return 'linear-gradient(45deg, #2980b9, #3498db)';
            case 'roedor':
                return 'linear-gradient(45deg, #c0392b, #e74c3c)';
            default:
                return 'linear-gradient(45deg, #34495e, #7f8c8d)';
        }
    };

    // Función para determinar el ícono según la especie
    const getSpeciesIcon = (especie) => {
        switch(especie.toLowerCase()) {
            case 'perro':
                return 'fa-dog';
            case 'gato':
                return 'fa-cat';
            case 'ave':
                return 'fa-dove';
            case 'reptil':
                return 'fa-dragon';
            case 'pez':
                return 'fa-fish';
            case 'roedor':
                return 'fa-rabbit';
            default:
                return 'fa-paw';
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
                        <i className="fas fa-paw me-2"></i>
                        <span className="fw-bold">Gestión de Mascotas</span>
                    </Accordion.Header>
                    <Accordion.Body className="bg-light">
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
                                    placeholder="Buscar por nombre, especie, raza o ID..."
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
                                            setFilteredMascotas(mascotas);
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                )}
                            </InputGroup>
                        </div>

                        {filteredMascotas.length > 0 ? (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {filteredMascotas.map((mascota) => (
                                    <Col key={mascota.id}>
                                        <Card className="h-100 shadow-sm border-0 rounded-3 position-relative">
                                            {/* Header con gradiente según la especie */}
                                            <Card.Header className="bg-gradient p-3" 
                                                style={{ background: getSpeciesGradient(mascota.especie) }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h5 className="m-0 fw-bold">
                                                        <i className={`fas ${getSpeciesIcon(mascota.especie)} me-2`}></i>
                                                        {mascota.nombre}
                                                    </h5>
                                                    <Badge bg="light" text="dark" pill>
                                                        ID: {mascota.id}
                                                    </Badge>
                                                </div>
                                            </Card.Header>
                                            
                                            <Card.Body className="pb-2">
                                                {/* Sistema de pestañas para la información */}
                                                <Tabs defaultActiveKey="info" className="mb-3 small">
                                                    <Tab eventKey="info" title={<span><i className="fas fa-info-circle me-1"></i> Información</span>}>
                                                        <div className="p-2">
                                                            <div className="d-flex align-items-center mb-3">
                                                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                                                                    <i className="fas fa-dna text-primary"></i>
                                                                </div>
                                                                <div>
                                                                    <small className="text-muted">Especie / Raza</small>
                                                                    <h6 className="m-0 fw-bold">{mascota.especie} / {mascota.raza}</h6>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="row g-2">
                                                                <div className="col-6">
                                                                    <div className="border rounded p-2 h-100">
                                                                        <small className="text-muted d-block">Sexo</small>
                                                                        <span className="d-flex align-items-center">
                                                                            <i className={`fas fa-${mascota.sexo.toLowerCase() === 'macho' ? 'mars' : 'venus'} me-1 ${mascota.sexo.toLowerCase() === 'macho' ? 'text-info' : 'text-danger'}`}></i>
                                                                            {mascota.sexo}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="border rounded p-2 h-100">
                                                                        <small className="text-muted d-block">Edad</small>
                                                                        <span>
                                                                            <i className="fas fa-birthday-cake me-1 text-warning"></i>
                                                                            {mascota.edad} años
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="propietario" title={<span><i className="fas fa-user me-1"></i> Propietario</span>}>
                                                        <div className="p-3 text-center">
                                                            <div className="mb-3">
                                                                <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-block">
                                                                    <i className="fas fa-user fa-2x text-info"></i>
                                                                </div>
                                                            </div>
                                                            <h6 className="fw-bold mb-1">Información del Propietario</h6>
                                                            <div className="border rounded p-2 mt-3">
                                                                <small className="text-muted d-block">ID del Cliente</small>
                                                                <span className="fw-bold">{mascota.clienteId}</span>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="recordatorios" title={<span><i className="fas fa-bell me-1"></i> Cuidados</span>}>
                                                        <div className="p-3 text-center">
                                                            <div className="mb-3">
                                                                <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-block">
                                                                    <i className="fas fa-syringe fa-2x text-warning"></i>
                                                                </div>
                                                            </div>
                                                            <h6 className="fw-bold mb-1">Recordatorios de Cuidado</h6>
                                                            <p className="text-muted small mb-0">
                                                                Aquí se mostrarán vacunas, desparasitaciones y tratamientos pendientes
                                                            </p>
                                                        </div>
                                                    </Tab>
                                                </Tabs>
                                            </Card.Body>
                                            
                                            <Card.Footer className="bg-white border-0 pt-0">
                                                <div className="d-flex justify-content-between">
                                                    <Button 
                                                        variant="primary" 
                                                        size="sm"
                                                        onClick={() => handleEditClick(mascota)}
                                                    >
                                                        <img src={EditIcon} alt="Eliminar" className="icon" />
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => handleEliClick(mascota)}
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
                                    <i className="fas fa-paw fa-3x text-muted"></i>
                                </div>
                                <h5 className="text-muted">
                                    {searchTerm 
                                        ? 'No se encontraron mascotas con esos criterios'
                                        : 'No hay mascotas registradas en el sistema'
                                    }
                                </h5>
                                <p className="text-muted">
                                    {searchTerm 
                                        ? 'Intente con otro término de búsqueda'
                                        : 'Las mascotas registradas aparecerán aquí'
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
            {/* Modales */}
            <MascCard
                show={modalShowEdit && selectedMascota !== null}
                onHide={() => {
                    setModalShowEdit(false);
                    setSelectedMascota(null);
                }}
                mascotaData={selectedMascota}
            />
            
            <VentanaMascCommit
                show={modalShowEli && selectedMascota !== null}
                onHide={() => {
                    setModalShowEli(false);
                    setSelectedMascota(null);
                }}
                mascotaData={selectedMascota}
            />
        </>
    );
}
export default ConsultarMasc;