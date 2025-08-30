export async function getAdoptionLikelihood(petData) {
  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ML prediction:", error);
    throw error;
  }
}

export async function getBatchAdoptionLikelihood(petsData) {
  try {
    const response = await fetch("http://127.0.0.1:8000/predict_batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pets: petsData }) // ✅ wrap the array here
    });

    if (!response.ok) {
      const errorText = await response.text(); // log server error
      console.error("Server rejected payload:", errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching batch ML predictions:", error);
    throw error;
  }
}



