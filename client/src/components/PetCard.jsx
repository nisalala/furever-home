import { useState } from "react";
import React, { useState, useEffect } from 'react';
import { Heart, MapPin} from 'lucide-react';


const PetCard = ({ pet, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
          <div className="text-right text-sm">
            <div className="text-amber-600 font-medium">{pet.age} {pet.age === 1 ? 'year' : 'years'}</div>
            <div className="text-gray-500">{pet.gender}</div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">{pet.breed}</span>
            <span className="mx-2">•</span>
            <span>{pet.size}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{pet.location}</span>
          </div>
          
          <div className="text-xs text-amber-600 font-medium">
            {pet.shelterName}
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-2">
          {pet.description}
        </p>
        
        <button
          onClick={() => onViewDetails(pet)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          Meet {pet.name}
        </button>
      </div>
    </div>
  );
};

export default PetCard;