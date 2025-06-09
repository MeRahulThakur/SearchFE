<script lang="ts">
  import { onMount } from "svelte";

  interface ISearchBox {
    isLoading: boolean;
    value: string;
    onSearch: (query: string, useSynonyms:boolean, useFamilies:boolean) => void;
  }
  let { value = $bindable(""), isLoading = false, onSearch} : ISearchBox = $props();

  let useSynonyms = $state<boolean>(false);
  let useFamilies = $state<boolean>(false);
  // let prevSynonyms:boolean;
  // let prevFamilies:boolean;
  
  const searchDeps = $derived(() => [useSynonyms, useFamilies] as const);
  let prevDeps: readonly [boolean, boolean] = [false, false];

  let inputRef: HTMLTextAreaElement;
  let containerRef: HTMLDivElement;
  let showSuggestions = $state(false);

  let recentSearches: { term: string; timestamp: number }[] = $state([]);

  const STORAGE_KEY = "recentSearches";
  const MAX_HISTORY = 5;
  const MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

  function triggerSearch(term = value.trim()) {
    if (!isLoading && term) {
      onSearch(term, useSynonyms, useFamilies)
      addRecentSearch(term);
      showSuggestions = false;
    }
  }

  function onFocusInput() {
    if (recentSearches.length > 0) {
      showSuggestions = true;
    }
  }

  function updateFilteredSuggestions() {
    recentSearches = recentSearches.filter((s) =>
      s.term.toLowerCase().includes(value.trim().toLowerCase()),
    );
  }

  function clearInput() {
    value = "";
    inputRef.focus();
    updateFilteredSuggestions();
    showSuggestions = recentSearches.length > 0;
  }

  function adjustTextareaHeight() {
    if (inputRef) {
      inputRef.style.height = "auto"; // Reset height first
      const maxHeight =
        parseInt(getComputedStyle(inputRef).lineHeight || "20") * 10;
      inputRef.style.height = Math.min(inputRef.scrollHeight, maxHeight) + "px";
    }
  }

  function handlePaste() {
    requestAnimationFrame(() => {
      //inputRef.scrollTop = inputRef.scrollHeight;
      adjustTextareaHeight();
    });
  }

  function addRecentSearch(term: string) {
    const now = Date.now();
    recentSearches = [
      { term, timestamp: now },
      ...recentSearches
        .filter((t) => t.term !== term)
        .slice(0, MAX_HISTORY - 1),
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
  }

  function loadRecentSearches() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as typeof recentSearches;
      const now = Date.now();
      recentSearches = parsed.filter(
        (entry) => now - entry.timestamp < MAX_AGE,
      );
    }
  }

  function clearHistory() {
    recentSearches = [];
    localStorage.removeItem(STORAGE_KEY);
  }

  function handlePointerDownOutside(event: PointerEvent) {
    if (!containerRef.contains(event.target as Node)) {
      showSuggestions = false;
    }
  }

  let mounted = false;

  onMount(() => {
    loadRecentSearches();
    document.addEventListener("pointerdown", handlePointerDownOutside);
    mounted = true;
    return () =>
      document.removeEventListener("pointerdown", handlePointerDownOutside);
  });

  $effect(() => {
    if (!mounted || isLoading || !value.trim()) return;

    // if (useSynonyms !== prevSynonyms || useFamilies !== prevFamilies) {
    //   prevSynonyms = useSynonyms;
    //   prevFamilies = useFamilies;
    //   console.log('triggering search from effect')
    //   triggerSearch();
    // }
    const [currSynonyms, currFamilies] = searchDeps();
    const [prevSynonyms, prevFamilies] = prevDeps;

    if (currSynonyms !== prevSynonyms || currFamilies !== prevFamilies) {
      prevDeps = [currSynonyms, currFamilies];
      triggerSearch();
    }
  });
</script>

<div class="search-container" bind:this={containerRef}>
  <div
    class="search-box"
    class:with-suggestions={showSuggestions && recentSearches.length}
  >
    <textarea
      id="searchtext"
      bind:this={inputRef}
      bind:value
      rows="1"
      onkeydown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          triggerSearch();
        }
      }}
      onfocus={() => {
        onFocusInput();
        adjustTextareaHeight();
      }}
      onpaste={handlePaste}
      placeholder="Search anything..."
    ></textarea>

    {#if value}
      <button class="clear-btn" onclick={clearInput} aria-label="Clear input"
        >✕</button
      >
    {/if}

    <button
      onclick={() => triggerSearch()}
      disabled={isLoading}
      aria-label="Submit search"
    >
      {#if isLoading}
        <span class="loader" aria-hidden="true"></span>
      {:else}
        🔍
      {/if}
    </button>

    {#if showSuggestions && recentSearches.length}
      <div class="suggestions">
        {#each recentSearches as entry (entry.term)}
        <a
        href="/#"
        role="button"
              onclick={() => {
                value = entry.term;
                triggerSearch(entry.term);
              }}
            >
          <span class="suggestion">
            
              {entry.term}
            
          </span>
          </a>
        {/each}
        <button class="clear-history" onclick={clearHistory}
          >Clear History</button
        >
      </div>
    {/if}
  </div>

  <div class="toggles">
    <label class="switch">
      <input type="checkbox" bind:checked={useSynonyms} />
      <span class="slider"></span>
      <span class="label-text">Use Synonyms</span>
    </label>

    <label class="switch">
      <input type="checkbox" bind:checked={useFamilies} />
      <span class="slider"></span>
      <span class="label-text">Use Families</span>
    </label>
  </div>
</div>

<style>
  .search-container {
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    box-sizing: border-box;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #dfe1e5;
    border-radius: 24px;
    padding: 0.5rem 1rem;
    background: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    flex-direction: row;
    gap: 0.25rem;
    transition: border-radius 0.3s ease;
  }

  .search-box.with-suggestions {
    border-radius: 24px 24px 0 0;
  }

  textarea {
    flex-grow: 1;
    resize: none;
    overflow-y: auto;
    font-size: 1rem;
    line-height: 1.4;
    font-family: inherit;
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
    max-height: 14rem; /* approx. 10 rows */
    box-sizing: border-box;
  }

  textarea::placeholder {
    color: #9aa0a6;
  }

  .clear-btn {
    position: absolute;
    right: 2.5rem;
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #5f6368;
    cursor: pointer;
    margin-right: 0.2rem;
  }

  button {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #5f6368;
  }

  button:disabled {
    color: #c0c0c0;
    cursor: default;
  }

  .loader {
    border: 3px solid #ccc;
    border-top: 3px solid #4285f4;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #dadce0;
    border-radius: 0 0 24px 24px;
    background: white;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    width: 100%;
  }

  .suggestions > a {
    text-decoration: none;
    color: inherit;
  }

  .suggestion {
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: block;
  }

  .suggestion:hover,
  .suggestion:focus {
    background-color: #f1f3f4;
  }

  .clear-history {
    display: block;
    text-align: center;
    padding: 0.5rem;
    background: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    border-radius: 0 0 24px 24px;
    width: 100%;
    color: #666;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .toggles {
    margin-top: 0.75rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }

  .switch {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 0.5rem;
    font-size: 0.95rem;
  }

  .switch input {
    display: none;
  }

  .slider {
    position: relative;
    width: 40px;
    height: 20px;
    background: #ccc;
    border-radius: 20px;
    transition: background 0.3s;
  }

  .slider::before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    top: 1px;
    left: 1px;
    transition: transform 0.3s;
  }

  input:checked + .slider {
    /* background: #4caf50; */
    background: linear-gradient(90deg, #ff8a00, #e52e71, #9b00ff);
  }

  input:checked + .slider::before {
    transform: translateX(20px);
  }

  .label-text {
    font-size: 0.9rem;
    color: #333;
  }
</style>
