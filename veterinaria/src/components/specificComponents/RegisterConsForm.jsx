import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createConsulta } from '../../services/ConsultaService';
import '../../assets/styles/RegisterUserForm.css';
import logo from '../../assets/images/logo1.png';
import NavigationControls from '../common/NavigationControls';

export function RegisterConsForm() {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Validación del nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        // Validación de la descripción
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        }

        // Validación del precio
        if (!formData.precio) {
            newErrors.precio = 'El precio es requerido';
        } else if (isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
            newErrors.precio = 'El precio debe ser un número mayor a 0';
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
        
        // Limpiar error específico cuando el usuario empieza a escribir
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
            setIsSubmitting(true);
            try {
                await createConsulta({
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    precio: parseFloat(formData.precio)
                });
                navigate(-1); // Volver a la página anterior después de crear
            } catch (error) {
                console.error('Error al crear consulta:', error);
                setIsSubmitting(false);
            }
        }
    };

    return (
        <>
            <NavigationControls />
            <div className="register-page">
                <div className="register-container">
                    <div className="header">
                        <div className="header-content">
                            <img
                                src={logo}
                                alt="guide-upc logo"
                                className="logo"
                            />
                            <h2>Registro de Consulta</h2>
                        </div>
                        <div className="header-decoration">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="wave">
                                <path fill="#ffffff" fillOpacity="1" d="M0,128L48,149.3C96,171,192,213,288,213.3C384,213,480,171,576,165.3C672,160,768,192,864,197.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                            </svg>
                        </div>
                    </div>
                    
                    <div className="form-container">
                        <div className="form-header">
                            <div className="icon-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <h3>Información de la Consulta</h3>
                        </div>
                        
                        <form onSubmit={onSubmitRegister} className="form-animated">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre de la Consulta</label>
                                <div className="input-with-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <input 
                                        type="text" 
                                        id="nombre" 
                                        name="nombre" 
                                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                        value={formData.nombre}
                                        onChange={onChangeHandler}
                                        placeholder="Ej: Consulta General" 
                                    />
                                </div>
                                {errors.nombre && (
                                    <div className="invalid-feedback">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        {errors.nombre}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="descripcion">Descripción</label>
                                <div className="input-with-icon textarea-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                        <line x1="21" y1="6" x2="3" y2="6"></line>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                        <line x1="17" y1="18" x2="3" y2="18"></line>
                                    </svg>
                                    <textarea 
                                        id="descripcion" 
                                        name="descripcion" 
                                        className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                                        value={formData.descripcion}
                                        onChange={onChangeHandler}
                                        rows="4"
                                        placeholder="Describa los detalles de la consulta"
                                    />
                                </div>
                                {errors.descripcion && (
                                    <div className="invalid-feedback">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        {errors.descripcion}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="precio">Precio</label>
                                <div className="input-with-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                    <input 
                                        type="number" 
                                        id="precio" 
                                        name="precio" 
                                        className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
                                        value={formData.precio}
                                        onChange={onChangeHandler}
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.precio && (
                                    <div className="invalid-feedback">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        {errors.precio}
                                    </div>
                                )}
                            </div>
                            
                            <div className="form-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => navigate(-1)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="19" y1="12" x2="5" y2="12"></line>
                                        <polyline points="12 19 5 12 12 5"></polyline>
                                    </svg>
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="spinner"></span>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                            <polyline points="7 3 7 8 15 8"></polyline>
                                        </svg>
                                    )}
                                    Registrar Consulta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default RegisterConsForm;