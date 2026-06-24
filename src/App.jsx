import { useState } from "react";
import Hero from "./components/Hero";
import Moments from "./components/Moments";
import Appearances from "./components/Appearances";
import AudioPlayer from "./components/AudioPlayer";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  // "loading" → "morphing" → "done"
  const [stage, setStage] = useState("loading");

  return (
    <>
      {/* <main> selalu di-DOM supaya .hero__title bisa diukur.
          Background gelap selama belum "done" supaya tidak ada flash putih. */}
      <main
        style={{
          visibility: stage === "done" ? "visible" : "hidden",
          // Kunci: background sama dengan loading screen selama hidden,
          // jadi kalau ada pixel yang bocor, warnanya konsisten.
          background: stage === "done" ? "" : "#0b0907",
        }}
      >
        <Hero />
        <Moments />
        <Appearances />
        <AudioPlayer />
      </main>

      {/* Loading screen tetap di-render sampai stage "done"
          supaya tidak ada gap antara morph selesai dan main visible */}
      {stage !== "done" && (
        <LoadingScreen
          onMorphStart={() => setStage("morphing")}
          onDone={() => setStage("done")}
        />
      )}
    </>
  );
}

export default App;