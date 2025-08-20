import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, X } from 'lucide-react';

interface WeatherAlert {
  id: string;
  headline: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  description: string;
  onset: string;
  expires: string;
}

interface WeatherAlertsProps {
  lat: number;
  lon: number;
  radius?: number;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ lat, lon, radius = 50 }) => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAlerts();
  }, [lat, lon, radius]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`/api/weather/alerts`, {
        params: { lat, lon, radius }
      });
      setAlerts(response.data.features || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather alerts');
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-600';
      case 'severe': return 'bg-orange-600';
      case 'moderate': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  if (loading) {
    return <div className="p-4">Loading alerts...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="weather-alerts mb-4">
      {visibleAlerts.map(alert => (
        <div 
          key={alert.id}
          className={`alert-item p-4 mb-2 rounded-lg text-white ${getSeverityColor(alert.severity)}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-1" />
              <div>
                <div className="font-bold text-lg">{alert.headline}</div>
                <div className="text-sm opacity-90 mt-1">{alert.description}</div>
                <div className="text-xs opacity-75 mt-2">
                  Valid from {new Date(alert.onset).toLocaleString()} to {new Date(alert.expires).toLocaleString()}
                </div>
              </div>
            </div>
            <div 
              onClick={() => dismissAlert(alert.id)}
              className="cursor-pointer hover:opacity-75"
            >
              <X className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};