import { Candidate, GameData, Round } from "../types";

export function generateGameData(candidates: Candidate[]): GameData {
    if (candidates.length === 0) throw new Error("Candidate array cannot be empty");

    const shuffled = candidates.sort(() => 0.5 - Math.random())
  
    const selectedCandidates: Candidate[] = [];
    while (selectedCandidates.length < 20) {
      selectedCandidates.push(...shuffled);
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