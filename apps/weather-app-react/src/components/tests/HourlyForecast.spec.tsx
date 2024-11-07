import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HourlyForecast from '../HourlyForecast';

const mockHourlyData = [
  {
    time: '12:00 PM',
    weatherIcon: '01d',
    weatherStatus: 'Clear',
    temperature: 75,
  },
  {
    time: '1:00 PM',
    weatherIcon: '02d',
    weatherStatus: 'Partly Cloudy',
    temperature: 78,
  },
  {
    time: '2:00 PM',
    weatherIcon: '03d',
    weatherStatus: 'Cloudy',
    temperature: 80,
  },
];

const mockCurrentStatus = 'Mostly Sunny';

describe('HourlyForecast Component', () => {
  it('should render correctly with given hourly data', () => {
    const { getByText, getAllByAltText } = render(
      <HourlyForecast hourlyData={mockHourlyData} currentStatus={mockCurrentStatus} />
    );

    expect(getByText('Mostly Sunny')).toBeInTheDocument();

    mockHourlyData.forEach((hour) => {
      expect(getByText(hour.time)).toBeInTheDocument();
      expect(getByText(`${hour.temperature}°`)).toBeInTheDocument();
    });

    mockHourlyData.forEach((hour) => {
      expect(getAllByAltText(hour.weatherStatus)[0]).toBeInTheDocument();
    });
  });

  it('should render all hourly data entries', () => {
    const { container } = render(
      <HourlyForecast hourlyData={mockHourlyData} currentStatus={mockCurrentStatus} />
    );

    const hourlyEntries = container.querySelectorAll('.flex.flex-col.items-center.min-w-12');
    expect(hourlyEntries.length).toBe(mockHourlyData.length);
  });
});
