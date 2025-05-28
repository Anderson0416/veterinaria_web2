import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterConsForm from './RegisterConsForm';

// Mock del servicio de creación
jest.mock('../../services/ConsultaService', () => ({
  createConsulta: jest.fn(),
}));

// Mock del useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RegisterConsForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente', () => {
    render(
      <MemoryRouter>
        <RegisterConsForm />
      </MemoryRouter>
    );

    expect(screen.getByText(/Registro de Consulta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de la Consulta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Precio/i)).toBeInTheDocument();
  });

  it('muestra errores si los campos están vacíos', async () => {
    render(
      <MemoryRouter>
        <RegisterConsForm />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Registrar Consulta/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/El nombre es requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/La descripción es requerida/i)).toBeInTheDocument();
    expect(screen.getByText(/El precio es requerido/i)).toBeInTheDocument();
  });

  it('muestra error si el precio es inválido', async () => {
    render(
      <MemoryRouter>
        <RegisterConsForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre de la Consulta/i), { target: { value: 'Consulta' } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Descripción' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '-10' } });

    const submitButton = screen.getByRole('button', { name: /Registrar Consulta/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/El precio debe ser un número mayor a 0/i)).toBeInTheDocument();
  });

  it('llama a createConsulta y navega cuando el formulario es válido', async () => {
    const { createConsulta } = require('../../services/ConsultaService');
    createConsulta.mockResolvedValueOnce({}); // Simulamos respuesta exitosa

    render(
      <MemoryRouter>
        <RegisterConsForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre de la Consulta/i), { target: { value: 'Consulta' } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Descripción' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '100' } });

    const submitButton = screen.getByRole('button', { name: /Registrar Consulta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createConsulta).toHaveBeenCalledWith({
        nombre: 'Consulta',
        descripcion: 'Descripción',
        precio: 100,
      });
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });
});
