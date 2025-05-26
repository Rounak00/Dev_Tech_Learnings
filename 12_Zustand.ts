/* eslint-disable @typescript-eslint/no-unused-vars -- we need this for TS reference */
import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand'
import {
  combine,
  createJSONStorage,
  devtools,
  persist,
} from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createPageSlice, PageSlice } from '@/entities/page/model/store'
import { version } from '@/package.json'
import { createFlightSlice, FlightSlice } from '@/entities/flight/model/store'
import { createLoginSlice, LoginSlice } from '@/entities/login/model/store'

type Slices = PageSlice & FlightSlice & LoginSlice

export type Slice<T> = StateCreator<
  Slices,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  T
>

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use as Record<string, () => void>)[k] = () =>
      store((s) => s[k as keyof typeof s])
  }

  return store
}

const useStoreBase = create(
  devtools(
    persist(
      immer<Slices>((...props) => ({
        ...createPageSlice(...props),
        ...createFlightSlice(...props),
        ...createLoginSlice(...props)

      })),
      {
        name: 'web-app-store',
        storage: createJSONStorage(() => sessionStorage),
        version: Number(version),
      },
    ),
  ),
)

export const useStore = createSelectors(useStoreBase)

export type Store = ReturnType<(typeof useStore)['getState']>



-------------------------------------------------------------------------
import { Slice } from '@/app/_store'
import { PageState } from './types'

type PageActions = {
  setTheme: (theme : string) => void
}

export type PageSlice = PageState & PageActions

export const createPageSlice: Slice<PageSlice> = (set) => ({
  theme: '',
  setTheme: (theme) =>
    set((state : PageSlice) => ({
      ...state,
      theme: theme,
    }))
})
----------------------------------------------------------------------------
import { Slice } from '@/app/_store'
import { FlightFilters, FlightState, SortType } from './types'
import { defaultFareDescrition } from '../config/constants';
import { applyFilters, generateFilterData, generateFlightKey, mergeFaresByPriceType, sortFlights } from '../config/service';

type FlightActions = {
    setSearch: (data: Record<string, any> | null) => void,
    setCentrifugeToken: (data: Record<string, any> | null) => void,
    setFareDescription: (priceType: string, description: string | undefined) => void;
    addOrMergeFlight: (flight: any) => void;
    setFilters: (index: number, newFilters: Partial<FlightFilters>) => void;
    setSort: (type: SortType, order: 'ASC' | 'DESC') => void;
    applyFilterAndSort: () => void;
    selectFlight: (flight: any) => void;

}

export type FlightSlice = FlightState & FlightActions

export const createFlightSlice: Slice<FlightSlice> = (set, get) => ({
    search: {
        "currency": "INR",
        "sectors": [
            {
                "originDetails": {
                    "code": "DEL",
                    "city": "Indira Gandhi International Airport, IN (DEL)"
                },
                "destinationDetails": {
                    "code": "DXB",
                    "city": "Dubai, AE (DXB)"
                },
                "journeyReturnDate": "05/30/2025",
                "journeyStartDate": "05/30/2025"
            }

        ],
        "fareType": "student, seniorCitizen, regular",
        "destinationDetails": {
            "code": "DXB",
            "city": "Dubai, AE (DXB)"
        },
        "domestic": false,
        "guestNationality": "indian",
        "startDate": "05/30/2025",
        "returnDate": "05/30/2025",
        "noOfAdults": 1,
        "noOfChild": 0,
        "noOfInfants": 0,
        "originDetails": {
            "code": "DEL",
            "city": "Indira Gandhi International Airport, IN (DEL)"
        },
        "userId": 135,
        "roundTrip": false,
        "serviceClass": "ECONOMY",
        "dType": "SOTO",
        "isAffiliatePromocode": false
    },
    centrifugeToken: '',
    fareDescription: defaultFareDescrition,
    allFlights: [],
    filteredFlights: [],
    filterData: {},
    filters: {},
    sort: { type: 'price', order: 'ASC' },
    selectedFlight: null,
    formTravellers:[],
    setFormTravellers: (travellers)=>set({ formTravellers: travellers }),
    formGst:{
        companyName: "",
        email: "",
        gstNumber: "",
        phone: ""
    },
    setFormGst: (gstDetails:Record<string, string>)=>set({ formGst: gstDetails }),
    formAffiliate:{
        affiliate_phone_code: "+91",
        affiliate_phone: "",
        affiliate_email: "",
    },
    setFormAffiliate: (affiliateDetails:Record<string, string>)=>set({ formAffiliate: affiliateDetails }),
    bookingResponse:null,
    setBookingResponse : (bookingResponse:Record<string, any>)=>set({ bookingResponse: bookingResponse }),
    bookingStatusResponse:null,
    setBookingStatusResponse : (bookingStatusResponse:Record<string, any>|null)=>set({ bookingStatusResponse: bookingStatusResponse }),
    selectedFareUfid: null,
    ufidFlightKeystore: {},
    setSearch: (data) =>
        set((state: FlightSlice) => ({
            ...state,
            search: data,
        })),
    setCentrifugeToken: (data) =>
        set((state: FlightSlice) => ({
            ...state,
            centrifugeToken: data,
        })),
    setFareDescription: (priceType, description) =>
        set((state) => ({
            fareDescription: {
                ...state.fareDescription,
                [priceType]: description,
            },
        })),
    addOrMergeFlight: (incomingFlight) => {
        // const key = generateFlightKey(incomingFlight);
        // const existing = get().allFlights.find(f => generateFlightKey(f) === key);

        // let updatedFlights;
        // if (existing) {
        //     updatedFlights = get().allFlights.map(f =>
        //         generateFlightKey(f) === key
        //             ? { ...f, fares: mergeFaresByPriceType(f.fares, incomingFlight.fares) }
        //             : f
        //     );
        // } else {
            // }
        let updatedFlights = [...get().allFlights, incomingFlight];
        let filterData = generateFilterData(updatedFlights)
        set({ allFlights: updatedFlights, filterData });
        get().applyFilterAndSort(); // always keep filteredFlights updated
    },

    setSort: (type, order) => {
        set({ sort: { type, order } });
        get().applyFilterAndSort();
    },

    applyFilterAndSort: () => {
        console.log('allFlights: ', get().allFlights);
        
        const { allFlights, filters, sort } = get();
        let filtered: any[] = [];
        if (filters && Object.keys(filters).length > 0) {
            for (let i = 0; i < Object.keys(filters).length; i++) {
            const directionFlights = allFlights.filter(f => {
                if (i === 0) return f.direction === 'OUTBOUND';
                if (i === 1) return f.direction === 'INBOUND';
                if (i === 2) return f.direction === 'SPECIALROUNDTRIP';
                return false;
            });

            const filteredDirection = applyFilters(directionFlights, filters[i]);
            filtered.push(...filteredDirection);
            }
        } else {
            filtered = [...allFlights];
        }
        // const filtered = applyFilters(allFlights, filters);
        const sorted = sortFlights(filtered, sort.type, sort.order);
        console.log('Filtered and Sorted Flights: ',sorted)
        set({ filteredFlights: sorted });
    },

    selectFlight: (flight) => set({ selectedFlight: flight }),
    selectFareUfid: (ufid:string) => {
        set({ selectedFareUfid: ufid })
    },
    createUfidFlightKeystore:(data:any)=>{

        const newUfidFareData:Record<string,string> = {}
        if(data.fares){
            data.fares.forEach((fare:any)=>{
                newUfidFareData[fare.fareSupplierInfo.ufid] = data
            })
            set({ ufidFlightKeystore: {...get().ufidFlightKeystore, ...newUfidFareData} });
        }
        console.log("------ssssss----------",get().ufidFlightKeystore)


    },


    resetAllFlights: () => set({ allFlights: [], filteredFlights: [], filters: {}, filterData: {}, ufidFlightKeystore: {}, selectedFareUfid:null, formTravellers: []}),
    setFilters: (index, newFilters) => {
        set((state) => {
            const existingFilters = state?.filters?.[index] || {}; // fallback to empty object
            const updatedFilters = {
                ...state.filters,
                [index]: {
                    ...existingFilters,
                    ...newFilters,
                },
            };

            setTimeout(() => {
                get().applyFilterAndSort();
            }, 0);

            return { filters: updatedFilters };
        });
    }
    ,
    clearFilters: (index) =>
        set((state) => ({
            filters: {
                ...state.filters,
                [index]: {
                    airline: [],
                    layover: [],
                    stops: [],
                    price: { min: 0, max: Infinity },
                    timeRange: [],
                },
            },
        })),

})

