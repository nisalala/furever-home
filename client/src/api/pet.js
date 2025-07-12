export async function fetchAllPets() {
  try {
    const response = await fetch("http://localhost:5002/api/pets");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch pets:", error);
    return [];
  }
}
