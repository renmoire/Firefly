import { useState } from "react";
import Hero from "./components/Hero";
import Moments from "./components/Moments";
import Appearances from "./components/Appearances";
import AudioPlayer from "./components/AudioPlayer";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  // "loading" → "revealing" → "done"
  const [stage, setStage] = useState("loading");

  return (
    <>
      {stage !== "loading" && (
        <main className={stage === "done" ? "is-visible" : ""}>
          <Hero />
          <Moments />
          <Appearances />
          <AudioPlayer />
        </main>
      )}

      {stage !== "done" && (
        <LoadingScreen
          fadeOut={stage === "revealing"}
          onFadeOutStart={() => setStage("revealing")}
          onDone={() => setStage("done")}
        />
      )}
    </>
  );
}

export default App;