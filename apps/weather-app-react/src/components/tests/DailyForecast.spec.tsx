import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DailyForecast from '../DailyForecast';

describe('DailyForecast Component', () => {
  it('should render correctly with daily forecast data', () => {
    const mockDailyData = [
      {
        dayOfWeek: 'Monday',
        weatherIcon: '10d',
        weatherStatus: 'rainy',
        high: 78,
        low: 65,
      },
      {
        dayOfWeek: 'Tuesday',
        weatherIcon: '01d',
        weatherStatus: 'sunny',
        high: 80,
        low: 68,
      },
    ];

    const { getByText, getAllByAltText } = render(
      <DailyForecast dailyData={mockDailyData} />
    );

    expect(getByText('Mon')).toBeInTheDocument();
    expect(getByText('rainy')).toBeInTheDocument();
    expect(getByText('78')).toBeInTheDocument();
    expect(getByText('65')).toBeInTheDocument();


    expect(getByText('Tue')).toBeInTheDocument();
    expect(getByText('sunny')).toBeInTheDocument();
    expect(getByText('80')).toBeInTheDocument();
    expect(getByText('68')).toBeInTheDocument();

    const weatherIcons = getAllByAltText(/rainy|sunny/);
    expect(weatherIcons).toHaveLength(2);
    expect(weatherIcons[0]).toHaveAttribute(
      'src',
      'http://openweathermap.org/img/wn/10d.png'
    );
    expect(weatherIcons[1]).toHaveAttribute(
      'src',
      'http://openweathermap.org/img/wn/01d.png'
    );
  });
});
