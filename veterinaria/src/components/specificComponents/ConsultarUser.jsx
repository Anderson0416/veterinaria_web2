import { useState } from 'react';
import {  Accordion, Card, Form, InputGroup, Row, Col, Badge, Tabs, Tab,Button } from 'react-bootstrap';
import {UserCard} from '../common/VetanaEdit';
import {VentanaUserCommit} from '../common/VentanaCommit';
import { getReceptionists, getveterinarians } from '../../services/UsuarioService';
import { getServer } from '../../helpers/axios_helper';
import defaultImage from '../../assets/images/logo.png';
import DelIcon from '../../assets/images/DelIcon.png';
import EditIcon from '../../assets/images/EditIcon.png';
export function ConsultarUser() {
    const [modalShowEdit, setModalShowEdit] = useState(false);
    const [modalShowEli, setModalShowEli] = useState(false);
    const [receptionists, setReceptionists] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);
    const [activeKey, setActiveKey] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReceptionists, setFilteredReceptionists] = useState([]);
    const [filteredVeterinarians, setFilteredVeterinarians] = useState([]);

    const handleAccordionSelect = async (eventKey) => {
        setActiveKey(eventKey);
        
        if (eventKey === "0" && receptionists.length === 0) {
            try {
                const data = await getReceptionists();
                setReceptionists(data || []);
                setFilteredReceptionists(data || []);
            } catch (error) {
                console.error('Error al cargar recepcionistas:', error);
            }
        }
        
        if (eventKey === "1" && veterinarians.length === 0) {
            try {
                const data = await getveterinarians();
                setVeterinarians(data || []);
                setFilteredVeterinarians(data || []);
            } catch (error) {
                console.error('Error al cargar veterinarios:', error);
            }
        }
    };

    const getImageUrl = (fotoPath) => {
        if (!fotoPath) return defaultImage;
        return `http://${getServer()}:8080/${fotoPath}`;
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setModalShowEdit(true);
    };
    
    const handleEliClick = (user) => {
        setSelectedUser(user);
        setModalShowEli(true);
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);
        
        if (activeKey === "0") {
            // Filtrar recepcionistas
            if (searchValue === '') {
                setFilteredReceptionists(receptionists);
            } else {
                const filtered = receptionists.filter(receptionist => 
                    receptionist.id.toString().includes(searchValue) ||
                    receptionist.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                    receptionist.apellido.toLowerCase().includes(searchValue.toLowerCase())
                );
                setFilteredReceptionists(filtered);
            }
        } else if (activeKey === "1") {
            // Filtrar veterinarios
            if (searchValue === '') {
                setFilteredVeterinarians(veterinarians);
            } else {
                const filtered = veterinarians.filter(veterinarian => 
                    veterinarian.id.toString().includes(searchValue) ||
                    veterinarian.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                    veterinarian.apellido.toLowerCase().includes(searchValue.toLowerCase())
                );
                setFilteredVeterinarians(filtered);
            }
        }
    };

    // Función para renderizar la lista de usuarios (recepcionistas o veterinarios)
    const renderUsersList = (userType) => {
        const users = userType === 'receptionists' ? filteredReceptionists : filteredVeterinarians;
        const emptyMessage = userType === 'receptionists' ? 'recepcionistas' : 'veterinarios';
        const iconClass = userType === 'receptionists' ? 'fas fa-headset' : 'fas fa-user-md';
        
        if (users.length === 0) {
            return (
                <div className="text-center p-5 bg-white rounded shadow-sm">
                    <div className="mb-3">
                        <i className="fas fa-user-slash fa-3x text-muted"></i>
                    </div>
                    <h5 className="text-muted">
                        {searchTerm 
                            ? `No se encontraron ${emptyMessage} con esos criterios`
                            : `No hay ${emptyMessage} registrados en el sistema`
                        }
                    </h5>
                    <p className="text-muted">
                        {searchTerm 
                            ? 'Intente con otro término de búsqueda'
                            : `Los ${emptyMessage} registrados aparecerán aquí`
                        }
                    </p>
                </div>
            );
        }

        return (
            <Row xs={1} md={2} lg={3} className="g-4">
                {users.map((user) => (
                    <Col key={user.id}>
                        <Card className="h-100 shadow-sm border-0 rounded-3 position-relative">
                            {/* Header con gradiente */}
                            <Card.Header 
                                className="bg-gradient p-3" 
                                style={{ 
                                    background: userType === 'receptionists'
                                        ? 'linear-gradient(45deg, #5a78c4, #70b3cc)'
                                        : 'linear-gradient(45deg, #4caf50, #8bc34a)'
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="m-0 fw-bold ">{`${user.nombre} ${user.apellido}`}</h5>
                                    <Badge bg="light" text="dark" pill>
                                        ID: {user.id}
                                    </Badge>
                                </div>
                            </Card.Header>
                            
                            {/* Imagen de perfil */}
                            <div className="text-center position-relative" style={{ marginTop: "-30px" }}>
                                <div 
                                    className="rounded-circle border border-3 border-white overflow-hidden mx-auto"
                                    style={{ width: "80px", height: "80px", backgroundColor: "#f8f9fa" }}
                                >
                                    <img 
                                        src={getImageUrl(user.foto)}
                                        alt={`${user.nombre} ${user.apellido}`}
                                        className="w-100 h-100"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div 
                                    className="position-absolute top-0 start-50 translate-middle-x"
                                    style={{ marginTop: "35px" }}
                                >
                                    <div className={`rounded-circle bg-${userType === 'receptionists' ? 'primary' : 'success'} p-1`}>
                                        <i className={`${iconClass} text-white fa-sm`}></i>
                                    </div>
                                </div>
                            </div>
                            
                            <Card.Body className="pb-2 pt-3">
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
                                                            <h6 className="m-0 fw-bold">{user.id} ({user.tipo_id})</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="border rounded p-2 h-100">
                                                        <small className="text-muted d-block">Sexo</small>
                                                        <span>{user.sexo}</span>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="border rounded p-2 h-100">
                                                        <small className="text-muted d-block">Fecha de Nacimiento</small>
                                                        <span>{new Date(user.fechaNacimiento).toLocaleDateString()}</span>
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
                                                            <h6 className="m-0 fw-bold">{user.telefono}</h6>
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
                                                            <h6 className="m-0 fw-bold">{user.login}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="trabajo" title={<span><i className="fas fa-briefcase me-1"></i> Laboral</span>}>
                                        <div className="p-2">
                                            <div className="row g-2">
                                                <div className="col-12">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-2">
                                                            <i className="fas fa-calendar-alt text-warning"></i>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted">Fecha de Contrato</small>
                                                            <h6 className="m-0 fw-bold">{new Date(user.fechaContrato).toLocaleDateString()}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-flex align-items-center">
                                                        <div className={`bg-${userType === 'receptionists' ? 'primary' : 'success'} bg-opacity-10 rounded-circle p-2 me-2`}>
                                                            <i className={`${iconClass} text-${userType === 'receptionists' ? 'primary' : 'success'}`}></i>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted">Puesto</small>
                                                            <h6 className="m-0 fw-bold">{userType === 'receptionists' ? 'Recepcionista' : 'Veterinario'}</h6>
                                                        </div>
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
                                        variant={userType === 'receptionists' ? 'primary' : 'success'} 
                                        size="sm"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        <img src={EditIcon} alt="Editar" className="icon" />
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        size="sm"
                                        onClick={() => handleEliClick(user)}
                                    >
                                        <img src={DelIcon} alt="Eliminar" className="icon" />
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
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
                        <i className="fas fa-headset me-2"></i>
                        <span className="fw-bold">Gestión de Recepcionistas</span>
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
                                            setFilteredReceptionists(receptionists);
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                )}
                            </InputGroup>
                        </div>
                        
                        {renderUsersList('receptionists')}
                    </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <i className="fas fa-user-md me-2"></i>
                        <span className="fw-bold">Gestión de Veterinarios</span>
                    </Accordion.Header>
                    <Accordion.Body className="bg-light">
                        {/* Barra de búsqueda mejorada */}
                        <div className="mb-4">
                            <InputGroup className="shadow-sm">
                                <InputGroup.Text className="bg-white border-end-0">
                                    <i className="fas fa-search text-success"></i>
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
                                            setFilteredVeterinarians(veterinarians);
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                )}
                            </InputGroup>
                        </div>
                        
                        {renderUsersList('veterinarians')}
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
            {/* Modales para editar y eliminar */}
            <UserCard
                show={modalShowEdit && selectedUser !== null}
                onHide={() => {
                    setModalShowEdit(false);
                    setSelectedUser(null);
                }}
                userData={selectedUser}
            />
            
            <VentanaUserCommit
                show={modalShowEli && selectedUser !== null}
                onHide={() => {
                    setModalShowEli(false);
                    setSelectedUser(null);
                }}
                userData={selectedUser}
            />
        </>
    );
}
export default ConsultarUser;