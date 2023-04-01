<script lang="ts">
    import { pageindex } from "../../stores/prog";
    export let data;
</script>

<section class="flex text-xs">
    <a href="/{data.program}" class="{$pageindex[0]?'activebtn':''}">Home</a>
    <a href="/{data.program}/download" class="{$pageindex[1]?'activebtn':''}">Download</a>
    <a href="/{data.program}/license" class="{$pageindex[2]?'activebtn':''}">License</a>
    <a href="/{data.program}/community" class="{$pageindex[3]?'activebtn':''}">Community</a>
</section>  
<section class="m">
    <slot/>
</section>

<style>
    a{
        padding: 0.25rem;
        padding-left: .3rem;
        padding-right: .3rem;
        border-left: 1px #ccc solid;
        border-right: 1px #ccc solid;
        text-decoration: none;
        color:black;
    }
    a:hover{
        background-color: #ddd;
        text-decoration: none;
    }
    a:visited{
        color:black;
    }
    
    .activebtn{
        background-color: #eee;
    }

    .m{
        border-top: 1px #ccc solid;
    }
</style>