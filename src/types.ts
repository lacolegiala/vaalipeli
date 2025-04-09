export type Candidate = {
  id: number,
  first_name: string,
  last_name: string,
  image: string,
  party_id: number,
  info: Info
}

export type CandidateWithParty = {
  id: number,
  first_name: string,
  last_name: string,
  image: string,
  party_id: number,
  party_name: string,
  info: Info
}

export type Info = {
  age: number,
  county_fix: {
    fi: string | null,
    se: string | null
  },
  election_promise_1: {
    fi: string | null | undefined,
    se: string | null | undefined
  },
  election_promise_2: {
    fi: string | null | undefined,
    se: string | null | undefined
  },
  election_promise_3: {
    fi: string | null | undefined,
    se: string | null | undefined
  }
}

export type Municipality = {
  id: string,
  name_fi: string,
  name_sv: string
}

export type County = {
  id: number,
  name_fi: string,
  name_sv: string
}

export type Party = {
  id: number,
  name_fi: string,
  short_name_fi: string,
  color: string
}

export enum ElectionType {
  municipality,
  county
}

export type Round = {
  candidates: CandidateWithParty[],
  correctCandidateId: number,
  promise?: string | null
}

export type GameData = {
  rounds: Round[],
  countyOrMunicipality: string
}