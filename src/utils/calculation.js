export const calculateCO2Emission = (volume) => {
  const LHV = 34.0;
  const CO2_factor = 56.1;
  return volume * LHV * CO2_factor * 0.001;
};
