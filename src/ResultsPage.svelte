<script lang="ts">
  import Button from "./components/Button.svelte";
  import Header from "./components/Header.svelte";
  import SearchBox from "./components/SearchBox.svelte";
  import Sidebar from "./components/Sidebar.svelte";
    import { highlight } from "./helper";

  interface IResultsPage {
    committedQuery: string;
    isLoading: boolean;
    results: { title: string; description: string }[];
    error: string | null;
    onBack: () => void;
    onSearch: (query: string, useSynonyms: boolean, useFamilies: boolean) => void;
  }

  let {committedQuery="",isLoading=false,results=[], error= null, onBack, onSearch}: IResultsPage = $props();

  let localQuery = $state(committedQuery);

  let sidebarOpen = $state(false);
  let sidebarLoading = $state(false);
  let sidebarContent: {
    title: string;
    description: string;
    details?: string;
  } | null = $state(null);


  async function openSidebarWith(result: {
    title: string;
    description: string;
  }) {
    sidebarOpen = true;
    sidebarLoading = true;
    sidebarContent = { title: result.title, description: result.description };

    try {
      // const response = await fetch("/api/details", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     query: committedQuery,
      //     description: result.description,
      //   }),
      // });

      // if (!response.ok) throw new Error("Failed to fetch details");

      // const data = await response.json();
      //Mocking api
      await new Promise(r => setTimeout(r, 1000));
      const data = { details: `Detailed explanation about: ${result.title}` };

      sidebarContent = {
        ...result,
        details: data.details || "No details provided.",
      };
    } catch (e) {
      sidebarContent = {
        ...result,
        details: "Failed to load details. Please try again.",
      };
    } finally {
      sidebarLoading = false;
    }
  }

  function closeSidebar() {
    sidebarOpen = false;
    sidebarContent = null;
  }
</script>

<Header title="Better Search">
  <SearchBox bind:value={localQuery} {isLoading} onSearch={onSearch} />
  <!-- <Button onClick={onBack} ariaLabel="Go back to search">Back</Button> -->
</Header>

<main class="results-container">
  <h2>Results for "{committedQuery}"</h2>

  {#if error}
    <p class="error-message" role="alert">{error}</p>
  {:else if isLoading}
    {#each Array(3) as _, i}
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton-title"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    {/each}
  {:else if results.length === 0}
    <p class="no-results" role="alert">
      No results found for "{committedQuery}".
    </p>
  {:else}
    {#each results as result}
      <div
        class="result"
        role="button"
        tabindex="0"
        onclick={() => openSidebarWith(result)}
        onkeydown={(e) => e.key === "Enter" && openSidebarWith(result)}
        aria-label={`View details for ${result.title}`}
      >
        <h3>{result.title}</h3>
        <!-- <p>{result.description}</p> -->
        <p>{@html highlight(result.description, committedQuery)}</p>
      </div>
    {/each}
  {/if}
</main>

<Sidebar open={sidebarOpen} onClose={closeSidebar}>
  {#if sidebarLoading}
    <!-- Skeleton while loading -->
    <div class="sidebar-skeleton">
      <div class="skeleton-title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
    <br>
    <div class="sidebar-skeleton">
      <div class="skeleton-title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
    <br>
    <div class="sidebar-skeleton">
      <div class="skeleton-title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  {:else if sidebarContent}
    <h2>{sidebarContent.title}</h2>
    <p>{@html highlight(sidebarContent.description, committedQuery)}</p>
    <hr />
    <p>{sidebarContent.details}</p>
  {/if}
</Sidebar>

<style>
  .results-container {
    padding: 0.5rem 1.2rem;
  }
  .result {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.9rem;
    transition: transform 0.2s ease;
  }
  .result:hover {
    transform: scale(1.01);
  }
  h2 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 0.9rem;
    color: #444;
  }
  .skeleton-card {
    background: #eee;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    animation: fadein 0.3s ease-in;
  }
  .skeleton-title {
    width: 60%;
    height: 16px;
    background: #ddd;
    margin-bottom: 0.5rem;
    border-radius: 4px;
  }
  .skeleton-line {
    height: 12px;
    background: #ddd;
    margin-bottom: 0.3rem;
    border-radius: 4px;
  }
  .skeleton-line.short {
    width: 80%;
  }
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .error-message {
    color: #b00020;
    font-weight: 600;
    margin: 1rem 0;
    background: #ffe5e5;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    max-width: 600px;
    text-align: center;
  }

  .no-results {
    font-style: italic;
    color: #555;
    margin: 1rem 0;
  }
</style>
