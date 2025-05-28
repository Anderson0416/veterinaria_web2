import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { createAnamnesisWithHistorial } from '../../services/AnamnesisService';
import { atenderCita } from '../../services/CitaService';
import logo from '../../assets/images/logo1.png';
import '../../assets/styles/Anamnesis.css';

export function AnamnesisModal({ show, onHide, formData }) {
    const [localFormData, setLocalFormData] = useState({
        peso: '',
        estadoReproductivo: '',
        tipoVivienda: '',
        actividadFisica: '',
        vacunasPrevias: '',
        vacunasPreviasDesparacitacion: '',
        motivoConsulta: '',
        sintomasMascota: '',
        observaciones: '',
        dieta: '',
        mascotaId:''
    });
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);

        useEffect(() => {
        if (formData) {
            // Si hay datos de anamnesis existentes, los carga
            if (formData.anamnesis) {
                setLocalFormData({
                    ...formData.anamnesis,
                    mascotaId: formData?.mascota?.id || formData.anamnesis.mascotaId || ''
                });
                console.log('Datos de anamnesis:', formData.anamnesis);
            } else {
                // Si no hay anamnesis, solo asigna el ID de la mascota
                setLocalFormData(prev => ({
                    ...prev,
                    mascotaId: formData?.mascota?.id || ''
                }));
            }
        }
    }, [formData]);

    const opcionesActividadFisica = ['Baja', 'Moderada', 'Alta'];
    const opcionesTipoVivienda = ['Casa', 'Apartamento', 'Finca'];
    const opcionesEstadoReproductivo = ['Castrado', 'Entero', 'En celo'];
    const opcionesVacunas = [
        'Triple felina', 'Parvovirus', 'Rabia', 'Moquillo',
        'Hepatitis', 'Leptospirosis', 'Ninguna'
    ];
    const opcionesDesparasitacion = [
        'Última hace 1 mes',
        'Última hace 3 meses',
        'Última hace 6 meses',
        'Última hace más de 6 meses',
        'Nunca'
    ];

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = [
            'peso', 'estadoReproductivo', 'tipoVivienda', 'actividadFisica',
            'vacunasPrevias', 'vacunasPreviasDesparacitacion', 'motivoConsulta',
            'sintomasMascota', 'observaciones', 'dieta'
        ];

        requiredFields.forEach(field => {
            if (!localFormData[field]) {
                newErrors[field] = 'Este campo es requerido';
            }
        });

        if (localFormData.peso && (isNaN(localFormData.peso) || parseFloat(localFormData.peso) <= 0)) {
            newErrors.peso = 'El peso debe ser un número mayor a 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setLocalFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const onSubmitRegister = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                console.log('Datos de anamnesis a enviar:', localFormData);
                await createAnamnesisWithHistorial(localFormData);
                await atenderCita(formData.id);
                window.location.reload();
                onHide();
            } catch (error) {
                console.error('Error al crear anamnesis:', error);
            }
        }
    };

    const formatearFechaHora = (fechaArray) => {
        if (!fechaArray || fechaArray.length < 5) return 'Fecha no disponible';
        const fecha = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3], fechaArray[4]);
        return fecha.toLocaleString();
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="step-container">
                        <h3 className="step-title">Información General</h3>
                        
                        <div className="form-group">
                            <label>ID Mascota</label>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    value={formData?.mascota?.id || ''} 
                                    disabled 
                                    className="form-control" 
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Nombre Mascota</label>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    value={formData?.mascota?.nombre || ''} 
                                    disabled 
                                    className="form-control" 
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Fecha de la Cita</label>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    value={formData?.fecha ? formatearFechaHora(formData.fecha) : ''} 
                                    disabled 
                                    className="form-control" 
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Anotaciones de la Cita</label>
                            <div className="input-wrapper">
                                <textarea 
                                    value={formData?.anotaciones || ''} 
                                    disabled 
                                    className="form-control" 
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="form-footer">
                            <button 
                                type="button" 
                                className="btn btn-next" 
                                onClick={nextStep}
                                
                            >
                                Siguiente
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            
            case 2:
                return (
                    <div className="step-container">
                        <h3 className="step-title">Información Básica</h3>
                        
                        <div className="form-group">
                            <label htmlFor="peso">Peso (kg)</label>
                            <div className="input-wrapper">
                                <input 
                                    type="number" 
                                    id="peso" 
                                    name="peso" 
                                    className={`form-control ${errors.peso ? 'is-invalid' : ''}`}
                                    value={localFormData.peso}
                                    disabled={formData?.readOnly}
                                    onChange={onChangeHandler}
                                    step="0.01"
                                    min="0"
                                    placeholder="Ingrese el peso en kg"
                                />
                                {errors.peso && (
                                    <div className="invalid-feedback">
                                        {errors.peso}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="estadoReproductivo">Estado Reproductivo</label>
                            <div className="select-wrapper">
                                <select
                                    id="estadoReproductivo"
                                    name="estadoReproductivo"
                                    className={`form-control ${errors.estadoReproductivo ? 'is-invalid' : ''}`}
                                    value={localFormData.estadoReproductivo}
                                    disabled={formData?.readOnly}
                                    onChange={onChangeHandler}
                                >
                                    <option value="">Seleccione una opción</option>
                                    {opcionesEstadoReproductivo.map(opcion => (
                                        <option key={opcion} value={opcion}>{opcion}</option>
                                    ))}
                                </select>
                                {errors.estadoReproductivo && (
                                    <div className="invalid-feedback">
                                        {errors.estadoReproductivo}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tipoVivienda">Tipo de Vivienda</label>
                            <div className="select-wrapper">
                                <select
                                    id="tipoVivienda"
                                    name="tipoVivienda"
                                    className={`form-control ${errors.tipoVivienda ? 'is-invalid' : ''}`}
                                    value={localFormData.tipoVivienda}
                                    disabled={formData?.readOnly}
                                    onChange={onChangeHandler}
                                >
                                    <option value="">Seleccione una opción</option>
                                    {opcionesTipoVivienda.map(opcion => (
                                        <option key={opcion} value={opcion}>{opcion}</option>
                                    ))}
                                </select>
                                {errors.tipoVivienda && (
                                    <div className="invalid-feedback">
                                        {errors.tipoVivienda}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="actividadFisica">Actividad Física</label>
                            <div className="select-wrapper">
                                <select
                                    id="actividadFisica"
                                    name="actividadFisica"
                                    className={`form-control ${errors.actividadFisica ? 'is-invalid' : ''}`}
                                    value={localFormData.actividadFisica}
                                    disabled={formData?.readOnly}
                                    onChange={onChangeHandler}
                                >
                                    <option value="">Seleccione una opción</option>
                                    {opcionesActividadFisica.map(opcion => (
                                        <option key={opcion} value={opcion}>{opcion}</option>
                                    ))}
                                </select>
                                {errors.actividadFisica && (
                                    <div className="invalid-feedback">
                                        {errors.actividadFisica}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="button-group">
                            <button 
                                type="button" 
                                className="btn btn-prev" 
                                onClick={prevStep}
                                
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                                Anterior
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-next" 
                                onClick={nextStep}
                                
                            >
                                Siguiente
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            
            case 3:
                return (
                    <div className="step-container">
                        <h3 className="step-title">Historial Sanitario</h3>
                        
                        <div className="form-group">
                            <label htmlFor="vacunasPrevias">Vacunas Previas</label>
                            <div className="select-wrapper">
                                <select
                                    id="vacunasPrevias"
                                    name="vacunasPrevias"
                                    className={`form-control ${errors.vacunasPrevias ? 'is-invalid' : ''}`}
                                    value={localFormData.vacunasPrevias}
                                    disabled={formData?.readOnly}
                                    onChange={onChangeHandler}
                                >
                                    <option value="">Seleccione una opción</option>
                                    {opcionesVacunas.map(opcion => (
                                        <option key={opcion} value={opcion}>{opcion}</option>
                                    ))}
                                </select>
                                {errors.vacunasPrevias && (
                                    <div className="invalid-feedback">
                                        {errors.vacunasPrevias}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="vacunasPreviasDesparacitacion">Desparasitación Previa</label>
                            <div className="select-wrapper">
                                <select
                                    id="vacunasPreviasDesparacitacion"
                                    name="vacunasPreviasDesparacitacion"
                                    className={`form-control ${errors.vacunasPreviasDesparacitacion ? 'is-invalid' : ''}`}
                                    value={localFormData.vacunasPreviasDesparacitacion}
                                    disabled={formData?.readOnly}
                                    onChange={onChangeHandler}
                                >
                                    <option value="">Seleccione una opción</option>
                                    {opcionesDesparasitacion.map(opcion => (
                                        <option key={opcion} value={opcion}>{opcion}</option>
                                    ))}
                                </select>
                                {errors.vacunasPreviasDesparacitacion && (
                                    <div className="invalid-feedback">
                                        {errors.vacunasPreviasDesparacitacion}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dieta">Dieta</label>
                            <div className="input-wrapper">
                                <textarea 
                                    id="dieta"
                                    name="dieta"
                                    className={`form-control ${errors.dieta ? 'is-invalid' : ''}`}
                                    value={localFormData.dieta}
                                    disabled={formData?.readOnly}
                                    onChange={onChangeHandler}
                                    rows="3"
                                    placeholder="Describa la dieta actual de la mascota"
                                />
                                {errors.dieta && (
                                    <div className="invalid-feedback">
                                        {errors.dieta}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="button-group">
                            <button 
                                type="button" 
                                className="btn btn-prev" 
                                onClick={prevStep}
                                
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                                Anterior
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-next" 
                                onClick={nextStep}
                                
                            >
                                Siguiente
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            
            case 4:
                return (
                    <div className="step-container">
                        <h3 className="step-title">Motivo de Consulta</h3>
                        
                        <div className="form-group">
                            <label htmlFor="motivoConsulta">Motivo de Consulta</label>
                            <div className="input-wrapper">
                                <textarea 
                                    id="motivoConsulta"
                                    name="motivoConsulta"
                                    className={`form-control ${errors.motivoConsulta ? 'is-invalid' : ''}`}
                                    value={localFormData.motivoConsulta}
                                    disabled={formData?.readOnly}
                                    onChange={onChangeHandler}
                                    rows="3"
                                    placeholder="Describa el motivo principal de la consulta"
                                />
                                {errors.motivoConsulta && (
                                    <div className="invalid-feedback">
                                        {errors.motivoConsulta}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="sintomasMascota">Síntomas</label>
                            <div className="input-wrapper">
                                <textarea 
                                    id="sintomasMascota"
                                    name="sintomasMascota"
                                    className={`form-control ${errors.sintomasMascota ? 'is-invalid' : ''}`}
                                    value={localFormData.sintomasMascota}
                                    disabled={formData?.readOnly}
                                    onChange={onChangeHandler}
                                    rows="3"
                                    placeholder="Describa los síntomas observados"
                                />
                                {errors.sintomasMascota && (
                                    <div className="invalid-feedback">
                                        {errors.sintomasMascota}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="observaciones">Observaciones Adicionales</label>
                            <div className="input-wrapper">
                                <textarea 
                                    id="observaciones"
                                    name="observaciones"
                                    className={`form-control ${errors.observaciones ? 'is-invalid' : ''}`}
                                    value={localFormData.observaciones}
                                    disabled={formData?.readOnly}
                                    onChange={onChangeHandler}
                                    rows="3"
                                    placeholder="Ingrese observaciones adicionales relevantes"
                                />
                                {errors.observaciones && (
                                    <div className="invalid-feedback">
                                        {errors.observaciones}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="button-group">
                            <button 
                                type="button" 
                                className="btn btn-prev" 
                                onClick={prevStep}
                                
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                                Anterior
                            </button>
                            {!formData?.readOnly && (
                                <button type="submit" className="btn btn-submit">
                                    Registrar Anamnesis
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 13l4 4L19 7"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            dialogClassName="modal-90w"
        >
            <Modal.Header closeButton className="modal-header-custom">
                <div className="header-content">
                    <img src={logo} alt="guide-upc logo" className="modal-logo" />
                    <Modal.Title>
                        {formData?.readOnly ? 'Detalles de Anamnesis' : 'Registro de Anamnesis'}
                    </Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="register-container">
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                                <span className="step-number">1</span>
                                <span className="step-label">General</span>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                                <span className="step-number">2</span>
                                <span className="step-label">Básica</span>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                                <span className="step-number">3</span>
                                <span className="step-label">Sanitario</span>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
                                <span className="step-number">4</span>
                                <span className="step-label">Consulta</span>
                            </div>
                        </div>
                    </div>
                    
                    <form onSubmit={onSubmitRegister}>
                        <div className="form-content">
                            {renderStep()}
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}