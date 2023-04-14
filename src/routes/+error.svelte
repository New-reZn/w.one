<script>

	import { goto } from "$app/navigation";

</script>
<div class="bg-zinc-700 w-full h-full grid items-center justify-center text-xl">
    <div class="flex flex-col text-center text-white font-thin">
        <p  class="font-semibold text-red-600">
            Error 404
        </p>
        <button on:click={()=>{goto('/')}}>
            Page not exist... 🧩
        </button>
    </div>
</div>