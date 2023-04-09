<script>
    import { onMount } from 'svelte';
    import { pageindex } from '../../stores/prog';
    import showdown from 'showdown';
    export let data;
    onMount(()=>{
        pageindex.set([true,false,false,false])
    })
    const converter=new showdown.Converter();
    const markdown=converter.makeHtml(data.readme);
</script>
<p class="text-center capitalize text-lg mt-1 underline">{data.title}</p>
<div class="flex justify-center p-2">
    <img src={data.image} alt="" height="300px" width="300px" srcset="">
</div>

<section class="p-2">
    {@html markdown}
</section>

<style>
    img{
        border: 2px #bbb solid;
    }
</style>