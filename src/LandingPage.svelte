<script lang="ts">
  import SearchBox from './components/SearchBox.svelte';
  import Footer from './components/Footer.svelte';

  interface ILandingPage {
    value: string;
    isLoading: boolean;
    onSearch: (query: string, useSynonyms: boolean, useFamilies: boolean) => void;
  }

  let { value = "", isLoading = false, onSearch} : ILandingPage = $props();
</script>

<div class="landing-container">
  <h1 class="logo">Better Search</h1>
  <SearchBox bind:value onSearch={onSearch} {isLoading} />
  <Footer />
</div>

<style>
  .landing-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    font-family: 'Roboto', Arial, sans-serif;
    padding: 0 1rem;
    /* color: #202124; */
  }

  .logo {
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
    color: #4285f4; /* Google's blue */
    user-select: none;
    font-size: 3.8rem;
    font-weight: bold;
    background: linear-gradient(90deg, #ff8a00, #e52e71, #9b00ff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
