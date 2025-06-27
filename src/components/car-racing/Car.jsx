import React, { useState } from 'react';
import carImage from '../../assets/car.png'
import enemyCarImage from '../../assets/enemy-car.png';

const Car = ({ position, isPlayer, top }) => {
  const [imageError, setImageError] = useState(false);
  
  // Increased size for both player and enemy cars
  const carStyle = {
    position: 'absolute',
    left: `${position}%`,
    top: top ? `${top}%` : '60%',
    width: '80px',  // Increased from 50px
    height: '160px', // Increased from 100px
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    transition: 'left 0.2s ease',
    zIndex: 10,
    transform: isPlayer ? 'none' : 'rotate(180deg)', // Make enemy cars face opposite direction
  };

  if (imageError) {
    return (
      <div style={{
        ...carStyle,
        backgroundColor: isPlayer ? 'blue' : 'red',
        border: '2px solid white'
      }}></div>
    );
  }

  return (
    <div style={{
      ...carStyle,
      backgroundImage: `url(${isPlayer ? carImage : enemyCarImage})`
    }}>
      <img 
        src={isPlayer ? carImage : enemyCarImage} 
        alt={isPlayer ? "Player car" : "Enemy car"}
        style={{ display: 'none' }}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default Car;