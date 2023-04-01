
<script>
    export let comment="";
    export let likes=0;
    export let dislikes=0;
</script>

<div class="come">
    <div class="come">
        {comment}
    </div>
    <div class="flex w-full ml-1">
        <button>like:{likes}</button>
        <button>dislike:{dislikes}</button>
    </div>
</div>

<style>
    .come{
        border: 1px #aaa solid;
        margin: 0.15rem;
        padding: 0.25rem;    
    }
    button{
        border: 1px #aaa solid;
        padding: 0.15rem;
        background-color: #eee;
        cursor: pointer;
    }
    button:hover{
        background-color: #ddd;
    }
    button:active{
        background-color: #bbb;
    }
</style>