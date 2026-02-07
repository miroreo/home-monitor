<script lang="ts">
    export let cardTitle = "";
    export let cardText = "";
</script>
<div class="card">
    <h2>{cardTitle}</h2>
    <p>{cardText}</p>
</div>
<style lang="postcss">
    @import 'tailwindcss';
    @plugin '@tailwindcss/forms';
    @plugin '@tailwindcss/typography';
    h2 {
        @apply font-bold text-xl;
    }
    p {
        @apply text-center text-6xl;
    }
    .card {
        @apply m-2 p-5 bg-gray-800 rounded-2xl flex flex-col gap-y-2;
    }
</style>
