import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    let i = 5;
    let listOfResponses = [];

    while (i > 0) {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery }),
        });
  
        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }
        let str = data.result;
        let actualStr = data.result;
        if (str.startsWith('Response:')) {
          console.log("Removing Response");
          actualStr = str.slice('Response:'.length);
        } else if (str.startsWith('"') && str.endsWith('"')) {
          console.log("Removeing quotes");
          actualStr = str.slice(1, -1);
        }
        console.log("Actual: " + actualStr);
        if (!listOfResponses.includes(actualStr)) {
          i--;
          console.log("Adding it to the list of responses");
          listOfResponses.push(actualStr)
        }
      } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    setResult(listOfResponses.join());
    console.log("list");
    console.log(listOfResponses);
    console.log("response");
    console.log(result);
    setSearchQuery("");
  } 
}

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Give Me Recipes</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="query"
            placeholder="Something for dinner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
