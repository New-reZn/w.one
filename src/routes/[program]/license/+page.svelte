<script lang="ts">
    import { onMount } from 'svelte';
    import { pageindex } from '../../../stores/prog';
    onMount(()=>{
        pageindex.set([false,false,true,false])
    })
    export let data;

</script>

<section class="p-2">
    {data.program}
</section>