import { useState } from 'react';
import {  Accordion, Card, Form, InputGroup, Row, Col, Badge, Tabs, Tab,Button } from 'react-bootstrap';

import NavigationControls from '../common/NavigationControls';
import { AnamnesisModal } from '../common/VetanaAnam';

import {getAllHistoriales} from '../../services/HistorialService';
import { descargarPDFConsulta } from '../../services/PDFService';

import PrintIcon from '../../assets/images/PrintIcon.png';

export function ConsultarHist() {
    const [historiales, setHistoriales] = useState([]);
    const [activeKey, setActiveKey] = useState('');
    const [showAnamnesisModal, setShowAnamnesisModal] = useState(false);
    const [selectedHistorial, setSelectedHistorial] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredHistoriales, setFilteredHistoriales] = useState([]);

    const handleAccordionSelect = async (eventKey) => {
        setActiveKey(eventKey);
        
        if (eventKey === "0" && historiales.length === 0) {
            try {
                const data = await getAllHistoriales();
                console.log('Todos los historiales:', data);
                setHistoriales(data || []);
                setFilteredHistoriales(data || []); // Inicializar datos filtrados
            } catch (error) {
                console.error('Error al cargar historiales:', error);
            }
        }
    };

    const handleVerAnamnesis = (historial) => {
        setSelectedHistorial(historial);
        setShowAnamnesisModal(true);
    };

    // Agregar función de búsqueda
    const handleSearch = (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);
        
        if (!searchValue.trim()) {
            setFilteredHistoriales(historiales);
        } else {
            const filtered = historiales.filter(historial => 
                historial.id.toString().includes(searchValue) ||
                historial.mascota.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                historial.mascota.especie.toLowerCase().includes(searchValue.toLowerCase()) ||
                historial.mascota.raza.toLowerCase().includes(searchValue.toLowerCase()) ||
                formatearFechaHora(historial.fecha).toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredHistoriales(filtered);
        }
    };

    const formatearFechaHora = (fechaArray) => {
        if (!fechaArray || fechaArray.length < 5) return 'Fecha no disponible';
        const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
        return fecha.toLocaleString();
    };

    const formatearDatosAnamnesis = (historial) => {
        return {
            readOnly: true,
            anamnesis: {
                peso: historial.anamnesis.peso || '',
                estadoReproductivo: historial.anamnesis.estadoReproductivo || '',
                tipoVivienda: historial.anamnesis.tipoVivienda || '',
                actividadFisica: historial.anamnesis.actividadFisica || '',
                vacunasPrevias: historial.anamnesis.vacunasPrevias || '',
                vacunasPreviasDesparacitacion: historial.anamnesis.vacunasPreviasDesparacitacion || '',
                motivoConsulta: historial.anamnesis.motivoConsulta || '',
                sintomasMascota: historial.anamnesis.sintomasMascota || '',
                observaciones: historial.anamnesis.observaciones || '',
                dieta: historial.anamnesis.dieta || ''
            },
            mascota: {
                id: historial.mascota.id,
                nombre: historial.mascota.nombre
            },
            fecha: historial.fecha
        };
    };

    // Agregar esta función dentro del componente ConsultarHist
const handleDescargarPDF = async (historialId) => {
    try {
        await descargarPDFConsulta(historialId);
    } catch (error) {
        console.error('Error al descargar el PDF:', error);
        alert('Error al descargar el PDF. Por favor, intente nuevamente.');
    }
};

    return (
        <>
            <NavigationControls/>
            <Accordion 
                activeKey={activeKey}
                onSelect={handleAccordionSelect}
                className="transparent-accordion"
            >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <i className="fas fa-clipboard-list me-2"></i>
                        <span className="fw-bold">Historiales Clínicos</span>
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
                                <InputGroup.Text className="bg-white">
                                    <i className="fas fa-search text-primary"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Buscar por mascota, especie o fecha..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    type="input"
                                    
                                />
                                {searchTerm && (
                                    <Button 
                                        variant="outline-secondary"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilteredHistoriales(historiales);
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                )}
                            </InputGroup>
                        </div>

                        {filteredHistoriales.length > 0 ? (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {filteredHistoriales.map((historial) => (
                                    <Col key={historial.id}>
                                        <Card className="h-100 shadow-sm border-0 rounded-3 position-relative">
                                            {/* Header con gradiente */}
                                            <Card.Header className="bg-gradient p-3" 
                                                style={{ background: 'linear-gradient(45deg, #2c3e50, #3498db)' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h5 className="m-0 fw-bold">Historial #{historial.id}</h5>
                                                    <Badge bg="info" pill>
                                                        <i className="fas fa-history me-1"></i> Registro Médico
                                                    </Badge>
                                                </div>
                                            </Card.Header>
                                            
                                            <Card.Body className="pb-2">
                                                {/* Sección de Fecha */}
                                                <div className="mb-3 pb-3 border-bottom">
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-light rounded-circle p-2 me-2">
                                                            <i className="far fa-calendar-alt text-primary"></i>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted d-block">Fecha de Registro</small>
                                                            <span className="fw-semibold">{formatearFechaHora(historial.fecha)}</span>
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
                                                                    <h6 className="m-0 fw-bold">{historial.mascota.nombre}</h6>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="row g-2 mt-2">
                                                                <div className="col-6">
                                                                    <div className="border rounded p-2 h-100">
                                                                        <small className="text-muted d-block">Especie</small>
                                                                        <span>{historial.mascota.especie}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="border rounded p-2 h-100">
                                                                        <small className="text-muted d-block">Raza</small>
                                                                        <span>{historial.mascota.raza}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="border rounded p-2">
                                                                        <small className="text-muted d-block">Edad</small>
                                                                        <span>{historial.mascota.edad} años</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                </Tabs>
                                            </Card.Body>
                                            
                                            <Card.Footer className="bg-white border-0 pt-0">
                                                <div className="d-flex justify-content-between">
                                                    <Button 
                                                        variant="primary" 
                                                        size="sm"
                                                        onClick={() => handleVerAnamnesis(historial)}
                                                    >
                                                        <i className="fas fa-notes-medical me-1"></i> Ver Anamnesis
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleDescargarPDF(historial.id)}
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
                                    <i className="fas fa-folder-open fa-3x text-muted"></i>
                                </div>
                                <h5 className="text-muted">
                                    {searchTerm 
                                        ? 'No se encontraron historiales que coincidan con la búsqueda'
                                        : 'No hay historiales clínicos registrados'
                                    }
                                </h5>
                                <p className="text-muted">
                                    {searchTerm 
                                        ? 'Intenta con otros términos de búsqueda'
                                        : 'Los historiales clínicos aparecerán aquí'
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
            <AnamnesisModal
                show={showAnamnesisModal && selectedHistorial !== null}
                onHide={() => {
                    setShowAnamnesisModal(false);
                    setSelectedHistorial(null);
                }}
                formData={selectedHistorial ? formatearDatosAnamnesis(selectedHistorial) : null}
            />
        </>
    );
}
export default ConsultarHist;