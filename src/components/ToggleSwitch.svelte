<script>
  export let checked;
  export let label="";
  export let onClick;
  export let disabled=false;
</script>

<button
  aria-checked={checked.toString()}
  role="switch"
  type="button"
  aria-label={label}
  class="switch"
  on:click={onClick}
  disabled={disabled}
>
  <span class="knob" />
</button>

<style>
  .switch {
    height: 20px;
    width: 32px;
    background: #565758;
    border: none;
    border-radius: 999px;
    display: block;
    position: relative;
  }
  .knob {
    display: block;
    position: absolute;
    left: 2px;
    top: 2px;
    height: calc(100% - 4px);
    width: 50%;
    border-radius: 8px;
    background: white;
    transform: translateX(0);
    transition: transform 0.3s;
  }
  [aria-checked="true"] {
    background: var(--clr-correct);
  }
  [aria-checked="true"] > .knob {
    transform: translateX(calc(100% - 4px));
  }
</style>
