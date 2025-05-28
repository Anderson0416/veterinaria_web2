import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { updatePassword, getProfile } from '../../services/UsuarioService';
import '../../assets/styles/LoginForm.css'; 

export default function RecuperarContra() {
    const [oldPass, setoldPass] = useState("");
    const [newPass, setnewPass] = useState("");
    const [login, setlogin] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getProfile()
          .then(data => {
            setlogin(data.login);
            console.log("----LOGIN: "+data.login)
          })
          .catch(error => {
            console.error('Error al obtener el perfil del usuario:', error);
          });
      }, []);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        if (name === 'oldPass') setoldPass(value);
        if (name === 'newPass') setnewPass(value);
    };

    const onSubmitCambiarContra = (e) => {
        e.preventDefault();
        updatePassword(login, oldPass, newPass,navigate);
    };

    return (
        <div className="login-page">
            <div className="fullscreen">
                <div className="login-container">
                    <div className="tab-content">
                        <form onSubmit={onSubmitCambiarContra}>
                            <div className="form-outline mb-4">
                                <input type="password" id="oldPassword" name="oldPass" className="form-control" onChange={onChangeHandler} />
                                <label className="form-label" htmlFor="oldPassword">Contraseña Anterior</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="password" id="newPassword" name="newPass" className="form-control" onChange={onChangeHandler} />
                                <label className="form-label" htmlFor="newPassword">Contraseña Nueva</label>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block mb-4">Confirmar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
