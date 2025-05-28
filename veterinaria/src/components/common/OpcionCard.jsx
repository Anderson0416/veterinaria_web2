import Card from 'react-bootstrap/Card';

function OpcionCard(props) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img 
        variant="top" 
        src={props.imagen} 
        style={{ 
          width: '75%',
          margin: 'auto',
          paddingTop: '1rem'
        }}
      />
      <Card.Body 
        style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          }}>
        <Card.Title>{props.titulo}</Card.Title>
        <Card.Text
        >
          {props.descripcion}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default OpcionCard;