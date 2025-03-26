import { useEffect, useState } from 'react'
import './App.css'
import React from 'react'
import axios from 'axios'
import { Candidate, County, ElectionType, Municipality } from "./types";

function App() {
  const [score, setScore] = useState(0)
  const [countyCandidates, setCountyCandidates] = useState<Candidate[]>([])
  const [municipalityCandidates, setMunicipalityCandidates] = useState<Candidate[]>([])
  const [counties, setCounties] = useState<County[]>([])
  const [selectedCounty, setSelectedCounty] = useState<County>()
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality>()
  const [selectedType, setSelectedType] = useState<ElectionType>()

  async function getBaseData() {
    try {
      const { data: countyData } = await axios.get<County[]>('http://localhost:5002/counties')
      setCounties(countyData)
      const { data: municipalityData } = await axios.get<Municipality[]>('http://localhost:5002/municipalities')
      setMunicipalities(municipalityData)
    } catch (error) {
      console.error("Error fetching game data", error);
    }
  }

  useEffect(() => {
    getBaseData();
  }, []);

  const handleMunicipalityChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = municipalities.find((municipality) => municipality.name_fi === event.target.value)
    setSelectedMunicipality(selectedOption);
    const { data: municipalityCandidateData } = await axios.get<Candidate[]>(`http://localhost:5002/municipality/${selectedOption?.id}/candidate-data`)
    setMunicipalityCandidates(municipalityCandidateData)
  };

  const handleCountyChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = counties.find((county) => county.name_fi === event.target.value)
    setSelectedCounty(selectedOption)
    const { data: countyCandidateData } = await axios.get<Candidate[]>(`http://localhost:5002/county/${selectedOption?.id}/candidate-data`)
    setCountyCandidates(countyCandidateData)
  }

  const handleSelectElection = (type: ElectionType) => {
    setSelectedType(type)
  }

  return (
    <div>
      <div>
        <label htmlFor='selectGameType'>Valitse vaalityyppi:</label>
        <button value='county' onClick={() => handleSelectElection(ElectionType.county)}>Aluevaalit</button>
        <button value='municipality' onClick={() => handleSelectElection(ElectionType.municipality)}>Kuntavaalit</button>
      </div>
      {selectedType === ElectionType.municipality &&
        <div>
          <label htmlFor='municipalities'>Valitse kunta:</label>
          <select
            name='municipalities'
            id='municipalities'
            value={selectedMunicipality?.name_fi} 
            onChange={handleMunicipalityChange}
          >
            <option value="" disabled>-- Valitse kunta --</option>
            {municipalities.map((municipality) => {
              return (
                <option key={municipality.id}>
                  {municipality.name_fi}
                </option>
              )
            })}
          </select>
        </div>
      }
      {selectedType === ElectionType.county &&
        <div>
          <label htmlFor='counties'>Valitse alue:</label>
          <select
            name='counties'
            id='counties'
            value={selectedCounty?.name_fi} 
            onChange={handleCountyChange}
          >
            <option value="" disabled>-- Valitse alue --</option>
            {counties.map((county) => {
              return (
                <option key={county.id}>
                  {county.name_fi}
                </option>
              )
            })}
          </select>
        </div>
      }
    </div>
  )
}

export default App
