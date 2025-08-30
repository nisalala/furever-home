import React, { useState } from "react";

function PreferencePage({ user, setUser, token }) {
  const initialPreferences = user?.preferences || {};

  const [species, setSpecies] = useState(initialPreferences.species || []);
  const [breed, setBreed] = useState((initialPreferences.breed || []).join(", "));
  const [size, setSize] = useState(initialPreferences.size || []);
  const [ageMin, setAgeMin] = useState(initialPreferences.ageRange?.min || 0);
  const [ageMax, setAgeMax] = useState(initialPreferences.ageRange?.max || 240);
  const [weightMin, setWeightMin] = useState(initialPreferences.weightRange?.min || 0);
  const [weightMax, setWeightMax] = useState(initialPreferences.weightRange?.max || 50);
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

    // Validation
    if (species.length === 0) return alert("Select at least one species.");
    if (breed.trim() === "") return alert("Enter at least one breed.");
    if (size.length === 0) return alert("Select at least one size.");
    if (ageMin < 0 || ageMax < ageMin) return alert("Invalid age range.");
    if (weightMin < 0 || weightMax < weightMin) return alert("Invalid weight range.");

    const preferences = {
      species,
      breed: breed.split(",").map((b) => b.trim()),
      size,
      ageRange: { min: ageMin, max: ageMax },
      weightRange: { min: weightMin, max: weightMax },
      vaccinated
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
      console.error(err);
      alert("Failed to save preferences");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Set Your Preferences</h2>

        {/* Species */}
        <div className="mb-4">
          <label className="font-medium">Species</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {["Dog", "Cat", "Rabbit", "Bird", "Other"].map(s => (
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
            className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
            placeholder="e.g., Labrador, Beagle"
          />
        </div>

        {/* Size */}
        <div className="mb-4">
          <label className="font-medium">Size</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {["Small", "Medium", "Large"].map(s => (
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
              onChange={e => setAgeMin(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded px-3 py-2 mt-2"
              min={0}
            />
          </div>
          <div>
            <label className="font-medium">Max Age (months)</label>
            <input
              type="number"
              value={ageMax}
              onChange={e => setAgeMax(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded px-3 py-2 mt-2"
              min={ageMin}
            />
          </div>
        </div>

        {/* Weight */}
        <div className="mb-4 flex gap-4">
          <div>
            <label className="font-medium">Min Weight (kg)</label>
            <input
              type="number"
              value={weightMin}
              onChange={e => setWeightMin(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded px-3 py-2 mt-2"
              min={0}
            />
          </div>
          <div>
            <label className="font-medium">Max Weight (kg)</label>
            <input
              type="number"
              value={weightMax}
              onChange={e => setWeightMax(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded px-3 py-2 mt-2"
              min={weightMin}
            />
          </div>
        </div>

        {/* Vaccinated */}
        <div className="mb-6">
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

        <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium w-full">
          Save Preferences
        </button>
      </form>
    </div>
  );
}

export default PreferencePage;
