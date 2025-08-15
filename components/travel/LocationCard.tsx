import React from 'react';
import { TravelLocation, TravelStatus } from '../../types';

interface LocationCardProps {
  location: TravelLocation;
  status: TravelStatus;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, status }) => {
  const statusColors = {
    lived: 'border-accent bg-accent/10',
    visited: 'border-green-500 bg-green-500/10',
    wantToVisit: 'border-amber-500 bg-amber-500/10',
    wantToLive: 'border-red-500 bg-red-500/10',
  };

  const statusIcons = {
    lived: '🏠',
    visited: '✈️',
    wantToVisit: '🗺️',
    wantToLive: '❤️',
  };

  return (
    <div className={`bg-surface/30 rounded-lg p-4 hover:bg-surface/50 transition-all duration-300 border-l-4 ${statusColors[status]}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-text-primary">{location.name}</h3>
          <p className="text-sm text-text-secondary">{location.country}</p>
          <p className="text-xs text-accent">{location.continent}</p>
        </div>
        <span className="text-2xl">{statusIcons[status]}</span>
      </div>
      
      {location.description && (
        <p className="text-sm text-text-secondary mb-3">{location.description}</p>
      )}
      
      <div className="flex items-center justify-between text-xs text-text-secondary">
        {location.dateVisited && (
          <span>Visited: {location.dateVisited}</span>
        )}
        {location.duration && (
          <span>Duration: {location.duration}</span>
        )}
      </div>
      
      {location.imageUrl && (
        <div className="mt-3 rounded-md overflow-hidden">
          <img 
            src={location.imageUrl} 
            alt={location.name}
            className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
    </div>
  );
};

export default LocationCard;