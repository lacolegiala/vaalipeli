import { useEffect, useState } from 'react'
import './App.css'
import React from 'react'
import axios from 'axios'

function App() {
  const [score, setScore] = useState(0)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [counties, setCounties] = useState<County[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])

  async function getCandidateData() {
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
    getCandidateData();
  }, []);

  return (
    <div>
      <label htmlFor='municipalities'>Valitse kunta:</label>
      <select name='municipalities' id='municipalities'>
        {municipalities.map((municipality) => {
          return (
            <option key={municipality.id}>
              {municipality.name_fi}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default App
