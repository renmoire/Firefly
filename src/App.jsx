import Hero from "./components/Hero";
import Moments from "./components/Moments";
import Appearances from "./components/Appearances";

// App.jsx sengaja dibuat tipis — hanya menyusun urutan section.
// Semua logic dan tampilan detail ada di masing-masing komponennya sendiri.
// Ini yang dimaksud "component-based": tiap bagian halaman jadi unit mandiri
// yang bisa kamu pindah, hapus, atau duplikasi tanpa merusak bagian lain.
function App() {
  return (
    <main>
      <Hero />
      <Moments />
      <Appearances />
    </main>
  );
}

export default App;
