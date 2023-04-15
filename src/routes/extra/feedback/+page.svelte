<script>
    let feedback = {
      name: '',
      email: '',
      message: ''
    };
  
    function handleSubmit() {
      // Handle form submission
    }
  </script>
  
  <h1>Feedback</h1>
  
  <p>We would love to hear your feedback on our program store. Please fill out the form below to let us know what you think!</p>
  
  <form on:submit|preventDefault={handleSubmit} class="flex p-2 flex-col bg-[#eee] border-[1px] border-[#aaa]">
    <label>
      Name:
      <input class="p-1 w-full border-[1px] border-[#aaa] " type="text" bind:value={feedback.name} required />
    </label>
  
    <label>
      Email:
      <input class="p-1 w-full border-[1px] border-[#aaa]" type="email" bind:value={feedback.email} required />
    </label>
  
    <label >
      Message:
      <textarea class="p-1 w-full border-[1px] border-[#aaa] " bind:value={feedback.message} required></textarea>
    </label>
  
    <button class="w-full p-1 border-[1px] border-[#aaa] hover:bg-[#ccc]" type="submit">Submit Feedback</button>
  </form>

  <style>
    *{
        margin: .25rem;
    }
    h1{
        font-weight: bold;
    }
</style>