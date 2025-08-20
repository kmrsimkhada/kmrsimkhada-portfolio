import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import ParticleBackground from '../components/common/ParticleBackground';
import { apiService } from '../services/api';

import LocationCard from '../components/travel/LocationCard';
import { TravelLocation, TravelStatus } from '../types';

const Travel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TravelStatus>('visited');
  const [loading, setLoading] = useState(true);

  // Load travel data from localStorage
  const [travelData, setTravelData] = useState<{ [key in TravelStatus]: TravelLocation[] }>({
    lived: [],
    visited: [],
    wantToVisit: [],
    wantToLive: []
  });

  useEffect(() => {
    const load = async () => {
      try {
        console.log('🌍 Travel: Starting to load locations...');
        const locations: TravelLocation[] = await apiService.getLocations();
        console.log('✅ Travel: API response:', locations);
        
        const organizedData = {
          lived: locations.filter(loc => loc.status === 'lived'),
          visited: locations.filter(loc => loc.status === 'visited'),
          wantToVisit: locations.filter(loc => loc.status === 'wantToVisit'),
          wantToLive: locations.filter(loc => loc.status === 'wantToLive')
        };
        
        console.log('📊 Travel: Organized data:', organizedData);
        setTravelData(organizedData);
        setLoading(false);
        return;
      } catch (err) {
        console.error('❌ Travel: Failed to load travel locations:', err);
        setLoading(false);
      }
      // Fallback to static data
      // Fallback to static data if no admin data exists
      setTravelData({
    lived: [
      {
        id: '1',
        name: 'Kathmandu',
        country: 'Nepal',
        continent: 'Asia',
        coordinates: [27.7172, 85.3240],
        description: 'My hometown, where it all began. Rich culture, amazing food, and the gateway to the Himalayas.',
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'lived'
      },
      {
        id: '2',
        name: 'Helsinki',
        country: 'Finland',
        continent: 'Europe',
        coordinates: [60.1699, 24.9384],
        description: 'Beautiful Nordic city with stunning architecture, saunas, and the perfect work-life balance.',
        imageUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'lived'
      },
      {
        id: '3',
        name: 'Brisbane',
        country: 'Australia',
        continent: 'Australia',
        coordinates: [-27.4698, 153.0251],
        description: 'Sunny Queensland capital with great weather, friendly people, and amazing outdoor lifestyle.',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'lived'
      }
    ],
    visited: [],
    wantToVisit: [],
    wantToLive: []
      });
    };
    load();
  }, []);

  const tabLabels = {
    lived: 'Places Lived',
    visited: 'Countries Visited',
    wantToVisit: 'Want to Visit',
    wantToLive: 'Want to Live'
  };

  const tabIcons = {
    lived: '🏠',
    visited: '✈️',
    wantToVisit: '🗺️',
    wantToLive: '❤️'
  };

  return (
    <div className="bg-background font-sans text-text-secondary antialiased min-h-screen flex flex-col relative">
      <ParticleBackground />
      <header className="bg-background/80 backdrop-blur-md shadow-lg shadow-surface/20 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex justify-between items-center">
          <Link to="/" aria-label="home" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            <Logo />
          </Link>
          <Link to="/" className="text-sm font-medium transition-colors duration-300 text-text-secondary hover:text-accent">
            ← Back to Portfolio
          </Link>
        </div>
      </header>

      <main className="pt-24 sm:pt-32 pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 flex-1 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">Travel Map</h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Places I've lived, visited, and dream of exploring.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                <span className="text-text-secondary">Loading travel data...</span>
              </div>
            </div>
          ) : (
            <>
          {/* Travel Stats - Now Clickable */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {Object.entries(travelData).map(([status, locations]) => (
              <button
                key={status}
                onClick={() => setActiveTab(status as TravelStatus)}
                className={`bg-surface/30 rounded-lg p-4 text-center transition-all duration-300 hover:bg-surface/50 hover:scale-105 ${
                  activeTab === status ? 'ring-2 ring-accent bg-surface/50' : ''
                }`}
              >
                <div className="text-2xl mb-2">{tabIcons[status as TravelStatus]}</div>
                <div className="text-2xl font-bold text-accent mb-1">{locations.length}</div>
                <div className="text-sm text-text-secondary">{tabLabels[status as TravelStatus]}</div>
              </button>
            ))}
          </div>

          {/* Location Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelData[activeTab].map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                status={activeTab}
              />
            ))}
          </div>

          {/* Empty State */}
          {travelData[activeTab].length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">{tabIcons[activeTab]}</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No {tabLabels[activeTab]} Yet</h3>
              <p className="text-text-secondary">This section is waiting to be filled with new adventures!</p>
            </div>
          )}
            </>
          )}
        </div>
      </main>

      <footer className="py-8 text-center text-text-secondary text-sm relative z-10">
        <p>Kumar Simkhada &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Travel;