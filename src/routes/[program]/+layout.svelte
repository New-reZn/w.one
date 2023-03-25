<script lang="ts">
    let btractar=[true,false,false,false]
</script>

<section class="flex">
    <button class="{btractar[0]?'activebtn':''}">home</button>
    <button class="{btractar[1]?'activebtn':''}">download</button>
    <button class="{btractar[2]?'activebtn':''}">license</button>
    <button class="{btractar[3]?'activebtn':''}">community</button>
</section>  
<section class="m">
    <slot/>
</section>

<style>
    button{
        padding: 0.25rem;
        padding-left: .3rem;
        padding-right: .3rem;
        border-left: 1px #ccc solid;
        border-right: 1px #ccc solid;
    }
    button:hover{
        background-color: #ddd;
    }
    
    .activebtn{
        background-color: #eee;
    }

    .m{
        border-top: 1px #ccc solid;
    }
</style>