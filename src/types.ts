type Candidate = {
  id: number,
  first_name: string,
  last_name: string,
  image: string,
  party_id: number,
  info: Info
}

type Info = {
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

type Municipality = {
  id: string,
  name_fi: string,
  name_sv: string,
  municipality_id: string,
  county_id: string
}

type County = {
  id: number,
  name_fi: string,
  name_sv: string
}

type Party = {
  id: number,
  name_fi: string,
  color: string
}

enum ElectionType {
  municipality,
  county
}