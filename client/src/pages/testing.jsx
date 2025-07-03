import React from "react";
import { getAdoptionLikelihood } from "../api/ml";

function PetDetails({ pet }) {
    
  const handleCheckLikelihood = async () => {
    try {
      const result = await getAdoptionLikelihood({
  PetType: "Dog",
  Breed: "Labrador",
  AgeMonths: 12,
  Color: "Black",
  Size: "Medium",
  WeightKg: 20,
  Vaccinated: 1,
  HealthCondition: 0,
  TimeInShelterDays: 15,
  AdoptionFee: 50,
  PreviousOwner: 1,
});

      alert(`Adoption Likelihood: ${result.adoption_likelihood}`);
    } catch (error) {
      alert("Prediction failed");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      {/* Pet info here */}
      <h2 className="text-xl font-bold">Buddy</h2>
      <p>Dog · 12 months</p>

      <button
        onClick={handleCheckLikelihood}
        className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
      >
        Check Adoption Likelihood
      </button>
    </div>
  );
}

export default PetDetails;
