// src/api/orders.js
export const placeOrder = async (order) => {
  try {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    // Check if the response is not OK
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || `Server error: ${res.status}`,
        error: errorData?.error || null,
      };
    }

    // If successful, return the data
    const data = await res.json();
    return data;

  } catch (err) {
    console.error("Error placing order:", err);
    return {
      success: false,
      message: "Failed to connect to the server. Please try again.",
      error: err.message,
    };
  }
};
