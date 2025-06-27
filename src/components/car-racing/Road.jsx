import React from 'react';
import roadImage from '../../assets/road.jpg';

const Road = () => {
  const roadStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '200%', // Double height for seamless animation
    backgroundImage: `url(${roadImage})`,
    backgroundSize: '100% 50%', // Show half at a time
    backgroundRepeat: 'repeat-y',
    animation: 'roadMovement 5s linear infinite',
  };

  return (
    <>
      <div style={roadStyle}></div>
      <style>
        {`
          @keyframes roadMovement {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0%); }
          }
        `}
      </style>
    </>
  );
};

export default Road;