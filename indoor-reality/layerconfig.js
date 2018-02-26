// Configure opacity range of scene layers
// and whether or not each layer can be filtered by floor
const layerConfig = {
  "Ceilings": {
    opcRange: [350, 175],
    hasFloorAtr: true
  },
  "Windows": {
    opcRange: [750, 350],
    hasFloorAtr: false,
  },
  "Outdoor Walls":{
    opcRange: [750, 350],
    hasFloorAtr: false
  },
  "Roof": {
    opcRange: [750, 350],
    hasFloorAtr: false
  },
  "Doors": {
    opcRange: [175, -50],
    hasFloorAtr: true
  },
  "Floors": {
    opcRange: [175, -100],
    hasFloorAtr: true
  },
  "Indoor Walls": {
    opcRange: [175, -75],
    hasFloorAtr: true
  },
  "Poses": {
      hasFloorAtr: true
  }
}