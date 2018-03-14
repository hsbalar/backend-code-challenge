import http from "http";
import request from "request";

import config from "./config/config";
import mongodb from "./config/mongodb";

import app from "./config/express";
import routes from "./routes";

import Neos from './models/Neos';

function migrate(db) {
  // import migration scripts
  let startDate = new Date();
  let endDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  endDate.setDate(endDate.getDate() - 3);
  let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}&end_date=${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}&api_key=N7LkblDsc5aen05FJqBQ8wU4qSdmsftwJagVK7UD`;
  request({ method: 'get', url: url }, (err, response) => {
    let collection = [];
    let data = JSON.parse(response.body);
    for (let key in data.near_earth_objects) {
      for (let row of data.near_earth_objects[key]) {
        collection.push({
          date: key,
          name: row.name,
          reference: row.neo_reference_id,
          isHazardous: row.is_potentially_hazardous_asteroid,
          speed: row.close_approach_data[0].relative_velocity.kilometers_per_hour
        });
      }      
    }
    Neos.remove({ }).exec().then(() => {
      Neos.insertMany(collection).then(res => {
        return db;
      });
    });
  });
}

export function start() {

  return new Promise((resolve, reject) => {

    mongodb().then(migrate, reject).then((db) => {

      let server = http.createServer(app);

      // save references
      app.db = db;
      app.server = server;
      app.config = config;

      // setup routes
      routes(app);

      // start server
      app.server.listen(config.server.port, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(app);
      });
    }, reject);
  });
};
