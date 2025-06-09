<script lang="ts">
  import { onMount, onDestroy, type Snippet } from "svelte";
  import { fade, fly } from "svelte/transition";

  interface ISidebar {
    open: boolean;
    onClose: () => void;
    children: Snippet | undefined;
  }

  let { open = false, onClose, children }: ISidebar = $props();

  let sidebarRef = $state<HTMLDivElement | null>(null);

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      onClose();
    }

    if (event.key === "Tab" && sidebarRef) {
      const focusableSelectors = [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ];
      const focusableElements = Array.from(
        sidebarRef.querySelectorAll<HTMLElement>(focusableSelectors.join(",")),
      ).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeydown);

    // Focus the first focusable element after opening
    setTimeout(() => {
      const el = sidebarRef?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      el?.focus();
    }, 0);
  });

  onDestroy(() => {
    document.removeEventListener("keydown", handleKeydown);
  });
</script>

{#if open}
  <div
    class="overlay"
    transition:fade
    onclick={onClose}
    aria-hidden="true"
  ></div>
  <div
    class="sidebar"
    role="dialog"
    aria-modal="true"
    aria-label="Sidebar Menu"
    transition:fly={{ x: 300, duration: 250 }}
    bind:this={sidebarRef}
  >
    <!-- <button class="close-button" onclick={onClose} aria-label="Close sidebar">✖</button> -->
    <button
      class="circle-gradient-button"
      onclick={onClose}
      aria-label="Close sidebar">x</button
    >
    <div class="content">
      {@render children?.()}
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }

  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  .content {
    margin-top: 1rem;
  }

  .close-button {
    align-self: flex-end;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: black;
  }

  .circle-gradient-button {
    position: relative;
    width: 40px;
    height: 40px;
    background: transparent;
    color: linear-gradient(135deg, #ff6ec4, #7873f5);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    z-index: 0;
    isolation: isolate;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.3s ease;
  }

  .circle-gradient-button::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 3px; /* border thickness */
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6ec4, #7873f5);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }

  .circle-gradient-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(120, 115, 245, 0.5);
  }
</style>
