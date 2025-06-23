const PetCard = ({ pet }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-accent hover:scale-105 transition-transform w-72">
      <img
        src={pet.images[0] || "/placeholder-pet.png"}
        alt={pet.name}
        className="rounded-xl h-48 w-full object-cover"
      />
      <h3 className="text-primary text-xl font-semibold mt-2">{pet.name}</h3>
      <p className="text-sm text-textDark">{pet.breed} • {pet.age} yrs • {pet.gender}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {pet.traits?.map((trait, index) => (
          <span
            key={index}
            className="bg-accent text-xs px-2 py-1 rounded-full text-textDark"
          >
            {trait}
          </span>
        ))}
      </div>
      <button className="mt-4 bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary transition">
        Adopt Me
      </button>
    </div>
  );
};

export default PetCard;
