import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/common.style.css";
import './style/switch.style.css';
import AppLayout from "./layout/AppLayout";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AppLayout>
      <AppRouter />
    </AppLayout>
  );
}

export default App;
