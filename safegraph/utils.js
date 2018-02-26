const PERCFIELD = 'perc';
const PERCLABEL = '%';

const getNotNullWhere = field => `${field} IS NOT NULL`;

const createRenderer = (field, min=0, max=10) => {
  const opcExpr = `IIf(IsEmpty($feature.${field}), 0, $feature.${field})`
  return {
    type: "simple",  // autocasts as new SimpleRenderer()
    symbol: {
      type: "simple-fill",  // autocasts as new SimpleFillSymbol()
      color: [ 51,51, 204, 0.9 ],
      style: "solid",
      outline: {  // autocasts as new SimpleLineSymbol()
        color: "white",
        width: 0
      }
    },  // autocasts as new SimpleFillSymbol()
    visualVariables: [{
      type: "opacity",
      valueExpression: opcExpr,
      legendOptions: {title: "Visits"},
      stops: [{ value: min, opacity: 0 },
            { value: max, opacity: 1 }]
    }]
  }
}

const createCatDataset = (lyr, field, alias, visitField='total') => {
  const where = getNotNullWhere(visitField);
  const countField = `${field}_count`;
  const visitCountField = `${visitField}_count`;
  return {
    "url": lyr,
    "query": {
      "where": where,
      "groupByFieldsForStatistics": field,
      "outStatistics": [{
        "statisticType": "count",
        "onStatisticField": field,
        "outStatisticFieldName": countField
      }, {
        "statisticType": "count",
        "onStatisticField": visitField,
        "outStatisticFieldName": visitCountField
      }]
    },
    "mappings": {
      "x": {"field": field, "label": alias},
      "y": {"field": PERCFIELD, "label": PERCLABEL}
    }
  }
}

const catTransform = (queryResult, dataset) => {
  const features = queryResult.features;
  const catField = dataset.query.outStatistics[0].outStatisticFieldName;
  const visitField = dataset.query.outStatistics[1].outStatisticFieldName;
  const groupField = dataset.query.groupByFieldsForStatistics;

  const total = features.reduce( (p, f) => 
    p + (f.attributes[catField] * f.attributes[visitField])
  , 0)

  let sumOther = 0;
  let newFeatures = [];
  for(let i = 0, len=features.length; i < len; i++){
    const f = features[i];
    const atrs = f.attributes;
    const perc = (atrs[catField] * atrs[visitField] / total)
    if(perc > 0.01){
      atrs[PERCFIELD] = perc.toFixed(2);
      f.attributes = atrs;
      newFeatures.push(f);
    }
    else {
      sumOther += perc;
    }
  }
  if(sumOther){
    let attr = {};
    attr[groupField] = "Other";
    attr[PERCFIELD] = sumOther.toFixed(2);
    newFeatures.push({attributes: attr})
  }

  queryResult.features = newFeatures;

  return queryResult;
}