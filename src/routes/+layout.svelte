<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" />
</svelte:head>

{@render children()}
