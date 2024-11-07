import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AirQuality from '../AirQuality';

describe('AirQuality Component', () => {
  it('should render correctly with given data', () => {
    const mockData = {
      aqi: 3,
    };

    const { getByText, getByRole } = render(<AirQuality data={mockData} />);

    expect(getByText('3')).toBeInTheDocument();

    expect(getByText('Moderate')).toBeInTheDocument();

    expect(getByText('Air Quality')).toBeInTheDocument();
  });

  it('should render the correct AQI status based on the AQI value', () => {
    const mockData = {
      aqi: 5,
    };

    const { getByText } = render(<AirQuality data={mockData} />);

    expect(getByText('5')).toBeInTheDocument();
    expect(getByText('Very Poor')).toBeInTheDocument();
  });

  it('should correctly set the indicator position based on the AQI value', () => {
    const mockData = {
      aqi: 4,
    };

    const { container } = render(<AirQuality data={mockData} />);

    const indicator = container.querySelector('.absolute.top-\\[-4px\\]');
    expect(indicator).toHaveStyle(`left: ${(mockData.aqi / 5) * 100}%`);
  });

  it('should render "Unknown" for AQI status if AQI is out of range', () => {
    const mockData = {
      aqi: 6,
    };

    const { getByText } = render(<AirQuality data={mockData} />);

    expect(getByText('6')).toBeInTheDocument();
    expect(getByText('Unknown')).toBeInTheDocument();
  });
});
