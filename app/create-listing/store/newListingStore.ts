import { create } from 'zustand'
import { AmenitiesType } from '~/app/create-listing/hooks/useAmenitiesFields'
import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'


type MetaDataProps = {
  categories: IOptionProps[];
  place_types: IOptionProps[];
  amenities: AmenitiesType;
}

interface ListingStore {
  step: number;
  data: any;
  metaData: MetaDataProps;
  currentListingData: any;
  triggerForm: Function | null;
  setTriggerForm: Function;
  setData: (data: any) => void;
  nextStep: Function;
  setStep: Function;
  previousStep: Function;
  setMetaData: Function;
  setCurrentListingData: Function;
}

export const useNewListingStore = create<ListingStore>((set, get) => {
  return {
    step: 0,
    data: {},
    metaData: {    
      categories: [],
      place_types: [],
      amenities: {regular: [], stand_out: [], safety: []},
    },
    currentListingData: {},
    triggerForm: () => {},
    setStep: (step: number) => {
      set({step: step})
    },
    setTriggerForm: (triggerForm: Function | null) => {
      set({triggerForm: triggerForm})
    },
    setData: (data: any) => {
      set({data: data})
    },
    nextStep: () => {
      if(get().step < 10) {
        set({step: get().step + 1})
      }
    },
    previousStep: () => {
      if(get().step > 0) {
        set({step: get().step - 1})
      }
    },
    setMetaData: (meta: MetaDataProps) => {
      set({metaData: meta})
    },
    setCurrentListingData: (currentListingData: any) => {
      set({currentListingData: currentListingData})
    },
  }
})



