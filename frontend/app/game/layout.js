import "../globals.css";
import 'leaflet/dist/leaflet.css';

export default function RootLayout({ children }) {
  return (



    <div className="game-layout">
      {children}
    </div>


  );
}
