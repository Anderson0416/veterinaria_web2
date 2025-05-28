import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitRegister } from '../../services/UsuarioService';
import '../../assets/styles/RegisterUserForm.css';
import logo from '../../assets/images/logo1.png';
import NavigationControls from '../common/NavigationControls';

export function RegisterUserForm() {
    const [formData, setFormData] = useState({
        id: '',
        tipoIdentificacion: '',
        nombre: '',
        apellido: '',
        sexo: '',
        fechaNacimiento: '',
        telefono: '',
        fechaContrato: '',
        login: '',
        rol: '' 
    });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateForm = (type) => {
        const newErrors = {};

        if (type === 'register') {
            // ID validation (only numbers)
            if (!/^\d+$/.test(formData.id)) {
                newErrors.id = 'El ID debe contener solo números';
            }

            // Name validation (only letters)
            if (!/^[A-Za-zÁ-ÿ\s]+$/.test(formData.nombre)) {
                newErrors.nombre = 'El nombre debe contener solo letras';
            }

            // Lastname validation (only letters)
            if (!/^[A-Za-zÁ-ÿ\s]+$/.test(formData.apellido)) {
                newErrors.apellido = 'El apellido debe contener solo letras';
            }

            // Phone validation (only numbers)
            if (!/^\d+$/.test(formData.telefono)) {
                newErrors.telefono = 'El teléfono debe contener solo números';
            }
        }

        // Email validation
        if (!validateEmail(formData.login)) {
            newErrors.login = 'Ingrese un correo electrónico válido';
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
        
        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Clear login error
        if (loginError) {
            setLoginError('');
        }
    };

    const onSubmitRegister = async (e) => {
        e.preventDefault();
        if (validateForm('register')) {
            await SubmitRegister(
                formData.id, 
                formData.tipoIdentificacion,
                formData.nombre, 
                formData.apellido,
                formData.sexo,
                formData.fechaNacimiento,
                formData.telefono,
                formData.fechaContrato,
                formData.login, 
                parseInt(formData.rol),                
                navigate
            );
           
            console.log('Formulario enviado:', formData);
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
                        <h3 className="step-title">Información Personal</h3>
                        <div className="form-group">
                            <label htmlFor="id">N. Identificación</label>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    id="id" 
                                    name="id" 
                                    className={`form-control ${errors.id ? 'is-invalid' : ''}`}
                                    value={formData.id}
                                    onChange={onChangeHandler} 
                                    placeholder="Ingrese su número de identificación"
                                />
                                {errors.id && (
                                    <div className="invalid-feedback">
                                        {errors.id}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tipoIdentificacion">Tipo de Identificación</label>
                            <div className="select-wrapper">
                                <select
                                    id="tipoIdentificacion"
                                    name="tipoIdentificacion"
                                    className="form-control"
                                    value={formData.tipoIdentificacion}
                                    onChange={onChangeHandler}
                                >   
                                    <option value="">Seleccione una opción</option>
                                    <option value="Cedula de ciudadania">Cédula de ciudadanía</option>
                                    <option value="Cedula de extranjeria">Cédula de extranjería</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                </select>
                            </div>
                        </div>

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
                                    placeholder="Ingrese su nombre"
                                />
                                {errors.nombre && (
                                    <div className="invalid-feedback">
                                        {errors.nombre}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    id="apellido" 
                                    name="apellido" 
                                    className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                                    value={formData.apellido}
                                    onChange={onChangeHandler} 
                                    placeholder="Ingrese su apellido"
                                />
                                {errors.apellido && (
                                    <div className="invalid-feedback">
                                        {errors.apellido}
                                    </div>
                                )}
                            </div>
                        </div>

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
                                    <option value="">Seleccione una opción</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
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
                        <h3 className="step-title">Información de Contacto</h3>
                        <div className="form-group">
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                            <div className="input-wrapper date-input">
                                <input 
                                    type="date" 
                                    id="fechaNacimiento" 
                                    name="fechaNacimiento" 
                                    className="form-control"
                                    value={formData.fechaNacimiento}
                                    onChange={onChangeHandler} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    id="telefono" 
                                    name="telefono" 
                                    className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                                    value={formData.telefono}
                                    onChange={onChangeHandler} 
                                    placeholder="Ingrese su teléfono"
                                />
                                {errors.telefono && (
                                    <div className="invalid-feedback">
                                        {errors.telefono}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="login">Correo electrónico</label>
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    id="login" 
                                    name="login" 
                                    className={`form-control ${errors.login ? 'is-invalid' : ''}`}
                                    value={formData.login}
                                    onChange={onChangeHandler} 
                                    placeholder="ejemplo@correo.com"
                                />
                                {errors.login && (
                                    <div className="invalid-feedback">
                                        {errors.login}
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
                            <button type="button" className="btn btn-next" onClick={nextStep}>
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
                        <h3 className="step-title">Información Laboral</h3>
                        <div className="form-group">
                            <label htmlFor="rol">Rol</label>
                            <div className="select-wrapper">
                                <select
                                    id="rol"
                                    name="rol"
                                    className="form-control"
                                    value={formData.rol}
                                    onChange={onChangeHandler}
                                >   
                                    <option value="">Seleccione una opcion</option>
                                    <option value="2">Recepcionista</option>
                                    <option value="3">Veterinario</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="fechaContrato">Fecha de Contrato</label>
                            <div className="input-wrapper date-input">
                                <input 
                                    type="date" 
                                    id="fechaContrato" 
                                    name="fechaContrato" 
                                    className="form-control"
                                    value={formData.fechaContrato}
                                    onChange={onChangeHandler} 
                                />
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
                                Registrarse
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
                    <h2>Registro de Personal</h2>
                </div>
                
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Personal</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">Contacto</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                            <span className="step-number">3</span>
                            <span className="step-label">Laboral</span>
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
export default RegisterUserForm;