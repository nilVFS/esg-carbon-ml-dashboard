const coefficients = {
  "природный газ": {
    NCV: 33.08,
    EF_CO2: 54.4,
    CH4: 0.001,
    N2O: 0.0001
  },
  "мазут": {
    NCV: 40.0,
    EF_CO2: 77.4,
    CH4: 0.002,
    N2O: 0.0002
  },
  "уголь": {
    LHV: 25.0,
    CO2: 94.6,
    CH4: 0.003,
    N2O: 0.0003
  },
  "торф": {
    LHV: 10.0,
    CO2: 105.0,
    CH4: 0.004,
    N2O: 0.0004
  }
};

export default coefficients;

