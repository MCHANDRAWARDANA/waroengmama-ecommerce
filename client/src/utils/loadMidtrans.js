export const loadMidtrans = () => {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve(window.snap);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY,
    );
    script.async = true;

    script.onload = () => resolve(window.snap);
    script.onerror = () => reject(new Error("Gagal load Midtrans Snap"));

    document.body.appendChild(script);
  });
};
