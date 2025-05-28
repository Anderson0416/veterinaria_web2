import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterCliForm from './RegisterCliForm';

// Mocks para las dependencias externas
jest.mock('../../services/ClienteService', () => ({
  createCliente: jest.fn(() => Promise.resolve())
}));

// Envoltura para simular el Router
const renderComponent = () => {
  return render(
    <BrowserRouter>
      <RegisterCliForm />
    </BrowserRouter>
  );
};

describe('RegisterCliForm', () => {
  it('renderiza el formulario y muestra los campos de paso 1', () => {
    renderComponent();

    expect(screen.getByLabelText(/N. Identificación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de Identificación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sexo/i)).toBeInTheDocument();
  });

  it('muestra errores si se ingresan datos inválidos en paso 1', () => {
    renderComponent();

    // Click en "Siguiente" sin ingresar datos
    fireEvent.click(screen.getByText(/Siguiente/i));

    expect(screen.getByText(/El ID debe contener solo números/i)).toBeInTheDocument();
    expect(screen.getByText(/El nombre debe contener solo letras/i)).toBeInTheDocument();
    expect(screen.getByText(/El apellido debe contener solo letras/i)).toBeInTheDocument();
  });

  it('avanza al paso 2 si los datos del paso 1 son válidos', () => {
    renderComponent();

    // Ingresar datos válidos
    fireEvent.change(screen.getByLabelText(/N. Identificación/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Pérez' } });
    fireEvent.click(screen.getByText(/Siguiente/i));

    // Verificar campos del paso 2
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
  });

  it('envía el formulario con datos válidos en ambos pasos', async () => {
    const { findByText } = renderComponent();

    // Paso 1
    fireEvent.change(screen.getByLabelText(/N. Identificación/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Tipo de Identificación/i), { target: { value: 'Cedula de ciudadania' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'Masculino' } });
    fireEvent.click(screen.getByText(/Siguiente/i));

    // Paso 2
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '987654321' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'juan@example.com' } });

    // Enviar el formulario
    fireEvent.click(screen.getByText(/Registrar Cliente/i));

    // Verifica que se muestre el mensaje en consola (simulado)
    expect(await findByText(/Registro de Cliente/i)).toBeInTheDocument();
  });
});
