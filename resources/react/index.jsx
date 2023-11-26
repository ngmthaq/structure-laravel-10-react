import React, { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const app = document.getElementById("app");

const Container = () => {
  return import.meta.env.DEV ? (
    <Fragment>
      <App />
    </Fragment>
  ) : (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
  cluster: "ap1",
});

const channel = pusher.subscribe("public-channel");
channel.bind("reservation-created-event", function (data) {
  console.log(data.message);
  window.dispatchEvent(new CustomEvent("reservation-created-event", { detail: data.session_id }));
});

if (app) {
  createRoot(app).render(<Container />);
}
