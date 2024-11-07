describe('Weather App E2E Test', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/weather/coordinates*', { fixture: 'weatherResponse.json' }).as('getWeather');
    cy.intercept('GET', '/api/weather/quality/coordinates*', { fixture: 'airQualityResponse.json' }).as('getAirQuality');

    cy.visit('/');
  });

  it('should display weather data correctly', () => {
    cy.wait('@getWeather');
    cy.wait('@getAirQuality');

    cy.get('[data-testid="overview-component"]').within(() => {
      cy.contains('Detroit');
      cy.contains('69');
    });

    cy.get('[data-testid="hourly-forecast-component"]').within(() => {
      cy.contains('3 PM');
      cy.contains('69');
    });

    cy.get('[data-testid="daily-forecast-component"]').within(() => {
      cy.contains('69');
      cy.contains('56');
    });

    cy.get('[data-testid="air-quality-component"]').within(() => {
      cy.contains('2');
      cy.contains('Fair');
    });

    cy.get('[data-testid="uv-index-component"]').within(() => {
      cy.contains('UV Index');
      cy.contains('1');
      cy.contains('Low');
    });

    cy.get('[data-testid="sunrise-sunset-component"]').within(() => {
      cy.contains('7:12 AM');
      cy.contains('5:19 PM');
    });

    cy.get('[data-testid="humidity-component"]').within(() => {
      cy.contains('63%');
    });
  });
});
