import { useState, useEffect } from 'react';
import { Form, Button, Card, CardGroup, Spinner } from 'react-bootstrap';
import { getClienteById } from '../services/ClienteService';
import { getMascotasByClienteId } from '../services/MascotaService';
import { getveterinarians } from '../services/UsuarioService';
import { getAllConsultas } from '../services/ConsultaService';
import { createCitaWithFactura } from '../services/CitaService';
import NavigationControls from '../components/common/NavigationControls';
import '../assets/styles/ProgramarCons.css';

export function ProgramarCons() {
    const [searchQuery, setSearchQuery] = useState('');
    const [clienteEncontrado, setClienteEncontrado] = useState(null);
    const [mascotas, setMascotas] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
    const [veterinarioSeleccionado, setVeterinarioSeleccionado] = useState(null);
    const [consultas, setConsultas] = useState([]);
    const [consultasSeleccionadas, setConsultasSeleccionadas] = useState([]);
    const [fechaCita, setFechaCita] = useState('');
    const [anotaciones, setAnotaciones] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [etapaActual, setEtapaActual] = useState('busqueda');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    // Función para reiniciar todo el proceso de selección
    const reiniciarProceso = () => {
        setMascotaSeleccionada(null);
        setVeterinarioSeleccionado(null);
        setConsultasSeleccionadas([]);
        setFechaCita('');
        setAnotaciones('');
        setConsultas([]);
        setVeterinarios([]);
        setMascotas([]);
        setEtapaActual('busqueda');
        setIsSubmitting(false);
        setSubmitStatus('');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setMensajeError(''); // Limpiar mensaje de error anterior
            
            // Si ya hay un cliente encontrado, reiniciar todo el proceso
            if (clienteEncontrado) {
                reiniciarProceso();
            }
            
            const cliente = await getClienteById(searchQuery);
            if (cliente) {
                setClienteEncontrado(cliente);
                try {
                    const mascotasData = await getMascotasByClienteId(cliente.id);
                    setMascotas(mascotasData || []);
                    setEtapaActual('seleccionMascota');
                } catch (error) {
                    console.error('Error al obtener las mascotas:', error);
                    setMascotas([]);
                }
            } else {
                setClienteEncontrado(null);
                setMascotas([]);
                setMensajeError('No se encontró ningún cliente con ese ID');
            }
        } catch (error) {
            console.error('Error al buscar el cliente:', error);
            setMensajeError('Ocurrió un error al buscar el cliente');
        }
    };

    const handleMascotaClick = async (mascota) => {
        setMascotaSeleccionada(mascota);
        try {
            const veterinariosData = await getveterinarians();
            setVeterinarios(veterinariosData || []);
            setEtapaActual('seleccionVeterinario');
        } catch (error) {
            console.error('Error al obtener veterinarios:', error);
            setVeterinarios([]);
        }
    };

    const handleVeterinarioClick = async (veterinario) => {
        setVeterinarioSeleccionado(veterinario);
        try {
            const consultasData = await getAllConsultas();
            setConsultas(consultasData || []);
            setEtapaActual('seleccionConsulta');
        } catch (error) {
            console.error('Error al obtener consultas:', error);
            setConsultas([]);
        }
    };

    const handleConsultaClick = (consulta) => {
        setConsultasSeleccionadas(prev => {
            const yaSeleccionada = prev.find(c => c.id === consulta.id);
            if (yaSeleccionada) {
                return prev.filter(c => c.id !== consulta.id);
            } else {
                return [...prev, consulta];
            }
        });
        
        // Si es la primera consulta seleccionada, avanzamos a la etapa de detalles
        if (consultasSeleccionadas.length === 0) {
            setEtapaActual('detallesCita');
        }
    };

    const calcularTotal = () => {
        return consultasSeleccionadas.reduce((total, consulta) => total + consulta.precio, 0);
    };

    const handleConfirmarCita = async () => {
        if (!fechaCita || consultasSeleccionadas.length === 0) return;

        setIsSubmitting(true);
        setSubmitStatus('');

        const citaData = {
            // Datos de la factura
            total: calcularTotal(),
            clienteId: clienteEncontrado.id,
            consultaIds: consultasSeleccionadas.map(consulta => consulta.id),
            
            // Datos de la cita
            fecha: fechaCita,
            anotaciones: anotaciones,
            mascotaId: mascotaSeleccionada.id,
            veterinarioId: veterinarioSeleccionado.id
        };

        try {
            const response = await createCitaWithFactura(citaData);
            if (response) {
                setSubmitStatus('success');
                
                // Esperar 2 segundos antes de resetear el formulario
                setTimeout(() => {
                    // Resetear todo completamente
                    setClienteEncontrado(null);
                    setSearchQuery('');
                    reiniciarProceso();
                }, 2000);
            }
        } catch (error) {
            console.error('Error al crear la cita:', error);
            setSubmitStatus('error');
            
            // Resetear estado después de 3 segundos
            setTimeout(() => {
                setIsSubmitting(false);
                setSubmitStatus('');
            }, 3000);
        }
    };

    const volver = (etapa) => {
        setEtapaActual(etapa);
    };

    return (
        <>
            <NavigationControls />
            <Form onSubmit={handleSearch} className='Search'>
                <Form.Group controlId="searchBar" className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Buscar cliente por ID"
                        className="me-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit">Buscar</Button>
                    {clienteEncontrado && (
                        <Button 
                            variant="outline-secondary" 
                            className="ms-2"
                            onClick={() => {
                                setClienteEncontrado(null);
                                setSearchQuery('');
                                reiniciarProceso();
                                setMensajeError('');
                            }}
                        >
                            Nuevo Cliente
                        </Button>
                    )}
                </Form.Group>
            </Form>

            {mensajeError && (
                <div className="text-center p-4">
                    <h5 className="text-danger">{mensajeError}</h5>
                    <p className="text-muted">
                        Por favor, verifique el ID e intente nuevamente
                    </p>
                </div>
            )}

            {clienteEncontrado && (
                <div className='p-5 m-5'>
                    {/* Resumen siempre visible una vez que se encuentra un cliente */}
                    <div className="mb-4 p-3 border rounded bg-light">
                        <h5>Progreso de la Cita</h5>
                        <div className="d-flex flex-wrap gap-2">
                            <Button 
                                variant={etapaActual === 'seleccionMascota' ? 'primary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => volver('seleccionMascota')}
                            >
                                Cliente: {clienteEncontrado.nombre} {clienteEncontrado.apellido}
                            </Button>
                            
                            {mascotaSeleccionada && (
                                <Button 
                                    variant={etapaActual === 'seleccionVeterinario' ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    onClick={() => volver('seleccionVeterinario')}
                                >
                                    Mascota: {mascotaSeleccionada.nombre}
                                </Button>
                            )}
                            
                            {veterinarioSeleccionado && (
                                <Button 
                                    variant={etapaActual === 'seleccionConsulta' ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    onClick={() => volver('seleccionConsulta')}
                                >
                                    Veterinario: {veterinarioSeleccionado.nombre}
                                </Button>
                            )}
                            
                            {consultasSeleccionadas.length > 0 && (
                                <Button 
                                    variant={etapaActual === 'detallesCita' ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    onClick={() => volver('detallesCita')}
                                >
                                    Consultas: {consultasSeleccionadas.length} seleccionadas
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Etapa de selección de mascota */}
                    {etapaActual === 'seleccionMascota' && mascotas.length > 0 ? (
                        <div style={{ marginTop: '20px' }} className="fade-in">
                            <h5>Seleccione una Mascota</h5>
                            <CardGroup>
                                {mascotas.map((mascota) => (
                                    <Card 
                                        key={mascota.id} 
                                        style={{ 
                                            minWidth: '18rem', 
                                            maxWidth: '25rem', 
                                            margin: '10px',
                                            cursor: 'pointer',
                                            border: mascotaSeleccionada?.id === mascota.id ? '2px solid #0d6efd' : '1px solid rgba(0,0,0,.125)'
                                        }}
                                        onClick={() => handleMascotaClick(mascota)}
                                    >
                                        <Card.Body>
                                            <Card.Title>{mascota.nombre}</Card.Title>
                                            <Card.Text>
                                                <p><strong>Especie:</strong> {mascota.especie}</p>
                                                <p><strong>Raza:</strong> {mascota.raza}</p>
                                                <p><strong>Sexo:</strong> {mascota.sexo}</p>
                                                <p><strong>Edad:</strong> {mascota.edad} años</p>
                                            </Card.Text>
                                            <small className="text-muted">Click para seleccionar esta mascota</small>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </CardGroup>
                        </div>
                    ) : etapaActual === 'seleccionMascota' && (
                        <div className="text-center p-4 fade-in">
                            <h5>Este cliente no tiene mascotas registradas</h5>
                            <p className="text-muted">
                                Para registrar una mascota, use la opción "Registrar Mascota" en el menú principal
                            </p>
                        </div>
                    )}

                    {/* Etapa de selección de veterinario */}
                    {etapaActual === 'seleccionVeterinario' && veterinarios.length > 0 && (
                        <div style={{ marginTop: '20px' }} className="fade-in">
                            <h5>Seleccione un Veterinario</h5>
                            <CardGroup>
                                {veterinarios.map((veterinario) => (
                                    <Card 
                                        key={veterinario.id} 
                                        style={{ 
                                            minWidth: '18rem', 
                                            maxWidth: '25rem', 
                                            margin: '10px',
                                            cursor: 'pointer',
                                            border: veterinarioSeleccionado?.id === veterinario.id ? '2px solid #0d6efd' : '1px solid rgba(0,0,0,.125)'
                                        }}
                                        onClick={() => handleVeterinarioClick(veterinario)}
                                    >
                                        <Card.Body>
                                            <Card.Title>{`${veterinario.nombre} ${veterinario.apellido}`}</Card.Title>
                                            {veterinario.foto && (
                                                <Card.Img 
                                                    src={`http://localhost:8080/${veterinario.foto}`}
                                                    alt="Foto del veterinario"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                                                />
                                            )}
                                            <small className="text-muted mt-2 d-block">Click para seleccionar este veterinario</small>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </CardGroup>
                        </div>
                    )}

                    {/* Etapa de selección de consultas */}
                    {etapaActual === 'seleccionConsulta' && consultas.length > 0 && (
                        <div style={{ marginTop: '20px' }} className="fade-in">
                            <h5>Seleccione las Consultas</h5>
                            <p className="text-muted">Puede seleccionar múltiples consultas</p>
                            <CardGroup>
                                {consultas.map((consulta) => (
                                    <Card 
                                        key={consulta.id} 
                                        style={{ 
                                            minWidth: '18rem', 
                                            maxWidth: '25rem', 
                                            margin: '10px',
                                            cursor: 'pointer',
                                            border: consultasSeleccionadas.some(c => c.id === consulta.id) 
                                                ? '2px solid #0d6efd' 
                                                : '1px solid rgba(0,0,0,.125)'
                                        }}
                                        onClick={() => handleConsultaClick(consulta)}
                                    >
                                        <Card.Body>
                                            <Card.Title>{consulta.nombre}</Card.Title>
                                            <Card.Text>
                                                <p><strong>Descripción:</strong> {consulta.descripcion}</p>
                                                <p><strong>Precio:</strong> ${consulta.precio}</p>
                                            </Card.Text>
                                            <small className="text-muted">Click para seleccionar/deseleccionar</small>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </CardGroup>

                            {consultasSeleccionadas.length > 0 && (
                                <div className="text-center mt-4">
                                    <Button 
                                        variant="primary" 
                                        onClick={() => setEtapaActual('detallesCita')}
                                    >
                                        Continuar a Detalles de la Cita ({consultasSeleccionadas.length} consultas seleccionadas)
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Etapa final: Detalles de la cita */}
                    {etapaActual === 'detallesCita' && consultasSeleccionadas.length > 0 && (
                        <div className="mt-4  p-4 border rounded fade-in " style={{ backgroundColor: '#f8f9fa' }}> 
                            <h4 className="mb-4">Detalles de la Cita</h4>
                            
                            <div className="mb-4">
                                <h5>Resumen de la Selección</h5>
                                <div className="card p-3 mb-3">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Cliente:</strong> {clienteEncontrado.nombre} {clienteEncontrado.apellido}</p>
                                            <p><strong>Mascota:</strong> {mascotaSeleccionada.nombre} ({mascotaSeleccionada.especie} - {mascotaSeleccionada.raza})</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Veterinario:</strong> {veterinarioSeleccionado.nombre} {veterinarioSeleccionado.apellido}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <h5>Consultas Seleccionadas</h5>
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Consulta</th>
                                                <th>Descripción</th>
                                                <th>Precio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {consultasSeleccionadas.map(consulta => (
                                                <tr key={consulta.id}>
                                                    <td>{consulta.nombre}</td>
                                                    <td>{consulta.descripcion}</td>
                                                    <td>${consulta.precio.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <tr className="table-active">
                                                <td colSpan="2" className="text-end"><strong>Total a pagar:</strong></td>
                                                <td><strong>${calcularTotal().toFixed(2)}</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => setEtapaActual('seleccionConsulta')}
                                >
                                    Modificar Consultas
                                </Button>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label>Fecha y Hora de la Cita</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={fechaCita}
                                    onChange={(e) => setFechaCita(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Anotaciones Adicionales</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={anotaciones}
                                    onChange={(e) => setAnotaciones(e.target.value)}
                                    placeholder="Escriba cualquier información adicional importante..."
                                />
                            </Form.Group>

                            <Button 
                                variant="success" 
                                size="lg" 
                                className="mt-3 position-relative"
                                disabled={!fechaCita || consultasSeleccionadas.length === 0 || isSubmitting}
                                onClick={handleConfirmarCita}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        {submitStatus === 'success' ? 'Cita programada exitosamente!' : 
                                         submitStatus === 'error' ? 'Error al programar la cita' : 
                                         'Procesando...'}
                                    </>
                                ) : (
                                    'Confirmar Cita'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}
            
            {/* Estilos para animaciones de transición */}
            <style jsx global>{`
                .fade-in {
                    animation: fadeIn 0.5s ease-in;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .btn-success.position-relative {
                    min-width: 200px;
                    transition: all 0.3s ease;
                }
                
                .btn-success.position-relative:disabled {
                    opacity: 1;
                }
            `}</style>
        </>
    );
}