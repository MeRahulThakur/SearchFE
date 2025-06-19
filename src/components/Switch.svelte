<script lang="ts">
  import { searchParams } from "../store/state";
  import type { ISearchParams } from "../store/state";

  interface SwitchProps {
    param: keyof ISearchParams;
    label: string;
    size?: "small" | "medium" | "large";
  }

  let { param, label, size = "medium" }: SwitchProps = $props();

  let checked = $state($searchParams[param]);

  $effect(() => {
    checked = $searchParams[param];
  });

  function toggle() {
    searchParams.update((sp) => ({
      ...sp,
      [param]: !sp[param],
    }));
  }
</script>

<label class={`switch ${size}`}>
  <input type="checkbox" bind:checked onchange={toggle} />
  <span class="slider"></span>
  <span class="label-text">{label}</span>
</label>

<style>
  .switch {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    gap: 0.5rem;
    font-size: 0.95rem;
    position: relative;
  }

  .switch input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    display: inline-block;
    position: relative;
    background: #ccc;
    border-radius: 20px;
    transition: background 0.3s;
    cursor: pointer;
    outline: none;
  }

  /* Default dimensions = medium */
  .switch.medium .slider {
    width: 40px;
    height: 20px;
  }

  .switch.medium .slider::before {
    width: 18px;
    height: 18px;
    top: 1px;
    left: 1px;
  }

  .switch.small .slider {
    width: 30px;
    height: 16px;
  }

  .switch.small .slider::before {
    width: 14px;
    height: 14px;
    top: 1px;
    left: 1px;
  }

  .switch.large .slider {
    width: 50px;
    height: 26px;
  }

  .switch.large .slider::before {
    width: 24px;
    height: 24px;
    top: 1px;
    left: 1px;
  }

  input:checked + .slider {
    background: linear-gradient(90deg, #ff8a00, #e52e71, #9b00ff);
  }

  input:checked + .slider::before {
    /* transform: translateX(20px); */
    transform: translateX(calc(100% - 1px));
  }

  .slider::before {
    content: "";
    position: absolute;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s;
  }

  input:focus + .slider {
    box-shadow: 0 0 0 3px rgba(21, 156, 228, 0.4);
  }

  .label-text {
    font-size: 0.9rem;
    color: #333;
  }
</style>
