import React, { useState, useEffect } from 'react';

const RDSpecCapabilityMeans = ({parameters}) => {
  const [trizData, setTrizData] = useState(null);

  useEffect(() => {
    fetch('/triz.json')
      .then(response => response.json())
      .then(data => setTrizData(data))
      .catch(error => console.error('Error loading TRIZ data:', error));
  }, []);

  if (!trizData) {
    return <div>Loading...</div>;
  }

  // Sử dụng parameters để lọc dữ liệu nếu cần
  const rdParam = parameters && parameters.name 
    ? trizData.parameters.find(p => p.name === parameters.name)
    : trizData.parameters.find(p => p.name === "R&D Spec/Capability/Means");
  
  const getInventivePrinciple = (number) => {
    return trizData.inventive_principles.find(p => p.number === number);
  };

  return (
    <div className="rd-spec-capability-means">
      <h2>{rdParam.name}</h2>
      <p>{rdParam.description}</p>
      
      <h3>Synonyms</h3>
      <ul>
        {rdParam.synonyms.map((synonym, index) => (
          <li key={index}>{synonym}</li>
        ))}
      </ul>

      <h3>Always Consider Principles</h3>
      <ul>
        {rdParam.always_consider_principles.map(number => {
          const principle = getInventivePrinciple(number);
          return (
            <li key={number}>
              {principle.number}. {principle.name} - {principle.description}
            </li>
          );
        })}
      </ul>

      <h3>Averaged Principles</h3>
      <ul>
        {rdParam.averaged_principles.map(number => {
          const principle = getInventivePrinciple(number);
          return (
            <li key={number}>
              {principle.number}. {principle.name}
            </li>
          );
        })}
      </ul>

      <h3>Conflicting Parameters</h3>
      {Object.entries(rdParam.conflicting_principles).map(([param, principles]) => (
        <div key={param}>
          <h4>{param}</h4>
          <ul>
            {principles.map(number => {
              const principle = getInventivePrinciple(number);
              return (
                <li key={number}>
                  {principle.number}. {principle.name}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RDSpecCapabilityMeans;
