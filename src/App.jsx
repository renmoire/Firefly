import { useState } from "react";
import Hero from "./components/Hero";
import Moments from "./components/Moments";
import Appearances from "./components/Appearances";
// import AudioPlayer from "./components/AudioPlayer";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);

  return (
    <>
      <main className={mainVisible ? "main--visible" : "main--hidden"}>
        <Hero />
        <Moments />
        <Appearances />
        {/* <AudioPlayer /> */}
      </main>

      {showLoading && (
        <LoadingScreen
          onFadeOutStart={() => setMainVisible(true)}
          onDone={() => setShowLoading(false)}
        />
      )}
    </>
  );
}

export default App;