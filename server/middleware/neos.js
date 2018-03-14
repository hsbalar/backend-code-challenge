import Neos from "../models/Neos";

export function getHazardousAsteroidList(req, res, next) {
  Neos.find({ isHazardous: true }).exec((err, list) => {
    if (err) { return next(err) }
    return res.json({ data : list, count: list.length });
  });
}

export function getFastestHazardous(req, res, next) {
  let isHazardous = req.query.hazardous === 'true' ? true : false;
  Neos.find({ isHazardous: isHazardous }).sort({ speed: -1 }).limit(1).exec((err, fastest) => {
    if (err) { return next(err) }
    return res.json(fastest);
  }); 
}

export function getBestYear(req, res, next) {
  let isHazardous = req.query.hazardous === 'true' ? true : false;
  Neos.aggregate(
    {
      $match : {
        isHazardous: isHazardous
      }
    },
    { 
      $project: {
        _id : 0 ,
        year: {
            $year: "$date"
        }
      }
    },
    {
      $group: {
        _id : { year: '$year' },
        count: { $sum: 1 }
      }
    }
  ).exec((err, result) => {
    return res.json(result)
  });
}

export function getBestMonth(req, res, next) {
  let isHazardous = req.query.hazardous === 'true' ? true : false;
  Neos.aggregate(
    {
      $match : {
        isHazardous: isHazardous
      }
    },
    { 
      $project: {
        _id : 0 ,
        month: {
          $month: "$date"
        }
      }
    },
    {
      $group: {
        _id : { month: '$month' },
        count: { $sum: 1 }
      }
    }
  ).exec((err, result) => {
    return res.json(result)
  });
}
