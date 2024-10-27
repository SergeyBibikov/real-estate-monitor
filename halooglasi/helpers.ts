import HalooglasiClient from './Client';
import { Location } from './Client';
import * as fs from 'node:fs';

async function getAllCounts(from: number, to: number) {
  const allLocations = readLocations('halooglasi.json');
  for (const location of allLocations) {
    const count = await new HalooglasiClient().getAdsCount(
      location.Id,
      from,
      to,
    );
    if (count > 0)
      console.log(`Место: ${location.Code}, кол-во объявлений ${count}`);
  }
}
function dumpLocations(fileName: string, object: any) {
  fs.writeFileSync(fileName, JSON.stringify(object));
}

function readLocations(fileName: string): Location[] {
  return Object.values(JSON.parse(String(fs.readFileSync(fileName))));
}
