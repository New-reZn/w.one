<script lang="ts">
    let title:String;
    let oneline:String;
    let downloads:number;
    let likes:number;
    let imageSrc:string;
    let link:string;

    interface FormatOptions {
        digitsLimit?: number;
        digitsAfterDecimal?: number;
        decimalSeparator?: string;
        thousandSeparator?: string;
        abbreviations?: string[];
    }

    function formatNumber(num: number, options: FormatOptions = {}): string {
        if(!num){
            return '0';
        }
        const {
            digitsLimit = Infinity,
            digitsAfterDecimal = 0,
            decimalSeparator = ".",
            thousandSeparator = ",",
            abbreviations = ["", "K", "M", "B", "T", "Q", "Qu", "S", "O", "N", "D"],
        } = options;

        const magnitude = Math.floor(Math.log10(Math.abs(num)) / 3);
        const abbreviation = abbreviations[magnitude];
        const shortNum = num / Math.pow(10, magnitude * 3);

        const roundedNum = shortNum.toFixed(digitsAfterDecimal);

        const [wholePart, decimalPart] = roundedNum.split(".");

        const truncatedWholePart = wholePart.slice(0, digitsLimit);

        if (num >= 1e15) {
            return `${(num / 1e15).toFixed(digitsAfterDecimal)}${thousandSeparator}${abbreviations[10]}+`;
        } else if (abbreviation) {
            return `${truncatedWholePart}${decimalSeparator}${decimalPart}${thousandSeparator}${abbreviation}`;
        } else {
            return `${truncatedWholePart}${decimalSeparator}${decimalPart}`;
        }
    }
    export {title,oneline,downloads,likes,imageSrc,link};    
</script>
{#if link!=undefined}
    
<a href="/{link}">
    <div class="m-1 p-2 card cursor-pointer">
        {#if imageSrc!=''}
            <img src={imageSrc.replace('static','')} width="300px" height="300px" alt="">
            {:else}
            <img src="../noimage.png" width="300px" height="300px" alt="">            
        {/if}
        
        <div>
            <p class="text-sm truncate w-full">{title}</p>
            <p class="text-xs truncate w-full">{oneline}</p>
            <div class="grid grid-cols-2 text-xs items-center">
                <div class="flex items-center space-x-1">
                    <img src="downloads.svg" width="16px" height="16px" alt="" srcset="">
                    <p>{formatNumber(downloads,{digitsLimit: 8, digitsAfterDecimal: 1})}</p>
                </div>
                <div class="flex items-center space-x-1">
                    <img src="like.svg" width="16px" height="16px" alt="" srcset="">
                    <p class="">{formatNumber(likes,{digitsLimit: 8, digitsAfterDecimal: 1})}</p>
                </div>
            </div>
        </div>
    </div>
</a>
{/if}
<style>
    .card{
        border: 1px #ccc solid;
    }
    .card:hover{
        background-color: #eee;
    }
    .card:active{
        background-color: #ddd;
    }
    p{
        color:black;
        text-decoration: none;
    }
    a:hover{
        text-decoration: none;
    }
</style>