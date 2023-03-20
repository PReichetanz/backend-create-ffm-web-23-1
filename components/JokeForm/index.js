import useSWR from "swr";

export default function JokeForm() {
  const jokes = useSWR("/api/jokes");

  async function handleSubmit(event) {
    // This function needs to be an async function in order for us to be able to await promises.
    event.preventDefault();
    // This prevents the form from resetting too soon.

    const formData = new FormData(event.target);
    // Here we're creating a new formData object.
    // We could declare a const variable form beforehand containing our event.target, as well.

    // We don't necessarily need to choose the FormData/Object.fromEntries() method to extract the values from our form. It's one of many different ways.
    const jokeData = Object.fromEntries(formData);
    // We're declaring jokeData and filling it with the values we've extracted from our form via Object.fromEntries().

    const response = await fetch("/api/jokes", {
      method: "POST",
      body: JSON.stringify(jokeData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Here we're using the API route we've built earlier.
    // We're declaring a response returning a promise while we're posting to our database.
    // This promise will eventually resolve.

    // Here we're using fetch and not swr, because swr is for data fetching, and not data mutation.
    // ... but we can notify swr about data changes using the mutate function! (See below.)

    // Our method is post, the body contains our jokeData JSON, and our header provides additional
    // information about the data we're sending.

    // Our joke is on its way!

    if (response.ok) {
      // If our attempt at posting our joke is a success, we proceed here.
      await response.json();
      // At this point, the promise of response has resolved.
      jokes.mutate();
      // Now we're notifying swr that our data has been mutated, which will trigger a rerender.
      // If we don't include this line, the page won't automatically refresh and our submitted
      // joke won't be immediately visible.
      event.target.reset();
      // Here we're resetting our form.
    } else {
      console.error(`Error: ${response.status}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="joke-input">Enter a new Joke</label>
      <input type="text" id="joke-input" name="joke" />
      <button type="submit">Submit</button>
    </form>
  );
}
