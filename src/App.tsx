import { useEffect, useState } from 'react'
import './App.css'
import React from 'react'
import axios from 'axios'
import { Candidate, County, ElectionType, GameData, Municipality, Round } from "./types";
import GameView from './GameView';

function App() {
  const [score, setScore] = useState(0)
  const [countyCandidates, setCountyCandidates] = useState<Candidate[]>([])
  const [municipalityCandidates, setMunicipalityCandidates] = useState<Candidate[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [counties, setCounties] = useState<County[]>([])
  const [selectedCounty, setSelectedCounty] = useState<County>()
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality>()
  const [selectedType, setSelectedType] = useState<ElectionType>()
  const [gameData, setGameData] = useState<GameData>()
  const [round, setRound] = useState(1)

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

  useEffect(() => {
    if (candidates.length > 0) {
      setGameData(generateGameData(candidates))
    }
  }, [candidates]);

  function generateGameData(candidates: Candidate[]): GameData {
    if (candidates.length === 0) throw new Error("Candidate array cannot be empty");
  
    const selectedCandidates: Candidate[] = [];
    while (selectedCandidates.length < 20) {
      selectedCandidates.push(...candidates);
    }
    const gameCandidates = selectedCandidates.slice(0, 20);
  
    const rounds: Round[] = [];
  
    for (let i = 0; i < 10; i++) {
      const candidate1 = gameCandidates[i * 2];
      const candidate2 = gameCandidates[i * 2 + 1];
  
      const correctCandidate = Math.random() < 0.5 ? candidate1 : candidate2;
  
      const promises = [
        correctCandidate.info.election_promise_1,
        correctCandidate.info.election_promise_2,
        correctCandidate.info.election_promise_3
      ].filter(p => p !== undefined)

      const selectedPromise = promises.length > 0 ? promises[Math.floor(Math.random() * promises.length)] : null;

      const finalPromise = selectedPromise?.fi || selectedPromise?.se || "Ei vaalilupausta :O";
  
      rounds.push({
        candidates: [candidate1, candidate2],
        correctCandidateId: correctCandidate.id,
        promise: finalPromise
      });
    }
  
    return {
      rounds
    }
  }

  const handleMunicipalityChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = municipalities.find((municipality) => municipality.name_fi === event.target.value)
    setSelectedMunicipality(selectedOption);
    const { data: municipalityCandidateData } = await axios.get<Candidate[]>(`http://localhost:5002/municipality/${selectedOption?.id}/candidate-data`)
    setCandidates(municipalityCandidateData)
  };

  const handleCountyChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = counties.find((county) => county.name_fi === event.target.value)
    setSelectedCounty(selectedOption)
    const { data: countyCandidateData } = await axios.get<Candidate[]>(`http://localhost:5002/county/${selectedOption?.id}/candidate-data`)
    setCandidates(countyCandidateData)
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
      {candidates.length > 0 && gameData &&
        <GameView gameData={gameData} />
      }
    </div>
  )
}

export default App
