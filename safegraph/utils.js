const PERCFIELD = 'perc';
const PERCLABEL = 'Fraction';

const getNotNullWhere = field => `${field} IS NOT NULL`;

const createRenderer = (field, min, max) => {
  const opcExpr = `IIf(IsEmpty($feature.${field}), 0, $feature.${field}/$feature.TOTPOP_CY)`;
  return {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: [ 51,51, 204, 0.9 ],
      style: "solid",
      outline: {
        color: "white",
        width: 0
      }
    },
    visualVariables: [{
      type: "opacity",
      valueExpression: opcExpr,
      legendOptions: {title: `${field} visits per capita`},
      stops: [{ value: min, opacity: 0 },
            { value: max, opacity: 1 }]
    }]
  }
}

const createCatDataset = (lyr, field, alias, visitField='total') => {
  const where = getNotNullWhere(visitField);
  const visitSumField = `${visitField}_sum`;
  return {
    "url": lyr,
    "query": {
      "where": where,
      "groupByFieldsForStatistics": field,
      "outStatistics": [{
        "statisticType": "sum",
        "onStatisticField": visitField,
        "outStatisticFieldName": visitSumField
      }],
      "orderByFields": visitSumField + " DESC"
    },
    "mappings": {
      "x": {"field": field, "label": alias},
      "y": {"field": PERCFIELD, "label": PERCLABEL}
    }
  }
}

const catTransform = (queryResult, dataset) => {
  const features = queryResult.features;
  const visitField = dataset.query.outStatistics[0].outStatisticFieldName;
  const groupField = dataset.query.groupByFieldsForStatistics;

  const total = features.reduce( (p, f) => 
    p += f.attributes[visitField]
  , 0)

  let sumOther = 0;
  let newFeatures = [];
  for(let i = 0, len=features.length; i < len; i++){
    const f = features[i];
    const atrs = f.attributes;
    const perc = atrs[visitField] / total
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