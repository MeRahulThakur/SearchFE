<script lang="ts">
    import type { Snippet } from "svelte";

  interface IHeader {
    title?: string;
    children?: Snippet | undefined;
  }
  let { title = "AppTitle", children} : IHeader= $props();

</script>

<header class="header">
  <a href="/" class="title" aria-label="App Title">{title}</a>
  {@render children?.()}
</header>

<style>
  .header {
    padding: 0.6rem 1rem;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(90deg, #ff8a00, #e52e71, #9b00ff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>