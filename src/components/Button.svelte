<script lang="ts">
    import type { Snippet } from "svelte";

  interface IButton {
    onClick: () => void;
    ariaLabel: string;
    children: Snippet | undefined;
  }
  let {onClick, ariaLabel = '', children}: IButton = $props();
</script>

<button onclick={onClick} aria-label={ariaLabel} class="custom-button">
  {@render children?.()}
</button>

<style>
  .custom-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    background-color: #4285f4;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .custom-button:hover {
    background-color: #3367d6;
  }
</style>