import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  getAllClientes } from '../../services/ClienteService';
import { createMascota } from '../../services/MascotaService';
import '../../assets/styles/RegisterUserForm.css';
import logo from '../../assets/images/logo1.png';
import NavigationControls from '../common/NavigationControls'; 

export function RegisterMascForm() {
    const [formData, setFormData] = useState({
        nombre: '',
        especie: '',
        raza: '',
        sexo: '',
        edad: '',
        clienteId: ''
    });
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingClientes, setLoadingClientes] = useState(false);
    const navigate = useNavigate();

    // Cargar clientes al montar el componente
    useEffect(() => {
        const fetchClientes = async () => {
            setLoadingClientes(true);
            try {
                const clientesData = await getAllClientes();
                setClientes(clientesData);
            } catch (error) {
                console.error('Error al cargar clientes:', error);
            } finally {
                setLoadingClientes(false);
            }
        };

        fetchClientes();
    }, []);

    // Filtrar clientes basado en la entrada del usuario
    useEffect(() => {
        if (formData.clienteId && formData.clienteId.length > 0) {
            const filtered = clientes.filter(cliente => 
                cliente.id.toString().includes(formData.clienteId) ||
                cliente.nombre.toLowerCase().includes(formData.clienteId.toLowerCase())
            );
            setFilteredClientes(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredClientes([]);
            setShowSuggestions(false);
        }
    }, [formData.clienteId, clientes]);

    const validateForm = () => {
        const newErrors = {};
        // Name validation (only letters)
        if (!/^[A-Za-zÁ-ÿ\s]+$/.test(formData.nombre)) {
            newErrors.nombre = 'El nombre debe contener solo letras';
        }

        // Edad validation (only numbers and greater than 0)
        if (!/^\d+$/.test(formData.edad) || parseInt(formData.edad) <= 0) {
            newErrors.edad = 'La edad debe ser un número mayor a 0';
        }

        // Cliente ID validation (required)
        if (!formData.clienteId) {
            newErrors.clienteId = 'El ID del cliente es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
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

    const handleClienteSelect = (cliente) => {
        setFormData(prev => ({
            ...prev,
            clienteId: cliente.id.toString()
        }));
        setShowSuggestions(false);
        
        // Limpiar error si existe
        if (errors.clienteId) {
            setErrors(prev => ({
                ...prev,
                clienteId: ''
            }));
        }
    };

    const handleClienteInputFocus = () => {
        if (formData.clienteId && filteredClientes.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleClienteInputBlur = () => {
        // Delay para permitir el click en las sugerencias
        setTimeout(() => {
            setShowSuggestions(false);
        }, 150);
    };

    const onSubmitRegister = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const mascotaData = {
                    nombre: formData.nombre,
                    especie: formData.especie,
                    raza: formData.raza,
                    sexo: formData.sexo,
                    edad: parseInt(formData.edad),
                    clienteId: formData.clienteId
                };

                await createMascota(mascotaData);
                console.log('Mascota registrada exitosamente');
                navigate(-1);
            } catch (error) {
                console.error('Error al crear mascota:', error);
                // Verificar si el error es porque el cliente no existe
                if (error.response != null) {
                    console.log('El cliente no existe en el sistema');
                    setErrors(prev => ({
                        ...prev,
                        clienteId: 'El cliente no existe en el sistema'
                    }));
                    
                    const clienteIdInput = document.getElementById('clienteId');
                    if (clienteIdInput) {
                        clienteIdInput.classList.add('is-invalid');
                        clienteIdInput.focus();
                        clienteIdInput.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            }
        }
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
                        <h3 className="step-title">Información Básica</h3>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                    value={formData.nombre}
                                    onChange={onChangeHandler} 
                                    placeholder="Ingrese el nombre de la mascota"
                                />
                                {errors.nombre && (
                                    <div className="invalid-feedback">
                                        {errors.nombre}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="especie">Especie</label>
                            <div className="select-wrapper">
                                <select
                                    id="especie"
                                    name="especie"
                                    className="form-control"
                                    value={formData.especie}
                                    onChange={onChangeHandler}
                                >   
                                    <option value="">Seleccione una especie</option>
                                    <option value="Perro">Perro</option>
                                    <option value="Gato">Gato</option>
                                    <option value="Ave">Ave</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="raza">Raza</label>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    id="raza" 
                                    name="raza" 
                                    className="form-control"
                                    value={formData.raza}
                                    onChange={onChangeHandler}
                                    placeholder="Ingrese la raza de la mascota"
                                />
                            </div>
                        </div>

                        <div className="form-footer">
                            <button type="button" className="btn btn-next" onClick={nextStep}>
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
                        <h3 className="step-title">Información Adicional</h3>
                        <div className="form-group">
                            <label htmlFor="sexo">Sexo</label>
                            <div className="select-wrapper">
                                <select
                                    id="sexo"
                                    name="sexo"
                                    className="form-control"
                                    value={formData.sexo}
                                    onChange={onChangeHandler}
                                >
                                    <option value="">Seleccione un sexo</option>
                                    <option value="Macho">Macho</option>
                                    <option value="Hembra">Hembra</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="edad">Edad (años)</label>
                            <div className="input-wrapper">
                                <input 
                                    type="number" 
                                    id="edad" 
                                    name="edad" 
                                    className={`form-control ${errors.edad ? 'is-invalid' : ''}`}
                                    value={formData.edad}
                                    onChange={onChangeHandler}
                                    min="0"
                                    placeholder="Ingrese la edad en años"
                                />
                                {errors.edad && (
                                    <div className="invalid-feedback">
                                        {errors.edad}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="clienteId">ID del Cliente</label>
                            <div className="input-wrapper autocomplete-wrapper">
                                <input 
                                    type="text" 
                                    id="clienteId" 
                                    name="clienteId" 
                                    className={`form-control ${errors.clienteId ? 'is-invalid' : ''}`}
                                    value={formData.clienteId}
                                    onChange={onChangeHandler}
                                    onFocus={handleClienteInputFocus}
                                    onBlur={handleClienteInputBlur}
                                    placeholder="Ingrese el ID o nombre del propietario"
                                    autoComplete="off"
                                />
                                {errors.clienteId && (
                                    <div className="invalid-feedback">
                                        {errors.clienteId}
                                    </div>
                                )}
                                
                                {/* Sugerencias de clientes */}
                                {showSuggestions && (
                                    <div className="suggestions-dropdown">
                                        {loadingClientes ? (
                                            <div className="suggestion-item loading">
                                                Cargando clientes...
                                            </div>
                                        ) : filteredClientes.length > 0 ? (
                                            filteredClientes.slice(0, 5).map((cliente) => (
                                                <div 
                                                    key={cliente.id}
                                                    className="suggestion-item"
                                                    onClick={() => handleClienteSelect(cliente)}
                                                >
                                                    <div className="suggestion-content">
                                                        <span className="cliente-id">ID: {cliente.id}</span>
                                                        <span className="cliente-nombre">{cliente.nombre}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="suggestion-item no-results">
                                                No se encontraron clientes
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="button-group">
                            <button type="button" className="btn btn-prev" onClick={prevStep}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                                Anterior
                            </button>
                            <button type="submit" className="btn btn-submit">
                                Registrar Mascota
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 13l4 4L19 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
        <NavigationControls />
        <div className="register-page">
            <div className="register-container">
                <div className="header">
                    <img
                        src={logo}
                        alt="guide-upc logo"
                        className="logo"
                    />
                    <h2>Registro de Mascota</h2>
                </div>
                
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Básica</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">Adicional</span>
                        </div>
                    </div>
                </div>
                
                <form onSubmit={onSubmitRegister}>
                    {renderStep()}
                </form>
            </div>
        </div>
        </>
    );
}
export default RegisterMascForm;