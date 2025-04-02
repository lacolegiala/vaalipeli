import { useEffect, useState } from 'react';
import '../App.css';
import React from 'react';
import axios from 'axios';
import { Candidate, County, ElectionType, Municipality } from '../types';
import { useNavigate } from 'react-router-dom';

type HomeProps = {
  setCandidates: (candidates: Candidate[]) => void;
};

const Home: React.FC<HomeProps> = ({ setCandidates }) => {
  const [counties, setCounties] = useState<County[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedType, setSelectedType] = useState<ElectionType>();

  const navigate = useNavigate();

  useEffect(() => {
    async function getBaseData() {
      try {
        const { data: countyData } = await axios.get<County[]>('https://vaalipeli-backend.onrender.com/counties');
        setCounties(countyData);
        const { data: municipalityData } = await axios.get<Municipality[]>('https://vaalipeli-backend.onrender.com/municipalities');
        setMunicipalities(municipalityData);
      } catch (error) {
        console.error("Error fetching game data", error);
      }
    }
    getBaseData();
  }, []);

  const handleMunicipalityChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = municipalities.find(m => m.name_fi === event.target.value);
    if (!selectedOption) return;
    
    const { data: candidates } = await axios.get<Candidate[]>(`https://vaalipeli-backend.onrender.com/municipality/${selectedOption.id}/candidate-data`);
    setCandidates(candidates);
  };

  const handleCountyChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = counties.find(c => c.name_fi === event.target.value);
    if (!selectedOption) return;
    
    const { data: candidates } = await axios.get<Candidate[]>(`https://vaalipeli-backend.onrender.com/county/${selectedOption.id}/candidate-data`);
    setCandidates(candidates);
  };

  const handleStartGame = () => {
    navigate('/play');
  };

  return (
    <div>
      <div>
        <h1>Tervetuloa vaalipeliin!</h1>
        <h2>Valitse vaalityyppi:</h2>
        <button onClick={() => setSelectedType(ElectionType.county)}>Aluevaalit</button>
        <button onClick={() => setSelectedType(ElectionType.municipality)}>Kuntavaalit</button>
      </div>

      {selectedType === ElectionType.municipality && (
        <div className='Selector'>
          <label>Valitse kunta:</label>
          <select onChange={handleMunicipalityChange}>
            <option value="" disabled>-- Valitse kunta --</option>
            {municipalities.map(m => (
              <option key={m.id} value={m.name_fi}>{m.name_fi}</option>
            ))}
          </select>
        </div>
      )}

      {selectedType === ElectionType.county && (
        <div className='Selector'>
          <label>Valitse alue:</label>
          <select onChange={handleCountyChange}>
            <option value="" disabled>-- Valitse alue --</option>
            {counties.map(c => (
              <option key={c.id} value={c.name_fi}>{c.name_fi}</option>
            ))}
          </select>
        </div>
      )}
      {(selectedType === 0 || selectedType === 1) && <button onClick={handleStartGame}>Aloita peli</button>}
    </div>
  );
};

export default Home;
