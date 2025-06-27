import React from 'react';
import Car from './Car';

const Obstacle = ({ left, top }) => {
  return <Car position={left} isPlayer={false} top={top} />;
};

export default Obstacle;