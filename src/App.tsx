import { useEffect, useState } from 'react'
import './App.css'
import React from 'react'
import axios from 'axios'

function App() {
  const [score, setScore] = useState(0)
  const [countyCandidates, setCountyCandidates] = useState<Candidate[]>([])
  const [municipalityCandidates, setMunicipalityCandidates] = useState<Candidate[]>([])
  const [counties, setCounties] = useState<County[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality>()
  const [selectedType, setSelectedType] = useState<ElectionType | null>(null)

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

  const handleSelectElection = (type: ElectionType) => {
    setSelectedType(type)
  }

  return (
    <div>
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
              <option onClick={() => console.log(municipality.name_fi)} key={municipality.municipality_id}>
                {municipality.name_fi}
              </option>
            )
          })}
        </select>
      </div>
      <div>
        <label htmlFor='selectGameType'>Valitse vaalityyppi:</label>
        <button value='county' onClick={() => handleSelectElection(ElectionType.county)}>Aluevaalit</button>
        <button value='municipality' onClick={() => handleSelectElection(ElectionType.municipality)}>Kuntavaalit</button>
      </div>
    </div>
  )
}

export default App
