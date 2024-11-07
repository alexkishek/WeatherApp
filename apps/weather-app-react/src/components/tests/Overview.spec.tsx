import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Overview from "../Overview";

describe('Overview Component', () => {
  it('should render correctly with given props', () => {
    const mockCity = 'Detroit';
    const mockData = { temperature: 72 };

    const { getByText } = render(
      <Overview city={mockCity} data={mockData} />
    );

    expect(getByText('Detroit')).toBeInTheDocument();

    expect(getByText('72°')).toBeInTheDocument();
  });
});
