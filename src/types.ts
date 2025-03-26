export type Candidate = {
  id: number,
  first_name: string,
  last_name: string,
  image: string,
  party_id: number,
  info: Info
}

export type Info = {
  age: number,
  county_fix: {
    fi: string
  },
  election_promise_1: {
    fi: string
  },
  election_promise_2: {
    fi: string
  },
  election_promise_3: {
    fi: string
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
  color: string
}

export enum ElectionType {
  municipality,
  county
}