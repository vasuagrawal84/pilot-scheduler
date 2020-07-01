import faker from 'faker';
import pilotsJson from './Crew.json'

import Pilot from '../models/pilot.model';

export async function pilotSeed() {
  const crew = pilotsJson.Crew;

  return await Pilot.insertMany(crew);
}

export async function deletePilotSeed() {
  try {
    return await Pilot.remove();
  } catch (e) {
    return e;
  }
}
