const CONST = {
  blockLyrUrl: "https://services.arcgis.com/q7zPNeKmTWeh7Aor/arcgis/rest/services/Join%20Features%20to%20SG%20CBG-POI%20Visit%20Counts_20180321_1/FeatureServer/0",
  poiLyrId: "9b594f846c20472eb7d5e930e826d961",
  basemap: "gray-vector",
  visitField: "num_visits",
  popField: "TOTPOP_CY",
  poiField: "safegraph_",
  adrField: "full_addre",
  defaultPoi: "f1b5d7bb7becd9d059edaeb31072879b9902c306b01b56c2212b47f3b49af779",
  poiOpcRange: [0, 0.005],
  chartOverride: {
    "marks": [
      {"properties": 
        {
          "hover": {"fill": {"value": "#005e95"}},
          "update": {"fill": {"value": "#9081bc"}}
        }
      }
    ]
  },
  poiRenderer: {
    type: "simple",
    symbol: {
      type: "simple-marker",
      size: 6,
      color: "#ab3c16",
      outline: {
        width: 1,
        color: "white"
      }
    }
  },
  percentField: 'perc',
  percentLabel: 'Fraction'
}

const utils = {
  getStrIsExp: (field, value) => `${field} = '${value}'`,
  getPoiExp: poi => utils.getStrIsExp(CONST.poiField, poi),
  getPoiCatExp: (poi, field, category) => {
    let poiExp = poi ? utils.getPoiExp(poi) : '';
    let dataExp = (field && category) ? utils.getStrIsExp(field, category) : '';
    return (poiExp && dataExp) ? `${poiExp} AND ${dataExp}` : poiExp + dataExp;
  },
  createRenderer: ([min, max]) => {
    return {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "#005e95",
        style: "solid",
        outline: {
          color: "white",
          width: 0.5
        }
      },
      visualVariables: [{
        type: "opacity",
        field: `${CONST.visitField}`,
        normalizationField: `${CONST.popField}`,
        legendOptions: {title: 'visits per capita'},
        stops: [{ value: min, opacity: 0 },
              { value: max, opacity: 1 }]
      }]
    }
  },
  createCatDataset: (poi, field, alias) => {
    const where = utils.getPoiExp(poi);
    const visitSumField = "sum";
    return {
      url: CONST.blockLyrUrl,
      query: {
        where: where,
        groupByFieldsForStatistics: field,
        outStatistics: [{
          statisticType: "count",
          onStatisticField: CONST.visitField,
          outStatisticFieldName: visitSumField
        }],
        orderByFields: visitSumField + " DESC"
      },
      mappings: {
        x: {field: field, label: alias},
        y: {field: CONST.percentField, label: CONST.percentLabel}
      }
    }
  },
  catTransform: (queryResult, dataset) => {
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
        atrs[CONST.percentField] = perc.toFixed(2);
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
      attr[CONST.percentField] = sumOther.toFixed(2);
      newFeatures.push({attributes: attr})
    }
  
    queryResult.features = newFeatures;
  
    return queryResult;
  }
}

