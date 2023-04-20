import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    setResult("");
    let i = 5;
    let listOfResponses = [];
    let timeOut = 20;

    while (i > 0 && timeOut > 0) {
      timeOut--;
      
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
        str = str.trim();
        let actualStr = str;
        if (str.startsWith('Response:')) {
          console.log("Removing Response");
          actualStr = str.slice('Response:'.length);
        } 
        actualStr = actualStr.trim();
        if (str.startsWith('"') && str.endsWith('"')) {
          console.log("Removing quotes");
          actualStr = str.slice(1, -1);
        }
        actualStr = actualStr.trim();
        console.log("Actual: " + actualStr);
        if (!listOfResponses.includes(actualStr)) {
          i--;
          console.log("Adding it to the list of responses");
          listOfResponses.push(actualStr)
        } else {
          console.log("AVOIDING DUPLICATE")
        }
      } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      }
    } 
    setResult(listOfResponses.join(", "));
    console.log("list");
    console.log(listOfResponses);
    console.log("response");
    console.log(result);
    setSearchQuery("");
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
