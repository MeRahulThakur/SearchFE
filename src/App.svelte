<script lang="ts">
  import LandingPage from './LandingPage.svelte';
  import ResultsPage from './ResultsPage.svelte';
  import { writable } from 'svelte/store';
  import { hasSearchedOnce } from './store/state';

  const route = writable<'home' | 'results'>('home');
  const searchQuery = writable<string>('');
  const isLoading = writable<boolean>(false);
  const results = writable<{ title: string; description: string }[]>([]);
  const error = writable<string | null>(null);

  async function handleSearch(query: string, useSynonyms: boolean, useFamilies: boolean) {
    console.log('handleSearch useSynonyms-',useSynonyms)
    console.log('handleSearch useFamilies-',useFamilies)
    isLoading.set(true);
    searchQuery.set(query);
    results.set([]);
    error.set(null);

    try {
      // Simulate async fetch
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate mock results for the new query
      results.set([
        {
          title: 'Result 1',
          description: `This is a short description about result 1 for "${query}".`
        },
        {
          title: 'Result 2',
          description: `This is some relevant info about result 2 matching "${query}".`
        },
        {
          title: 'Result 3',
          description: `More details about result 3 that are related to "${query}".`
        }
      ]);
    } catch (e) {
      error.set('Failed to fetch results.');
    } finally {
      isLoading.set(false);
      route.set('results');
    }
  }
</script>

{#if $route === 'home'}
  <LandingPage value={$searchQuery} isLoading={$isLoading} onSearch={handleSearch} />
{:else if $route === 'results'}
  <ResultsPage
    committedQuery={$searchQuery}
    isLoading={$isLoading}
    results={$results}
    error={$error}
    onBack={() => route.set('home')}
    onSearch={handleSearch}
  />
{/if}
