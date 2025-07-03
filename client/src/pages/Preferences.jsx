import React, { useState } from "react";

function PreferencePage({ user, setUser, token }) {
  const initialPreferences = user?.preferences || {};
  

  const [species, setSpecies] = useState(initialPreferences.species || []);
  const [breed, setBreed] = useState((initialPreferences.breed || []).join(", "));
  const [size, setSize] = useState(initialPreferences.size || []);
  const [ageMin, setAgeMin] = useState(initialPreferences.ageRange?.min || 0);
  const [ageMax, setAgeMax] = useState(initialPreferences.ageRange?.max || 20);
  const [gender, setGender] = useState(initialPreferences.gender || []);
  const [vaccinated, setVaccinated] = useState(initialPreferences.vaccinated || false);

  const toggleSelection = (value, currentState, setState) => {
    setState(
      currentState.includes(value)
        ? currentState.filter((v) => v !== value)
        : [...currentState, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const preferences = {
      species,
      breed: breed.split(",").map((b) => b.trim()),
      size,
      ageRange: { min: ageMin, max: ageMax },
      gender,
      vaccinated,
    };

    try {
      const res = await fetch("http://localhost:5002/api/users/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      setUser(data.user);
      alert("✅ Preferences saved!");
    } catch (err) {
      console.error("❌ Error saving:", err);
      alert("Failed to save preferences");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="p-4 max-w-lg mx-auto bg-white rounded shadow"
      >
        <h2 className="text-xl font-semibold mb-4">Set Your Preferences</h2>

        {/* Species */}
        <div className="mb-4">
          <label className="font-medium">Species</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {["Dog", "Cat", "Bird", "Rabbit", "Fish"].map((s) => (
              <label key={s} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={species.includes(s)}
                  onChange={() => toggleSelection(s, species, setSpecies)}
                  className="mr-2"
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* Breed */}
        <div className="mb-4">
          <label className="font-medium">Breed (comma separated)</label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </div>

        {/* Size */}
        <div className="mb-4">
          <label className="font-medium">Size</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {["Small", "Medium", "Large"].map((s) => (
              <label key={s} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={size.includes(s)}
                  onChange={() => toggleSelection(s, size, setSize)}
                  className="mr-2"
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* Age */}
        <div className="mb-4 flex gap-4">
          <div>
            <label className="font-medium">Min Age (months)</label>
            <input
              type="number"
              value={ageMin}
              onChange={(e) => setAgeMin(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded px-3 py-2 mt-1"
              min={0}
            />
          </div>
          <div>
            <label className="font-medium">Max Age (months)</label>
            <input
              type="number"
              value={ageMax}
              onChange={(e) => setAgeMax(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded px-3 py-2 mt-1"
              min={ageMin}
            />
          </div>
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="font-medium">Gender</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {["Male", "Female", "Unknown"].map((g) => (
              <label key={g} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={gender.includes(g)}
                  onChange={() => toggleSelection(g, gender, setGender)}
                  className="mr-2"
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        {/* Vaccinated */}
        <div className="mb-4">
          <label className="inline-flex items-center font-medium">
            <input
              type="checkbox"
              checked={vaccinated}
              onChange={() => setVaccinated(!vaccinated)}
              className="mr-2"
            />
            Only show vaccinated pets
          </label>
        </div>

        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded font-medium"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
}

export default PreferencePage;
