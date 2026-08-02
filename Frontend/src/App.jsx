import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3500,

          style: {
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "15px",
          },

          success: {
            iconTheme: {
              primary: "#2563eb",
              secondary: "#ffffff",
            },
          },

          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <AppRoutes />
    </>
  );
}

export default App;