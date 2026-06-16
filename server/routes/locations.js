const express = require('express');
const router = express.Router();

// Hierarchical location data
// In production, this would come from a database or external API
const locations = {
  countries: [
    {
      id: 'US',
      name: 'United States',
      states: [
        { id: 'AL', name: 'Alabama', cities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa'] },
        { id: 'AK', name: 'Alaska', cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'] },
        { id: 'AZ', name: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'] },
        { id: 'CA', name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno', 'Oakland'] },
        { id: 'CO', name: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Boulder'] },
        { id: 'FL', name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'] },
        { id: 'GA', name: 'Georgia', cities: ['Atlanta', 'Savannah', 'Augusta', 'Athens', 'Columbus'] },
        { id: 'IL', name: 'Illinois', cities: ['Chicago', 'Aurora', 'Naperville', 'Springfield', 'Peoria'] },
        { id: 'NY', name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'] },
        { id: 'TX', name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'] },
        { id: 'WA', name: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'] }
      ]
    },
    {
      id: 'UK',
      name: 'United Kingdom',
      states: [
        { id: 'ENG', name: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Bristol', 'Sheffield', 'Newcastle'] },
        { id: 'SCT', name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'] },
        { id: 'WLS', name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Bangor', 'Wrexham'] },
        { id: 'NIR', name: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Armagh'] }
      ]
    },
    {
      id: 'AU',
      name: 'Australia',
      states: [
        { id: 'NSW', name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Albury'] },
        { id: 'VIC', name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton'] },
        { id: 'QLD', name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Cairns', 'Townsville'] },
        { id: 'WA', name: 'Western Australia', cities: ['Perth', 'Fremantle', 'Bunbury', 'Geraldton', 'Albany'] },
        { id: 'SA', name: 'South Australia', cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Port Augusta', 'Victor Harbor'] }
      ]
    },
    {
      id: 'CA',
      name: 'Canada',
      states: [
        { id: 'ON', name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London', 'Windsor'] },
        { id: 'BC', name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'] },
        { id: 'QC', name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Sherbrooke'] },
        { id: 'AB', name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'] }
      ]
    }
  ]
};

/**
 * GET /api/locations/countries
 * Get all countries
 */
router.get('/countries', (req, res) => {
  const countries = locations.countries.map(c => ({
    id: c.id,
    name: c.name
  }));
  res.json({ success: true, data: countries });
});

/**
 * GET /api/locations/:countryId/states
 * Get states/provinces for a country
 */
router.get('/:countryId/states', (req, res) => {
  const { countryId } = req.params;
  const country = locations.countries.find(c => c.id === countryId.toUpperCase());
  if (!country) {
    return res.status(404).json({ success: false, error: 'Country not found' });
  }
  const states = country.states.map(s => ({
    id: s.id,
    name: s.name
  }));
  res.json({ success: true, data: states });
});

/**
 * GET /api/locations/:countryId/:stateId/cities
 * Get cities for a state/province
 */
router.get('/:countryId/:stateId/cities', (req, res) => {
  const { countryId, stateId } = req.params;
  const country = locations.countries.find(c => c.id === countryId.toUpperCase());
  if (!country) {
    return res.status(404).json({ success: false, error: 'Country not found' });
  }
  const state = country.states.find(s => s.id === stateId.toUpperCase());
  if (!state) {
    return res.status(404).json({ success: false, error: 'State not found' });
  }
  res.json({ success: true, data: state.cities.map(name => ({ id: name, name })) });
});

/**
 * GET /api/locations/all
 * Get all location data (for caching on the frontend)
 */
router.get('/all', (req, res) => {
  res.json({ success: true, data: locations.countries });
});

module.exports = router;