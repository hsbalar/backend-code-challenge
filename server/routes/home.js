import * as neos from "../middleware/neos";

export default function (app) {

  // index page
  app.get('/', (req, res) => {
    return res.json({ hello: 'world!'});
  });

  app.get('/neo/hazardous', neos.getHazardousAsteroidList);
  app.get('/neo/fastest', neos.getFastestHazardous);
  app.get('/neo/best-year', neos.getBestYear);
  app.get('/neo/best-month', neos.getBestMonth);
};
