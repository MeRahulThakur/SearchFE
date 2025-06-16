import { writable } from "svelte/store";

interface ISearchParams {
  useFamilies: boolean;
  useSynonyms: boolean;
}

export const hasSearchedOnce = writable<boolean>(false);

export const searchParams = writable<ISearchParams>({
  useFamilies: false,
  useSynonyms: false,
})