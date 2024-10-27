import axios from 'axios';
import { allLetters } from '@root/alphabet';

export interface Location {
  Id: number;
  Code: string;
  Value: string;
  InvariantValue: string;
  FullText: string;
  Position: number;
  MappingTypeId: number;
}

type AllLocations = Record<number, Location>;

class Client {
  private baseUrl = 'https://www.halooglasi.com';

  async getLocations(letter: string, limit = 10000): Promise<Location[]> {
    const path =
      '/Quiddita.Widgets.Ad/AdCategoryBasicSearchWidget/GetLookupValuesForAttributeCodes';
    const body = {
      q: letter,
      categoryCode: 'nekretnine',
      attributeCodes: ['grad', 'lokacija', 'mikrolokacija'],
      limit: limit,
    };
    const resp = await axios.post(this.baseUrl + path, body);
    return resp.data;
  }

  async getAllLocations(): Promise<AllLocations> {
    const allLocations: AllLocations = {};
    for (const letter of allLetters) {
      const letterLocations = await this.getLocations(letter);

      letterLocations.forEach((location: Location) => {
        if (!location.Code.includes('/')) allLocations[location.Id] = location;
      });
    }
    return allLocations;
  }

  async getAdsCount(
    locationId: number,
    from: number,
    to: number,
    pageNumber = 1,
  ) {
    const path =
      '/Quiddita.Widgets.Ad/AdCategoryBasicSearchWidgetAux/GetAdsCount';
    const body = {
      filter: {
        CategoryId: '24',
        FieldORQueries: [{ FieldName: 'CategoryIds', FieldValues: ['24'] }],
        RangeQueries: [
          {
            FieldName: 'defaultunit_cena_d',
            IncludeEmpty: false,
            From: from,
            To: to,
            UnitId: 4,
          },
          { FieldName: 'broj_soba_order_i', IncludeEmpty: false, From: null },
        ],
        MultiFieldORQueries: [
          {
            FieldName: 'grad_id_l-lokacija_id_l-mikrolokacija_id_l',
            FieldValues: [locationId],
          },
        ],
        SearchTypeIds: [],
        GetAllGeolocations: false,
        ItemsPerPage: 0,
        PageNumber: pageNumber,
        fetchBanners: false,
      },
    };

    const resp = await axios.post(this.baseUrl + path, body);
    return resp.data;
  }
}

export default Client;
