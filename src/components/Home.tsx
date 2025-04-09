import { useEffect, useState } from 'react';
import '../App.css';
import React from 'react';
import axios from 'axios';
import { Candidate, CandidateWithParty, County, ElectionType, Municipality, Party } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';

type HomeProps = {
  setCandidates: (candidates: CandidateWithParty[]) => void;
};

const Home: React.FC<HomeProps> = ({ setCandidates }) => {
  const [counties, setCounties] = useState<County[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedType, setSelectedType] = useState<ElectionType>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false)
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.clear();
    setCandidates([]);
  }, [location.pathname]);

  useEffect(() => {
    async function getBaseData() {
      setIsLoading(true);
      try {
        const { data: countyData } = await axios.get<County[]>('https://vaalipeli-backend.onrender.com/counties');
        setCounties(countyData);
        const { data: municipalityData } = await axios.get<Municipality[]>('https://vaalipeli-backend.onrender.com/municipalities');
        setMunicipalities(municipalityData);
      } catch (error) {
        console.error("Error fetching game data", error);
      }
      setIsLoading(false);
    }
    getBaseData();
  }, []);

  const handleMunicipalityChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = municipalities.find(m => m.name_fi === event.target.value);
    if (!selectedOption) return;
    setIsSelected(true);
    setSelectedAreaName(selectedOption.name_fi);
  
    const [{ data: parties }, { data: candidates }] = await Promise.all([
      axios.get<Party[]>(`https://vaalipeli-backend.onrender.com/municipality/${selectedOption.id}/parties`),
      axios.get<Candidate[]>(`https://vaalipeli-backend.onrender.com/municipality/${selectedOption.id}/candidate-data`)
    ]);

    const partyMap = Object.fromEntries(
      parties.map(p => [p.id, { name: p.short_name_fi, color: p.color }])
    );
    
    const enrichedCandidates = candidates.map(candidate => ({
      ...candidate,
      party_name: partyMap[candidate.party_id]?.name || "Tuntematon puolue",
      party_color: partyMap[candidate.party_id]?.color || "#ccc"
    }));

    setCandidates(enrichedCandidates);
  };

  const handleCountyChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = counties.find(c => c.name_fi === event.target.value);
    if (!selectedOption) return;
    setIsSelected(true)
    setSelectedAreaName(selectedOption.name_fi);
    
    const [{ data: parties }, { data: candidates }] = await Promise.all([
      axios.get<Party[]>(`https://vaalipeli-backend.onrender.com/county/${selectedOption.id}/parties`),
      axios.get<Candidate[]>(`https://vaalipeli-backend.onrender.com/county/${selectedOption.id}/candidate-data`)
    ]);

    const partyMap = Object.fromEntries(
      parties.map(p => [p.id, { name: p.short_name_fi, color: p.color }])
    );
    
    const enrichedCandidates = candidates.map(candidate => ({
      ...candidate,
      party_name: partyMap[candidate.party_id]?.name || "Tuntematon puolue",
      party_color: partyMap[candidate.party_id]?.color || "#ccc"
    }));

    setCandidates(enrichedCandidates);
  };

  const handleStartGame = () => {
    if (selectedAreaName) {
      localStorage.setItem("selectedAreaName", selectedAreaName);
    }
    navigate('/play');
  };

  return (
    <div>
      <h1 className="home-title">✨ Vaalipeli ✨</h1>
      <div className="info-box">
        <p>
          🎯 <strong>Vaalipeli</strong> on tietovisa, jossa yrität yhdistää vaalilupauksen oikeaan ehdokkaaseen alueeltasi. 
          Valitse ensin vaalityyppi ja oma alueesi — sitten alkaa peli!
        </p>
      </div>
      <h2 className="subtitle">Valitse vaalityyppi:</h2>
      
      <div className="button-group">
        <button className="button" onClick={() => setSelectedType(ElectionType.county)}>Aluevaalit</button>
        <button className="button" onClick={() => setSelectedType(ElectionType.municipality)}>Kuntavaalit</button>
      </div>

      {isLoading && selectedType && <div className="spinner">🔄 Ladataan...</div>}

      {!isLoading && selectedType === ElectionType.municipality && (
        <div className="selector">
          <select className="dropdown" onChange={handleMunicipalityChange}>
            <option value="" disabled selected>-- Valitse kunta --</option>
            {municipalities.map(m => (
              <option key={m.id} value={m.name_fi}>{m.name_fi}</option>
            ))}
          </select>
        </div>
      )}

      {!isLoading && selectedType === ElectionType.county && (
        <div className="selector">
          <select className="dropdown" onChange={handleCountyChange}>
            <option value="" disabled selected>-- Valitse alue --</option>
            {counties.map(c => (
              <option key={c.id} value={c.name_fi}>{c.name_fi}</option>
            ))}
          </select>
        </div>
      )}

      {(!isLoading && selectedType !== undefined) && (
        <button disabled={!isSelected} className="start-button" onClick={handleStartGame}>Aloita peli</button>
      )}
    </div>
  );
};

export default Home;
