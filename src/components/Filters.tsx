import React, { type ChangeEvent } from "react";

interface FiltersProps {
  selectedRegion: string;
  selectedPopulation: string;
  onRegionChange: (region: string) => void;
  onPopulationChange: (population: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedRegion,
  selectedPopulation,
  onRegionChange,
  onPopulationChange,
}) => {
  const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];
  const populations = [
    { label: "All", value: "all" },
    { label: "< 10M", value: "small" },
    { label: "10M - 50M", value: "medium" },
    { label: "> 50M", value: "large" },
  ];

  const handleRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onRegionChange(e.target.value);
  };

  const handlePopulationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onPopulationChange(e.target.value);
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label>Region:</label>
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="filter-select"
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Population:</label>
        <select
          value={selectedPopulation}
          onChange={handlePopulationChange}
          className="filter-select"
        >
          {populations.map((pop) => (
            <option key={pop.value} value={pop.value}>
              {pop.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
