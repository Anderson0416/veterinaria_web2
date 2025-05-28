import { Form, InputGroup, Button } from 'react-bootstrap';

export function SearchBar({ 
    searchTerm, 
    onSearch, 
    onClear, 
    placeholder = "Buscar...",
    type = "text" 
}) {
    return (
        <div className="mb-3">
            <InputGroup>
                <Form.Control
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={onSearch}
                    type={type}
                />
                {searchTerm && (
                    <Button 
                        variant="outline-secondary"
                        onClick={onClear}
                    >
                        ✕
                    </Button>
                )}
            </InputGroup>
        </div>
    );
}